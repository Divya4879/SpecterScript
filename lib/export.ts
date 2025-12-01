/**
 * Export utilities for haunted content
 */

/**
 * Export haunted content as plain text file
 * @param content - The haunted text content to export
 * @param filename - The base filename (without extension)
 */
export function exportAsTxt(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export haunted content as Markdown file
 * @param content - The haunted text content to export
 * @param filename - The base filename (without extension)
 */
export function exportAsMarkdown(content: string, filename: string): void {
  // Format content as Markdown with proper structure
  const markdownContent = formatAsMarkdown(content);
  
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format content as Markdown with heading markers
 * @param content - The raw text content
 * @returns Formatted Markdown string
 */
function formatAsMarkdown(content: string): string {
  // Split content into lines
  const lines = content.split('\n');
  const formattedLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect potential headings (lines that are short, capitalized, or end with colons)
    if (trimmed.length > 0 && trimmed.length < 80) {
      // Check if line looks like a heading
      const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
      const endsWithColon = trimmed.endsWith(':');
      const startsWithNumber = /^\d+\./.test(trimmed);
      
      if (isAllCaps && trimmed.length < 50) {
        // Major heading
        formattedLines.push(`# ${trimmed}`);
      } else if (endsWithColon || startsWithNumber) {
        // Subheading
        formattedLines.push(`## ${trimmed}`);
      } else {
        formattedLines.push(line);
      }
    } else {
      formattedLines.push(line);
    }
  }
  
  return formattedLines.join('\n');
}

/**
 * Export haunted content as PDF file
 * @param content - The haunted text content to export
 * @param filename - The base filename (without extension)
 */
export async function exportAsPdf(content: string, filename: string): Promise<void> {
  // This will be implemented using pdfkit in the browser
  // For now, we'll use a client-side approach with jsPDF or similar
  // Since pdfkit is primarily server-side, we'll need to make an API call
  
  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        filename,
      }),
    });
    
    if (!response.ok) {
      throw new Error('PDF export failed');
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}
