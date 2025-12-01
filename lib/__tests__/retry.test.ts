import * as fc from 'fast-check';
import { retryWithBackoff, isRetryableError } from '../retry';

describe('Retry Logic', () => {
  describe('retryWithBackoff', () => {
    it('should return result on first success', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce('success');
      
      const result = await retryWithBackoff(operation, { maxRetries: 3, baseDelayMs: 10 });
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries exhausted', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Persistent failure'));
      
      await expect(
        retryWithBackoff(operation, { maxRetries: 2, baseDelayMs: 10 })
      ).rejects.toThrow('Persistent failure');
      
      // Should be called: initial attempt + 2 retries = 3 times
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff delays', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValueOnce('success');
      
      const startTime = Date.now();
      await retryWithBackoff(operation, { maxRetries: 3, baseDelayMs: 100 });
      const duration = Date.now() - startTime;
      
      // Should wait approximately 100ms + 200ms = 300ms
      // Allow some tolerance for execution time
      expect(duration).toBeGreaterThanOrEqual(250);
      expect(operation).toHaveBeenCalledTimes(3);
    });
  });

  describe('isRetryableError', () => {
    it('should identify network errors as retryable', () => {
      expect(isRetryableError(new Error('Network error occurred'))).toBe(true);
      expect(isRetryableError(new Error('Connection timeout'))).toBe(true);
      expect(isRetryableError(new Error('ECONNREFUSED'))).toBe(true);
    });

    it('should identify rate limit errors as retryable', () => {
      expect(isRetryableError(new Error('Rate limit exceeded'))).toBe(true);
      expect(isRetryableError(new Error('Quota exceeded'))).toBe(true);
      expect(isRetryableError(new Error('429 Too Many Requests'))).toBe(true);
    });

    it('should identify server errors as retryable', () => {
      expect(isRetryableError(new Error('503 Service Unavailable'))).toBe(true);
      expect(isRetryableError(new Error('502 Bad Gateway'))).toBe(true);
    });

    it('should not identify other errors as retryable', () => {
      expect(isRetryableError(new Error('Invalid input'))).toBe(false);
      expect(isRetryableError(new Error('Authentication failed'))).toBe(false);
      expect(isRetryableError('string error')).toBe(false);
    });
  });

  // Property-Based Tests
  describe('Property-Based Tests', () => {
    /**
     * Feature: specterscript-generator, Property 5: API retry on failure
     * Validates: Requirements 3.5
     * 
     * For any failed Gemini API request, the system should retry the request
     * up to 3 times before reporting a final error to the user.
     */
    it('Property 5: API retry on failure', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate number of failures before success (0 to 5)
          fc.integer({ min: 0, max: 5 }),
          async (failuresBeforeSuccess) => {
            let callCount = 0;
            const operation = jest.fn(async () => {
              callCount++;
              if (callCount <= failuresBeforeSuccess) {
                throw new Error('Simulated API failure');
              }
              return 'success';
            });

            const maxRetries = 3;

            try {
              const result = await retryWithBackoff(operation, {
                maxRetries,
                baseDelayMs: 1, // Use minimal delay for testing
              });

              // If we got a result, it means we succeeded within retry limit
              // This should only happen if failuresBeforeSuccess <= maxRetries
              if (failuresBeforeSuccess <= maxRetries) {
                // Should succeed and be called failuresBeforeSuccess + 1 times
                return result === 'success' && 
                       operation.mock.calls.length === failuresBeforeSuccess + 1;
              } else {
                // Should not reach here if failures exceed retries
                return false;
              }
            } catch (error) {
              // If we caught an error, it means we exhausted retries
              // This should only happen if failuresBeforeSuccess > maxRetries
              if (failuresBeforeSuccess > maxRetries) {
                // Should be called maxRetries + 1 times (initial + retries)
                return operation.mock.calls.length === maxRetries + 1;
              } else {
                // Should not fail if failures are within retry limit
                return false;
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional property: Retry count should never exceed maxRetries + 1
     */
    it('Property: Total attempts should be at most maxRetries + 1', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 5 }), // Reduced max to avoid timeout
          async (maxRetries) => {
            let callCount = 0;
            const operation = jest.fn(async () => {
              callCount++;
              throw new Error('Always fails');
            });

            try {
              await retryWithBackoff(operation, {
                maxRetries,
                baseDelayMs: 1,
              });
              return false; // Should not succeed
            } catch (error) {
              // Total calls should be initial attempt + maxRetries
              return operation.mock.calls.length === maxRetries + 1;
            }
          }
        ),
        { numRuns: 30 } // Reduced runs
      );
    }, 10000); // Increased timeout to 10s
  });
});
