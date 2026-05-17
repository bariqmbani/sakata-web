# DESIGN.md — Sa-Kata UI/UX Design System

## Overview
Sa-Kata utilizes a **Retro 8-bit (NES) Aesthetic**. The design aims to replicate classic 8-bit video games, ensuring a nostalgic, playful, and highly readable interface. The rewrite abandons generic modern Neo-Brutalism in favor of an authentic pixel-art approach, heavily inspired by the original project's usage of `NES.css`.

## Core Elements

### 1. Typography
- **Primary Font**: `Press Start 2P` [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P).
- **Fallback Fonts**: `ui-monospace, SFMono-Regular, monospace`.
- **Characteristics**: Blocky, all-caps feeling even in lowercase, requires generous line spacing for readability.

### 2. Colors
- **Background (App)**: Off-white/light gray (`#f4f7f8`) for containers, pure black (`#09090b`) for the absolute background wrapper to frame the app.
- **Text (Primary)**: Off-black (`#18181b`).
- **Accent/Highlight**: Yellow-gold (`#a16207` or `rgb(143, 143, 23)`). Used for focus rings and highlighting the last syllable.
- **Error/Danger**: Red-orange (`#e76e54`). Used for wrong answers and alerts.

### 3. UI Components & Shapes

#### Pixel Boxes & Buttons
- **Containers (`.pixel-box`)**: Use `clip-path` to simulate jagged, pixelated corners with white backgrounds and black borders.
- **Buttons (`.pixel-btn`)**: Use a system of multiple `inset` and outer `box-shadows` to create a 3D pressed effect. The background and borders are drawn entirely using shadows to avoid border-rendering artifacts common in standard CSS. There is a distinct visual change on `:active` where the inset shadow reverses to mimic a physical button press.

#### Forms & Inputs
- **Text Inputs**: Utilize `box-shadow` to create a sunken 3D pixel border (similar to `.pixel-btn` but inverted). 
- **Radio Buttons**: Avoid modern CSS circles or generic boxes. Instead, use a visual `►` character indicator next to the label to denote selection, vertically stacked, matching the classic RPG menu aesthetic.
- **Autofocus**: Game loop text inputs must aggressively regain focus after submission (via `setTimeout`) to allow continuous, rapid gameplay without re-tapping the input.

#### Tooltips (`.retro-tooltip`)
- **Appearance**: Solid black background with white text. Pixelated corners.
- **Pointer**: A blocky, CSS-drawn arrow pointing to the referenced text using the `::after` pseudo-element.
- **Interaction**: Must support `:hover` for desktop. Crucially, trigger elements on mobile **must** include `tabIndex={0}` so they become focusable, allowing `:focus-within` to display the tooltip on tap.

### 4. Animations & Micro-interactions
- **Error Shake**: When an invalid word is submitted, the input field executes a rapid `horizontal-shaking` animation (shifting left and right by 3px) for `0.3s`.
- **Alert Fade**: Error alerts entering the screen use a quick fade-in animation.

### 5. Spacing & Layout
- Layouts are primarily centered and single-column (max-width `720px`).
- Form layouts (like settings) favor vertically stacked lists (e.g., `flex-col`) over horizontal grids to preserve the retro menu feel.
- Margins and paddings use coarse, absolute values (e.g., `4px`, `8px`, `16px`) to align with a perceived low-resolution grid.
