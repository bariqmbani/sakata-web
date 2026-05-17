import { useEffect } from 'react';
import { Link } from 'react-router';
import type { User } from 'firebase/auth';

import { usePlayerData } from '@/hooks/usePlayerData';
import { logHomeView } from '@/services/analytics.service';

type HomeRouteProps = {
  user: User | null;
};

export function HomeRoute({ user }: HomeRouteProps) {
  const playerData = usePlayerData(user);
  const activeGame = playerData.games.find(
    (game) => game.finishedAtMs === null
  );

  useEffect(() => {
    logHomeView();
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
      <header className="select-none text-center">
        <h1 className="text-5xl font-black sm:text-7xl">Sa-Kata</h1>
        <p className="mt-2 text-right text-xs font-bold text-[#8f8f17]">
          versi alpha
        </p>
      </header>

      <nav className="mt-12 flex w-full max-w-sm flex-col gap-5">
        {activeGame && (
          <Link
            className="pixel-btn block w-full bg-[#fef9c3] px-5 py-4 text-sm"
            to={`/bermain/${activeGame.id}`}
          >
            Lanjutkan Permainan
          </Link>
        )}
        <Link
          className="pixel-btn block w-full px-5 py-4 text-sm"
          to="/bermain"
        >
          Mulai Permainan
        </Link>
        <Link
          className="pixel-btn block w-full px-5 py-4 text-sm"
          to="/cara-bermain"
        >
          Cara Bermain
        </Link>
        <Link className="pixel-btn block w-full px-5 py-4 text-sm" to="/profil">
          Profil
        </Link>
        <button
          className="pixel-btn flex w-full items-center justify-center gap-3 px-5 py-4 text-sm"
          disabled
          type="button"
        >
          <span>Papan Peringkat</span>
          <span className="bg-zinc-950 px-2 py-1 text-[0.55rem] text-white">
            Segera
          </span>
        </button>
      </nav>
    </div>
  );
}
