import type { InputHTMLAttributes, ReactNode } from 'react';

type RadioCardProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export function RadioCard({ label, className = '', ...props }: RadioCardProps) {
  return (
    <label className={`group relative block cursor-pointer ${className}`}>
      <input className="peer sr-only" type="radio" {...props} />
      <span className="focus-ring flex min-h-[46px] items-center justify-center rounded-[18px] border border-[#ddba5e] bg-surface px-4 text-center text-base font-bold leading-5 text-text-primary shadow-[0_4px_5px_rgba(139,94,0,0.14)] transition-colors peer-checked:border-primary-pressed peer-checked:bg-primary peer-checked:text-text-inverse peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-[#3a86ff]">
        {label}
      </span>
      <span className="absolute -top-2 right-6 hidden h-[18px] w-[18px] rounded-full bg-accent peer-checked:block" />
    </label>
  );
}
