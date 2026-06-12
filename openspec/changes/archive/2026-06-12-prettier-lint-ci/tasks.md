## 1. Add Prettier dependency

- [x] 1.1 Install `prettier` as a devDependency in the root `package.json`

## 2. Create Prettier configuration files

- [x] 2.1 Create `.prettierrc` at the repository root with project formatting rules (semi, singleQuote, trailingComma, printWidth, tabWidth)
- [x] 2.2 Create `.prettierignore` at the repository root excluding `dist/`, `node_modules/`, `client/dist/`, and `server/dist/`

## 3. Add npm scripts for local formatting

- [x] 3.1 Add `format:check` script to root `package.json` (`prettier --check .`)
- [x] 3.2 Add `format` script to root `package.json` (`prettier --write .`)

## 4. Create GitHub Actions workflow

- [x] 4.1 Create `.github/workflows/prettier.yml` with a workflow that triggers on `push` to `main` and `pull_request` targeting `main`
- [x] 4.2 Configure the workflow to checkout code, setup Node.js, install dependencies, and run `npm run format:check`

## 5. Format existing codebase

- [x] 5.1 Run `npm run format` to auto-fix all existing formatting issues across the repo
- [x] 5.2 Verify `npm run format:check` passes with no errors after formatting

## 6. Verify and commit

- [x] 6.1 Run `npm run lint` to confirm existing type-checking still passes
- [x] 6.2 Commit all changes (new files + formatting fixes) in a single commit
