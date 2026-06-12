# Angular WebSocket Service

## Purpose

Define how the `WebSocketService` Angular injectable manages the WebSocket connection, reconnection, and message parsing, exposing signals for the rest of the application.

## Requirements

### Requirement: Injectable WebSocket service

The Client SHALL provide `WebSocketService` as an Angular injectable service.

#### Scenario: Service available

- **WHEN** the application starts
- **THEN** `WebSocketService` SHALL be provided at root level (`providedIn: 'root'`)

### Requirement: Signal-based status

The Client SHALL expose connection status as a signal.

#### Scenario: Status signal

- **WHEN** the WebSocket connection state changes
- **THEN** `WebSocketService.status` signal SHALL reflect the current `ConnectionStatus`

### Requirement: Signal-based latest entry

The Client SHALL expose the most recently received entry as a signal.

#### Scenario: Entry received

- **WHEN** the Server sends a JSON message of type `"entry"`
- **THEN** `WebSocketService.latestEntry` signal SHALL be updated with the parsed entry

### Requirement: Signal-based status messages

The Client SHALL expose server status messages as a signal.

#### Scenario: Status message received

- **WHEN** the Server sends a JSON message of type `"status"`
- **THEN** `WebSocketService.statusMessage` signal SHALL be updated with the message text

### Requirement: Imperative WebSocket internals

The `WebSocketService` SHALL manage the WebSocket lifecycle imperatively.

#### Scenario: Connection established

- **WHEN** `connect()` is called
- **THEN** a `new WebSocket(WS_URL)` SHALL be created
- **AND** `onopen`, `onclose`, `onmessage`, `onerror` handlers SHALL be attached

### Requirement: Auto-reconnect with delay

The `WebSocketService` SHALL attempt to reconnect after a disconnect with a 3-second delay.

#### Scenario: Disconnect triggers reconnect

- **WHEN** the WebSocket connection closes
- **THEN** `status` signal SHALL be set to `'reconnecting'`
- **AND** after 3 seconds, `connect()` SHALL be called again

### Requirement: Page reload on successful reconnect

The Client SHALL reload the page upon successful reconnection after a disconnect.

#### Scenario: Reconnect succeeds

- **WHEN** the Client successfully reconnects after a previous disconnect
- **THEN** `window.location.reload()` SHALL be called

### Requirement: Message parsing

The `WebSocketService` SHALL parse incoming JSON messages and extract entries.

#### Scenario: Valid entry message

- **WHEN** a JSON message with `type: "entry"` is received
- **THEN** the service SHALL parse `timestamp`, `pid`, `tid`, `level`, `tag`, `message` fields
- **AND** update `latestEntry` signal

#### Scenario: Malformed JSON

- **WHEN** a message is not valid JSON
- **THEN** the service SHALL log the error to console
- **AND** skip the message without crashing
