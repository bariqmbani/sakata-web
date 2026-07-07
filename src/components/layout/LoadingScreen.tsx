import { AppShell } from './AppShell';

type LoadingScreenProps = {
  progress?: number;
};

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const hasProgress = progress !== undefined && progress > 0;

  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center px-7">
        <div className="w-full max-w-[260px] rounded-control border border-border bg-surface px-6 py-5 text-center shadow-warm-sm">
          <p className="text-sm font-bold">Menyiapkan kata...</p>
          <div className="mt-3">
            <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-border/30">
              {hasProgress ? (
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              ) : (
                <div className="h-full w-1/3 animate-pulse rounded-full bg-primary/50" />
              )}
            </div>
            <p className="text-xs font-semibold text-primary">
              {hasProgress ? `${Math.min(progress, 100)}%` : 'Memuat...'}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
