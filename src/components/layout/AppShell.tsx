import { Outlet } from 'react-router';
import type { ReactNode } from 'react';

type AppShellProps = {
  children?: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-950 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden bg-[#dee4e7] p-5 sm:min-h-[calc(100vh-4rem)] sm:p-8">
        {children ?? <Outlet />}
      </div>
    </main>
  );
}
