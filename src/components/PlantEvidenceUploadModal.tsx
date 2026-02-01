'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PlantEvidenceUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botanicalName: string;
  wfoId?: string;
}

type EvidenceType = 'leaf' | 'bark' | 'habit' | 'winter' | 'flower' | 'fruit' | 'overall';

export function PlantEvidenceUploadModal({
  open,
  onOpenChange,
  botanicalName,
  wfoId
}: PlantEvidenceUploadModalProps) {
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('overall');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [season, setSeason] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setUploadError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image file');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      // Upload to API
      const response = await fetch('/api/plant/evidence/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botanical_name: botanicalName,
          wfo_id: wfoId,
          evidence_type: evidenceType,
          image_data: base64Data,
          metadata: {
            season: season || undefined,
            location: location || undefined,
            date_taken: new Date().toISOString(),
            notes: notes || undefined
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 2000);

    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload evidence');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEvidenceType('overall');
    setSeason('');
    setLocation('');
    setNotes('');
    setUploadSuccess(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Plant Evidence</DialogTitle>
          <DialogDescription>
            Help improve the accuracy of <strong>{botanicalName}</strong> rendering by uploading reference photos.
            Your contribution will be verified and may be used to refine botanical parameters.
          </DialogDescription>
        </DialogHeader>

        {uploadSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Evidence Uploaded!</h3>
            <p className="text-gray-600">
              Your evidence will be verified and reviewed by our team.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Evidence Type Selector */}
            <div>
              <Label htmlFor="evidence-type">Evidence Type</Label>
              <select
                id="evidence-type"
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="overall">Overall Habit</option>
                <option value="leaf">Leaf Detail</option>
                <option value="bark">Bark Texture</option>
                <option value="winter">Winter Interest</option>
                <option value="flower">Flower</option>
                <option value="fruit">Fruit/Berry</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select the type of evidence you're uploading
              </p>
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="file-upload">Photo Upload</Label>
              <div className="mt-1">
                {!selectedFile ? (
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP (max 10MB)</p>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <div className="relative">
                        <button
                          onClick={removeFile}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                        {previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-md"
                          />
                        )}
                        <p className="text-sm text-gray-600 mt-2 truncate">
                          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Optional Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="season">Season (Optional)</Label>
                <Input
                  id="season"
                  type="text"
                  placeholder="e.g., Spring, Summer"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., RHS Wisley"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional observations about this specimen..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            )}
          </div>
        )}

        {!uploadSuccess && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Evidence
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
