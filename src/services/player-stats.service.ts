import { Timestamp } from 'firebase/firestore';

import type { GameDraft, SoloGame } from '@/types/game.types';
import type { UserProfile } from '@/types/user.types';

export type PlayerStats = UserProfile['stats'];

export function getPlayerStats(games: GameDraft[]): PlayerStats {
  const finishedGames = games.filter((game) => game.finishedAtMs !== null);
  const gamesPlayed = finishedGames.length;
  const totalCorrectWords = finishedGames.reduce(
    (total, game) => total + game.score,
    0
  );
  const bestStreak = finishedGames.reduce(
    (best, game) => Math.max(best, game.score),
    0
  );
  const averageAccuracy =
    gamesPlayed === 0
      ? 0
      : Math.round(
          finishedGames.reduce((total, game) => total + game.accuracy, 0) /
            gamesPlayed
        );

  return {
    gamesPlayed,
    totalCorrectWords,
    bestStreak,
    averageAccuracy
  };
}

export function getImportedSoloGameId(
  gameId: string,
  targetUid: string
): string {
  return `imported_${sanitizeDocumentIdPart(targetUid)}_${sanitizeDocumentIdPart(gameId)}`;
}

export function toImportedSoloGame(
  game: GameDraft,
  targetUid: string
): SoloGame {
  return {
    id: getImportedSoloGameId(game.id, targetUid),
    uid: targetUid,
    settings: game.settings,
    answers: game.answers,
    score: game.score,
    accuracy: game.accuracy,
    performance: game.performance,
    startedAt: Timestamp.fromMillis(game.startedAtMs),
    finishedAt:
      game.finishedAtMs === null
        ? null
        : Timestamp.fromMillis(game.finishedAtMs)
  };
}

function sanitizeDocumentIdPart(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '_');
}
