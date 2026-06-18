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
- `adb` in PATH (also required when running via `npx`)
- Android device connected via USB with debugging enabled (or emulator)

## Quick start

### Using npx (no install required)

```bash
npx adb-logstream
# → adb-logstream server running at http://localhost:3000
```

### Local development

```bash
git clone <url>
cd adb-logstream
npm install
npm run build
npm start
```

The server serves the pre-built client on [http://localhost:3000](http://localhost:3000).

#### Development mode

```bash
npm run dev        # starts server + client in parallel via concurrently
```

`npm run dev` uses [concurrently](https://github.com/open-cli-tools/concurrently) to run both the server (with `nodemon` hot reload) and the client (Angular dev server) in parallel. Each process is labeled with its color-coded name in the terminal output for easy identification.

Open [http://localhost:4200](http://localhost:4200) for the Angular dev client (HMR enabled). The WebSocket proxy to the server is configured in `proxy.conf.json`.

## Project structure

```
adb-logstream/
├── server/                # TypeScript, Node.js, ws
│   ├── src/
│   │   └── index.ts       # HTTP server, WebSocket broadcast, adb process, logstream parser
│   ├── package.json
│   └── tsconfig.json
├── client/                # Angular 22+, standalone components, Tailwind CSS (PostCSS)
│   ├── src/
│   │   ├── index.html            # Page layout <app-root>
│   │   ├── main.ts               # Bootstrap Angular AppComponent
│   │   ├── styles.css            # Tailwind imports + custom styles (@theme block)
│   │   └── app/
│   │       ├── models/
│   │       │   └── logstream.model.ts      # LogstreamEntry, ConnectionStatus types
│   │       ├── services/
│   │       │   └── websocket.service.ts    # WebSocket + reconnect + dispatch into NgRx Store
│   │       ├── store/
│   │       │   ├── stream/                 # NgRx feature: entries, filters, selection, autoscroll
│   │       │   │   ├── stream.actions.ts
│   │       │   │   ├── stream.reducers.ts
│   │       │   │   ├── stream.effects.ts
│   │       │   │   ├── stream.types.ts
│   │       │   │   └── local-storage.service.ts  # Persistence for filters + autoscroll
│   │       │   └── notification/           # NgRx feature: banner messages
│   │       │       ├── notification.actions.ts
│   │       │       ├── notification.reducers.ts
│   │       │       └── notification.types.ts
│   │       ├── app.types.ts          # Level, KeyboardShortcut, effect configs
│   │       ├── app.config.ts         # NgRx providers (store, effects, devtools)
│   │       └── components/
│   │           ├── app/                   # Root layout (header, banner, main, footer)
│   │           ├── header/                # Brand, status badge, search, package filter, level toggles, clear, copy
│   │           ├── package-filter/        # Package name filter input with datalist suggestions
│   │           ├── search-bar/            # Search input with clear button (debounced 300ms)
│   │           ├── level-toggles/         # V/D/I/W/E/F toggle buttons
│   │           ├── notification-banner/   # Dismissable notification banner (success/error)
│   │           ├── log-list/              # Log container with scroll detection
│   │           ├── log-row/               # Single log entry row with selection checkbox
│   │           └── footer/                # Keyboard shortcuts + auto-scroll toggle + copy
│   ├── angular.json           # Angular CLI config with proxy
│   ├── proxy.conf.json        # WebSocket proxy to :3000
│   ├── postcss.config.json    # PostCSS with @tailwindcss/postcss
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── adr/                  # Architecture decision records (10 ADRs)
├── openspec/                 # OpenSpec specs and change archives
├── CONTEXT.md                # Domain glossary
├── DESIGN.md                 # Design system spec (Material-like dark theme)
└── package.json              # Root workspace config
```

## Configuration

| Setting                   | Value                                   |
| ------------------------- | --------------------------------------- |
| Server port               | 3000 (fixed)                            |
| adb path                  | Resolved from PATH                      |
| Logstream format          | `long` (parsed into JSON)               |
| Max DOM entries           | 5000                                    |
| Reconnect delay           | 3 seconds                               |
| Search debounce           | 300ms                                   |
| Filtering                 | Client-side only                        |
| Notification auto-dismiss | 10 seconds                              |
| State management          | NgRx Store + Effects (feature slices)   |
| Dev runner                | concurrently (parallel server + client) |

## Features

- Real-time streaming via WebSocket
- All 6 log levels (V/D/I/W/E/F) with color coding
- Level toggles with localStorage persistence
- Text search with `<mark>` highlighting (debounced 300ms)
- Auto-scroll with manual-scroll detection, toggleable (`A` key)
- DOM cap at 5000 entries to prevent memory growth
- Connection status indicator (connected / reconnecting / disconnected)
- Notification banner for status messages and operation feedback (auto-dismiss after 10s)
- Entry selection via checkboxes with level-tinted highlighting
- Copy selected entries to clipboard as JSON (header + footer buttons)
- Total received entry count in header
- Auto-reconnect on device disconnect (3s delay)
- Keyboard shortcuts — `/` search, `Esc` cancel, `C` clear, `A` toggle auto-scroll, `V`/`D`/`I`/`W`/`E`/`F` toggle levels
- Multi-client support (multiple browser tabs)
- NgRx Store + Effects for state management with Angular `selectSignal()` integration
- Tailwind CSS v4 via PostCSS (build-time tree-shaking)
- Graceful server shutdown (SIGINT / SIGTERM)

## Architecture

### State Management

The client uses **NgRx Store + Effects** with two feature slices:

| Feature             | State                                                     | Selectors                                                                                     |
| ------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `streamState`       | entries, filters, selection, autoScroll, connectionStatus | `selectEntries`, `selectQueryString`, `selectLevelFilters`, `hasSelected`, `selectAutoScroll` |
| `notificationState` | banner messages (auto-dismiss)                            | `selectOpenMessages`                                                                          |

Components read state via `this.store.selectSignal(streamFeature.selectXxx)` and dispatch actions via `this.store.dispatch(streamActions.xxx())`. Side effects (localStorage persistence, clipboard, keyboard routing, notification feedback) are handled by NgRx Effects (functional pattern with `{ functional: true }`).

### Component Architecture

| Component                     | Responsibility                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `AppComponent`                | Root layout; listens for keyboard shortcuts, bootstraps WebSocket                         |
| `HeaderComponent`             | Brand logo, connection status, search bar, level toggles, entry count, clear/copy buttons |
| `SearchBarComponent`          | Debounced search input with clear button                                                  |
| `LevelTogglesComponent`       | V/D/I/W/E/F toggle buttons with active state                                              |
| `NotificationBannerComponent` | Auto-dismissing status banners (success/error)                                            |
| `LogListComponent`            | Scrollable log container with auto-scroll on new entries                                  |
| `LogRowComponent`             | Single log row: checkbox, timestamp, level, tag, message with search highlighting         |
| `FooterComponent`             | Keyboard shortcut legend, auto-scroll toggle, copy button                                 |

### Data Flow

```
adb logcat -v long
    → server/index.ts: parseLine() → JSON { uuid, timestamp, pid, tid, level, tag, message }
        → broadcast("entry", ...) over WebSocket
            → WebSocketService.onmessage
                → store.dispatch(streamActions.appendEntry({ entry }))
                    → streamReducer (filter/append/cap at 5000)
                        → component selectSignal() picks up change
                            → Angular @for re-renders
```

## Docs

- [ADRs](docs/adr/) — why each decision was made
- [Design system](DESIGN.md) — colors, typography, layout, components
- [Domain glossary](CONTEXT.md) — terminology
- [AGENTS.md](AGENTS.md) — project conventions for AI coding agents
