# ContentForge AI

ContentForge AI is a premium, portfolio-grade content creation workspace built using Next.js, React, TypeScript, and Tailwind CSS. It is designed to demonstrate full-stack excellence, clean state management, modular components, and solid prompt engineering principles.

## Features

1.  **Dual-Panel AI Content Generator:** Customize target content type, topic, audience, tone, length, and language, and inspect or edit the compiled prompt in real-time.
2.  **Rich Text Refactoring:** Modify output drafts in-place with dedicated secondary AI actions (Improve grammar, Shorten, Expand, or Change Tone).
3.  **Variable-Injected Prompt Library:** Store starter templates and custom prompts. Templates with bracketed variables like `[RECIPIENT_NAME]` automatically generate input forms in a modal before redirecting to the workspace.
4.  **Generation History:** Retrieve, copy, edit, or delete past content generations stored inside local workspace caches.
5.  **Analytics Dashboard:** Monitor total generations, words produced, favorite metrics, and visualize content-type distributions with responsive SVG bar charts.
6.  **Aesthetics & Dark Mode:** Sleek dark-mode-first glassmorphism, glowing borders, smooth transitions, custom scrollbars, and full layout responsiveness.
7.  **Robust Demo Mode Fallback:** Functions out-of-the-box without requiring an API key. It detects if no key is present and streams realistic, topic-tailored content procedurally.

## Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (utility-first glassmorphic themes)
*   **State Management:** React Hooks + LocalStorage synchronization
*   **Icons:** Lucide React
*   **Animations:** Framer Motion

## Folder Architecture

```text
contentforge-ai/
  app/
    layout.tsx                  # Global theme context & SEO
    page.tsx                    # Interactive marketing landing page
    dashboard/
      page.tsx                  # Welcome dashboard with SVG charts
    create/
      page.tsx                  # Content generator workspace
    prompts/
      page.tsx                  # Category prompt library & builder
    history/
      page.tsx                  # Paginated drafts search log
    favorites/
      page.tsx                  # Favorites lists tabs
    settings/
      page.tsx                  # Theme, presets, and API settings
    api/
      generate/
        route.ts                # Content generation endpoint
      improve/
        route.ts                # In-place refactoring endpoint
  components/
    layout-wrapper.tsx          # Conditional layout shell manager
    sidebar.tsx                 # Responsive mobile drawer navigation
    header.tsx                  # Theme toggle & demo status banner
    generator-form.tsx          # Left panel input settings configuration
    content-editor.tsx          # Right panel editor and AI actions
    prompt-card.tsx             # Reusable card with duplicate controls
  lib/
    ai/
      gemini.ts                 # Direct fetch wrapper for Gemini 1.5 Flash
      mockData.ts               # Procedural demo data generator
    prompts/
      starter.ts                # 18 pre-seeded prompt library templates
    storage.ts                  # Local database helpers
    utils.ts                    # Utility class names merging & formatter
  types/
    index.ts                    # Shared TypeScript interface declarations
```

## Installation & Setup

1.  Navigate into the project workspace:
    ```bash
    cd contentforge-ai
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables by copying the example environment file:
    ```bash
    cp .env.example .env.local
    ```
4.  Run the development server locally:
    ```bash
    npm run dev
    ```

## Environment Variables

To make live AI requests to Google's Gemini models, create a `.env.local` file in the root of the project with your API key:

```env
# Google Gemini API Key (recommended for live mode)
GEMINI_API_KEY=your_gemini_api_key_here
```

If no key is configured, the application automatically activates **Demo Mode** and simulates text streaming client-side.
