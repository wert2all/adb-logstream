# Architecture

```
┌─────────────┐  adb logcat -v long  ┌─────────────┐  WebSocket (JSON)  ┌─────────────┐
│             │ ───────────────────▶ │             │ ──────────────────▶ │             │
│  adb daemon │                      │   Server    │                     │   Client    │
│             │ ◀─────────────────── │  (Node.js)  │ ◀────────────────── │  (Browser)  │
│  (device)   │   USB / TCP          │  :3000      │   connect           │             │
└─────────────┘                      └─────────────┘                     └─────────────┘
                                            │                                   │
                                            │ broadcast                         │ filter
                                            │ to all                            │ + search
                                      ┌─────┴─────┐                           │
                                      │           │                     ┌─────┴─────┐
                                      │ Client 2  │                     │ Client 1  │
                                      │ (tab 2)   │                     │ (tab 1)   │
                                      └───────────┘                     └───────────┘
```

## Server (`server/`)

- **Port**: 3000 (fixed)
- **Stack**: Node.js + `ws` library (WebSocket)
- **Entry point**: `node server/index.js` via `npm start`
- **Responsibilities**:
  - Spawn `adb logcat -v long` from PATH on startup
  - Parse each line into structured JSON
  - Broadcast JSON to all connected WebSocket clients
  - Auto-restart `adb logcat` on disconnect (3s delay)
  - Serve static client files (optional, or separate)

### server/adb.js — Child process management

Керує процесом `adb logcat -v long`:

1. **Запуск** — `spawn('adb', ['logcat', '-v', 'long'])`. adb шукається в PATH. Якщо adb не знайдено — `error` на процесі.
2. **Парсинг** — `logcat -v long` виводить записи в форматі:
   ```
   [ 06-11 22:47:01.123  1234: 1235 I/ActivityManager ]
   Start proc com.example.app
   ```
   Перший рядок — заголовок з поляними (timestamp, pid, tid, level, tag). Наступні рядки до наступного заголовка — тіло повідомлення (`message`). Потрібен простий автомат: чекає заголовок → збирає тіло → при наступному заголовку повертає готовий entry → починає знову.
3. **Обробка помилок** — на `proc.on('close')` надіслати status-повідомлення клієнтам і перезапустити `adb logcat` через 3 секунди. На `stderr` — переслати текст як status.
4. **Інтерфейс** — експортує функцію `start(onEntry, onStatus)`, де `onEntry` викликається з об'єктом `{ timestamp, pid, tid, level, tag, message }`, а `onStatus` — з `{ message: string }`.

### server/index.js — HTTP + WebSocket

1. **HTTP сервер** — віддає статичні файли з `client/` (index.html, style.css, app.js). Мінімальний роутинг: `/` → `index.html`, все інше → файл з `client/`.
2. **WebSocket** — підключення через `ws` на тому ж порту. При новому підключенні — додати клієнта до пулу.
3. **Бродкаст** — функція `broadcast(msg)` серіалізує об'єкт у JSON і надсилає всім підключеним клієнтам (readyState === OPEN).
4. **Запуск** — при `npm start` запускає HTTP+WebSocket сервер, потім викликає `start()` з `adb.js`, передаючи `broadcast` як callback для entry і status.

### Залежності

- `ws` — єдина залежність, бібліотека для WebSocket сервера.
- Все інше — вбудовані модулі Node.js: `http`, `child_process`, `fs`, `path`.

### Запуск

```bash
npm install     # встановити ws
npm start       # node server/index.js
```

Сервер стартує на `http://localhost:3000`. При відкритті в браузері віддає `client/index.html`.

### Message format

```json
{
  "type": "entry",
  "timestamp": "06-11 22:47:01.123",
  "pid": 1234,
  "tid": 1235,
  "level": "I",
  "tag": "ActivityManager",
  "message": "Start proc ..."
}
```

Status messages (device disconnect, server info):

```json
{
  "type": "status",
  "message": "Device disconnected. Retrying..."
}
```

## Client (`client/`)

- **Tech**: Vanilla HTML/CSS/JS — no frameworks, no build step
- **Responsibilities**:
  - Connect to WebSocket on `ws://localhost:3000`
  - Render Logcat Entries in real time
  - Text search with highlight
  - Toggle visibility per log level (V/D/I/W/E/F)
  - Indicate connection status (connected / reconnecting)

## Project structure (planned)

```
adb-logcat/
├── docs/
│   ├── architecture.md
│   └── adr/
│       ├── 0001-local-server-with-websocket.md
│       ├── 0002-json-message-format.md
│       ├── 0003-frontend-only-filtering.md
│       ├── 0004-logcat-long-format.md
│       ├── 0005-auto-reconnect-on-device-disconnect.md
│       ├── 0006-vanilla-html-css-js.md
│       └── 0007-no-log-persistence.md
├── server/
│   ├── index.js        # HTTP + WebSocket server
│   └── adb.js          # adb logcat process management
├── client/
│   ├── index.html
│   ├── style.css
│       └── app.js
├── CONTEXT.md
└── package.json
```

## Non-goals

- No log persistence (disk or in-memory buffer)
- No server-side filtering
- No authentication (localhost-only)
- No mobile-responsive design (desktop dev tool)
- No support for multiple devices simultaneously
