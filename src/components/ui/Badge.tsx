import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-[30px] items-center justify-center rounded-full border border-border bg-[#fff8e2] px-4 text-xs font-bold leading-[18px] text-text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
