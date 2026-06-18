# HTTP Static Serving

## Purpose

Define how the server serves the pre-built Angular client over HTTP on the same port as the WebSocket, enabling browser access without a separate development server.

## ADDED Requirements

### Requirement: HTTP server creation

The server SHALL create an HTTP server using Node.js built-in `http` module.

#### Scenario: HTTP server starts on startup

- **WHEN** the server process starts
- **THEN** it SHALL create an `http.Server` instance listening on port `3000`

### Requirement: Static file serving

The HTTP server SHALL serve static files from the compiled Angular client directory.

#### Scenario: Request for existing static file

- **WHEN** the server receives an HTTP request for a path that corresponds to an existing file in `client/dist/client/browser/`
- **THEN** it SHALL respond with `200 OK` and the file contents
- **AND** it SHALL set an appropriate `Content-Type` header based on file extension

#### Scenario: Request for non-existent file falls back to index.html

- **WHEN** the server receives an HTTP request for a path that does not correspond to an existing file
- **THEN** it SHALL respond with `200 OK` and the contents of `client/dist/client/browser/index.html`
- **AND** it SHALL set `Content-Type: text/html`

### Requirement: Shared port with WebSocket

The WebSocket server SHALL share the same HTTP server and port.

#### Scenario: WebSocket attaches to HTTP server

- **WHEN** the server starts
- **THEN** the `WebSocketServer` SHALL be constructed with `{ server: httpServer }`
- **AND** WebSocket connections SHALL be accepted on `ws://localhost:3000`

### Requirement: Runtime check for client build directory

The server SHALL verify the client build directory exists at startup and log a clear error if it does not.

#### Scenario: Missing client build directory

- **WHEN** the server starts and `client/dist/client/browser/` does not exist
- **THEN** it SHALL log an error message indicating the missing directory
- **AND** it SHALL suggest running `npm run build`

### Requirement: Request logging

The HTTP server SHALL log each incoming request with its method and path.

#### Scenario: HTTP request received

- **WHEN** the server receives an HTTP request
- **THEN** it SHALL log the request method and path to the console
