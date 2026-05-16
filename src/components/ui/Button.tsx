import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

const variants = {
  primary: 'bg-zinc-950 text-white hover:bg-zinc-800',
  secondary: 'bg-white text-zinc-950 hover:bg-zinc-100',
  danger: 'bg-[#e76e54] text-white hover:bg-[#cf553d]'
};

export function Button({
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`focus-ring pixel-box inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
