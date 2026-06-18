# Package Name Filter

## Purpose

Allow the user to filter Logcat Entries by Android applicationId (package name) using a select-with-suggestions control and a dedicated keyboard shortcut.

## ADDED Requirements

### Requirement: Package name model field

The Client SHALL include `packageName` as a field on the Logstream Entry model, received from the Server.

#### Scenario: Entry received with packageName

- **WHEN** the Client receives an entry message containing a `packageName` field
- **THEN** the entry SHALL be stored with `packageName` set to the received value

#### Scenario: Entry received without packageName

- **WHEN** the Client receives an entry message without a `packageName` field
- **THEN** the entry SHALL be stored with `"packageName": null`

### Requirement: NgRx store state for package filter

The Client SHALL maintain a `packageFilter` field in the NgRx stream state for filtering entries by package name.

#### Scenario: Initial state

- **WHEN** the Client loads
- **THEN** `streamState.packageFilter` SHALL be `null` (no filter applied)

#### Scenario: Package filter action dispatched

- **WHEN** the user sets a package filter value
- **THEN** the NgRx Store SHALL dispatch a `setPackageFilter` action with the filter string
- **AND** `streamState.packageFilter` SHALL update to the new value

#### Scenario: Package filter cleared

- **WHEN** the user clears the package filter
- **THEN** `streamState.packageFilter` SHALL be reset to `null`
- **AND** all entries SHALL be shown (subject to other active filters)

### Requirement: Package name filter control

The Client SHALL provide a select-with-suggestions input control for filtering by package name, populated from unique packageNames in the current stream.

#### Scenario: Filter control present

- **WHEN** the Client is loaded
- **THEN** the header SHALL contain a package name filter input control

#### Scenario: Suggestions populated from stream

- **WHEN** entries with packageName values exist in the stream
- **THEN** the filter control SHALL show unique packageName values as selectable suggestions

#### Scenario: Filter by package name

- **WHEN** the user selects or types a package name in the filter control
- **THEN** only entries whose `packageName` matches the filter SHALL be shown

#### Scenario: Case-insensitive matching

- **WHEN** the user types a partial package name into the filter control
- **THEN** the Client SHALL match entries whose `packageName` contains the query (case-insensitive)

#### Scenario: Filter with null packageName

- **WHEN** the user filters by a package name that matches some entries
- **THEN** entries with `"packageName": null` SHALL NOT be shown unless they match

### Requirement: `.` keyboard shortcut focuses package filter

The Client SHALL focus the package name filter input when the `.` (period) key is pressed.

#### Scenario: User presses `.`

- **WHEN** the user presses the `.` key (and no editable input field is focused)
- **THEN** the package name filter input SHALL receive focus
- **AND** the `.` character SHALL NOT be inserted into any field

#### Scenario: No shortcut when typing

- **WHEN** the user is typing in an editable input field
- **THEN** pressing `.` SHALL insert the character into the field
- **AND** the package filter focus shortcut SHALL NOT be triggered
