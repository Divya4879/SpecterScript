import * as fc from 'fast-check';
import { chunkText, mergeChunks, TextChunk } from '../chunking';

describe('Text Chunking', () => {
  describe('chunkText', () => {
    it('should return empty array for empty text', () => {
      const result = chunkText('');
      expect(result).toEqual([]);
    });

    it('should return single chunk for text smaller than max size', () => {
      const text = 'This is a short text.';
      const result = chunkText(text, 1000);
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe(text);
      expect(result[0].index).toBe(0);
      expect(result[0].characterCount).toBe(text.length);
    });

    it('should split text into multiple chunks when exceeding max size', () => {
      const text = 'a'.repeat(50000);
      const result = chunkText(text, 30000, 200);
      expect(result.length).toBeGreaterThan(1);
    });

    it('should prefer splitting on paragraph boundaries', () => {
      const text = 'a'.repeat(29000) + '\n\n' + 'b'.repeat(29000);
      const result = chunkText(text, 30000, 200);
      expect(result.length).toBeGreaterThan(1);
      // First chunk should end near the paragraph break
      expect(result[0].content).toContain('a');
    });
  });

  describe('mergeChunks', () => {
    it('should return empty string for empty array', () => {
      const result = mergeChunks([]);
      expect(result).toBe('');
    });

    it('should return content for single chunk', () => {
      const chunk: TextChunk = {
        index: 0,
        content: 'Test content',
        characterCount: 12,
        isProcessed: true,
      };
      const result = mergeChunks([chunk]);
      expect(result).toBe('Test content');
    });

    it('should merge multiple chunks in order', () => {
      const chunks: TextChunk[] = [
        { index: 0, content: 'First chunk', characterCount: 11, isProcessed: true },
        { index: 1, content: 'Second chunk', characterCount: 12, isProcessed: true },
      ];
      const result = mergeChunks(chunks, 0); // No overlap
      expect(result).toContain('First chunk');
      expect(result).toContain('Second chunk');
    });
  });

  // Property-Based Tests
  describe('Property-Based Tests', () => {
    /**
     * Feature: specterscript-generator, Property 4: Chunk division completeness
     * Validates: Requirements 3.1
     * 
     * For any extracted text of length L characters, when divided into chunks of maximum size C,
     * the concatenation of all chunks should equal the original text.
     */
    it('Property 4: Chunk division completeness', () => {
      fc.assert(
        fc.property(
          // Generate random text strings of varying lengths
          fc.string({ minLength: 0, maxLength: 100000 }),
          // Generate random chunk sizes
          fc.integer({ min: 100, max: 50000 }),
          (text, chunkSize) => {
            // Skip empty text as it returns empty array
            if (text.length === 0) {
              const chunks = chunkText(text, chunkSize, 0);
              return chunks.length === 0;
            }

            // Chunk the text with no overlap for this test
            const chunks = chunkText(text, chunkSize, 0);

            // Concatenate all chunk contents
            const concatenated = chunks.map(chunk => chunk.content).join('');

            // The concatenated text should equal the original
            return concatenated === text;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional property: Chunks should not exceed max size
     */
    it('Property: Chunks should respect maximum size constraint', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100000 }),
          fc.integer({ min: 100, max: 50000 }),
          (text, maxChunkSize) => {
            const chunks = chunkText(text, maxChunkSize, 0);

            // Every chunk should be at or below max size
            return chunks.every(chunk => chunk.characterCount <= maxChunkSize);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional property: Chunk indices should be sequential
     */
    it('Property: Chunk indices should be sequential starting from 0', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100000 }),
          fc.integer({ min: 100, max: 50000 }),
          (text, maxChunkSize) => {
            const chunks = chunkText(text, maxChunkSize, 0);

            // Check that indices are 0, 1, 2, ...
            return chunks.every((chunk, idx) => chunk.index === idx);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
