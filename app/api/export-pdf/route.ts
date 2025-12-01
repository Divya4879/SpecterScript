import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { clearBuffer } from '@/lib/fileCleanup';
import { applySecurityHeaders, validateCors, applyCorsHeaders } from '@/lib/securityHeaders';

/**
 * OPTIONS /api/export-pdf
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  applyCorsHeaders(response.headers, request);
  return response;
}

export async function POST(request: NextRequest) {
  let pdfBuffer: Buffer | null = null;

  try {
    // Validate CORS - reject cross-origin requests
    validateCors(request);

    const { content, filename } = await request.json();

    if (!content) {
      const response = NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
      applySecurityHeaders(response.headers);
      return response;
    }

    // Create a new PDF document with gothic styling
    const doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
      size: 'LETTER',
    });

    // Collect PDF chunks
    const chunks: Buffer[] = [];
    
    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // Wait for PDF generation to complete
    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      
      doc.on('error', (err) => {
        reject(err);
      });
    });

    // Apply gothic styling
    doc
      .fontSize(12)
      .fillColor('#2a2a2a');

    // Add title if filename is provided
    if (filename) {
      doc
        .fontSize(18)
        .fillColor('#8b0000')
        .text(filename, { align: 'center' })
        .moveDown(2)
        .fontSize(12)
        .fillColor('#2a2a2a');
    }

    // Split content into paragraphs and add to PDF
    const paragraphs = content.split('\n\n');
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      
      if (paragraph.length > 0) {
        // Check if it looks like a heading (short, all caps, or ends with colon)
        const isHeading = 
          (paragraph.length < 80 && paragraph === paragraph.toUpperCase() && /[A-Z]/.test(paragraph)) ||
          (paragraph.length < 80 && paragraph.endsWith(':'));
        
        if (isHeading) {
          doc
            .fontSize(14)
            .fillColor('#8b0000')
            .text(paragraph, { align: 'left' })
            .moveDown(0.5)
            .fontSize(12)
            .fillColor('#2a2a2a');
        } else {
          doc.text(paragraph, { align: 'justify' });
          
          // Add spacing between paragraphs
          if (i < paragraphs.length - 1) {
            doc.moveDown(1);
          }
        }
      }
    }

    // Finalize the PDF
    doc.end();

    // Wait for PDF generation to complete
    pdfBuffer = await pdfPromise;

    // Return the PDF as a response
    const response = new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'haunted'}.pdf"`,
      },
    });
    applySecurityHeaders(response.headers);
    applyCorsHeaders(response.headers, request);

    // Clear buffer after sending response
    if (pdfBuffer) {
      clearBuffer(pdfBuffer);
      // Clear chunks array
      chunks.forEach(chunk => clearBuffer(chunk));
    }

    return response;
  } catch (error) {
    // Ensure cleanup on error
    if (pdfBuffer) clearBuffer(pdfBuffer);

    console.error('PDF export error:', error);
    const response = NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
    applySecurityHeaders(response.headers);
    return response;
  }
}
