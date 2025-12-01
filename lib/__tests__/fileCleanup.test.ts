/**
 * Property-based tests for file cleanup utilities
 * Feature: specterscript-generator, Property 11: Temporary file cleanup
 * Validates: Requirements 8.2
 */

import * as fc from 'fast-check';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  cleanupTemporaryFiles,
  cleanupTempDirectory,
  clearBuffer,
  withCleanup,
} from '../fileCleanup';

describe('File Cleanup', () => {
  const testTempDir = path.join(os.tmpdir(), 'specterscript-test');

  beforeEach(async () => {
    // Create test temp directory
    try {
      await fs.mkdir(testTempDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  afterEach(async () => {
    // Clean up test directory after each test
    try {
      await fs.rm(testTempDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('Property 11: Temporary file cleanup', () => {
    /**
     * Feature: specterscript-generator, Property 11: Temporary file cleanup
     * For any uploaded PDF file, after processing completes or fails,
     * no file should remain in the temporary storage directory.
     */
    test('should delete all temporary files after processing completes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          async (filenames) => {
            // Create temporary files
            const tempFilePaths: string[] = [];
            for (const filename of filenames) {
              const safeName = filename.replace(/[^a-zA-Z0-9]/g, '_');
              const filePath = path.join(testTempDir, `${safeName}.tmp`);
              await fs.writeFile(filePath, 'test content');
              tempFilePaths.push(filePath);
            }

            // Verify files exist
            for (const filePath of tempFilePaths) {
              const exists = await fs.access(filePath).then(() => true).catch(() => false);
              expect(exists).toBe(true);
            }

            // Cleanup temporary files
            await cleanupTemporaryFiles(tempFilePaths);

            // Verify all files are deleted
            for (const filePath of tempFilePaths) {
              const exists = await fs.access(filePath).then(() => true).catch(() => false);
              expect(exists).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should delete all temporary files after processing fails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          async (filenames) => {
            // Create temporary files
            const tempFilePaths: string[] = [];
            for (const filename of filenames) {
              const safeName = filename.replace(/[^a-zA-Z0-9]/g, '_');
              const filePath = path.join(testTempDir, `${safeName}.tmp`);
              await fs.writeFile(filePath, 'test content');
              tempFilePaths.push(filePath);
            }

            // Simulate processing failure with cleanup
            try {
              await withCleanup(tempFilePaths, async () => {
                throw new Error('Processing failed');
              });
            } catch (error) {
              // Expected error
            }

            // Verify all files are deleted even after error
            for (const filePath of tempFilePaths) {
              const exists = await fs.access(filePath).then(() => true).catch(() => false);
              expect(exists).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should cleanup entire temporary directory', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          async (filenames) => {
            // Create temporary files in directory
            for (const filename of filenames) {
              const safeName = filename.replace(/[^a-zA-Z0-9]/g, '_');
              const filePath = path.join(testTempDir, `${safeName}.tmp`);
              await fs.writeFile(filePath, 'test content');
            }

            // Verify directory has files
            const filesBefore = await fs.readdir(testTempDir);
            expect(filesBefore.length).toBeGreaterThan(0);

            // Cleanup directory
            await cleanupTempDirectory(testTempDir);

            // Verify directory is empty
            const filesAfter = await fs.readdir(testTempDir);
            expect(filesAfter.length).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Buffer cleanup', () => {
    test('should clear buffer contents', () => {
      fc.assert(
        fc.property(
          fc.uint8Array({ minLength: 1, maxLength: 1000 }),
          (data) => {
            // Create buffer with data
            const buffer = Buffer.from(data);
            
            // Verify buffer has non-zero content
            const hasNonZero = buffer.some(byte => byte !== 0);
            
            // Clear buffer
            clearBuffer(buffer);
            
            // Verify all bytes are zero (if original had non-zero content)
            if (hasNonZero) {
              const allZero = buffer.every(byte => byte === 0);
              expect(allZero).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Cleanup with processing', () => {
    test('should cleanup after successful processing', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          async (content, filename) => {
            const safeName = filename.replace(/[^a-zA-Z0-9]/g, '_');
            const filePath = path.join(testTempDir, `${safeName}.tmp`);
            
            // Create temp file
            await fs.writeFile(filePath, content);

            // Process with cleanup
            const result = await withCleanup([filePath], async () => {
              return 'processed';
            });

            // Verify processing succeeded
            expect(result).toBe('processed');

            // Verify file is deleted
            const exists = await fs.access(filePath).then(() => true).catch(() => false);
            expect(exists).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge cases', () => {
    test('should handle cleanup of non-existent files gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          async (filenames) => {
            // Create paths for files that don't exist
            const nonExistentPaths = filenames.map(name => 
              path.join(testTempDir, `nonexistent_${name.replace(/[^a-zA-Z0-9]/g, '_')}.tmp`)
            );

            // Should not throw error
            await expect(cleanupTemporaryFiles(nonExistentPaths)).resolves.not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should handle cleanup of empty file list', async () => {
      await expect(cleanupTemporaryFiles([])).resolves.not.toThrow();
    });

    test('should handle cleanup of non-existent directory', async () => {
      const nonExistentDir = path.join(testTempDir, 'nonexistent');
      await expect(cleanupTempDirectory(nonExistentDir)).resolves.not.toThrow();
    });
  });
});
