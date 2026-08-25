import { useEffect } from 'react';
import { Link } from 'react-router';
import type { User } from 'firebase/auth';

import { Badge } from '@/components/ui/Badge';
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
  const primaryLinkClass =
    'focus-ring flex min-h-14 w-full items-center justify-center rounded-control border border-primary-pressed bg-primary px-5 text-center text-base font-bold leading-5 text-text-inverse shadow-warm-sm transition-colors hover:bg-primary-pressed';
  const secondaryLinkClass =
    'focus-ring flex min-h-14 w-full items-center justify-center rounded-control border border-border-strong bg-surface px-5 text-center text-base font-bold leading-5 text-text-primary shadow-warm-sm transition-colors hover:bg-surface-raised';

  useEffect(() => {
    logHomeView();
  }, []);

  return (
    <div className="flex flex-1 flex-col px-7 pb-10 pt-24 text-center">
      <header className="select-none">
        <div aria-label="Sa-Kata" className="mx-auto h-[97px] w-[231px]">
          <div className="relative h-full">
            <LogoTile className="left-0 top-0 bg-primary" label="Sa" />
            <LogoTile className="left-[55px] top-3.5 bg-accent" label="Ka" />
            <LogoTile className="left-[109px] top-0 bg-secondary" label="Ta" />
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[302px] text-lg font-semibold leading-6 text-text-primary">
          Main cepat, pikir cepat, sambung kata!
        </p>
        <p className="mx-auto mt-2 max-w-[282px] text-sm font-medium leading-5 text-text-secondary">
          Game sambung kata pakai suku kata Indonesia.
        </p>
      </header>

      <nav className="mt-8 flex w-full flex-col gap-3">
        {activeGame && (
          <Link className={primaryLinkClass} to={`/bermain/${activeGame.id}`}>
            Lanjutkan Permainan
          </Link>
        )}
        <Link className={primaryLinkClass} to="/bermain">
          Mulai Permainan
        </Link>
        <Link className={secondaryLinkClass} to="/cara-bermain">
          Cara Bermain
        </Link>
        <Link className={secondaryLinkClass} to="/profil">
          Profil
        </Link>
        <button
          className="flex min-h-14 w-full cursor-not-allowed items-center justify-center gap-3 rounded-control border border-disabled bg-disabled-soft px-5 text-center text-base font-bold leading-5 text-text-secondary"
          disabled
          type="button"
        >
          <span>Papan Peringkat</span>
          <Badge>Segera</Badge>
        </button>
      </nav>

    </div>
  );
}

type LogoTileProps = {
  className: string;
  label: string;
};

function LogoTile({ className, label }: LogoTileProps) {
  return (
    <span
      className={`absolute flex h-[61px] w-[63px] items-center justify-center rounded-control border-2 border-white text-2xl font-extrabold leading-7 text-white shadow-warm-lg ${className}`}
    >
      {label}
    </span>
  );
}
