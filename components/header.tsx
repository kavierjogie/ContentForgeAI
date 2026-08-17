'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Info, ShieldAlert, Key } from 'lucide-react';
import { getSettings } from '@/lib/storage';
import { AppSettings } from '@/types';

export default function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // Sync settings on mount
  useEffect(() => {
    const current = getSettings();
    setSettings(current);
  }, [pathname]);

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard';
      case '/create': return 'Content Workspace';
      case '/prompts': return 'Prompt Library';
      case '/history': return 'Generation History';
      case '/favorites': return 'Saved Favorites';
      case '/settings': return 'Settings';
      default: return 'ContentForge AI';
    }
  };

  const isDemoMode = !settings || settings.apiProvider === 'demo' || !settings.apiKeySet;

  return (
    <header className="h-20 border-b border-slate-800/50 flex flex-col justify-center px-6 lg:px-8 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center justify-between">
        
        {/* Current page title */}
        <div className="pl-12 lg:pl-0">
          <h1 className="text-xl font-bold text-white capitalize">
            {getPageTitle()}
          </h1>
        </div>

        {/* Action icons & banner */}
        <div className="flex items-center gap-4">
          
          {/* Demo Mode Badge */}
          {isDemoMode ? (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/35 text-amber-400 neon-glow-secondary animate-glow">
              <ShieldAlert size={14} />
              <span>Demo Mode Active (API Key Mocked)</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/35 text-emerald-400">
              <Key size={14} />
              <span>Gemini API Connected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
