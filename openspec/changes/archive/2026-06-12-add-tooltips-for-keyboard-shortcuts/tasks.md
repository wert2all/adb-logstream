## 1. Tooltip CSS

- [x] 1.1 Add tooltip CSS to `client/index.html` inline `<style>` block: `.tooltip-trigger` wrapper, `.tooltip` element with `surface-variant` background, `on-surface` text, `transition-delay` of 300ms on opacity, positioned above control with horizontal centering
- [x] 1.2 Add tooltip key badge styling matching existing footer `<kbd>` pattern (`bg-surface-variant px-1 rounded text-on-surface`)

## 2. Level toggle tooltips

- [x] 2.1 Wrap each level toggle button (`#level-toggles button[data-level]`) in a `.tooltip-trigger` span in `client/index.html`
- [x] 2.2 Add `<span class="tooltip">` inside each toggle with text "Toggle {Level}" and a `<kbd>` badge for the key (e.g., `<kbd>V</kbd>`)
- [x] 2.3 Remove existing `title` attributes from level toggle buttons (replaced by custom tooltips)

## 3. Clear button tooltip

- [x] 3.1 Wrap `#clear-btn` in a `.tooltip-trigger` span in `client/index.html`
- [x] 3.2 Add `<span class="tooltip">` inside the button wrapper with text "Clear logs" and `<kbd>C</kbd>` badge

## 4. Search input tooltip

- [x] 4.1 Wrap `#search-input` in a `.tooltip-trigger` span in `client/index.html`
- [x] 4.2 Add `<span class="tooltip">` inside the input wrapper with text "Filter logs" and `<kbd>/</kbd>` badge

## 5. Verification

- [x] 5.1 Verify tooltips appear on hover with ~300ms delay for each control (search, clear, V, D, I, W, E, F)
- [x] 5.2 Verify tooltips use project color tokens and match footer `<kbd>` styling
- [x] 5.3 Verify tooltips do not appear when mouse leaves before delay elapses
- [x] 5.4 Verify keyboard shortcuts still function correctly (no behavioral changes)
