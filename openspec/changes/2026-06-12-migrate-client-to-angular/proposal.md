## Why

The Client is currently built with vanilla TypeScript and direct DOM manipulation. As the UI has grown in complexity (log rendering, filtering, search, keyboard shortcuts, tooltips, auto-scroll), the imperative DOM manipulation pattern has become harder to maintain. The project needs a component-based architecture with reactive state management to support continued growth.

The goal is to migrate the Client to Angular 21+ using standalone components, signals for state management, and Tailwind CSS processed at build time via PostCSS.

## What Changes

- Replace the vanilla TypeScript + Vite client with an Angular 21+ application
- Introduce a component-based architecture with 8 standalone components
- Replace mutable state object with Angular signals for reactive state management
- Replace CDN-loaded Tailwind CSS with build-time Tailwind via PostCSS
- Use new Angular control flow syntax (`@if`, `@for`) instead of structural directives
- Maintain all existing functionality: log streaming, level filtering, search, keyboard shortcuts, auto-scroll, connection status, tooltips

## Capabilities

### New Capabilities

- `angular-scaffold`: Angular 21+ project setup with standalone components, Tailwind CSS via PostCSS, and build configuration
- `signal-state`: Angular signals-based state management via `LogStateService`, replacing the mutable `state` object
- `angular-websocket-service`: WebSocket connection management as an Angular service with signals for status and latest entry

### Modified Capabilities

- `log-rendering`: Migrated from direct DOM manipulation to Angular component rendering with `LogListComponent` and `LogRowComponent`
- `level-filtering`: Migrated from imperative DOM updates to signal-driven reactivity via `LogStateService`
- `text-search`: Migrated from manual DOM traversal to signal-based filtering and `computed()` derived state
- `auto-scroll-toggle`: Migrated from direct DOM event handling to Angular component with signal-driven auto-scroll logic
- `keyboard-shortcuts`: Migrated from global `document.addEventListener` to Angular component with HostListener
- `control-tooltips`: Migrated from inline HTML/CSS to Angular component templates

## Impact

- **Client directory**: `client/` will be replaced with a new Angular project (same directory, new structure)
- **Dependencies**: Angular 21+, Tailwind CSS, PostCSS (replaces Vite + vanilla TS)
- **Build**: Angular CLI replaces Vite for dev server and production builds
- **Server**: No changes required — WebSocket protocol remains identical
- **No breaking changes**: All existing functionality is preserved
