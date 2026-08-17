export interface Generation {
  id: string;
  contentType: string; // 'blog' | 'email' | 'social' | 'marketing' | 'product' | 'code' | 'summary' | 'custom'
  title: string;
  prompt: string;
  generatedContent: string;
  tone: string;
  wordCount: number;
  charCount: number;
  createdAt: string;
  isFavorite?: boolean;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string; // 'Writing' | 'Marketing' | 'Business' | 'Coding' | 'Education' | 'Productivity' | 'Social Media' | 'Career' | 'Custom'
  template: string;
  variables: string[];
  tags: string[];
  isFavorite?: boolean;
  isCustom?: boolean;
  createdAt?: string;
  exampleUse?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultTone: string;
  defaultLength: 'Short' | 'Medium' | 'Long';
  apiProvider: 'gemini' | 'demo';
  apiKeySet: boolean;
}

export interface DashboardStats {
  totalGenerations: number;
  totalWords: number;
  savedPrompts: number;
  favoritesCount: number;
  typeDistribution: Record<string, number>;
  toneDistribution: Record<string, number>;
}
