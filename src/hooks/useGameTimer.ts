import { useEffect, useState } from 'react';

import type { GameDraft } from '@/types/game.types';

export function useGameTimer(game: GameDraft | null): number {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!game || game.finishedAtMs !== null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [game]);

  if (!game) return 0;

  const elapsed = Math.floor((Date.now() - game.startedAtMs) / 1000);
  return Math.max(game.settings.duration - Math.max(0, elapsed), 0);
}
