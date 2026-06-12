## Context

The project (adb-logstream) is a monorepo with `server` and `client` workspaces. It uses TypeScript with strict mode and Vite for the client. Currently, the root `package.json` has `lint` as a type-checking script (`tsc --noEmit`) but no formatting enforcement. `prettier` is not yet a dependency.

No `.github/workflows/` directory exists yet — this will be the first GitHub Actions workflow added to the project.

## Goals / Non-Goals

**Goals:**

- Add a GitHub Actions workflow that runs Prettier in check mode on PRs targeting `main` and on pushes to `main`
- Provide `.prettierrc` and `.prettierignore` files for consistent local and CI formatting
- Add `format` and `format:check` npm scripts for developer convenience
- Keep CI job fast — only run Prettier, no unnecessary steps

**Non-Goals:**

- Auto-formatting commits (e.g. pre-commit hooks, GitHub auto-fix PRs) — out of scope for this change
- Replacing or modifying the existing `lint` (type-check) script — Prettier is additive only
- Formatting non-TypeScript/non-JavaScript assets (e.g. `.md`, `.json`) — focus on source code

## Decisions

### Decision: Standalone GitHub Actions workflow (not integrated into an existing one)

Rationale: No existing CI workflow exists yet. Creating a dedicated `prettier.yml` workflow keeps concerns separate and avoids coupling with future CI steps. This follows the common pattern of one workflow per concern.

### Decision: Prettier as a root devDependency installed at workspace root

Rationale: The root `package.json` already hosts cross-cutting devDependencies (`concurrently`, `@commitlint/cli`). Prettier formatting applies to both workspaces, so installing it at the root avoids duplication. The `npx prettier` invocation runs from the root and recurses into all workspace directories.

### Decision: Use Prettier defaults with minimal overrides

Rationale: The project has no existing Prettier config. Using a small `.prettierrc` with sensible defaults (matching common TypeScript conventions) avoids bikeshedding. Specific choices:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

- `singleQuote: true` — aligns with Vite/TypeScript community conventions.
- `trailingComma: all` — cleaner diffs on multi-line structures.
- `printWidth: 100` — balances readability without being too wide for split-view diffs.

### Decision: Check-only in CI, auto-fix via local npm script

Rationale: CI should never mutate files — it should only report violations. Auto-fix (`--write`) is a local-only convenience via `npm run format`.

### Decision: Ignore `dist/`, `node_modules/`, `client/dist/`

Rationale: These are generated artifacts. Formatting them would be wasteful and could cause false failures if build output doesn't match Prettier style.

## Risks / Trade-offs

- **First CI failure on existing unformatted code** → Before merging this change, run `npm run format` on the entire codebase to preemptively fix any formatting issues so the first CI run on main passes.
- **Formatter disagreements** → If anyone has an existing formatter (e.g. ESLint formatting rules) there could be conflicts. This project does not use ESLint formatting rules (only `tsc --noEmit`), so this risk is minimal.
- **PR noise during transition** → Open PRs will need to rebase and reformat after this lands. Mitigation: communicate the change and provide a one-liner for contributors (`npx prettier --write .`).

## Migration Plan

1. Implement all files (`.github/workflows/prettier.yml`, `.prettierrc`, `.prettierignore`, updated `package.json`).
2. Run `npm run format` on the entire repo to fix any pre-existing formatting issues.
3. Open a single PR containing both the workflow changes and the formatting fixes.
4. After merge, verify the `prettier` check passes on `main`.

There is no rollback complexity — deleting the workflow file and removing the devDependency reverts the change entirely.

## Open Questions

None at this point. The approach is straightforward with no ambiguous trade-offs.
