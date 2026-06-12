## Why

Users need to export specific log entries for debugging, sharing, or analysis. Currently, there is no way to select and copy individual or multiple log entries from the stream. Adding a selection-and-copy capability allows users to cherry-pick entries and copy their JSON representation to the clipboard.

## What Changes

- Centralize selection state in `LogStateService` as a `signal<Set<string>>` keyed by entry UUID
- Each log row's local `selected` signal is replaced with a centralized selection managed by `LogStateService`
- A "Copy" button appears in the header (next to "Clear") and in the footer (next to auto-scroll) when at least one entry is selected
- Clicking "Copy" copies the selected entries as a JSON array (`JSON.stringify(selectedEntries, null, 2)`) to the system clipboard
- After copying, the selection is cleared and a brief "Copied!" confirmation is shown
- Selection is done only via per-row checkboxes (no Shift+click range select, no "Select All")

## Capabilities

### New Capabilities

- `entry-selection`: Centralized multi-entry selection via checkboxes, managed in `LogStateService` as a `signal<Set<string>>` keyed by entry UUID
- `copy-to-clipboard`: Copy selected entries to clipboard as a formatted JSON array, with conditional Copy button in header/footer and post-copy feedback

### Modified Capabilities

- `log-rendering`: Log rows now read selection state from `LogStateService` instead of local component state

## Impact

- **Client-side services**: `LogStateService` gains `selectedUuids` signal, `toggleSelection(uuid)`, `clearSelection()`, `getSelectedEntries()` computed, `copySelected()` method
- **Client-side components**: `LogRowComponent` reads selection from service instead of local signal; `HeaderComponent` and `FooterComponent` gain conditional Copy button
- **No Server changes**
- **No breaking changes**
- **No new dependencies** — uses native `navigator.clipboard.writeText()`
