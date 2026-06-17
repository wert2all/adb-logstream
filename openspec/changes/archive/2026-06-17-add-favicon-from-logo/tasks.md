## 1. Setup

- [x] 1.1 Install sharp CLI for SVG-to-PNG conversion (`npm install --save-dev sharp`)

## 2. Generate Favicon Assets

- [x] 2.1 Generate 32×32 PNG (`favicon.png`) from `logo.svg`
- [x] 2.2 Generate 180×180 PNG (`apple-touch-icon.png`) for iOS
- [x] 2.3 Generate 192×192 PNG (`icon-192.png`) for PWA shortcut
- [x] 2.4 Generate 512×512 PNG (`icon-512.png`) for PWA splash
- [x] 2.5 Generate multi-size ICO with 16×16 and 32×32 (`favicon.ico`)

## 3. Verify Asset Serving

- [x] 3.1 Run `npm run build` to verify Angular copies assets
- [x] 3.2 Check `dist/client/browser/assets/` contains all favicon files
- [ ] 3.3 Test favicon display in Chrome (open devtools → Network → reload)
- [ ] 3.4 Test favicon display in Firefox

## 4. Optional Enhancements

- [x] 4.1 Add `generate:favicons` script to `client/package.json` for future logo updates
- [x] 4.2 Document SVG source file path in README for logo maintenance
