import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export { anthropic };

// Helper type for vision messages
export interface VisionMessage {
  role: 'user' | 'assistant';
  content: Array<{
    type: 'image' | 'text';
    source?: {
      type: 'base64';
      media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
      data: string;
    };
    text?: string;
  }>;
}

/**
 * Analyze images using Claude Vision
 */
export async function analyzeImages(
  images: Array<{ data: string; mediaType: string }>,
  prompt: string
): Promise<string> {
  const imageContent = images.map(img => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
      data: img.data,
    },
  }));

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          ...imageContent,
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  // Extract text from response
  const textContent = message.content.find(block => block.type === 'text');
  if (textContent && textContent.type === 'text') {
    return textContent.text;
  }

  throw new Error('No text response from Claude');
}

/**
 * Generate text completion using Claude
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: options?.maxTokens || 2048,
    temperature: options?.temperature || 1.0,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const textContent = message.content.find(block => block.type === 'text');
  if (textContent && textContent.type === 'text') {
    return textContent.text;
  }

  throw new Error('No text response from Claude');
}
