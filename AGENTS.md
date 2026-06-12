# AGENTS.md

## Project Overview

**adb-logstream** – a minimal web‑based viewer for Android `adb logstream`.

- Streams logs from a connected device (`adb logstream -v long`) via a Node.js server.
- Server parses log entries to JSON and broadcasts them over WebSocket.
- Browser client (Vite + TypeScript) renders a searchable, filterable, auto‑scrolling log list.
- Uses Tailwind CSS via CDN and plain TypeScript for UI.

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
  - `npm run dev -w client` → Vite dev server with HMR.
- Open the client at **http://localhost:5173** (Vite dev server).
- The server listens on **http://localhost:3000** and proxies WebSocket connections for the dev client.
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
  - Client code in `client/src/`.
  - Workspace root `package.json` defines the two workspaces.
- **Naming**: Follow typical JavaScript/TypeScript conventions – camelCase for variables/functions, PascalCase for classes/types.

## Additional Notes

- **Documentation**: ADRs are in `docs/adr/`, design spec in `DESIGN.md`, and domain glossary in `CONTEXT.md`.
