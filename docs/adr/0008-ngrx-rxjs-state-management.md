# ADR-0008: NgRx + RxJS for state management

## Status

Accepted

## Context

The client needs reactive state management for:

- Log entries (append, clear, cap at 5000)
- Level filters (toggle, persist to localStorage)
- Search query (update, clear)
- Connection status (connected, disconnected, reconnecting)
- Auto-scroll state (toggle, persist to localStorage)
- Entry selection (checkboxes, copy to clipboard)
- Side effects (localStorage persistence, clipboard API, keyboard shortcuts, notification banners)

The WebSocket API is inherently imperative (`new WebSocket()`, `onopen`, `onclose`, `onmessage`). The question was what pattern to use for routing WebSocket data through the UI.

## Decision

Use **NgRx Store + Effects** for all state management. RxJS is used for effect pipelines and selector composition.

### Approach

- **NgRx Store** — single source of truth with two feature slices: `streamState` (log data, filters, selection, connection status) and `notificationState` (banner messages)
- **NgRx Effects** — handle all side effects: localStorage persistence, clipboard copy, keyboard shortcut dispatching, notification timing
- **Angular signals via `selectSignal()`** — components read from the store using `toSignal`-like selectors, keeping templates reactive without manual subscriptions
- **Feature creators (`createFeature`)** — reducer + selectors defined together for each domain slice
- **Functional effects** (`createEffect` with `{ functional: true }`) — injected as plain functions for tree-shakeable effect registration

### Data Flow

```
WebSocket (JSON message)
    → WebSocketService.handleMessage()
        → store.dispatch(streamActions.appendEntry())
            → streamReducer appends to entries[]
                → component selectSignal() picks up change
                    → Angular CDK re-renders @for
```

### State Shape

```
streamState: {
  entries: LogEntry[]          // capped at 5000
  filters: { query?, levels }  // search + level toggles
  selected: LogEntry[]         // checkbox selection
  autoScroll: boolean
  totalReceived: number
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting'
}

notificationState: {
  messages: Message[]          // auto-dismiss banners
}
```

## Consequences

- **+ ~50KB bundle** (NgRx runtime + store-devtools), offset by maintainability gains
- **DevTools** — action history, state inspection, time-travel debugging via `@ngrx/store-devtools`
- **Predictable state flow** — every state change is a dispatched action, every side effect is an effect
- **RxJS learning curve** — developers need to understand `pipe`, `ofType`, `concatLatestFrom`, `map`, `tap`
- **Signals + NgRx hybrid** — `selectSignal()` bridges the two worlds: NgRx for mutation, Angular signals for reactive reads in templates
- **WebSocket stays imperative** — wrapping WebSocket in Observable adds complexity without benefit; imperative dispatch into store is simpler

## Considered Options

- **Pure Angular signals** — simpler and lighter, but lacks DevTools, explicit action traceability, and structured side-effect management. Rejected once the app grew beyond a trivial log viewer (selection, clipboard, keyboard shortcuts, notifications all need coordinated side effects).
- **RxJS BehaviorSubjects in a service** — lighter than NgRx but requires manually wiring DevTools and standardising action patterns across the team. No advantage over NgRx once you need action logging.
- **Akita / Elf** — smaller libraries but less Angular ecosystem integration. NgRx is the Angular-idiomatic choice with the best DevTools support.
- **Signal store (@ngrx/signals)** — bridges NgRx with signals but was immature at the time of this decision and didn't offer the same DevTools integration as the full NgRx store.
