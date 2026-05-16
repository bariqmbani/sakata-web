# AGENTS.md — Sa-Kata Web Rewrite

## Purpose

Rewrite of `sa-kata__web` (Remix + Express + in-memory state) into a client-side SPA with Firebase backend and real-time multiplayer support.

Sa-Kata is an Indonesian word-chain game. Players chain words by matching the last syllable of the previous word to the start of the next:

```txt
ma-kan → kan-di-dat → da-ta → ta-ri → ...
```

The syllable engine is handled by the sibling package `sakata-syllable-engine`. This app consumes it as a library and via a Cloudflare Worker edge API.

---

## Tech Stack

| Layer        | Technology                           | Notes                                                                             |
| ------------ | ------------------------------------ | --------------------------------------------------------------------------------- |
| Framework    | React 19 + Vite                      | Client-side SPA, no SSR needed                                                    |
| Language     | TypeScript (strict)                  |                                                                                   |
| Routing      | React Router v7 (or TanStack Router) | Client-side routing only                                                          |
| Styling      | Tailwind CSS v4                      | Replaces SASS + NES.css from legacy app                                           |
| Database     | Firebase Firestore                   | Real-time listeners for game state sync                                           |
| Presence     | Firebase Realtime Database           | Player online/offline/disconnect detection                                        |
| Auth         | Firebase Authentication              | Anonymous auth for quick play, Google/email for persistent profiles               |
| Hosting      | Firebase Hosting                     | Or Cloudflare Pages                                                               |
| Syllable API | `sakata-syllable-engine` npm package | Import directly for client-side use. Fall back to Cloudflare Worker API if needed |
| Testing      | Vitest + Testing Library             |                                                                                   |
| Linting      | ESLint flat config + Prettier        |                                                                                   |

---

## Architecture

```
sakata-web/
  src/
    main.tsx                    # App entrypoint
    App.tsx                     # Router + providers
    routes/                     # Page components (one per route)
    components/                 # Shared UI components
      ui/                       # Generic reusable (Button, Modal, Input, Timer)
      game/                     # Game-specific (WordDisplay, AnswerInput, ScoreBoard)
    hooks/                      # Custom React hooks
    lib/
      firebase.ts               # Firebase app init + exports (auth, db, rtdb)
      syllable.ts               # Thin wrapper around sakata-syllable-engine
    services/
      auth.service.ts           # Login, logout, anonymous auth
      game.service.ts           # CRUD for game documents in Firestore
      lobby.service.ts          # Multiplayer lobby: create/join/leave rooms
      presence.service.ts       # RTDB presence system
      word.service.ts           # Word lookup, random word generation
    types/                      # Shared TypeScript types
    constants/                  # App-wide constants
```

### Key Architectural Decisions

1. **Client-side only.** No server, no SSR. All game logic runs in the browser. Firebase handles persistence and real-time sync.

2. **Syllable engine runs client-side.** Import `sakata-syllable-engine` directly. The engine is lightweight, deterministic, and has no Node.js dependencies — it was designed for this. Do not duplicate syllable logic in this repo.

3. **Firebase Firestore for game data.** Documents for games, rooms, players. Real-time listeners (`onSnapshot`) push state changes to all connected clients.

4. **Firebase Realtime Database for presence only.** Firestore does not have built-in presence. Use RTDB's `onDisconnect()` to detect when players drop from a multiplayer session.

5. **Word dictionary stays server-side.** The legacy app loads a 1.7 MB CSV into memory. For the rewrite, the word list should be stored in Firestore (or a static JSON hosted on CDN) and queried. Consider a Cloud Function for word validation to prevent client-side cheating in multiplayer.

---

## Data Model (Firestore)

### `users/{uid}`

