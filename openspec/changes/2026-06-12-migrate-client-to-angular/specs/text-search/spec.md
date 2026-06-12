# Text Search

## Purpose

Provide real-time case-insensitive search across Logcat Entry tags and messages, with visual highlighting of matches, driven by Angular signals.

## Requirements

### Requirement: Search input field

The Client SHALL provide a text input field for entering search queries, rendered by `SearchBarComponent`.

#### Scenario: Search field present

- **WHEN** the Client is loaded
- **THEN** the header SHALL contain a text input field for search

### Requirement: Signal-driven search filtering

The Client SHALL filter Logcat Entries in real time as the user types, via signal reactivity.

#### Scenario: User types in search field

- **WHEN** the user types a query into the search field
- **THEN** `LogStateService.searchQuery` signal SHALL update
- **AND** `LogStateService.filteredEntries` computed signal SHALL recompute
- **AND** the log list SHALL update immediately to show only matching entries

### Requirement: Case-insensitive search

The Client SHALL perform case-insensitive search matching.

#### Scenario: Mixed-case query

- **WHEN** the user types "activity" in the search field
- **THEN** the Client SHALL match entries containing "Activity", "ACTIVITY", or "activity"

### Requirement: Search match highlighting

The Client SHALL highlight matching text within each visible entry using a `<mark>` element.

#### Scenario: Matches found

- **WHEN** the user types a search query that matches part of an entry's tag or message
- **THEN** the matched portion of the text SHALL be wrapped in `<mark>` elements

### Requirement: Search scope

The Client SHALL apply search to the combined text of the entry's tag and message.

#### Scenario: Match in tag

- **WHEN** the user types a query that matches a Logcat Entry's tag
- **THEN** the entry SHALL be shown in the results

#### Scenario: Match in message

- **WHEN** the user types a query that matches a Logcat Entry's message
- **THEN** the entry SHALL be shown in the results

### Requirement: Empty search restores all entries

The Client SHALL show all entries when the search field is empty.

#### Scenario: Search field cleared

- **WHEN** the user clears the search field
- **THEN** all Logcat Entries SHALL be shown, subject to Level filters

### Requirement: Escape key clears search

The Client SHALL clear the search field and blur the input when the user presses the Escape key.

#### Scenario: User presses Escape

- **WHEN** the user presses the Escape key while the search field is focused
- **THEN** the search field SHALL be cleared
- **AND** the search field SHALL lose focus
- **AND** the full log list SHALL be restored
