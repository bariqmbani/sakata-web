import { AppShell } from './AppShell';

export function LoadingScreen() {
  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center">
        <div className="panel text-center">
          <p className="text-sm font-bold uppercase">Memuat</p>
        </div>
      </div>
    </AppShell>
  );
}
