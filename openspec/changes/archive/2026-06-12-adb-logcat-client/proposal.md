## Why

The ADB Logcat Viewer project has a functional Node.js server that streams parsed logcat entries via WebSocket, but the client is currently a stub (`console.log` only). We need a complete client implementation to render the Stream, filter by Level, search entries, and provide keyboard shortcuts — making the tool actually usable for Android development.

## What Changes

- Build the complete client application (`client/src/main.ts` + supporting modules) to render Logcat Entries from the WebSocket Stream
- Implement WebSocket connection management with auto-reconnect and status indicators (FR-1, FR-6)
- Render Logcat Entries as a scrollable, color-coded list with auto-scroll behavior (FR-2)
- Cap DOM entries to ~5000 to prevent memory bloat (FR-3)
- Add level filter toggles (V/D/I/W/E/F) with localStorage persistence (FR-4)
- Add real-time text search with `<mark>` highlighting (FR-5)
- Add a Clear button and keyboard shortcuts for all actions (FR-7, FR-8)
- No new dependencies or build steps — stays vanilla TypeScript

## Capabilities

### New Capabilities
- `websocket-client`: WebSocket connection, reconnect logic, and status display
- `log-rendering`: Parsing, displaying, and capping Logcat Entries in the DOM
- `level-filtering`: Toggle visibility by Level with localStorage persistence
- `text-search`: Real-time case-insensitive search and highlight across tag + message
- `keyboard-shortcuts`: Global key bindings for search, clear, and level toggles

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- `client/src/main.ts` — complete rewrite
- `client/index.html` — minor updates if needed for root element
- `client/src/` — new modules for filtering, rendering, search, WebSocket
- No server-side changes
- No new npm dependencies
