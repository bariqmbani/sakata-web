type GameStatusBarProps = {
  remaining: number;
  score: number;
  combo: number;
};

export function GameStatusBar({ remaining, score, combo }: GameStatusBarProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatusCard label="Waktu" tone="time" value={remaining} />
      <StatusCard label="Skor" tone="score" value={score} />
      <StatusCard label="Kombo" tone="combo" value={`${combo}x`} />
    </div>
  );
}

type StatusCardProps = {
  label: string;
  tone: 'time' | 'score' | 'combo';
  value: number | string;
};

function StatusCard({ label, tone, value }: StatusCardProps) {
  const toneClass = {
    time: 'text-primary',
    score: 'text-[#3a86ff]',
    combo: 'text-success'
  }[tone];

  return (
    <div className="min-h-16 rounded-[18px] border border-border bg-surface px-2 py-2 text-center shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
      <p className="text-[11px] font-bold leading-[14px] text-text-secondary">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-extrabold leading-7 ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
