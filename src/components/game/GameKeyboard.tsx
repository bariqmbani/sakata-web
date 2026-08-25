import type { ReactNode } from 'react';

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
] as const;

type GameKeyboardProps = {
  allowSkip: boolean;
  disabled: boolean;
  helper: string;
  onBackspace: () => void;
  onKeyPress: (letter: string) => void;
  onSkip: () => void;
  onSubmit: () => void;
};

export function GameKeyboard({
  allowSkip,
  disabled,
  helper,
  onBackspace,
  onKeyPress,
  onSkip,
  onSubmit
}: GameKeyboardProps) {
  return (
    <section className="rounded-t-card border border-border-strong bg-background-soft px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 shadow-warm-lg">
      <KeyboardRow>
        {KEY_ROWS[0].map((letter) => (
          <KeyboardKey
            disabled={disabled}
            key={letter}
            label={letter}
            onClick={() => onKeyPress(letter.toLowerCase())}
          />
        ))}
      </KeyboardRow>
      <KeyboardRow className="mt-2 px-3">
        {KEY_ROWS[1].map((letter) => (
          <KeyboardKey
            disabled={disabled}
            key={letter}
            label={letter}
            onClick={() => onKeyPress(letter.toLowerCase())}
          />
        ))}
      </KeyboardRow>
      <KeyboardRow className="mt-2">
        <KeyboardKey
          ariaLabel="Hapus satu huruf"
          disabled={disabled}
          label="Hapus"
          onClick={onBackspace}
          tone="danger"
          wide
        />
        {KEY_ROWS[2].map((letter) => (
          <KeyboardKey
            disabled={disabled}
            key={letter}
            label={letter}
            onClick={() => onKeyPress(letter.toLowerCase())}
          />
        ))}
        <KeyboardKey
          ariaLabel="Kirim jawaban"
          disabled={disabled}
          label="Kirim"
          onClick={onSubmit}
          tone="primary"
          wide
        />
      </KeyboardRow>
      <div className="mt-2 grid grid-cols-[4rem_1fr] gap-2">
        <KeyboardKey
          ariaLabel="Lewati kata ini"
          disabled={disabled || !allowSkip}
          label="Lewati"
          onClick={onSkip}
          tone="secondary"
          wide
        />
        <div className="flex min-h-11 items-center justify-center rounded-2xl border border-border bg-surface px-3 text-center text-caption font-semibold text-text-secondary">
          {helper}
        </div>
      </div>
    </section>
  );
}

type KeyboardRowProps = {
  children: ReactNode;
  className?: string;
};

function KeyboardRow({ children, className = '' }: KeyboardRowProps) {
  return (
    <div className={`flex justify-center gap-1 ${className}`}>{children}</div>
  );
}

type KeyboardKeyProps = {
  ariaLabel?: string;
  disabled: boolean;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'primary' | 'secondary' | 'danger';
  wide?: boolean;
};

function KeyboardKey({
  ariaLabel,
  disabled,
  label,
  onClick,
  tone = 'default',
  wide = false
}: KeyboardKeyProps) {
  const toneClass = {
    default: 'border-border bg-surface text-text-primary',
    // Dark ink on the brand orange reads 5.11:1; white on the same fill is only
    // 3.07:1, so the submit key keeps its colour instead of being darkened.
    primary:
      'border-primary-strong bg-primary text-text-primary hover:bg-primary-strong hover:text-text-inverse',
    secondary:
      'border-secondary-border-soft bg-secondary-soft text-secondary-strong',
    danger: 'border-primary-border-soft bg-primary-soft text-primary-strong'
  }[tone];

  return (
    <button
      aria-label={ariaLabel ?? `Tombol huruf ${label}`}
      className={`focus-ring flex h-11 shrink-0 items-center justify-center rounded-xl border text-center text-sm font-bold leading-5 shadow-warm-sm disabled:cursor-not-allowed disabled:opacity-60 ${
        wide ? 'w-16' : 'min-w-0 flex-1'
      } ${toneClass}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
