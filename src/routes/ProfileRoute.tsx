import { useEffect, useState, type FormEvent } from 'react';
import { LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';

import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePlayerData } from '@/hooks/usePlayerData';
import {
  ensureAnonymousUser,
  getAuthErrorMessage,
  isExistingCredentialError,
  linkCurrentUserWithGoogle,
  logout,
  signInWithGoogle,
  updateCurrentUserDisplayName
} from '@/services/auth.service';
import { copySoloGamesToUser, refreshUserStats } from '@/services/game.service';
import { getPlayerStats } from '@/services/player-stats.service';
import type { GameDraft } from '@/types/game.types';

type ProfileRouteProps = {
  user: User | null;
};

export function ProfileRoute({ user }: ProfileRouteProps) {
  const playerData = usePlayerData(user);
  const stats = getPlayerStats(playerData.games);
  const finishedGames = playerData.games.filter(
    (game) => game.finishedAtMs !== null
  );
  const [displayName, setDisplayName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const providerIds =
    user?.providerData.map((provider) => provider.providerId) ?? [];
  const hasGoogleProvider = providerIds.includes('google.com');
  const playerName =
    playerData.profile?.displayName ?? user?.displayName ?? 'Pemain Tamu';

  useEffect(() => {
    setDisplayName(playerName);
  }, [playerName]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="Profil" />
      <section className="min-h-0 flex-1 overflow-y-auto px-7 pb-8 pt-8">
        <PlayerCard isAnonymous={user?.isAnonymous ?? true} name={playerName} />

        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatCard label="Total Main" value={stats.gamesPlayed} />
          <StatCard label="Kata Benar" value={stats.totalCorrectWords} />
          <StatCard label="Kombo" value={stats.bestStreak} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <StatCard label="Akurasi" large value={`${stats.averageAccuracy}%`} />
          <StatCard label="Skor Terbaik" large value={stats.bestStreak} />
        </div>

        <AccountControls
          displayName={displayName}
          errorMessage={errorMessage}
          hasGoogleProvider={hasGoogleProvider}
          onDisplayNameChange={setDisplayName}
          onGoogleAction={() => void onGoogleAction()}
          onLogout={() => void onLogout()}
          onSaveDisplayName={(event) => void onSaveDisplayName(event)}
          pendingAction={pendingAction}
          statusMessage={statusMessage}
          user={user}
        />

        <section className="mt-8">
          <h2 className="text-lg font-extrabold leading-6 text-text-primary">
            Riwayat Permainan
          </h2>
          {playerData.error && (
            <p className="mt-4 rounded-[16px] border border-[#ffc1b4] bg-[#ffe2d9] p-4 text-sm font-bold leading-5 text-primary-pressed">
              {playerData.error}
            </p>
          )}
          {!playerData.error && playerData.isLoading && (
            <p className="mt-4 text-sm font-medium leading-6 text-text-secondary">
              Memuat riwayat...
            </p>
          )}
          {!playerData.error && !playerData.isLoading && (
            <GameHistory games={finishedGames} />
          )}
        </section>
      </section>
    </div>
  );

  async function onGoogleAction() {
    if (!user || pendingAction) {
      return;
    }

    const guestGames = user.isAnonymous ? playerData.games : [];
    setPendingAction('google');
    setStatusMessage('');
    setErrorMessage('');

    try {
      if (user.isAnonymous || !hasGoogleProvider) {
        const linkedUser = await linkCurrentUserWithGoogle();
        await refreshUserStats(linkedUser.uid);
        setStatusMessage('Akun Google terhubung.');
        return;
      }

      setStatusMessage('Akun Google sudah terhubung.');
    } catch (error) {
      if (user.isAnonymous && isExistingCredentialError(error)) {
        try {
          const signedInUser = await signInWithGoogle();
          await copySoloGamesToUser(guestGames, signedInUser.uid);
          setStatusMessage('Progres tamu digabungkan ke akun Google.');
          return;
        } catch (signInError) {
          setErrorMessage(getAuthErrorMessage(signInError));
          return;
        }
      }

      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setPendingAction(null);
    }
  }

  async function onSaveDisplayName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || pendingAction) {
      return;
    }

    setPendingAction('name');
    setStatusMessage('');
    setErrorMessage('');

    try {
      await updateCurrentUserDisplayName(displayName);
      setStatusMessage('Nama pemain diperbarui.');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setPendingAction(null);
    }
  }

  async function onLogout() {
    if (pendingAction) {
      return;
    }

    setPendingAction('logout');
    setStatusMessage('');
    setErrorMessage('');

    try {
      await logout();
      await ensureAnonymousUser();
      setStatusMessage('Keluar dari akun tersimpan.');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setPendingAction(null);
    }
  }
}

type PlayerCardProps = {
  isAnonymous: boolean;
  name: string;
};

