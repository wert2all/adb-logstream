## ADDED Requirements

### Requirement: CI workflow runs Prettier on pull requests

The system SHALL run Prettier in check mode on every pull request targeting the `main` branch. The check SHALL fail if any file is not formatted according to the project's Prettier configuration.

#### Scenario: PR with unformatted code

- **WHEN** a pull request is opened or updated with code that does not match Prettier formatting rules
- **THEN** the Prettier check SHALL report failure and the CI check SHALL be marked as failed

#### Scenario: PR with formatted code

- **WHEN** a pull request is opened or updated with code that matches Prettier formatting rules
- **THEN** the Prettier check SHALL pass and the CI check SHALL be marked as successful

### Requirement: CI workflow runs Prettier on pushes to main

The system SHALL run Prettier in check mode on every push to the `main` branch. The check SHALL fail if any file is not formatted.

#### Scenario: Push to main with unformatted code

- **WHEN** a commit is pushed to `main` containing unformatted code
- **THEN** the Prettier check SHALL report failure and the CI check SHALL be marked as failed

#### Scenario: Push to main with formatted code

- **WHEN** a commit is pushed to `main` containing only formatted code
- **THEN** the Prettier check SHALL pass

### Requirement: Prettier configuration file

The project SHALL include a `.prettierrc` file at the repository root that defines the formatting rules for the project.

#### Scenario: .prettierrc exists

- **WHEN** Prettier is run locally or in CI
- **THEN** it SHALL read formatting rules from `.prettierrc` at the repository root

### Requirement: Prettier ignore file

The project SHALL include a `.prettierignore` file at the repository root that excludes generated artifacts and dependencies from formatting checks.

#### Scenario: Generated files are ignored

- **WHEN** Prettier runs in check mode
- **THEN** files matching patterns in `.prettierignore` (e.g. `dist/`, `node_modules/`) SHALL be excluded from the check

### Requirement: npm scripts for local formatting

The project SHALL provide npm scripts for running Prettier locally: `format:check` (check-only) and `format` (auto-fix).

#### Scenario: Developer checks formatting locally

- **WHEN** a developer runs `npm run format:check`
- **THEN** Prettier SHALL run in check mode and report any unformatted files without modifying them

#### Scenario: Developer auto-fixes formatting locally

- **WHEN** a developer runs `npm run format`
- **THEN** Prettier SHALL format all eligible files in place
