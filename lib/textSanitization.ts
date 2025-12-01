/**
 * Text sanitization utilities for PDF extraction
 */

/**
 * Sanitizes extracted text by removing control characters and invalid Unicode
 * while preserving line breaks and paragraph structure
 * @param text - The raw extracted text
 * @returns Sanitized text
 */
export function sanitizeExtractedText(text: string): string {
  if (!text) {
    return '';
  }

  // Remove control characters except for newlines, carriage returns, and tabs
  // Control characters are in the range \x00-\x1F and \x7F-\x9F
  // We preserve: \n (0x0A), \r (0x0D), \t (0x09)
  let sanitized = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

  // Remove invalid Unicode characters (replacement character and other problematic ones)
  sanitized = sanitized.replace(/\uFFFD/g, ''); // Replacement character
  sanitized = sanitized.replace(/[\uFFF0-\uFFFF]/g, ''); // Specials block

  // Normalize line breaks to \n
  sanitized = sanitized.replace(/\r\n/g, '\n');
  sanitized = sanitized.replace(/\r/g, '\n');

  // Remove excessive consecutive newlines (more than 2) to preserve paragraph structure
  // but avoid huge gaps
  sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n');

  // Trim leading and trailing whitespace
  sanitized = sanitized.trim();

  return sanitized;
}
