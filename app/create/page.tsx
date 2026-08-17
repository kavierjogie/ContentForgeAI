'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GeneratorForm from '@/components/generator-form';
import ContentEditor from '@/components/content-editor';
import { 
  getSettings, 
  saveGeneration, 
  getGenerations, 
  getPrompts 
} from '@/lib/storage';
import { Generation, Prompt } from '@/types';
import { Sparkles, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';

function CreateContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Router query params
  const typeParam = searchParams.get('type');
  const templateIdParam = searchParams.get('templateId');
  const editIdParam = searchParams.get('id');

  // Input states
  const [contentType, setContentType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [language, setLanguage] = useState('English');
  const [instructions, setInstructions] = useState('');
  const [prompt, setPrompt] = useState('');

  // Editor states
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Active Generation Meta
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');

  // Interval reference for streaming cleanup
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load from search parameters or default settings on mount
  useEffect(() => {
    const settings = getSettings();
    setContentType(settings.defaultLanguage ? 'blog' : 'blog'); // default type
    setTone(settings.defaultTone || 'Professional');
    setLength(settings.defaultLength || 'Medium');
    setLanguage(settings.defaultLanguage || 'English');

    // Case 1: Pre-fill content type from landing page grid
    if (typeParam) {
      setContentType(typeParam);
    }

    // Case 2: Load existing generation from history to edit/view
    if (editIdParam) {
      const historyList = getGenerations();
      const existing = historyList.find(g => g.id === editIdParam);
      if (existing) {
        setContentType(existing.contentType);
        setTopic(existing.title);
        setGeneratedContent(existing.generatedContent);
        setTone(existing.tone);
        setLanguage(existing.language);
        setCurrentGenerationId(existing.id);
        setCurrentTitle(existing.title);
        setIsSaved(true);
      }
    }

    // Case 3: Pre-fill a template prompt from library
    if (templateIdParam) {
      const prompts = getPrompts();
      const promptTemplate = prompts.find(p => p.id === templateIdParam);
      if (promptTemplate) {
        setInstructions(promptTemplate.template);
        setContentType(promptTemplate.category.toLowerCase() === 'coding' ? 'code' : 'blog');
      }
    }
  }, [typeParam, templateIdParam, editIdParam]);

  // Clean up streaming timers on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // Utility to simulate typing progress
  const typeTextOut = (fullText: string, onProgress: (text: string) => void, onDone: () => void) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    
    let currentText = '';
    const words = fullText.split(' ');
    let index = 0;

    streamIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        onProgress(currentText);
        index++;
      } else {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        onDone();
      }
    }, 35); // 35ms per word
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedContent('');
    setIsSaved(false);

    const settings = getSettings();
    const payload = {
      contentType,
      topic,
      audience,
      tone,
      length,
      language,
      instructions,
      prompt
    };

    try {
      if (settings.apiProvider === 'demo' || !settings.apiKeySet) {
        // Run client-side high-fidelity Demo Mode generator
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, forceDemo: true })
        });
        const resJson = await response.json();
        if (!response.ok) throw new Error(resJson.error || 'Failed to fetch content');

        typeTextOut(
          resJson.content, 
          (text) => setGeneratedContent(text),
          () => {
            setIsLoading(false);
            // Auto save to history
            const words = resJson.content.trim().split(/\s+/).filter(Boolean).length;
            const newGen: Generation = {
              id: Math.random().toString(36).substring(2, 11),
              contentType,
              title: topic,
              prompt,
              generatedContent: resJson.content,
              tone,
              language,
              wordCount: words,
              charCount: resJson.content.length,
              createdAt: new Date().toISOString()
            };
            saveGeneration(newGen);
            setCurrentGenerationId(newGen.id);
            setCurrentTitle(newGen.title);
            setIsSaved(true);
            window.dispatchEvent(new Event('storage-update'));
          }
        );
      } else {
        // Run live API call
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resJson = await response.json();
        if (!response.ok) throw new Error(resJson.error || 'Failed to generate content');

        typeTextOut(
          resJson.content,
          (text) => setGeneratedContent(text),
          () => {
            setIsLoading(false);
            const words = resJson.content.trim().split(/\s+/).filter(Boolean).length;
            const newGen: Generation = {
              id: Math.random().toString(36).substring(2, 11),
              contentType,
              title: topic,
              prompt,
              generatedContent: resJson.content,
              tone,
              language,
              wordCount: words,
              charCount: resJson.content.length,
              createdAt: new Date().toISOString()
            };
            saveGeneration(newGen);
            setCurrentGenerationId(newGen.id);
            setCurrentTitle(newGen.title);
            setIsSaved(true);
            window.dispatchEvent(new Event('storage-update'));
          }
        );
      }
    } catch (e: any) {
      alert(`Error generating content: ${e.message || 'Check network connection'}`);
      setIsLoading(false);
    }
  };

  const handleImproveAction = async (actionType: string, options?: string) => {
    if (!generatedContent) return;
    setIsActionLoading(true);

    const payload = {
      content: generatedContent,
      action: actionType,
      tone: options || tone,
      instructions: instructions
    };

    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resJson = await response.json();
      if (!response.ok) throw new Error(resJson.error || 'Failed to refine content');

      typeTextOut(
        resJson.content,
        (text) => setGeneratedContent(text),
        () => {
          setIsActionLoading(false);
          setIsSaved(false); // mark dirty so user can re-save the updated text
        }
      );
    } catch (e: any) {
      alert(`Failed to refine text: ${e.message}`);
      setIsActionLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    
    const words = generatedContent.trim().split(/\s+/).filter(Boolean).length;
    const newGen: Generation = {
      id: currentGenerationId || Math.random().toString(36).substring(2, 11),
      contentType,
      title: topic || currentTitle || 'Untitled Generation',
      prompt,
      generatedContent,
      tone,
      language,
      wordCount: words,
      charCount: generatedContent.length,
      createdAt: new Date().toISOString()
    };

    saveGeneration(newGen);
    setCurrentGenerationId(newGen.id);
    setCurrentTitle(newGen.title);
    setIsSaved(true);
    window.dispatchEvent(new Event('storage-update'));
    alert('Generation successfully saved to History!');
  };

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-350 transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Two-Panel Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Form config (5 cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Layers size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Workspace Configuration</h3>
              <p className="text-[10px] text-slate-500">Fine-tune the parameters sent to the AI builder.</p>
            </div>
          </div>
          <GeneratorForm
            contentType={contentType}
            setContentType={setContentType}
            topic={topic}
            setTopic={setTopic}
            audience={audience}
            setAudience={setAudience}
            tone={tone}
            setTone={setTone}
            length={length}
            setLength={setLength}
            language={language}
            setLanguage={setLanguage}
            instructions={instructions}
            setInstructions={setInstructions}
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Right Editor Output (7 cols) */}
        <div className="lg:col-span-7 h-full">
          <ContentEditor
            content={generatedContent}
            setContent={setGeneratedContent}
            onImproveAction={handleImproveAction}
            isActionLoading={isActionLoading || isLoading}
            onSave={handleSave}
            isSaved={isSaved}
          />
        </div>

      </div>

    </div>
  );
}

export default function CreateContent() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    }>
      <CreateContentInner />
    </Suspense>
  );
}
