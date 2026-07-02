type AnswerDisplayProps = {
  answer: string;
  helper: string;
  isInvalid: boolean;
  onClear: () => void;
};

export function AnswerDisplay({
  answer,
  helper,
  isInvalid,
  onClear
}: AnswerDisplayProps) {
  return (
    <div
      className={`rounded-[18px] border border-[#ddba5e] bg-surface px-4 py-3 shadow-[0_4px_5px_rgba(139,94,0,0.14)] ${
        isInvalid ? 'animate-shake' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[22px] font-extrabold leading-7 text-text-primary">
            {answer}
          </p>
          <p className="mt-0.5 text-[11px] font-medium leading-[14px] text-text-secondary">
            {helper}
          </p>
        </div>
        <button
          aria-label="Kosongkan jawaban"
          className="focus-ring min-h-[38px] rounded-[18px] border border-[#ffc1b4] bg-[#ffe2d9] px-3 text-base font-bold leading-5 text-primary-pressed shadow-[0_4px_5px_rgba(139,94,0,0.14)]"
          onClick={onClear}
          type="button"
        >
          Kosong
        </button>
      </div>
    </div>
  );
}
