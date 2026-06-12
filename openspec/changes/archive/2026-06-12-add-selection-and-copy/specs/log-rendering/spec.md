# Log Rendering (delta)

## Purpose

Delta spec for `log-rendering`: modify how Logcat Entry rows manage selection state.

## MODIFIED Requirements

### Requirement: Logcat entry rendering

The Client SHALL render each Logcat Entry as a row in the log list. Each row SHALL include a checkbox for selection, reading its checked state from the centralized selection set in `LogStateService`.

#### Scenario: Entry rendered

- **WHEN** a Logcat Entry is received
- **THEN** the Client SHALL append it to the log list as a row
- **AND** the row SHALL display the entry's `timestamp`, `level`, `tag`, and `message`
- **AND** the row SHALL be color-coded according to its Level
- **AND** the row SHALL include a checkbox that reflects the entry's selection state from `LogStateService`

#### Scenario: Entry checkbox toggle

- **WHEN** the user clicks the checkbox on a Logcat Entry row
- **THEN** the entry's UUID SHALL be toggled in the `LogStateService` selection set
- **AND** the checkbox SHALL reflect the updated selection state
