## Why

The project needs a server that bridges `adb logcat` output to browser-based clients in real time. Currently the repo has only skeleton code — an empty HTTP server with no adb integration, log parsing, or WebSocket broadcasting. Browser-based debugging of Android devices requires a live stream of structured log data, and this change delivers the server-side foundation to make that possible.

## What Changes

- **adb child process management** — spawn `adb logcat -v long` on startup, monitor for exits, auto-reconnect on device disconnect
- **Logcat entry parser** — parse the `-v long` header+body format into structured JSON (`timestamp`, `pid`, `tid`, `level`, `tag`, `message`)
- **WebSocket broadcast layer** — push every parsed entry as `{ type: "entry", ... }` to all connected clients
- **Static file server** — serve `client/` directory files over HTTP (`/` → `index.html`)
- **Connection management** — accept unlimited WebSocket connections on port 3000, no auth required
- **Stderr forwarding** — capture adb stderr and forward as status messages to clients
- **Reconnection logic** — on adb process exit, notify clients with status message, wait 3 seconds, restart
- **Graceful startup** — server logs URL on startup, `npm start` starts the server

## Capabilities

### New Capabilities
- `adb-process`: Spawn, monitor, and restart the `adb logcat -v long` child process. Includes device disconnect detection, 3-second reconnect delay, stderr capture and forwarding.
- `log-parser`: Parse each logcat entry from `-v long` format (header + multi-line body) into structured objects with fields: `timestamp`, `pid`, `tid`, `level`, `tag`, `message`.
- `entry-broadcast`: Serialize parsed log entries to JSON and broadcast (`type: "entry"`) to all connected WebSocket clients. Skip non-OPEN clients.
- `static-server`: Serve static files from the `client/` directory. Route `/` to `index.html`, other paths to matching files. Use the same port as WebSocket (3000).

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- **New Dependency**: `ws` (already in `server/package.json`), `child_process` (Node built-in)
- **Server code**: `/home/wert2all/work/adb-logcat/server/src/index.ts` will be substantially rewritten from placeholder to full implementation (~200-300 lines)
- **Client code**: `/home/wert2all/work/adb-logcat/client/` — the client files are served but their content is out of scope for this change (client-side rendering is a separate concern)
- **Startup**: `npm start` now runs the full server, no manual steps needed beyond having `adb` on PATH
- **No breaking changes** — this is the initial server implementation replacing a placeholder
