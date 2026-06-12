## Why

The project currently has no automated code formatting checks. Commits can introduce formatting inconsistencies, and there is no CI signal to enforce a consistent code style across contributions. Adding a Prettier lint workflow will ensure all code on `main` and every pull request follows the same formatting rules, reducing review noise and keeping the codebase tidy.

## What Changes

- Add Prettier as a root workspace devDependency with a shared config (`.prettierrc`).
- Create `.github/workflows/prettier-lint.yml` that runs Prettier check on:
  - Every push to `main` (and `master` if present).
  - Every pull request (on `opened`, `synchronize`, `reopened`).
- Add a `format` script to the root `package.json` to enable local ad-hoc formatting.
- No existing behavior is modified — this is purely additive.

## Capabilities

### New Capabilities

- `prettier-ci`: Prettier formatting check running in GitHub Actions on `main` pushes and all pull requests, with clear pass/fail annotations on PR diffs.

### Modified Capabilities

- _(none — no existing specs have requirement changes)_

## Impact

- **New devDependency**: `prettier` added to root `package.json`.
- **New config file**: `.prettierrc` at the repo root.
- **New workflow file**: `.github/workflows/prettier-lint.yml`.
- **New npm script**: `format` script added to root `package.json`.
- **CI**: The existing `commit-lint` workflow is unchanged — the new workflow runs independently.
