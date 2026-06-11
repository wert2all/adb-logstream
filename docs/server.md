# Server

## Overview

The server is a Node.js application that bridges `adb logcat` output to WebSocket clients. It runs a single `adb logcat -v long` process, parses each entry into structured JSON, and broadcasts to all connected browser clients in real time.

## Functional Requirements

### FR-1: Start adb logcat

- The server spawns `adb logcat -v long` as a child process on startup.
- `adb` is resolved from the system PATH.
- The process runs continuously until the server is stopped.

### FR-2: Parse logcat output

- Each logcat entry in `long` format consists of a header line followed by one or more body lines.
- The header contains: timestamp, PID, TID, level (V/D/I/W/E/F), and tag.
- The body contains the log message, which may span multiple lines.
- The server parses each complete entry into a structured object with fields: `timestamp`, `pid`, `tid`, `level`, `tag`, `message`.

### FR-3: Broadcast entries to clients

- Each parsed entry is serialized to JSON and sent to all connected WebSocket clients.
- The message type is `"entry"`.
- Clients that are not in OPEN state are skipped.

### FR-4: Serve static client files

- The server serves static files from the `client/` directory.
- `/` serves `index.html`.
- Other paths serve the corresponding file (`style.css`, `app.js`).

### FR-5: Accept WebSocket connections

- WebSocket connections are accepted on the same port as the HTTP server (3000).
- There is no limit on the number of simultaneous connections.
- No authentication is required.

### FR-6: Handle device disconnect

- When the `adb logcat` process exits (e.g. device unplugged), the server:
  1. Sends a status message to all clients: `{ "type": "status", "message": "Device disconnected. Reconnecting..." }`
  2. Waits 3 seconds
  3. Restarts `adb logcat -v long`
- This cycle repeats indefinitely until the server is stopped.

### FR-7: Forward adb stderr

- Any output from `adb` on stderr is forwarded to all clients as a status message: `{ "type": "status", "message": "<stderr text>" }`.

### FR-8: Start on npm start

- Running `npm start` starts the server.
- The server logs the URL on startup (e.g. `Server running at http://localhost:3000`).

## Non-Functional Requirements

| Requirement | Value |
|-------------|-------|
| Port | 3000 (fixed) |
| Dependencies | `ws` only |
| Node.js version | 18+ |
| Platform | Same machine as adb daemon |
| Max clients | Unlimited |
| Log persistence | None |
| Filtering | None (all entries broadcast as-is) |

## Message Protocol

### Server → Client: entry

Sent for each parsed logcat line.

```json
{
  "type": "entry",
  "timestamp": "06-11 22:47:01.123",
  "pid": 1234,
  "tid": 1235,
  "level": "I",
  "tag": "ActivityManager",
  "message": "Start proc com.example.app"
}
```

| Field       | Type   | Description                        |
|-------------|--------|------------------------------------|
| type        | string | Always `"entry"`                   |
| timestamp   | string | `MM-DD HH:MM:SS.mmm`               |
| pid         | number | Process ID                         |
| tid         | number | Thread ID                          |
| level       | string | One of: `V`, `D`, `I`, `W`, `E`, `F` |
| tag         | string | Subsystem tag                      |
| message     | string | Log message, may contain newlines  |

### Server → Client: status

Sent on device disconnect, reconnect, or stderr output.

```json
{
  "type": "status",
  "message": "Device disconnected. Reconnecting..."
}
```

| Field   | Type   | Description         |
|---------|--------|---------------------|
| type    | string | Always `"status"`   |
| message | string | Human-readable text |

### Client → Server

None. The client is read-only; it does not send any messages to the server.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| adb not in PATH | Process emits `error`, server logs to console, exits |
| Device disconnected | Auto-restart after 3s, notify clients |
| Client disconnects | Server removes client from pool silently |
| Malformed log line | Skip or forward as raw text with level `?` |
| Server crash | Process exits, user restarts manually |

## File Structure

```
server/
├── index.js   # HTTP server, WebSocket, static file serving, broadcast
└── adb.js     # Child process spawn, parse loop, auto-restart
```
