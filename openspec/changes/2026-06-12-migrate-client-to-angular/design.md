## Context

The ADB Logstream Viewer client is a single-page application that connects to a local Node.js server via WebSocket and renders Android logcat output in real time. The current implementation uses vanilla TypeScript with direct DOM manipulation, a mutable global state object, and Tailwind CSS loaded via CDN.

The client consists of 6 modules: `state.ts`, `websocket.ts`, `render.ts`, `filter.ts`, `search.ts`, `keyboard.ts`, plus `main.ts` as the entry point. DOM manipulation is performed via `document.getElementById`, `innerHTML`, and `appendChild`. State is a plain mutable object with no reactivity.

## Goals / Non-Goals

**Goals:**

- Migrate to Angular 21+ with standalone components
- Use Angular signals for all reactive state management (no RxJS)
- Use Tailwind CSS via PostCSS (build-time processing)
- Use new control flow syntax (`@if`, `@for`)
- Maintain all existing functionality without behavioral changes
- Keep the migration within the existing `client/` directory

**Non-Goals:**

- Adding new features beyond what exists today
- Changing the WebSocket protocol or server
- Introducing RxJS, NgRx, or other state management libraries
- Adding unit or e2e tests (can be done separately)
- Changing the design system or visual appearance

## Decisions

### 1. Angular 21+ with standalone components

- **Why**: Angular 21+ provides signals as a first-class primitive, new control flow syntax, and standalone components by default. This eliminates the need for NgModules and reduces boilerplate.
- **Standalone**: All components are standalone — no `NgModule` declarations needed.

### 2. Pure signals for state management (no RxJS)

- **Why**: The WebSocket API is inherently imperative (`new WebSocket()`, `onopen`, `onclose`). Wrapping it in RxJS adds complexity without proportional benefit for this use case. Signals provide synchronous reactivity that matches the real-time streaming pattern.
- **Signal flow**: `WebSocketService.latestEntry` (signal) → `LogStateService.appendEntry()` → `LogStateService.entries` (signal) → component templates via `@for`.

### 3. Tailwind CSS via PostCSS

- **Why**: Build-time Tailwind processing enables tree-shaking of unused utility classes, eliminates the CDN script dependency, and integrates with Angular CLI's build pipeline. Design tokens from DESIGN.md and the current inline config will be migrated to `tailwind.config.ts`.

### 4. Component architecture

- **Why**: The current flat module structure works but mixes concerns. Angular components enforce clear boundaries: each component owns its template, styles, and behavior. Services handle shared state and cross-cutting concerns.
- **Granularity**: 8 components provide clear separation without over-fragmenting a small application.

### 5. `LogStateService` as the single source of truth

- **Why**: Centralizing all mutable state in one injectable service makes the data flow explicit. Components read signals, call methods to mutate state. No component directly mutates another component's state.

### 6. `WebSocketService` with imperative internals, signal outputs

- **Why**: The WebSocket lifecycle is inherently imperative (open, close, reconnect). The service manages this internally but exposes only signals (`latestEntry`, `status`, `statusMessage`) to the rest of the application. This keeps the WebSocket complexity isolated.

### 7. `LocalStorageService` for persistence

- **Why**: Extracting `localStorage` operations into a dedicated service centralizes error handling (private browsing, unavailable storage) and makes persistence logic testable and reusable.

## Risks / Trade-offs

- **[Risk]** Angular framework overhead (~70-100KB) for a small application.
  → **Mitigation**: Acceptable for the maintainability benefits. Angular's tree-shaking minimizes the impact.

- **[Risk]** Migration may introduce regressions if template bindings don't exactly match current DOM behavior.
  → **Mitigation**: Systematic task breakdown with verification steps for each component.

- **[Risk]** Tailwind CSS class names must exactly match the current CDN-based classes.
  → **Mitigation**: Design tokens and class names are migrated from the existing inline config to `tailwind.config.ts` without changes.

## Migration Plan

The migration is performed in-place within the `client/` directory:

1. Scaffold Angular project and configure Tailwind
2. Create services (`LogStateService`, `WebSocketService`, `LocalStorageService`)
3. Create components (`AppComponent`, `HeaderComponent`, `SearchBarComponent`, `LevelTogglesComponent`, `ConnectionBannerComponent`, `LogListComponent`, `LogRowComponent`, `FooterComponent`)
4. Wire up keyboard shortcuts via `HostListener`
5. Migrate tooltip CSS and behavior
6. Verify all functionality works end-to-end
7. Remove old vanilla TS files

## Open Questions

None. The architecture is fully defined.
