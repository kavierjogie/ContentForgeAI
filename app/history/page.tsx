'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getGenerations, 
  deleteGeneration, 
  toggleFavoriteGeneration 
} from '@/lib/storage';
import { Generation } from '@/types';
import { 
  Search, 
  Trash2, 
  Copy, 
  Star, 
  Edit3, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Clock,
  History
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<Generation[]>([]);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  
  useEffect(() => {
    const loadHistory = () => {
      setHistory(getGenerations());
    };
    loadHistory();
    window.addEventListener('storage-update', loadHistory);
    return () => window.removeEventListener('storage-update', loadHistory);
  }, []);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavoriteGeneration(id);
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this content from history?')) {
      deleteGeneration(id);
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  const contentTypes = ['All', 'blog', 'email', 'social', 'marketing', 'product', 'code', 'summary', 'custom'];

  // Filtering
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.generatedContent.toLowerCase().includes(search.toLowerCase()) ||
                          item.prompt.toLowerCase().includes(search.toLowerCase());
    
    if (activeType === 'All') return matchesSearch;
    return item.contentType === activeType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, prompts, or content..."
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Workspace Redirect CTA */}
        <Link 
          href="/create"
          className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-center shadow-sm flex items-center justify-center gap-1.5"
        >
          <Sparkles size={16} />
          <span>New Generation</span>
        </Link>
      </div>

      {/* Content Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
        {contentTypes.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border capitalize",
              activeType === type
                ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 font-bold"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {type === 'All' ? 'All Types' : type}
          </button>
        ))}
      </div>

      {/* History Items Container */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center space-y-4 border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400">
              <History size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-850 dark:text-slate-200">No generations found</p>
              <p className="text-slate-400 text-xs mt-1">Generate text in the workspace or adjust search queries to populate history.</p>
            </div>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <Link
              key={item.id}
              href={`/create?id=${item.id}`}
              className="glass p-6 rounded-2xl block hover:bg-slate-100/50 dark:hover:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 hover:border-violet-500/25 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Meta details */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-600/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
                      {item.contentType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {item.generatedContent}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    <span>Tone: <strong>{item.tone}</strong></span>
                    <span>&bull;</span>
                    <span>Words: <strong>{item.wordCount}</strong></span>
                  </div>
                </div>

                {/* Operations cluster */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={(e) => handleFavoriteToggle(item.id, e)}
                    className={cn(
                      "p-2.5 rounded-xl border transition-colors",
                      item.isFavorite 
                        ? "text-pink-500 border-pink-500/25 bg-pink-500/5" 
                        : "text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                    title={item.isFavorite ? "Unfavorite Content" : "Favorite Content"}
                  >
                    <Star size={14} fill={item.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={(e) => copyToClipboard(item.generatedContent, e)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                    title="Copy Content"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-violet-500/30 group-hover:bg-violet-500/5 text-slate-400 group-hover:text-violet-500 transition-all">
                    <ChevronRight size={14} />
                  </div>
                </div>

              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
