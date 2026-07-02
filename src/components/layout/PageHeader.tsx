import { Link } from 'react-router';

type PageHeaderProps = {
  title: string;
  backTo?: string;
};

export function PageHeader({ title, backTo = '/' }: PageHeaderProps) {
  return (
    <header className="grid min-h-20 grid-cols-[6rem_1fr_6rem] items-center px-5 pt-5">
      <Link
        aria-label="Kembali"
        className="focus-ring inline-flex min-h-11 w-24 items-center justify-center rounded-control border border-border bg-surface-soft text-base font-bold text-text-primary shadow-warm-sm"
        to={backTo}
      >
        Kembali
      </Link>
      <h1 className="text-center text-lg font-bold leading-6 text-text-primary">
        {title}
      </h1>
      <span aria-hidden="true" />
    </header>
  );
}
