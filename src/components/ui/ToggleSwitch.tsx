import type { ButtonHTMLAttributes } from 'react';

type ToggleSwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> & {
  checked: boolean;
  label: string;
};

export function ToggleSwitch({
  checked,
  label,
  className = '',
  ...props
}: ToggleSwitchProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={checked}
      className={`focus-ring relative h-11 w-16 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-secondary' : 'bg-disabled'
      } ${className}`}
      type="button"
      {...props}
    >
      <span
        className={`absolute left-2 top-2 h-7 w-7 rounded-full bg-surface shadow-warm-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
