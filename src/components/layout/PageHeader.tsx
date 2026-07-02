import { Link } from 'react-router';

type PageHeaderProps = {
  title: string;
  backTo?: string;
};

export function PageHeader({ title, backTo = '/' }: PageHeaderProps) {
  return (
    <header className="grid min-h-[70px] grid-cols-[92px_1fr_92px] items-center px-5 pt-5">
      <Link
        aria-label="Kembali"
        className="focus-ring inline-flex h-[42px] w-[92px] items-center justify-center rounded-[18px] border border-border bg-[#fff2c7] text-base font-bold text-text-primary shadow-[0_4px_5px_rgba(139,94,0,0.14)]"
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
