/**
 * Google Gemini API Client
 * Direct integration with Google's Gemini models
 * https://ai.google.dev/docs
 */

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface GeminiOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export const GEMINI_MODELS = {
  PRO: 'gemini-pro',
  PRO_VISION: 'gemini-pro-vision',
  FLASH: 'gemini-1.5-flash',
  PRO_15: 'gemini-1.5-pro',
  ULTRA: 'gemini-ultra',
};

export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }
  }

  async generateContent(
    prompt: string,
    systemInstruction?: string,
    options: GeminiOptions = {}
  ): Promise<GeminiResponse> {
    const {
      model = GEMINI_MODELS.PRO,
      temperature = 0.7,
      maxOutputTokens = 4096,
      topP = 0.95,
      topK = 40,
    } = options;

    const body: any = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens,
        topP,
        topK,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  async chat(
    messages: GeminiMessage[],
    options: GeminiOptions = {}
  ): Promise<string> {
    const {
      model = GEMINI_MODELS.PRO,
      temperature = 0.7,
      maxOutputTokens = 4096,
      topP = 0.95,
      topK = 40,
    } = options;

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role,
            parts: msg.parts,
          })),
          generationConfig: {
            temperature,
            maxOutputTokens,
            topP,
            topK,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Helper: Simple completion with optional system instruction
   */
  async complete(
    prompt: string,
    systemInstruction?: string,
    options?: GeminiOptions
  ): Promise<string> {
    const response = await this.generateContent(prompt, systemInstruction, options);
    return response.candidates[0].content.parts[0].text;
  }
}

export const gemini = new GeminiClient();
