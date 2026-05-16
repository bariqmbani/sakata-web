import { Link } from 'react-router';
import { X } from 'lucide-react';

import {
  countAnswersAccuracy,
  countCorrectAnswers,
  getPerformance
} from '@/services/report.service';
import type { GameDraft } from '@/types/game.types';

type GameOverModalProps = {
  game: GameDraft;
};

export function GameOverModal({ game }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center bg-black/45 px-4 py-20">
      <div className="panel w-full max-w-md bg-white">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">Waktu Habis</h2>
          <Link
            aria-label="Tutup"
            className="focus-ring inline-flex h-8 w-8 items-center justify-center"
            to="/bermain"
          >
            <X size={22} />
          </Link>
        </div>
        <div className="mt-6 space-y-4 text-sm leading-7">
          <p>
            Anda menunjukkan performa permainan yang{' '}
            <strong className="text-[#8f8f17]">{getPerformance(game)}</strong>.
          </p>
          <p>
            Dalam waktu{' '}
            <strong className="text-[#8f8f17]">
              {game.settings.duration} detik
            </strong>
            , Anda berhasil menyambungkan{' '}
            <strong className="text-[#8f8f17]">
              {countCorrectAnswers(game.answers)} kata
            </strong>{' '}
            dengan{' '}
            <strong className="text-[#8f8f17]">
              akurasi {countAnswersAccuracy(game.answers)}%
            </strong>
            .
          </p>
        </div>
        <Link
          className="focus-ring pixel-box mt-6 inline-flex min-h-12 w-full items-center justify-center bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
          to="/bermain"
        >
          Main Lagi
        </Link>
      </div>
    </div>
  );
}
