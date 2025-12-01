/**
 * Divides haunted content into pages based on character count
 * @param content - The full haunted text content
 * @param charactersPerPage - Maximum characters per page (default: 2000)
 * @returns Array of page strings
 */
export function divideIntoPages(
  content: string,
  charactersPerPage: number = 2000
): string[] {
  if (!content || content.trim().length === 0) {
    return [];
  }

  const pages: string[] = [];
  let currentIndex = 0;

  while (currentIndex < content.length) {
    // Calculate the end index for this page
    let endIndex = currentIndex + charactersPerPage;

    // If we're not at the end of the content, try to break at a natural boundary
    if (endIndex < content.length) {
      // Look for paragraph break (double newline) within the last 200 characters
      const searchStart = Math.max(currentIndex, endIndex - 200);
      const searchText = content.substring(searchStart, endIndex + 200);
      const paragraphBreak = searchText.indexOf('\n\n');

      if (paragraphBreak !== -1) {
        endIndex = searchStart + paragraphBreak + 2; // Include the newlines
      } else {
        // Look for single newline
        const newlineIndex = searchText.lastIndexOf('\n');
        if (newlineIndex !== -1) {
          endIndex = searchStart + newlineIndex + 1;
        } else {
          // Look for sentence end (period, question mark, exclamation)
          const sentenceEnd = searchText.search(/[.!?]\s/);
          if (sentenceEnd !== -1) {
            endIndex = searchStart + sentenceEnd + 2; // Include punctuation and space
          } else {
            // Look for word boundary (space)
            const spaceIndex = searchText.lastIndexOf(' ');
            if (spaceIndex !== -1) {
              endIndex = searchStart + spaceIndex + 1;
            }
          }
        }
      }
    }

    // Extract the page content
    const pageContent = content.substring(currentIndex, endIndex).trim();
    if (pageContent.length > 0) {
      pages.push(pageContent);
    }

    currentIndex = endIndex;
  }

  return pages.length > 0 ? pages : [content];
}
