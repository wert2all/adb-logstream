## Why

The adb-logstream Angular client is missing a favicon. While the logo SVG exists at `client/src/assets/logo.svg`, it is not being served as a favicon in the browser tab. Adding a proper favicon improves brand recognition and user experience.

## What Changes

- Generate favicon assets (`.ico` and `.png`) from the existing `logo.svg`
- Configure Angular to serve the favicon via `index.html`
- Assets are optimized for browser tab display (16×16, 32×32) and can include a larger variant for bookmarks

## Capabilities

### New Capabilities

- `favicon-asset`: Serve a favicon for the Angular client using the existing brand logo converted to multiple formats and sizes

### Modified Capabilities

- None

## Impact

- **Files created**: `client/src/assets/favicon.ico`, `client/src/assets/favicon.png`
- **Files modified**: `client/src/index.html` (add `<link rel="icon">` tags)
- **Dependencies**: Requires SVG-to-ICO/PNG conversion tool (e.g., `sharp`, `imagemagick`, or online converter)
