# Entry Selection

## Purpose

Define how users select individual Logcat Entries via checkboxes, with selection state managed centrally in LogStateService.

## Requirements

### Requirement: Centralized selection state

The Client SHALL maintain selection state in `LogStateService` as a `signal<Set<string>>` keyed by entry UUID.

#### Scenario: Selection state initialized

- **WHEN** the Client loads
- **THEN** the selection set SHALL be empty

### Requirement: Toggle entry selection

The Client SHALL allow the user to select or deselect individual Logcat Entries by clicking their checkbox.

#### Scenario: Select an entry

- **WHEN** the user clicks an unchecked checkbox on a Logcat Entry row
- **THEN** the entry's UUID SHALL be added to the selection set
- **AND** the checkbox SHALL become checked

#### Scenario: Deselect an entry

- **WHEN** the user clicks a checked checkbox on a Logcat Entry row
- **THEN** the entry's UUID SHALL be removed from the selection set
- **AND** the checkbox SHALL become unchecked

### Requirement: Selection reflects from service

Each Logcat Entry row SHALL read its checked state from the centralized selection set in `LogStateService`, not from local component state.

#### Scenario: Entry row reflects selection

- **WHEN** an entry's UUID is in the selection set
- **THEN** the row's checkbox SHALL be checked

#### Scenario: Entry row reflects deselection

- **WHEN** an entry's UUID is not in the selection set
- **THEN** the row's checkbox SHALL be unchecked

### Requirement: Clear selection

The Client SHALL provide a method to clear all selected entries.

#### Scenario: Clear selection after copy

- **WHEN** the user triggers the copy action
- **THEN** the selection set SHALL be emptied

### Requirement: Selection survives scroll

The Client SHALL preserve selection state when new entries arrive and the log list scrolls.

#### Scenario: New entry arrives with active selection

- **GIVEN** one or more entries are selected
- **WHEN** a new Logcat Entry arrives
- **THEN** the previously selected entries SHALL remain selected
