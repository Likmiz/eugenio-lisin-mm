import React from 'react';

import { Menubar } from 'primereact/menubar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const start = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-shopping-bag text-xl" />
      <span className="font-semibold text-lg">Gestión de productos</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3 pr-2">
      <span className="text-sm text-color-secondary">Demo técnica | Evgeny Lisin</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-column">
      <header className="shadow-1 surface-card border-bottom-1 border-100">
        <Menubar start={start} end={end} className="border-none" />
      </header>

      <main className="app-main-wrapper">
        {children}
      </main>
    </div>
  );
};