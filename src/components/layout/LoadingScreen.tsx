import { AppShell } from './AppShell';

export function LoadingScreen() {
  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-[18px] border border-border bg-surface px-6 py-4 text-center shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
          <p className="text-sm font-bold">Menyiapkan kata...</p>
        </div>
      </div>
    </AppShell>
  );
}
