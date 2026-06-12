## ADDED Requirements

### Requirement: Parse logstream long format entries

The system SHALL parse each complete logstream entry from `-v long` format into a structured object.

Each entry in `long` format consists of a header line followed by zero or more body lines.
The header line format SHALL be: `[ timestamp pid: tid level/tag ]`
The parsed object SHALL contain the following fields:

- `timestamp` (string): the timestamp from the header
- `pid` (string): the process ID
- `tid` (string): the thread ID
- `level` (string): the log level (one of V, D, I, W, E, F)
- `tag` (string): the log tag
- `message` (string): the body text, which may span multiple lines

#### Scenario: Parse a complete single-line entry

- **WHEN** the parser receives `[ 01-01 12:00:00.000 1234:5678 I/Mytag ]` followed by `Hello world`
- **THEN** it SHALL produce `{ timestamp: "01-01 12:00:00.000", pid: "1234", tid: "5678", level: "I", tag: "Mytag", message: "Hello world" }`

#### Scenario: Parse a multi-line body entry

- **WHEN** the parser receives a header followed by multiple body lines
- **THEN** the `message` field SHALL contain all body lines joined
- **THEN** each line boundary within the message SHALL be preserved

### Requirement: Handle malformed log lines

When a line does not match the expected `-v long` header format, the system SHALL skip the line or forward it as a status message with level `?`.

#### Scenario: Non-header line received outside an entry

- **WHEN** the parser receives a line that does not match the header format and no entry is currently being parsed
- **THEN** the line SHALL be skipped silently
- **THEN** no partial entry SHALL be emitted

### Requirement: Handle empty body entries

When a header line is not followed by any body lines before the next header, the system SHALL produce an entry with an empty `message` field.

#### Scenario: Entry with no body

- **WHEN** a header line is immediately followed by another header line
- **THEN** the first entry SHALL be emitted with `message: ""` or `message: null`
