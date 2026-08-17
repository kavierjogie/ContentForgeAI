'use client';

import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Settings, 
  Sliders, 
  PenTool, 
  Eye, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratorFormProps {
  contentType: string;
  setContentType: (val: string) => void;
  topic: string;
  setTopic: (val: string) => void;
  audience: string;
  setAudience: (val: string) => void;
  tone: string;
  setTone: (val: string) => void;
  length: string;
  setLength: (val: string) => void;
  instructions: string;
  setInstructions: (val: string) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function GeneratorForm({
  contentType,
  setContentType,
  topic,
  setTopic,
  audience,
  setAudience,
  tone,
  setTone,
  length,
  setLength,
  instructions,
  setInstructions,
  prompt,
  setPrompt,
  onGenerate,
  isLoading
}: GeneratorFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const contentTypes = [
    { label: 'Blog Post', value: 'blog' },
    { label: 'Business Email', value: 'email' },
    { label: 'Social Media', value: 'social' },
    { label: 'Marketing Copy', value: 'marketing' },
    { label: 'Product Desc.', value: 'product' },
    { label: 'Code Script', value: 'code' },
    { label: 'Summary', value: 'summary' },
    { label: 'Custom Custom', value: 'custom' },
  ];

  const tones = ['Professional', 'Friendly', 'Casual', 'Persuasive', 'Educational', 'Creative', 'Technical'];
  const lengths = ['Short', 'Medium', 'Long'];

  // Compile final prompt automatically based on options (unless manually modified)
  useEffect(() => {
    const rawCompiled = `Generate a ${length.toLowerCase()} ${contentType}.
Topic: ${topic || '(Not Specified)'}
Target Audience: ${audience || '(General)'}
Tone: ${tone}
${instructions ? `Additional Directions: ${instructions}` : ''}
Ensure the result has clear, semantic structure.`;
    
    setPrompt(rawCompiled);
  }, [contentType, topic, audience, tone, length, instructions, setPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Please enter a Topic or Subject before generating.');
      return;
    }
    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Content Type Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Content Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {contentTypes.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setContentType(t.value)}
              className={cn(
                "p-3 rounded-xl border text-xs font-semibold transition-all text-center",
                contentType === t.value
                  ? "bg-violet-600/10 border-violet-500 text-violet-400 font-bold"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/40"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic/Subject input */}
      <div className="space-y-2">
        <label htmlFor="topic-input" className="text-xs font-bold uppercase tracking-wider text-slate-400">Topic / Subject *</label>
        <input
          id="topic-input"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. How AI is changing software engineering"
          required
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm placeholder:text-slate-600 transition-shadow disabled:opacity-50 text-slate-100"
        />
      </div>

      {/* Audience */}
      <div className="space-y-2">
        <label htmlFor="audience-input" className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Audience</label>
        <input
          id="audience-input"
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. University computer science students"
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm placeholder:text-slate-600 transition-shadow disabled:opacity-50 text-slate-100"
        />
      </div>

      {/* Tone & Length split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tone Select */}
        <div className="space-y-2">
          <label htmlFor="tone-select" className="text-xs font-bold uppercase tracking-wider text-slate-400">Tone</label>
          <select
            id="tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-shadow disabled:opacity-50 text-slate-100"
          >
            {tones.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Length Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Length</label>
          <div className="flex rounded-xl border border-slate-800 overflow-hidden bg-slate-900 h-[46px] p-1">
            {lengths.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => setLength(l)}
                disabled={isLoading}
                className={cn(
                  "flex-1 text-xs font-semibold rounded-lg transition-all",
                  length === l
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-800/40 hover:text-slate-350"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Custom Instructions */}
      <div className="space-y-2">
        <label htmlFor="instructions-input" className="text-xs font-bold uppercase tracking-wider text-slate-400">Custom Instructions</label>
        <textarea
          id="instructions-input"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Include three practical examples and use simple language."
          rows={3}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm placeholder:text-slate-600 transition-shadow disabled:opacity-50 resize-y text-slate-100"
        />
      </div>

      {/* Collapsible Advanced Prompt Section */}
      <div className="border border-slate-800/50 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-350 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Eye size={14} />
            <span>Show System Prompt Output</span>
          </span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showAdvanced && (
          <div className="p-4 bg-slate-950 border-t border-slate-800/50 space-y-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              rows={5}
              className="w-full p-3 font-mono text-[11px] rounded-lg border border-slate-800 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-slate-400"
            />
            <p className="text-[10px] text-slate-400">
              This compiled prompt is sent to the backend endpoint. You can modify it manually for advanced control.
            </p>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
          isLoading
            ? "bg-violet-600/50 text-white cursor-not-allowed shimmer relative overflow-hidden"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg neon-glow-primary hover:-translate-y-0.5"
        )}
      >
        <Sparkles size={18} className={isLoading ? "animate-spin" : ""} />
        <span>{isLoading ? 'Crafting content...' : 'Generate Content'}</span>
      </button>

    </form>
  );
}
