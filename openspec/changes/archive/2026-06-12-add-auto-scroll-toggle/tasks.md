## 1. State and Persistence

- [x] 1.1 Add `autoScrollEnabled: boolean` to `AppState` interface in `client/src/state.ts`
- [x] 1.2 Initialize `autoScrollEnabled` to `true` in `createAppState()`
- [x] 1.3 Load persisted `autoScrollEnabled` from `localStorage` on init, falling back to `true` if missing or on error

## 2. UI Changes

- [x] 2.1 Add checkbox input with `id="auto-scroll-toggle"` inside the footer label in `client/index.html`
- [x] 2.2 Bind checkbox state to `state.autoScrollEnabled` on page load
- [x] 2.3 Add event listener to checkbox to update `state.autoScrollEnabled` and save to `localStorage`
- [x] 2.4 Update `autoScrollIndicator` text to always reflect `state.autoScrollEnabled` ("Auto-scroll: ON" / "OFF")

## 3. Scroll Logic

- [x] 3.1 Update `autoScroll()` in `client/src/render.ts` to check `state.autoScrollEnabled` before scrolling
- [x] 3.2 Decouple indicator text updates from scroll position (remove indicator text changes from scroll handler)
- [x] 3.3 Ensure `userScrolledUp` detection continues to work when auto-scroll is enabled

## 4. Verification

- [x] 4.1 Test: Auto-scroll enabled by default on first load
- [x] 4.2 Test: Unchecking checkbox disables auto-scroll and indicator shows OFF
- [x] 4.3 Test: Checking checkbox re-enables auto-scroll and indicator shows ON
- [x] 4.4 Test: Reloading page restores previous checkbox state from localStorage
- [x] 4.5 Test: Manual scroll-up prevents auto-scroll when enabled, but new entries still arrive
- [x] 4.6 Test: No auto-scroll occurs when disabled, regardless of scroll position
