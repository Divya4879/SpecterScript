/**
 * Retry utilities for API calls with exponential backoff
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs?: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Delays execution for the specified number of milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries an async operation with exponential backoff
 * @param operation - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the operation
 * @throws The last error if all retries fail
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | unknown;
  let attempt = 0;

  while (attempt <= config.maxRetries) {
    try {
      // Attempt the operation
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      attempt++;

      // If we've exhausted all retries, throw the error
      if (attempt > config.maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff: baseDelay * 2^(attempt-1)
      // attempt 1: 1s, attempt 2: 2s, attempt 3: 4s
      const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt - 1);
      const delayMs = Math.min(exponentialDelay, config.maxDelayMs || Infinity);

      // Wait before retrying
      await delay(delayMs);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Checks if an error is retryable (network errors, timeouts, rate limits)
 * @param error - The error to check
 * @returns True if the error should trigger a retry
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('network') || 
        message.includes('timeout') || 
        message.includes('econnrefused') ||
        message.includes('enotfound')) {
      return true;
    }

    // Rate limiting
    if (message.includes('rate limit') || 
        message.includes('quota') ||
        message.includes('429')) {
      return true;
    }

    // Temporary server errors
    if (message.includes('503') || 
        message.includes('502') ||
        message.includes('504')) {
      return true;
    }
  }

  return false;
}
