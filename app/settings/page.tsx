'use client';

import React, { useState, useEffect } from 'react';
import { 
  getSettings, 
  saveSettings, 
  getGenerations, 
  getPrompts 
} from '@/lib/storage';
import { AppSettings } from '@/types';
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  
  // Custom states for credentials
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedKeyMsg, setSavedKeyMsg] = useState(false);

  // Sync settings on mount
  useEffect(() => {
    const current = getSettings();
    setSettings(current);
    
    // Read cached UI key if present
    if (typeof window !== 'undefined') {
      const cachedKey = localStorage.getItem('contentforge_api_key_override') || '';
      setApiKey(cachedKey);
    }
  }, []);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    if (!settings) return;
    const updated = saveSettings({ [key]: value });
    setSettings(updated);
    
    // Apply immediately if theme changed
    if (key === 'theme') {
      const root = document.documentElement;
      if (value === 'dark') {
        root.classList.add('dark');
      } else if (value === 'light') {
        root.classList.remove('dark');
      } else {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        if (media.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
    
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleSaveKeyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if (apiKey.trim()) {
        localStorage.setItem('contentforge_api_key_override', apiKey.trim());
        updateSetting('apiKeySet', true);
        updateSetting('apiProvider', 'gemini');
      } else {
        localStorage.removeItem('contentforge_api_key_override');
        updateSetting('apiKeySet', false);
        updateSetting('apiProvider', 'demo');
      }
      setSavedKeyMsg(true);
      setTimeout(() => setSavedKeyMsg(false), 2000);
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const handleClearData = () => {
    if (confirm('CAUTION: This will delete all custom prompts, generation history, and reset settings. Continue?')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  if (!settings) return null;

  const tones = ['Professional', 'Friendly', 'Casual', 'Persuasive', 'Educational', 'Creative', 'Technical'];
  const lengths = ['Short', 'Medium', 'Long'];

  return (
    <div className="max-w-3xl space-y-8">
      
      {/* 1. Theme and appearance */}
      <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Appearance Theme</h3>
          <p className="text-slate-500 text-xs mt-0.5">Toggle between light, dark, and system theme preferences.</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Light', value: 'light', icon: Sun },
            { label: 'Dark', value: 'dark', icon: Moon },
            { label: 'System', value: 'system', icon: Monitor },
          ].map(themeOpt => {
            const Icon = themeOpt.icon;
            const isSelected = settings.theme === themeOpt.value;
            return (
              <button
                type="button"
                key={themeOpt.value}
                onClick={() => updateSetting('theme', themeOpt.value)}
                className={cn(
                  "p-4 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all",
                  isSelected
                    ? "bg-violet-600/10 border-violet-500 text-violet-600 dark:text-violet-400 font-bold"
                    : "bg-white/50 dark:bg-slate-900/50 border-slate-205 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                )}
              >
                <Icon size={18} />
                <span>{themeOpt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Workspace Defaults */}
      <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Workspace Presets</h3>
          <p className="text-slate-500 text-xs mt-0.5">Define default properties loaded when opening new content drafts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Tone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tone</label>
            <select
              value={settings.defaultTone}
              onChange={(e) => updateSetting('defaultTone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
            >
              {tones.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Length */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Length</label>
            <select
              value={settings.defaultLength}
              onChange={(e) => updateSetting('defaultLength', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
            >
              {lengths.map(len => <option key={len} value={len}>{len}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 3. API configuration credentials */}
      <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-5">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Key size={18} className="text-violet-500" />
            <span>AI Provider Configuration</span>
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">Toggle between live Gemini API calls and high-fidelity Demo Mode mockups.</p>
        </div>

        {/* Info banner */}
        <div className="p-4 rounded-xl bg-violet-600/5 border border-violet-500/15 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
          <p>
            💡 **Local Setup Recommendation:** The server-side API endpoint reads the `GEMINI_API_KEY` (or `AI_API_KEY`) environment variable from a local `.env.local` file. If configured, you do not need to enter a key below!
          </p>
          <div className="font-mono bg-white/50 dark:bg-black/40 p-2.5 rounded-lg border border-slate-200/30 dark:border-slate-800 text-[10px]">
            # Add to your .env.local:<br/>
            GEMINI_API_KEY=your_gemini_api_key_here
          </div>
        </div>

        {/* Provider selection toggle */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active AI Engine</label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 p-1 w-full max-w-sm">
            <button
              onClick={() => updateSetting('apiProvider', 'demo')}
              className={cn(
                "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                settings.apiProvider === 'demo'
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Demo Mock Engine
            </button>
            <button
              onClick={() => {
                if (!settings.apiKeySet) {
                  alert("Please enter a custom API Key below or verify .env.local variable is loaded to enable live requests.");
                }
                updateSetting('apiProvider', 'gemini');
              }}
              className={cn(
                "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                settings.apiProvider === 'gemini'
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Live Gemini Engine
            </button>
          </div>
        </div>

        {/* Input box override */}
        <form onSubmit={handleSaveKeyOverride} className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">UI API Key Override (Stored Client-Side)</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-650"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 transition-opacity flex items-center gap-1 flex-shrink-0 border border-slate-200/20"
            >
              {savedKeyMsg ? <Check size={14} className="text-emerald-500" /> : <Key size={14} />}
              <span>{savedKeyMsg ? 'Updated' : 'Apply Key'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            For security, key overrides entered here are kept inside local storage and passed via authorization headers to our `/api/generate` proxy. No credentials are saved server-side.
          </p>
        </form>
      </div>

      {/* 4. Cache reset and tools */}
      <div className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
        <div>
          <h3 className="font-bold text-base text-rose-500">Developer Operations</h3>
          <p className="text-slate-500 text-xs mt-0.5">Caution: Clear database items or reset all configuration values.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearData}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Reset Local Database</span>
          </button>
        </div>
      </div>

    </div>
  );
}
