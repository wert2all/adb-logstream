# Client

## Overview

The client is a vanilla HTML/CSS/JS application that connects to the server via WebSocket, receives a real-time stream of logcat entries, and renders them as a scrollable, filterable, searchable log list. No frameworks, no build tools, no dependencies.

## Functional Requirements

### FR-1: Connect to WebSocket

- On page load, connect to `ws://localhost:3000`.
- On connection open, set status indicator to "connected" (green).
- On connection close or error, set status indicator to "disconnected" (red) and attempt reconnect after 3 seconds.
- On reconnect, reload the page to establish a fresh connection.

### FR-2: Receive and render logcat entries

- Parse incoming JSON messages of type `"entry"`.
- Append each entry to the log list as a row displaying: timestamp, level, tag, message.
- New entries appear at the bottom.
- Auto-scroll to the latest entry if the user is already scrolled to the bottom.
- If the user has scrolled up, do not force scroll — let them read history in place.

### FR-3: Cap DOM entries

- Keep a maximum of N entries in the DOM (e.g. 5000).
- When the limit is exceeded, remove the oldest entries from both the DOM and the in-memory list.
- Display the total received entry count in the header.

### FR-4: Filter by log level

- Six toggle controls — one per level: V, D, I, W, E, F.
- Default state: V = off, D/I/W/E/F = on.
- Toggling a level hides or shows all entries of that level instantly.
- Filtering is applied on render — all entries are kept in memory regardless of toggle state.
- Toggle state persists across page reloads via `localStorage`.

### FR-5: Text search

- A text input field for search queries.
- Filters entries in real time as the user types (case-insensitive).
- Matches are highlighted within the entry text using `<mark>`.
- Search applies to the combined text of tag + message.
- If the search field is empty, all entries (respecting level filters) are shown.
- Pressing `Escape` clears the search field.

### FR-6: Display connection status

- A colored dot indicator in the header:
  - Green — connected
  - Yellow — reconnecting
  - Red — disconnected
- When the server sends a `"status"` message, display it as a temporary banner (e.g. "Device disconnected. Reconnecting...").

### FR-7: Clear log list

- A "Clear" button removes all rendered entries from the DOM and resets the in-memory list.
- Does not affect the server — new entries continue to arrive and render.

### FR-8: Keyboard shortcuts

| Key       | Action                   |
|-----------|--------------------------|
| `/`       | Focus search input       |
| `Escape`  | Clear search / blur input|
| `c`       | Clear log list           |
| `v`       | Toggle Verbose           |
| `d`       | Toggle Debug             |
| `i`       | Toggle Info              |
| `w`       | Toggle Warn              |
| `e`       | Toggle Error             |
| `f`       | Toggle Fatal             |

## Non-Functional Requirements

| Requirement | Value |
|-------------|-------|
| Tech stack | Vanilla HTML/CSS/JS |
| Build step | None |
| Dependencies | None (runtime) |
| Browser support | Modern browsers with WebSocket |
| Responsive | Desktop only |
| Max DOM entries | ~5000 |
| Search latency | Real-time (no debounce needed for typical log volume) |

## UI Layout

```
┌─────────────────────────────────────────────────────┐
│ [status] [search input        ] [V][D][I][W][E][F] │  Header
├─────────────────────────────────────────────────────┤
│ 22:47:01.123  I  ActivityManager    Start proc ...  │
│ 22:47:01.456  W  WindowManager      Failed to ...   │
│ 22:47:02.789  E  AndroidRuntime     FATAL EXC ...   │  Log List
│ ...                                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Message Protocol

### Client → Server

None. The client is read-only.

### Server → Client: entry

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

### Server → Client: status

```json
{
  "type": "status",
  "message": "Device disconnected. Reconnecting..."
}
```

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Server unreachable on load | Show disconnected status, retry after 3s |
| Connection lost during streaming | Show reconnecting banner, retry after 3s |
| Malformed JSON from server | Skip message, log error to console |
| WebSocket not supported | Show error message in page body |

## File Structure

```
client/
├── index.html   # Page structure: header, search, level toggles, log list container
├── style.css    # Layout, colors, level themes, status indicator
└── app.js       # WebSocket connection, message handling, rendering, filtering, search
```
