# Vite + TypeScript client with Tailwind CSS (CDN)

The client is built with TypeScript and bundled with Vite. Styling uses Tailwind CSS loaded via CDN at runtime (no PostCSS/build-time Tailwind). The entry point is `index.html` which loads `src/main.ts` as an ES module.

This was chosen because:

- TypeScript provides type safety for the WebSocket message protocol and logstream entry shapes.
- Vite gives fast dev-server HMR and a production bundler with zero config for a small project.
- Tailwind via CDN avoids a PostCSS dependency while still providing utility-first styling.

No UI framework (React, Vue, Svelte) is used — the DOM is manipulated directly, keeping the bundle small and the architecture simple.

**Considered options:**

- **Plain HTML/CSS/JS** — simplest but no type safety; refactoring the message protocol becomes error-prone.
- **React + Vite** — familiar but introduces ~50KB of framework code for a trivial UI.
- **Preact / Svelte** — lighter than React but still requires a framework mental model.

If the client grows significantly in complexity, revisiting this decision may be warranted.
