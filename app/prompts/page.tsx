'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  getPrompts, 
  savePrompt, 
  deletePrompt, 
  toggleFavoritePrompt 
} from '@/lib/storage';
import { Prompt } from '@/types';
import PromptCard from '@/components/prompt-card';
import { 
  Plus, 
  Search, 
  X, 
  BookOpen, 
  Sliders, 
  Check, 
  FileCode, 
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

function PromptLibraryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Custom Prompts Creator states
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderEditingId, setBuilderEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Writing');
  const [template, setTemplate] = useState('');
  const [tags, setTags] = useState('');

  // Variables Input Modal states
  const [activePromptForVars, setActivePromptForVars] = useState<Prompt | null>(null);
  const [varInputs, setVarInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadPrompts = () => {
      setPrompts(getPrompts());
    };
    loadPrompts();
    window.addEventListener('storage-update', loadPrompts);
    return () => window.removeEventListener('storage-update', loadPrompts);
  }, []);

  useEffect(() => {
    if (filterParam === 'favorites') {
      setActiveCategory('Favorites');
    }
  }, [filterParam]);

  const categories = [
    'All',
    'Favorites',
    'Writing',
    'Marketing',
    'Business',
    'Coding',
    'Education',
    'Productivity',
    'Social Media',
    'Career',
    'Custom'
  ];

  // Favorite toggle
  const handleFavoriteToggle = (id: string) => {
    toggleFavoritePrompt(id);
    window.dispatchEvent(new Event('storage-update'));
  };

  // Delete custom prompt
  const handleDeletePrompt = (id: string) => {
    if (confirm('Are you sure you want to delete this custom prompt?')) {
      deletePrompt(id);
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  // Extract variables helper
  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\[([A-Za-z0-9_-]+)\]/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(m => m.slice(1, -1))));
  };

  // Build custom prompt
  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !template.trim()) {
      alert('Prompt Name and Template instructions are required.');
      return;
    }

    const vars = extractVariables(template);
    const splitTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    const newPrompt: Prompt = {
      id: builderEditingId || Math.random().toString(36).substring(2, 11),
      name,
      description: description || `Custom prompt template for ${category}`,
      category,
      template,
      variables: vars,
      tags: splitTags.length > 0 ? splitTags : [category, 'Custom'],
      isFavorite: false,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    savePrompt(newPrompt);
    window.dispatchEvent(new Event('storage-update'));
    
    // Reset form
    setShowBuilder(false);
    setBuilderEditingId(null);
    setName('');
    setDescription('');
    setCategory('Writing');
    setTemplate('');
    setTags('');
    alert(builderEditingId ? 'Prompt successfully updated!' : 'Custom prompt successfully created!');
  };

  const handleEditClick = (prompt: Prompt) => {
    setBuilderEditingId(prompt.id);
    setName(prompt.name);
    setDescription(prompt.description);
    setCategory(prompt.category);
    setTemplate(prompt.template);
    setTags(prompt.tags.join(', '));
    setShowBuilder(true);
  };

  const handleDuplicateClick = (prompt: Prompt) => {
    const dup: Prompt = {
      ...prompt,
      id: Math.random().toString(36).substring(2, 11),
      name: `${prompt.name} (Copy)`,
      isCustom: true,
      isFavorite: false,
      createdAt: new Date().toISOString()
    };
    savePrompt(dup);
    window.dispatchEvent(new Event('storage-update'));
    alert('Prompt duplicated successfully!');
  };

  const handleUsePrompt = (prompt: Prompt) => {
    // If prompt requires filling bracket variables, open modal
    if (prompt.variables && prompt.variables.length > 0) {
      const initialInputs: Record<string, string> = {};
      prompt.variables.forEach(v => {
        initialInputs[v] = '';
      });
      setVarInputs(initialInputs);
      setActivePromptForVars(prompt);
    } else {
      // Direct navigate
      router.push(`/create?templateId=${prompt.id}`);
    }
  };

  const handleVarsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePromptForVars) return;

    let finalPromptText = activePromptForVars.template;
    Object.entries(varInputs).forEach(([key, val]) => {
      finalPromptText = finalPromptText.replace(new RegExp(`\\[${key}\\]`, 'g'), val || `[${key}]`);
    });

    // Save final compiled instructions to sessionStorage so the workspace can fetch them
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('contentforge_prefill_instructions', finalPromptText);
      sessionStorage.setItem('contentforge_prefill_title', `${activePromptForVars.name} Draft`);
      
      const categoryType = activePromptForVars.category.toLowerCase() === 'coding' ? 'code' : 'blog';
      router.push(`/create?type=${categoryType}&customPrefill=true`);
    }

    setActivePromptForVars(null);
  };

  // Filtering
  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Favorites') return p.isFavorite && matchesSearch;
    if (activeCategory === 'Custom') return p.isCustom && matchesSearch;
    
    return p.category === activeCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts or tags..."
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Create CTA */}
        <button
          onClick={() => {
            setBuilderEditingId(null);
            setShowBuilder(true);
          }}
          className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md neon-glow-primary hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus size={16} />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
              activeCategory === cat
                ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 font-bold"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.length === 0 ? (
          <div className="col-span-full glass p-12 rounded-2xl text-center space-y-4 border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400">
              <FolderOpen size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No prompts found</p>
              <p className="text-slate-400 text-xs mt-1">Try refining your search filter or create a new custom prompt.</p>
            </div>
            {activeCategory === 'Favorites' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onFavoriteToggle={handleFavoriteToggle}
              onUseClick={handleUsePrompt}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeletePrompt}
              onDuplicateClick={handleDuplicateClick}
            />
          ))
        )}
      </div>

      {/* Builder Modal (Create/Edit prompt) */}
      {showBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowBuilder(false);
                setBuilderEditingId(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-650"
            >
              <X size={16} />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {builderEditingId ? 'Edit Custom Prompt' : 'Create Custom Prompt'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Design custom prompt templates. Brackets like <code className="font-mono text-violet-500 bg-violet-500/10 px-1 rounded">[JOB_TITLE]</code> will extract as user inputs.
              </p>
            </div>

            <form onSubmit={handleCreatePrompt} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Prompt Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cold Outreach Generator"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Generate high-converting sales outreach letters."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {categories.filter(c => c !== 'All' && c !== 'Favorites').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. Sales, Cold, B2B"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Prompt Template *</label>
                <textarea
                  required
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="e.g. Write a cover letter for a [JOB_TITLE] position at [COMPANY] highlighting my experience in [SKILLS]."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setShowBuilder(false);
                    setBuilderEditingId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-sm"
                >
                  {builderEditingId ? 'Save Changes' : 'Create Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Variables Input Modal (Fills variables when utilizing prompts) */}
      {activePromptForVars && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 relative max-h-[95vh] overflow-y-auto space-y-5">
            
            <button
              onClick={() => setActivePromptForVars(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={16} />
            </button>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders size={18} className="text-violet-500" />
                <span>Resolve Prompt Variables</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1">Provide inputs for the prompt variables below.</p>
            </div>

            <form onSubmit={varInputs ? handleVarsSubmit : undefined} className="space-y-4">
              {activePromptForVars.variables.map(variable => (
                <div key={variable} className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{variable.replace(/_/g, ' ')}</label>
                  <input
                    type="text"
                    required
                    value={varInputs[variable] || ''}
                    onChange={(e) => setVarInputs({
                      ...varInputs,
                      [variable]: e.target.value
                    })}
                    placeholder={`Enter value for [${variable}]`}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              ))}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setActivePromptForVars(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-sm"
                >
                  <span>Inject variables</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function PromptLibrary() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    }>
      <PromptLibraryInner />
    </Suspense>
  );
}
