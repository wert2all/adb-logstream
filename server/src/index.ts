import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { spawn, ChildProcess } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";

const PORT = 3000;
const CLIENT_DIR = join(__dirname, "..", "..", "client");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".ts": "application/javascript",
};

// === HTTP Static Server ===
const server = createServer((req, res) => {
  const url = req.url || "/";
  let filePath: string;

  if (url === "/") {
    filePath = join(CLIENT_DIR, "index.html");
  } else {
    filePath = join(CLIENT_DIR, url);
  }

  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  const ext = extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// === WebSocket Broadcast ===
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

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
const HEADER_REGEX = /^\[\s*([\d-]+\s+[\d:.]+)\s+(\d+):(\d+)\s+([VDIWEF])\/(\S+)\s*\]$/;

interface LogcatEntry {
  timestamp: string;
  pid: string;
  tid: string;
  level: string;
  tag: string;
  message: string;
}

let currentEntry: LogcatEntry | null = null;
let bodyLines: string[] = [];

function emitEntry(): void {
  if (!currentEntry) return;
  currentEntry.message = bodyLines.join("\n");
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
      timestamp: match[1],
      pid: match[2],
      tid: match[3],
      level: match[4],
      tag: match[5],
      message: "",
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

// === Graceful Shutdown ===
function shutdown(): void {
  isShuttingDown = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (adbProcess && !adbProcess.killed) {
    adbProcess.kill();
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
  console.log(`Server running at http://localhost:${PORT}`);
  startAdb();
});
