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
    <section className="rounded-t-[24px] border border-[#ddba5e] bg-[#fff0bd] px-3 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-4 shadow-[0_8px_9px_rgba(139,94,0,0.18)]">
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
          disabled={disabled}
          label="Kirim"
          onClick={onSubmit}
          tone="primary"
          wide
        />
      </KeyboardRow>
      <div className="mt-2 grid grid-cols-[100px_1fr] gap-2">
        <KeyboardKey
          disabled={disabled || !allowSkip}
          label="Lewati"
          onClick={onSkip}
          tone="secondary"
          wide
        />
        <div className="flex min-h-11 items-center justify-center rounded-[14px] border border-border bg-surface px-3 text-center text-[13px] font-semibold leading-[18px] text-text-secondary">
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
  disabled: boolean;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'primary' | 'secondary' | 'danger';
  wide?: boolean;
};

function KeyboardKey({
  disabled,
  label,
  onClick,
  tone = 'default',
  wide = false
}: KeyboardKeyProps) {
  const toneClass = {
    default: 'border-[#ebcb78] bg-surface text-text-primary',
    primary: 'border-primary-pressed bg-primary text-text-inverse',
    secondary: 'border-[#91e6d8] bg-[#e8fffa] text-[#087f72]',
    danger: 'border-[#ffc1b4] bg-[#ffe2d9] text-primary-pressed'
  }[tone];

  return (
    <button
      aria-label={
        label.length === 1 ? `Tombol huruf ${label}` : `${label} jawaban`
      }
      className={`focus-ring flex h-[42px] shrink-0 items-center justify-center rounded-xl border text-center text-sm font-bold leading-[18px] shadow-[0_4px_5px_rgba(139,94,0,0.14)] disabled:cursor-not-allowed disabled:opacity-55 ${
        wide ? 'w-[58px] text-[13px]' : 'min-w-0 flex-1'
      } ${toneClass}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
