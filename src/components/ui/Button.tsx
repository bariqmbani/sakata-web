import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'soft' | 'danger';
};

const variants = {
  primary:
    'border-primary-pressed bg-primary text-text-inverse shadow-warm-sm hover:bg-primary-pressed active:bg-primary-pressed',
  secondary:
    'border-border-strong bg-surface text-text-primary shadow-warm-sm hover:bg-surface-raised active:bg-background-soft',
  soft: 'border-border bg-surface-soft text-text-primary shadow-warm-sm hover:bg-background-soft active:bg-background-soft',
  danger:
    'border-primary-border-soft bg-primary-soft text-primary-pressed shadow-warm-sm hover:bg-primary-soft-hover active:bg-primary-soft-hover'
};

export function Button({
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-control border px-5 py-3 text-center text-base font-bold leading-5 transition-colors disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled-soft disabled:text-text-secondary disabled:shadow-none ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
