# AGENTS.md

## Project Overview

**adb-logstream** – a minimal web‑based viewer for Android `adb logstream`.

- Streams logs from a connected device (`adb logstream -v long`) via a Node.js server.
- Server parses log entries to JSON and broadcasts them over WebSocket.
- Browser client (Angular 21+) renders a searchable, filterable, auto‑scrolling log list.
- Uses Angular signals for state management, Tailwind CSS v4 via PostCSS, and standalone components.

## Setup Commands

- **Install dependencies** (root workspace installs both server and client):
  ```bash
  npm install
  ```
- **Build client and server**:
  ```bash
  npm run build
  ```
- **Start the production server** (serves pre‑built client):
  ```bash
  npm start
  ```
- **Development mode** – runs server and client concurrently with hot‑reload:
  ```bash
  npm run dev
  ```
- **Lint / type‑check**:
  ```bash
  npm run lint
  ```

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
  - Client code in `client/src/app/` — organized by feature (components/, services/, models/).
  - Workspace root `package.json` defines the two workspaces.
- **Naming**: Follow typical TypeScript conventions – camelCase for variables/functions, PascalCase for classes/types, kebab-case for file names.
- **Angular conventions**:
  - All components are standalone (no NgModules).
  - State management via **NgRx Store + Effects**; components read state with `selectSignal()`, dispatch actions via `store.dispatch()`.
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
