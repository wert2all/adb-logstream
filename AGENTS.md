# AGENTS.md

## Project Overview

**adb-logstream** – a minimal web‑based viewer for Android `adb logcat`.

- Streams logs from a connected device (`adb logcat -v long`) via a Node.js server.
- Server parses log entries to JSON and broadcasts them over WebSocket.
- Browser client (Angular 22+) renders a searchable, filterable, auto‑scrolling log list.
- Uses NgRx Store + Effects (functional effects) for state management with `selectSignal()` for reactive reads, Tailwind CSS v4 via PostCSS, and standalone components.

## Setup Commands

| Command                  | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `npm install`            | Install dependencies for both workspaces                           |
| `npm run build`          | Build client and server                                            |
| `npm start`              | Start the production server (serves static client)                 |
| `npm run dev`            | Development mode — server + client with hot‑reload                 |
| `npm run lint`           | Type‑check both workspaces (`tsc --noEmit`)                        |
| `npm run format`         | Format code with Prettier                                          |
| `npx adb-logstream`      | Run published package without installing (uses `bin` entry)        |
| `npm run prepublishOnly` | Triggered automatically before `npm publish`; runs `npm run build` |

## Development Workflow

- `npm run dev` launches:
  - `npm run dev -w server` → TypeScript watch + `nodemon` for hot restart.
  - `npm run dev -w client` → `ng serve` (Angular dev server with HMR).
- Open the client at **http://localhost:4200** (Angular dev server).
- The server listens on **http://localhost:3000** and proxies WebSocket connections for the dev client.
- WebSocket proxy is configured in `client/proxy.conf.json`.
- Environment requirements:
  - Node.js ≥ 18
  - `adb` executable in `PATH`
  - Android device or emulator connected via USB.

## Code Style Guidelines

- **Language**: TypeScript (strict mode enabled via `tsconfig.json`).
- **Commit format**: All commits must follow [Conventional Commits](https://www.conventionalcommits.org/) specification (`<type>(<scope>): <description>`). Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, etc.
- **Formatting**: Use `prettier` or your editor's built‑in TypeScript formatter.
- **Linting**: Run `npm run lint` which invokes `tsc --noEmit` (type‑checking).
- **File organization**:
  - Server code in `server/src/`.
  - Client code in `client/src/app/` — organized by feature (components/, services/, models/, store/).
  - NgRx store features in `client/src/app/store/stream/` and `client/src/app/store/notification/`.
  - Workspace root `package.json` defines the two workspaces.
- **Naming**: Follow typical TypeScript conventions – camelCase for variables/functions, PascalCase for classes/types, kebab-case for file names.
- **Angular conventions**:
  - All components are standalone (no NgModules).
  - State management via **NgRx Store + Effects** (functional effects with `{ functional: true }`); components read state with `selectSignal()`, dispatch actions via `store.dispatch()`.
  - Two feature slices: `streamState` (entries, filters, selection, autoscroll) and `notificationState` (banner messages).
  - Templates use new control flow syntax (`@if`, `@for`, `@defer`).
  - Inject dependencies with `inject()` function (no constructor DI).
  - Tailwind classes in templates; custom CSS only for non‑Tailwind concerns.
- **Tailwind CSS v4**: Theme is configured in `src/styles.css` via `@theme` block (not `tailwind.config.*`). Custom colors are defined as `--color-*` variables.

## Build and Deployment

- **Production build** (client assets + server bundle):
  ```bash
  npm run build
  ```
  - Client output is emitted to `client/dist/client/browser/` by Angular CLI.
  - Server is compiled to `server/dist/`.
- **Run the built server** (serves static client files):
  ```bash
  npm start
  ```
- **Docker (optional)** – you can containerise the app by copying the `dist/` folders and running `node server/dist/index.js` behind a lightweight web server.

### Publishing checklist

Before `npm publish`:

1. Ensure `npm run lint` passes for both workspaces.
2. Run `npm run build` and verify both client and server compile without errors.
3. Verify `server/dist/index.js` starts with `#!/usr/bin/env node`.
4. Confirm the client build exists at `client/dist/client/browser/`.
5. Bump version if needed (release‑please handles this automatically via CI).
6. `npm publish` triggers `prepublishOnly` which runs `npm run build`.

### Versioning

Follow the existing release‑please workflow. `npm publish` happens after a release PR is merged. The root `package.json` version is the source of truth for the published package.

## Pull Request Guidelines

- **Title format**: `[component] short description` (e.g., `[client] add dark theme toggle`).
- **Checks before merge**:
  1. `npm run lint` passes for both workspaces.
  2. Manual verification that the dev server runs without type errors.
- **Review process**: At least one reviewer must confirm that new UI changes do not break existing functionality and that any new server endpoints are documented.

## Additional Notes

- **Documentation**: ADRs are in `docs/adr/`, design spec in `DESIGN.md`, and domain glossary in `CONTEXT.md`.
- **Common gotchas**:
  - Ensure `adb` is in your `PATH`; otherwise the server will fail to start.
  - The client caps the DOM at 5 000 entries to avoid memory bloat.
  - If the device disconnects, the client will automatically attempt to reconnect after 3 seconds.
  - Angular dev server runs on port 4200; server on port 3000.
- **Performance**: Log parsing is done in the server; the client only renders JSON entries.
