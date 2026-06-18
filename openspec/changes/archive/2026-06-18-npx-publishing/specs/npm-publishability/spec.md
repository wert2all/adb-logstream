# NPM Publishability

## Purpose

Define the package metadata, dependency organization, and build automation required to publish `adb-logstream` to npm and enable one-command invocation via `npx adb-logstream`.

## ADDED Requirements

### Requirement: Package provides a CLI entry point

The root `package.json` SHALL declare a `bin` entry that maps the command `adb-logstream` to the compiled server entry point.

#### Scenario: Bin entry exists

- **WHEN** inspecting root `package.json`
- **THEN** it SHALL contain `"bin": { "adb-logstream": "server/dist/index.js" }`

### Requirement: Package ships only compiled artifacts

The root `package.json` SHALL declare a `files` whitelist that includes only runtime-compiled artifacts and documentation.

#### Scenario: Files whitelist limits published contents

- **WHEN** inspecting root `package.json`
- **THEN** it SHALL contain a `files` array including `server/dist/`, `client/dist/client/browser/`, `README.md`, and `LICENSE`
- **AND** it SHALL NOT include source directories such as `server/src/` or `client/src/`

### Requirement: Fresh build before publish

The root `package.json` SHALL declare a `prepublishOnly` script that triggers a full build.

#### Scenario: Prepublish script exists

- **WHEN** inspecting root `package.json` scripts
- **THEN** it SHALL contain `"prepublishOnly": "npm run build"`

### Requirement: Runtime dependencies in root package

Runtime dependencies required by the server SHALL be declared in root `package.json` `dependencies`.

#### Scenario: Runtime deps moved to root

- **WHEN** inspecting root `package.json` `dependencies`
- **THEN** it SHALL contain `ws` and `uuid`
- **AND** `server/package.json` `dependencies` SHALL be empty or omitted

### Requirement: Client-only dependencies removed from root

Dependencies used only by the Angular client SHALL NOT be in root `package.json` `dependencies`.

#### Scenario: Angular build deps moved to client

- **WHEN** inspecting root `package.json` `dependencies`
- **THEN** it SHALL NOT contain `@ng-icons/core` or `@ng-icons/phosphor-icons`
- **AND** `client/package.json` `dependencies` SHALL contain `@ng-icons/core` and `@ng-icons/phosphor-icons`

### Requirement: Type definitions are development dependencies

Type definition packages (`@types/*`) SHALL be declared as `devDependencies`.

#### Scenario: Type defs are dev deps

- **WHEN** inspecting root `package.json` `devDependencies`
- **THEN** it SHALL contain `@types/ws` and `@types/uuid`
- **AND** it SHALL NOT contain `@types/ws` or `@types/uuid` in `dependencies`
