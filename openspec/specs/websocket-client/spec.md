# WebSocket Client

## Purpose

Define how the Client establishes, maintains, and recovers a WebSocket connection to the Server at `ws://localhost:3000`, including status display and message handling.

## Requirements

### Requirement: WebSocket connection establishment
The Client SHALL connect to `ws://localhost:3000` immediately upon page load.

#### Scenario: Successful connection on page load
- **WHEN** the Client loads in the browser
- **THEN** it SHALL open a WebSocket connection to `ws://localhost:3000`

### Requirement: Connection status display
The Client SHALL display the current WebSocket connection status using a colored indicator.

#### Scenario: Connection open
- **WHEN** the WebSocket connection opens successfully
- **THEN** the status indicator SHALL display green and the text "CONNECTED"

#### Scenario: Connection closed
- **WHEN** the WebSocket connection closes
- **THEN** the status indicator SHALL display red and the text "DISCONNECTED"

#### Scenario: Connection reconnecting
- **WHEN** the Client attempts to reconnect after a disconnect
- **THEN** the status indicator SHALL display yellow and the text "RECONNECTING"

### Requirement: Auto-reconnect with page reload
The Client SHALL attempt to reconnect after a disconnect, and reload the page upon successful reconnection.

#### Scenario: Disconnect triggers reconnect
- **WHEN** the WebSocket connection closes unexpectedly
- **THEN** the Client SHALL wait 3 seconds and attempt a new connection

#### Scenario: Reconnect triggers page reload
- **WHEN** the Client successfully reconnects after a disconnect
- **THEN** the Client SHALL reload the page to establish a fresh state

### Requirement: Server status message banner
The Client SHALL display temporary status messages sent by the Server as a banner.

#### Scenario: Server sends status message
- **WHEN** the Server sends a JSON message of type `"status"` with a message string
- **THEN** the Client SHALL display that string in a temporary banner at the top of the log area
- **AND** the banner SHALL be dismissible

### Requirement: Malformed message handling
The Client SHALL gracefully skip malformed JSON messages from the Server.

#### Scenario: Malformed JSON received
- **WHEN** the Server sends a message that is not valid JSON
- **THEN** the Client SHALL skip the message without rendering
- **AND** the Client SHALL log the error to the browser console
