# DESIGN.md — Sa-Kata UI/UX Design System

## Overview
Sa-Kata utilizes a **Retro 8-bit (NES) Aesthetic**. The design aims to replicate classic 8-bit video games, ensuring a nostalgic, playful, and highly readable interface. The rewrite abandons generic modern Neo-Brutalism in favor of an authentic pixel-art approach, heavily inspired by the original project's usage of `NES.css`.

## Core Elements

### 1. Typography
- **Primary Font**: `Press Start 2P` (Google Fonts).
- **Fallback Fonts**: `ui-monospace, SFMono-Regular, monospace`.
- **Characteristics**: Blocky, all-caps feeling even in lowercase, requires generous line spacing for readability.

### 2. Colors
- **Background (App)**: Off-white/light gray (`#f4f7f8`) for containers, pure black (`#09090b`) for the absolute background wrapper to frame the app.
- **Text (Primary)**: Off-black (`#18181b`).
- **Accent/Highlight**: Yellow-gold (`#a16207` or `rgb(143, 143, 23)`). Used for focus rings and highlighting the last syllable.
- **Error/Danger**: Red-orange (`#e76e54`). Used for wrong answers and alerts.

### 3. UI Components & Shapes

#### Pixel Boxes (Containers & Buttons)
Instead of standard CSS borders, components use either layered `box-shadows` or `clip-path` to simulate jagged, pixelated corners.
- **Containers**: Mimic `nes-container` with white backgrounds and pixelated black borders.
- **Buttons**: Have a solid background (white or black), pixelated borders, and a distinct visual change on `:hover` or `:active` (e.g., inverting colors or shifting down).

#### Tooltips
- **Appearance**: Solid black background with white text. Pixelated corners.
- **Pointer**: A blocky, CSS-drawn arrow pointing to the referenced text.
- **Interaction**: Must support `hover` for desktop and `active`/`focus-within` for mobile touch targets.

### 4. Animations & Micro-interactions
- **Error Shake**: When an invalid word is submitted, the input field executes a rapid `horizontal-shaking` animation (shifting left and right by 3px) for `0.3s`.
- **Focus States**: Active inputs and focused buttons display an outline (`#a16207`) separated by a small gap (`outline-offset: 3px`) to ensure accessibility without breaking the pixel border visually.
- **Alert Fade**: Error alerts entering the screen use a quick fade-in animation.

### 5. Spacing & Layout
- Layouts are primarily centered and single-column (max-width `720px`).
- Margins and paddings use coarse, absolute values (e.g., `4px`, `8px`, `16px`) to align with a perceived low-resolution grid.
