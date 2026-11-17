/**
 * Cryptographic utilities for VERITAS.
 * Uses the Web Crypto API for client-side SHA-256 generation.
 * Guarantees zero sensitive data or PDFs leave the client browser.
 */

/**
 * Calculates SHA-256 hash of a file using Web Crypto API.
 * @param file The PDF File uploaded by user
 * @returns 0x-prefixed 64-character hex string (compatible with Solidity bytes32)
 */
export async function calculatePdfHash(file: File): Promise<{ hash: string; rawHash: string }> {
  const arrayBuffer = await file.arrayBuffer();
  return calculateBufferHash(arrayBuffer);
}

/**
 * Calculates SHA-256 hash of an ArrayBuffer.
 * @param buffer Raw binary buffer
 * @returns 0x-prefixed 64-character hex string
 */
export async function calculateBufferHash(buffer: ArrayBuffer): Promise<{ hash: string; rawHash: string }> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const rawHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const hash = `0x${rawHash}`;
  return { hash, rawHash };
}

/**
 * Validates whether a string is a valid bytes32 hex string.
 */
export function isValidBytes32(hash: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(hash);
}
