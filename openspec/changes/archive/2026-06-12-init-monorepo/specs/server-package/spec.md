## ADDED Requirements

### Requirement: Server package definition
The `server/` directory SHALL contain a `package.json` with `name: "server"`, all runtime dependencies (`ws`), and scripts for `start`, `dev`, and `build`.

#### Scenario: Server package exists
- **WHEN** `npm install` is run from the repository root
- **THEN** `server/node_modules/` contains all declared dependencies

#### Scenario: Server start script
- **WHEN** user runs `npm start -w server`
- **THEN** the server starts on port 3000

### Requirement: TypeScript compilation
The `server/` package SHALL compile TypeScript from `server/src/` to `server/dist/` using `tsc`.

#### Scenario: Build produces dist
- **WHEN** `npm run build -w server` completes
- **THEN** `server/dist/` contains compiled `.js` files mirroring `server/src/` structure

### Requirement: Development mode with watch
The `server/` package SHALL support a `dev` script that runs `tsc --watch` and restarts the server on changes (e.g., via `tsx watch` or `nodemon`).

#### Scenario: Dev mode restarts on change
- **WHEN** a file in `server/src/` is modified while `npm run dev -w server` is running
- **THEN** the server process restarts automatically
