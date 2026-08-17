'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import Header from './header';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return <div className="dark min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500/30 selection:text-violet-200">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Workspace Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
