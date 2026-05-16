import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export function HowToPlayRoute() {
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
          <a
            className="underline decoration-dotted"
            href="https://kbbi.kemdikbud.go.id/entri/sifat"
            rel="noreferrer"
            target="_blank"
            title="si.fat"
          >
            sifat
          </a>
          <span> -&gt; </span>
          <a
            className="underline decoration-dotted"
            href="https://kbbi.kemdikbud.go.id/entri/fatwa"
            rel="noreferrer"
            target="_blank"
            title="fat.wa"
          >
            fatwa
          </a>
          <span> -&gt; </span>
          <a
            className="underline decoration-dotted"
            href="https://kbbi.kemdikbud.go.id/entri/wanita"
            rel="noreferrer"
            target="_blank"
            title="wa.ni.ta"
          >
            wanita
          </a>
          <span> -&gt; ta...</span>
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