```ts
type UserProfile = {
  uid: string;
  displayName: string;
  isAnonymous: boolean;
  stats: {
    gamesPlayed: number;
    totalCorrectWords: number;
    bestStreak: number;
    averageAccuracy: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

### `rooms/{roomId}`

A room represents a multiplayer lobby/session.

```ts
type GameRoom = {
  id: string;
  hostUid: string;
  status: 'waiting' | 'playing' | 'finished';
  settings: {
    duration: 30 | 60 | 90;
    maxPlayers: 2 | 3 | 4;
    allowSkip: boolean;
  };
  players: Record<string, RoomPlayer>;
  currentTurn: {
    playerUid: string;
    word: string;
    syllables: string[];
    lastSyllable: string;
    startedAt: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type RoomPlayer = {
  uid: string;
  displayName: string;
  score: number;
  correctWords: number;
  isConnected: boolean;
  joinedAt: Timestamp;
};
```

### `rooms/{roomId}/answers/{answerId}`

```ts
type GameAnswer = {
  playerUid: string;
  word: string;
  syllables: string[];
  isCorrect: boolean;
  note?: string;
  timestamp: Timestamp;
};
```

### `games/{gameId}` (solo mode)

Solo games use a simpler flat document. Keep the same structure as the legacy `Game` type but persisted.

```ts
type SoloGame = {
  id: string;
  uid: string;
  settings: {
    duration: 30 | 60 | 90;
    allowSkip: boolean;
  };
  answers: GameAnswer[];
  score: number;
  accuracy: number;
  performance: string;
  startedAt: Timestamp;
  finishedAt: Timestamp | null;
};
```

---

## Multiplayer Design

### Turn Flow

```
1. Host creates room → room status = 'waiting'
2. Other players join via room code or matchmaking
3. Host starts game → room status = 'playing', first word generated
4. currentTurn rotates between players:
   a. Active player sees the last syllable and types a word
   b. Client validates word locally (exists in dictionary + starts with last syllable)
   c. If valid: write answer to subcollection, update currentTurn, rotate to next player
   d. If invalid: show error to current player, do not rotate
5. Timer expires OR all turns complete → room status = 'finished'
6. All clients show scoreboard
```

### Real-time Sync

```ts
// All clients listen to room document
onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
  const room = snapshot.data() as GameRoom;
  // Update UI: current word, whose turn, scores, timer
});
```

### Presence Detection

```ts
// On join, write to RTDB and set onDisconnect
const presenceRef = ref(rtdb, `rooms/${roomId}/presence/${uid}`);
set(presenceRef, true);
onDisconnect(presenceRef).remove();

// Listen for presence changes → update Firestore player.isConnected
onValue(ref(rtdb, `rooms/${roomId}/presence`), (snapshot) => {
  // Sync connected players to Firestore room document
});
```

### Anti-Cheat Considerations

In multiplayer, word validation should not be purely client-side. Options:

1. **Cloud Function trigger** — An `onCreate` trigger on `rooms/{roomId}/answers/{answerId}` validates the word server-side and updates the answer's `isCorrect` field. Slight latency but secure.
2. **Callable Cloud Function** — Client calls a function to submit answers. The function validates and writes. More control, slightly more complex.
3. **Client-side only** — Acceptable for a casual game, especially early on. Can be hardened later.

Start with option 3 for solo mode and option 1 or 2 for multiplayer.

---

## Syllable Engine Integration

The `sakata-syllable-engine` package exports:

```ts
import {
  getLastSyllable,
  identifyLastSyllable,
  splitLastSyllable
} from 'sakata-syllable-engine';

identifyLastSyllable('makan');
// ['ma', 'kan']

getLastSyllable('kandidat');
// 'dat'

splitLastSyllable('makan');
// { original: 'makan', normalized: 'makan', prefix: 'ma',
//   last: 'kan', parts: ['ma', 'kan'], ruleId: 'ends-with-vc', source: 'rule' }
```

Install it as an npm dependency. If it's not yet published, use a local file dependency or workspace link:

```json
{
  "dependencies": {
    "sakata-syllable-engine": "file:../sakata-syllable-engine"
  }
}
```

Create a thin wrapper at `src/lib/syllable.ts` to centralize usage:

```ts
import {
  identifyLastSyllable,
  splitLastSyllable
} from 'sakata-syllable-engine';
import type { LastSyllableResult } from 'sakata-syllable-engine';

