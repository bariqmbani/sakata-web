import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { logHowToPlayView } from '@/services/analytics.service';

export function HowToPlayRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    logHowToPlayView();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Cara Bermain" />
      <section className="flex-1 overflow-auto px-7 pb-8 pt-8">
        <h2 className="text-page-title font-extrabold text-text-primary">
          Sambung kata dari suku kata terakhir
        </h2>

        <div className="mt-4 rounded-card border border-border bg-surface-raised p-5 text-center shadow-warm-sm">
          <p className="text-sm font-bold leading-5 text-text-secondary">
            Contoh rantai
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold leading-5">
            <TooltipChip label="fatwa" tooltip="fat.wa" />
            <span className="text-sm text-text-secondary">→</span>
            <TooltipChip label="wanita" tooltip="wa.ni.ta" />
            <span className="text-sm text-text-secondary">→</span>
            <TooltipChip
              active
              label="ta..."
              tooltip={'ta.hu\nta.kut\ntam.bang'}
            />
          </div>
        </div>

        <ol className="mt-8 space-y-3">
          <RuleCard
            number={1}
            text="Kata pertama akan ditentukan secara acak."
          />
          <RuleCard
            number={2}
            text="Jawaban harus dimulai dari suku kata terakhir."
          />
          <RuleCard
            number={3}
            text="Kata harus valid dan ada di daftar kata."
          />
          <RuleCard
            number={4}
            text="Kata yang sama tidak boleh dipakai dua kali."
          />
          <RuleCard number={5} text="Kejar skor sebelum waktu habis." />
        </ol>

        <Button
          className="mt-10 w-full"
          onClick={() => void navigate('/bermain')}
        >
          Mulai Bermain
        </Button>
      </section>
    </div>
  );
}

type RuleCardProps = {
  number: number;
  text: string;
};

function RuleCard({ number, text }: RuleCardProps) {
  return (
    <li className="flex min-h-14 items-center gap-3 rounded-control border border-border bg-surface px-3 py-3 shadow-warm-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-text-inverse">
        {number}
      </span>
      <span className="text-sm font-semibold leading-5 text-text-primary">
        {text}
      </span>
    </li>
  );
}

type TooltipChipProps = {
  active?: boolean;
  label: string;
  tooltip: ReactNode;
};

function TooltipChip({ active = false, label, tooltip }: TooltipChipProps) {
  return (
    <span className="group relative inline-flex">
      <span
        className={`focus-ring inline-flex min-h-11 cursor-help items-center rounded-full border px-4 text-text-primary underline decoration-dotted ${
          active
            ? 'border-border-strong bg-accent'
            : 'border-border bg-surface-chip'
        }`}
        tabIndex={0}
      >
        {label}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max -translate-x-1/2 whitespace-pre-line rounded-2xl border border-border bg-surface px-3 py-2 text-xs font-bold leading-4 text-text-secondary shadow-warm-sm group-hover:block group-focus-within:block">
        {tooltip}
      </span>
    </span>
  );
}
