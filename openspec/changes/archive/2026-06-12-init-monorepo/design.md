## Context

The project is currently documentation-only — no `package.json`, no source code exists yet. `docs/architecture.md` defines a planned structure with `server/` (Node.js + `ws`) and `client/` (vanilla HTML/CSS/JS). Root-level files are `CONTEXT.md`, `DESIGN.md`, `.gitignore`, `docs/`, `.opencode/`, `openspec/`, and `.pi/`.

The change establishes a monorepo so both packages share root-level tooling while being independently developable and buildable.

## Goals / Non-Goals

**Goals:**

- Root `package.json` with npm workspaces (`server/`, `client/`)
- `server/` package with its own `package.json`, `tsconfig.json`, and dependencies
- `client/` package with its own `package.json` and build config
- Shared `tsconfig.base.json` at root
- Proper `.gitignore` covering all build artifacts
- Workspace scripts: `dev`, `build`, `lint`, `start`

**Non-Goals:**

- Implementing server or client logic (deferred to implementation)
- CI/CD pipelines
- Publishing to npm
- Docker configuration

## Decisions

1. **npm workspaces** over pnpm/yarn — Zero additional tooling installation. npm 9+ ships with Node 18+, which is already the target.
2. **Separate `tsconfig.json` per package** inheriting from root — Each package may need different `compilerOptions` (e.g., `server/` targets Node ESM/CJS, `client/` targets browser). Root `tsconfig.base.json` holds shared settings.
3. **Server uses CommonJS** initially — `ws` and Node built-ins work without ESM ceremony. Migrate to ESM later if needed.
4. **Client uses Vite** — Zero-config HMR dev server, native TS support, and builds static files into `dist/`. Lightweight compared to webpack.
5. **`server/` source in `src/`** — Keep source separate from config files (`package.json`, `tsconfig.json`, `node_modules/`).
6. **`client/` source at root of package** — Vite convention: `index.html` at package root, source in `src/`.

## Risks / Trade-offs

- [npm workspaces hoisting] → Hoisted dependencies may cause version conflicts if server and client require different versions of the same package. Mitigation: pin versions explicitly in each package's `package.json` and verify with `npm ls`.
- [Vite adds build step for client] → The existing plan used vanilla HTML/CSS/JS with no build. Trade-off: dev convenience (HMR, TS) vs simplicity. Acceptable since the project already targets Node 18+.
- [Moving existing files] → No existing code to move (project is documentation-only), so migration risk is zero.
