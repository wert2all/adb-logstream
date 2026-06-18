---
name: Technical Precision
colors:
  surface: "#0b1326"
  surface-dim: "#0b1326"
  surface-bright: "#31394d"
  surface-container-lowest: "#060e20"
  surface-container-low: "#131b2e"
  surface-container: "#171f33"
  surface-container-high: "#222a3d"
  surface-container-highest: "#2d3449"
  on-surface: "#dae2fd"
  on-surface-variant: "#c2c6d6"
  inverse-surface: "#dae2fd"
  inverse-on-surface: "#283044"
  outline: "#8c909f"
  outline-variant: "#424754"
  surface-tint: "#adc6ff"
  primary: "#adc6ff"
  on-primary: "#002e6a"
  primary-container: "#4d8eff"
  on-primary-container: "#00285d"
  inverse-primary: "#005ac2"
  secondary: "#4edea3"
  on-secondary: "#003824"
  secondary-container: "#00a572"
  on-secondary-container: "#00311f"
  tertiary: "#ffb786"
  on-tertiary: "#502400"
  tertiary-container: "#df7412"
  on-tertiary-container: "#461f00"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#d8e2ff"
  primary-fixed-dim: "#adc6ff"
  on-primary-fixed: "#001a42"
  on-primary-fixed-variant: "#004395"
  secondary-fixed: "#6ffbbe"
  secondary-fixed-dim: "#4edea3"
  on-secondary-fixed: "#002113"
  on-secondary-fixed-variant: "#005236"
  tertiary-fixed: "#ffdcc6"
  tertiary-fixed-dim: "#ffb786"
  on-tertiary-fixed: "#311400"
  on-tertiary-fixed-variant: "#723600"
  background: "#0b1326"
  on-background: "#dae2fd"
  surface-variant: "#2d3449"
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: "600"
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: -0.01em
  body-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
    letterSpacing: 0em
  body-mono-bold:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 22px
    letterSpacing: 0em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: "500"
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 1px
---

## Brand & Style

The design system is engineered for technical proficiency, targeting developers and systems engineers who require high-performance interfaces. The brand personality is clinical, efficient, and precise.

The aesthetic is a fusion of **Minimalism** and **Modern IDE** patterns. It prioritizes content over chrome, using a monochromatic base to reduce cognitive load, while utilizing high-contrast status colors to guide attention. The UI should evoke the feeling of a well-configured terminal: predictable, fast, and authoritative.

## Colors

The system operates on a deep "Midnight" dark mode to minimize eye strain during long-form technical work.

The palette is strictly functional. Neutrals define the structural hierarchy, ranging from the deep background to slate-toned borders. Accents are reserved exclusively for status indicators and primary actions. Log levels use a standardized high-contrast mapping to ensure immediate error identification within dense text streams.

## Typography

Typography is the core of this design system. We use **JetBrains Mono** for all data-rich areas, logs, and UI controls to ensure perfect vertical alignment and readability of technical strings. **Geist** is used sparingly for high-level headings to provide a modern, clean contrast to the monospaced body text.

The type scale is compact to support high information density. For mobile devices, font sizes remain consistent with desktop to preserve the integrity of code-like layouts, utilizing horizontal scrolling for code blocks rather than text wrapping.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy inspired by IDE panels. The screen is divided into functional zones (Sidebar, Editor, Console, Inspector) separated by 1px borders rather than wide gutters.

Spacing follows a strict 4px baseline grid. Padding in technical lists and tables should be kept tight (sm/8px) to maximize the amount of visible data. The layout is fully responsive, where sidebars collapse into drawers on mobile and the main content area utilizes 100% of the viewport width.

## Elevation & Depth

This system avoids shadows entirely to maintain a flat, technical aesthetic. Depth is communicated through **Tonal Layers** and **Low-contrast Outlines**:

- **Level 0 (Background):** The base application canvas (`#020617`).
- **Level 1 (Panels):** Sidebars and toolbars use a slightly lighter tint (`#0F172A`).
- **Level 2 (Active Elements):** Focused or active items use the surface color (`#1E293B`) with a subtle border.
- **Level 3 (Modals/Popovers):** These use the same surface color but are defined by a strong border (`#475569`) to separate them from the background.

## Shapes

Shapes are intentionally geometric and sharp. We use a **Soft (0.25rem)** roundedness for buttons and input fields to prevent the UI from feeling hostile, but containers and panels retain sharp 0px corners to reinforce the "grid" and terminal-like structure.

> **Implementation notes:** Several DESIGN.md specifications diverge from the current code. See the [design deviations](#design-deviations) section for details.

## Components

- **Buttons:** Primary buttons are solid `--color-primary-container` (`#4d8eff`). Secondary buttons are similarly styled with container color. All buttons use `body-mono-bold` for text.
- **Status Chips:** Small, rectangular indicators with a subtle background tint of the log-level color and a high-contrast label.
- **Input Fields:** Dark backgrounds (`--color-background: #0b1326`) with a 1px border (`--color-outline-variant`). On focus, the border changes to `--color-primary` (`#adc6ff`) with a 1px ring.
- **Log Lists:** Hovering over a log line triggers a subtle surface highlight (`--color-surface-container-high`). Row selection uses a level-tinted background (20% opacity of the level color).
- **Checkboxes:** Square with rounded corners. The checkmark uses the accent color (`--color-primary`).
- **Tabs:** Underline style for active state. No background change. Active tab uses the primary Blue-500 for the underline and text.
- **Tree View:** Used for file navigation or object inspection. Indentation should be exactly 16px per level with vertical guidelines.

## Design Deviations

The following aspects of this design spec are not implemented in the current codebase:

| Spec                                | Actual                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------ |
| Background `#020617` (Level 0)      | `--color-background: #0b1326`                                            |
| Geist font for headings             | Only JetBrains Mono used (applied globally via `font-mono`)              |
| Blue-600 / Blue-500 primary buttons | `--color-primary-container` (`#4d8eff`) / `--color-primary` (`#adc6ff`)  |
| Zebra striping for log rows         | Not implemented; hover + selection highlighting only                     |
| Shadows for elevation               | Tonal layers + 1px borders used (consistent with current implementation) |

These deviations reflect iterative refinement during implementation. The design spec serves as the guiding vision, while the actual codebase represents the pragmatic application."X" or tick in the primary color.

- **Tabs:** Underline style for active state. No background change. Active tab uses the primary Blue-500 for the underline and text.
- **Tree View:** Used for file navigation or object inspection. Indentation should be exactly 16px per level with vertical guidelines.
