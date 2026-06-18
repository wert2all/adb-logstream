#!/usr/bin/env node
import { WebSocketServer, WebSocket } from "ws";
import { spawn, ChildProcess } from "child_process";
import { v4 as uuidv4 } from "uuid";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { Socket } from "net";

const PORT = 3000;

// === Static File Serving ===
const CLIENT_DIR = path.join(__dirname, "../../client/dist/client/browser/");

if (!fs.existsSync(CLIENT_DIR)) {
  console.error(`Error: Client build directory not found at ${CLIENT_DIR}`);
  console.error("Please run `npm run build` to build the client first.");
  process.exit(1);
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveStatic(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  console.log(`${req.method} ${req.url}`);

  let filePath = path.join(
    CLIENT_DIR,
    req.url === "/" ? "index.html" : req.url || "",
  );
  const ext = path.extname(filePath).toLowerCase();

  // If the URL does not have an extension and the file does not exist, serve index.html (SPA fallback)
  if (!ext && !fs.existsSync(filePath)) {
    filePath = path.join(CLIENT_DIR, "index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for any non-file request
      const fallbackPath = path.join(CLIENT_DIR, "index.html");
      fs.readFile(fallbackPath, (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(500);
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fallbackData);
      });
      return;
    }

    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

// === HTTP + WebSocket Server ===
const server = http.createServer(serveStatic);
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();
const connections = new Set<Socket>();

server.on("connection", (conn: Socket) => {
  connections.add(conn);
  conn.on("close", () => {
    connections.delete(conn);
  });
});

function broadcast(type: string, data: Record<string, unknown>): void {
  const message = JSON.stringify({ type, ...data });
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      clients.delete(ws);
    }
  }
}

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => {
    clients.delete(ws);
  });
  ws.on("message", () => {
    // ignore client messages
  });
});

// === Log Parser ===
const HEADER_REGEX =
  /^\[\s*([\d-]+\s+[\d:.]+)\s+(\d+):\s*(\d+)\s+([VDIWEF])\/(\S+)\s*\]$/;

interface LogstreamEntry {
  uuid: string;
  timestamp: string;
  pid: string;
  tid: string;
  level: string;
  tag: string;
  message: string;
  packageName: string | null;
}

// PID → packageName map, populated by ps timer
let pidToPackageName: Map<number, string> = new Map();

let currentEntry: LogstreamEntry | null = null;
let bodyLines: string[] = [];

function emitEntry(): void {
  if (!currentEntry) return;
  currentEntry.message = bodyLines.join("\n");
  // Resolve packageName from PID map
  const pid = parseInt(currentEntry.pid, 10);
  currentEntry.packageName = pidToPackageName.get(pid) ?? null;
  broadcast("entry", { ...currentEntry });
  currentEntry = null;
  bodyLines = [];
}

function parseLine(line: string): void {
  const trimmed = line.trimEnd();
  const match = HEADER_REGEX.exec(trimmed);
  if (match) {
    // New header — emit previous entry if any
    emitEntry();
    currentEntry = {
      uuid: uuidv4(),
      timestamp: match[1],
      pid: match[2],
      tid: match[3],
      level: match[4],
      tag: match[5],
      message: "",
      packageName: null,
    };
  } else if (currentEntry) {
    bodyLines.push(trimmed);
  } else {
    // Malformed line outside an entry — skip
  }
}

// === adb Process Management ===
let adbProcess: ChildProcess | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;
let isShuttingDown = false;

function startAdb(): void {
  if (isShuttingDown) return;

  adbProcess = spawn("adb", ["logcat", "-v", "long"], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  adbProcess.stdout?.setEncoding("utf8");
  adbProcess.stderr?.setEncoding("utf8");

  let stdoutBuffer = "";
  adbProcess.stdout?.on("data", (chunk: string) => {
    stdoutBuffer += chunk;
    let newlineIdx: number;
    while ((newlineIdx = stdoutBuffer.indexOf("\n")) !== -1) {
      const line = stdoutBuffer.slice(0, newlineIdx);
      stdoutBuffer = stdoutBuffer.slice(newlineIdx + 1);
      parseLine(line);
    }
  });

  adbProcess.stderr?.on("data", (chunk: string) => {
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.trim()) {
        broadcast("status", { message: line.trim() });
      }
    }
  });

  adbProcess.on("error", (err) => {
    console.error("Failed to spawn adb:", err.message);
    process.exit(1);
  });

  adbProcess.on("close", () => {
    if (isShuttingDown) return;
    broadcast("status", { message: "Device disconnected. Reconnecting..." });
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(startAdb, 3000);
  });
}

// === PID → packageName Resolution via ps -A ===
let psTimer: NodeJS.Timeout | null = null;

function tickPs(): void {
  const ps = spawn("adb", ["shell", "ps", "-A", "-o", "PID,NAME"], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  ps.stdout?.setEncoding("utf8");
  ps.stderr?.setEncoding("utf8");

  let stdoutBuffer = "";
  ps.stdout?.on("data", (chunk: string) => {
    stdoutBuffer += chunk;
  });

  ps.on("close", (code) => {
    if (code !== 0 || isShuttingDown) return;

    // Parse output: each line is "  PID  NAME" or "PID NAME"
    const newMap: Map<number, string> = new Map();
    const lines = stdoutBuffer.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Format: PID and NAME separated by whitespace
      const spaceIdx = trimmed.indexOf(" ");
      if (spaceIdx === -1) continue;
      const pidStr = trimmed.slice(0, spaceIdx);
      const nameStr = trimmed.slice(spaceIdx + 1).trim();
      const pid = parseInt(pidStr, 10);
      if (!isNaN(pid) && nameStr) {
        newMap.set(pid, nameStr);
      }
    }
    pidToPackageName = newMap;
  });

  // On ps failure, keep existing map — newMap is only assigned on success
  ps.on("error", () => {
    // Silently ignore — stale map survives
  });
}

function startPsTimer(): void {
  if (isShuttingDown) return;
  tickPs(); // Run immediately on start
  psTimer = setInterval(tickPs, 2000);
}

// === Graceful Shutdown ===
function shutdown(): void {
  isShuttingDown = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (psTimer) clearInterval(psTimer);
  if (adbProcess && !adbProcess.killed) {
    adbProcess.kill();
  }
  // Destroy all active connections to allow the server to close immediately
  for (const conn of connections) {
    conn.destroy();
  }
  server.close(() => {
    process.exit(0);
  });
  // Force exit after 5 seconds if server doesn't close
  setTimeout(() => process.exit(0), 5000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// === Start ===
server.listen(PORT, () => {
  console.log(`adb-logstream server running at http://localhost:${PORT}`);
});
startAdb();
startPsTimer();
