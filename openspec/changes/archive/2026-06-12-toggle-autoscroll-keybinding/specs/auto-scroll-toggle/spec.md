# Auto-Scroll Toggle

## Purpose

Provide users with a toggleable auto-scroll control for the log stream viewer, with state persistence across page reloads and keyboard shortcut support.

## MODIFIED Requirements

### Requirement: Auto-scroll toggle control

The system SHALL provide a checkbox in the footer that allows the user to toggle auto-scroll on or off. The checkbox SHALL also display a tooltip indicating the keyboard shortcut.

#### Scenario: Toggle auto-scroll off

- **WHEN** the user clicks the auto-scroll checkbox to uncheck it
- **THEN** the auto-scroll state becomes disabled
- **AND** the footer indicator displays "Auto-scroll: OFF"

#### Scenario: Toggle auto-scroll on

- **WHEN** the user clicks the auto-scroll checkbox to check it
- **THEN** the auto-scroll state becomes enabled
- **AND** the footer indicator displays "Auto-scroll: ON"
- **AND** the log container scrolls to the bottom

#### Scenario: Auto-scroll checkbox shows keyboard shortcut tooltip

- **WHEN** the user hovers over the auto-scroll checkbox or its label
- **THEN** a tooltip SHALL display the `a` key binding

## ADDED Requirements

### Requirement: Auto-scroll toggled via keyboard shortcut

The system SHALL toggle auto-scroll state when the `a` keyboard shortcut is used, keeping the checkbox and indicator in sync.

#### Scenario: Keyboard shortcut toggles auto-scroll off

- **GIVEN** auto-scroll is enabled and no input is focused
- **WHEN** the user presses the `a` key
- **THEN** auto-scroll becomes disabled
- **AND** the checkbox becomes unchecked
- **AND** the footer indicator displays "Auto-scroll: OFF"

#### Scenario: Keyboard shortcut toggles auto-scroll on

- **GIVEN** auto-scroll is disabled and no input is focused
- **WHEN** the user presses the `a` key
- **THEN** auto-scroll becomes enabled
- **AND** the checkbox becomes checked
- **AND** the footer indicator displays "Auto-scroll: ON"
