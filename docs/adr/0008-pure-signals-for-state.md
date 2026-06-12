# ADR-0008: Pure signals for state management (no RxJS)

## Status

Accepted

## Context

Angular 21+ provides signals as a built-in reactive primitive. The client needs reactive state management for:

- Log entries (append, clear, cap at 5000)
- Level filters (toggle, persist to localStorage)
- Search query (update, clear)
- Connection status (connected, disconnected, reconnecting)
- Auto-scroll state (toggle, persist to localStorage)

The WebSocket API is inherently imperative (`new WebSocket()`, `onopen`, `onclose`, `onmessage`). The question is whether to wrap it in RxJS Observables or keep it imperative and expose state via signals.

## Decision

Use **pure Angular signals** for all state management. No RxJS is used in the client.

### Approach

- `WebSocketService` uses imperative WebSocket API internally
- Exposes `signal<LogstreamEntry | null>` for latest entry, `signal<ConnectionStatus>` for status
- `LogStateService` owns all application state as signals
- Components read signals directly in templates or via `effect()` for side effects
- `computed()` signals derived from base signals (e.g., filtered entries, visible count)

### Signal Flow

```
WebSocketService.latestEntry (signal)
    → LogStateService.appendEntry()
        → LogStateService.entries (signal)
            → LogListComponent reads via @for
            → LogRowComponent receives entry as input
```

## Consequences

- No RxJS dependency reduces bundle size and learning curve
- Signals are synchronous by default, which matches the real-time log streaming use case
- `effect()` handles side effects (auto-scroll, DOM updates) without Observable pipes
- Reconnect logic remains imperative in `WebSocketService` — this is appropriate since WebSocket lifecycle is inherently imperative

## Considered Options

- **RxJS Observables with `toSignal()`** — provides operators like `retry`, `switchMap`, but adds complexity and bundle size for a simple use case
- **RxJS for WebSocket only** — inconsistent: some state via signals, some via Observables; creates two mental models
- **NgRx / Akita** — full state management libraries; overkill for this application's state complexity
