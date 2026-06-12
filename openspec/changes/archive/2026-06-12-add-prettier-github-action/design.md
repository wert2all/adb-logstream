## Context

The project is a Node.js monorepo with two workspaces (`server`, `client`) using TypeScript. There is currently no automated code formatting — no Prettier, no ESLint style rules. A `commit-lint` GitHub Action already exists for commit message validation, establishing the CI pattern. The project uses `npm ci` for dependency installation in CI and runs on `ubuntu-latest` with Node.js 20.

Adding Prettier formatting is a straightforward, low-risk change: it introduces no new runtime dependencies, doesn't alter application logic, and can be rolled back by deleting the workflow file.

## Goals / Non-Goals

**Goals:**

- Enforce consistent Prettier formatting on all push events to `main`.
- Enforce consistent Prettier formatting on all pull requests targeting `main`.
- Provide a local `npm run format` script so developers can auto-fix before pushing.
- Reuse the existing CI setup pattern (Ubuntu, Node.js 20, `npm ci`).

**Non-Goals:**

- Not a code linter or type checker — Prettier only handles formatting (whitespace, semicolons, quotes, etc.).
- No integration with the existing `commit-lint` workflow — they remain independent checks.
- No automatic formatting in CI (no `--write` mode) — only `--check` to gate on correctness.

## Decisions

### Decision: Single workflow file for both main and PR triggers

A single `.github/workflows/prettier-lint.yml` will handle both push-to-main and pull_request events. This keeps CI configuration DRY and avoids duplicating the job definition.

**Alternatives considered:**

- _Two workflow files_: More complex, no benefit since the job steps are identical.
- _Repository dispatch_: Unnecessary indirection for a simple formatting check.

### Decision: Use `npx prettier --check .` as the check command

Prettier's `--check` flag runs a read-only audit and exits non-zero if any file is unformatted. This is the idiomatic CI command. The dot (`.`) checks all file types Prettier supports, filtered by config.

**Alternatives considered:**

- _`prettier --check "\*\*/_.{ts,js,json,css,md}"`*: Harder to maintain as the project grows new file types. The `.prettierrc`configuration is the right place to control which files are checked (via`overrides`or a separate`.prettierignore`).

### Decision: Minimal `.prettierrc` config

Use Prettier's sensible defaults initially. Only add explicit overrides if the team reaches consensus on specific rules. This avoids bikeshedding and keeps the diff minimal.

**Alternatives considered:**

- _Custom config from the start_: Pre-mature opinionation for a project without formatting history.
- _No config (all defaults)_: Equivalent — Prettier defaults are well-documented and widely used.

| Setting         | Value   | Reason                                                 |
| --------------- | ------- | ------------------------------------------------------ |
| `semi`          | `true`  | Default                                                |
| `singleQuote`   | `false` | Default                                                |
| `tabWidth`      | `2`     | Default                                                |
| `trailingComma` | `all`   | Matches existing TypeScript convention in the codebase |

### Decision: No `.prettierignore` unless needed

Prettier automatically ignores files inside `.gitignore` and `node_modules`. An additional `.prettierignore` will only be added if there's a specific need to exclude a non-gitignored path (e.g., auto-generated output directories like `dist/`).

### Decision: Add `format` script at root

```json
"format": "prettier --write ."
```

This gives developers a one-command way to auto-format, using the same config as CI. The `--write` flag mutates files in place.

## Risks / Trade-offs

- **[Risk] CI fails on pre-existing unformatted files**: If the codebase has formatting issues on `main` when the workflow is introduced, every push will fail until someone runs `npm run format`.  
  **Mitigation**: Run `npm run format` and commit the result _before_ or as part of the PR that introduces the workflow. This is a one-time cost.

- **[Risk] Prettier version drift between CI and developer machines**: If developers use a different Prettier version locally, CI may disagree.  
  **Mitigation**: Prettier is pinned in `package.json` as a devDependency. Running `npm ci` in CI ensures exact version matching. Developers should run `npm install` to stay in sync.

- **[Risk] Workflow fails silently**: Without proper check annotations, a failed formatting check might go unnoticed.  
  **Mitigation**: Prettier's exit code is non-zero on failure, which GitHub Actions surfaces as a failed check. The PR will show a red "Checks" status, blocking merge if branch protection rules require passing checks.

## Migration Plan

1. **PR 1 — Add infrastructure** (this change):
   - Install `prettier` as root devDependency.
   - Create `.prettierrc` with initial config.
   - Add `format` script to root `package.json`.
   - Run `npm run format` on the entire codebase and commit the formatting diff.
   - Create `.github/workflows/prettier-lint.yml`.
   - Verify the workflow passes on the PR itself.

2. **Future**: No ongoing migration needed. Formatting rules can be tweaked by updating `.prettierrc` in subsequent PRs.

## Open Questions

- Should `dist/` directories be explicitly excluded via `.prettierignore`? (Currently they're gitignored, so Prettier skips them by default — no action needed unless build output is shipped.)
- Should `package-lock.json` be formatted? Prettier supports JSON but `package-lock.json` is auto-generated — it's included by default unless gitignored, which it isn't. Worth noting: formatting it won't break `npm ci` since lockfile format is deterministic.
