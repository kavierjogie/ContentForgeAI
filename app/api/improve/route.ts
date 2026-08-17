import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, action, tone, instructions } = body;

    if (!content) {
      return NextResponse.json({ error: 'No content provided to refine' }, { status: 400 });
    }

    // Check for user-supplied client key override in headers
    const authHeader = req.headers.get('Authorization') || '';
    let apiKey = '';
    if (authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.replace('Bearer ', '').trim();
    }

    // Fallback to server-side env variable if no header override
    if (!apiKey) {
      apiKey = (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '').trim();
    }

    // Fallback to procedural Mock Refactoring if no API key is active
    if (!apiKey) {
      let refinedText = content;

      if (action === 'shorten') {
        const sentences = content.split(/[.!?]+/);
        // Take the first 50% of the sentences to shorten the output
        const keepCount = Math.max(2, Math.floor(sentences.length / 2));
        refinedText = sentences
          .slice(0, keepCount)
          .map((s: string) => s.trim())
          .filter(Boolean)
          .join('. ') + '.';
        refinedText = `*Shortened Version:*\n\n${refinedText}`;
      } else if (action === 'expand') {
        refinedText = `${content}\n\n### Additional Supporting Details\n*   **Deep-Dive Analysis:** Standard audits suggest expanding this workflow increases clarity by 30%.\n*   **Resource Allocation:** Allocating specialized teams ensures these metrics are monitored consistently.\n*   **Implementation Note:** Adjusting key templates handles edge cases automatically.`;
      } else if (action === 'improve') {
        refinedText = content
          .replace(/gotta/g, 'must')
          .replace(/wanna/g, 'want to')
          .replace(/going to/g, 'intending to');
        refinedText = `*Polished Draft (Grammar & Readability Improved):*\n\n${refinedText}`;
      } else if (action === 'change-tone') {
        const targetTone = tone || 'Professional';
        if (targetTone.toLowerCase() === 'casual') {
          refinedText = `Hey everyone! Just wanted to share some thoughts. ${content.replace(/(Dear Team|Dear Partner|Subject:)/gi, '')}`;
        } else if (targetTone.toLowerCase() === 'professional') {
          refinedText = `Dear Partners,\n\nPlease find the revised correspondence below.\n\n${content}`;
        } else {
          refinedText = `*Adjusted to a ${targetTone} Tone:*\n\n${content}`;
        }
      }

      return NextResponse.json({ content: refinedText, demoMode: true });
    }

    // Build prompting instructions based on selected refactoring action
    let instructionPrompt = '';
    switch (action) {
      case 'shorten':
        instructionPrompt = `Shorten the following text. Make it extremely concise and direct. Keep only the core information: \n\n${content}`;
        break;
      case 'expand':
        instructionPrompt = `Expand the following text. Add relevant details, bullet points, and explanatory depth: \n\n${content}`;
        break;
      case 'change-tone':
        instructionPrompt = `Rewrite the following text so that it reflects a ${tone || 'Professional'} tone. Adapt vocabulary and sentence structure appropriately: \n\n${content}`;
        break;
      case 'improve':
      default:
        instructionPrompt = `Improve the grammar, sentence flow, clarity, and overall readability of the following text. Maintain the markdown formatting structure: \n\n${content}`;
        break;
    }

    if (instructions) {
      instructionPrompt += `\n\nAdditional user guidelines: ${instructions}`;
    }

    const systemPrompt = `You are a professional editor. Rewrite the text according to the user's instructions.
Do not add introductory descriptions like "Here is the rewritten text".
Output ONLY the resulting polished markdown text block.`;

    const refinedText = await generateWithGemini(instructionPrompt, apiKey, systemPrompt);
    return NextResponse.json({ content: refinedText, demoMode: false });

  } catch (error: any) {
    console.error('[API_IMPROVE_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong while refactoring content.' },
      { status: 500 }
    );
  }
}
