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
    'focus-ring flex min-h-[58px] w-full items-center justify-center rounded-[18px] border border-primary-pressed bg-primary px-5 text-center text-base font-bold leading-5 text-text-inverse shadow-[0_4px_5px_rgba(139,94,0,0.14)] transition-colors hover:bg-primary-pressed';
  const secondaryLinkClass =
    'focus-ring flex min-h-[54px] w-full items-center justify-center rounded-[18px] border border-[#ddba5e] bg-surface px-5 text-center text-base font-bold leading-5 text-text-primary shadow-[0_4px_5px_rgba(139,94,0,0.14)] transition-colors hover:bg-surface-raised';

  useEffect(() => {
    logHomeView();
  }, []);

  return (
    <div className="flex flex-1 flex-col px-9 pb-10 pt-[104px] text-center">
      <header className="select-none">
        <div aria-label="Sa-Kata" className="mx-auto h-[97px] w-[231px]">
          <div className="relative h-full">
            <LogoTile className="left-0 top-0 bg-primary" label="Sa" />
            <LogoTile className="left-[55px] top-3.5 bg-accent" label="Ka" />
            <LogoTile className="left-[109px] top-0 bg-secondary" label="Ta" />
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[302px] text-lg font-semibold leading-[25px] text-text-primary">
          Main cepat, pikir cepat, sambung kata!
        </p>
        <p className="mx-auto mt-2 max-w-[282px] text-sm font-medium leading-5 text-text-secondary">
          Game sambung kata berbasis suku kata Indonesia.
        </p>
      </header>

      <nav className="mt-9 flex w-full flex-col gap-3">
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
          className="flex min-h-[54px] w-full cursor-not-allowed items-center justify-center gap-3 rounded-[18px] border border-disabled bg-[#efe8d8] px-5 text-center text-base font-bold leading-5 text-text-secondary"
          disabled
          type="button"
        >
          <span>Papan Peringkat</span>
          <Badge className="min-h-[30px] px-4">Segera</Badge>
        </button>
      </nav>

      <div className="mt-auto pt-11">
        <div className="mx-auto flex min-h-[94px] max-w-[290px] items-center justify-center gap-3 rounded-[26px] border border-border bg-surface-raised px-7 shadow-[0_4px_10px_rgba(139,94,0,0.14)]">
          <ChainChip className="bg-primary text-text-inverse" label="ma" />
          <ChainChip className="bg-accent text-text-primary" label="kan" />
          <span className="text-lg font-bold text-text-secondary">→</span>
          <ChainChip
            className="bg-secondary text-text-inverse"
            label="kan..."
          />
        </div>
      </div>
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
      className={`absolute flex h-[61px] w-[63px] items-center justify-center rounded-[19px] border-2 border-white text-2xl font-extrabold leading-[29px] text-white shadow-[0_8px_9px_rgba(139,94,0,0.18)] ${className}`}
    >
      {label}
    </span>
  );
}

type ChainChipProps = {
  className: string;
  label: string;
};

function ChainChip({ className, label }: ChainChipProps) {
  return (
    <span
      className={`inline-flex min-h-[34px] min-w-[54px] items-center justify-center rounded-full border border-border px-4 text-sm font-bold leading-[18px] ${className}`}
    >
      {label}
    </span>
  );
}
