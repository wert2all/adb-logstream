# Auto-reconnect on device disconnect

When the `adb logcat` process exits unexpectedly (e.g. device unplugged), the server catches the `close`/`error` event, broadcasts a status message to all clients (`{ "type": "status", "message": "Device disconnected. Retrying..." }`), and automatically restarts `adb logcat` after a 3-second delay.

This was chosen over crashing the server (which would require a manual restart) or silently reconnecting (which would leave the user unaware of the interruption).

**Consequences:** The server will keep retrying indefinitely. A future improvement could add a max-retry limit or an exponential backoff.
