type TimerBarProps = {
  duration: number;
  remaining: number;
};

export function TimerBar({ duration, remaining }: TimerBarProps) {
  const ratio =
    duration > 0 ? Math.max(0, Math.min(1, remaining / duration)) : 0;
  const isLow = remaining <= Math.max(5, Math.ceil(duration * 0.2));

  return (
    <div
      aria-label={`Sisa waktu ${remaining} detik`}
      className="h-2.5 overflow-hidden rounded-full bg-background-soft"
      role="progressbar"
      aria-valuemax={duration}
      aria-valuemin={0}
      aria-valuenow={remaining}
    >
      <div
        className={`h-full rounded-full ${
          isLow ? 'animate-low-time bg-error' : 'bg-primary'
        }`}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
