## Context

The ADB Logstream viewer is a pure client-side web app that renders log entries streamed via WebSocket. The client code is modular TypeScript (`src/main.ts`, `src/state.ts`, `src/render.ts`, `src/websocket.ts`, etc.) with a simple event-driven architecture.

The log container (`#log-container`) already has scroll detection and conditional auto-scroll behavior. When new entries arrive, `autoScroll()` is called, which scrolls to the bottom unless the user has manually scrolled up (`userScrolledUp`). The footer already shows an "Auto-scroll" indicator, but it currently reflects scroll position rather than an explicit toggle state. There is no explicit checkbox control and no `localStorage` persistence.

## Goals / Non-Goals

**Goals:**
- Add a checkbox in the footer to explicitly enable/disable auto-scroll
- Default state: enabled (on)
- When enabled: new entries auto-scroll to bottom unless user has manually scrolled up
- When disabled: new entries never trigger scroll
- Footer indicator shows the toggle state: "Auto-scroll: ON" or "Auto-scroll: OFF"
- Persist toggle state across page reloads via `localStorage`

**Non-Goals:**
- Changing the WebSocket server or protocol
- Adding a settings panel or modal
- Animating scroll behavior (keep it instant)
- Changing keyboard shortcuts or filter/search behavior

## Decisions

### 1. Extend `AppState` and `state.ts` with `autoScrollEnabled`

- **Why**: The toggle state is global application state, just like `levelFilters` and `searchQuery`. Keeping it in the existing state module maintains consistency.
- **Default**: `true` (auto-scroll on by default)
- **Persistence**: Load from `localStorage` on init, save on every toggle. Key: `logstream-auto-scroll-enabled`.

### 2. Add checkbox to footer in `index.html`

- **Why**: Minimal UI change, no new panels or modals needed. The footer already has the indicator text.
- **Implementation**: Replace the static `<span id="auto-scroll-indicator">` with a `<label>` containing a checkbox and the indicator text. Use existing Tailwind classes for styling.

### 3. Decouple indicator text from scroll position

- **Why**: The current indicator shows whether the user is at the bottom. The requirement says it must show the toggle state (ON/OFF).
- **Implementation**: The indicator text should always reflect `autoScrollEnabled`. The scroll position should only affect `userScrolledUp` logic.

### 4. Keep `userScrolledUp` logic intact

- **Why**: When auto-scroll is enabled, we still want to respect manual scroll-up to let users read older entries.
- **Implementation**: `autoScroll()` checks both `state.autoScrollEnabled` AND `!userScrolledUp`. If either is false, no scroll happens.

### 5. Initialize toggle in `main.ts` or a new `initAutoScroll()` function

- **Why**: `main.ts` is the current initialization entry point. The auto-scroll init can either be added there or extracted to a small module. Since the logic is only a few lines (read `localStorage`, attach checkbox listener, set indicator), adding it directly to `main.ts` or `render.ts` is acceptable. For cleanliness, a small helper in `render.ts` is simplest.

## Risks / Trade-offs

- **[Risk]** `localStorage` is unavailable in private browsing mode or with strict privacy settings.  
  → **Mitigation**: The feature degrades gracefully — default to `true` if `localStorage` read fails. Wrap in `try/catch`.
- **[Risk]** Users might confuse the indicator text with scroll position.  
  → **Mitigation**: The indicator is tied to the checkbox, making the relationship explicit. Consider adding a tooltip if confusion persists.

## Migration Plan

No migration needed. This is a purely additive client-side feature with no breaking changes. Existing behavior is preserved when auto-scroll is enabled.

## Open Questions

None. Requirements are clear and the codebase already has the scroll detection foundation.
