## Why

Currently, `adb-logstream` can only be run after cloning the repository and installing dependencies. This creates friction for users who want a quick one-command way to stream Android logs. Publishing to npm enables `npx adb-logstream` as a zero-install invocation, lowering the barrier to entry and making the tool usable in CI environments or by teammates who don't want to set up a development environment.

## What Changes

- Add `bin` entry to root `package.json` pointing to `server/dist/index.js`
- Add `files` whitelist to root `package.json` to only ship compiled artifacts
- Add `prepublishOnly` script to ensure fresh builds before publishing
- Move runtime dependencies (`ws`, `uuid`) from `server/package.json` to root `package.json`
- Move Angular build-time dependencies (`@ng-icons/*`) from root to `client/package.json`
- Add `#!/usr/bin/env node` shebang to `server/src/index.ts`
- Extend the server to create an HTTP server that serves the pre-built Angular client from `client/dist/client/browser/`
- Share the HTTP server with the WebSocket server (same port `:3000`)
- Update server startup log message to show the HTTP URL
- Update `README.md` with `npx adb-logstream` quick-start instructions
- Update `AGENTS.md` with publishing checklist and versioning notes

## Capabilities

### New Capabilities

- `npm-publishability`: Package configuration changes that enable publishing to npm and invocation via `npx adb-logstream`. Includes `bin`, `files`, `prepublishOnly`, and dependency reorganization.
- `http-static-serving`: Server serves the pre-built Angular client over HTTP on the same port as the WebSocket, enabling browser access without a separate dev server.
- `cli-entry-point`: Server executable includes a shebang and behaves as a CLI tool when invoked directly.

### Modified Capabilities

- `websocket-client`: WebSocket server now attaches to an existing HTTP server instead of creating a standalone WebSocket server. The external behavior (client connects to `ws://localhost:3000`) remains unchanged; this is an implementation-level change to port sharing.

## Impact

- **Code**: `server/src/index.ts` (HTTP server creation, static file serving, WebSocketServer attachment)
- **Configuration**: Root `package.json`, `server/package.json`, `client/package.json`
- **Dependencies**: `ws` and `uuid` move to root; `@ng-icons/*` moves to client; no new runtime dependencies added
- **Documentation**: `README.md`, `AGENTS.md`
- **Build output**: Compiled server must include shebang; client build must be present in `client/dist/client/browser/` at publish time
