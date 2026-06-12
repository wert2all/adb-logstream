## Context

The ADB Logstream Viewer server already streams parsed JSON logstream entries over WebSocket. The client (`client/src/main.ts`) is currently a stub — it only logs to console. The UI design reference (`client/design.html`) defines a dark-themed terminal-style interface with a header, log list, level toggles, search bar, and keyboard shortcuts. The client uses vanilla TypeScript with Vite as a dev server only; no runtime frameworks or build dependencies.

**Constraints:**
- Vanilla TypeScript, no frameworks (React, Vue, etc.)
- No additional npm dependencies
- Must handle continuous Stream of entries without memory leaks
- Must support ~5000 DOM entries smoothly

## Goals / Non-Goals

**Goals:**
- Real-time rendering of WebSocket Stream with auto-scroll and DOM capping
- Level filtering with instant visual feedback and persistence
- Case-insensitive search with highlighted matches
- Keyboard shortcuts for all primary actions
- Connection status display and auto-reconnect behavior

**Non-Goals:**
- Multi-device support (the server handles one device at a time)
- Log export or persistence (client is ephemeral)
- Advanced regex search (simple substring matching is sufficient)
- Mobile / responsive layout (desktop only)
- Debounced search (real-time is acceptable for expected log volume)

## Decisions

### 1. Centralized In-Memory State Store

**Decision:** Maintain a single `AppState` object holding the complete entry array, filter toggles, search query, and connection status.

**Rationale:**
- All features (filtering, search, clear, capping) need access to the same data
- Vanilla JS means no reactive framework; explicit state → render cycle is simplest
- Makes testing and debugging straightforward

**Alternatives considered:**
- Event-driven architecture with custom events between modules — overkill for this scope
- Module-scoped state — would create tight coupling and hard-to-trace bugs

### 2. Incremental DOM Append with Visibility Filtering

**Decision:** Append new entries to the DOM incrementally. For filtering/search, toggle `display: none` rather than removing nodes or re-rendering the entire list.

**Rationale:**
- Incremental append is O(1) and keeps auto-scroll smooth
- Re-rendering 5000 entries on every filter toggle would cause jank
- `display: none` preserves scroll position and is faster than DOM removal/insertion
- Search highlighting is applied at creation time; hidden entries don't need re-highlighting

**Trade-off:** Filtered-out entries still exist in memory and DOM. Mitigated by the 5000-entry cap.

### 3. Search Implemented as Array Filter + Re-render

**Decision:** When the search query changes, filter the in-memory array and replace the entire DOM list. For new incoming entries, apply search at append time.

**Rationale:**
- Search is a user-initiated action (typing), not a continuous stream, so occasional re-render is acceptable
- Ensures consistent match highlighting across all visible entries
- Simpler than maintaining a parallel "visible entries" subset

**Trade-off:** Large searches on 5000 entries may cause a brief pause. Mitigated by the cap and the fact that search is user-paced typing.

### 4. Auto-scroll via Scroll Position Check

**Decision:** Before appending a new entry, check if `scrollTop + clientHeight >= scrollHeight - 50`. If true, scroll to bottom after append. If false, leave scroll position unchanged.

**Rationale:**
- Simple, reliable heuristic for "user is at bottom"
- 50px threshold prevents missing the last entry due to rounding
- No need for intersection observers or complex scroll tracking

### 5. DOM Capping: FIFO Removal

**Decision:** When the entry array exceeds 5000, remove the oldest entries from both the in-memory array and the DOM simultaneously.

**Rationale:**
- Prevents memory leaks and DOM bloat from long-running sessions
- Removing from the top of the list (oldest) is the natural behavior for a log stream
- Keep array and DOM in sync to avoid inconsistencies

### 6. Page Reload on Reconnect

**Decision:** After a WebSocket disconnect, attempt to reconnect after 3 seconds. On successful reconnect, reload the page to establish a fresh state.

**Rationale:**
- Specified in FR-1
- Avoids complex state reconciliation between old and new connections
- User loses scroll position but gains a clean, consistent view

### 7. Module Organization

**Decision:** Split into 5 modules:
- `state.ts` — `AppState` interface and singleton instance
- `websocket.ts` — WebSocket connection, message parsing, reconnect
- `render.ts` — DOM creation, append, capping, clear
- `filter.ts` — Level toggle logic, localStorage persistence, visibility application
- `search.ts` — Query handling, highlight logic, Escape key
- `keyboard.ts` — Global keydown handler, shortcut dispatch
- `main.ts` — Bootstraps modules and wires them together

**Rationale:**
- Each module has a single responsibility
- Enables isolated testing and debugging
- `main.ts` remains the coordination layer (no logic in main.ts)

**Alternatives considered:**
- Single file — too large and hard to maintain
- Class-based architecture — unnecessary complexity for this scale

### 8. localStorage for Toggle Persistence

**Decision:** Store level toggle states as a simple JSON object in `localStorage` under key `logstream-levels`. Read on init, write on change.

**Rationale:**
- Simplest persistence mechanism available
- No schema migration needed (if key missing, use defaults)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 5000 DOM nodes still cause performance issues on lower-end machines | Use `display: none` for filtering (no reflow on hidden nodes); monitor performance |
| Rapid log spam (e.g., 1000+ entries/sec) causes UI to freeze | DOM capping kicks in; consider `requestAnimationFrame` batching if needed |
| WebSocket reconnect loop on server failure | Fixed 3-second delay; page reload on success prevents stale state |
| Search re-rendering 5000 entries causes input lag | Keep search simple (substring, no regex); cap at 5000; if needed, add a 50ms debounce |
| Multiple clients open cause localStorage race conditions | Toggle state is per-client; localStorage is just a convenience, not a shared source of truth |

## Migration Plan

This is a new client implementation with no existing users or state to migrate.

1. Write new modules under `client/src/`
2. Update `client/src/main.ts` to bootstrap
3. Verify `client/index.html` still loads correctly
4. Test with running server: `npm run dev` in client directory, server in root

No rollback needed — the old stub is not a functional product.

## Open Questions

- Should the 5000-entry cap be configurable? (Not for MVP — can be added later.)
- Should filtered-out entries be removed from memory entirely? (No — `display: none` is faster; memory impact is bounded by the cap.)
