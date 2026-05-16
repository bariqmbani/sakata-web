import { Link } from 'react-router';

export function HomeRoute() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
      <div className="select-none">
        <h1 className="text-5xl font-black sm:text-7xl">Sa-Kata</h1>
        <p className="mt-2 text-right text-xs font-bold text-amber-700">
          versi alpha
        </p>
      </div>
      <nav className="mt-12 flex w-full max-w-sm flex-col gap-5">
        <Link
          className="pixel-box bg-zinc-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-800"
          to="/bermain"
        >
          Mulai Permainan
        </Link>
        <Link
          className="pixel-box bg-white px-5 py-4 text-sm font-bold transition hover:bg-zinc-100"
          to="/cara-bermain"
        >
          Cara Bermain
        </Link>
        <button
          className="pixel-box cursor-not-allowed bg-zinc-300 px-5 py-4 text-sm font-bold text-zinc-500"
          disabled
          type="button"
        >
          Papan Peringkat
        </button>
      </nav>
    </div>
  );
}
