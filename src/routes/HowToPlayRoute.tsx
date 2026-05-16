import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

import { logHowToPlayView } from '@/services/analytics.service';

export function HowToPlayRoute() {
  useEffect(() => {
    logHowToPlayView();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex min-h-16 items-center gap-3 text-xl font-bold">
        <Link
          aria-label="Kembali"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center"
          to="/"
        >
          <ArrowLeft size={28} />
        </Link>
        <span>Cara Bermain</span>
      </header>
      <section className="mt-4 flex-1 overflow-auto text-sm leading-8">
        <p>
          Sa-Kata adalah permainan menyambung kata bahasa Indonesia dengan
          objektif membuat rantai kata yang terbentuk berdasarkan suku kata
          terakhir kata sebelumnya.
        </p>
        <div className="panel my-6 bg-white text-center text-xs leading-7 sm:text-sm">
          <div className="retro-tooltip group">
            <a
              className="underline decoration-dotted cursor-pointer"
              href="https://kbbi.kemdikbud.go.id/entri/sifat"
              rel="noreferrer"
              target="_blank"
            >
              sifat
            </a>
            <span className="tooltip-text">si.fat</span>
          </div>
          <span> -&gt; </span>
          <div className="retro-tooltip group">
            <a
              className="underline decoration-dotted cursor-pointer"
              href="https://kbbi.kemdikbud.go.id/entri/fatwa"
              rel="noreferrer"
              target="_blank"
            >
              fatwa
            </a>
            <span className="tooltip-text">fat.wa</span>
          </div>
          <span> -&gt; </span>
          <div className="retro-tooltip group">
            <a
              className="underline decoration-dotted cursor-pointer"
              href="https://kbbi.kemdikbud.go.id/entri/wanita"
              rel="noreferrer"
              target="_blank"
            >
              wanita
            </a>
            <span className="tooltip-text">wa.ni.ta</span>
          </div>
          <span> -&gt; </span>
          <div className="retro-tooltip group">
            <span className="cursor-pointer underline decoration-dotted">ta...</span>
            <span className="tooltip-text">
              ta.hu
              <br />
              ta.kut
              <br />
              tam.bang
            </span>
          </div>
        </div>
        <p>Kata pertama akan ditentukan secara acak.</p>
        <p className="mt-6">
          Mata rantai tidak akan terbentuk jika kata tidak valid atau tidak
          terdapat dalam entri KBBI.
        </p>
        <p className="mt-6">
          Permainan berlangsung sesuai dengan durasi waktu yang dipilih sebelum
          memulai permainan.
        </p>
        <p className="mt-6">
          Kata yang Anda pilih menentukan langkah selanjutnya.
        </p>
        <p className="mt-6">Selamat bermain!</p>
      </section>
    </div>
  );
}
