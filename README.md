# Sa-Kata Web

React + Vite rewrite of the legacy Sa-Kata web app.

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
