# ADB Logstream Viewer

A minimalistic web-based viewer for Android `adb logstream` output. A local Node.js server streams logstream entries via WebSocket to a pure HTML/JS client that renders them in real time with filtering and search.

## Language

**Logstream Entry**:
A single parsed line from `adb logstream` containing: timestamp, PID, TID, level, tag, and message.
_Avoid_: log line, log record

**Level**:
The severity of a Logcat Entry. One of: `V` (verbose), `D` (debug), `I` (info), `W` (warn), `E` (error), `F` (fatal).
_Avoid_: severity, priority, log type

**Tag**:
A short string identifying the subsystem that produced the Logcat Entry (e.g. `ActivityManager`, `System.err`).
_Avoid_: source, category, label

**Stream**:
The continuous flow of Logstream Entries from the server to connected clients via WebSocket.
_Avoid_: feed, pipe, channel

**Client**:
A browser tab connected to the server via WebSocket, rendering the Stream.
_Avoid_: user, frontend, consumer

**Server**:
The Node.js process that runs `adb logstream` and broadcasts entries to all connected Clients.
_Avoid_: backend, service

## Relationships

- A **Server** runs one `adb logstream` process and broadcasts its output as a **Stream**
- Multiple **Clients** can connect to the same **Server** simultaneously
- Each **Logstream Entry** has exactly one **Level** and one **Tag**
- Filtering and search are performed on the **Client** side; the **Server** sends all entries unfiltered

## Flagged ambiguities

- "log" was used to refer to both the entire `adb logstream` output and a single line — resolved: the entire output is the **Stream**, a single line is a **Logstream Entry**.
- "frontend" and "client" were used interchangeably — resolved: **Client** is the canonical term (the browser-side code).
