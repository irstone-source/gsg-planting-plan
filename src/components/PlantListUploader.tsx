'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle, Loader2, FileText } from 'lucide-react';

export function PlantListUploader() {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      // Upload and parse CSV
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload-plant-list', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      setResult(uploadData);
      setUploading(false);

      // Auto-start generation
      if (uploadData.plants && uploadData.plants.length > 0) {
        await startGeneration(uploadData.plants);
      }

    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadRes = await fetch('/api/parse-plant-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Parse failed');
      }

      setResult(uploadData);
      setUploading(false);

      // Auto-start generation
      if (uploadData.plants && uploadData.plants.length > 0) {
        await startGeneration(uploadData.plants);
      }

    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  const startGeneration = async (plants: any[]) => {
    setGenerating(true);
    setError(null);

    try {
      const genRes = await fetch('/api/generate-plant-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plants }),
      });

      const genData = await genRes.json();

      if (!genRes.ok) {
        throw new Error(genData.error || 'Generation failed');
      }

      setResult((prev: any) => ({ ...prev, generation: genData }));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Text Input Method */}
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Paste Plant List</h3>
        </div>

        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste your plant list here, one per line:
Betula pendula, Silver Birch, tree
Viburnum tinus, Laurustinus, shrub
Alchemilla mollis, Lady's Mantle, perennial"
          className="w-full h-32 p-3 border rounded-lg text-sm font-mono resize-none"
          disabled={uploading || generating}
        />

        <Button
          onClick={handleTextSubmit}
          disabled={uploading || generating || !textInput.trim()}
          className="mt-3"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate from Text
            </>
          )}
        </Button>
      </div>

      {/* File Upload Method */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="flex flex-col items-center gap-4">
          <Upload className="h-12 w-12 text-gray-400" />

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Or Upload CSV File</h3>
            <p className="text-sm text-gray-600 mb-4">
              CSV format: scientific name, common name, type
            </p>
          </div>

        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          disabled={uploading || generating}
          className="hidden"
          id="plant-list-upload"
        />

        <label htmlFor="plant-list-upload">
          <Button
            disabled={uploading || generating}
            className="cursor-pointer"
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Images...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </>
              )}
            </span>
          </Button>
        </label>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="w-full bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-900">
                Upload Successful
              </span>
            </div>
            <p className="text-sm text-gray-700">
              {result.count} plants uploaded
            </p>
            {result.generation && (
              <p className="text-sm text-gray-700 mt-2">
                Generating {result.generation.plantCount * 3} images
                (est. {result.generation.estimatedTime} minutes)
              </p>
            )}
          </div>
        )}

          <div className="text-xs text-gray-500 mt-4">
            <p className="font-semibold mb-1">Expected CSV format:</p>
            <code className="bg-gray-100 px-2 py-1 rounded block">
              scientific name,common name,type<br/>
              Betula pendula,Silver Birch,tree<br/>
              Viburnum tinus,Laurustinus,shrub
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
