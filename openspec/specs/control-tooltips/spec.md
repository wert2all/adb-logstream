# Control Tooltips

## Purpose

Provide tooltip overlays on UI controls that have keyboard shortcuts, enabling users to discover key bindings by hovering over the control.

## Requirements

### Requirement: Search input tooltip

The search input SHALL display a tooltip showing its keyboard shortcut when hovered.

#### Scenario: Hover over search input

- **WHEN** the user hovers over the search input field
- **THEN** a tooltip SHALL appear above the input displaying "Filter logs" and the `/` key badge

### Requirement: Clear button tooltip

The Clear button SHALL display a tooltip showing its keyboard shortcut when hovered.

#### Scenario: Hover over Clear button

- **WHEN** the user hovers over the Clear button
- **THEN** a tooltip SHALL appear above the button displaying "Clear logs" and the `C` key badge

### Requirement: Level toggle tooltips

Each Level toggle button SHALL display a tooltip showing the level name and its keyboard shortcut when hovered.

#### Scenario: Hover over Verbose toggle

- **WHEN** the user hovers over the Verbose (V) toggle button
- **THEN** a tooltip SHALL appear above the button displaying "Toggle Verbose" and the `V` key badge

#### Scenario: Hover over Debug toggle

- **WHEN** the user hovers over the Debug (D) toggle button
- **THEN** a tooltip SHALL appear above the button displaying "Toggle Debug" and the `D` key badge

#### Scenario: Hover over Info toggle

- **WHEN** the user hovers over the Info (I) toggle button
- **THEN** a tooltip SHALL appear above the button displaying "Toggle Info" and the `I` key badge

#### Scenario: Hover over Warn toggle

- **WHEN** the user hovers over the Warn (W) toggle button
- **THEN** a tooltip SHALL appear above the button displaying "Toggle Warn" and the `W` key badge

#### Scenario: Hover over Error toggle

- **WHEN** the user hovers over the Error (E) toggle button
- **THEN** a tooltip SHALL appear above the button displaying "Toggle Error" and the `E` key badge

#### Scenario: Hover over Fatal toggle

- **WHEN** the user hovers over the Fatal (F) toggle button
- **THEN** a tooltip SHALL appear above the button displaying "Toggle Fatal" and the `F` key badge

### Requirement: Tooltip visual style

Tooltips SHALL use the project's existing color tokens and match the `<kbd>` styling used in the footer shortcut legend.

#### Scenario: Tooltip appearance

- **WHEN** a tooltip is visible
- **THEN** the tooltip background SHALL use `surface-variant` color
- **AND** the tooltip text SHALL use `on-surface` color
- **AND** the key badge SHALL use the same `bg-surface-variant px-1 rounded` pattern as the footer `<kbd>` elements

### Requirement: Tooltip show delay

Tooltips SHALL appear after a brief delay to avoid flicker during casual mouse movement.

#### Scenario: Tooltip delay

- **WHEN** the user hovers over a control with a tooltip
- **THEN** the tooltip SHALL appear after approximately 300ms of hover
- **AND** if the mouse leaves before the delay elapses, the tooltip SHALL NOT appear

### Requirement: Tooltip positioning

Tooltips SHALL be positioned above their associated control without overlapping adjacent controls.

#### Scenario: Tooltip above control

- **WHEN** a tooltip is triggered
- **THEN** the tooltip SHALL appear above the control with a small gap
- **AND** the tooltip SHALL be horizontally centered relative to the control
