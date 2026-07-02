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
    <div className="fixed inset-0 z-20 flex items-start justify-center bg-text-primary/45 px-5 py-20">
      <div className="w-full max-w-[390px] rounded-[28px] border border-border bg-surface p-6 shadow-[0_18px_38px_rgba(36,34,43,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[28px] font-extrabold leading-[34px] text-text-primary">
            Waktu Habis
          </h2>
          <Link
            aria-label="Tutup"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ffc1b4] bg-[#ffe2d9] text-primary-pressed"
            to="/bermain"
          >
            <X size={22} />
          </Link>
        </div>
        <div className="mt-6 space-y-4 text-[15px] leading-[22px] text-text-secondary">
          <p>
            Performa permainanmu{' '}
            <strong className="text-primary">{getPerformance(game)}</strong>.
          </p>
          <p>
            Dalam waktu{' '}
            <strong className="text-text-primary">
              {game.settings.duration} detik
            </strong>
            , kamu berhasil menyambungkan{' '}
            <strong className="text-text-primary">
              {countCorrectAnswers(game.answers)} kata
            </strong>{' '}
            dengan{' '}
            <strong className="text-text-primary">
              akurasi {countAnswersAccuracy(game.answers)}%
            </strong>
            .
          </p>
        </div>
        <Link
          className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[18px] border border-primary-pressed bg-primary px-5 py-3 text-base font-bold leading-5 text-text-inverse shadow-[0_4px_5px_rgba(139,94,0,0.14)] transition-colors hover:bg-primary-pressed"
          to="/bermain"
        >
          Main Lagi
        </Link>
      </div>
    </div>
  );
}
