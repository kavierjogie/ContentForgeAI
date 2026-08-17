export const generateWithGemini = async (
  prompt: string,
  apiKey: string,
  systemInstruction?: string
): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    ...(systemInstruction ? {
      systemInstruction: {
        parts: [
          {
            text: systemInstruction
          }
        ]
      }
    } : {}),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gemini API returned status ${response.status}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned an empty response or invalid structure.');
  }

  return text;
};
export type { MockOptions } from './mockData';
export { getMockGeneratedContent } from './mockData';
