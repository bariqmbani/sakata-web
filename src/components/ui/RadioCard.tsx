import type { InputHTMLAttributes, ReactNode } from 'react';

type RadioCardProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export function RadioCard({ label, className = '', ...props }: RadioCardProps) {
  return (
    <label className={`block ${className}`}>
      <input className="peer sr-only" type="radio" {...props} />
      <span className="focus-ring flex min-h-12 cursor-pointer items-center border-[3px] border-zinc-950 bg-white px-4 py-3 text-sm font-bold peer-checked:bg-amber-200 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-amber-700">
        {label}
      </span>
    </label>
  );
}
