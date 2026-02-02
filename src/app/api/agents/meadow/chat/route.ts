import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getMeadowAgentPrompt,
  calculateMeadowPlan,
  type MeadowAgentMessage,
  type MeadowAgentContext
} from '@/lib/agents/dan-pearson-meadow-agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

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

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const agentResponse = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

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
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
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
