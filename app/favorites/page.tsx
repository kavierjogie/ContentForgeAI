'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getPrompts, 
  getGenerations, 
  toggleFavoritePrompt, 
  toggleFavoriteGeneration,
  deleteGeneration
} from '@/lib/storage';
import { Prompt, Generation } from '@/types';
import PromptCard from '@/components/prompt-card';
import { 
  Heart, 
  BookOpen, 
  FileText, 
  ChevronRight, 
  Star, 
  Copy, 
  Trash2, 
  FolderHeart 
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function FavoritesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'prompts' | 'generations'>('prompts');
  const [favPrompts, setFavPrompts] = useState<Prompt[]>([]);
  const [favGenerations, setFavGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      setFavPrompts(getPrompts().filter(p => p.isFavorite));
      setFavGenerations(getGenerations().filter(g => g.isFavorite));
    };

    loadFavorites();
    window.addEventListener('storage-update', loadFavorites);
    return () => window.removeEventListener('storage-update', loadFavorites);
  }, []);

  const handleFavoritePromptToggle = (id: string) => {
    toggleFavoritePrompt(id);
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleFavoriteGenToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavoriteGeneration(id);
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleDeleteGen = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this record?')) {
      deleteGeneration(id);
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  const handleUsePrompt = (prompt: Prompt) => {
    if (prompt.variables && prompt.variables.length > 0) {
      router.push(`/prompts?filter=favorites`); // Go to library where resolving variable inputs modal operates
    } else {
      router.push(`/create?templateId=${prompt.id}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tabs selectors */}
      <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 pb-px">
        <button
          onClick={() => setActiveTab('prompts')}
          className={cn(
            "pb-3 text-sm font-bold border-b-2 px-4 transition-colors flex items-center gap-2",
            activeTab === 'prompts'
              ? "border-violet-500 text-violet-600 dark:text-violet-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
          )}
        >
          <BookOpen size={16} />
          <span>Saved Prompts ({favPrompts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('generations')}
          className={cn(
            "pb-3 text-sm font-bold border-b-2 px-4 transition-colors flex items-center gap-2",
            activeTab === 'generations'
              ? "border-violet-500 text-violet-600 dark:text-violet-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
          )}
        >
          <FileText size={16} />
          <span>Saved Generations ({favGenerations.length})</span>
        </button>
      </div>

      {/* Prompts list tab */}
      {activeTab === 'prompts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favPrompts.length === 0 ? (
            <div className="col-span-full glass p-12 rounded-2xl text-center space-y-4 border border-dashed border-slate-200/50 dark:border-slate-800/50">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center mx-auto text-slate-400">
                <FolderHeart size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-850 dark:text-slate-200">No favorite prompts saved yet</p>
                <p className="text-slate-400 text-xs mt-1">Explore our starter templates to save useful prompts to your personal dashboard.</p>
              </div>
              <Link 
                href="/prompts"
                className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-sm"
              >
                Browse Prompt Library
              </Link>
            </div>
          ) : (
            favPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onFavoriteToggle={handleFavoritePromptToggle}
                onUseClick={handleUsePrompt}
                onEditClick={() => router.push(`/prompts`)}
                onDeleteClick={() => handleFavoritePromptToggle(prompt.id)}
                onDuplicateClick={() => {}}
              />
            ))
          )}
        </div>
      )}

      {/* Generations list tab */}
      {activeTab === 'generations' && (
        <div className="space-y-4">
          {favGenerations.length === 0 ? (
            <div className="glass p-12 rounded-2xl text-center space-y-4 border border-dashed border-slate-200/50 dark:border-slate-800/50">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center mx-auto text-slate-400">
                <Heart size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-850 dark:text-slate-200">No favorite generations saved yet</p>
                <p className="text-slate-400 text-xs mt-1">Generate content in the workspace and star your high-quality drafts.</p>
              </div>
              <Link 
                href="/create"
                className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-sm"
              >
                Go to Workspace
              </Link>
            </div>
          ) : (
            favGenerations.map(item => (
              <Link
                key={item.id}
                href={`/create?id=${item.id}`}
                className="glass p-6 rounded-2xl block hover:bg-slate-100/50 dark:hover:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 hover:border-violet-500/25 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={(e) => handleFavoriteGenToggle(item.id, e)}
                      className="p-2.5 rounded-xl border border-pink-500/25 bg-pink-500/5 text-pink-500 hover:bg-pink-500/10 transition-colors"
                      title="Unfavorite Content"
                    >
                      <Star size={14} fill="currentColor" />
                    </button>
                    <button
                      onClick={(e) => copyToClipboard(item.generatedContent, e)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                      title="Copy Content"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteGen(item.id, e)}
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
      )}

    </div>
  );
}
