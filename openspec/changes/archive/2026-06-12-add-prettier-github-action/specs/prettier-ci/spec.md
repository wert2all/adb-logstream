## ADDED Requirements

### Requirement: Prettier formatting check on pull requests

The GitHub Action SHALL run `npx prettier --check .` on every pull request to `main` and report formatting violations as check annotations.

#### Scenario: PR with valid formatting

- **WHEN** a pull request is opened or updated against `main`
- **AND** all files in the PR match Prettier formatting rules
- **THEN** the workflow SHALL pass with exit code 0
- **AND** no annotations SHALL be posted on the PR

#### Scenario: PR with formatting violations

- **WHEN** a pull request is opened or updated against `main`
- **AND** one or more files in the PR do not match Prettier formatting rules
- **THEN** the workflow SHALL fail with non-zero exit code
- **AND** Prettier SHALL annotate the failing files via `--check` output

### Requirement: Prettier formatting check on main branch pushes

The GitHub Action SHALL run `npx prettier --check .` on every push to `main` to ensure the default branch always complies with formatting rules.

#### Scenario: Valid push to main

- **WHEN** a commit is pushed to `main`
- **AND** all files in the repository match Prettier formatting rules
- **THEN** the workflow SHALL pass with exit code 0

#### Scenario: Invalid push to main

- **WHEN** a commit is pushed to `main`
- **AND** one or more files do not match Prettier formatting rules
- **THEN** the workflow SHALL fail with non-zero exit code

### Requirement: Shared Prettier configuration

The repository SHALL include a `.prettierrc` configuration file at the root to define formatting rules used by both CI and local development.

#### Scenario: Configuration file exists

- **WHEN** the CI workflow runs `npx prettier --check .`
- **THEN** Prettier SHALL use the rules defined in `.prettierrc`

#### Scenario: Local formatting consistency

- **WHEN** a developer runs `npm run format`
- **THEN** it SHALL format all files according to the same `.prettierrc` rules used in CI

### Requirement: Prettier as a root devDependency

Prettier SHALL be installed as a devDependency in the root `package.json` so it is available for both CI and local use via `npx prettier` or npm scripts.

#### Scenario: CI dependency resolution

- **WHEN** `npm ci` runs in CI
- **THEN** Prettier SHALL be available at `node_modules/.bin/prettier`

### Requirement: npm format script

The root `package.json` SHALL include a `format` script that invokes Prettier to format all supported files in the workspace.

#### Scenario: Run format script

- **WHEN** a developer runs `npm run format`
- **THEN** Prettier SHALL format all files in the repository according to `.prettierrc`

### Requirement: Workflow triggers on PR events

The workflow SHALL trigger on `pull_request` events: `opened`, `synchronize`, and `reopened`.

#### Scenario: PR opened triggers check

- **WHEN** a new pull request is opened
- **THEN** the Prettier check workflow SHALL be triggered

#### Scenario: PR updated triggers check

- **WHEN** new commits are pushed to an existing pull request (`synchronize`)
- **THEN** the Prettier check workflow SHALL be triggered

#### Scenario: PR reopened triggers check

- **WHEN** a closed pull request is reopened
- **THEN** the Prettier check workflow SHALL be triggered
