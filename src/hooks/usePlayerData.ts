import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';

import { subscribeToUserProfile } from '@/services/auth.service';
import { subscribeToUserSoloGames } from '@/services/game.service';
import type { GameDraft } from '@/types/game.types';
import type { UserProfile } from '@/types/user.types';

type PlayerDataState = {
  profile: UserProfile | null;
  games: GameDraft[];
  isLoading: boolean;
  error: string | null;
};

export function usePlayerData(user: User | null): PlayerDataState {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [games, setGames] = useState<GameDraft[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setGames([]);
      setProfileLoading(false);
      setGamesLoading(false);
      setError(null);
      return;
    }

    setProfileLoading(true);
    setGamesLoading(true);
    setProfile(null);
    setGames([]);
    setError(null);

    const unsubscribeProfile = subscribeToUserProfile(
      user.uid,
      (nextProfile) => {
        setProfile(nextProfile);
        setProfileLoading(false);
      },
      (profileError) => {
        setError(profileError.message);
        setProfileLoading(false);
      }
    );

    const unsubscribeGames = subscribeToUserSoloGames(
      user.uid,
      (nextGames) => {
        setGames(nextGames);
        setGamesLoading(false);
      },
      (gamesError) => {
        setError(gamesError.message);
        setGamesLoading(false);
      }
    );

    return () => {
      unsubscribeProfile();
      unsubscribeGames();
    };
  }, [user]);

  return useMemo(
    () => ({
      profile,
      games,
      isLoading: profileLoading || gamesLoading,
      error
    }),
    [error, games, gamesLoading, profile, profileLoading]
  );
}