function PlayerCard({ isAnonymous, name }: PlayerCardProps) {
  return (
    <div className="flex min-h-[104px] items-center gap-4 rounded-[24px] border border-border bg-surface px-5 py-5 shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
      <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-primary text-[28px] font-extrabold leading-[34px] text-text-inverse">
        {name.trim().charAt(0).toUpperCase() || 'P'}
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-extrabold leading-6 text-text-primary">
          {name}
        </h1>
        <p className="mt-1 text-sm font-medium leading-[18px] text-text-secondary">
          {isAnonymous ? 'Mode tamu' : 'Akun tersimpan'}
        </p>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  large?: boolean;
  value: number | string;
};

function StatCard({ label, large = false, value }: StatCardProps) {
  return (
    <div
      className={`relative rounded-[18px] border border-border bg-surface px-3 py-3 shadow-[0_4px_5px_rgba(139,94,0,0.14)] ${
        large ? 'min-h-[74px]' : 'min-h-[74px]'
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 h-[18px] w-[18px] rounded-full bg-accent"
      />
      <p className="pr-5 text-2xl font-extrabold leading-[26px] text-text-primary">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-bold leading-[14px] text-text-secondary">
        {label}
      </p>
    </div>
  );
}

type AccountControlsProps = {
  displayName: string;
  errorMessage: string;
  hasGoogleProvider: boolean;
  onDisplayNameChange: (value: string) => void;
  onGoogleAction: () => void;
  onLogout: () => void;
  onSaveDisplayName: (event: FormEvent<HTMLFormElement>) => void;
  pendingAction: string | null;
  statusMessage: string;
  user: User | null;
};

function AccountControls({
  displayName,
  errorMessage,
  hasGoogleProvider,
  onDisplayNameChange,
  onGoogleAction,
  onLogout,
  onSaveDisplayName,
  pendingAction,
  statusMessage,
  user
}: AccountControlsProps) {
  const isAnonymous = user?.isAnonymous ?? true;

  return (
    <section className="mt-6 rounded-[24px] border border-border bg-surface-raised p-5 shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
      <h2 className="text-[17px] font-bold leading-[22px] text-text-primary">
        {isAnonymous ? 'Simpan Progres' : 'Akun Tersimpan'}
      </h2>
      <p className="mt-2 text-[13px] font-medium leading-[18px] text-text-secondary">
        {isAnonymous
          ? 'Hubungkan Google agar riwayat permainan tidak hilang.'
          : 'Progres tersimpan di akun Google ini.'}
      </p>

      <div className="mt-4 space-y-3">
        <Button
          className="w-full text-sm"
          disabled={
            pendingAction !== null || (!isAnonymous && hasGoogleProvider)
          }
          onClick={onGoogleAction}
        >
          {pendingAction === 'google'
            ? 'Menghubungkan...'
            : hasGoogleProvider
              ? 'Google Terhubung'
              : 'Hubungkan Google'}
        </Button>

        {!isAnonymous && (
          <>
            <form className="space-y-3" onSubmit={onSaveDisplayName}>
              <label className="block">
                <span className="text-xs font-bold leading-5 text-text-secondary">
                  Nama Tampilan
                </span>
                <input
                  autoComplete="nickname"
                  className="focus-ring mt-2 w-full rounded-[18px] border border-[#ddba5e] bg-surface px-4 py-3 text-sm font-bold text-text-primary shadow-[0_4px_5px_rgba(139,94,0,0.14)] disabled:bg-[#efe8d8]"
                  disabled={pendingAction !== null}
                  onChange={(event) => onDisplayNameChange(event.target.value)}
                  type="text"
                  value={displayName}
                />
              </label>
              <Button
                className="w-full text-sm"
                disabled={pendingAction !== null}
                type="submit"
              >
                {pendingAction === 'name' ? 'Menyimpan...' : 'Simpan Nama'}
              </Button>
            </form>
            <Button
              className="w-full text-sm"
              disabled={pendingAction !== null}
              onClick={onLogout}
              variant="danger"
            >
              <LogOut size={18} />
              {pendingAction === 'logout' ? 'Keluar...' : 'Keluar'}
            </Button>
          </>
        )}
      </div>

      {statusMessage && (
        <p className="mt-4 text-xs font-bold leading-5 text-success">
          {statusMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-4 rounded-[16px] border border-[#ffc1b4] bg-[#ffe2d9] p-3 text-xs font-bold leading-5 text-primary-pressed">
          {errorMessage}
        </p>
      )}

      {isAnonymous && (
        <p className="mt-4 text-[11px] font-medium leading-5 text-text-secondary">
          Jika akun Google sudah ada, progres tamu akan digabungkan setelah
          masuk.
        </p>
      )}
    </section>
  );
}

type GameHistoryProps = {
  games: GameDraft[];
};

function GameHistory({ games }: GameHistoryProps) {
  if (games.length === 0) {
    return (
      <div className="mt-4 rounded-[18px] border border-border bg-surface px-5 py-4 text-sm font-semibold leading-5 text-text-secondary">
        Belum ada riwayat permainan. Mainkan satu ronde untuk melihat progresmu.
      </div>
    );
  }

  return (
    <ol className="mt-4 space-y-3">
      {games.slice(0, 6).map((game) => (
        <li
          className="flex min-h-[58px] items-center gap-3 rounded-[18px] border border-border bg-surface px-4 py-3 shadow-[0_4px_5px_rgba(139,94,0,0.14)]"
          key={game.id}
        >
          <span className="h-[22px] w-[22px] shrink-0 rounded-full bg-secondary" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-[18px] text-text-primary">
              {game.score} kata • {formatAccuracy(game.accuracy)}%
            </p>
            <p className="mt-0.5 truncate text-xs font-medium leading-[14px] text-text-secondary">
              {formatGameDate(game.startedAtMs)} • {game.settings.duration}{' '}
              detik • {game.performance}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function formatAccuracy(accuracy: number): string {
  return Number.isInteger(accuracy) ? String(accuracy) : accuracy.toFixed(1);
}

function formatGameDate(timestampMs: number): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestampMs));
}
