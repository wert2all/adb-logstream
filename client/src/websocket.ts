import { state, ConnectionStatus, LogstreamEntry } from "./state";
import { appendEntry } from "./render";

const WS_URL = "ws://localhost:3000";
const RECONNECT_DELAY = 3000;

let ws: WebSocket | null = null;
let reconnectTimer: number | null = null;
let wasDisconnected = false;

const statusDot = document.getElementById("status-dot") as HTMLSpanElement;
const statusText = document.getElementById("status-text") as HTMLSpanElement;
const banner = document.getElementById("connection-banner") as HTMLDivElement;
const bannerText = document.getElementById("banner-text") as HTMLSpanElement;
const bannerDismiss = document.getElementById(
  "banner-dismiss",
) as HTMLButtonElement;

export function connect(): void {
  if (ws) {
    return;
  }

  try {
    ws = new WebSocket(WS_URL);
  } catch (err) {
    console.error("Failed to create WebSocket:", err);
    scheduleReconnect();
    return;
  }

  ws.onopen = () => {
    updateStatus("connected");
    if (wasDisconnected) {
      // Reload page on successful reconnect after disconnect
      window.location.reload();
    }
  };

  ws.onmessage = (event) => {
    handleMessage(event.data);
  };

  ws.onclose = () => {
    ws = null;
    updateStatus("disconnected");
    wasDisconnected = true;
    showBanner("Device disconnected. Reconnecting...");
    scheduleReconnect();
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
    ws?.close();
  };
}

function handleMessage(data: string): void {
  let message: unknown;
  try {
    message = JSON.parse(data);
  } catch {
    console.error("Malformed JSON received:", data);
    return;
  }

  if (!message || typeof message !== "object") {
    return;
  }

  const msg = message as Record<string, unknown>;

  if (msg.type === "entry") {
    const entry: LogstreamEntry = {
      timestamp: String(msg.timestamp || ""),
      pid: String(msg.pid || ""),
      tid: String(msg.tid || ""),
      level: String(msg.level || "I") as LogstreamEntry["level"],
      tag: String(msg.tag || ""),
      message: String(msg.message || ""),
    };
    appendEntry(entry);
  } else if (msg.type === "status") {
    const text = String(msg.message || "");
    if (text) {
      showBanner(text);
    }
  }
}

function updateStatus(status: ConnectionStatus): void {
  state.connectionStatus = status;

  statusDot.className = "w-2 h-2 rounded-full";
  statusText.className = "text-xs font-medium";

  switch (status) {
    case "connected":
      statusDot.classList.add("bg-secondary");
      statusText.classList.add("text-secondary");
      statusText.textContent = "CONNECTED";
      break;
    case "disconnected":
      statusDot.classList.add("bg-error");
      statusText.classList.add("text-error");
      statusText.textContent = "DISCONNECTED";
      break;
    case "reconnecting":
      statusDot.classList.add("bg-log-w");
      statusText.classList.add("text-log-w");
      statusText.textContent = "RECONNECTING";
      break;
  }
}

function scheduleReconnect(): void {
  if (reconnectTimer) {
    return;
  }
  updateStatus("reconnecting");
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, RECONNECT_DELAY);
}

function showBanner(text: string): void {
  bannerText.textContent = text;
  banner.classList.remove("hidden");
}

bannerDismiss.addEventListener("click", () => {
  banner.classList.add("hidden");
});

export { ws };
