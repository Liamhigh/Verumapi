/**
 * Password Service
 * Generates cryptographically secure passwords
 */

/**
 * Generate a cryptographically secure random password
 * @param length The length of the password to generate (default: 68)
 * @returns A secure random password string
 */
export function generateSecurePassword(length: number = 68): string {
  // Use uppercase, lowercase, numbers, and special characters
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Combine all character sets
  const allChars = uppercase + lowercase + numbers + special;
  
  // Use crypto.getRandomValues for cryptographically secure random numbers
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  let password = '';
  
  // Ensure at least one character from each category
  const categories = [uppercase, lowercase, numbers, special];
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const randomIndex = randomValues[i] % category.length;
    password += category[randomIndex];
  }
  
  // Fill the rest with random characters from all sets
  for (let i = categories.length; i < length; i++) {
    const randomIndex = randomValues[i] % allChars.length;
    password += allChars[randomIndex];
  }
  
  // Shuffle the password to avoid predictable patterns
  return shuffleString(password, randomValues);
}

/**
 * Shuffle a string using Fisher-Yates algorithm with provided random values
 * @param str The string to shuffle
 * @param randomValues Cryptographically secure random values
 * @returns Shuffled string
 */
function shuffleString(str: string, randomValues: Uint32Array): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomValues[i] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}