export function getSyllables(word: string): string[] {
  return identifyLastSyllable(word);
}

export function getLastSyllableOf(word: string): string {
  return splitLastSyllable(word).last;
}

export type { LastSyllableResult };
```

Do not copy or rewrite syllable logic into this repo. If the engine needs changes, make them in `sakata-syllable-engine`.

---

## Authentication

Support three auth modes:

1. **Anonymous** — Auto-created on first visit. Allows immediate play without signup. Profile is ephemeral.
2. **Google Sign-In** — Persistent profile, stats, and game history.
3. **Email/Password** — Alternative persistent auth.

Anonymous users can link their account to Google/email later without losing data (`linkWithCredential`).

For solo mode, anonymous auth is sufficient. For multiplayer, encourage (but don't require) sign-in so display names are meaningful.

---

## Routes

```
/                       → Landing / main menu
/bermain                → Solo game options (duration, skip toggle)
/bermain/:gameId        → Active solo game session
/ruang                  → Multiplayer lobby list / create room
/ruang/:roomId          → Multiplayer game room (waiting → playing → finished)
/ruang/:roomId/hasil    → Multiplayer game results
/cara-bermain           → How to play (static)
/profil                 → User profile + stats (authenticated users)
```

---

## Conventions

### Language

- All UI text is in **Indonesian**.
- Code (variables, comments, docs) is in **English**.
- Use "consonant digraph" for `ng`, `ny`, `sy`, `kh` — never call them diphthongs.
- Diphthongs are vowel pairs: `ai`, `au`, `ei`, `oi`.

### TypeScript

- Strict mode with `noUncheckedIndexedAccess: true`.
- Use `type` imports: `import type { X } from '...'`.
- No `any`. Use `unknown` and narrow.
- Prefer named exports.

### React

- Functional components only.
- Custom hooks for all Firebase subscriptions (e.g., `useRoom(roomId)`, `usePresence(roomId)`).
- Avoid `useEffect` for derived state — use `useMemo` or compute inline.
- Use Suspense + Error Boundaries for async states.

### Tailwind

- No custom CSS files unless absolutely necessary.
- Use Tailwind utility classes directly in JSX.
- Extract repeated patterns into components, not CSS classes.
- If the retro pixel aesthetic from NES.css is desired, consider a Tailwind plugin or a small set of custom utilities in `tailwind.config.ts` — do not import NES.css.

### File Naming

- Components: `PascalCase.tsx` (e.g., `WordDisplay.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g., `useGameRoom.ts`)
- Services: `kebab-case.service.ts` (e.g., `game.service.ts`)
- Types: `kebab-case.types.ts` or colocated in the module that owns them
- Constants: `UPPER_SNAKE_CASE` for values, `kebab-case.ts` for files

### Testing

- Vitest for unit and integration tests.
- React Testing Library for component tests.
- Test files colocated next to source: `Component.test.tsx`.
- Mock Firebase in tests — do not hit real Firestore.
- Syllable logic tests belong in `sakata-syllable-engine`, not here.

---

## Commands

```bash
npm run dev           # Vite dev server
npm run build         # Production build
npm run preview       # Preview production build locally
npm run test          # Vitest (run once)
npm run test:watch    # Vitest (watch mode)
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier
npm run format:check  # Prettier check
npm run typecheck     # tsc --noEmit
```

To run a single test:

```bash
npx vitest run src/hooks/useGameRoom.test.ts
```

---

## Migration from Legacy

### What to Preserve

