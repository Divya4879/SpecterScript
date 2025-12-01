/**
 * Text chunking utilities for AI processing
 */

export interface TextChunk {
  index: number;
  content: string;
  characterCount: number;
  isProcessed: boolean;
}

const MAX_CHUNK_SIZE = 30000;
const OVERLAP_SIZE = 200;

/**
 * Splits text into chunks suitable for AI processing
 * Attempts to split on paragraph boundaries with overlap for context continuity
 * @param text - The text to chunk
 * @param maxChunkSize - Maximum characters per chunk (default: 30000)
 * @param overlapSize - Characters to overlap between chunks (default: 200)
 * @returns Array of text chunks
 */
export function chunkText(
  text: string,
  maxChunkSize: number = MAX_CHUNK_SIZE,
  overlapSize: number = OVERLAP_SIZE
): TextChunk[] {
  if (!text || text.length === 0) {
    return [];
  }

  // If text fits in one chunk, return it as-is
  if (text.length <= maxChunkSize) {
    return [
      {
        index: 0,
        content: text,
        characterCount: text.length,
        isProcessed: false,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let currentPosition = 0;
  let chunkIndex = 0;

  while (currentPosition < text.length) {
    // Calculate the end position for this chunk
    let endPosition = Math.min(currentPosition + maxChunkSize, text.length);

    // If this isn't the last chunk, try to find a paragraph boundary
    if (endPosition < text.length) {
      // Look for paragraph breaks (double newlines) near the end
      const searchStart = Math.max(currentPosition, endPosition - 500);
      const searchText = text.substring(searchStart, endPosition);
      const lastParagraphBreak = searchText.lastIndexOf('\n\n');

      if (lastParagraphBreak !== -1) {
        // Found a paragraph break, use it
        endPosition = searchStart + lastParagraphBreak + 2; // Include the newlines
      } else {
        // No paragraph break found, try to find a single newline
        const lastNewline = searchText.lastIndexOf('\n');
        if (lastNewline !== -1) {
          endPosition = searchStart + lastNewline + 1;
        } else {
          // No newline found, try to find a sentence boundary
          const lastPeriod = searchText.lastIndexOf('. ');
          if (lastPeriod !== -1) {
            endPosition = searchStart + lastPeriod + 2;
          }
          // Otherwise, just use the max chunk size (hard break)
        }
      }
    }

    // Extract the chunk
    const chunkContent = text.substring(currentPosition, endPosition);

    chunks.push({
      index: chunkIndex,
      content: chunkContent,
      characterCount: chunkContent.length,
      isProcessed: false,
    });

    // Move to the next position with overlap
    // For the last chunk, we don't need overlap
    if (endPosition < text.length) {
      currentPosition = endPosition - overlapSize;
      // Make sure we don't go backwards
      if (currentPosition <= chunks[chunkIndex].content.length + (chunkIndex > 0 ? chunks[chunkIndex - 1].content.length : 0) - overlapSize) {
        currentPosition = endPosition;
      }
    } else {
      currentPosition = endPosition;
    }

    chunkIndex++;
  }

  return chunks;
}

/**
 * Merges processed chunks back into a single text using sequential reconstruction
 * This is a fallback method that simply concatenates chunks in order
 * @param chunks - Array of processed chunks
 * @returns Merged text
 */
export function mergeChunksSequential(chunks: TextChunk[]): string {
  if (!chunks || chunks.length === 0) {
    return '';
  }

  // Sort chunks by index to ensure correct order
  const sortedChunks = [...chunks].sort((a, b) => a.index - b.index);

  // Simple concatenation
  return sortedChunks.map(chunk => chunk.content).join('');
}

/**
 * Merges processed chunks back into a single text
 * Removes overlap regions to avoid duplication
 * Falls back to sequential reconstruction if overlap detection fails
 * @param chunks - Array of processed chunks
 * @param overlapSize - Size of overlap to remove (default: 200)
 * @returns Merged text
 */
export function mergeChunks(
  chunks: TextChunk[],
  overlapSize: number = OVERLAP_SIZE
): string {
  if (!chunks || chunks.length === 0) {
    return '';
  }

  if (chunks.length === 1) {
    return chunks[0].content;
  }

  try {
    // Sort chunks by index to ensure correct order
    const sortedChunks = [...chunks].sort((a, b) => a.index - b.index);

    let mergedText = sortedChunks[0].content;

    for (let i = 1; i < sortedChunks.length; i++) {
      const currentChunk = sortedChunks[i].content;
      
      // Try to remove overlap by finding matching text
      // We look for the last overlapSize characters of the merged text
      // in the beginning of the current chunk
      const overlapCandidate = mergedText.slice(-Math.min(overlapSize, mergedText.length));
      const overlapIndex = currentChunk.indexOf(overlapCandidate);

      if (overlapIndex !== -1 && overlapIndex < overlapSize) {
        // Found overlap, skip it
        mergedText += currentChunk.substring(overlapIndex + overlapCandidate.length);
      } else {
        // Try a smaller overlap window
        const smallerOverlap = Math.floor(overlapSize / 2);
        const smallerCandidate = mergedText.slice(-Math.min(smallerOverlap, mergedText.length));
        const smallerIndex = currentChunk.indexOf(smallerCandidate);

        if (smallerIndex !== -1 && smallerIndex < overlapSize) {
          mergedText += currentChunk.substring(smallerIndex + smallerCandidate.length);
        } else {
          // No clear overlap found, use a separator to avoid confusion
          mergedText += '\n' + currentChunk;
        }
      }
    }

    return mergedText;
  } catch (error) {
    // Fallback to sequential reconstruction if anything goes wrong
    console.error('Chunk merging failed, using sequential fallback:', error);
    return mergeChunksSequential(chunks);
  }
}
