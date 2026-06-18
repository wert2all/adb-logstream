# Keyboard Shortcuts (Delta)

## Purpose

Delta specification for the Keyboard Shortcuts capability. Adds a single new keyboard shortcut — `.` (period) to focus the package name filter input.

## ADDED Requirements

### Requirement: Focus package filter input

The Client SHALL focus the package name filter input when the `.` (period) key is pressed.

#### Scenario: User presses `.`

- **WHEN** the user presses the `.` key
- **AND** no editable input field is focused
- **THEN** the package name filter input SHALL receive focus
- **AND** the `.` character SHALL NOT be inserted into any field

#### Scenario: No shortcut when typing in search field

- **WHEN** the user is typing in the search input field
- **AND** the user presses the `.` key
- **THEN** the `.` character SHALL be inserted into the field
- **AND** the package filter focus action SHALL NOT be triggered

#### Scenario: No shortcut when typing in package filter

- **WHEN** the user is typing in the package filter input field
- **AND** the user presses the `.` key
- **THEN** the `.` character SHALL be inserted into the field
- **AND** the package filter focus action SHALL NOT be triggered
