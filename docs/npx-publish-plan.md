# npx Publishing — Implementation Plan

> **Spec only — no implementation.** This document describes what needs to be done, in what order, and why. Actual code/config changes are left for implementation.

## Goal

Make `npx adb-logstream` a valid one‑command invocation that:

1. Installs the package (if not already cached)
2. Starts the server on `:3000`
3. Serves the pre‑built Angular client over HTTP
4. Opens a WebSocket for log streaming

No `git clone`, no `npm install`, no `npm run build`.

## Decisions (already made)

| #   | Decision             | Chosen option                                                                           |
| --- | -------------------- | --------------------------------------------------------------------------------------- |
| 1   | Package name         | `adb-logstream` (available on npm)                                                      |
| 2   | `bin` location       | Root `package.json`                                                                     |
| 3   | `bin` target         | `server/dist/index.js` (with `#!/usr/bin/env node`)                                     |
| 4   | npx behaviour        | Start server on `:3000`; do NOT open browser                                            |
| 5   | Published files      | Whitelist via `"files"` field — `server/dist/` + `client/dist/client/browser/`          |
| 6   | Build before publish | `"prepublishOnly": "npm run build"`                                                     |
| 7   | Server entry point   | `#!/usr/bin/env node` as first line in `server/src/index.ts`                            |
| 8   | Runtime dependencies | `ws`, `uuid` — move from `server/package.json` to root `package.json` as `dependencies` |

---

## 1. Package configuration changes

### 1.1 Root `package.json` — add `bin`

```json
{
  "bin": {
    "adb-logstream": "server/dist/index.js"
  }
}
```

### 1.2 Root `package.json` — add `files` whitelist

```json
{
  "files": [
    "server/dist/",
    "client/dist/client/browser/",
    "README.md",
    "LICENSE"
  ]
}
```

Only ship what is needed at runtime. Source files (`server/src/`, `client/src/`) stay out of the package.

### 1.3 Root `package.json` — add `prepublishOnly` script

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

Ensures the client and server are always freshly compiled before `npm publish`.

### 1.4 Root `package.json` — move runtime dependencies from `server/package.json`

The following entries move from `server/package.json` `dependencies` → root `package.json` `dependencies`:

- `"ws": "^8.18.0"` (plus `@types/ws` → `devDependencies`)
- `"uuid": "^14.0.0"` (plus `@types/uuid` → `devDependencies`)

Server `devDependencies` (`typescript`, `nodemon`) stay in `server/package.json`.

### 1.5 Root `package.json` — clean up unused dependencies

`@ng-icons/core` and `@ng-icons/phosphor-icons` are currently in root `dependencies`. They are Angular build‑time dependencies used only by the client. They should be moved to `client/package.json` `dependencies` to avoid being installed when someone runs `npx adb-logstream` (wasted bandwidth + install time).

**After this change**, root `package.json` `dependencies` should contain only runtime deps needed by the server: `ws`, `uuid`.

### 1.6 Root `package.json` — optional `publishConfig`

Consider adding:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

Not strictly required (package is unscoped), but explicit is better than implicit.

---

## 2. Code changes required

### 2.1 Add `#!/usr/bin/env node` to `server/src/index.ts`

This must be the **first line** of the file. TypeScript preserves shebangs during compilation, so it will appear as the first line of `server/dist/index.js`.

Without it `node` won't know how to execute the file when npm runs the `bin` symlink.

### 2.2 Add HTTP static file serving to the server

The server currently only creates a WebSocket server. It needs to also start an HTTP server (using Node's built-in `http` module) that serves the pre‑built Angular client from the published package's `client/dist/client/browser/` directory.

**What to implement:**

- Create an `http.createServer()` that:
  - Serves static files from the client build directory
  - Falls through to `index.html` for SPA routing (though the app may not need client‑side routing today — safe to include)
- Pass the HTTP server to `WebSocketServer` constructor so WebSocket and HTTP share the same port
- Attach a request logger (similar to the existing console output)

**Serving path** — relative to `server/dist/index.js`:

```
path.join(__dirname, '../../client/dist/client/browser/')
```

This resolves to the correct directory in both local dev and when installed via npm.

**Why built‑in `http` and not Express/serve‑static:**

- Zero additional dependencies — `http` is in Node.js core
- The task is simple: serve a flat directory of static files, fallback to `index.html`
- Keeping the dependency surface small matters for a CLI tool that runs via `npx`

### 2.3 Update server startup log

The current log message reads:

```
WebSocket server listening on ws://localhost:3000
```

Change to:

```
adb-logstream server running at http://localhost:3000
```

(Keeps the message user‑friendly — most users will open the URL in a browser, not connect via WebSocket.)

---

## 3. Documentation changes

### 3.1 `README.md`

**Top of Quick start section** — add a one‑line option:

````markdown
## Quick start

### Using npx (no install required)

```bash
npx adb-logstream
# → adb-logstream server running at http://localhost:3000
```
````

### Local development

```bash
git clone <url>
cd adb-logstream
npm install
npm run dev
```

```

**Move existing Quick start** to a "Local development" subsection.

**Update Requirements section** — add note:

```

- `adb` in PATH (also required when running via npx)

````

### 3.2 `AGENTS.md`

**Add npm‑specific sections after "Build and Deployment":**

- **Publishing checklist** — steps before `npm publish` (clean build, version bump, changelog update)
- **Versioning** — follow existing release‑please workflow; `npm publish` happens after a release PR is merged
- **Scripts reference** — update the Setup Commands table with new/changed scripts

---

## 4. Release workflow changes

After all code changes are merged:

```bash
# 1. Update version (release-please handles this automatically via CI)
# 2. Build (run automatically by prepublishOnly)
npm publish

# Verify:
npx adb-logstream
# → Opens http://localhost:3000 with the Angular client
````

### CI considerations

If using GitHub Actions, add a job to `release-please` workflow that runs `npm publish` when a new release tag is created. Use `NPM_TOKEN` secret for authentication.

---

## 5. Implementation order

| Step | Description                                        | File(s)                               |
| ---- | -------------------------------------------------- | ------------------------------------- |
| 1    | Add `#!/usr/bin/env node` to `server/src/index.ts` | `server/src/index.ts`                 |
| 2    | Add HTTP static serving to server                  | `server/src/index.ts`                 |
| 3    | Move `ws`, `uuid` (and `@types/*`) deps            | `package.json`, `server/package.json` |
| 4    | Move `@ng-icons/*` deps to client                  | `package.json`, `client/package.json` |
| 5    | Add `bin`, `files`, `prepublishOnly` to root pkg   | `package.json`                        |
| 6    | Update `README.md`                                 | `README.md`                           |
| 7    | Update `AGENTS.md`                                 | `AGENTS.md`                           |
| 8    | Publish to npm                                     | —                                     |
