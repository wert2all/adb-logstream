## Why

Users currently need to use the mouse to toggle auto-scroll via the footer checkbox. Adding a keyboard shortcut enables power users to toggle auto-scroll without leaving the keyboard, consistent with the existing level-toggle shortcuts (`v`, `d`, `i`, `w`, `e`, `f`) and other single-key shortcuts already in the client.

## What Changes

- Add a keyboard shortcut (`a` key) to toggle auto-scroll on/off
- Add a tooltip on the auto-scroll checkbox showing the `a` key binding
- Sync the checkbox state when the shortcut toggles auto-scroll

## Capabilities

### New Capabilities

- `auto-scroll-keybinding`: Keyboard shortcut (`a` key) to toggle auto-scroll state, with tooltip on the auto-scroll checkbox control.

### Modified Capabilities

- `keyboard-shortcuts`: Extends the existing shortcut map with the `a` key binding for auto-scroll toggle.
- `auto-scroll-toggle`: Adds a tooltip on the auto-scroll checkbox that exposes the `a` key binding on hover.

## Impact

- `client/src/keyboard.ts` — add `case "a"` handler to toggle auto-scroll
- `client/src/main.ts` — sync checkbox state and save/load state when shortcut fires
- `client/index.html` — add tooltip attribute on the auto-scroll checkbox control
- Existing spec deltas in `specs/keyboard-shortcuts/spec.md` and `specs/auto-scroll-toggle/spec.md`
