import { useEffect, useMemo, useState } from 'react';

import type { GameDraft } from '@/types/game.types';

export function useGameTimer(game: GameDraft | null): number {
  const initialRemaining = useMemo(() => {
    if (!game) return 0;
    const elapsed = Math.floor((Date.now() - game.startedAtMs) / 1000);
    return Math.max(game.settings.duration - elapsed, 0);
  }, [game]);

  const [remaining, setRemaining] = useState(initialRemaining);

  useEffect(() => {
    setRemaining(initialRemaining);
  }, [initialRemaining]);

  useEffect(() => {
    if (!game || game.finishedAtMs !== null || remaining <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - game.startedAtMs) / 1000);
      setRemaining(Math.max(game.settings.duration - elapsed, 0));
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [game, remaining]);

  return remaining;
}
