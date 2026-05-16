import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

const variants = {
  primary: '', /* Default pixel-btn already looks like this */
  secondary: '', /* Secondary can just be default too */
  danger: '!bg-[#e76e54] !text-white' /* Override bg/text for danger */
};

export function Button({
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`focus-ring pixel-btn inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-bold transition-none ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
