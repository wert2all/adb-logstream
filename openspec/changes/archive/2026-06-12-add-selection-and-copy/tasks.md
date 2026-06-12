## 1. LogStateService — Selection State

- [x] 1.1 Add `selectedUuids = signal<Set<string>>(new Set())` to `LogStateService`
- [x] 1.2 Add `toggleSelection(uuid: string)` method — adds/removes UUID from the set
- [x] 1.3 Add `clearSelection()` method — resets the set to empty
- [x] 1.4 Add `isSelected = computed((uuid) => ...)` or helper method to check if a UUID is selected
- [x] 1.5 Add `getSelectedEntries = computed(...)` — filters `entries()` by `selectedUuids()` and returns `LogstreamEntry[]`
- [x] 1.6 Add `hasSelection = computed(() => this.selectedUuids().size > 0)`
- [x] 1.7 Add `copySelected()` method — calls `navigator.clipboard.writeText()`, clears selection, shows feedback

## 2. LogRowComponent — Service-Driven Selection

- [x] 2.1 Remove local `selected` signal from `LogRowComponent`
- [x] 2.2 Inject `LogStateService` into `LogRowComponent`
- [x] 2.3 Replace `selected()` reads with `logState.isSelected(entry.uuid)`
- [x] 2.4 Replace `toggleSelected()` to call `logState.toggleSelection(entry.uuid)`

## 3. Header — Copy Button

- [x] 3.1 Add Copy button to `header.component.html` next to Clear, wrapped in `@if (logState.hasSelection())`
- [x] 3.2 Add `copyLogs()` method to `HeaderComponent` that calls `logState.copySelected()`
- [x] 3.3 Style the Copy button consistently with existing Clear button

## 4. Footer — Copy Button

- [x] 4.1 Add Copy button to `footer.component.html`, visible only when `logState.hasSelection()`
- [x] 4.2 Add `copyLogs()` method to `FooterComponent` that calls `logState.copySelected()`

## 5. Copy Feedback

- [x] 5.1 Add a "Copied!" feedback mechanism (toast or inline text) that appears briefly after copy
- [x] 5.2 Ensure feedback auto-dismisses after ~2 seconds
- [x] 5.3 Handle clipboard API errors gracefully (keep selection on failure)

## 6. Verification

- [x] 6.1 Run `npm run lint` — ensure no type errors
- [x] 6.2 Manual test: select entries → Copy button appears → click Copy → clipboard has JSON array → selection clears → "Copied!" shown
- [x] 6.3 Manual test: deselect all → Copy button disappears
