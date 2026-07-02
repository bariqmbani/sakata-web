import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-8 items-center justify-center rounded-full border border-border bg-surface-badge px-4 text-xs font-bold leading-5 text-text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
