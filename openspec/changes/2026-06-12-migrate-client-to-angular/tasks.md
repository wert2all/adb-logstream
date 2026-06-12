## 1. Angular Scaffold & Tailwind Setup

- [x] 1.1 Remove existing `client/src/`, `client/index.html`, `client/vite.config.ts`, `client/tsconfig.json`, `client/package.json`
- [x] 1.2 Initialize Angular 21+ project in `client/` using `ng new` with standalone components, CSS, and SSR disabled
- [x] 1.3 Install Tailwind CSS and configure PostCSS integration (`@tailwindcss/postcss`)
- [x] 1.4 Create `tailwind.config.ts` with design tokens from DESIGN.md and current inline config (colors, fonts, spacing)
- [x] 1.5 Configure Angular dev server proxy for WebSocket (`ws://localhost:3000`)
- [x] 1.6 Verify `ng serve` starts and displays the default Angular page

## 2. Services

- [x] 2.1 Create `LogStateService` with signals: `entries`, `levelFilters`, `searchQuery`, `connectionStatus`, `totalReceived`, `autoScrollEnabled`
- [x] 2.2 Add `LogStateService` methods: `appendEntry()`, `clearLog()`, `toggleLevel()`, `setSearchQuery()`, `setAutoScroll()`, `getFilteredEntries()` (computed)
- [x] 2.3 Create `WebSocketService` with signals: `latestEntry`, `status`, `statusMessage`
- [x] 2.4 Implement `WebSocketService.connect()`, `disconnect()`, `scheduleReconnect()` with 3-second delay
- [x] 2.5 Create `LocalStorageService` with methods: `save(key, value)`, `load(key)`, `saveFilters()`, `loadFilters()`, `saveAutoScroll()`, `loadAutoScroll()`
- [x] 2.6 Wire `WebSocketService` to call `LogStateService.appendEntry()` on each entry message
- [x] 2.7 Verify services are injectable and signals update correctly

## 3. Components

- [x] 3.1 Create `AppComponent` as root layout (header, banner, main, footer)
- [x] 3.2 Create `HeaderComponent` with brand, status badge, search, level toggles, count, and clear button
- [x] 3.3 Create `SearchBarComponent` with input field and clear button, bound to `LogStateService.searchQuery` signal
- [x] 3.4 Create `LevelTogglesComponent` with V/D/I/W/E/F buttons, each bound to `LogStateService.levelFilters` signal
- [x] 3.5 Create `ConnectionBannerComponent` bound to `WebSocketService.statusMessage` signal
- [x] 3.6 Create `LogListComponent` with `@for` loop over `LogStateService.getFilteredEntries()` computed signal
- [x] 3.7 Create `LogRowComponent` with `@Input` for entry data, color-coded level display
- [x] 3.8 Create `FooterComponent` with keyboard shortcut legend and auto-scroll toggle checkbox
- [x] 3.9 Implement DOM entry cap (max 5000 entries) in `LogStateService`
- [x] 3.10 Implement total entry count display in header

## 4. Auto-Scroll

- [x] 4.1 Implement scroll detection in `LogListComponent` (track if user is within 50px of bottom)
- [x] 4.2 Implement auto-scroll behavior: scroll to bottom on new entry when enabled and user is at bottom
- [x] 4.3 Disable auto-scroll when user scrolls up manually
- [x] 4.4 Persist auto-scroll state via `LocalStorageService`

## 5. Keyboard Shortcuts

- [x] 5.1 Add `@HostListener('document:keydown')` in `AppComponent` for global keyboard shortcuts
- [x] 5.2 Implement `/` to focus search, `Escape` to clear search, `c` to clear logs
- [x] 5.3 Implement `v/d/i/w/e/f` to toggle corresponding level filters
- [x] 5.4 Skip shortcuts when input/textarea is focused (except Escape)

## 6. Tooltips

- [x] 6.1 Migrate tooltip CSS from inline `<style>` to Angular component styles
- [x] 6.2 Add tooltip markup to `SearchBarComponent`, `ClearButton` in `HeaderComponent`, and each button in `LevelTogglesComponent`
- [x] 6.3 Verify tooltip show/hide behavior with 300ms delay

## 7. Cleanup & Verification

- [x] 7.1 Remove old vanilla TS files (`state.ts`, `websocket.ts`, `render.ts`, `filter.ts`, `search.ts`, `keyboard.ts`, `main.ts`)
- [x] 7.2 Remove old `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`
- [x] 7.3 Update root `package.json` workspace configuration if needed
- [x] 7.4 Run `ng build` and verify production build succeeds
- [x] 7.5 Run `ng lint` and fix any lint errors
- [x] 7.6 Manual verification: connect to server, verify log streaming, filtering, search, keyboard shortcuts, auto-scroll, tooltips, connection status
