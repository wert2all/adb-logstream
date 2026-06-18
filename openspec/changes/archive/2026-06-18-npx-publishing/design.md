## Context

`adb-logstream` currently requires cloning the repository and running `npm install && npm run build && npm start` before use. The server (`server/src/index.ts`) creates a standalone `WebSocketServer` on port 3000 with no HTTP component. The Angular client is served separately during development (`ng serve` on :4200) and is not served by the server in production.

To enable `npx adb-logstream`, the package must:

1. Be publishable to npm with the correct metadata (`bin`, `files`, `prepublishOnly`)
2. Include a compiled server that can run as a CLI entry point (shebang)
3. Serve the pre-built Angular client statically over HTTP on the same port as the WebSocket
4. Reorganize dependencies so only runtime deps are in root `dependencies`

## Goals / Non-Goals

**Goals:**

- `npx adb-logstream` installs (if needed) and starts a working server on `:3000`
- Browser can open `http://localhost:3000` and see the Angular client
- WebSocket connections continue to work on `ws://localhost:3000`
- Package ships only compiled artifacts (no source files)
- Root `dependencies` contain only server runtime deps (`ws`, `uuid`)

**Non-Goals:**

- No changes to client behavior, UI, or state management
- No new runtime dependencies (Express, `serve-static`, etc.)
- No changes to the WebSocket protocol or message format
- No CI/CD pipeline changes (release-please workflow stays as-is)

## Decisions

### 1. Built-in `http` module for static serving

**Choice:** Use Node.js built-in `http` module with manual file serving instead of Express or `serve-static`.

**Rationale:**

- Zero additional dependencies — keeps the package lightweight for `npx`
- The requirement is simple: serve a flat directory of static files, fallback to `index.html` for SPA routing
- `http` is in Node.js core and sufficient for this use case

**Alternative considered:** Express + `serve-static` — rejected because it adds ~50+ transitive dependencies for a trivial task.

### 2. Shared HTTP + WebSocket server on same port

**Choice:** Create an `http.createServer()` and pass it to the `WebSocketServer` constructor.

**Rationale:**

- Single port simplifies the user experience (one URL for both HTTP and WebSocket)
- The client already connects to `ws://localhost:3000`; no client-side changes needed
- Aligns with standard `ws` library usage pattern

**Implementation detail:**

```typescript
const server = http.createServer(requestHandler);
const wss = new WebSocketServer({ server });
server.listen(PORT);
```

### 3. Static file path resolution

**Choice:** Resolve static files relative to `__dirname` using `path.join(__dirname, '../../client/dist/client/browser/')`.

**Rationale:**

- Works in both local development (from `server/dist/index.js`) and when installed via npm (same relative structure)
- `__dirname` is robust against `cwd` changes

### 4. Dependency reorganization

**Choice:** Move `ws` and `uuid` to root `dependencies`; move `@ng-icons/*` to `client/package.json`.

**Rationale:**

- Root `package.json` is what npm uses when the package is installed via `npx`
- Only server runtime deps should be in root `dependencies` to minimize install time
- `@ng-icons/*` are Angular build-time deps; they belong with the client workspace

### 5. Shebang preservation via TypeScript

**Choice:** Add `#!/usr/bin/env node` as the first line of `server/src/index.ts`.

**Rationale:**

- TypeScript compiler preserves shebangs in output files
- This is the standard way to make a Node.js script executable when referenced by `bin`

## Risks / Trade-offs

| Risk                                                | Mitigation                                                                                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Client build directory missing at runtime           | `prepublishOnly` script ensures `npm run build` runs before publish; add a runtime check that logs a clear error if the directory is missing                 |
| `__dirname` resolution breaks in bundled/ESM builds | Project uses CommonJS (`"type": "commonjs"`); `__dirname` is reliable. If ESM migration happens later, this path logic must be updated                       |
| Users running `npx` without `adb` in PATH           | Same as today — server will exit with an error. Document requirement clearly in README                                                                       |
| File serving without mime-type mapping              | Browser handles `.js`, `.css`, `.html` correctly even without explicit `Content-Type` for local development. For correctness, map common extensions manually |

## Migration Plan

No runtime migration needed — this is a packaging/distribution change. After merge:

1. Maintainer runs `npm publish` (or CI does after release-please merges a release PR)
2. `prepublishOnly` triggers `npm run build`
3. Package is published with compiled artifacts
4. Users can immediately run `npx adb-logstream`

## Open Questions

- Should we add an explicit `--port` CLI argument? (Out of scope for this change, but a natural follow-up)
- Should the server open the browser automatically? (Proposal says no — aligns with common CLI tool behavior)
