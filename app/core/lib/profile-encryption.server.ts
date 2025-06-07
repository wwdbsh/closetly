/**
 * Profile URL Encryption System (Global Version)
 * 
 * This module provides secure encryption/decryption functions for generating
 * user-friendly URLs while protecting internal profile IDs.
 * 
 * Key Features:
 * - Name-less slugs for global compatibility
 * - SHA-256 hash-based encryption for security
 * - URL-safe Base64 encoding
 * - Deterministic encryption for consistent URLs
 * - Support for multilingual names (Korean, English, Chinese, etc.)
 */

import { createHash } from "crypto";
import db from "~/core/db/drizzle-client.server";

// Configuration
const CONFIG = {
  SECRET_KEY: process.env.PROFILE_ENCRYPT_KEY || 'default-32-char-secret-key-change-me!',
  SLUG_LENGTH: 16, // Increased length for better uniqueness without names
} as const;

/**
 * Validates that the encryption key is properly configured
 * Should be called during application startup
 */
export function validateEncryptionKey(): boolean {
  if (!process.env.PROFILE_ENCRYPT_KEY) {
    console.warn('⚠️  PROFILE_ENCRYPT_KEY not set. Using default key (not secure for production)');
    return false;
  }
  
  if (process.env.PROFILE_ENCRYPT_KEY.length < 32) {
    console.error('❌ PROFILE_ENCRYPT_KEY must be at least 32 characters');
    return false;
  }
  
  return true;
}

/**
 * Encrypts a profile UUID into a URL-safe short string
 * 
 * @param uuid - The profile UUID to encrypt
 * @returns URL-safe encrypted string (16 characters)
 */
export function encryptProfileId(uuid: string): string {
  try {
    // Create a deterministic hash using the secret key and UUID
    const combined = `${CONFIG.SECRET_KEY}:${uuid}`;
    const hash = createHash('sha256').update(combined).digest('hex');
    
    // Convert to URL-safe Base64 and trim to desired length
    const urlSafe = Buffer.from(hash, 'hex')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, CONFIG.SLUG_LENGTH);
    
    return urlSafe;
  } catch (error) {
    console.error('Profile encryption error:', error);
    throw new Error('Failed to encrypt profile ID');
  }
}

/**
 * Finds a profile UUID by matching encrypted slug against all counselors
 * 
 * @param encryptedSlug - The encrypted slug from URL
 * @returns The matching profile UUID or null
 */
export async function decryptProfileId(encryptedSlug: string): Promise<string | null> {
  try {
    // Import Drizzle ORM and use raw SQL to avoid schema import issues
    const { sql } = await import("drizzle-orm");
    
    // Query all counselors to test against the encrypted slug
    const counselors = await db.execute(
      sql`SELECT profile_id FROM profiles WHERE role = 'counselor' LIMIT 1000`
    );
    
    // Test each counselor to see if their encrypted ID matches
    for (const counselor of counselors) {
      const testEncrypted = encryptProfileId(counselor.profile_id as string);
      if (testEncrypted === encryptedSlug) {
        return counselor.profile_id as string;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Profile decryption error:', error);
    return null;
  }
}

/**
 * Generates a complete profile URL slug using only encrypted ID
 * 
 * @param counselor - Counselor object with profile_id
 * @returns URL slug string (e.g., "a7b8c9d2e4f5x1y2")
 */
export function generateProfileSlug(counselor: { profile_id: string }): string {
  return encryptProfileId(counselor.profile_id);
}

/**
 * Parses a profile slug and extracts counselor information
 * 
 * @param slug - Complete URL slug (e.g., "a7b8c9d2e4f5x1y2")
 * @returns Object with profile_id, or null if invalid
 */
export async function getCounselorFromSlug(slug: string): Promise<{
  profile_id: string;
} | null> {
  try {
    // Validate slug format (should be 16 characters, alphanumeric with - and _)
    if (!isValidSlugFormat(slug)) {
      throw new Error('Invalid slug format');
    }
    
    // Decrypt the profile ID directly
    const profileId = await decryptProfileId(slug);
    if (!profileId) {
      return null;
    }
    
    return {
      profile_id: profileId,
    };
  } catch (error) {
    console.error('Slug parsing error:', error);
    return null;
  }
}

/**
 * Validates that a slug is properly formatted for global use
 * 
 * @param slug - The slug to validate
 * @returns true if valid format
 */
export function isValidSlugFormat(slug: string): boolean {
  // Should be exactly 16 characters, alphanumeric with - and _
  const pattern = /^[A-Za-z0-9_-]{16}$/;
  return pattern.test(slug);
}

/**
 * Batch generation of slugs for existing counselors
 * Useful for migration or bulk operations
 * 
 * @returns Array of generated slugs with their corresponding profile IDs
 */
export async function generateSlugsForAllCounselors(): Promise<Array<{
  profile_id: string;
  name: string;
  slug: string;
}>> {
  try {
    const { sql } = await import("drizzle-orm");
    
    const result = await db.execute(
      sql`SELECT profile_id, name FROM profiles WHERE role = 'counselor'`
    );
    
    return result.map((counselor: any) => ({
      profile_id: counselor.profile_id,
      name: counselor.name,
      slug: generateProfileSlug({
        profile_id: counselor.profile_id
      }),
    }));
  } catch (error) {
    console.error('Error generating slugs for all counselors:', error);
    return [];
  }
}

// Type definitions for better TypeScript support
export type CounselorSlugData = {
  profile_id: string;
};

export type ProfileSlugResult = CounselorSlugData | null;
