-- Supabase Storage Setup for Plant Evidence System
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Create storage bucket for plant evidence photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plant-evidence',
  'plant-evidence',
  true, -- Public bucket for easy access
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for plant-evidence bucket
CREATE POLICY "Authenticated users can upload evidence"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-evidence');

CREATE POLICY "Anyone can view evidence"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'plant-evidence');

CREATE POLICY "Users can delete own evidence"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'plant-evidence' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Note: Files are organized by user_id/botanical_name/filename.jpg
-- Example: 123e4567-e89b-12d3-a456-426614174000/Betula_pendula/1735689600000-abc123.jpg
