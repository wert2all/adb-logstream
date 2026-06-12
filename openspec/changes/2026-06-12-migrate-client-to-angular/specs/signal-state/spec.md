# Signal State Management

## Purpose

Define the Angular signals-based state management approach that replaces the mutable `state` object with reactive signals in `LogStateService`.

## Requirements

### Requirement: LogStateService as single source of truth

The Client SHALL use `LogStateService` as the single source of truth for all application state.

#### Scenario: Service injected

- **WHEN** any component needs to read or mutate application state
- **THEN** it SHALL inject `LogStateService` via Angular DI
- **AND** it SHALL NOT maintain its own copy of the state

### Requirement: Signal-based entries

The Client SHALL store log entries in an Angular signal.

#### Scenario: Entry appended

- **WHEN** a new Logcat Entry is received
- **THEN** `LogStateService.entries` signal SHALL be updated with the new entry
- **AND** all components reading this signal SHALL be notified

### Requirement: Computed filtered entries

The Client SHALL derive filtered entries using `computed()`.

#### Scenario: Filter applied

- **WHEN** the user toggles a level filter or types a search query
- **THEN** `LogStateService.filteredEntries` computed signal SHALL automatically recompute
- **AND** the log list SHALL re-render with the filtered results

### Requirement: Signal-based level filters

The Client SHALL store level filter state in a signal.

#### Scenario: Level toggled

- **WHEN** the user toggles a level filter
- **THEN** `LogStateService.levelFilters` signal SHALL be updated
- **AND** `LogStateService.filteredEntries` SHALL recomputed

### Requirement: Signal-based search query

The Client SHALL store the search query in a signal.

#### Scenario: Search query changed

- **WHEN** the user types in the search field
- **THEN** `LogStateService.searchQuery` signal SHALL be updated
- **AND** `LogStateService.filteredEntries` SHALL recompute

### Requirement: Signal-based connection status

The Client SHALL store connection status in a signal.

#### Scenario: Connection state changes

- **WHEN** the WebSocket connection opens, closes, or reconnects
- **THEN** `LogStateService.connectionStatus` signal SHALL be updated

### Requirement: Signal-based auto-scroll state

The Client SHALL store auto-scroll state in a signal.

#### Scenario: Auto-scroll toggled

- **WHEN** the user toggles the auto-scroll checkbox
- **THEN** `LogStateService.autoScrollEnabled` signal SHALL be updated
- **AND** the change SHALL be persisted via `LocalStorageService`

### Requirement: No RxJS for state

The Client SHALL NOT use RxJS Observables for state management.

#### Scenario: State flow

- **WHEN** state changes occur
- **THEN** they SHALL flow through Angular signals only
- **AND** no `Observable`, `Subject`, or `BehaviorSubject` SHALL be used for application state
