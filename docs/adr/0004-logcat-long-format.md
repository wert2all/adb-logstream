# Use logstream `long` format

The server runs `adb logcat -v long` which produces output like:

```
[ 06-11 22:47:01.123  1234: 1235 I/ActivityManager ]
Start proc ...
```

This format was chosen because it is the easiest to parse reliably with a regular expression (all metadata is on the first line in brackets, the message follows on subsequent lines), and it includes all relevant fields: date, time, PID, TID, level, and tag.

**Considered options:**

- **`brief`** (default) — compact but harder to parse unambiguously because the message itself may contain spaces and colons.
- **`threadtime`** — similar information but a different format; `long` brackets make field boundaries clearer.
