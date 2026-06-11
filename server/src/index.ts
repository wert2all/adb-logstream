import { createServer } from "http";
import { WebSocketServer } from "ws";

const PORT = 3000;

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ADB Logcat Server");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "status", message: "Connected" }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
