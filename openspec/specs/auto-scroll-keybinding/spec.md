# Auto-Scroll Keyboard Shortcut

## Purpose

Provide a keyboard shortcut to toggle auto-scroll, consistent with existing single-key shortcuts for level toggles and other controls.

## Requirements

### Requirement: Toggle auto-scroll via keyboard

The Client SHALL toggle the auto-scroll state when the `a` key is pressed.

#### Scenario: User presses `a` with auto-scroll enabled

- **GIVEN** auto-scroll is enabled
- **WHEN** the user presses the `a` key
- **THEN** auto-scroll becomes disabled
- **AND** the auto-scroll checkbox becomes unchecked
- **AND** the footer indicator displays "Auto-scroll: OFF"
- **AND** the state is persisted to localStorage

#### Scenario: User presses `a` with auto-scroll disabled

- **GIVEN** auto-scroll is disabled
- **WHEN** the user presses the `a` key
- **THEN** auto-scroll becomes enabled
- **AND** the auto-scroll checkbox becomes checked
- **AND** the footer indicator displays "Auto-scroll: ON"
- **AND** the state is persisted to localStorage

### Requirement: Auto-scroll shortcut does not fire when typing

The Client SHALL NOT trigger the auto-scroll shortcut when an editable input field is focused.

#### Scenario: User presses `a` in search field

- **GIVEN** the search input field is focused
- **WHEN** the user presses the `a` key
- **THEN** the character `a` SHALL be inserted into the search field
- **AND** the auto-scroll state SHALL NOT change

### Requirement: Auto-scroll checkbox tooltip

The auto-scroll checkbox control SHALL display a tooltip showing the `a` key binding on hover.

#### Scenario: User hovers over auto-scroll checkbox

- **WHEN** the user hovers over the auto-scroll checkbox or its label
- **THEN** a tooltip SHALL display the `a` key binding
