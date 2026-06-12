## 1. Prettier Setup

- [x] 1.1 Install `prettier` as a root workspace devDependency via `npm install -D -w . prettier`
- [x] 1.2 Create `.prettierrc` at repo root with initial config (`semi: true`, `singleQuote: false`, `tabWidth: 2`, `trailingComma: "all"`)
- [x] 1.3 Add `format` script to root `package.json`: `"format": "prettier --write ."`
- [x] 1.4 Run `npm run format` on the entire codebase and commit the formatting diff

## 2. GitHub Actions Workflow

- [x] 2.1 Create `.github/workflows/prettier-lint.yml` with workflow triggers: `push` on `main` and `pull_request` with types `[opened, synchronize, reopened]`
- [x] 2.2 Add job steps: checkout, setup Node.js 20, `npm ci`, `npx prettier --check .`
- [x] 2.3 Verify the workflow passes on the PR that introduces this change
