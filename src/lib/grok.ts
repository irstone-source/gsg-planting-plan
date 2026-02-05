/**
 * Grok (xAI) API Client
 * Direct integration with xAI's Grok models
 * https://docs.x.ai/api
 */

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GrokOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export const GROK_MODELS = {
  GROK_BETA: 'grok-beta',
  GROK_2: 'grok-2-1212',
  GROK_2_VISION: 'grok-2-vision-1212',
};

export class GrokClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROK_API_KEY || '';
    this.baseUrl = 'https://api.x.ai/v1';

    if (!this.apiKey) {
      throw new Error('Grok API key is required');
    }
  }

  async chat(
    messages: GrokMessage[],
    options: GrokOptions = {}
  ): Promise<GrokResponse> {
    const {
      model = GROK_MODELS.GROK_2,
      temperature = 0.7,
      max_tokens = 4096,
      top_p = 1,
      stream = false,
    } = options;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        stream,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Grok API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Helper: Simple completion with optional system message
   */
  async complete(
    prompt: string,
    systemMessage?: string,
    options?: GrokOptions
  ): Promise<string> {
    const messages: GrokMessage[] = [];

    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.chat(messages, options);
    return response.choices[0].message.content;
  }

  /**
   * Helper: Continue a conversation
   */
  async continue(
    conversationHistory: GrokMessage[],
    newMessage: string,
    options?: GrokOptions
  ): Promise<string> {
    const messages = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: newMessage,
      },
    ];

    const response = await this.chat(messages, options);
    return response.choices[0].message.content;
  }
}

export const grok = new GrokClient();
