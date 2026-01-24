
import { GoogleGenAI, Type } from "@google/genai";
import { LegalAdvice, ClarificationQuestion, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Naija Legal Buddy, a world-class legal assistant for Nigeria. 
Your goal is to provide clear, simplified, and practical legal guidance based on Nigerian Law.
You must:
1. Use Nigerian legal frameworks (Constitution, Tenancy Laws, Police Act, Labour Act, etc.).
2. Speak clearly, avoiding complex jargon where possible, or explaining it.
3. Be culturally aware of Nigeria.
4. Always provide specific steps a person can take.
5. Use Google Search grounding to ensure you have the most up-to-date information on Nigerian regulations.

CRITICAL INSTRUCTION: 
The user's preferred language is provided. You MUST respond ENTIRELY in that language (e.g., if Hausa, respond in Hausa; if Pidgin, respond in Pidgin). 
However, official names of laws (e.g., "Constitution of the Federal Republic of Nigeria") should be mentioned in English first, followed by a translation if appropriate.
`;

export const analyzeSituation = async (
  situation: string, 
  language: Language = 'English',
  history: string[] = []
): Promise<{
  needsClarification?: ClarificationQuestion;
  advice?: LegalAdvice;
}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `Language Preference: ${language}\nSituation: ${situation}\nPrevious Context: ${history.join('\n')}` }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            needsClarification: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['question', 'options']
            },
            advice: {
              type: Type.OBJECT,
              properties: {
                explanation: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                laws: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      section: { type: Type.STRING },
                      link: { type: Type.STRING }
                    },
                    required: ['title', 'section']
                  }
                },
                templates: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      content: { type: Type.STRING }
                    }
                  }
                },
                contacts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      info: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Add grounding URLs if available
    if (result.advice && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const urls = response.candidates[0].groundingMetadata.groundingChunks
        .map(chunk => chunk.web?.uri)
        .filter((url): url is string => !!url);
      result.advice.groundingUrls = Array.from(new Set(urls));
    }

    return result;
  } catch (error) {
    console.error("Error analyzing situation:", error);
    throw error;
  }
};
