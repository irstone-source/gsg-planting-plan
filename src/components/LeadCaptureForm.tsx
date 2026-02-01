'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LeadCaptureFormProps {
  type: 'pricing' | 'designer' | 'partner' | 'affiliate';
  title: string;
  description?: string;
}

export function LeadCaptureForm({ type, title, description }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-copper/10 border border-copper/30 p-8 text-center"
      >
        <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
          REQUEST RECEIVED
        </h3>
        <p className="text-stone">
          We&apos;ll be in touch within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8"
    >
      <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-stone mb-8">
          {description}
        </p>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-wider text-stone mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            aria-required="true"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-dark/50 border border-white/10 px-4 py-3 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none transition-colors"
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wider text-stone mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            aria-required="true"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-dark/50 border border-white/10 px-4 py-3 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none transition-colors"
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs uppercase tracking-wider text-stone mb-2">
            Message (Optional)
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-dark/50 border border-white/10 px-4 py-3 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none transition-colors resize-none"
            disabled={status === 'submitting'}
          />
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          style={{ position: 'absolute', left: '-9999px' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {status === 'error' && (
          <p role="alert" className="text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-busy={status === 'submitting'}
          className="w-full bg-copper text-dark py-4 text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] focus:ring-2 focus:ring-copper/50 focus:outline-none transition-colors disabled:opacity-50"
        >
          {status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
        </button>
      </div>
    </motion.form>
  );
}
