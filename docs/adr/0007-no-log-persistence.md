# No log persistence

Logcat entries are not stored on disk or in a server-side buffer. When a client connects, it only sees entries from that point forward. When the server restarts, all previous entries are gone.

This was chosen to keep the server stateless and minimal. An in-memory ring buffer (e.g. last 10 000 lines) was considered and rejected — it adds complexity for a feature that is not needed at this stage. It can be added later if the need arises.
