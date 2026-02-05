/**
 * OpenAI API Client
 * Direct integration with OpenAI models
 * https://platform.openai.com/docs/api-reference
 */

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
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

export interface OpenAIOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export const OPENAI_MODELS = {
  GPT4_TURBO: 'gpt-4-turbo-preview',
  GPT4: 'gpt-4',
  GPT4_32K: 'gpt-4-32k',
  GPT35_TURBO: 'gpt-3.5-turbo',
  GPT35_TURBO_16K: 'gpt-3.5-turbo-16k',
  O1_PREVIEW: 'o1-preview',
  O1_MINI: 'o1-mini',
};

export class OpenAIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';

    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }

  async chat(
    messages: OpenAIMessage[],
    options: OpenAIOptions = {}
  ): Promise<OpenAIResponse> {
    const {
      model = OPENAI_MODELS.GPT4_TURBO,
      temperature = 0.7,
      max_tokens = 4096,
      top_p = 1,
      frequency_penalty = 0,
      presence_penalty = 0,
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
        frequency_penalty,
        presence_penalty,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Helper: Simple completion with optional system message
   */
  async complete(
    prompt: string,
    systemMessage?: string,
    options?: OpenAIOptions
  ): Promise<string> {
    const messages: OpenAIMessage[] = [];

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
    conversationHistory: OpenAIMessage[],
    newMessage: string,
    options?: OpenAIOptions
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

export const openaiClient = new OpenAIClient();
