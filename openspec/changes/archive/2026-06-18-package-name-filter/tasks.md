## 1. Server — PID Resolution Timer

- [x] 1.1 Add 2-second interval timer alongside existing adb process in `server/src/index.ts`
- [x] 1.2 Spawn `adb shell ps -A -o PID,NAME` each tick, parse stdout, build Map<number,string>
- [x] 1.3 Replace previous map entirely on successful parse; keep old map on failure
- [x] 1.4 Handle first-tick failure gracefully (all entries get `packageName: null`)

## 2. Server — Entry Enrichment

- [x] 2.1 Add `packageName?: string | null` to `LogstreamEntry` interface
- [x] 2.2 Look up entry PID in current map during `emitEntry()`; attach `packageName` or `null`
- [x] 2.3 Verify broadcast JSON includes `packageName` field (backward-compatible)

## 3. Client — Model & NgRx Store

- [x] 3.1 Add `packageName: string | null` to `LogEntry` model interface
- [x] 3.2 Add `packageFilter: string | null` to `StreamState` interface with initial value `null`
- [x] 3.3 Add `setPackageFilter` action to stream actions
- [x] 3.4 Add reducer case for `setPackageFilter` in stream reducer
- [x] 3.5 Add memoized selector for unique package names from current entries
- [x] 3.6 Extend existing filtering selector to also filter by `packageFilter` (case-insensitive substring match)

## 4. Client — Package Filter UI

- [x] 4.1 Add package name filter `<input>` with `<datalist>` to the header component template
- [x] 4.2 Wire input value changes to dispatch `setPackageFilter` action
- [x] 4.3 Populate datalist options from the unique package names selector
- [x] 4.4 Style the control with Tailwind to match existing header controls

## 5. Client — Keyboard Shortcut

- [x] 5.1 Add `.` (period) key handler to the keyboard service/effect
- [x] 5.2 Ensure `.` focuses the package filter input when no editable input is focused
- [x] 5.3 Ensure `.` inserts normally when typing in search or package filter inputs

## 6. Documentation

- [x] 6.1 Verify `packageName` term in CONTEXT.md is accurate (already present)
- [x] 6.2 Confirm ADR-0011 covers the decisions (already exists)
