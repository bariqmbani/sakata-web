import type { InputHTMLAttributes, ReactNode } from 'react';

type RadioCardProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export function RadioCard({ label, className = '', ...props }: RadioCardProps) {
  return (
    <label className={`group flex cursor-pointer items-center gap-2 ${className}`}>
      <input className="peer sr-only" type="radio" {...props} />
      <span className="w-4 text-[#8f8f17] opacity-0 peer-checked:opacity-100 peer-focus-visible:opacity-100">
        ►
      </span>
      <span className="text-sm font-bold group-hover:text-zinc-600">
        {label}
      </span>
    </label>
  );
}
