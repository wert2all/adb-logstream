# CLI Entry Point

## Purpose

Define the requirements for the server to behave as a command-line tool when invoked directly or via `npx`.

## ADDED Requirements

### Requirement: Executable shebang

The compiled server entry point SHALL contain a valid shebang line as its first line.

#### Scenario: Shebang present in compiled output

- **WHEN** inspecting `server/dist/index.js`
- **THEN** the first line SHALL be `#!/usr/bin/env node`

#### Scenario: Shebang present in source

- **WHEN** inspecting `server/src/index.ts`
- **THEN** the first line SHALL be `#!/usr/bin/env node`

### Requirement: Direct execution

The server SHALL execute successfully when run directly as a script.

#### Scenario: Direct node execution

- **WHEN** executing `node server/dist/index.js`
- **THEN** the server SHALL start and listen on port `3000`
- **AND** it SHALL begin streaming adb logcat output to connected clients

### Requirement: Startup log message

The server SHALL log a user-friendly message indicating the HTTP URL on startup.

#### Scenario: Server startup message

- **WHEN** the server starts successfully
- **THEN** it SHALL log `adb-logstream server running at http://localhost:3000`
- **AND** it SHALL NOT log the old WebSocket-only URL format

### Requirement: Graceful shutdown on signals

The server SHALL shut down gracefully when receiving `SIGINT` or `SIGTERM`.

#### Scenario: SIGINT received

- **WHEN** the process receives `SIGINT`
- **THEN** it SHALL close the HTTP server and WebSocket server
- **AND** it SHALL kill the adb child process if running
- **AND** it SHALL exit within 5 seconds

#### Scenario: SIGTERM received

- **WHEN** the process receives `SIGTERM`
- **THEN** it SHALL close the HTTP server and WebSocket server
- **AND** it SHALL kill the adb child process if running
- **AND** it SHALL exit within 5 seconds
