type FirebaseSetupProps = {
  missingKeys: string[];
};

export function FirebaseSetup({ missingKeys }: FirebaseSetupProps) {
  return (
    <main className="min-h-screen bg-zinc-200 px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-[430px] rounded-panel border border-white/75 bg-background p-6 shadow-shell">
        <div className="rounded-card border border-border bg-surface p-6 shadow-warm-sm">
          <h1 className="text-2xl font-extrabold leading-8">
            Firebase Belum Dikonfigurasi
          </h1>
          <p className="mt-4 text-sm font-medium leading-6 text-text-secondary">
            Isi file <code>.env</code> dari <code>.env.example</code>{' '}
            dulu sebelum jalanin Sa-Kata.
          </p>
          <ul className="mt-5 space-y-2 text-sm font-bold">
            {missingKeys.map((key) => (
              <li
                className="rounded-2xl border border-border bg-surface-raised px-3 py-2"
                key={key}
              >
                <code>{key}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
