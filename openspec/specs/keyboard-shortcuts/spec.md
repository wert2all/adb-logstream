# Keyboard Shortcuts

## Purpose

Define global keyboard shortcuts for the Client to enable quick access to search, level toggling, log clearing, and auto-scroll toggling without using the mouse.

## Requirements

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

### Requirement: Focus search input

The Client SHALL focus the search input when the `/` key is pressed.

#### Scenario: User presses `/`

- **WHEN** the user presses the `/` key
- **THEN** the search input field SHALL receive focus
- **AND** the `/` character SHALL NOT be inserted into the field

### Requirement: Clear search and blur input

The Client SHALL clear the search input and remove focus when the `Escape` key is pressed.

#### Scenario: User presses Escape

- **WHEN** the user presses the `Escape` key
- **THEN** the search input field SHALL be cleared
- **AND** the search input field SHALL lose focus

### Requirement: Clear log list

The Client SHALL clear all rendered entries from the DOM and the in-memory list when the `c` key is pressed.

#### Scenario: User presses `c`

- **WHEN** the user presses the `c` key
- **THEN** all Logcat Entries SHALL be removed from the DOM
- **AND** the in-memory entry list SHALL be emptied

### Requirement: Toggle Verbose

The Client SHALL toggle the Verbose Level filter when the `v` key is pressed.

#### Scenario: User presses `v`

- **WHEN** the user presses the `v` key
- **THEN** the Verbose Level toggle SHALL switch to its opposite state

### Requirement: Toggle Debug

The Client SHALL toggle the Debug Level filter when the `d` key is pressed.

#### Scenario: User presses `d`

- **WHEN** the user presses the `d` key
- **THEN** the Debug Level toggle SHALL switch to its opposite state

### Requirement: Toggle Info

The Client SHALL toggle the Info Level filter when the `i` key is pressed.

#### Scenario: User presses `i`

- **WHEN** the user presses the `i` key
- **THEN** the Info Level toggle SHALL switch to its opposite state

### Requirement: Toggle Warn

The Client SHALL toggle the Warn Level filter when the `w` key is pressed.

#### Scenario: User presses `w`

- **WHEN** the user presses the `w` key
- **THEN** the Warn Level toggle SHALL switch to its opposite state

### Requirement: Toggle Error

The Client SHALL toggle the Error Level filter when the `e` key is pressed.

#### Scenario: User presses `e`

- **WHEN** the user presses the `e` key
- **THEN** the Error Level toggle SHALL switch to its opposite state

### Requirement: Toggle Fatal

The Client SHALL toggle the Fatal Level filter when the `f` key is pressed.

#### Scenario: User presses `f`

- **WHEN** the user presses the `f` key
- **THEN** the Fatal Level toggle SHALL switch to its opposite state

### Requirement: Toggle auto-scroll

The Client SHALL toggle the auto-scroll state when the `a` key is pressed.

#### Scenario: User presses `a`

- **WHEN** the user presses the `a` key (and no input is focused)
- **THEN** the auto-scroll state SHALL switch to its opposite state
- **AND** the auto-scroll checkbox SHALL reflect the new state
- **AND** the footer indicator SHALL update to match
- **AND** the state SHALL be persisted to localStorage

### Requirement: No shortcuts when typing

The Client SHALL NOT trigger keyboard shortcuts when an editable input field is focused.

#### Scenario: User types in search field

- **WHEN** the user is typing in the search input field
- **THEN** pressing `c`, `v`, `d`, `i`, `w`, `e`, `f`, or `a` SHALL insert the character into the field
- **AND** the corresponding shortcut action SHALL NOT be triggered
