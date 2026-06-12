## Why

Users have no way to discover keyboard shortcuts by hovering over UI controls. The shortcuts exist (documented only in the footer), but components like the Clear button and search input lack tooltips indicating their shortcut keys. Level toggle buttons have basic `title` attributes but no shortcut hint. This creates a discoverability gap — keyboard shortcuts are only learnable by reading the footer legend.

## What Changes

- Add tooltip overlays to interactive controls that have keyboard shortcuts, showing the shortcut key alongside the action description.
- Replace plain `title` attributes on level toggle buttons with rich tooltips that include the shortcut key (e.g., "Toggle Verbose [V]").
- Add tooltip to the Clear button showing "Clear logs [C]".
- Add tooltip to the search input showing "Filter logs [/]".
- Tooltips appear on hover with a slight delay and follow the project's existing color tokens.

## Capabilities

### New Capabilities

- `control-tooltips`: Tooltip overlays for UI controls that have keyboard shortcuts, displaying the key binding on hover.

### Modified Capabilities

- `keyboard-shortcuts`: Existing spec gains a requirement that each shortcut-having control exposes its key binding via a tooltip on hover.

## Impact

- `client/index.html` — Clear button (`#clear-btn`), search input (`#search-input`), and level toggle buttons (`#level-toggles button[data-level]`) need tooltip markup and `title`/`data-tooltip` attributes.
- `client/src/keyboard.ts` — No changes to shortcut logic; tooltips are purely presentational.
- New CSS for tooltip positioning and animation (inline `<style>` block or added to existing styles).
- No server-side, API, or dependency changes.
