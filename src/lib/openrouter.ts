/**
 * OpenRouter API Client
 * Provides unified access to multiple LLM providers
 * https://openrouter.ai/docs
 */

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
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

export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

// Available models through OpenRouter
export const OPENROUTER_MODELS = {
  // Anthropic Claude models
  CLAUDE_SONNET_4: 'anthropic/claude-sonnet-4',
  CLAUDE_OPUS_4: 'anthropic/claude-opus-4',
  CLAUDE_35_SONNET: 'anthropic/claude-3.5-sonnet',

  // OpenAI models
  GPT4_TURBO: 'openai/gpt-4-turbo',
  GPT4: 'openai/gpt-4',
  GPT35_TURBO: 'openai/gpt-3.5-turbo',

  // Google models
  GEMINI_PRO: 'google/gemini-pro',
  GEMINI_FLASH: 'google/gemini-flash-1.5',

  // Meta models
  LLAMA_3_70B: 'meta-llama/llama-3-70b-instruct',
  LLAMA_3_8B: 'meta-llama/llama-3-8b-instruct',

  // Mistral models
  MISTRAL_LARGE: 'mistralai/mistral-large',
  MISTRAL_MEDIUM: 'mistralai/mistral-medium',
};

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }

  async chat(
    messages: OpenRouterMessage[],
    options: OpenRouterOptions = {}
  ): Promise<OpenRouterResponse> {
    const {
      model = OPENROUTER_MODELS.CLAUDE_SONNET_4,
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
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://plantingplans.co.uk',
        'X-Title': 'PlantingPlans',
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
      throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Helper: Send a single prompt and get a response
   */
  async complete(
    prompt: string,
    systemPrompt?: string,
    options?: OpenRouterOptions
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
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
    conversationHistory: OpenRouterMessage[],
    newMessage: string,
    options?: OpenRouterOptions
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

  /**
   * Check available models and pricing
   */
  async getModels() {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    return response.json();
  }

  /**
   * Get generation costs
   */
  async getGeneration(generationId: string) {
    const response = await fetch(`${this.baseUrl}/generation?id=${generationId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch generation info');
    }

    return response.json();
  }
}

// Export singleton instance
export const openrouter = new OpenRouterClient();
