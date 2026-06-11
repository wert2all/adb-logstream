# Local server with WebSocket streaming

The browser cannot execute `adb` directly, so a local Node.js server acts as a middleware: it spawns `adb logcat -v long` as a child process, parses each line into structured JSON, and broadcasts entries to all connected WebSocket clients in real time.

This approach was chosen over browser extensions with native messaging because it works in any browser without installation, and over a polling HTTP API because WebSocket provides true real-time streaming with lower overhead.

**Consequences:** The server must be running on the same machine as the `adb` daemon. Cross-device logcat viewing requires SSH tunneling or a similar proxy.

## Considered Options

- **Browser extension + native messaging** — works only in Chromium-based browsers, requires a separate extension install and native host manifest.
- **Polling HTTP endpoint** — simpler protocol but introduces latency and unnecessary request overhead for a real-time stream.
