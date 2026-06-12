# Keyboard Shortcuts

## Purpose

Define global keyboard shortcuts for the Client to enable quick access to search, level toggling, log clearing, and auto-scroll toggling without using the mouse.

## MODIFIED Requirements

### Requirement: Shortcut tooltips on controls

Every control that has a keyboard shortcut SHALL expose that shortcut via a tooltip on hover.

#### Scenario: Search input shows shortcut

- **WHEN** the user hovers over the search input
- **THEN** a tooltip SHALL display the `/` key binding

#### Scenario: Clear button shows shortcut

- **WHEN** the user hovers over the Clear button
- **THEN** a tooltip SHALL display the `C` key binding

#### Scenario: Level toggles show shortcuts

- **WHEN** the user hovers over any Level toggle button
- **THEN** a tooltip SHALL display the corresponding key binding (V, D, I, W, E, or F)

#### Scenario: Auto-scroll checkbox shows shortcut

- **WHEN** the user hovers over the auto-scroll checkbox or its label
- **THEN** a tooltip SHALL display the `a` key binding

### Requirement: No shortcuts when typing

The Client SHALL NOT trigger keyboard shortcuts when an editable input field is focused.

#### Scenario: User types in search field

- **WHEN** the user is typing in the search input field
- **THEN** pressing `c`, `v`, `d`, `i`, `w`, `e`, `f`, or `a` SHALL insert the character into the field
- **AND** the corresponding shortcut action SHALL NOT be triggered

## ADDED Requirements

### Requirement: Toggle auto-scroll

The Client SHALL toggle the auto-scroll state when the `a` key is pressed.

#### Scenario: User presses `a`

- **WHEN** the user presses the `a` key (and no input is focused)
- **THEN** the auto-scroll state SHALL switch to its opposite state
- **AND** the auto-scroll checkbox SHALL reflect the new state
- **AND** the footer indicator SHALL update to match
- **AND** the state SHALL be persisted to localStorage
