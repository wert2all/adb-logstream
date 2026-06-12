## ADDED Requirements

### Requirement: Broadcast parsed entries to all clients

Each parsed logstream entry SHALL be serialized to JSON and sent to all connected WebSocket clients.
The message type SHALL be `entry`, with the entry data included in the payload: `{ type: "entry", timestamp, pid, tid, level, tag, message }`.

#### Scenario: New entry is broadcast to all clients

- **WHEN** a logstream entry is parsed
- **THEN** the entry SHALL be serialized to JSON
- **THEN** the JSON message SHALL be sent to every connected WebSocket client
- **THEN** the message SHALL have `type: "entry"` at the top level

### Requirement: Skip disconnected clients

Clients that are not in the OPEN state SHALL be skipped during broadcast.
Skipped clients SHALL be removed from the client pool silently without logging.

#### Scenario: Client disconnects during broadcast

- **WHEN** a client is not in OPEN state
- **THEN** the server SHALL skip sending to that client
- **THEN** the server SHALL remove the client from the client pool without error logging

### Requirement: Preserve message ordering

Entries SHALL be broadcast in the order they are received from the `adb logstream` process.
No reordering or batching SHALL occur.

#### Scenario: Entries arrive and are broadcast in order

- **WHEN** two entries are parsed sequentially
- **THEN** the first entry SHALL be broadcast before the second entry

### Requirement: No client-to-server messages

Clients SHALL NOT send any messages to the server. The server SHALL ignore or discard any incoming WebSocket messages from clients.

#### Scenario: Client sends a message

- **WHEN** a connected client sends a message to the server
- **THEN** the server SHALL ignore the message silently
