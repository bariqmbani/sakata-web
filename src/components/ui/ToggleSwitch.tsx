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
      className={`focus-ring relative h-8 w-[54px] rounded-full transition-colors ${
        checked ? 'bg-secondary' : 'bg-disabled'
      } ${className}`}
      type="button"
      {...props}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-surface shadow-[0_2px_4px_rgba(36,34,43,0.18)] transition-transform ${
          checked ? 'translate-x-[26px]' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
