# Copy to Clipboard

## Purpose

Define how selected Logstream Entries are copied to the system clipboard as a JSON array, with a conditional Copy button in the header and footer.

## Requirements

### Requirement: Copy button visibility

The Client SHALL display a Copy button in the header and footer only when at least one entry is selected.

#### Scenario: No entries selected

- **WHEN** the selection set is empty
- **THEN** the Copy button SHALL NOT be visible in the header or footer

#### Scenario: One or more entries selected

- **WHEN** the selection set contains one or more entry UUIDs
- **THEN** a Copy button SHALL be visible in the header (next to the Clear button)
- **AND** a Copy button SHALL be visible in the footer

### Requirement: Copy action

The Client SHALL copy the selected entries to the system clipboard as a formatted JSON array when the Copy button is clicked.

#### Scenario: Copy single entry

- **WHEN** the user clicks the Copy button with one entry selected
- **THEN** the Client SHALL call `navigator.clipboard.writeText()` with a JSON string containing a single-element array
- **AND** the JSON SHALL be formatted with 2-space indentation (`JSON.stringify(entries, null, 2)`)

#### Scenario: Copy multiple entries

- **WHEN** the user clicks the Copy button with multiple entries selected
- **THEN** the Client SHALL call `navigator.clipboard.writeText()` with a JSON string containing all selected entries as an array
- **AND** entries in the array SHALL maintain their original insertion order
- **AND** the JSON SHALL be formatted with 2-space indentation

### Requirement: Post-copy feedback

The Client SHALL clear the selection and show a brief confirmation after a successful copy.

#### Scenario: Successful copy

- **WHEN** the copy action completes successfully
- **THEN** the selection set SHALL be cleared
- **AND** a "Copied!" confirmation message SHALL be displayed briefly

#### Scenario: Copy fails

- **WHEN** `navigator.clipboard.writeText()` rejects
- **THEN** the selection SHALL NOT be cleared
- **AND** the error SHALL be handled gracefully (no uncaught promise rejection)
