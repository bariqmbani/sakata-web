# Sa-Kata Product Knowledge

## Product Identity

Sa-Kata is an Indonesian word-chain game. Players continue a chain by entering a valid Indonesian word that starts with the last syllable of the previous word:

```txt
ma-kan -> kan-di-dat -> da-ta -> ta-ri
```

The experience should feel like a compact, cheerful, mobile-first word game: direct, playful, readable, and menu-driven. Avoid turning the app into a generic productivity dashboard.

## Current Product State

- Solo mode exists and is the primary playable loop.
- Anonymous auth lets players start immediately.
- Solo games persist in Firestore.
- `/profil` contains the player card and game history.
- The home screen is intentionally simple: `Mulai Permainan`, `Cara Bermain`, `Profil`, and disabled `Papan Peringkat` marked `Segera`.
- The home screen may show `Lanjutkan Permainan` when an unfinished solo game exists.
- `Tantangan Harian` and `Lencana` are later content additions, not current home-screen content.
- Multiplayer, full persistent account flows, leaderboard, matchmaking, daily challenge, badges, and anti-cheat hardening are roadmap work.

## Game Rules and Scoring

- Duration options are 30, 60, and 90 seconds.
- Skip is enabled by default and can be toggled before starting solo play.
- A valid answer must exist in the dictionary, start with the required last syllable, and not repeat a previously used word in the same game.
- The first word is generated automatically and excluded from player score.
- Skipped/generated answers do not count as player-correct answers.
- Performance labels are Indonesian: `kurang`, `cukup`, `baik`, `hebat`, `luar biasa`.

## Information Architecture

- `/`: title menu only. Keep it uncluttered.
- `/bermain`: solo game options.
- `/bermain/:gameId`: active solo session.
- `/cara-bermain`: static rules and examples.
- `/profil`: profile, stats, and full game history.
- `/ruang` and related multiplayer routes are future-facing.

Do not place passive profile cards, recent-history panels, long instructions, progress dashboards, daily-challenge panels, or badge collections on the home screen. Put that detail behind `Profil` or a future dedicated route.

## UI Copy and Terminology

- All user-facing UI text must be Indonesian.
- Code, comments, and internal docs may be English.
- Use concise labels that fit the compact mobile shell and rounded button system.
- Prefer `Mulai Permainan`, `Lanjutkan Permainan`, `Cara Bermain`, `Profil`, `Papan Peringkat`, and `Segera` for the main menu family.
- Use "suku kata" for syllable in UI copy.
- Use "consonant digraph" in technical/docs language for `ng`, `ny`, `sy`, `kh`; do not call them diphthongs.
- Diphthongs are vowel pairs: `ai`, `au`, `ei`, `oi`.

## Roadmap Guidance

- Profile/history should mature before social features: persistent sign-in, account linking, stats updating, and history quality.
- `Tantangan Harian` should be added after solo/profile stability. It should use one shared daily starting word or required syllable and record whether the player completed that day.
- `Lencana` should be derived from stable stats/history, such as first game completed, first 10-word chain, total correct words, best streak, or daily-challenge streak.
- Daily challenge and badges may be previewed from `Profil`, but should not become permanent title-menu panels.
- Leaderboard needs a public-safe scoring model and Firestore rules before activation.
- Multiplayer should include room creation, join-by-code, waiting room, turn rotation, presence handling, results, and disconnect behavior.
- Multiplayer validation should not remain purely client-side for production; use a Cloud Function trigger or callable function.

## Product Do/Do Not

Do:

- Preserve the fast game loop.
- Keep first-screen choices few and obvious.
- Use compact menu patterns, rounded cards, and Figma-aligned controls.
- Make empty states short and actionable.
- Add progression content only when it reinforces replay, not when it distracts from starting a game.
- Treat alpha/future features honestly with `Segera` or hidden routes.

Do not:

- Add dashboard content to the home screen.
- Add `Tantangan Harian` or `Lencana` as always-visible home panels.
- Add English UI copy.
- Introduce rules that conflict with legacy solo mechanics.
- Ship a leaderboard without deciding data visibility and security.
- Duplicate syllable logic in the web app.
