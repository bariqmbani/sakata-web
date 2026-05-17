import { ArrowLeft, Trophy, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import type { User } from 'firebase/auth';

import { getPlayerStats, usePlayerData } from '@/hooks/usePlayerData';
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

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex min-h-16 items-center gap-3 text-xl font-bold">
        <Link
          aria-label="Kembali"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center"
          to="/"
        >
          <ArrowLeft size={28} />
        </Link>
        <span>Profil</span>
      </header>

      <section className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.35fr]">
        <div className="panel bg-white p-4">
          <div className="flex items-center gap-3">
            <UserRound size={24} />
            <h1 className="text-sm font-bold">Kartu Pemain</h1>
          </div>
          {playerData.isLoading ? (
            <p className="mt-5 text-xs leading-6 text-zinc-700">
              Memuat data...
            </p>
          ) : (
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs leading-6 text-zinc-600">Nama</p>
                <p className="mt-1 text-sm font-bold">
                  {playerData.profile?.displayName ??
                    user?.displayName ??
                    'Pemain Tamu'}
                </p>
                <p className="mt-2 text-[0.65rem] text-[#8f8f17]">
                  {user?.isAnonymous ? 'Tamu' : 'Tersimpan'}
                </p>
              </div>
              <dl className="space-y-3 text-xs leading-6">
                <StatRow label="Total Main" value={stats.gamesPlayed} />
                <StatRow label="Total Kata" value={stats.totalCorrectWords} />
                <StatRow label="Rekor Kata" value={stats.bestStreak} />
                <StatRow
                  label="Rata-rata Akurasi"
                  value={`${stats.averageAccuracy}%`}
                />
              </dl>
            </div>
          )}
        </div>

        <div className="panel bg-white p-4">
          <div className="flex items-center gap-3">
            <Trophy size={24} />
            <h2 className="text-sm font-bold">Riwayat Permainan</h2>
          </div>
          {playerData.error && (
            <p className="mt-5 text-xs leading-6 text-[#9a3412]">
              {playerData.error}
            </p>
          )}
          {!playerData.error && playerData.isLoading && (
            <p className="mt-5 text-xs leading-6 text-zinc-700">
              Memuat riwayat...
            </p>
          )}
          {!playerData.error && !playerData.isLoading && (
            <GameHistory games={finishedGames} />
          )}
        </div>
      </section>
    </div>
  );
}

type StatRowProps = {
  label: string;
  value: number | string;
};

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b-[3px] border-zinc-950 pb-3">
      <dt>{label}</dt>
      <dd className="font-bold text-[#8f8f17]">{value}</dd>
    </div>
  );
}

type GameHistoryProps = {
  games: GameDraft[];
};

function GameHistory({ games }: GameHistoryProps) {
  if (games.length === 0) {
    return (
      <p className="mt-5 text-xs leading-6 text-zinc-700">
        Belum ada riwayat. Selesaikan permainan untuk mengisi daftar ini.
      </p>
    );
  }

  return (
    <ol className="mt-5 max-h-[28rem] space-y-3 overflow-auto pr-1">
      {games.map((game) => (
        <li
          className="border-[3px] border-zinc-950 bg-[#dee4e7] p-3"
          key={game.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold">
                {formatGameDate(game.startedAtMs)}
              </p>
              <p className="mt-2 text-[0.6rem] leading-5 text-zinc-600">
                {game.settings.duration} detik
              </p>
            </div>
            <p className="text-right text-xs leading-5">
              {game.score} kata
              <span className="block text-[0.6rem] text-zinc-600">
                {game.accuracy}% akurasi
              </span>
            </p>
          </div>
          <p className="mt-3 text-[0.6rem] leading-5 text-[#8f8f17]">
            Performa: {game.performance}
          </p>
        </li>
      ))}
    </ol>
  );
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
