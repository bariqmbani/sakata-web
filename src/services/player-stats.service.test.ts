import { describe, expect, it } from 'vitest';

import type { GameDraft } from '@/types/game.types';

import {
  getImportedSoloGameId,
  getPlayerStats,
  toImportedSoloGame
} from './player-stats.service';

function makeGame(overrides: Partial<GameDraft> = {}): GameDraft {
  return {
    id: 'game-id',
    uid: 'guest-uid',
    settings: { duration: 60, allowSkip: true },
    answers: [],
    score: 0,
    accuracy: 0,
    performance: 'kurang',
    startedAtMs: 1000,
    finishedAtMs: 2000,
    ...overrides
  };
}

describe('player-stats.service', () => {
  it('computes stats from finished games only', () => {
    const stats = getPlayerStats([
      makeGame({ score: 8, accuracy: 75 }),
      makeGame({ score: 12, accuracy: 50 }),
      makeGame({ score: 40, accuracy: 100, finishedAtMs: null })
    ]);

    expect(stats).toEqual({
      gamesPlayed: 2,
      totalCorrectWords: 20,
      bestStreak: 12,
      averageAccuracy: 63
    });
  });

  it('returns zero stats without finished games', () => {
    const stats = getPlayerStats([
      makeGame({ score: 40, accuracy: 100, finishedAtMs: null })
    ]);

    expect(stats).toEqual({
      gamesPlayed: 0,
      totalCorrectWords: 0,
      bestStreak: 0,
      averageAccuracy: 0
    });
  });

  it('copies solo games to deterministic imported ids and target owner', () => {
    const importedGame = toImportedSoloGame(
      makeGame({ id: 'source/game', score: 5 }),
      'target/user'
    );

    expect(importedGame.id).toBe(
      getImportedSoloGameId('source/game', 'target/user')
    );
    expect(importedGame.id).toBe('imported_target_user_source_game');
    expect(importedGame.uid).toBe('target/user');
    expect(importedGame.score).toBe(5);
    expect(importedGame.startedAt.toMillis()).toBe(1000);
    expect(importedGame.finishedAt?.toMillis()).toBe(2000);
  });
});
