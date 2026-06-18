## 1. Package Configuration

- [x] 1.1 Add `bin` entry to root `package.json` mapping `adb-logstream` to `server/dist/index.js`
- [x] 1.2 Add `files` whitelist to root `package.json` including `server/dist/`, `client/dist/client/browser/`, `README.md`, and `LICENSE`
- [x] 1.3 Add `prepublishOnly` script to root `package.json` with value `"npm run build"`
- [x] 1.4 Move `ws` and `uuid` from `server/package.json` `dependencies` to root `package.json` `dependencies`
- [x] 1.5 Move `@types/ws` and `@types/uuid` from `server/package.json` `devDependencies` to root `package.json` `devDependencies`
- [x] 1.6 Move `@ng-icons/core` and `@ng-icons/phosphor-icons` from root `package.json` `dependencies` to `client/package.json` `dependencies`
- [x] 1.7 Remove empty `dependencies` object from `server/package.json` if present after move
- [x] 1.8 Verify `npm run lint` passes after dependency reorganization

## 2. Server Code Changes

- [x] 2.1 Add `#!/usr/bin/env node` as the first line of `server/src/index.ts`
- [x] 2.2 Import `http` and `path` modules at the top of `server/src/index.ts`
- [x] 2.3 Replace standalone `WebSocketServer` creation with `http.createServer()` and pass it to `WebSocketServer({ server })`
- [x] 2.4 Implement HTTP request handler that resolves file paths relative to `__dirname` under `../../client/dist/client/browser/`
- [x] 2.5 Add file extension to `Content-Type` mapping for `.html`, `.js`, `.css`, `.json`, `.png`, `.svg`, `.ico`, `.woff`, `.woff2`
- [x] 2.6 Implement SPA fallback: serve `index.html` for requests that do not match an existing file
- [x] 2.7 Add runtime check at startup that verifies the client build directory exists; log an error with suggestion to run `npm run build` if missing
- [x] 2.8 Add request logging (method and URL) to the HTTP request handler
- [x] 2.9 Update startup log message from `WebSocket server listening on ws://localhost:${PORT}` to `adb-logstream server running at http://localhost:${PORT}`
- [x] 2.10 Update `shutdown()` to close the HTTP server (`server.close()`) before exiting
- [x] 2.11 Replace `wss.close()` in `shutdown()` with closing the HTTP server (which also closes the WebSocket server)
- [x] 2.12 Build the server (`npm run build -w server`) and verify `server/dist/index.js` starts with the shebang line
- [x] 2.13 Run the built server and verify it starts without errors, serves static files, and accepts WebSocket connections

## 3. Documentation

- [x] 3.1 Update `README.md` Quick start section to list `npx adb-logstream` as the first option
- [x] 3.2 Add "Local development" subsection under Quick start with the existing clone/build/start steps
- [x] 3.3 Add note in `README.md` Requirements section that `adb` in PATH is also required when running via `npx`
- [x] 3.4 Update `AGENTS.md` Build and Deployment section to include a Publishing checklist
- [x] 3.5 Add Versioning subsection to `AGENTS.md` referencing the existing release-please workflow
- [x] 3.6 Update `AGENTS.md` Setup Commands table with the new `prepublishOnly` script and `npx` usage

## 4. Verification

- [x] 4.1 Run `npm run lint` for both workspaces and confirm zero errors
- [x] 4.2 Run `npm run build` and confirm both client and server compile successfully
- [x] 4.3 Start the built server and open `http://localhost:3000` in a browser; confirm the Angular client loads
- [x] 4.4 Confirm WebSocket connections work (client shows "CONNECTED" status and receives log entries)
- [x] 4.5 Confirm graceful shutdown works (Ctrl+C closes HTTP server, WebSocket server, and adb process)
- [x] 4.6 Confirm `node server/dist/index.js` starts the server directly without errors
- [x] 4.7 Review root `package.json` to ensure `dependencies` contains only `ws` and `uuid` (plus any unavoidable transitive deps)
- [x] 4.8 Review `client/package.json` to ensure `@ng-icons/core` and `@ng-icons/phosphor-icons` are present
