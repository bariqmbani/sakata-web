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
      className={`focus-ring inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-border bg-surface text-text-primary shadow-[0_4px_5px_rgba(139,94,0,0.14)] transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:border-disabled disabled:bg-[#efe8d8] disabled:text-text-secondary disabled:shadow-none ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
