## Why

The project currently has a flat structure with no package management, no separation between server and client code, and no dependency management. This makes it hard to develop, build, and deploy the server and client independently. Restructuring into a monorepo with workspaces solves this by giving each part its own `package.json`, shared tooling configuration, and clear boundaries.

## What Changes

- Initialize root `package.json` with npm workspaces pointing to `server/` and `client/`
- Move existing server code into `server/` with its own `package.json`, TypeScript config, and dependencies
- Create `client/` directory with its own `package.json` and build setup
- Add shared TypeScript config at root level
- Add `.gitignore` entries for `node_modules`, build artifacts, etc.
- Add workspace scripts for common tasks (dev, build, lint) in root `package.json`

## Capabilities

### New Capabilities
- `server-package`: Node.js server package with its own dependencies, scripts, and TypeScript configuration
- `client-package`: Client package with its own build pipeline, dependencies, and TypeScript configuration
- `monorepo-root`: Root workspace configuration including shared TypeScript config, workspace scripts, and `.gitignore`

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- Project root gets a `package.json` and `tsconfig.base.json`
- Existing files (`CONTEXT.md`, `DESIGN.md`, `docs/`, `openspec/`, `.opencode/`) stay at root
- Server source files move under `server/`
- New `client/` directory created
- All developers need to run `npm install` from root after the change
