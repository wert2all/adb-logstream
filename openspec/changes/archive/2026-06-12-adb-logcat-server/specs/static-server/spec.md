## ADDED Requirements

### Requirement: Serve static client files
The server SHALL serve static files from the `client/` directory over HTTP.
The path `/` SHALL serve `client/index.html`.
Other paths SHALL serve the corresponding file from the `client/` directory (e.g., `/style.css` → `client/style.css`, `/app.js` → `client/app.js`).
The server SHALL use the same port (3000) for both HTTP and WebSocket connections.

#### Scenario: Root path returns index.html
- **WHEN** a client sends a GET request to `/`
- **THEN** the server SHALL respond with the contents of `client/index.html`
- **THEN** the response SHALL have a 200 status code
- **THEN** the response Content-Type SHALL be `text/html`

#### Scenario: CSS file is served
- **WHEN** a client sends a GET request to `/style.css`
- **THEN** the server SHALL respond with the contents of `client/style.css`
- **THEN** the response SHALL have a 200 status code

#### Scenario: JavaScript file is served
- **WHEN** a client sends a GET request to `/app.js`
- **THEN** the server SHALL respond with the contents of `client/app.js`
- **THEN** the response SHALL have a 200 status code

### Requirement: Log server URL on startup
The server SHALL log the URL to the console on startup: `Server running at http://localhost:3000`.

#### Scenario: Server logs URL on start
- **WHEN** the server starts and is listening
- **THEN** it SHALL output `Server running at http://localhost:3000` to the console

### Requirement: Start via npm start
Running `npm start` SHALL start the server.
The `start` script in `package.json` SHALL build and run the server.

#### Scenario: npm start runs the server
- **WHEN** a user runs `npm start`
- **THEN** the TypeScript code SHALL be compiled
- **THEN** the server SHALL start and listen on port 3000

### Requirement: Forward unknown paths to client files
Any path that does not match a static file on disk SHALL return a 404 response.

#### Scenario: Unknown path returns 404
- **WHEN** a client sends a GET request to an unknown path
- **THEN** the server SHALL respond with a 404 status code
