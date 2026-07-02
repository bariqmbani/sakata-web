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
        <div className="mt-3 grid grid-cols-2 gap-3">
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
            <p className="mt-4 rounded-2xl border border-primary-border-soft bg-primary-soft p-4 text-sm font-bold leading-5 text-primary-pressed">
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
    <div className="flex min-h-28 items-center gap-4 rounded-card border border-border bg-surface px-5 py-5 shadow-warm-sm">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-page-title font-extrabold text-text-inverse">
        {name.trim().charAt(0).toUpperCase() || 'P'}
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-xl font-extrabold leading-6 text-text-primary">
          {name}
        </h2>
        <p className="mt-1 text-sm font-medium leading-5 text-text-secondary">
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
      className={`relative rounded-control border border-border bg-surface px-3 py-3 shadow-warm-sm ${
        large ? 'min-h-20' : 'min-h-20'
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 h-5 w-5 rounded-full bg-accent"
      />
      <p className="pr-6 text-2xl font-extrabold leading-7 text-text-primary">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold leading-4 text-text-secondary">
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
    <section className="mt-6 rounded-card border border-border bg-surface-raised p-5 shadow-warm-sm">
      <h2 className="text-base font-bold leading-5 text-text-primary">
        {isAnonymous ? 'Simpan Progres' : 'Akun Tersimpan'}
      </h2>
      <p className="mt-2 text-caption font-medium text-text-secondary">
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
                  className="focus-ring mt-2 min-h-12 w-full rounded-control border border-border-strong bg-surface px-4 py-3 text-sm font-bold text-text-primary shadow-warm-sm disabled:bg-disabled-soft"
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
        <p className="mt-4 rounded-2xl border border-primary-border-soft bg-primary-soft p-3 text-xs font-bold leading-5 text-primary-pressed">
          {errorMessage}
        </p>
      )}

      {isAnonymous && (
        <p className="mt-4 text-xs font-medium leading-5 text-text-secondary">
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
      <div className="mt-4 rounded-control border border-border bg-surface px-5 py-4 text-sm font-semibold leading-5 text-text-secondary">
        Belum ada riwayat permainan. Mainkan satu ronde untuk melihat progresmu.
      </div>
    );
  }

  return (
    <ol className="mt-4 space-y-3">
      {games.slice(0, 6).map((game) => (
        <li
          className="flex min-h-16 items-center gap-3 rounded-control border border-border bg-surface px-4 py-3 shadow-warm-sm"
          key={game.id}
        >
          <span className="h-6 w-6 shrink-0 rounded-full bg-secondary" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-5 text-text-primary">
              {game.score} kata • {formatAccuracy(game.accuracy)}%
            </p>
            <p className="mt-1 truncate text-xs font-medium leading-4 text-text-secondary">
              {formatGameDate(game.startedAtMs)} • {game.settings.duration}{' '}
              detik • performa {game.performance}
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
