import { useEffect } from 'react';
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
      <section className="flex-1 overflow-auto px-7 pb-8 pt-9">
        <h1 className="text-[25px] font-extrabold leading-[31px] text-text-primary">
          Sambung kata dari suku kata terakhir
        </h1>

        <div className="mt-4 rounded-[24px] border border-border bg-surface-raised p-5 text-center shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
          <p className="text-sm font-bold leading-[18px] text-text-secondary">
            Contoh rantai
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold leading-[18px]">
            <div className="retro-tooltip group">
              <a
                className="inline-flex min-h-[34px] items-center rounded-full border border-border bg-[#fff1c2] px-4 text-text-primary underline decoration-dotted"
                href="https://kbbi.kemdikbud.go.id/entri/sifat"
                rel="noreferrer"
                target="_blank"
              >
                sifat
              </a>
              <span className="tooltip-text">si.fat</span>
            </div>
            <span className="text-sm text-text-secondary">→</span>
            <div className="retro-tooltip group">
              <a
                className="inline-flex min-h-[34px] items-center rounded-full border border-border bg-[#fff1c2] px-4 text-text-primary underline decoration-dotted"
                href="https://kbbi.kemdikbud.go.id/entri/fatwa"
                rel="noreferrer"
                target="_blank"
              >
                fatwa
              </a>
              <span className="tooltip-text z-10">fat.wa</span>
            </div>
            <span className="text-sm text-text-secondary">→</span>
            <div className="retro-tooltip group">
              <a
                className="inline-flex min-h-[34px] items-center rounded-full border border-border bg-[#fff1c2] px-4 text-text-primary underline decoration-dotted"
                href="https://kbbi.kemdikbud.go.id/entri/wanita"
                rel="noreferrer"
                target="_blank"
              >
                wanita
              </a>
              <span className="tooltip-text z-10">wa.ni.ta</span>
            </div>
            <span className="text-sm text-text-secondary">→</span>
            <div className="retro-tooltip group">
              <span
                className="inline-flex min-h-[34px] cursor-help items-center rounded-full border border-[#ddba5e] bg-accent px-4 text-text-primary underline decoration-dotted"
                tabIndex={0}
              >
                ta...
              </span>
              <span className="tooltip-text z-10 w-max !ml-[-30px]">
                ta.hu
                <br />
                ta.kut
                <br />
                tam.bang
              </span>
            </div>
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
    <li className="flex min-h-[52px] items-center gap-3 rounded-[18px] border border-border bg-surface px-3 py-3 shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-text-inverse">
        {number}
      </span>
      <span className="text-sm font-semibold leading-[18px] text-text-primary">
        {text}
      </span>
    </li>
  );
}