- **Game mechanics**: Duration options (30/60/90s), skip toggle, word validation (starts with last syllable + exists in dictionary), performance rating formula.
- **Word dictionary**: The CSV word list from `sa-kata__web/app/api/data/data.csv`. Convert to a Firestore collection or a static JSON file hosted on CDN.
- **Excluded first words list**: The curated list of words unsuitable as starting words (abbreviations, rare borrowed words).
- **Game report formulas**: `countCorrectAnswers`, `countAnswersAccuracy`, `countAnswersSpeed`, `getPerformance` — port these utility functions directly.

### What to Drop

- Remix/Express server — no server in the new app.
- In-memory `games[]` array — replaced by Firestore.
- Legacy syllable engine (`syllabify.api.ts`, `word.util.ts`) — replaced by `sakata-syllable-engine` package.
- NES.css dependency — replaced by Tailwind.
- SASS build pipeline — replaced by Tailwind.

### What's New

- Firebase Auth (anonymous + persistent accounts).
- Multiplayer rooms with real-time sync.
- Persistent game history and user stats.
- Presence detection for multiplayer.
- Leaderboard potential (query Firestore for top scores).

---

## Implementation Phases

### Phase 1 — Project Scaffold + Solo Mode

Set up Vite + React + TypeScript + Tailwind + Firebase + React Router. Implement solo mode that replicates the current game exactly.

1. Initialize project with Vite React-TS template
2. Install and configure Tailwind CSS v4
3. Set up Firebase project and `lib/firebase.ts`
4. Set up React Router with route structure
5. Implement anonymous auth (auto sign-in on first visit)
6. Integrate `sakata-syllable-engine` package
7. Build solo game flow: options → game session → results
8. Migrate word dictionary (static JSON or Firestore)
9. Implement word validation (exists + starts with last syllable + not already used)
10. Implement game timer, skip, and game-over modal
11. Port performance rating formulas
12. Write component and hook tests

Acceptance: Solo mode works identically to the legacy app. Game state persists in Firestore. Anonymous auth works.

### Phase 2 — User Profiles + History

1. Add Google sign-in and email/password auth
2. Account linking (anonymous → persistent)
3. User profile page with game stats
4. Game history list (past solo games)
5. Update stats after each game (games played, accuracy, best streak)

Acceptance: Users can sign in, view profile, and see past game results.

### Phase 3 — Multiplayer

1. Implement room creation and join-by-code
2. Build lobby waiting screen with player list
3. Implement presence system (RTDB `onDisconnect`)
4. Build multiplayer game flow with turn rotation
5. Real-time sync of game state via Firestore `onSnapshot`
6. Score tracking per player
7. Multiplayer results screen with rankings
8. Handle edge cases: player disconnect mid-game, host leaves, room timeout

Acceptance: Two or more players can play a word-chain game in real-time. Disconnections are detected and handled gracefully.

### Phase 4 — Polish + Anti-Cheat

1. Cloud Function for server-side word validation in multiplayer
2. Room matchmaking (optional — list open rooms)
3. Leaderboard page
4. Mobile-responsive layout
5. Loading states, error boundaries, empty states
6. Animations and transitions
7. Accessibility audit

---

## Firebase Security Rules (Starter)

```js
// Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }

    match /games/{gameId} {
      allow read: if request.auth != null && resource.data.uid == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow update: if request.auth != null && resource.data.uid == request.auth.uid;
    }

    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null
        && request.auth.uid in resource.data.players;
    }

    match /rooms/{roomId}/answers/{answerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

---

## Do Not Do

- Rewrite or duplicate syllable logic — use `sakata-syllable-engine`
- Add SSR or a Node.js server — this is a client-side SPA
- Use `any` type
- Import the legacy app's code directly — port what's needed, drop the rest
- Make multiplayer validation purely client-side in production
- Store the full 1.7 MB word list in Firestore documents — use a collection with indexed queries, or a static CDN-hosted file
- Add heavy dependencies for simple tasks
- Write UI text in English — the app is in Indonesian
- Use class-based React components
- Skip Firebase security rules — even for development, use restrictive rules
