type FirebaseSetupProps = {
  missingKeys: string[];
};

export function FirebaseSetup({ missingKeys }: FirebaseSetupProps) {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-950">
      <div className="mx-auto max-w-2xl bg-[#dee4e7] p-6">
        <div className="panel">
          <h1 className="text-2xl font-bold">
            Konfigurasi Firebase Dibutuhkan
          </h1>
          <p className="mt-4 text-sm leading-6">
            Isi berkas <code>.env</code> berdasarkan <code>.env.example</code>{' '}
            sebelum menjalankan Sa-Kata.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {missingKeys.map((key) => (
              <li key={key}>
                <code>{key}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
