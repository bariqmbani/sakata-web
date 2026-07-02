# Sa-Kata Web

React + Vite rewrite of the legacy Sa-Kata web app.

## UI Direction

The app implements the Figma mobile-first UI system for Sa-Kata:

- centered 390-430px gameplay shell on mobile and desktop
- Inter typography
- warm cream/orange/teal/yellow design tokens
- rounded cards, buttons, status cards, chips, and feedback banners
- custom in-game keyboard for fast solo play

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in the Firebase project values before
running the app.

## Firebase Setup

In Firebase Console:

1. Enable Authentication providers:
   - Anonymous
   - Google
2. Create a Firestore database.
3. Publish `firestore.rules` for local development and deployed environments.
4. Optional: set `VITE_FIREBASE_MEASUREMENT_ID` to enable Analytics events.

Solo games are stored in `games/{gameId}` and user profiles in `users/{uid}`.
Rules restrict both collections to the signed-in owner.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If local `node_modules/.bin/*` shims are not executable in the workspace, run
the underlying tools through `node`, for example:

```bash
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js .
node node_modules/vitest/vitest.mjs run
node node_modules/typescript/bin/tsc -b && node node_modules/vite/bin/vite.js build
```
