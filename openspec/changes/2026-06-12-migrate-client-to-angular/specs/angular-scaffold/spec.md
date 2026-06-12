# Angular Scaffold

## Purpose

Define the Angular 21+ project setup, build configuration, and Tailwind CSS integration for the Client.

## Requirements

### Requirement: Angular 21+ project

The Client SHALL be an Angular 21+ application using standalone components.

#### Scenario: Project initialized

- **WHEN** the Client project is created
- **THEN** it SHALL use Angular 21+ with standalone components (no NgModules)
- **AND** the project SHALL be located in the `client/` directory

### Requirement: Tailwind CSS via PostCSS

The Client SHALL use Tailwind CSS processed at build time via PostCSS.

#### Scenario: Tailwind classes applied

- **WHEN** the Client build runs
- **THEN** Tailwind CSS utility classes SHALL be processed at build time via `@tailwindcss/postcss`
- **AND** no CDN script SHALL be loaded at runtime

### Requirement: Design token configuration

The Client SHALL maintain all design tokens in `tailwind.config.ts`.

#### Scenario: Colors available

- **WHEN** the Client build runs
- **THEN** all color tokens from DESIGN.md (background, surface, primary, secondary, log-v through log-f, etc.) SHALL be available as Tailwind utility classes

#### Scenario: Fonts available

- **WHEN** the Client build runs
- **THEN** JetBrains Mono SHALL be the primary monospace font
- **AND** Geist SHALL be available for headings

### Requirement: Dev server proxy

The Client dev server SHALL proxy WebSocket connections to the Server.

#### Scenario: Development mode

- **WHEN** the Client dev server starts
- **THEN** WebSocket connections to `/ws` SHALL be proxied to `ws://localhost:3000`

### Requirement: Production build

The Client SHALL produce a production build via Angular CLI.

#### Scenario: Production build

- **WHEN** `ng build` is run
- **THEN** optimized static assets SHALL be produced in `client/dist/`
- **AND** the Server SHALL be able to serve these assets
