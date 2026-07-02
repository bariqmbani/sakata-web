import { Outlet } from 'react-router';
import type { ReactNode } from 'react';

type AppShellProps = {
  children?: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-zinc-200 px-0 py-0 text-text-primary sm:px-5 sm:py-6">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-background shadow-shell sm:min-h-[844px] sm:rounded-panel sm:border sm:border-white/75">
        <div className="relative isolate flex min-h-screen flex-1 flex-col overflow-hidden sm:min-h-[844px]">
          <DecorativeShapes />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            {children ?? <Outlet />}
          </div>
        </div>
      </div>
    </main>
  );
}

function DecorativeShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      <div className="absolute -left-20 -top-20 h-48 w-60 rounded-full bg-accent/35" />
      <div className="absolute -right-20 top-20 h-40 w-40 rounded-full bg-primary/22" />
      <div className="absolute -bottom-10 -left-14 h-44 w-48 rounded-full bg-secondary/18" />
    </div>
  );
}
