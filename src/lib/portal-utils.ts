import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

// Generate a unique share ID (8 characters, URL-safe)
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

export function generateShareId(): string {
  return nanoid();
}

// Hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify a password against a hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Check if a share link has expired
export function isLinkExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

// Calculate expiry date from now
export function calculateExpiryDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
