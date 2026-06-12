# Log Rendering

## Purpose

Define how Logcat Entries are parsed from WebSocket messages, rendered as rows in the log list, and managed in the DOM with auto-scroll and entry capping.

## Requirements

### Requirement: Logcat entry parsing

The Client SHALL parse incoming JSON messages of type `"entry"` into Logcat Entry objects.

#### Scenario: Valid entry received with uuid

- **WHEN** the Server sends a JSON message of type `"entry"` containing `timestamp`, `pid`, `tid`, `level`, `tag`, `message`, and `uuid`
- **THEN** the Client SHALL create a Logcat Entry object with those fields

#### Scenario: Valid entry received without uuid

- **WHEN** the Server sends a JSON message of type `"entry"` containing `timestamp`, `pid`, `tid`, `level`, `tag`, and `message` but no `uuid` field
- **THEN** the Client SHALL create a Logcat Entry object with those fields
- **AND** the `uuid` field SHALL be `undefined` in the resulting object

### Requirement: Logcat entry rendering

The Client SHALL render each Logcat Entry as a row in the log list.

#### Scenario: Entry rendered

- **WHEN** a Logcat Entry is received
- **THEN** the Client SHALL append it to the log list as a row
- **AND** the row SHALL display the entry's `timestamp`, `level`, `tag`, and `message`
- **AND** the row SHALL be color-coded according to its Level

### Requirement: Bottom append behavior

The Client SHALL append new Logcat Entries at the bottom of the log list.

#### Scenario: New entry arrives

- **WHEN** a new Logcat Entry is received while the log list is visible
- **THEN** the Client SHALL add the new entry after the last existing entry

### Requirement: Auto-scroll to latest entry

The Client SHALL automatically scroll to the newest entry when the user is already at the bottom of the log list.

#### Scenario: User is at bottom

- **WHEN** a new Logcat Entry is received
- **AND** the user is scrolled within 50 pixels of the bottom
- **THEN** the Client SHALL scroll the log list to the bottom after appending the entry

#### Scenario: User has scrolled up

- **WHEN** a new Logcat Entry is received
- **AND** the user is scrolled more than 50 pixels above the bottom
- **THEN** the Client SHALL NOT scroll the log list

### Requirement: DOM entry cap

The Client SHALL maintain a maximum of 5000 entries in the DOM and in memory.

#### Scenario: Entry count exceeds 5000

- **WHEN** the total number of received entries exceeds 5000
- **THEN** the Client SHALL remove the oldest entries from both the DOM and the in-memory list
- **AND** the total count SHALL remain at 5000

### Requirement: Total entry count display

The Client SHALL display the total number of received Logcat Entries in the header.

#### Scenario: Entries accumulate

- **WHEN** the Client receives Logcat Entries
- **THEN** the header SHALL display the total count of entries received
