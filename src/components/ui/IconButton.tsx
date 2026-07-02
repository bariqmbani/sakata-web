import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  label,
  children,
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`focus-ring inline-flex h-12 w-12 items-center justify-center rounded-control border border-border bg-surface text-text-primary shadow-warm-sm transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled-soft disabled:text-text-secondary disabled:shadow-none ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
