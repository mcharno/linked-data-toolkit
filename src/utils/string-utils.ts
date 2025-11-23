/**
 * String utility functions
 */

/**
 * Makes a string URL-safe by encoding special characters
 * Note: Modern implementations should use URLSearchParams or encodeURIComponent,
 * but this maintains compatibility with the original implementation
 */
export function makeURLSafe(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Validates if a string is a valid URI
 */
export function isValidUri(uri: string): boolean {
  try {
    new URL(uri);
    return true;
  } catch {
    return false;
  }
}
