import { supabase } from './supabase';

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: string = 'site-images'
): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
  };
}

/**
 * Convert File to base64 string for Claude Vision
 * Works in both browser and Node.js (server) environments
 */
export async function fileToBase64(file: File): Promise<string> {
  // Server-side (Node.js) - convert File to Buffer then to base64
  if (typeof window === 'undefined') {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer.toString('base64');
  }

  // Browser-side - use FileReader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Convert Buffer to base64 string
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * Get media type from file
 */
export function getMediaType(file: File): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
  const type = file.type.toLowerCase();

  if (type === 'image/png') return 'image/png';
  if (type === 'image/gif') return 'image/gif';
  if (type === 'image/webp') return 'image/webp';

  // Default to jpeg for jpg, jpeg, and unknown types
  return 'image/jpeg';
}

/**
 * Delete image from storage
 */
export async function deleteImage(
  path: string,
  bucket: string = 'site-images'
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Upload multiple images and return their URLs
 */
export async function uploadImages(
  files: File[],
  bucket: string = 'site-images'
): Promise<Array<{ url: string; path: string }>> {
  const uploadPromises = files.map(file => uploadImage(file, bucket));
  return Promise.all(uploadPromises);
}
