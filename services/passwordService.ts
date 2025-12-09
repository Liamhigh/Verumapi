/**
 * Password Service
 * Generates cryptographically secure Base64-encoded secrets
 */

/**
 * Generate a cryptographically secure Base64-encoded secret
 * @param length The length of the Base64 string to generate (default: 68)
 * @returns A secure Base64-encoded random string
 */
export function generateSecurePassword(length: number = 68): string {
  // Validate minimum length
  if (length < 1) {
    throw new Error('Secret length must be at least 1 character');
  }
  
  // Calculate how many random bytes we need
  // Base64 encoding produces 4 characters for every 3 bytes
  // To get exactly 'length' characters, we need: (length * 3) / 4 bytes
  // We'll generate extra and then trim to exact length
  const bytesNeeded = Math.ceil((length * 3) / 4);
  
  // Generate cryptographically secure random bytes
  const randomBytes = new Uint8Array(bytesNeeded);
  crypto.getRandomValues(randomBytes);
  
  // Convert to Base64 using Array.from to avoid stack overflow with spread operator
  const base64 = btoa(Array.from(randomBytes, byte => String.fromCharCode(byte)).join(''));
  
  // Remove any padding characters (=) and trim to exact length
  let result = base64.replace(/=/g, '');
  
  // If we have more characters than needed, trim to exact length
  if (result.length > length) {
    result = result.substring(0, length);
  } else if (result.length < length) {
    // If we need more characters, generate additional bytes
    while (result.length < length) {
      const additionalBytes = new Uint8Array(3);
      crypto.getRandomValues(additionalBytes);
      const additionalB64 = btoa(Array.from(additionalBytes, byte => String.fromCharCode(byte)).join('')).replace(/=/g, '');
      result += additionalB64;
    }
    result = result.substring(0, length);
  }
  
  return result;
}
