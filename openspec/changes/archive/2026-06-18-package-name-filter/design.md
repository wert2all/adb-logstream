## Context

Server currently runs `adb logcat -v long`, parses entries to JSON (uuid, timestamp, pid, tid, level, tag, message), and broadcasts over WebSocket. No package name information exists — logcat output only provides PID. Users must mentally map PIDs to apps.

ADR-0011 already covers the decision to resolve packageName via periodic `adb shell ps -A`. ADR-0003 mandates all filtering stays client-side. The existing entry model in both server and client has no `packageName` field.

## Goals / Non-Goals

**Goals:**

- Server resolves PID→packageName for each log entry and includes it in broadcast
- Client filters visible entries by packageName via a select-with-suggestions UI control
- `.` keyboard shortcut focuses the package filter input
- Existing clients that ignore unknown fields continue to work
- `ps -A` failures don't break the stream — stale map survives until next successful tick

**Non-Goals:**

- Server-side pre-filtering by package — ADR-0003 holds
- Multi-package selection — single-select only
- Package name validation or normalization
- PID→packageName via any method other than `ps -A` (per ADR-0011)
- Persisting package name map across server restarts

## Decisions

### Decision: 2-second `ps -A` polling interval

Chosen over event-driven PID resolution (e.g. hooking `logcat` output for process spawns). Simpler to implement, negligible overhead — `ps -A` on modern Android completes in <100ms. 2s balances staleness against CPU cost. 1s would be excessive; 5s would miss short-lived processes.

**Alternatives considered:**

- Parsing `dumpsys activity processes` — more complex, slower, requires root on older Android
- Listening to `logcat` for ActivityManager process-start messages — brittle, format varies by Android version

### Decision: Full map replacement each tick

Instead of incremental diff (delete exited PIDs, add new ones), replace the entire `Map<number,string>` every tick. Simpler code, no risk of stale PID accumulation, at the cost of a transient period where old and new maps coexist during replacement (negligible in single-threaded JS).

### Decision: `null` for unresolved PIDs

When a PID from logcat doesn't appear in the current ps map (process exited between ticks, or kernel thread without a userspace process), set `packageName: null`. Client can still show these entries — they appear unfiltered or can be hidden with an additional filter toggle.

### Decision: Client-side filtering via NgRx selector

Add `packageFilter: string | null` to `streamState`. A new selector filters `filteredEntries` by packageName match (case-insensitive substring, like text search). The filter control dispatches `setPackageFilter` action. This mirrors the existing text search pattern.

**Alternatives considered:**

- Adding to the existing text search query (prefix syntax like `p:com.example`) — would overload search and break highlighting
- Separate component with its own local state — wouldn't enable the selector-based filtering that existing UI patterns use

### Decision: Select element with datalist for suggestions

Use HTML `<input>` + `<datalist>` for the package filter control — lightweight, native UX, no extra dependencies. The datalist options are populated from unique packageNames in the current stream state (computed via memoized selector).

**Alternatives considered:**

- Custom dropdown component — heavier, no benefit for this simple case
- Multi-select tags — explicitly out of scope

### Decision: `.` key to focus package filter

Chosen because `/` already focuses search, `c` clears, `a` toggles auto-scroll, `v/d/i/w/e/f` toggle levels. Period (`.`) is unused, easy to reach, and mnemonic (period = "point to package").

## Risks / Trade-offs

- **[Staleness]** PIDs resolved as `null` during the 2s window between ps ticks → Mitigation: client still shows these entries; users can combine with other filters
- **[No adb in PATH]** If `adb` is missing, `ps -A` fails silently on each tick → Mitigation: already handled by existing adb spawn check on server start; ps failures are silent and non-fatal
- **[Android <8 compatibility]** `ps -A` flag requires Android 8+ → Mitigation: `ps` without `-A` only shows the user's own processes on modern Android; `-A` is the standard flag and Android 8 is already below our practical minimum
- **[Memory]** Map grows with number of running processes (typically 200-400 entries, negligible) → No mitigation needed
- **[Bundle size]** No new npm dependencies for either server or client → No impact
