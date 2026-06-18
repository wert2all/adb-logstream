# 0010 — npm Package Publishing

We publish `adb-logstream` to the npm registry as a pre‑built package so that users can run the server via `npx adb-logstream` without cloning, installing, or building the project manually. The server binary ships with the compiled Angular client so that a single process serves both WebSocket and static HTTP.

Before this decision the only documented way to run the server required `git clone`, `npm install`, and `npm run build`. Publishing on npm with a `bin` entry removes all setup steps — one command is enough. The pre‑built approach (as opposed to building on `npm install`) keeps `npx` startup times fast and avoids requiring build toolchains on the consumer machine.

The trade‑off is that the server must serve HTTP static files (previously it was WebSocket‑only), and the release process gains a publish step. We considered a Docker‑only delivery and rejected it because:

- Docker adds more overhead for a tool that runs on the host and needs access to `adb`
- `npx` is significantly simpler for developers already working with Node.js

Status: proposed.
