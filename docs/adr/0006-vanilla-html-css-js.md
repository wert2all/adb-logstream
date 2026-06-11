# Vanilla HTML/CSS/JS client

The client is built with plain HTML, CSS, and JavaScript — no frameworks, no build tools, no bundlers. A single `index.html` loads a `style.css` and an `app.js`.

This was chosen because the UI is simple (a log list, a search input, maybe filter toggles) and does not benefit from a framework's component model or reactivity. Avoiding a build chain keeps the project instantly runnable and dependency-free on the client side.

**Considered options:**
- **React + Vite** — familiar but introduces a build step and ~50KB of framework code for a trivial UI.
- **Preact / Svelte** — lighter than React but still requires a build step.

If the client grows significantly in complexity, revisiting this decision may be warranted.
