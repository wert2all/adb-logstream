# Server-side packageName resolution from PID

We add a `packageName` field to each Logstream Entry so the client can filter by Android applicationId. The server resolves it by running `adb shell ps -A` every 2 seconds, building a PID → processName map, and enriching each entry with the matched `packageName` (or `null` if the PID is not in the map).

**Why this approach over alternatives:**

- `adb logcat -v long` does not include the applicationId in its output; it only provides a PID
- Mapping PID → processName via `ps -A` is simple, reliable, and works on all Android versions >= 8
- The process name for user-space apps _is_ the applicationId (e.g. `com.example.app`)
- Including `-v uid` in logcat and mapping via `dumpsys package` was rejected: UID→package mapping requires multiple `pm` queries and doesn't match the PID granularity of individual log lines

**Consequences:**

- The server gains a 2-second interval timer for `ps -A` — negligible overhead
- Entries whose PID exits between `ps` cycles get `packageName: null` (the client can still show them)
- The `packageName` field is added to the WebSocket JSON message; old clients that ignore unknown fields continue to work
- All filtering stays client-side (ADR-0003 still holds)

Status: **implemented**.
