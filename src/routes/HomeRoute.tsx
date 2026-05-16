import { useEffect } from 'react';
import { Link } from 'react-router';

import { logHomeView } from '@/services/analytics.service';

export function HomeRoute() {
  useEffect(() => {
    logHomeView();
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
      <div className="select-none">
        <h1 className="text-5xl font-black sm:text-7xl">Sa-Kata</h1>
        <p className="mt-2 text-right text-xs font-bold text-[#8f8f17]">
          versi alpha
        </p>
      </div>
      <nav className="mt-12 flex w-full max-w-sm flex-col gap-5">
        <Link
          className="pixel-btn block w-full px-5 py-4 text-sm"
          to="/bermain"
        >
          Mulai Permainan
        </Link>
        <Link
          className="pixel-btn block w-full px-5 py-4 text-sm"
          to="/cara-bermain"
        >
          Cara Bermain
        </Link>
        <button
          className="pixel-btn block w-full px-5 py-4 text-sm"
          disabled
          type="button"
        >
          Papan Peringkat
        </button>
      </nav>
    </div>
  );
}
