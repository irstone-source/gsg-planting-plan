import { NextRequest, NextResponse } from 'next/server';
import {
  getMeadowAgentPrompt,
  calculateMeadowPlan,
  type MeadowAgentMessage,
  type MeadowAgentContext
} from '@/lib/agents/dan-pearson-meadow-agent';
import { openrouter, OPENROUTER_MODELS } from '@/lib/openrouter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      context = {}
    }: {
      message: string;
      conversationHistory: MeadowAgentMessage[];
      context: MeadowAgentContext;
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get the agent prompt with context
    const systemPrompt = getMeadowAgentPrompt(conversationHistory, message);

    // Call OpenRouter API (using Claude Sonnet 4)
    const response = await openrouter.chat(
      [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      {
        model: OPENROUTER_MODELS.CLAUDE_SONNET_4,
        max_tokens: 2000,
        temperature: 0.7
      }
    );

    const agentResponse = response.choices[0].message.content;

    // Update conversation history
    const updatedHistory: MeadowAgentMessage[] = [
      ...conversationHistory,
      {
        role: 'user',
        content: message,
        timestamp: new Date()
      },
      {
        role: 'assistant',
        content: agentResponse,
        timestamp: new Date()
      }
    ];

    // Check if we should generate a plan (if user has provided enough context)
    let plan = null;
    if (
      context.area_m2 &&
      context.postcode &&
      context.soil_type &&
      context.sun_exposure
    ) {
      try {
        plan = calculateMeadowPlan(context);
      } catch (error) {
        console.error('Failed to calculate plan:', error);
      }
    }

    return NextResponse.json({
      response: agentResponse,
      conversationHistory: updatedHistory,
      plan,
      usage: {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens
      }
    });

  } catch (error: any) {
    console.error('Agent chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}
