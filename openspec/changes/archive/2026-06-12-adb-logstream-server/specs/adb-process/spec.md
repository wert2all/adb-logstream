## ADDED Requirements

### Requirement: Spawn adb logstream on startup
The system SHALL spawn `adb logstream -v long` as a child process on server startup.
The `adb` executable SHALL be resolved from the system PATH.
The process SHALL run continuously until the server is stopped.

#### Scenario: Server starts and spawns adb
- **WHEN** the server starts
- **THEN** it SHALL spawn `adb logstream -v long` as a child process
- **THEN** the child process SHALL be running

#### Scenario: adb not in PATH
- **WHEN** `adb` is not found on the system PATH
- **THEN** the spawn SHALL emit an error
- **THEN** the server SHALL log the error to console and exit

### Requirement: Detect device disconnect and reconnect
When the `adb logstream` child process exits (e.g., device unplugged), the system SHALL:
1. Send `{ type: "status", message: "Device disconnected. Reconnecting..." }` to all connected clients
2. Wait 3 seconds
3. Restart `adb logstream -v long`
This cycle SHALL repeat indefinitely until the server is stopped.

#### Scenario: Device disconnects and reconnects
- **WHEN** the `adb logstream` process exits
- **THEN** a status message SHALL be sent to all connected clients
- **THEN** the server SHALL wait 3 seconds before attempting restart
- **THEN** `adb logstream -v long` SHALL be spawned again

#### Scenario: Reconnect loop continues indefinitely
- **WHEN** `adb logstream` repeatedly exits after restart
- **THEN** the server SHALL continue the notify-wait-restart cycle indefinitely
- **THEN** no further error SHALL be logged beyond the initial exit detection

### Requirement: Forward adb stderr
Any output from `adb` on stderr SHALL be forwarded to all connected clients as a status message: `{ type: "status", message: "<stderr text>" }`.

#### Scenario: adb writes to stderr
- **WHEN** the adb process writes a line to stderr
- **THEN** the server SHALL send `{ type: "status", message: "<line>" }` to all connected clients
