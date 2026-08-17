'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  History, 
  Copy, 
  Edit3, 
  ChevronRight,
  Globe,
  Sliders
} from 'lucide-react';

export default function LandingPage() {
  const contentTypes = [
    { title: 'Blog Post', desc: 'Outlines and full draft posts with SEO optimization.', icon: Edit3, type: 'blog', color: 'from-blue-500 to-indigo-500' },
    { title: 'Email Copy', desc: 'Professional emails for business outreach or newsletters.', icon: CheckCircle2, type: 'email', color: 'from-violet-500 to-purple-500' },
    { title: 'Social Media', desc: 'Attention-grabbing posts for LinkedIn, Twitter and more.', icon: Globe, type: 'social', color: 'from-pink-500 to-rose-500' },
    { title: 'Marketing Ad', desc: 'Persuasive taglines and copy written to convert leads.', icon: Sliders, type: 'marketing', color: 'from-amber-500 to-orange-500' },
    { title: 'Product Desc', desc: 'Highlight product features and customer value propositions.', icon: Sparkles, type: 'product', color: 'from-emerald-500 to-teal-500' },
    { title: 'Code Builder', desc: 'Generate clean source files with explanation blocks.', icon: Terminal, type: 'code', color: 'from-cyan-500 to-blue-500' },
    { title: 'Executive Summary', desc: 'Synthesize long transcripts or reports into key points.', icon: Cpu, type: 'summary', color: 'from-indigo-500 to-violet-500' },
    { title: 'Custom Output', desc: 'Design your own custom variables and templates.', icon: Zap, type: 'custom', color: 'from-fuchsia-500 to-purple-500' }
  ];

  const features = [
    { title: 'Advanced AI Generation', desc: 'Generate clean content tailored specifically to your target audience.', icon: Sparkles },
    { title: 'Dynamic Prompt Library', desc: 'Save and run templates with custom inputs dynamically resolved.', icon: BookOpen },
    { title: 'Refined Secondary Action Editors', desc: 'Instantly improve, shorten, expand or re-tone drafts in place.', icon: Edit3 },
    { title: 'Full Generation History Log', desc: 'Never lose a draft. Easily revisit previous configurations and outputs.', icon: History },
    { title: 'One-Click Copy & Download', desc: 'Export copy to clipboard or download text files in one click.', icon: Copy },
    { title: 'Global Translations', desc: 'Output responses in international languages such as Afrikaans, Zulu and Xhosa.', icon: Globe }
  ];

  const samplePrompts = [
    { name: 'Professional Business Email', cat: 'Business', desc: 'Draft outreach messages, client communications, and calendar updates.' },
    { name: 'Sleek Cover Letter Builder', cat: 'Career', desc: 'Build highly personalized applications highlighting target skills.' },
    { name: 'Algorithms & Code Generator', cat: 'Coding', desc: 'Generate clean algorithms with inline explanations.' }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none animate-glow" style={{ animationDelay: '2s' }} />

      {/* Header Bar */}
      <header className="container mx-auto px-6 h-20 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white neon-glow-primary">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            ContentForge <span className="text-violet-500 font-extrabold text-xs align-super uppercase">AI</span>
          </span>
        </div>
        <div>
          <Link 
            href="/dashboard" 
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all backdrop-blur-md flex items-center gap-2"
          >
            <span>Enter App</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-20 text-center relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <Sparkles size={12} className="animate-spin" />
            <span>Next-Generation Content Creation Workspace</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Create Better Content. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Faster.</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            ContentForge AI is a portfolio-ready workspace designed to draft blog articles, business correspondence, code, and marketing material utilizing customizable AI prompts and structural presets.
          </p>

          {/* CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link 
              href="/create" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg neon-glow-primary hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              <span>Start Creating Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="/prompts" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              <span>Explore Prompts</span>
              <BookOpen size={18} />
            </Link>
          </div>
        </div>

        {/* Workspace Preview Frame Mockup */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-slate-900/60 p-2.5 backdrop-blur-md shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-cyan-500/10 rounded-2xl pointer-events-none" />
          <div className="rounded-xl border border-white/5 bg-slate-950/80 overflow-hidden aspect-[16/9] flex flex-col justify-between p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="text-xs text-slate-500 font-mono">workspace@contentforge.ai</div>
              <div className="w-20" />
            </div>
            <div className="flex-1 flex gap-4 pt-4 text-left">
              <div className="w-1/3 border-r border-white/5 pr-4 space-y-3">
                <div className="h-6 bg-white/5 rounded-md w-3/4 shimmer relative overflow-hidden" />
                <div className="h-24 bg-white/5 rounded-md shimmer relative overflow-hidden" />
                <div className="h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md w-full shimmer relative overflow-hidden" />
              </div>
              <div className="flex-1 space-y-3 pl-2">
                <div className="h-6 bg-white/5 rounded-md w-1/2 shimmer relative overflow-hidden" />
                <div className="h-32 bg-white/5 rounded-md w-full shimmer relative overflow-hidden" />
                <div className="flex gap-2">
                  <div className="h-8 bg-white/5 rounded-md w-20 shimmer relative overflow-hidden" />
                  <div className="h-8 bg-white/5 rounded-md w-24 shimmer relative overflow-hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Preset Cards Section */}
      <section className="bg-slate-950/50 border-y border-white/5 py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">Structured Content Workflows</h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Select a preset to immediately pre-fill your content configuration workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentTypes.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.title}
                  href={`/create?type=${item.type}`}
                  className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 block hover:bg-white/10"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-2xl pointer-events-none" />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-violet-400 transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <ChevronRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works section */}
      <section className="container mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Workflow Integration</h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Draft, adjust, and deploy copy in three simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-violet-500/20 -translate-y-1/2 hidden md:block" />
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex flex-col justify-between items-center text-center relative z-10">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold text-lg mb-4">1</div>
            <h3 className="font-bold text-lg">Choose Your Objective</h3>
            <p className="text-slate-400 text-sm mt-2">Pick from 8 different content styles or select a pre-saved prompt from your library.</p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex flex-col justify-between items-center text-center relative z-10">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">2</div>
            <h3 className="font-bold text-lg">Define Parameters</h3>
            <p className="text-slate-400 text-sm mt-2">Specify your target topic, audience, length, tone and language settings or write custom instructions.</p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex flex-col justify-between items-center text-center relative z-10">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-lg mb-4">3</div>
            <h3 className="font-bold text-lg">Refine and Save</h3>
            <p className="text-slate-400 text-sm mt-2">Use in-place AI controls to shorten, expand, or rewrite, then copy or export to history.</p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="bg-slate-950/50 border-t border-white/5 py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">Portfolio Quality Architecture</h2>
            <p className="text-slate-400 mt-3">
              ContentForge is built as a production-quality application with strong developer design patterns.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{feat.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prompt Library Preview */}
      <section className="container mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Prompt Template Library</h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Browser starter presets with automated variable injection inputs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {samplePrompts.map((p) => (
            <div key={p.name} className="p-6 rounded-2xl bg-slate-950 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full inline-block mb-3">{p.cat}</span>
                <h3 className="font-bold text-base text-white">{p.name}</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{p.desc}</p>
              </div>
              <Link 
                href="/prompts" 
                className="mt-6 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/link"
              >
                <span>Browse Prompts</span>
                <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section bottom */}
      <section className="container mx-auto px-6 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-cyan-900/40 border border-white/10 p-8 sm:p-12 text-center relative overflow-hidden neon-glow-primary">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] pointer-events-none rounded-full" />
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Optimize Your Workflows?</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Create an account, build custom reusable prompt templates, check histories, and export premium content drafts using Gemini AI.
            </p>
            <div className="pt-2">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-lg"
              >
                <span>Open Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 relative z-10 container mx-auto px-6">
        <p>&copy; {new Date().getFullYear()} ContentForge AI. Portfolio Showcase built with Next.js, Tailwind CSS & Framer Motion.</p>
      </footer>
    </div>
  );
}
