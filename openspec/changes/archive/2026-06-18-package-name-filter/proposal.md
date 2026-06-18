## Why

adb logcat output shows PIDs but not applicationIds. When debugging a specific app like `com.example.app`, users must mentally map PIDs or guess. Adding server-side PID→packageName resolution and client-side filtering lets users filter log output by Android applicationId directly.

## What Changes

- **Server**: New 2s interval timer runs `adb shell ps -A -o PID,NAME`, builds in-memory `Map<number,string>`, replaces on each tick
- **Server**: Enrich each Logstream Entry with `packageName` field (resolved from PID, or `null` when PID not found)
- **Server**: If `ps -A` fails (device disconnect mid-tick), keep previous map; next successful tick replaces it
- **Client**: Add `packageName` field to entry model and NgRx store state
- **Client**: Add select-with-suggestions UI control for filtering by package name
- **Client**: Keyboard shortcut `.` (period) focuses the package filter input
- **Client**: All filtering stays client-side (per ADR-0003)

## Capabilities

### New Capabilities

- `package-name-resolution`: Server-side PID-to-packageName mapping via periodic `adb shell ps -A`, entry enrichment, and graceful failure handling
- `package-name-filter`: Client-side filter UI (select with suggestions), NgRx store slice for packageName state, and `.` keyboard shortcut to focus the input

### Modified Capabilities

- `keyboard-shortcuts`: Add `.` (period) keybinding requirement to focus the package filter input

## Impact

- **Server**: New `Map<number,string>` in memory; 2s timer with `adb shell ps -A` (negligible overhead per ADR-0011)
- **Client state**: New `packageName` field on `LogEntry` interface; new `packageFilter` query in stream state slice
- **Client UI**: New filter control below header (or alongside existing filters); new keyboard shortcut handler
- **Broadcast format**: JSON entry messages gain optional `packageName` string field; backward-compatible (old clients ignore unknown fields)
- **Docs**: Update CONTEXT.md `packageName` term (already present), ADR-0011 already exists
