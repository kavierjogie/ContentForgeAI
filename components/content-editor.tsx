'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Download, 
  Save, 
  RefreshCw, 
  BookOpen, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  Check,
  Zap,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentEditorProps {
  content: string;
  setContent: (val: string) => void;
  onImproveAction: (actionType: string, options?: string) => void;
  isActionLoading: boolean;
  onSave: () => void;
  isSaved: boolean;
}

export default function ContentEditor({
  content,
  setContent,
  onImproveAction,
  isActionLoading,
  onSave,
  isSaved
}: ContentEditorProps) {
  const [copied, setCopied] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);

  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content ? content.length : 0;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `contentforge-generation-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const tones = ['Professional', 'Friendly', 'Casual', 'Persuasive', 'Educational', 'Creative', 'Technical'];

  return (
    <div className="flex flex-col h-full glass rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden min-h-[450px]">
      
      {/* Editor toolbar */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3">
        
        {/* Real-time word count */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Words: <strong className="text-slate-900 dark:text-white">{wordCount}</strong></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700" />
          <span>Characters: <strong className="text-slate-900 dark:text-white">{charCount}</strong></span>
        </div>

        {/* Copy, Download, Save button cluster */}
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!content}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={!content}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Download TXT"
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={!content || isSaved}
            className={cn(
              "p-2 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1.5",
              isSaved
                ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
            title="Save to History"
          >
            <Save size={14} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Text Editor Pane */}
      <div className="flex-1 relative bg-white dark:bg-slate-950">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Your generated content will appear here..."
          className="w-full h-full min-h-[300px] p-6 focus:outline-none bg-transparent resize-none text-sm leading-relaxed text-slate-800 dark:text-slate-250 font-sans"
        />
        {isActionLoading && (
          <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-250/20 dark:border-slate-800 shadow-xl flex items-center gap-3 animate-pulse">
              <RefreshCw size={16} className="animate-spin text-violet-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Refining text...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom AI secondary tools bar */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mr-2">AI Refactoring:</span>

        {/* Improve Button */}
        <button
          onClick={() => onImproveAction('improve')}
          disabled={!content || isActionLoading}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50"
        >
          Improve
        </button>

        {/* Shorten Button */}
        <button
          onClick={() => onImproveAction('shorten')}
          disabled={!content || isActionLoading}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50"
        >
          Shorten
        </button>

        {/* Expand Button */}
        <button
          onClick={() => onImproveAction('expand')}
          disabled={!content || isActionLoading}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50"
        >
          Expand
        </button>

        {/* Change Tone dropdown button */}
        <div className="relative">
          <button
            onClick={() => setShowToneDropdown(!showToneDropdown)}
            disabled={!content || isActionLoading}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <span>Change Tone</span>
            <ChevronDown size={12} />
          </button>
          
          {showToneDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowToneDropdown(false)} />
              <div className="absolute bottom-full mb-1 left-0 z-20 w-40 glass rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden py-1">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      onImproveAction('change-tone', t);
                      setShowToneDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
