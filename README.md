![ADB Logstream Viewer](images/logo.png)

# ADB Logstream Viewer

A minimalistic web-based viewer for Android `adb logcat` output. Stream logs from your device in real time, right in the browser.

## How it works

```
device ──USB──▶ adb daemon ──▶ server (:3000) ──WebSocket──▶ browser
```

The server spawns `adb logcat -v long`, parses each entry into structured JSON, and broadcasts it to all connected browser clients via WebSocket. The client renders a searchable, filterable, auto-scrolling log list.

## Requirements

- Node.js 18+
- `adb` in PATH
- Android device connected via USB with debugging enabled (or emulator)

## Quick start

```bash
npm install
npm run build
npm start
```

The server serves the pre-built client on [http://localhost:3000](http://localhost:3000).

#### Development

```bash
npm run dev        # starts server + client in parallel via concurrently
```

`npm run dev` uses [concurrently](https://github.com/open-cli-tools/concurrently) to run both the server (with `nodemon` hot reload) and the client (Angular dev server) in parallel. Each process is labeled with its color-coded name in the terminal output for easy identification.

Open [http://localhost:4200](http://localhost:4200) for the Angular dev client (HMR enabled). The WebSocket proxy to the server is configured in `proxy.conf.json`.

## Project structure

```
adb-logstream/
├── server/              # TypeScript, Node.js, ws
│   ├── src/
│   │   └── index.ts     # HTTP server, WebSocket broadcast, adb process, logstream parser
│   ├── package.json
│   └── tsconfig.json
├── client/              # Angular 21+, standalone components, Tailwind CSS (PostCSS)
│   ├── src/
│   │   ├── index.html         # Page layout <app-root>
│   │   ├── main.ts            # Bootstrap Angular AppComponent
│   │   ├── styles.css         # Tailwind imports + custom styles
│   │   ├── app/
│   │   │   ├── models/
│   │   │   │   └── logstream.model.ts   # LogstreamEntry, ConnectionStatus types
│   │   │   ├── services/
│   │   │   │   ├── log-state.service.ts     # Signals-based state (entries, filters, search)
│   │   │   │   ├── websocket.service.ts     # WebSocket + reconnect + message dispatch
│   │   │   │   └── local-storage.service.ts # localStorage persistence
│   │   │   └── components/
│   │   │       ├── app/                 # Root layout (header, banner, main, footer)
│   │   │       ├── header/              # Brand, status badge, search, toggles, clear
│   │   │       ├── search-bar/          # Search input with clear button
│   │   │       ├── level-toggles/       # V/D/I/W/E/F toggle buttons
│   │   │       ├── connection-banner/   # Connection error banner
│   │   │       ├── log-list/            # Log container with scroll detection
│   │   │       ├── log-row/             # Single log entry row
│   │   │       └── footer/              # Keyboard shortcuts + auto-scroll toggle
│   │   └── app.config.ts
│   ├── angular.json         # Angular CLI config with proxy
│   ├── proxy.conf.json      # WebSocket proxy to :3000
│   ├── postcss.config.json  # PostCSS with @tailwindcss/postcss
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── adr/             # Architecture decision records (8 ADRs)
├── openspec/            # OpenSpec specs and change archives
├── CONTEXT.md           # Domain glossary
├── DESIGN.md            # Design system spec (Material-like dark theme)
└── package.json         # Root workspace config
```

## Configuration

| Setting          | Value                                   |
| ---------------- | --------------------------------------- |
| Server port      | 3000 (fixed)                            |
| adb path         | Resolved from PATH                      |
| Logstream format | `long` (parsed into JSON)               |
| Max DOM entries  | 5000                                    |
| Reconnect delay  | 3 seconds                               |
| Filtering        | Client-side only                        |
| Dev runner       | concurrently (parallel server + client) |

## Features

- Real-time streaming via WebSocket
- All 6 log levels (V/D/I/W/E/F) with color coding
- Level toggles with localStorage persistence
- Text search with `<mark>` highlighting
- Auto-scroll with manual-scroll detection
- DOM cap at 5000 entries to prevent memory growth
- Connection status indicator (connected / reconnecting / disconnected)
- Connection banner for server/status messages
- Auto-reconnect on device disconnect
- Keyboard shortcuts — `/` search, `c` clear, `v`/`d`/`i`/`w`/`e`/`f` toggle levels, `Esc` cancel
- Multi-client support (multiple browser tabs)
- Angular signals for reactive state (no RxJS)
- Tailwind CSS v4 via PostCSS (build-time tree-shaking)
- Graceful shutdown (SIGINT / SIGTERM)

## Docs

- [ADRs](docs/adr/) — why each decision was made
- [Design system](DESIGN.md) — colors, typography, layout, components
- [Domain glossary](CONTEXT.md) — terminology
- [AGENTS.md](AGENTS.md) — project conventions for AI coding agents
