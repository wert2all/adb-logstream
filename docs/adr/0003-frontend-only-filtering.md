# Filtering and search on client only

All filtering (by level, tag, text search) is performed on the client side. The server sends every logstream entry unfiltered. This keeps the server simple — it only spawns `adb logstream` and broadcasts — and allows each connected client to maintain its own independent filter state.

**Consequences:** All clients receive the full logstream output, which may be bandwidth-heavy on very verbose devices. If this becomes a problem, a server-side level filter can be added later.
