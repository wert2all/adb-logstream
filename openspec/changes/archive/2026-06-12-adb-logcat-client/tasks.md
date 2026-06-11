## 1. Project Setup & Infrastructure

- [x] 1.1 Create directory structure under `client/src/` for modules (`state.ts`, `websocket.ts`, `render.ts`, `filter.ts`, `search.ts`, `keyboard.ts`)
- [x] 1.2 Verify `client/index.html` loads the application correctly with the existing Vite setup
- [x] 1.3 Remove stub code from `client/src/main.ts` and prepare bootstrap wiring

## 2. Core State & Types

- [x] 2.1 Define `LogcatEntry` TypeScript interface with `timestamp`, `pid`, `tid`, `level`, `tag`, `message` fields
- [x] 2.2 Define `AppState` interface holding the complete entry array, filter toggles, search query, and connection status
- [x] 2.3 Create and export a singleton `AppState` instance from `client/src/state.ts`

## 3. WebSocket Client

- [x] 3.1 Implement WebSocket connection to `ws://localhost:3000` on page load
- [x] 3.2 Implement connection status tracking (connected / disconnected / reconnecting) and update `AppState`
- [x] 3.3 Implement auto-reconnect with 3-second delay after disconnect
- [x] 3.4 Implement page reload on successful reconnect after a disconnect
- [x] 3.5 Implement message parsing: handle `"entry"` type messages by adding to `AppState`
- [x] 3.6 Implement message parsing: handle `"status"` type messages by showing a temporary banner
- [x] 3.7 Implement malformed JSON handling: skip invalid messages and log to console

## 4. Log Rendering

- [x] 4.1 Implement `createEntryRow()` function that creates a DOM element for a `LogcatEntry`
- [x] 4.2 Apply color-coding per Level (V/D/I/W/E/F) matching the design reference
- [x] 4.3 Implement `appendEntry()` that adds new rows to the bottom of the log list
- [x] 4.4 Implement auto-scroll logic: check scroll position within 50px of bottom before scrolling
- [x] 4.5 Implement DOM capping: when total entries exceed 5000, remove oldest entries from DOM and in-memory array
- [x] 4.6 Implement `clearLog()` that removes all entries from DOM and resets in-memory array
- [x] 4.7 Implement total entry count display in the header

## 5. Level Filtering

- [x] 5.1 Create six toggle buttons in the header (V, D, I, W, E, F)
- [x] 5.2 Implement default toggle states: V = off, D/I/W/E/F = on
- [x] 5.3 Implement toggle click handler that updates `AppState` and re-applies visibility
- [x] 5.4 Implement `applyLevelFilters()` that shows/hides entries based on toggle states using `display: none`
- [x] 5.5 Implement localStorage persistence: save toggle states on change, restore on page load
- [x] 5.6 Ensure filtered-out entries remain in memory and are not removed from the array

## 6. Text Search

- [x] 6.1 Create search input field in the header
- [x] 6.2 Implement real-time search filtering on input event
- [x] 6.3 Implement case-insensitive substring matching across `tag` + `message`
- [x] 6.4 Implement `<mark>` highlighting for matched text in visible entries
- [x] 6.5 Implement search re-render: filter the in-memory array and replace the DOM list when query changes
- [x] 6.6 Implement clearing search: when input is empty, show all entries respecting level filters
- [x] 6.7 Implement Escape key behavior: clear search field, blur input, restore full list

## 7. Keyboard Shortcuts

- [x] 7.1 Implement global `keydown` listener in `client/src/keyboard.ts`
- [x] 7.2 Implement `/` key: focus search input (prevent character insertion)
- [x] 7.3 Implement `Escape` key: clear search and blur input
- [x] 7.4 Implement `c` key: clear log list
- [x] 7.5 Implement `v`/`d`/`i`/`w`/`e`/`f` keys: toggle corresponding Level filter
- [x] 7.6 Implement guard: do NOT trigger shortcuts when any `<input>` or `<textarea>` is focused

## 8. Integration & Bootstrap

- [x] 8.1 Wire all modules together in `client/src/main.ts` (import state, websocket, render, filter, search, keyboard)
- [x] 8.2 Ensure correct initialization order: state → UI elements → WebSocket connection → event listeners
- [x] 8.3 Connect `websocket.ts` to `render.ts` so new entries are appended and filtered automatically
- [x] 8.4 Connect `filter.ts` and `search.ts` to `render.ts` so visibility changes are applied

## 9. Testing & Verification

- [x] 9.1 Run `npm run dev` in `client/` and verify page loads without errors
- [x] 9.2 Test WebSocket connection: verify green status when server is running, red when stopped
- [x] 9.3 Test auto-reconnect: stop server, wait 3s, restart server, verify page reloads
- [x] 9.4 Test log rendering: verify entries appear with correct colors and timestamps
- [x] 9.5 Test auto-scroll: verify scroll stays at bottom when there, stays put when user scrolls up
- [x] 9.6 Test DOM cap: verify oldest entries are removed after 5000
- [x] 9.7 Test level filters: verify toggles hide/show entries instantly and persist across reload
- [x] 9.8 Test search: verify real-time filtering, case-insensitivity, and `<mark>` highlighting
- [x] 9.9 Test keyboard shortcuts: verify all shortcuts work and are disabled when typing in search
- [x] 9.10 Test clear: verify `c` key and Clear button empty the list
- [x] 9.11 Test status banner: verify server status messages appear as dismissible banners
- [x] 9.12 Test malformed JSON: verify invalid messages are skipped with a console error
