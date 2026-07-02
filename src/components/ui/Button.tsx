import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'soft' | 'danger';
};

const variants = {
  primary:
    'border-primary-pressed bg-primary text-text-inverse shadow-[0_4px_5px_rgba(139,94,0,0.14)] hover:bg-primary-pressed active:bg-primary-pressed',
  secondary:
    'border-[#ddba5e] bg-surface text-text-primary shadow-[0_4px_5px_rgba(139,94,0,0.14)] hover:bg-surface-raised active:bg-background-soft',
  soft: 'border-border bg-[#fff2c7] text-text-primary shadow-[0_4px_5px_rgba(139,94,0,0.14)] hover:bg-background-soft active:bg-background-soft',
  danger:
    'border-[#ffc1b4] bg-[#ffe2d9] text-primary-pressed shadow-[0_4px_5px_rgba(139,94,0,0.14)] hover:bg-[#ffd6c9] active:bg-[#ffd6c9]'
};

export function Button({
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border px-5 py-3 text-center text-base font-bold leading-5 transition-colors disabled:cursor-not-allowed disabled:border-disabled disabled:bg-[#efe8d8] disabled:text-text-secondary disabled:shadow-none ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
