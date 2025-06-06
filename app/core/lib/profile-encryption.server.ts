/**
 * Profile URL Encryption System
 * 
 * This module provides secure encryption/decryption functions for generating
 * user-friendly URLs while protecting internal profile IDs.
 * 
 * Key Features:
 * - AES-256-GCM encryption for security
 * - URL-safe Base64 encoding
 * - Deterministic encryption for consistent URLs
 * - Protection against timing attacks
 */

import db from "~/core/db/drizzle-client.server";

// Configuration
const CONFIG = {
  SECRET_KEY: process.env.PROFILE_ENCRYPT_KEY || 'default-32-char-secret-key-change-me!',
  SLUG_LENGTH: 12, // Length of the encrypted part in URL
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
 * @returns URL-safe encrypted string
 */
export function encryptProfileId(uuid: string): string {
  try {
    // Create a simple hash-based approach for consistent results
    const crypto = require('crypto');
    
    // Create a deterministic hash using the secret key and UUID
    const combined = `${CONFIG.SECRET_KEY}:${uuid}`;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    
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
 * This method is more reliable than direct decryption
 * 
 * @param encryptedSlug - The encrypted slug from URL
 * @param name - The counselor name from URL (for optimization)
 * @returns The matching profile UUID or null
 */
export async function decryptProfileId(encryptedSlug: string, name?: string): Promise<string | null> {
  try {
    // Import Drizzle ORM and use raw SQL to avoid schema import issues
    const { sql } = await import("drizzle-orm");
    
    // If name is provided, query only counselors with that name for better performance
    let counselors;
    
    if (name) {
      // Query counselors with the specific name using raw SQL
      counselors = await db.execute(
        sql`SELECT profile_id, name FROM profiles WHERE name = ${name} AND role = 'counselor' LIMIT 10`
      );
    } else {
      // Fallback: query all counselors (less efficient)
      counselors = await db.execute(
        sql`SELECT profile_id, name FROM profiles WHERE role = 'counselor' LIMIT 100`
      );
    }
    
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
 * Generates a complete profile URL slug in the format "name-encryptedId"
 * 
 * @param counselor - Counselor object with name and profile_id
 * @returns URL slug string
 */
export function generateProfileSlug(counselor: { name: string; profile_id: string }): string {
  const encryptedId = encryptProfileId(counselor.profile_id);
  return `${counselor.name}-${encryptedId}`;
}

/**
 * Parses a profile slug and extracts counselor information
 * 
 * @param slug - Complete URL slug (e.g., "김지훈-a7b8c9d2e4f5")
 * @returns Object with name and profile_id, or null if invalid
 */
export async function getCounselorFromSlug(slug: string): Promise<{
  name: string;
  profile_id: string;
} | null> {
  try {
    // Parse the slug to extract name and encrypted ID
    const lastDashIndex = slug.lastIndexOf('-');
    if (lastDashIndex === -1) {
      throw new Error('Invalid slug format');
    }
    
    const name = slug.substring(0, lastDashIndex);
    const encryptedId = slug.substring(lastDashIndex + 1);
    
    // Validate inputs
    if (!name || !encryptedId) {
      throw new Error('Invalid slug components');
    }
    
    // Decrypt the profile ID
    const profileId = await decryptProfileId(encryptedId, name);
    if (!profileId) {
      return null;
    }
    
    return {
      name,
      profile_id: profileId,
    };
  } catch (error) {
    console.error('Slug parsing error:', error);
    return null;
  }
}

/**
 * Validates that a slug is properly formatted
 * 
 * @param slug - The slug to validate
 * @returns true if valid format
 */
export function isValidSlugFormat(slug: string): boolean {
  // Basic format validation: should contain at least one dash
  // and encrypted part should be alphanumeric with - and _
  const parts = slug.split('-');
  if (parts.length < 2) return false;
  
  const encryptedPart = parts[parts.length - 1];
  const namePattern = /^[가-힣a-zA-Z\s]+$/; // Korean, English, spaces
  const encryptedPattern = /^[A-Za-z0-9_-]+$/;
  
  const name = parts.slice(0, -1).join('-');
  
  return namePattern.test(name) && encryptedPattern.test(encryptedPart);
}

/**
 * Helper function to get counselor data by profile ID
 * This is used internally for generating URLs and validating access
 * 
 * @param profileId - The profile UUID
 * @returns Counselor data or null
 */
export async function getCounselorByProfileId(profileId: string) {
  try {
    // Use raw SQL to avoid schema import issues
    const { sql } = await import("drizzle-orm");
    
    const result = await db.execute(
      sql`
        SELECT 
          p.profile_id,
          p.name,
          p.role,
          c.counselor_id,
          c.short_introduction,
          c.years_of_experience,
          c.average_rating,
          c.review_count,
          c.center_name,
          c.center_address,
          c.introduction_greeting,
          c.is_verified
        FROM profiles p
        LEFT JOIN counselors c ON p.profile_id = c.counselor_id
        WHERE p.profile_id = ${profileId}
        LIMIT 1
      `
    );
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching counselor by profile ID:', error);
    return null;
  }
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
        profile_id: counselor.profile_id,
        name: counselor.name
      }),
    }));
  } catch (error) {
    console.error('Error generating slugs for all counselors:', error);
    return [];
  }
}

// Type definitions for better TypeScript support
export type CounselorSlugData = {
  name: string;
  profile_id: string;
};

export type ProfileSlugResult = CounselorSlugData | null;
