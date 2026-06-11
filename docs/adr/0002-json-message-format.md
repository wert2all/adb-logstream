# Structured JSON over WebSocket

Each logcat line is parsed server-side into a JSON object with fields: `timestamp`, `pid`, `tid`, `level`, `tag`, `message`. This was chosen over raw text to offload parsing work from the client and to enable straightforward filtering, sorting, and color-coding by level and tag on the client.

**Consequences:** The server must handle edge cases where `adb logcat` output does not match the expected format (e.g. continuation lines, device disconnect messages). Unparseable lines should still be forwarded with a raw fallback.
