# DESIGN.md — Sa-Kata UI/UX Design System

## Overview

Sa-Kata uses the Figma mobile-first UI direction from **Sa-Kata Mobile-First UI/UX Design**. The experience should feel cheerful, quick, and game-like without returning to the old square NES.css/pixel treatment.

The source of truth is a centered mobile shell: design for 390px-wide screens first, support small mobile around 360px, and keep the gameplay panel capped around 430px on desktop.

## Foundations

### Typography

- Primary font: `Inter`.
- Display title: 46/52, extra bold.
- Page title: 28/34, extra bold.
- Game word: 38/44, extra bold.
- Required syllable: 34/40, extra bold.
- Timer/status value: 30/34 or compact 24/28, extra bold.
- Body: 15/22, regular or medium.
- Button text: 16/20, bold.

### Color Tokens

- `background`: `#FFF6D8`
- `background-soft`: `#FFE8A6`
- `surface`: `#FFFFFF`
- `surface-raised`: `#FFFDF4`
- `primary`: `#FF5C38`
- `primary-pressed`: `#D9472D`
- `primary-strong`: `#BC3520`
- `primary-strong-hover`: `#9E2B16`
- `secondary`: `#20BFA9`
- `accent`: `#FFB703`
- `success`: `#1FA66A`
- `warning`: `#F59E0B`
- `error`: `#E5484D`
- `text-primary`: `#24222B`
- `text-secondary`: `#6F6575`
- `text-inverse`: `#FFFFFF`
- `border`: `#F0D38B`
- `disabled`: `#CFC7B8`

## Components

- App shell: centered, max width about `430px`, warm background, rounded desktop frame, soft decorative circles.
- Buttons: rounded `18px`, 1px border, subtle warm shadow, clear primary/secondary/soft/danger/disabled states.
- Cards: rounded `18–28px`, `border` token, white or raised surface, warm shadow.
- Chips: rounded full pills for syllables, chain history, badges, and required syllable.
- Status cards: compact cards for `Waktu`, `Skor`, and `Kombo`.
- Active game keyboard: fixed/sticky bottom game keyboard, not a focused native input during normal play.
- Feedback banners: success/error rounded banners with a colored dot and short Indonesian copy.
- Focus: visible blue focus ring (`#3A86FF`) on all interactive controls.

### Contrast rules for `primary`

White text on `primary` (`#FF5C38`) is only 3.07:1, so it clears WCAG AA as large
text (≥24px, or ≥18.66px bold) and nowhere else. For anything smaller:

- Filled buttons keep the `primary` fill and switch the label to `text-primary`
  ink (5.11:1) — the submit key stays visually loud rather than being darkened.
- Text and icons on `primary-soft` use `primary-strong` (4.67:1), not
  `primary-pressed` (3.50:1, fails).
- `primary-strong` is also a safe fill behind white text (5.72:1), with
  `primary-strong-hover` as its hover.

Do not reintroduce an un-layered `button { font: inherit }` rule. Tailwind v4
utilities live in `@layer utilities`, so any un-layered element rule silently
overrides every font utility on every button.

## Layout

- Mobile screen padding: `20–28px`.
- Chain scaling: below `700px` viewport height the game word drops to 30/36 and
  chain rows to 14/18, so the chain and required syllable still fit above the
  fixed keyboard on iPhone SE/8-class screens.
- Card padding: `18–24px`.
- Section gap: `24–32px`.
- Button gap: `12–16px`.
- Chip gap: `8px`.
- Keyboard gap: `4–8px`.
- Safe area: include `env(safe-area-inset-bottom)` for keyboard bottom padding.
- Desktop: do not expand gameplay into a dashboard; center the mobile shell.

## Interaction

- Custom keyboard:
  - Letter buttons append letters.
  - `Hapus` removes one letter but preserves the required-syllable prefill.
  - `Kosong` resets the answer to the required syllable.
  - `Kirim` submits.
  - `Lewati` submits an auto-generated skip word when skip is enabled.
- Hardware keyboard:
  - Letter keys append.
  - `Enter` submits.
  - `Backspace` deletes one letter after the required syllable.
  - `Esc` resets to the required syllable.
- Motion:
  - Invalid answer shake.
  - Feedback pop/fade under 180ms.
  - Low timer pulse.
  - Respect `prefers-reduced-motion`.

## Copy

- UI text is Indonesian.
- Empty history: `Belum ada riwayat permainan. Mainkan satu ronde untuk melihat progresmu.`
- Loading: `Menyiapkan kata...`
- Generic error: `Ada masalah. Coba lagi.`
