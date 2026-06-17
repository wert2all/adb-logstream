# Vite + TypeScript client with Tailwind CSS (CDN)

**Status:** Superseded by ADR-0009

## Context

The client was originally built with TypeScript and bundled with Vite. Styling used Tailwind CSS loaded via CDN at runtime (no PostCSS/build-time Tailwind). The entry point was `index.html` which loaded `src/main.ts` as an ES module.

This was chosen because:

- TypeScript provides type safety for the WebSocket message protocol and logstream entry shapes.
- Vite gives fast dev-server HMR and a production bundler with zero config for a small project.
- Tailwind via CDN avoids a PostCSS dependency while still providing utility-first styling.

No UI framework (React, Vue, Svelte) was used — the DOM was manipulated directly, keeping the bundle small and the architecture simple.

## Considered Options

- **Plain HTML/CSS/JS** — simplest but no type safety; refactoring the message protocol becomes error-prone.
- **React + Vite** — familiar but introduces ~50KB of framework code for a trivial UI.
- **Preact / Svelte** — lighter than React but still requires a framework mental model.

## Consequences

As the UI grew in complexity (log rendering, filtering, search, keyboard shortcuts, tooltips, auto-scroll), direct DOM manipulation became harder to maintain and reason about. This prompted the migration to Angular (see ADR-0009).
