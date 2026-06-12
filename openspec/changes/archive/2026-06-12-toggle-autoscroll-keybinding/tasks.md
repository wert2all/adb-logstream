## 1. Auto-Scroll Keybinding

- [x] 1.1 Add `a` key handler to `client/src/keyboard.ts` - Import `state`, `saveAutoScrollState` from `state.ts` and `updateAutoScrollIndicator` from `render.ts` - Add `case "a"` / `case "A"` that toggles `state.autoScrollEnabled`, calls `saveAutoScrollState()`, updates the checkbox DOM element, and calls `updateAutoScrollIndicator()`

## 2. Tooltip

- [x] 2.1 Add `title` attribute to auto-scroll checkbox in `client/index.html` - Set `title="Toggle auto-scroll (a)"` on the `<input id="auto-scroll-toggle">` element
