import { Generation, Prompt, AppSettings, DashboardStats } from '../types';
import { STARTER_PROMPTS } from './prompts/starter';

const KEYS = {
  GENERATIONS: 'contentforge_generations',
  CUSTOM_PROMPTS: 'contentforge_custom_prompts',
  FAVORITE_PROMPTS: 'contentforge_favorite_prompts', // stores IDs of favorited starter prompts
  SETTINGS: 'contentforge_settings'
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultTone: 'Professional',
  defaultLength: 'Medium',
  apiProvider: 'demo',
  apiKeySet: false
};

// Safe localStorage checker for Next.js SSR
const isClient = () => typeof window !== 'undefined';

export const getSettings = (): AppSettings => {
  if (!isClient()) return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to parse settings:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<AppSettings>): AppSettings => {
  const current = getSettings();
  const updated = { ...current, ...settings };
  if (isClient()) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
  }
  return updated;
};

export const getGenerations = (): Generation[] => {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(KEYS.GENERATIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get generations:', e);
    return [];
  }
};

export const saveGeneration = (gen: Generation): Generation[] => {
  const list = getGenerations();
  const index = list.findIndex(g => g.id === gen.id);
  if (index >= 0) {
    list[index] = gen;
  } else {
    list.unshift(gen);
  }
  if (isClient()) {
    localStorage.setItem(KEYS.GENERATIONS, JSON.stringify(list));
  }
  return list;
};

export const deleteGeneration = (id: string): Generation[] => {
  const list = getGenerations().filter(g => g.id !== id);
  if (isClient()) {
    localStorage.setItem(KEYS.GENERATIONS, JSON.stringify(list));
  }
  return list;
};

export const toggleFavoriteGeneration = (id: string): Generation[] => {
  const list = getGenerations().map(g => {
    if (g.id === id) {
      return { ...g, isFavorite: !g.isFavorite };
    }
    return g;
  });
  if (isClient()) {
    localStorage.setItem(KEYS.GENERATIONS, JSON.stringify(list));
  }
  return list;
};

export const getCustomPrompts = (): Prompt[] => {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(KEYS.CUSTOM_PROMPTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get custom prompts:', e);
    return [];
  }
};

export const getFavoritePromptIds = (): string[] => {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(KEYS.FAVORITE_PROMPTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const getPrompts = (): Prompt[] => {
  const custom = getCustomPrompts();
  const favIds = getFavoritePromptIds();
  
  // Merge starter prompts with their local favorite state
  const starters = STARTER_PROMPTS.map(p => ({
    ...p,
    isFavorite: favIds.includes(p.id)
  }));

  return [...starters, ...custom];
};

export const savePrompt = (prompt: Prompt): Prompt[] => {
  if (prompt.isCustom) {
    const custom = getCustomPrompts();
    const index = custom.findIndex(p => p.id === prompt.id);
    if (index >= 0) {
      custom[index] = prompt;
    } else {
      custom.unshift(prompt);
    }
    if (isClient()) {
      localStorage.setItem(KEYS.CUSTOM_PROMPTS, JSON.stringify(custom));
    }
  } else {
    // It is a starter prompt, toggle favorite only
    const favIds = getFavoritePromptIds();
    const alreadyFav = favIds.includes(prompt.id);
    let updated: string[];
    if (prompt.isFavorite) {
      updated = alreadyFav ? favIds : [...favIds, prompt.id];
    } else {
      updated = favIds.filter(id => id !== prompt.id);
    }
    if (isClient()) {
      localStorage.setItem(KEYS.FAVORITE_PROMPTS, JSON.stringify(updated));
    }
  }
  return getPrompts();
};

export const deletePrompt = (id: string): Prompt[] => {
  const custom = getCustomPrompts().filter(p => p.id !== id);
  if (isClient()) {
    localStorage.setItem(KEYS.CUSTOM_PROMPTS, JSON.stringify(custom));
  }
  return getPrompts();
};

export const toggleFavoritePrompt = (id: string): Prompt[] => {
  const prompts = getPrompts();
  const target = prompts.find(p => p.id === id);
  if (!target) return prompts;

  const nextFavoriteState = !target.isFavorite;

  if (target.isCustom) {
    const custom = getCustomPrompts().map(p => {
      if (p.id === id) return { ...p, isFavorite: nextFavoriteState };
      return p;
    });
    if (isClient()) {
      localStorage.setItem(KEYS.CUSTOM_PROMPTS, JSON.stringify(custom));
    }
  } else {
    const favIds = getFavoritePromptIds();
    let updated: string[];
    if (nextFavoriteState) {
      updated = [...favIds, id];
    } else {
      updated = favIds.filter(fId => fId !== id);
    }
    if (isClient()) {
      localStorage.setItem(KEYS.FAVORITE_PROMPTS, JSON.stringify(updated));
    }
  }
  return getPrompts();
};

export const getDashboardStats = (): DashboardStats => {
  const generations = getGenerations();
  const prompts = getPrompts();
  const totalGenerations = generations.length;
  const totalWords = generations.reduce((acc, g) => acc + g.wordCount, 0);
  const savedPrompts = prompts.length;
  const favoritesCount = generations.filter(g => g.isFavorite).length + prompts.filter(p => p.isFavorite).length;

  const typeDistribution: Record<string, number> = {};
  const toneDistribution: Record<string, number> = {};

  generations.forEach(g => {
    typeDistribution[g.contentType] = (typeDistribution[g.contentType] || 0) + 1;
    toneDistribution[g.tone] = (toneDistribution[g.tone] || 0) + 1;
  });

  return {
    totalGenerations,
    totalWords,
    savedPrompts,
    favoritesCount,
    typeDistribution,
    toneDistribution
  };
};
