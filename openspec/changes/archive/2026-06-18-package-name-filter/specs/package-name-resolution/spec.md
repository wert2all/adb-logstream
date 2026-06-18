# Package Name Resolution

## Purpose

Define how the Server periodically resolves Android applicationIds (package names) from PIDs using `adb shell ps -A` and enriches each Logstream Entry with the resolved `packageName`.

## ADDED Requirements

### Requirement: Periodic PID-to-packageName polling

The Server SHALL poll `adb shell ps -A -o PID,NAME` every 2 seconds to build a PID→packageName map.

#### Scenario: Polling starts on server launch

- **WHEN** the Server starts
- **THEN** the Server SHALL start a 2-second interval timer
- **AND** the Server SHALL execute `adb shell ps -A -o PID,NAME` on each tick

#### Scenario: Parsing ps output

- **WHEN** `adb shell ps -A` output is received
- **THEN** the Server SHALL parse each line as `<PID> <processName>`
- **AND** the Server SHALL build a `Map<number, string>` mapping PID to processName
- **AND** the Server SHALL replace the previous map entirely with the newly parsed map

### Requirement: Entry enrichment with packageName

The Server SHALL include a `packageName` field in every broadcast entry message, resolved from the entry's PID.

#### Scenario: PID found in current map

- **WHEN** a Logstream Entry is broadcast
- **AND** the entry's PID exists in the current PID→packageName map
- **THEN** the broadcast JSON SHALL contain a `packageName` field with the resolved process name (which is the Android applicationId)

#### Scenario: PID not found in current map

- **WHEN** a Logstream Entry is broadcast
- **AND** the entry's PID does NOT exist in the current PID→packageName map
- **THEN** the broadcast JSON SHALL contain `"packageName": null`

### Requirement: Graceful handling of ps failure

The Server SHALL tolerate failures of the `adb shell ps -A` command without interrupting the log stream.

#### Scenario: ps command fails

- **WHEN** `adb shell ps -A` exits with a non-zero code or fails to spawn
- **THEN** the Server SHALL keep the previous successful PID→packageName map in memory
- **AND** the Server SHALL continue broadcasting entries with the existing map
- **AND** the next successful tick SHALL replace the map normally

#### Scenario: First tick fails

- **WHEN** the first `adb shell ps -A` execution fails after server start
- **THEN** the Server SHALL broadcast all entries with `"packageName": null`
- **AND** the Server SHALL retry on the next 2-second tick
