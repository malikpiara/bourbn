/**
 * Standardizes spacing in text by:
 * - Removing leading and trailing whitespace
 * - Replacing multiple spaces between words with a single space
 *
 * This helps create consistent text formatting regardless of how
 * users enter their input.
 *
 * @example
 * cleanSpaces("  hello   world  ")  // returns "hello world"
 */
export function cleanSpaces(text: string): string {
  if (!text?.trim()) {
    return '';
  }

  return text.trim().replace(/\s+/g, ' ');
}
