/**
 * List of words that should remain lowercase when they appear
 * in the middle of a phrase. These are common Portuguese prepositions
 * and articles that traditionally stay lowercase in proper names
 * and addresses.
 */
const LOWERCASE_WORDS = new Set(['de', 'dos', 'da', 'das', 'do']);

/**
 * Capitalizes text while preserving specific formatting rules:
 * - Keeps ALL CAPS words (like "LED" or "USB") unchanged
 * - Keeps certain Portuguese prepositions lowercase when in the middle
 * - Capitalizes all other words normally
 *
 * Examples:
 * "rua de oliveira" → "Rua de Oliveira"
 * "joão dos santos" → "João dos Santos"
 * "de silva" → "De Silva" (capitalized because it's at the start)
 * "casa LED dos santos" → "Casa LED dos Santos"
 *
 * @param text - The input string to be transformed
 * @returns The transformed string with appropriate capitalization
 */
export function capitalizeWithPreserve(text: string): string {
  // Handle empty or whitespace-only strings
  if (!text?.trim()) {
    return text;
  }

  // Split the text into words
  const words = text.split(' ');

  return words
    .map((word, index) => {
      // Skip empty strings (handles multiple spaces)
      if (!word) return word;

      // If the word is all uppercase and longer than one letter,
      // assume it's an acronym or intentionally capitalized
      if (word === word.toUpperCase() && word.length > 1) {
        return word;
      }

      // Convert word to lowercase for comparison
      const lowerWord = word.toLowerCase();

      // Check if this word should remain lowercase
      // Only apply this rule if it's not the first word
      if (index > 0 && LOWERCASE_WORDS.has(lowerWord)) {
        return lowerWord;
      }

      // Otherwise, capitalize only the first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
