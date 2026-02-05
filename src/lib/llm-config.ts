/**
 * LLM Provider Configuration
 * Central place to configure which LLM providers and models to use
 */

import { OPENROUTER_MODELS } from './openrouter';

export type LLMProvider = 'openrouter' | 'anthropic' | 'openai';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  temperature: number;
  max_tokens: number;
}

// Default configurations for different use cases
export const LLM_CONFIGS = {
  // Meadow Agent - conversational, creative
  MEADOW_AGENT: {
    provider: 'openrouter' as LLMProvider,
    model: OPENROUTER_MODELS.CLAUDE_SONNET_4,
    temperature: 0.7,
    max_tokens: 2000,
  },

  // Plan Generation - structured, precise
  PLAN_GENERATION: {
    provider: 'openrouter' as LLMProvider,
    model: OPENROUTER_MODELS.CLAUDE_SONNET_4,
    temperature: 0.5,
    max_tokens: 4096,
  },

  // Vision Analysis - detailed, analytical
  VISION_ANALYSIS: {
    provider: 'openrouter' as LLMProvider,
    model: OPENROUTER_MODELS.CLAUDE_SONNET_4,
    temperature: 0.3,
    max_tokens: 2048,
  },

  // Plant Recommendations - balanced
  PLANT_RECOMMENDATIONS: {
    provider: 'openrouter' as LLMProvider,
    model: OPENROUTER_MODELS.CLAUDE_35_SONNET,
    temperature: 0.6,
    max_tokens: 3000,
  },

  // Fast/Cheap tasks - use smaller models
  FAST: {
    provider: 'openrouter' as LLMProvider,
    model: OPENROUTER_MODELS.GPT35_TURBO,
    temperature: 0.5,
    max_tokens: 1000,
  },
} as const;

// Cost tracking (approximate, per 1M tokens)
export const MODEL_COSTS = {
  [OPENROUTER_MODELS.CLAUDE_SONNET_4]: {
    input: 3.00,
    output: 15.00,
  },
  [OPENROUTER_MODELS.CLAUDE_OPUS_4]: {
    input: 15.00,
    output: 75.00,
  },
  [OPENROUTER_MODELS.CLAUDE_35_SONNET]: {
    input: 3.00,
    output: 15.00,
  },
  [OPENROUTER_MODELS.GPT4_TURBO]: {
    input: 10.00,
    output: 30.00,
  },
  [OPENROUTER_MODELS.GPT35_TURBO]: {
    input: 0.50,
    output: 1.50,
  },
  [OPENROUTER_MODELS.GEMINI_FLASH]: {
    input: 0.10,
    output: 0.30,
  },
};

/**
 * Calculate approximate cost for a generation
 */
export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const costs = MODEL_COSTS[model];
  if (!costs) return 0;

  const promptCost = (promptTokens / 1_000_000) * costs.input;
  const completionCost = (completionTokens / 1_000_000) * costs.output;

  return promptCost + completionCost;
}
