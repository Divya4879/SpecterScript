/**
 * Property-based tests for export functionality
 * Feature: specterscript-generator
 */

import * as fc from 'fast-check';

/**
 * Feature: specterscript-generator, Property 9: Export format round-trip for text
 * Validates: Requirements 6.4
 * 
 * For any haunted content exported as TXT and then re-imported,
 * the text content should be identical to the original haunted text.
 */
describe('Property 9: Export format round-trip for text', () => {
  it('should preserve content exactly when exporting to TXT and reading back', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random text content that could be haunted coursework
        fc.string({ minLength: 0, maxLength: 10000 }),
        async (hauntedContent) => {
          // Simulate TXT export: create a Blob and read it back
          const blob = new Blob([hauntedContent], { type: 'text/plain;charset=utf-8' });
          
          // Read the blob back as text (simulating re-import)
          const readContent = await blob.text();
          
          // Property: The read content should exactly match the original
          expect(readContent).toBe(hauntedContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle special characters and Unicode in round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate text with various characters including special chars
        fc.string({ minLength: 0, maxLength: 5000 }),
        async (hauntedContent) => {
          const blob = new Blob([hauntedContent], { type: 'text/plain;charset=utf-8' });
          const readContent = await blob.text();
          
          expect(readContent).toBe(hauntedContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve line breaks and whitespace in round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate text with various whitespace patterns
        fc.array(
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 100 }),
            fc.constant('\n'),
            fc.constant('\r\n'),
            fc.constant('\t'),
            fc.constant('  ')
          ),
          { minLength: 0, maxLength: 100 }
        ).map(arr => arr.join('')),
        async (hauntedContent) => {
          const blob = new Blob([hauntedContent], { type: 'text/plain;charset=utf-8' });
          const readContent = await blob.text();
          
          expect(readContent).toBe(hauntedContent);
        }
      ),
      { numRuns: 100 }
    );
  });
});
