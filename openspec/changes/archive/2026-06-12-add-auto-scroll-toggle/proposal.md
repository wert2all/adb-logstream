## Why

Users need to control whether new log entries automatically scroll the view. Currently, the log stream always pushes the view to the bottom, which makes it impossible to read older entries while new logs are arriving. Adding a toggleable auto-scroll feature gives users control over the reading experience.

## What Changes

- Add a checkbox in the footer to toggle auto-scroll on/off
- Default state: enabled (on)
- When enabled: new log entries automatically scroll the list to the bottom, unless the user has manually scrolled up
- When disabled: new entries do not trigger any scroll
- Footer indicator shows "Auto-scroll: ON" or "Auto-scroll: OFF"
- Toggle state persists across page reloads via `localStorage`

## Capabilities

### New Capabilities

- `auto-scroll-toggle`: Toggleable auto-scroll control with state persistence and scroll-avoidance on manual user scroll

### Modified Capabilities

None. This is a purely additive UI feature that does not change existing spec-level behavior.

## Impact

- **Client-side HTML/JS**: Footer UI and scroll logic in the log viewer
- **Storage**: Uses `localStorage` for state persistence
- **No Server or API changes**
- **No breaking changes**
