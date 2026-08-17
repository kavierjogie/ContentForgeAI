'use client';

import React from 'react';
import { Prompt } from '@/types';
import { 
  Star, 
  Play, 
  Trash2, 
  Copy, 
  Edit, 
  BookOpen, 
  Terminal, 
  Layers, 
  Briefcase, 
  FileText,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  onFavoriteToggle: (id: string) => void;
  onUseClick: (prompt: Prompt) => void;
  onEditClick: (prompt: Prompt) => void;
  onDeleteClick: (id: string) => void;
  onDuplicateClick: (prompt: Prompt) => void;
}

export default function PromptCard({
  prompt,
  onFavoriteToggle,
  onUseClick,
  onEditClick,
  onDeleteClick,
  onDuplicateClick
}: PromptCardProps) {
  
  // Icon selector based on category
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'coding': return Terminal;
      case 'business': return Briefcase;
      case 'career': return UserCheck;
      case 'social media': return GlobeIcon;
      case 'marketing': return Layers;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'coding': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      case 'business': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'career': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'social media': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      case 'marketing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-violet-500 bg-violet-500/10 border-violet-500/20';
    }
  };

  // Custom GlobeIcon
  function GlobeIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    );
  }

  const Icon = getCategoryIcon(prompt.category);
  const colorClass = getCategoryColor(prompt.category);
  const hasVariables = prompt.variables && prompt.variables.length > 0;

  return (
    <div className="glass p-5 rounded-2xl border border-slate-800/50 hover:border-violet-500/20 flex flex-col justify-between hover:shadow-md hover:bg-slate-900/15 transition-all group relative overflow-hidden">
      <div>
        
        {/* Header (category badge + action group) */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            "text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border",
            colorClass
          )}>
            {prompt.category}
          </span>
          
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            {/* Favorite button */}
            <button
              onClick={() => onFavoriteToggle(prompt.id)}
              className={cn(
                "p-1.5 rounded-lg border border-slate-850/50 hover:bg-slate-800 transition-colors",
                prompt.isFavorite ? "text-pink-500 bg-pink-500/5 border-pink-500/25" : "text-slate-400"
              )}
              title={prompt.isFavorite ? "Unfavorite Prompt" : "Favorite Prompt"}
            >
              <Star size={12} fill={prompt.isFavorite ? "currentColor" : "none"} />
            </button>

            {/* Duplicate button */}
            <button
              onClick={() => onDuplicateClick(prompt)}
              className="p-1.5 rounded-lg border border-slate-850/50 text-slate-400 hover:bg-slate-800 transition-colors"
              title="Duplicate Prompt"
            >
              <Copy size={12} />
            </button>

            {/* Edit button (custom prompts only) */}
            {prompt.isCustom && (
              <button
                onClick={() => onEditClick(prompt)}
                className="p-1.5 rounded-lg border border-slate-850/50 text-slate-400 hover:bg-slate-800 transition-colors"
                title="Edit Prompt"
              >
                <Edit size={12} />
              </button>
            )}

            {/* Delete button (custom prompts only) */}
            {prompt.isCustom && (
              <button
                onClick={() => onDeleteClick(prompt.id)}
                className="p-1.5 rounded-lg border border-slate-850/50 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-colors"
                title="Delete Prompt"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Name and Description */}
        <div className="flex gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5",
            colorClass
          )}>
            <Icon size={16} />
          </div>
          <div>
            <h4 className="font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1 leading-snug">
              {prompt.name}
            </h4>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2">
              {prompt.description}
            </p>
          </div>
        </div>

        {/* Variables Info */}
        {hasVariables && (
          <div className="mt-4 flex flex-wrap gap-1 items-center">
            <span className="text-[9px] font-bold text-slate-500 mr-1 uppercase">Inputs:</span>
            {prompt.variables.map(v => (
              <span key={v} className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 border-t border-slate-800/40 pt-4 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono">
          {prompt.isCustom ? 'User Prompt' : 'Starter Template'}
        </span>
        <button
          onClick={() => onUseClick(prompt)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-colors flex items-center gap-1 shadow-sm"
        >
          <Play size={10} fill="currentColor" />
          <span>Use Prompt</span>
        </button>
      </div>

    </div>
  );
}
