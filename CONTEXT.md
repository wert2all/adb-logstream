# ADB Logstream Viewer

A minimalistic web-based viewer for Android `adb logcat` output. A local Node.js server streams logstream entries via WebSocket to an Angular client that renders them in real time with filtering and search.

## Language

**Logstream Entry**:
A single parsed line from `adb logcat -v long` containing: timestamp, PID, TID, level, tag, and message.
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
A browser tab connected to the server via WebSocket, rendering the Stream. Built with Angular 21+ using standalone components, signals for state management, and Tailwind CSS via PostCSS.
_Avoid_: user, frontend, consumer

**Server**:
The Node.js process that runs `adb logcat` and broadcasts entries to all connected Clients.
_Avoid_: backend, service

**LogStateService**:
An Angular injectable service that manages all application state via signals: entries, level filters, search query, connection status, auto-scroll, and entry count.
_Avoid_: state store, state manager

**WebSocketService**:
An Angular injectable service that manages WebSocket connection, reconnection logic, and message parsing. Exposes signals for latest entry, connection status, and status messages.
_Avoid_: ws service, connection service

## Relationships

- A **Server** runs one `adb logcat` process and broadcasts its output as a **Stream**
- Multiple **Clients** can connect to the same **Server** simultaneously
- Each **Logstream Entry** has exactly one **Level** and one **Tag**
- Filtering and search are performed on the **Client** side; the **Server** sends all entries unfiltered
- The **Client** is composed of Angular standalone components that read from **LogStateService** signals
- The **WebSocketService** pushes entries into the **LogStateService** via signal updates

## Flagged ambiguities

- "log" was used to refer to both the entire `adb logcat` output and a single line — resolved: the entire output is the **Stream**, a single line is a **Logstream Entry**.
- "frontend" and "client" were used interchangeably — resolved: **Client** is the canonical term (the browser-side code).
