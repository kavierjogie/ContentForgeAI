import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/ai/gemini';
import { getMockGeneratedContent } from '@/lib/ai/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      contentType, 
      topic, 
      audience, 
      tone, 
      length, 
      language, 
      instructions, 
      prompt,
      forceDemo 
    } = body;

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

    // Force demo or fallback to demo if no key is configured
    if (forceDemo || !apiKey) {
      const mockText = getMockGeneratedContent({
        contentType,
        topic,
        audience,
        tone,
        length,
        language,
        instructions
      });
      return NextResponse.json({ content: mockText, demoMode: true });
    }

    // Compile system prompt
    const systemPrompt = `You are an expert content creation assistant. Generate clear, useful, accurate, and professional content based on the user's requirements.
Follow the requested tone, audience, language, and format constraints.
Write the output directly in the requested language (${language}).
Do not add meta-commentary, introduction intros (like "Sure, here is your content"), or unnecessary conversational fluff unless requested.
Format the output with clean markdown headings and structural grids where appropriate.`;

    // Call live Gemini 1.5 Flash API
    const generatedText = await generateWithGemini(prompt || topic, apiKey, systemPrompt);
    return NextResponse.json({ content: generatedText, demoMode: false });

  } catch (error: any) {
    console.error('[API_GENERATE_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong while generating content. Please try again.' },
      { status: 500 }
    );
  }
}
