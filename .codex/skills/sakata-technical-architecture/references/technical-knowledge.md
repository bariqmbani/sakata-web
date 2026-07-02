# Sa-Kata Technical Knowledge

## Current Stack

- React 19 + Vite SPA.
- TypeScript strict mode with `noUncheckedIndexedAccess`.
- React Router v7 for client routes.
- Tailwind CSS v4 plus Figma design tokens, rounded UI primitives, and motion helpers in `src/styles.css`.
- Firebase Auth, Firestore, Realtime Database, and optional Analytics.
- Vitest and Testing Library for tests.
- `lucide-react` for icons.

No SSR, Remix, Express, SASS, NES.css import, or Node server should be added.

## Current App Shape

- `src/App.tsx` owns Firebase readiness, app providers, router, and route registration.
- `src/routes/HomeRoute.tsx` is a simple title menu. It subscribes to player games only to show `Lanjutkan Permainan` for unfinished games.
- `src/routes/ProfileRoute.tsx` shows profile, derived stats, and finished solo-game history.
- `src/routes/NewSoloGameRoute.tsx` creates solo games with settings.
- `src/routes/SoloGameRoute.tsx` runs the active solo session.
- `src/components/ui` contains generic Figma-aligned controls; `src/components/game` contains game-specific pieces including the custom keyboard and active-game cards.

## Firebase Data Flow

- `useAuth` ensures an anonymous Firebase user and profile document.
- `users/{uid}` stores display name, anonymous state, and stats fields.
- `games/{gameId}` stores solo games with `uid`, `settings`, `answers`, `score`, `accuracy`, `performance`, `startedAt`, and `finishedAt`.
- `subscribeToSoloGame` listens to one game document for active play.
- `subscribeToUserSoloGames` listens to all games for the current user and sorts by `startedAt` client-side.
- `usePlayerData` combines the user profile and user solo games for menu/profile surfaces.

For Firestore queries, prefer the simplest indexed path. The current user-game history query uses `where('uid', '==', uid)` and client-side sorting to avoid requiring a composite index during alpha.

## Game Logic

- `game.service.ts` creates games, appends answers, finishes games, and logs analytics.
- `game-rules.service.ts` validates answers against the current required syllable, dictionary membership, and duplicates.
- `report.service.ts` owns score, accuracy, speed, and performance formulas.
- `word.service.ts` owns dictionary loading, random first words, and skip-word selection.
- `src/lib/syllable.ts` wraps `@bariqmbani/sakata-syllable-engine`.

Do not copy syllable logic into this repo. If syllable parsing needs changes, change the engine package.

## UI and State Patterns

- Use functional components only.
- Put Firebase subscriptions in custom hooks.
- Avoid `useEffect` for derived state; use inline computation or `useMemo`.
- Keep home menu uncluttered. Profile/history data belongs in `/profil`.
- Use Indonesian UI copy and English internal code/docs.
- Use the Figma token/component system in `DESIGN.md`; keep shared UI in `src/components/ui` and game-specific surfaces in `src/components/game`.
- Active solo play uses a custom button keyboard with hardware-key support; preserve the required-syllable prefill behavior.

## Security and Future Backend Work

- Firestore rules should restrict users to their own profiles and solo games.
- Room data will need authenticated reads/writes and player membership checks.
- Realtime Database is reserved for presence.
- Multiplayer validation should use Cloud Functions before production-hardening.
- Leaderboard requires a public-safe aggregate or carefully scoped read model; do not expose all private games directly.

## Verification

Use the narrowest checks that cover the change, then broaden for shared behavior:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Known build caveat: Firebase can make the main Vite chunk exceed 500 KB. Treat this as a warning unless the task is specifically about bundle splitting.

`npm run format:check` may reveal unrelated preexisting formatting drift. Format touched files, but avoid broad formatting churn unless requested.
