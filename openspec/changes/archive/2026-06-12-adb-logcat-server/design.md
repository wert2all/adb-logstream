## Context

The project needs a server that bridges real-time `adb logcat` output to browser clients. Currently the server workspace has only a skeleton — a plain HTTP server that returns a text response and accepts WebSocket connections without any adb integration.

The server orchestrates four concerns in a single process:
1. Spawning and managing an `adb logcat -v long` child process
2. Parsing the line-oriented logcat output into structured JSON
3. Broadcasting entries to all connected WebSocket clients
4. Serving static client files over HTTP

The codebase uses TypeScript, Node.js with CommonJS modules, and the `ws` library (already in dependencies). The server must handle device disconnects gracefully and restart automatically.

## Goals / Non-Goals

**Goals:**
- Spawn `adb logcat -v long` on server startup and maintain the process continuously
- Parse each logcat entry in `-v long` format (header line + optional multi-line body) into structured `{ timestamp, pid, tid, level, tag, message }`
- Broadcast every parsed entry as `{ type: "entry", ... }` to all connected WebSocket clients
- Serve static files from `client/` directory over HTTP on the same port (3000)
- Accept unlimited WebSocket connections on port 3000 with no authentication
- Detect adb process exit, notify clients with a status message, wait 3 seconds, then restart automatically
- Forward any adb stderr output as `{ type: "status", message: "..." }` to all clients
- Start via `npm start` which runs `tsc` then `node dist/index.js`
- Log `Server running at http://localhost:3000` on startup

**Non-Goals:**
- Client-side rendering, filtering, or search (handled in client code, out of scope)
- Authentication, rate limiting, or connection limits
- Multiple adb instances or device selection (uses first/default device)
- Log persistence to disk or database
- HTTPS/WSS support (plain HTTP/WS only)
- Windows-specific process handling (the primary target is macOS/Linux)

## Decisions

### D1: Single Node.js process for HTTP, WebSocket, and adb management
**Decision**: Use one Node.js process with the built-in `http` module + `ws` library, managing `adb logcat` via `child_process.spawn`.

**Rationale**: This is the simplest architecture that meets all requirements. A single process avoids inter-process communication overhead, simplifies state management (one client set, one adb process reference), and keeps the dependency footprint minimal. The `ws` library is already declared in `package.json`.

**Alternatives considered**:
- **Separate HTTP + WebSocket processes behind a reverse proxy** — adds operational complexity with no benefit for this use case. The server is a local dev tool, not a production service.
- **Express.js** — popular but unnecessary for three routes. Node's built-in `http` module with manual routing is sufficient and avoids an extra dependency.

### D2: Line-by-line streaming parser
**Decision**: Parse `adb logcat -v long` output by accumulating raw lines from `stdout` and detecting entry boundaries via the header format regex.

**Rationale**: `adb logcat -v long` produces a well-defined format where each entry starts with a header line matching `[ timestamp pid: tid level/tag ]`. The body follows immediately (may be empty or multi-line). A stateful line-by-line parser is simple, memory-efficient, and adds minimal latency — each entry is parsed and broadcast as soon as the next header line is encountered (signaling the end of the current entry).

**Alternatives considered**:
- **Buffered batch parser** — waiting to accumulate N entries before parsing adds latency with no benefit.
- **Using `readline` module** — viable but adds a wrapper layer. Direct `data` event handling with manual line splitting is equally simple and gives more control over partial-line buffering.

### D3: Broadcast-all pattern for WebSocket delivery
**Decision**: On each parsed entry, iterate all connected clients and send the JSON payload to those in OPEN state. No buffering, no per-client tracking of what was sent.

**Rationale**: The data rate of `adb logcat` on a typical device (~10-100 entries/second) is well within what a single Node.js process can broadcast to dozens of clients. The broadcast-all pattern is the simplest correct approach. Per-client queue management or backpressure signals would add complexity for no demonstrated need.

**Alternatives considered**:
- **Per-client write queues** — would help with backpressure if clients are slow consumers, but adds memory tracking complexity. Not needed until profiling shows it is.
- **Topic-based pub/sub** — overkill since there's only one stream (all clients get everything).

### D4: Process exit detection via `close` event on child process
**Decision**: Use `child_process.spawn` and listen on the `close` event (which fires when the process has exited and all stdio streams are closed) to detect device disconnection. On close, notify clients and restart after 3 seconds.

**Rationale**: The `close` event is the most reliable indicator that the process has truly ended. The `exit` event can fire before stdio is fully drained, which could cause us to miss the last few log lines. Using `close` ensures we've consumed all output before restarting.

**Alternatives considered**:
- **Periodic health check `adb get-state`** — adds extra adb invocations, more complex. The process exit is a sufficient signal.
- **`error` event on the child process** — fires when spawn itself fails (e.g., adb not in PATH). Handled separately for the "adb not found" case.

### D5: Manual HTTP routing over Express.js
**Decision**: Use Node's built-in `http.createServer` with manual URL/path routing for the three static file routes (`/`, `*.html`, `*.css`, `*.js`).

**Rationale**: The server needs only 4 effective routes: 200 for `/` (serve `index.html`), 200 for static files (`style.css`, `app.js`), 200 for WebSocket upgrade path, and 404 for everything else. This is trivial to implement with a `switch` or `if/else` on `req.url`. Adding Express.js for this would add ~50KB of dependencies for marginal convenience.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| **adb not in PATH** | Server exits immediately on startup | Let the spawn `error` event propagate — fail fast with a clear error message. User installs adb and retries. |
| **Device disconnect during active use** | All clients see stale data | Auto-restart with client notification. Clients can show a reconnection indicator based on status messages. |
| **Malformed logcat line** | Parser emits partial or incorrect entry | The parser skips lines that don't match the header format and emits unknown lines with level `?`. This prevents one bad line from crashing the stream. |
| **Slow clients flood server memory** | If client consumers are slower than adb output, Node.js internal buffer grows | Start with a simple send-and-forget approach. Monitor in production; if backpressure becomes an issue, add `ws.bufferedAmount` checks or implement per-client write throttling. |
| **Long multi-line log messages** | A single entry may span many lines, delaying broadcast until the next entry's header | Acceptable — the delay is bounded by the next header line, which is typically within milliseconds. The parser correctly handles multi-line bodies. |
| **Server crash** | No graceful recovery | The server is a local dev tool. User restarts manually. Design the server to start fast (<100ms) to minimize downtime. |
