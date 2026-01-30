'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

interface LeadFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder: string;
  required?: boolean;
  options?: string[]; // for select fields
}

interface LeadFormProps {
  type: 'pricing' | 'partner' | 'designer' | 'affiliate' | 'supplier';
  fields: LeadFormField[];
  title: string;
  description: string;
}

export function LeadForm({ type, fields, title, description }: LeadFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState(''); // spam protection
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) {
      console.log('Bot detected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          ...formData,
          created_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({});
      } else {
        const data = await response.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
        <CardContent className="pt-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            Thank you for your interest!
          </h3>
          <p className="text-gray-700 mb-4">
            We've received your submission and will reply within 1–2 business days.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
          >
            Submit Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-8">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: 'absolute', left: '-9999px' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">
                {field.label} {field.required && <span className="text-red-600">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full p-3 border rounded-md"
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">-- Select --</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
