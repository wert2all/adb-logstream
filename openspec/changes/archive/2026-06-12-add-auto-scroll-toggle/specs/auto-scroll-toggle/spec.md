## ADDED Requirements

### Requirement: Auto-scroll toggle control
The system SHALL provide a checkbox in the footer that allows the user to toggle auto-scroll on or off.

#### Scenario: Toggle auto-scroll off
- **WHEN** the user clicks the auto-scroll checkbox to uncheck it
- **THEN** the auto-scroll state becomes disabled
- **AND** the footer indicator displays "Auto-scroll: OFF"

#### Scenario: Toggle auto-scroll on
- **WHEN** the user clicks the auto-scroll checkbox to check it
- **THEN** the auto-scroll state becomes enabled
- **AND** the footer indicator displays "Auto-scroll: ON"

### Requirement: Default auto-scroll state
The system SHALL initialize the auto-scroll toggle to enabled (on) by default when the page loads for the first time.

#### Scenario: First page load
- **WHEN** the user loads the page with no prior saved state
- **THEN** the auto-scroll checkbox is checked
- **AND** the footer indicator displays "Auto-scroll: ON"

### Requirement: Auto-scroll behavior when enabled
When auto-scroll is enabled, the system SHALL automatically scroll the log container to the bottom upon each new Logcat Entry, unless the user has manually scrolled up from the bottom.

#### Scenario: New entry arrives with auto-scroll enabled and user at bottom
- **GIVEN** auto-scroll is enabled
- **AND** the user is scrolled to the bottom of the log container
- **WHEN** a new Logcat Entry arrives
- **THEN** the log container scrolls to the bottom

#### Scenario: New entry arrives with auto-scroll enabled but user scrolled up
- **GIVEN** auto-scroll is enabled
- **AND** the user has manually scrolled up from the bottom
- **WHEN** a new Logcat Entry arrives
- **THEN** the log container does NOT scroll

### Requirement: Auto-scroll behavior when disabled
When auto-scroll is disabled, the system SHALL NOT scroll the log container upon new Logcat Entries, regardless of scroll position.

#### Scenario: New entry arrives with auto-scroll disabled
- **GIVEN** auto-scroll is disabled
- **WHEN** a new Logcat Entry arrives
- **THEN** the log container does NOT scroll

### Requirement: Auto-scroll state persistence
The system SHALL persist the auto-scroll toggle state across page reloads using localStorage.

#### Scenario: Page reload with saved state
- **GIVEN** the user has previously set auto-scroll to disabled
- **WHEN** the page is reloaded
- **THEN** the auto-scroll checkbox is unchecked
- **AND** the footer indicator displays "Auto-scroll: OFF"

#### Scenario: Page reload with enabled state
- **GIVEN** the user has previously set auto-scroll to enabled
- **WHEN** the page is reloaded
- **THEN** the auto-scroll checkbox is checked
- **AND** the footer indicator displays "Auto-scroll: ON"
