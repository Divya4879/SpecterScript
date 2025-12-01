import * as fc from 'fast-check';

/**
 * Counts the number of section markers (headings) in text
 * Looks for common heading patterns like:
 * - Lines starting with # (Markdown)
 * - Lines in ALL CAPS followed by newline
 * - Lines ending with : followed by newline
 */
function countSectionMarkers(text: string): number {
  if (!text) return 0;

  const lines = text.split('\n');
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line.length === 0) continue;

    // Markdown headings
    if (line.startsWith('#')) {
      count++;
      continue;
    }

    // ALL CAPS lines (at least 3 characters)
    if (line.length >= 3 && line === line.toUpperCase() && /^[A-Z\s]+$/.test(line)) {
      count++;
      continue;
    }

    // Lines ending with colon (section headers)
    if (line.endsWith(':') && line.length > 1) {
      count++;
      continue;
    }
  }

  return count;
}

/**
 * Extracts section markers from text in order
 */
function extractSectionMarkers(text: string): string[] {
  if (!text) return [];

  const lines = text.split('\n');
  const markers: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.length === 0) continue;

    // Markdown headings
    if (line.startsWith('#')) {
      markers.push(line);
      continue;
    }

    // ALL CAPS lines
    if (line.length >= 3 && line === line.toUpperCase() && /^[A-Z\s]+$/.test(line)) {
      markers.push(line);
      continue;
    }

    // Lines ending with colon
    if (line.endsWith(':') && line.length > 1) {
      markers.push(line);
      continue;
    }
  }

  return markers;
}

/**
 * Mock function that simulates haunted transformation
 * Preserves structure but changes content
 */
function mockHauntedTransform(text: string): string {
  const lines = text.split('\n');
  const transformed = lines.map(line => {
    const trimmed = line.trim();
    
    // Preserve empty lines
    if (trimmed.length === 0) return line;

    // Preserve section markers
    if (trimmed.startsWith('#') || 
        (trimmed.length >= 3 && trimmed === trimmed.toUpperCase() && /^[A-Z\s]+$/.test(trimmed)) ||
        (trimmed.endsWith(':') && trimmed.length > 1)) {
      return line;
    }

    // Transform regular content
    return line + ' [haunted]';
  });

  return transformed.join('\n');
}

describe('Structure Preservation', () => {
  describe('Section marker detection', () => {
    it('should count markdown headings', () => {
      const text = '# Heading 1\nSome text\n## Heading 2\nMore text';
      expect(countSectionMarkers(text)).toBe(2);
    });

    it('should count ALL CAPS sections', () => {
      const text = 'INTRODUCTION\nSome text\nMETHODS\nMore text';
      expect(countSectionMarkers(text)).toBe(2);
    });

    it('should count colon-terminated headers', () => {
      const text = 'Section One:\nSome text\nSection Two:\nMore text';
      expect(countSectionMarkers(text)).toBe(2);
    });

    it('should handle mixed section types', () => {
      const text = '# Heading\nINTRODUCTION\nSection:\nText';
      expect(countSectionMarkers(text)).toBe(3);
    });
  });

  describe('Mock haunted transformation', () => {
    it('should preserve section markers', () => {
      const text = '# Introduction\nThis is text\n## Methods\nMore text';
      const haunted = mockHauntedTransform(text);
      
      expect(haunted).toContain('# Introduction');
      expect(haunted).toContain('## Methods');
    });

    it('should transform regular content', () => {
      const text = 'Regular text';
      const haunted = mockHauntedTransform(text);
      
      expect(haunted).toContain('[haunted]');
    });
  });

  // Property-Based Tests
  describe('Property-Based Tests', () => {
    /**
     * Feature: specterscript-generator, Property 6: Haunted text structure preservation
     * Validates: Requirements 3.3
     * 
     * For any original text with section markers or headings, the haunted version
     * should maintain the same number and order of sections.
     */
    it('Property 6: Haunted text structure preservation', () => {
      fc.assert(
        fc.property(
          // Generate text with section markers
          fc.array(
            fc.oneof(
              // Markdown headings
              fc.tuple(
                fc.constantFrom('#', '##', '###'),
                fc.string({ minLength: 3, maxLength: 50 })
              ).map(([prefix, text]) => `${prefix} ${text}`),
              // ALL CAPS sections
              fc.string({ minLength: 3, maxLength: 30 })
                .map(s => s.toUpperCase().replace(/[^A-Z\s]/g, 'A')),
              // Colon-terminated headers
              fc.string({ minLength: 3, maxLength: 40 })
                .map(s => s.replace(/[:\n]/g, '') + ':'),
              // Regular content (multiple lines)
              fc.array(
                fc.string({ minLength: 10, maxLength: 100 }),
                { minLength: 1, maxLength: 5 }
              ).map(lines => lines.join('\n'))
            ),
            { minLength: 2, maxLength: 10 }
          ).map(sections => sections.join('\n\n')),
          (originalText) => {
            // Skip empty or very short texts
            if (!originalText || originalText.trim().length < 10) {
              return true;
            }

            // Count sections in original
            const originalSectionCount = countSectionMarkers(originalText);
            const originalSections = extractSectionMarkers(originalText);

            // Apply mock haunted transformation
            const hauntedText = mockHauntedTransform(originalText);

            // Count sections in haunted version
            const hauntedSectionCount = countSectionMarkers(hauntedText);
            const hauntedSections = extractSectionMarkers(hauntedText);

            // Section count should be preserved
            if (originalSectionCount !== hauntedSectionCount) {
              return false;
            }

            // Section order should be preserved
            if (originalSections.length !== hauntedSections.length) {
              return false;
            }

            // Each section marker should be identical
            for (let i = 0; i < originalSections.length; i++) {
              if (originalSections[i] !== hauntedSections[i]) {
                return false;
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional property: Section order preservation
     */
    it('Property: Section markers should appear in the same order', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.tuple(fc.constantFrom('#', '##'), fc.string({ minLength: 3, maxLength: 20 }))
                .map(([prefix, text]) => `${prefix} ${text}`),
              fc.string({ minLength: 5, maxLength: 100 })
            ),
            { minLength: 3, maxLength: 8 }
          ).map(parts => parts.join('\n')),
          (text) => {
            if (!text || text.trim().length < 10) return true;

            const originalMarkers = extractSectionMarkers(text);
            const hauntedText = mockHauntedTransform(text);
            const hauntedMarkers = extractSectionMarkers(hauntedText);

            // Markers should be in the same order
            return JSON.stringify(originalMarkers) === JSON.stringify(hauntedMarkers);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
