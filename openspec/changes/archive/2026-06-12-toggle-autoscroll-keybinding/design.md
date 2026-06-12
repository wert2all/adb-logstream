## Context

The client already has:

- A working `a`uto-scroll toggle via a checkbox in the footer (`client/src/main.ts`)
- A keyboard shortcut system in `client/src/keyboard.ts` with single-key shortcuts for level toggles (`v`, `d`, `i`, `w`, `e`, `f`), clear (`c`), search (`/`), and escape
- State management in `client/src/state.ts` with `autoScrollEnabled`, `saveAutoScrollState()`, and `loadAutoScrollState()`
- A tooltip convention for exposing keyboard shortcuts on controls (defined in the existing `keyboard-shortcuts` spec)

No new dependencies or architectural changes are needed.

## Goals / Non-Goals

**Goals:**

- Allow toggling auto-scroll via the `a` key, consistent with existing single-key shortcuts
- Show the `a` key binding in a tooltip on the auto-scroll checkbox control
- Keep the existing checkbox behavior fully intact as an alternative input

**Non-Goals:**

- Changing the auto-scroll persistence mechanism (already handled by `saveAutoScrollState`)
- Adding a keyboard shortcut for anything beyond auto-scroll toggle
- Modifying the server component

## Decisions

### Decision: Use `a` key for auto-scroll toggle

The `a` key is unassigned in the current shortcut map and mnemonically matches "auto-scroll." It follows the existing pattern of single-character keys for toggles.

**Alternatives considered:**

- `s` — conflicts conceptually with "search" (already `/`)
- `j`/`k` — could conflict with future vim-style navigation
- `Ctrl+A` / `Cmd+A` — over-engineered for a simple toggle, breaks the single-key convention

### Decision: Sync checkbox via existing state pattern

Rather than adding a new event listener bridge, the `keyboard.ts` handler will call `state.autoScrollEnabled = !state.autoScrollEnabled` directly (same as the checkbox `change` event), then call `saveAutoScrollState()` and `updateAutoScrollIndicator()`. The checkbox DOM element will be updated by reading `state.autoScrollEnabled` — same approach used in `main.ts`.

### Decision: Tooltip via `title` attribute on the auto-scroll checkbox container

The existing tooltip pattern (from the `control-tooltips` spec) uses `title` attributes. The auto-scroll checkbox will follow the same pattern: `title="Toggle auto-scroll (a)"`.

## Risks / Trade-offs

- **`a` key collision with future features** → If a future feature needs `a`, it can be remapped then; the current key space is sparse enough that this is unlikely
- **Checkbox and shortcut state divergence** → Mitigated by having both the keyboard handler and the checkbox listener write to the same `state.autoScrollEnabled` field and call the same `saveAutoScrollState`/`updateAutoScrollIndicator` helpers

## Migration Plan

No migration needed — purely additive. The change is backward compatible; users can still use the checkbox as before.

## Open Questions

None — the implementation is straightforward and well-constrained by existing patterns.
