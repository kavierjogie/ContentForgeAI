'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Info, ShieldAlert, Key } from 'lucide-react';
import { getSettings, saveSettings } from '@/lib/storage';
import { AppSettings } from '@/types';

export default function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // Sync settings on mount
  useEffect(() => {
    const current = getSettings();
    setSettings(current);
    
    // Apply theme
    applyTheme(current.theme);
  }, [pathname]);

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      if (media.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleToggleTheme = () => {
    if (!settings) return;
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = saveSettings({ theme: nextTheme });
    setSettings(updated);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event('storage-update'));
  };

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
    <header className="h-20 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center px-6 lg:px-8 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center justify-between">
        
        {/* Current page title */}
        <div className="pl-12 lg:pl-0">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
            {getPageTitle()}
          </h1>
        </div>

        {/* Action icons & banner */}
        <div className="flex items-center gap-4">
          
          {/* Demo Mode Badge */}
          {isDemoMode ? (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/35 text-amber-600 dark:text-amber-400 neon-glow-secondary animate-glow">
              <ShieldAlert size={14} />
              <span>Demo Mode Active (API Key Mocked)</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400">
              <Key size={14} />
              <span>Gemini API Connected</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={handleToggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title={`Switch to ${settings?.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {settings?.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
