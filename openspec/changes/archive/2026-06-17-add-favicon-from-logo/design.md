## Context

The Angular client already references favicon assets in `index.html`, but the actual asset files are missing:

- `favicon.ico` (16×16, 32×32 for browser tabs)
- `icon-192.png` (192×192 for PWA)
- `icon-512.png` (512×512 for PWA)
- `apple-touch-icon.png` (180×180 for iOS)

The source SVG is at `client/src/assets/logo.svg`. The design must convert this SVG to multiple formats and sizes.

## Goals / Non-Goals

**Goals:**

- Generate all required favicon formats from `logo.svg`
- Ensure cross-browser compatibility (Chrome, Firefox, Safari)
- Support PWA requirements with 192×192 and 512×512 sizes
- Follow Angular asset serving conventions

**Non-Goals:**

- Dynamic favicon generation (static files only)
- Multiple color variants
- Animated favicons

## Decisions

### 1. Conversion tool: Sharp CLI

**Decision:** Use `sharp` CLI (`npx @aspect-dev/sharp-convert` or similar) for SVG-to-PNG conversion.

**Rationale:**

- Node.js native, fast processing
- Maintains vector quality when rasterizing
- No external system dependencies (unlike ImageMagick)

**Alternative considered:** ImageMagick (`convert`)

- Requires system installation
- Less consistent across platforms

### 2. Asset sizes

**Decision:** Generate specific sizes for each use case.

| File                   | Size                          | Purpose         |
| ---------------------- | ----------------------------- | --------------- |
| `favicon.ico`          | 16×16, 32×32 (multi-size ICO) | Browser tab     |
| `favicon.png`          | 32×32                         | Fallback PNG    |
| `apple-touch-icon.png` | 180×180                       | iOS home screen |
| `icon-192.png`         | 192×192                       | PWA shortcust   |
| `icon-512.png`         | 512×512                       | PWA splash      |

### 3. ICO file format

**Decision:** Use a multi-size ICO containing 16×16 and 32×32.

**Rationale:** ICO files with multiple sizes allow browsers to select appropriate resolution. Modern browsers support PNG-in-ICO, but including both sizes ensures broad compatibility.

### 4. Output location

**Decision:** Place all assets in `client/src/assets/`.

**Rationale:** Angular's asset copying configuration automatically includes this folder in builds.

## Risks / Trade-offs

**[Risk]** Logo SVG has white/transparent background → might be invisible on white browser chrome  
**Mitigation:** The logo.svg uses a green (#3DDC84) accent color and dark elements that provide sufficient contrast.

**[Risk]** SVG-to-PNG conversion may introduce artifacts  
**Mitigation:** Use high-quality resampling (Lanczos3) and generate at 2× size then downscale.

**[Risk]** ICO format browser support varies  
**Mitigation:** Include `<link rel="icon" type="image/png">` fallback alongside ICO.

## Migration Plan

1. Generate all favicon assets using Sharp
2. Place assets in `client/src/assets/`
3. Verify Angular serves assets via `npm run build` or `ng serve`
4. Test in Chrome, Firefox, Safari
5. (Optional) Add conversion script to `package.json` for future logo updates

**Rollback:** Simply delete the generated files. The `index.html` will fall back to the SVG logo reference.

## Open Questions

- Should we add a build script to `package.json` for regenerating favicons when logo changes?
- Do we need to support dark mode variants of the favicon?
