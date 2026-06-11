## ADDED Requirements

### Requirement: Level filter controls
The Client SHALL provide six toggle controls — one for each Level: V, D, I, W, E, F.

#### Scenario: Filter controls present
- **WHEN** the Client is loaded
- **THEN** the header SHALL contain six toggle buttons labeled V, D, I, W, E, F

### Requirement: Default toggle state
The Client SHALL initialize the Level toggles with default states: V = off, D/I/W/E/F = on.

#### Scenario: Initial load
- **WHEN** the Client loads with no prior localStorage state
- **THEN** the Verbose toggle SHALL be in the OFF state
- **AND** the Debug, Info, Warn, Error, and Fatal toggles SHALL be in the ON state

### Requirement: Instant filter application
The Client SHALL instantly hide or show all Logcat Entries of a Level when its toggle is switched.

#### Scenario: Toggle Verbose off
- **WHEN** the user toggles Verbose off
- **THEN** all Logcat Entries with Level `V` SHALL be hidden from the log list

#### Scenario: Toggle Verbose on
- **WHEN** the user toggles Verbose on
- **THEN** all Logcat Entries with Level `V` SHALL be shown in the log list

### Requirement: In-memory retention during filtering
The Client SHALL keep all Logcat Entries in memory regardless of toggle state.

#### Scenario: Entries hidden but retained
- **WHEN** the user toggles a Level off
- **THEN** the corresponding entries SHALL be hidden from the DOM
- **AND** those entries SHALL remain in the in-memory list

### Requirement: Toggle state persistence
The Client SHALL persist the state of each Level toggle across page reloads via localStorage.

#### Scenario: User toggles and reloads
- **WHEN** the user changes a Level toggle state
- **THEN** the Client SHALL save the state to localStorage
- **AND** when the page is reloaded, the Client SHALL restore those states from localStorage
