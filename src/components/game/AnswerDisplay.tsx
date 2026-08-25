type AnswerDisplayProps = {
  answer: string;
  disabled: boolean;
  helper: string;
  isInvalid: boolean;
  onClear: () => void;
};

export function AnswerDisplay({
  answer,
  disabled,
  helper,
  isInvalid,
  onClear
}: AnswerDisplayProps) {
  return (
    <div
      className={`rounded-control border border-border-strong bg-surface px-4 py-3 shadow-warm-sm ${
        isInvalid ? 'animate-shake' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          {/* The custom keyboard replaces a native input, so nothing echoes the
              typed answer to a screen reader unless we announce it ourselves. */}
          <p
            aria-hidden="true"
            className="truncate text-2xl font-extrabold leading-7 text-text-primary"
          >
            {answer}
          </p>
          <p className="mt-1 text-xs font-medium leading-4 text-text-secondary">
            {helper}
          </p>
          <p
            aria-atomic="true"
            aria-live="polite"
            className="sr-only"
            role="status"
          >
            {answer ? `Jawaban: ${answer}` : 'Jawaban kosong'}
          </p>
        </div>
        <button
          aria-label="Kosongkan jawaban"
          className="focus-ring min-h-11 rounded-control border border-primary-border-soft bg-primary-soft px-4 text-base font-bold leading-5 text-primary-strong shadow-warm-sm"
          disabled={disabled}
          onClick={onClear}
          type="button"
        >
          Kosong
        </button>
      </div>
    </div>
  );
}
