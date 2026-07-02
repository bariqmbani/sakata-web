import type { InputHTMLAttributes, ReactNode } from 'react';

type RadioCardProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export function RadioCard({ label, className = '', ...props }: RadioCardProps) {
  return (
    <label className={`group relative block cursor-pointer ${className}`}>
      <input className="peer sr-only" type="radio" {...props} />
      <span className="focus-ring flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface px-4 text-center text-base font-bold leading-5 text-text-primary shadow-warm-sm transition-colors peer-checked:border-primary-pressed peer-checked:bg-primary peer-checked:text-text-inverse peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus">
        {label}
      </span>
      <span className="absolute -top-2 right-6 hidden h-5 w-5 rounded-full bg-accent peer-checked:block" />
    </label>
  );
}
