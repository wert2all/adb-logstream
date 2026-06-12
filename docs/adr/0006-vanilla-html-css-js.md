# ADR-0006: Angular 21+ client with Tailwind CSS (PostCSS)

## Status

**Superseded** by this ADR (originally: "Vite + TypeScript client with Tailwind CSS (CDN)")

## Context

The client was originally built with vanilla TypeScript bundled by Vite, with Tailwind CSS loaded via CDN and DOM manipulated directly. As the UI grew in complexity (log rendering, filtering, search, keyboard shortcuts, tooltips, auto-scroll), the direct DOM manipulation became harder to maintain and reason about.

The project needs:

- A component-based architecture for clear separation of concerns
- Reactive state management without manual DOM updates
- Build-time Tailwind CSS processing for tree-shaking and smaller bundles

## Decision

The client is built with **Angular 21+** using:

- **Standalone components** (default in Angular 21) — no NgModules
- **Angular signals** for reactive state management (no RxJS for state)
- **New control flow syntax** (`@if`, `@for`) instead of structural directives
- **Tailwind CSS via PostCSS** — build-time processing, no CDN script
- **`tailwind.config.ts`** for design tokens from DESIGN.md

### Component Architecture

| Component                   | Responsibility                                    |
| --------------------------- | ------------------------------------------------- |
| `AppComponent`              | Root layout: header, banner, main, footer         |
| `HeaderComponent`           | Brand, status badge, search, level toggles, clear |
| `SearchBarComponent`        | Search input + clear button                       |
| `LevelTogglesComponent`     | V/D/I/W/E/F toggle buttons                        |
| `ConnectionBannerComponent` | Connection error banner + dismiss                 |
| `LogListComponent`          | Log container with virtual scrolling              |
| `LogRowComponent`           | Single log entry row                              |
| `FooterComponent`           | Keyboard shortcuts + auto-scroll toggle           |

### Service Architecture

| Service               | Responsibility                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `LogStateService`     | Signals: entries, levelFilters, searchQuery, connectionStatus, autoScrollEnabled. Methods: appendEntry(), clearLog(), toggleLevel(), etc. |
| `WebSocketService`    | Connection, reconnect, message parsing. Signals: latestEntry, status, statusMessage.                                                      |
| `LocalStorageService` | Wrapper around localStorage for filter and auto-scroll persistence.                                                                       |

### Styling

Tailwind CSS is processed at build time via PostCSS. The `tailwind.config.ts` file contains all design tokens (colors, typography, spacing) migrated from the inline config in the original `index.html` and the DESIGN.md specification.

## Consequences

- Component boundaries enforce separation of concerns that was previously maintained by convention
- Signals provide reactive state without RxJS overhead
- Build-time Tailwind eliminates the CDN script dependency and enables tree-shaking
- Angular CLI provides standardized build, test, and development tooling
- Bundle size increases (~70-100KB framework overhead) but is offset by better maintainability

## Considered Options

- **Vanilla TypeScript + Vite** (original) — simple but direct DOM manipulation doesn't scale
- **React + Vite** — familiar but different component model; signals are native to Angular
- **Preact / Svelte** — lighter alternatives but Angular signals were the stated goal
- **Angular with RxJS for state** — over-engineered for this use case; pure signals are sufficient
