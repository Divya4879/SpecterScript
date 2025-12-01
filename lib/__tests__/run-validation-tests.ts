/**
 * Standalone test runner for validation property tests
 * Run with: npx ts-node lib/__tests__/run-validation-tests.ts
 */

import * as fc from 'fast-check';
import {
  validateFileSize,
  validatePDFExtension,
  validatePDFType,
  validatePDFFile,
} from '../validation';

// Helper to create a mock File object
function createMockFile(name: string, size: number, type: string = 'application/pdf'): File {
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

console.log('Running Property-Based Tests for File Validation\n');
console.log('='.repeat(60));

// Test 1: File size validation boundary
console.log('\n✓ Running Property 1: File size validation boundary');
console.log('  Validates: Requirements 1.3');
console.log('  Testing with 100 random file sizes...');

try {
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
          if (result.isValid !== true || result.error !== undefined) {
            console.log(`  ✗ Failed for size ${fileSize} bytes (should accept)`);
            return false;
          }
          return true;
        } else {
          // Files above limit should be rejected with error
          if (result.isValid !== false || result.error === undefined) {
            console.log(`  ✗ Failed for size ${fileSize} bytes (should reject)`);
            return false;
          }
          return true;
        }
      }
    ),
    { numRuns: 100 }
  );
  console.log('  ✓ Property 1 PASSED (100 test cases)');
} catch (error) {
  console.log('  ✗ Property 1 FAILED');
  console.error(error);
  process.exit(1);
}

// Test 2: PDF extension validation
console.log('\n✓ Running Property 2: PDF extension validation');
console.log('  Validates: Requirements 1.2');
console.log('  Testing with 100 random file extensions...');

try {
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
          if (result.isValid !== true) {
            console.log(`  ✗ Failed for extension ${extension} (should accept)`);
            return false;
          }
          return true;
        } else {
          // Non-PDF extensions should be rejected
          if (result.isValid !== false || result.error === undefined) {
            console.log(`  ✗ Failed for extension ${extension} (should reject)`);
            return false;
          }
          return true;
        }
      }
    ),
    { numRuns: 100 }
  );
  console.log('  ✓ Property 2 PASSED (100 test cases)');
} catch (error) {
  console.log('  ✗ Property 2 FAILED');
  console.error(error);
  process.exit(1);
}

console.log('\n' + '='.repeat(60));
console.log('✓ All property-based tests PASSED!\n');
