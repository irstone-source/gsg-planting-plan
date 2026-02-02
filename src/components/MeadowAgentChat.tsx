'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Info } from 'lucide-react';
import type { MeadowAgentMessage, MeadowAgentContext } from '@/lib/agents/dan-pearson-meadow-agent';

interface MeadowAgentChatProps {
  onPlanGenerated?: (plan: any) => void;
}

export function MeadowAgentChat({ onPlanGenerated }: MeadowAgentChatProps) {
  const [messages, setMessages] = useState<MeadowAgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<MeadowAgentContext>({});
  const [showContextForm, setShowContextForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send greeting on first load
  useEffect(() => {
    if (messages.length === 0) {
      handleSendMessage('Hello, I\'d like to create a meadow', true);
    }
  }, []);

  const handleSendMessage = async (messageText?: string, isGreeting = false) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/agents/meadow/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages,
          context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      setMessages(data.conversationHistory);

      // If plan was generated, notify parent
      if (data.plan && onPlanGenerated) {
        onPlanGenerated(data.plan);
      }

    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'user',
          content: textToSend,
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContextUpdate = (updates: Partial<MeadowAgentContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  };

  const hasRequiredContext = Boolean(
    context.area_m2 &&
    context.postcode &&
    context.soil_type &&
    context.sun_exposure
  );

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-dark border border-white/10">
      {/* Header */}
      <div className="bg-concrete/60 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-moss/20 rounded-sm flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-moss" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-sm uppercase tracking-wider text-mist font-bold">
              Dan Pearson Meadow Agent
            </h3>
            <p className="text-xs text-stone">
              Naturalistic planting expert
            </p>
          </div>
          {hasRequiredContext && (
            <span className="px-2 py-1 bg-moss/20 border border-moss/30 text-moss text-xs uppercase tracking-wider rounded-sm">
              Context Complete
            </span>
          )}
        </div>
      </div>

      {/* Context Form (Collapsible) */}
      {showContextForm && (
        <div className="bg-concrete/40 border-b border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-copper" />
              <span className="text-xs uppercase tracking-wider text-copper font-bold">
                Garden Context
              </span>
            </div>
            <button
              onClick={() => setShowContextForm(false)}
              className="text-xs text-stone hover:text-mist transition-colors"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone block mb-1">
                Area (m²)
              </label>
              <input
                type="number"
                value={context.area_m2 || ''}
                onChange={(e) => handleContextUpdate({ area_m2: parseInt(e.target.value) })}
                placeholder="50"
                className="w-full px-3 py-2 bg-dark/50 border border-white/10 text-mist text-sm focus:border-copper focus:ring-1 focus:ring-copper/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-stone block mb-1">
                UK Postcode
              </label>
              <input
                type="text"
                value={context.postcode || ''}
                onChange={(e) => handleContextUpdate({ postcode: e.target.value.toUpperCase() })}
                placeholder="SW1A 1AA"
                className="w-full px-3 py-2 bg-dark/50 border border-white/10 text-mist text-sm uppercase focus:border-copper focus:ring-1 focus:ring-copper/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-stone block mb-1">
                Soil Type
              </label>
              <select
                value={context.soil_type || 'unknown'}
                onChange={(e) => handleContextUpdate({ soil_type: e.target.value as any })}
                className="w-full px-3 py-2 bg-dark/50 border border-white/10 text-mist text-sm focus:border-copper focus:ring-1 focus:ring-copper/50 focus:outline-none"
              >
                <option value="unknown">Not Sure</option>
                <option value="clay">Clay</option>
                <option value="loam">Loam</option>
                <option value="sand">Sand</option>
                <option value="chalk">Chalk</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-stone block mb-1">
                Sun Exposure
              </label>
              <select
                value={context.sun_exposure || ''}
                onChange={(e) => handleContextUpdate({ sun_exposure: e.target.value as any })}
                className="w-full px-3 py-2 bg-dark/50 border border-white/10 text-mist text-sm focus:border-copper focus:ring-1 focus:ring-copper/50 focus:outline-none"
              >
                <option value="">Select...</option>
                <option value="full_sun">Full Sun (6+ hours)</option>
                <option value="partial_shade">Partial Shade (3-6 hours)</option>
                <option value="full_shade">Full Shade (&lt;3 hours)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-sm ${
                msg.role === 'user'
                  ? 'bg-copper/20 border border-copper/30 text-mist'
                  : 'bg-concrete/60 border border-white/10 text-stone'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </p>
              <span className="text-xs opacity-50 mt-2 block">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-concrete/60 border border-white/10 px-4 py-3 rounded-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-copper animate-spin" />
              <span className="text-sm text-stone">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        {!showContextForm && !hasRequiredContext && (
          <button
            onClick={() => setShowContextForm(true)}
            className="w-full mb-3 px-3 py-2 bg-moss/20 border border-moss/30 text-moss text-xs uppercase tracking-wider hover:bg-moss/30 transition-colors"
          >
            Provide Garden Context
          </button>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Ask about your meadow..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none touch-manipulation"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-copper text-dark hover:bg-[#D4A373] transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-stone/70 mt-2 text-center">
          Agent bound by Dan Pearson philosophy + UK planting rules
        </p>
      </div>
    </div>
  );
}
