type GameStatusBarProps = {
  remaining: number;
  score: number;
  combo: number;
};

export function GameStatusBar({ remaining, score, combo }: GameStatusBarProps) {
  // Announcing every tick would drown out the answer field, so the countdown is
  // only spoken at the moments that change how the player should act.
  const spokenTime = [30, 10, 5, 3].includes(remaining)
    ? `Sisa ${remaining} detik`
    : '';

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatusCard label="Waktu" tone="time" value={remaining} />
      <StatusCard label="Skor" tone="score" value={score} />
      <StatusCard label="Kombo" tone="combo" value={`${combo}x`} />
      <p aria-live="polite" className="sr-only" role="status">
        {spokenTime}
      </p>
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
    score: 'text-focus',
    combo: 'text-success'
  }[tone];

  return (
    <div className="min-h-16 rounded-control border border-border bg-surface px-2 py-2 text-center shadow-warm-sm">
      <p className="text-xs font-bold leading-4 text-text-secondary">{label}</p>
      <p className={`mt-1 text-status-value font-extrabold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
