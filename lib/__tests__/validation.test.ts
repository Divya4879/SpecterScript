import * as fc from 'fast-check';
import {
  validateFileSize,
  validatePDFExtension,
  validatePDFType,
  validatePDFFile,
} from '../validation';

// Helper to create a mock File object for Node.js environment
function createMockFile(name: string, size: number, type: string = 'application/pdf'): File {
  // Create a minimal File-like object for testing
  return {
    name,
    size,
    type,
    lastModified: Date.now(),
    webkitRelativePath: '',
    arrayBuffer: async () => new ArrayBuffer(size),
    slice: () => new Blob(),
    stream: () => new ReadableStream(),
    text: async () => '',
  } as File;
}

describe('File Validation', () => {
  describe('validateFileSize', () => {
    it('should accept files at or below the size limit', () => {
      const file = createMockFile('test.pdf', 10 * 1024 * 1024); // Exactly 10 MB
      const result = validateFileSize(file, 10);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject files above the size limit', () => {
      const file = createMockFile('test.pdf', 10 * 1024 * 1024 + 1); // 10 MB + 1 byte
      const result = validateFileSize(file, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds 10 MB limit');
    });
  });

  describe('validatePDFExtension', () => {
    it('should accept .pdf extension (lowercase)', () => {
      const file = createMockFile('test.pdf', 1000);
      const result = validatePDFExtension(file);
      expect(result.isValid).toBe(true);
    });

    it('should accept .PDF extension (uppercase)', () => {
      const file = createMockFile('test.PDF', 1000);
      const result = validatePDFExtension(file);
      expect(result.isValid).toBe(true);
    });

    it('should accept .Pdf extension (mixed case)', () => {
      const file = createMockFile('test.Pdf', 1000);
      const result = validatePDFExtension(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-PDF extensions', () => {
      const file = createMockFile('test.txt', 1000);
      const result = validatePDFExtension(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid PDF file');
    });
  });

  describe('validatePDFType', () => {
    it('should accept application/pdf MIME type', () => {
      const file = createMockFile('test.pdf', 1000, 'application/pdf');
      const result = validatePDFType(file);
      expect(result.isValid).toBe(true);
    });

    it('should accept empty MIME type (browser may not set it)', () => {
      const file = createMockFile('test.pdf', 1000, '');
      const result = validatePDFType(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject incorrect MIME types', () => {
      const file = createMockFile('test.pdf', 1000, 'text/plain');
      const result = validatePDFType(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid PDF file');
    });
  });

  describe('validatePDFFile', () => {
    it('should accept valid PDF files', () => {
      const file = createMockFile('test.pdf', 5 * 1024 * 1024, 'application/pdf');
      const result = validatePDFFile(file, 10);
      expect(result.isValid).toBe(true);
    });

    it('should reject files with wrong extension first', () => {
      const file = createMockFile('test.txt', 5 * 1024 * 1024, 'application/pdf');
      const result = validatePDFFile(file, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid PDF file');
    });

    it('should reject files that are too large', () => {
      const file = createMockFile('test.pdf', 11 * 1024 * 1024, 'application/pdf');
      const result = validatePDFFile(file, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds 10 MB limit');
    });
  });

  // Property-Based Tests
  describe('Property-Based Tests', () => {
    /**
     * Feature: specterscript-generator, Property 1: File size validation boundary
     * Validates: Requirements 1.3
     * 
     * For any uploaded file, if the file size is less than or equal to 10,485,760 bytes (10 MB),
     * the system should accept it; if greater, the system should reject it with an error message.
     */
    it('Property 1: File size validation boundary', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 20 * 1024 * 1024 }), // 0 to 20 MB
          (fileSize) => {
            const file = createMockFile('test.pdf', fileSize, 'application/pdf');
            const maxSizeMB = 10;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            const result = validateFileSize(file, maxSizeMB);

            if (fileSize <= maxSizeBytes) {
              // Files at or below limit should be accepted
              return result.isValid === true && result.error === undefined;
            } else {
              // Files above limit should be rejected with error
              return result.isValid === false && result.error !== undefined;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: specterscript-generator, Property 2: PDF extension validation
     * Validates: Requirements 1.2
     * 
     * For any uploaded file, if the file extension is ".pdf" (case-insensitive),
     * the system should proceed to validation; otherwise, the system should reject it immediately.
     */
    it('Property 2: PDF extension validation', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Valid PDF extensions (various cases)
            fc.constant('.pdf'),
            fc.constant('.PDF'),
            fc.constant('.Pdf'),
            fc.constant('.pDf'),
            fc.constant('.pdF'),
            // Invalid extensions
            fc.constantFrom('.txt', '.doc', '.docx', '.jpg', '.png', '.zip', '.exe', '.html', '.csv')
          ),
          fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[./\\]/g, '_')), // filename without extension
          (extension, baseName) => {
            const fileName = baseName + extension;
            const file = createMockFile(fileName, 1000, 'application/pdf');
            const result = validatePDFExtension(file);

            const isPdfExtension = extension.toLowerCase() === '.pdf';

            if (isPdfExtension) {
              // PDF extensions should be accepted
              return result.isValid === true;
            } else {
              // Non-PDF extensions should be rejected
              return result.isValid === false && result.error !== undefined;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
