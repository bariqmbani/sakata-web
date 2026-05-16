import { useEffect, useState } from 'react';

import { subscribeToSoloGame } from '@/services/game.service';
import type { GameDraft } from '@/types/game.types';

type SoloGameState = {
  game: GameDraft | null;
  isLoading: boolean;
  error: string | null;
};

export function useSoloGame(gameId: string | undefined): SoloGameState {
  const [state, setState] = useState<SoloGameState>({
    game: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!gameId) {
      setState({
        game: null,
        isLoading: false,
        error: 'Permainan tidak ditemukan.'
      });
      return;
    }

    const unsubscribe = subscribeToSoloGame(
      gameId,
      (game) => setState({ game, isLoading: false, error: null }),
      (error) =>
        setState({
          game: null,
          isLoading: false,
          error: error.message
        })
    );

    return unsubscribe;
  }, [gameId]);

  return state;
}
