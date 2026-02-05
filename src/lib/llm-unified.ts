/**
 * Unified LLM Client
 * Routes to appropriate provider based on configuration
 */

import { openrouter, OPENROUTER_MODELS } from './openrouter';
import { gemini, GEMINI_MODELS } from './gemini';
import { openaiClient, OPENAI_MODELS } from './openai-client';
import { grok, GROK_MODELS } from './grok';

export type LLMProvider = 'openrouter' | 'gemini' | 'openai' | 'grok';

export interface UnifiedMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface UnifiedResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  provider: LLMProvider;
}

export interface UnifiedOptions {
  provider: LLMProvider;
  model: string;
  temperature?: number;
  max_tokens?: number;
}

export class UnifiedLLMClient {
  /**
   * Send a chat completion to any provider
   */
  async chat(
    messages: UnifiedMessage[],
    options: UnifiedOptions
  ): Promise<UnifiedResponse> {
    const { provider, model, temperature = 0.7, max_tokens = 4096 } = options;

    switch (provider) {
      case 'openrouter': {
        const response = await openrouter.chat(
          messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          { model, temperature, max_tokens }
        );

        return {
          content: response.choices[0].message.content,
          usage: {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          },
          model: response.model,
          provider: 'openrouter',
        };
      }

      case 'openai': {
        const response = await openaiClient.chat(
          messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          { model, temperature, max_tokens }
        );

        return {
          content: response.choices[0].message.content,
          usage: {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          },
          model: response.model,
          provider: 'openai',
        };
      }

      case 'grok': {
        const response = await grok.chat(
          messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          { model, temperature, max_tokens }
        );

        return {
          content: response.choices[0].message.content,
          usage: {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          },
          model: response.model,
          provider: 'grok',
        };
      }

      case 'gemini': {
        // Gemini has different message format
        const systemMessage = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');

        const geminiMessages = userMessages.map(msg => ({
          role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
          parts: [{ text: msg.content }],
        }));

        const content = await gemini.chat(geminiMessages, {
          model,
          temperature,
          maxOutputTokens: max_tokens,
        });

        return {
          content,
          usage: {
            prompt_tokens: 0, // Gemini doesn't return token counts in same way
            completion_tokens: 0,
            total_tokens: 0,
          },
          model,
          provider: 'gemini',
        };
      }

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Helper: Simple completion with system message
   */
  async complete(
    prompt: string,
    systemMessage: string,
    options: UnifiedOptions
  ): Promise<string> {
    const messages: UnifiedMessage[] = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt },
    ];

    const response = await this.chat(messages, options);
    return response.content;
  }
}

// Export singleton
export const llm = new UnifiedLLMClient();

// Export all model constants for convenience
export { OPENROUTER_MODELS, GEMINI_MODELS, OPENAI_MODELS, GROK_MODELS };
