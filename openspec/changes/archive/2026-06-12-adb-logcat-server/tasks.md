## 1. Project Setup

- [x] 1.1 Configure `server/tsconfig.json` with CommonJS module output and `dist/` as output directory
- [x] 1.2 Verify `ws` dependency is declared in `server/package.json`
- [x] 1.3 Verify `npm start` runs `tsc && node dist/index.js`

## 2. HTTP Server with Static File Serving

- [x] 2.1 Implement `createServer` handler that routes `/` to `client/index.html`
- [x] 2.2 Add route for `/style.css` → `client/style.css` and `/app.js` → `client/app.js`
- [x] 2.3 Add 404 fallback for unknown paths
- [x] 2.4 Set correct Content-Type headers (`text/html`, `text/css`, `application/javascript`)
- [x] 2.5 Log `Server running at http://localhost:3000` on listen

## 3. WebSocket Server

- [x] 3.1 Attach `WebSocketServer` to the HTTP server
- [x] 3.2 Implement connection handler that tracks connected clients in a `Set`
- [x] 3.3 Implement client disconnect handler that removes client from the set silently
- [x] 3.4 Add broadcast helper that sends a JSON message to all OPEN clients

## 4. adb Process Management

- [x] 4.1 Implement function to spawn `adb logcat -v long` via `child_process.spawn`
- [x] 4.2 Handle spawn `error` event (adb not found) — log and exit
- [x] 4.3 Pipe stdout to the log parser
- [x] 4.4 Pipe stderr and forward each line as `{ type: "status", message }` to all clients
- [x] 4.5 Listen for `close` event to detect device disconnect
- [x] 4.6 Implement reconnect logic: notify clients → wait 3s → re-spawn adb
- [x] 4.7 Ensure reconnect cycle loops indefinitely until server stops

## 5. Logcat Entry Parser

- [x] 5.1 Implement line accumulator that buffers incoming stdout lines
- [x] 5.2 Write regex to match `-v long` header format: `[ timestamp pid:tid level/tag ]`
- [x] 5.3 Implement stateful parser that extracts header fields on header match
- [x] 5.4 Accumulate body lines until the next header, then emit the complete entry
- [x] 5.5 Handle entries with empty body (consecutive headers)
- [x] 5.6 Handle malformed non-header lines — skip or forward with level `?`
- [x] 5.7 Forward each parsed entry to the broadcast system

## 6. Server Integration

- [x] 6.1 Wire all components together in `server/src/index.ts`
- [x] 6.2 Verify startup: server spawns adb, logs URL, serves HTTP, accepts WebSocket
- [x] 6.3 Verify message flow: adb → parser → broadcast → client
- [x] 6.4 Verify reconnect: kill adb → status message sent → 3s wait → adb restarted
- [x] 6.5 Verify `npm start` works end-to-end
- [x] 6.6 Handle SIGINT/SIGTERM to cleanly kill the adb child process on server stop
