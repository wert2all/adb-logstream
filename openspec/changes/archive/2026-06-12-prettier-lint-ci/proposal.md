## Why

The project currently has no automated code formatting enforcement. This leads to inconsistent style across commits and unnecessary noise in PR reviews. Adding a GitHub Action that runs Prettier on the main branch and every PR ensures consistent formatting without manual effort.

## What Changes

- Add a GitHub Actions workflow that runs Prettier linting on pushes to `main` and on all pull requests
- Add a Prettier configuration file (`.prettierrc`) with project-appropriate defaults
- Add a `.prettierignore` file to exclude generated/built assets (e.g. `dist/`, `node_modules/`)
- Add an npm script (`format` / `format:check`) for local Prettier runs

## Capabilities

### New Capabilities

- `ci-prettier-lint`: GitHub Actions workflow that runs Prettier in check mode on PRs and pushes to main, failing the build if files are not formatted

### Modified Capabilities

_(none — no existing specs are affected)_

## Impact

- **New files**: `.github/workflows/prettier.yml`, `.prettierrc`, `.prettierignore`
- **Modified files**: `package.json` (add `format` / `format:check` scripts, add `prettier` as a devDependency)
- **Dependencies**: Adds `prettier` as a dev dependency
- **CI**: Every PR and push to `main` will now trigger a Prettier check; unformatted code will fail the check
