## 1. Root Monorepo Setup

- [x] 1.1 Create root `package.json` with npm workspaces: `["server", "client"]`
- [x] 1.2 Create root `tsconfig.base.json` with shared compiler options (strict, ES2022, etc.)
- [x] 1.3 Create root `.gitignore` with entries for `node_modules/`, `dist/`, `.env`
- [x] 1.4 Add root workspace scripts: `dev`, `build`, `lint`, `start`

## 2. Server Package

- [x] 2.1 Create `server/package.json` with `name: "server"`, `type: "commonjs"`, dependency on `ws`
- [x] 2.2 Create `server/tsconfig.json` extending `../tsconfig.base.json` with Node target
- [x] 2.3 Add server scripts: `start` (node dist/index.js), `build` (tsc), `dev` (tsc --watch + nodemon/tsx)
- [x] 2.4 Create `server/src/` directory with stub entry point

## 3. Client Package

- [x] 3.1 Create `client/package.json` with `name: "client"`, `type: "module"`, Vite dependency
- [x] 3.2 Create `client/tsconfig.json` extending `../tsconfig.base.json` with browser target
- [x] 3.3 Create `client/vite.config.ts` with dev server proxy to `http://localhost:3000`
- [x] 3.4 Add client scripts: `dev` (vite), `build` (vite build), `preview` (vite preview)
- [x] 3.5 Create `client/index.html` as entry point for Vite
- [x] 3.6 Create `client/src/` directory with stub `main.ts`
