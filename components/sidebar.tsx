'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  BookOpen, 
  History, 
  Heart, 
  Settings, 
  Menu, 
  X,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPrompts, getGenerations } from '@/lib/storage';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({ promptsCount: 0, favoritesCount: 0 });

  // Update counts on navigation or mount
  useEffect(() => {
    const updateCounts = () => {
      const prompts = getPrompts();
      const generations = getGenerations();
      
      const favPrompts = prompts.filter(p => p.isFavorite).length;
      const favGens = generations.filter(g => g.isFavorite).length;
      
      setStats({
        promptsCount: prompts.length,
        favoritesCount: favPrompts + favGens
      });
    };

    updateCounts();
    // Listening to custom storage events to keep numbers synced
    window.addEventListener('storage-update', updateCounts);
    return () => window.removeEventListener('storage-update', updateCounts);
  }, [pathname]);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create', href: '/create', icon: Sparkles, accent: true },
    { name: 'Prompt Library', href: '/prompts', icon: BookOpen, badge: stats.promptsCount },
    { name: 'History', href: '/history', icon: History },
    { name: 'Favorites', href: '/favorites', icon: Heart, badge: stats.favoritesCount > 0 ? stats.favoritesCount : undefined },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900/80 border border-white/10 text-white backdrop-blur-md hover:bg-slate-800 transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Layout */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div>
          {/* Header Branding */}
          <div className="h-20 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white neon-glow-primary animate-pulse">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                ContentForge <span className="text-violet-500 font-extrabold text-xs align-super uppercase">AI</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-200",
                    isActive 
                      ? item.accent
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg neon-glow-primary"
                        : "bg-slate-200/60 dark:bg-slate-800/60 text-violet-600 dark:text-violet-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                    )} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={cn(
                      "text-xs px-2.5 py-0.5 rounded-full font-bold transition-all",
                      isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-700"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-500/5 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-sm border border-white/20">
              CF
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Workspace User</p>
              <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                Active Session
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
