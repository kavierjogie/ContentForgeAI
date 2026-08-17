export interface MockOptions {
  contentType: string;
  topic: string;
  audience: string;
  tone: string;
  length: string;
  language: string;
  instructions?: string;
}

export const getMockGeneratedContent = (options: MockOptions): string => {
  const { contentType, topic, audience, tone, length, language, instructions } = options;
  
  // Clean values
  const t = topic || 'Artificial Intelligence in Modern Workspaces';
  const aud = audience || 'General Professionals';
  const customIns = instructions ? `\n\n*Note: Incorporating special request: "${instructions}"*` : '';

  // Language translations for headings and intro phrases
  const languageHeaders: Record<string, { intro: string; keyPoints: string; conclusion: string; sampleCode: string }> = {
    English: {
      intro: 'Introduction',
      keyPoints: 'Key Takeaways & Details',
      conclusion: 'Conclusion & Action Steps',
      sampleCode: 'Implementation Code'
    },
    Spanish: {
      intro: 'Introducción',
      keyPoints: 'Puntos Clave y Detalles',
      conclusion: 'Conclusión y Próximos Pasos',
      sampleCode: 'Código de Implementación'
    },
    French: {
      intro: 'Introduction',
      keyPoints: 'Points Clés & Détails',
      conclusion: 'Conclusion et Prochaines Étapes',
      sampleCode: 'Code d\'Implémentation'
    },
    Portuguese: {
      intro: 'Introdução',
      keyPoints: 'Pontos Chave e Detalhes',
      conclusion: 'Conclusão e Próximos Passos',
      sampleCode: 'Código de Implementação'
    },
    Afrikaans: {
      intro: 'Inleiding',
      keyPoints: 'Belangrikste Knoopunte',
      conclusion: 'Gevolgtrekking & Aksiestappe',
      sampleCode: 'Implementeringskode'
    },
    isiZulu: {
      intro: 'Isingeniso',
      keyPoints: 'Amaphuzu Abalulekile',
      conclusion: 'Isiphetho nezinyathelo ezilandelayo',
      sampleCode: 'Ikhodi Yokusebenza'
    },
    isiXhosa: {
      intro: 'Intshayelelo',
      keyPoints: 'Amanqaku Ayintloko',
      conclusion: 'Ukuqukumbela kunye namanyathelo alandelayo',
      sampleCode: 'Ikhodi yokuSebenza'
    }
  };

  const h = languageHeaders[language] || languageHeaders.English;

  // Let's generate content based on content type
  if (contentType === 'code') {
    return `## ${h.sampleCode} for: ${t}
    
Below is an optimized implementation resolving the problem for **${aud}** written with a **${tone}** structure.

\`\`\`typescript
/**
 * ContentForge Generated Code
 * Topic: ${t}
 * Target Audience: ${aud}
 */
interface SolutionConfig {
  retries: number;
  timeoutMs: number;
  debugMode: boolean;
}

export class ServiceHandler {
  private config: SolutionConfig;

  constructor(customConfig?: Partial<SolutionConfig>) {
    this.config = {
      retries: 3,
      timeoutMs: 5000,
      debugMode: false,
      ...customConfig
    };
    if (this.config.debugMode) {
      console.log("[ContentForge] Handler initialized with config:", this.config);
    }
  }

  public async processRequest<T>(payload: T): Promise<{ success: boolean; data?: T; error?: string }> {
    let attempts = 0;
    
    while (attempts < this.config.retries) {
      try {
        attempts++;
        if (this.config.debugMode) {
          console.log(\`[ContentForge] Processing attempt \${attempts}...\`);
        }
        
        // Simulating core logic for "${t.replace(/"/g, '\\"')}"
        const result = await this.executeCoreLogic(payload);
        return { success: true, data: result };
        
      } catch (err: any) {
        console.warn(\`[ContentForge] Error occurred on attempt \${attempts}:\`, err.message);
        if (attempts >= this.config.retries) {
          return { success: false, error: err.message || "Failed after maximum retries" };
        }
        // Exponential backoff
        await new Promise(res => setTimeout(res, Math.pow(2, attempts) * 100));
      }
    }
    
    return { success: false, error: "Unexpected execution failure" };
  }

  private async executeCoreLogic<T>(input: T): Promise<T> {
    // Implement requirements specifically for ${aud}
    return new Promise((resolve) => setTimeout(() => resolve(input), 150));
  }
}
\`\`\`

### Explanation:
1. **Configurable Execution:** Custom handler configurations support easy retry intervals and timeout limits.
2. **Exponential Backoff:** Built-in sleep duration prevents overloading backend APIs during momentary disconnects.
3. **TypeScript Safety:** Strongly typed structures ensure type check verification passes compiling pipelines.${customIns}`;
  }

  if (contentType === 'email') {
    return `Subject: Direct Update: Thoughts on ${t}

Dear Team / Partner,

I hope this message finds you well. Writing to share some essential ideas and insights on **${t}**, specifically tailored for our focus on **${aud}**. 

Given our current trajectory, it is crucial that we maintain a **${tone}** tone as we navigate this transition. Here are the core objectives:

*   **Key Focus area:** Address the immediate needs of **${aud}** ensuring that resources are distributed efficiently.
*   **Workflow Optimization:** Align internal guidelines and automate repetitive documentation so we can accelerate output.
*   **Review Session:** Schedule a retrospective to evaluate what strategies work best and adjust where needed.

Please review this outline and share your feedback. We want to execute this correctly and incorporate any specific notes. Let's touch base during our weekly sync on Wednesday to align on the next steps.

Best regards,
[ContentForge Creator]
${customIns}`;
  }

  if (contentType === 'social') {
    return `🚀 Let's talk about **${t}**! 

If you are a part of **${aud}**, this is something you cannot afford to ignore. Over the past few months, we've seen a massive shift in how these processes are managed, and adapting quickly is the secret to staying ahead.

Here is what you need to know today:
1️⃣ **Audience Alignment:** Always keep the needs of **${aud}** at the center of your strategies.
2️⃣ **Tone Consistency:** Keep conversations **${tone}** and engaging.
3️⃣ **Continuous Refinement:** Track feedback and update templates regularly.

What are your thoughts on this change? Are you seeing similar trends? Let me know in the comments below! 👇

#${contentType} #${tone} #ContentForge #Innovation #WorkplaceTrends ${customIns}`;
  }

  if (contentType === 'product') {
    return `# Introducing: ${t} - The Future of Content Creation

Are you tired of spending hours crafting the perfect messaging? Meet **${t}**, the ultimate solution designed specifically for **${aud}**.

Whether you're looking to create engaging copy, clean technical guides, or high-converting promotions, our tool helps you maintain a **${tone}** tone that resonates perfectly with your target audience.

### Why Choose Us?
*   **Custom Tailored:** Adjusts parameters to fit **${aud}** requirements.
*   **Highly Performant:** Instant output saves up to 80% of manual editing time.
*   **Flexible Framework:** Works across multiple languages (including ${language}) and tones.

Get started today and experience the difference yourself!
${customIns}`;
  }

  if (contentType === 'summary') {
    return `## Executive Summary: ${t}
**Audience Focus:** ${aud} | **Refinement Level:** ${tone}

### 📋 Overview
This summary synthesizes the primary themes and operational developments surrounding **${t}** with a focus on delivering value to **${aud}**.

### 🔑 Critical Takeaways
*   **Primary Driver:** Transitioning to digital-first workspaces increases the demand for reliable automated assets.
*   **Bottleneck:** Inconsistent tones and lengths often reduce content engagement.
*   **Recommendation:** Apply targeted guidelines and dynamic templates to standardize drafts across channels.

### 💡 Conclusion
By executing a structured approach, organizations can save time while maintaining high quality standards. Let's move forward with these action items.
${customIns}`;
  }

  // Fallback for 'blog', 'marketing', 'custom', or default
  const wordCountMultiplier = length === 'Short' ? 1 : length === 'Long' ? 3 : 2;
  const paragraphCount = length === 'Short' ? 2 : length === 'Long' ? 5 : 3;

  let body = `# ${t}\n\n`;
  
  body += `### 1. ${h.intro}\n`;
  body += `In modern environments, discussing **${t}** has transitioned from a minor talking point into a major industry focal point. For members of **${aud}**, understanding how to implement and respond to this shifting landscape is key to sustainable progress. By approaching this topic with a **${tone}** focus, we can discover new opportunities for growth and resolve critical blockages.\n\n`;

  if (paragraphCount >= 3) {
    body += `### 2. ${h.keyPoints}\n`;
    body += `When tailoring this implementation specifically for **${aud}**, a few operational considerations must be taken into account. First, we need to guarantee that resources are accessible and clearly documented. Second, the style of delivery must remain **${tone}** to ensure clarity and professional alignment. Finally, regular audits should be performed to measure effectiveness and address any changing requirements.\n\n`;
    body += `*   **Accessibility:** Structuring files with screen-reader friendly variables and semantic HTML layouts.\n`;
    body += `*   **Performance:** Minimizing API latency using lightweight, client-side persistence strategies.\n`;
    body += `*   **Aesthetics:** Implementing glassmorphic cards and subtle animations to elevate the user experience.\n\n`;
  }

  if (paragraphCount >= 4) {
    body += `### 3. Deeper Analysis\n`;
    body += `Furthermore, looking into historical data reveals that organizations using template-driven workflows experience a 40% reduction in review cycles. By using predefined prompts with customized variables (like topic and audience), creators can generate consistent emails, blog posts, and marketing descriptions in a fraction of the time.\n\n`;
  }

  body += `### 4. ${h.conclusion}\n`;
  body += `In conclusion, staying ahead requires an ongoing commitment to refining prompts, building reusable prompt libraries, and maintaining an organized workspace. By implementing the suggestions detailed above, you can ensure your content remains highly engaging, accessible, and aligned with your goals. Let's start building for the future today.`;

  body += customIns;

  return body;
};
