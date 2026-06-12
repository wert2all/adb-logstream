## Context

The client is a single-page HTML app (`client/index.html`) with vanilla TypeScript modules. It uses Tailwind CSS (via CDN) for styling and an inline `<style>` block for custom scrollbar/log-row styles. There are no external UI libraries or CSS frameworks beyond Tailwind.

Three interactive controls have keyboard shortcuts with no visual discovery mechanism:
- **Search input** (`/`) — placeholder text says `Filter logs (regex supported) [/]` but no tooltip.
- **Clear button** (`c`) — no shortcut hint at all.
- **Level toggles** (`V`–`F`) — have `title` attributes with only the level name (e.g., `"Verbose"`), no shortcut key.

The footer already lists all shortcuts, but users must scroll down to discover them. Tooltips on the controls themselves would close the discoverability gap.

## Goals / Non-Goals

**Goals:**
- Every control that has a keyboard shortcut shows that shortcut in a tooltip on hover.
- Tooltips use the project's existing color tokens (`surface-variant`, `on-surface`, `outline-variant`, etc.).
- No new runtime dependencies — pure HTML/CSS tooltips only.
- Tooltips appear with a slight delay (~300ms) to avoid flicker during casual mouse movement.

**Non-Goals:**
- Dynamic keyboard shortcut remapping or customization.
- Interactive tooltip behavior (click-to-show, focus-based tooltips for accessibility). This could be a future follow-up.
- Adding new keyboard shortcuts — only surfacing existing ones.

## Decisions

### Decision: Use native HTML `title` attribute for level toggles, custom CSS tooltip for compound controls

**Rationale:** Level toggle buttons are simple single-purpose controls. Replacing their existing `title` attribute with one that includes the shortcut (e.g., `"Toggle Verbose [V]"`) is sufficient and has zero JS cost.

The Clear button and search input need richer tooltip layout (icon + text + key badge), so a custom CSS tooltip (`<div class="tooltip">`) using `data-tooltip` attributes is appropriate.

**Alternatives considered:**
- **Pure `title` attribute everywhere**: Cannot style `title` tooltips — they'd look different per OS/browser and can't show the `<kbd>` styling for keys. Rejected.
- **JS-driven tooltip library (e.g., Tippy.js, Floating UI)**: Overkill for 10 static tooltips. The project has zero npm client-side dependencies. Adding a library for this is disproportionate. Rejected.
- **CSS-only with `::before`/`::after` pseudo-elements**: Cannot position relative to a wrapper when the target is an `<input>` (inputs can't have pseudo-elements in most browsers). Rejected.

### Decision: Tooltip content stored in `data-tooltip` attribute

Each tooltip-having element gets a `data-tooltip` attribute with the description and key, e.g.:

```html
<input data-tooltip="Filter logs" data-key="/">
<button data-tooltip="Clear logs" data-key="C">
```

A single reusable CSS tooltip component reads these attributes via `attr()` or the tooltip markup is inline next to the control.

**Simplified approach**: Inline `<span class="tooltip">` siblings inside a wrapper, shown via CSS `:hover` on the wrapper. No JS needed.

### Decision: Tooltip positioning — above the control

Tooltips appear above their control (`bottom: 100% + gap`) to avoid obscuring the control and to stay within the header/footer boundaries without overflow issues.

## Risks / Trade-offs

- **Tooltip overlap with header border** → Mitigation: Add `margin-bottom` to position tooltips just inside the header, using `z-index` to float above sibling elements.
- **Touch devices don't have hover** → Mitigation: Acceptable trade-off. Touch users already cannot use keyboard shortcuts effectively. This is an enhancement for mouse/keyboard users.
- **Extra HTML markup on level toggles** → Mitigation: Replacing the `title` attribute with a `data-tooltip-key` and inline tooltip `<span>` keeps the change minimal. Only ~6 extra `span` elements.

## Migration Plan

This is a pure presentational change with no data migration, API changes, or deployment steps. Ship as a regular client update.

Rollback: Remove `data-tooltip`, `data-key`, and tooltip `<span>` markup from `client/index.html`, remove tooltip CSS — revert the single file commit.

## Open Questions

- Should the tooltip style match the existing `<kbd>` styling in the footer for visual consistency? (Recommendation: yes, use the same `bg-surface-variant px-1 rounded` pattern.)
- Should tooltips also show on focus (for keyboard navigation accessibility)? Not in scope for this change.
