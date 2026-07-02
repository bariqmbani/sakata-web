import { AppShell } from './AppShell';

export function LoadingScreen() {
  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center px-7">
        <div className="rounded-control border border-border bg-surface px-6 py-4 text-center shadow-warm-sm">
          <p className="text-sm font-bold">Menyiapkan kata...</p>
        </div>
      </div>
    </AppShell>
  );
}
