'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  History, 
  Heart, 
  PlusCircle, 
  FileText, 
  Copy, 
  Trash2, 
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Terminal,
  Zap,
  Edit,
  ArrowRight
} from 'lucide-react';
import { 
  getDashboardStats, 
  getGenerations, 
  getPrompts, 
  toggleFavoriteGeneration, 
  deleteGeneration 
} from '@/lib/storage';
import { DashboardStats, Generation, Prompt } from '@/types';
import { cn, formatDate, formatNumber } from '@/lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentGens, setRecentGens] = useState<Generation[]>([]);
  const [favPrompts, setFavPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const loadDashboardData = () => {
      setStats(getDashboardStats());
      setRecentGens(getGenerations().slice(0, 4));
      setFavPrompts(getPrompts().filter(p => p.isFavorite).slice(0, 3));
    };

    loadDashboardData();
    window.addEventListener('storage-update', loadDashboardData);
    return () => window.removeEventListener('storage-update', loadDashboardData);
  }, []);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavoriteGeneration(id);
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this generation?')) {
      deleteGeneration(id);
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  // Content type mapping helpers
  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return Edit;
      case 'email': return FileText;
      case 'code': return Terminal;
      case 'social': return GlobeIcon;
      default: return Sparkles;
    }
  };

  const getCol = (type: string) => {
    switch (type) {
      case 'blog': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'email': return 'text-violet-500 bg-violet-500/10 border-violet-500/20';
      case 'code': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      case 'social': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  // Reusable custom GlobeIcon (since we don't import standard Lucide Globe directly)
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

  // Calculate SVG Chart dimensions
  const renderTypeChart = () => {
    if (!stats || Object.keys(stats.typeDistribution).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs text-center border border-dashed border-slate-800 rounded-xl">
          <TrendingUp size={24} className="mb-2 text-slate-700" />
          <span>No analytics data yet.<br/>Generate content to populate this chart.</span>
        </div>
      );
    }

    const types = Object.entries(stats.typeDistribution);
    const maxVal = Math.max(...types.map(([_, count]) => count));
    const width = 360;
    const height = 180;
    const padding = 30;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        {/* Draw bars */}
        {types.map(([type, count], idx) => {
          const colCount = types.length;
          const spacing = (width - padding * 2) / colCount;
          const barWidth = Math.min(24, spacing - 10);
          const x = padding + idx * spacing + (spacing - barWidth) / 2;
          const barHeight = (count / maxVal) * (height - padding * 2);
          const y = height - padding - barHeight;

          return (
            <g key={type} className="group">
              {/* Highlight background on hover */}
              <rect
                x={x - 4}
                y={padding - 10}
                width={barWidth + 8}
                height={height - padding * 2 + 15}
                fill="currentColor"
                className="text-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity"
                rx={4}
              />
              {/* Bar gradient color */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx={3}
              />
              {/* Value Label */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {count}
              </text>
              {/* X Axis label */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-[9px] font-semibold uppercase tracking-wider fill-slate-550"
              >
                {type.substring(0, 5)}
              </text>
            </g>
          );
        })}
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-violet-600/15 via-purple-600/5 to-cyan-500/10 border border-violet-500/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back to ContentForge AI!</h2>
          <p className="text-slate-400 text-sm mt-1">
            Build and optimize custom text generations, edit workflows, or manage pre-seeded templates from your Prompt Library.
          </p>
        </div>
        <Link 
          href="/create" 
          className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md neon-glow-primary hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle size={16} />
          <span>Create Content</span>
        </Link>
      </div>

      {/* Analytics Statistics Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { name: 'Generations Logged', value: stats?.totalGenerations || 0, icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
          { name: 'Words Generated', value: formatNumber(stats?.totalWords || 0), icon: Sparkles, color: 'text-violet-500 bg-violet-500/10' },
          { name: 'Prompts in Library', value: stats?.savedPrompts || 0, icon: BookOpen, color: 'text-cyan-500 bg-cyan-500/10' },
          { name: 'Saved Favorites', value: stats?.favoritesCount || 0, icon: Heart, color: 'text-pink-500 bg-pink-500/10' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass p-5 rounded-2xl flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} border border-white/5`}>
                <Icon size={20} />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">{item.name}</span>
                <span className="text-2xl font-extrabold text-white mt-1 block leading-none">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Columns - Recent Generations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Generations</h3>
            <Link href="/history" className="text-xs font-semibold text-violet-500 hover:text-violet-400 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentGens.length === 0 ? (
              <div className="glass p-8 rounded-2xl text-center space-y-4 border border-dashed border-slate-800">
                <p className="text-slate-400 text-sm">No content generated yet. Open the workspace to get started.</p>
                <Link href="/create" className="inline-flex items-center gap-2 text-xs font-bold text-violet-500 hover:text-violet-400">
                  <span>Go to Workspace</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              recentGens.map((gen) => {
                const Icon = getIcon(gen.contentType);
                const colClass = getCol(gen.contentType);
                return (
                  <Link 
                    key={gen.id} 
                    href={`/create?id=${gen.id}`}
                    className="glass p-5 rounded-2xl block hover:bg-slate-900/30 transition-all border border-slate-800/30 hover:border-violet-500/20 group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colClass}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">{gen.title}</h4>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {formatDate(gen.createdAt)} &bull; {gen.wordCount} words &bull; {gen.tone}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 z-10">
                        <button
                          onClick={(e) => handleFavoriteToggle(gen.id, e)}
                          className={cn(
                            "p-2 rounded-lg border hover:bg-slate-800 transition-colors",
                            gen.isFavorite 
                              ? "text-pink-500 border-pink-500/25 bg-pink-500/5" 
                              : "text-slate-400 border-slate-800"
                          )}
                          title={gen.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Star size={14} fill={gen.isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => copyToClipboard(gen.generatedContent, e)}
                          className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors"
                          title="Copy Draft"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(gen.id, e)}
                          className="p-2 rounded-lg border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 text-slate-400 transition-colors"
                          title="Delete Draft"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Right Columns - Analytics Chart & Quick Presets */}
        <div className="space-y-6">
          
          {/* SVG bar chart */}
          <div className="glass p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Workspace Analytics</h3>
            {renderTypeChart()}
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Presets</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Blog Post', type: 'blog', color: 'border-blue-500/25 hover:bg-blue-500/5' },
                { name: 'Email Draft', type: 'email', color: 'border-violet-500/25 hover:bg-violet-500/5' },
                { name: 'Code Script', type: 'code', color: 'border-cyan-500/25 hover:bg-cyan-500/5' },
                { name: 'Ad Campaign', type: 'marketing', color: 'border-amber-500/25 hover:bg-amber-500/5' },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={`/create?type=${link.type}`}
                  className={cn(
                    "p-4 rounded-xl border bg-slate-900/50 hover:-translate-y-0.5 transition-all text-xs font-semibold text-center leading-tight flex items-center justify-center gap-1.5",
                    link.color
                  )}
                >
                  <PlusCircle size={12} />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Favorite Prompts List */}
          <div className="glass p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Favorite Prompts</h3>
              <Link href="/prompts?filter=favorites" className="text-[10px] font-bold text-violet-500 hover:text-violet-400">View All</Link>
            </div>
            <div className="space-y-2">
              {favPrompts.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-4">No prompts favorited yet. Star your starter templates in the Prompt Library!</p>
              ) : (
                favPrompts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/create?templateId=${p.id}`}
                    className="p-3 rounded-xl border border-slate-800/50 hover:bg-slate-800/40 flex items-center justify-between gap-3 text-xs group"
                  >
                    <div>
                      <h4 className="font-bold text-slate-200 line-clamp-1 group-hover:text-violet-400 transition-colors">{p.name}</h4>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{p.category}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
