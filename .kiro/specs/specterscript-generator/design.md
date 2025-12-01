# Design Document

## Overview

SpecterScript is a Next.js 14 web application that transforms PDF coursework into haunted, gothic horror versions using AI. The architecture follows a serverless model with a React-based frontend and API routes for backend processing. The system uses pdf-parse for text extraction, Google's Gemini 2.5 Pro API for content transformation, and a combination of Framer Motion and CSS animations for atmospheric effects.

The application flow: User uploads PDF → Text extraction → Chunking → AI transformation via Gemini → Merge results → Display in haunted viewer → Export options.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 14)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Upload UI    │  │ Haunted      │  │ Export       │      │
│  │ Component    │  │ Viewer       │  │ Controls     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Routes    │
                    │  (Serverless)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│ PDF Extraction │  │ AI Haunting     │  │ Export Engine  │
│ (pdf-parse)    │  │ (Gemini API)    │  │ (pdfkit)       │
└────────────────┘  └─────────────────┘  └────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14 (App Router) - React framework with server components
- TailwindCSS - Utility-first styling
- Framer Motion - Page transitions and animations
- React hooks for state management

**Backend:**
- Next.js API Routes (serverless functions)
- pdf-parse - PDF text extraction
- @google/generative-ai - Gemini 2.5 Pro integration
- pdfkit - PDF generation for exports

**Deployment:**
- Vercel - Hosting and serverless functions
- Environment variables for API keys

## Components and Interfaces

### Frontend Components

#### 1. UploadZone Component
```typescript
interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  onError: (error: string) => void;
  maxSizeMB: number;
}
```
Handles drag-and-drop file upload, validates file type and size, displays upload status.

#### 2. HauntedViewer Component
```typescript
interface HauntedViewerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
  nonFlickerMode: boolean;
  audioEnabled: boolean;
}
```
Displays haunted content with parchment texture, candle animations, fog overlay, and page navigation.

#### 3. PageTransition Component
```typescript
interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: number;
  flickerEnabled: boolean;
}
```
Wraps page content with Framer Motion animations for flicker/glitch effects.

#### 4. ExportControls Component
```typescript
interface ExportControlsProps {
  hauntedContent: string;
  filename: string;
  onExport: (format: 'pdf' | 'md' | 'txt') => void;
}
```
Provides download buttons for PDF, Markdown, and TXT formats.

#### 5. SettingsPanel Component
```typescript
interface SettingsPanelProps {
  nonFlickerMode: boolean;
  audioEnabled: boolean;
  onToggleFlicker: () => void;
  onToggleAudio: () => void;
}
```
Accessibility controls for flicker mode and audio.

### Backend API Endpoints

#### POST /api/upload
```typescript
interface UploadRequest {
  file: File; // multipart/form-data
}

interface UploadResponse {
  success: boolean;
  extractedText: string;
  pageCount: number;
  error?: string;
}
```
Accepts PDF upload, validates, extracts text, returns structured content.

#### POST /api/haunt
```typescript
interface HauntRequest {
  text: string;
  chunkSize?: number;
}

interface HauntResponse {
  success: boolean;
  hauntedText: string;
  processedChunks: number;
  error?: string;
}
```
Processes text through Gemini API, returns haunted version.

#### POST /api/export
```typescript
interface ExportRequest {
  content: string;
  format: 'pdf' | 'md' | 'txt';
  filename: string;
}

interface ExportResponse {
  success: boolean;
  downloadUrl: string;
  error?: string;
}
```
Generates downloadable file in requested format.

## Data Models

### PDFDocument
```typescript
interface PDFDocument {
  filename: string;
  sizeBytes: number;
  pageCount: number;
  extractedText: string;
  uploadTimestamp: number;
}
```

### TextChunk
```typescript
interface TextChunk {
  index: number;
  content: string;
  characterCount: number;
  isProcessed: boolean;
}
```

### HauntedContent
```typescript
interface HauntedContent {
  originalFilename: string;
  pages: string[];
  totalCharacters: number;
  processingTimeMs: number;
  geminiModel: string;
}
```

### ExportOptions
```typescript
interface ExportOptions {
  format: 'pdf' | 'md' | 'txt';
  includeMetadata: boolean;
  styling?: {
    fontFamily: string;
    fontSize: number;
    pageMargins: number[];
  };
}
```

### AppState
```typescript
interface AppState {
  uploadedFile: File | null;
  extractedText: string;
  hauntedContent: HauntedContent | null;
  currentPage: number;
  isProcessing: boolean;
  error: string | null;
  settings: {
    nonFlickerMode: boolean;
    audioEnabled: boolean;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: File size validation boundary
*For any* uploaded file, if the file size is less than or equal to 10,485,760 bytes (10 MB), the system should accept it; if greater, the system should reject it with an error message.
**Validates: Requirements 1.3**

### Property 2: PDF extension validation
*For any* uploaded file, if the file extension is ".pdf" (case-insensitive), the system should proceed to validation; otherwise, the system should reject it immediately.
**Validates: Requirements 1.2**

### Property 3: Text extraction preserves page count
*For any* valid PDF with N pages, after text extraction completes, the system should report exactly N pages in the extracted content structure.
**Validates: Requirements 2.2**

### Property 4: Chunk division completeness
*For any* extracted text of length L characters, when divided into chunks of maximum size C, the concatenation of all chunks should equal the original text.
**Validates: Requirements 3.1**

### Property 5: API retry on failure
*For any* failed Gemini API request, the system should retry the request up to 3 times before reporting a final error to the user.
**Validates: Requirements 3.5**

### Property 6: Haunted text structure preservation
*For any* original text with section markers or headings, the haunted version should maintain the same number and order of sections.
**Validates: Requirements 3.3**

### Property 7: Page navigation bounds
*For any* haunted content with N pages, when the user attempts to navigate to page P, the system should only allow 1 ≤ P ≤ N.
**Validates: Requirements 5.1**

### Property 8: Animation frame rate consistency
*For any* page transition animation, the system should render at 60 FPS or gracefully degrade without blocking user interaction.
**Validates: Requirements 5.3**

### Property 9: Export format round-trip for text
*For any* haunted content exported as TXT and then re-imported, the text content should be identical to the original haunted text.
**Validates: Requirements 6.4**

### Property 10: Non-flicker mode disables flickering
*For any* UI element with flickering animations, when non-flicker mode is enabled, the element should render without rapid opacity or position changes.
**Validates: Requirements 7.2**

### Property 11: Temporary file cleanup
*For any* uploaded PDF file, after processing completes or fails, no file should remain in the temporary storage directory.
**Validates: Requirements 8.2**

### Property 12: Extraction performance bound
*For any* PDF file of size S ≤ 10 MB, text extraction should complete within 5 seconds.
**Validates: Requirements 9.1**

### Property 13: Cursor style application
*For any* element within the haunted viewer, when the cursor hovers over it, the system should apply the custom ghost cursor style.
**Validates: Requirements 10.4**

## Error Handling

### Upload Errors
- **File too large**: Display error message "File exceeds 10 MB limit. Please upload a smaller PDF."
- **Invalid file type**: Display error message "Please upload a valid PDF file."
- **Corrupted PDF**: Display error message "Unable to read PDF. The file may be corrupted."
- **No text content**: Display error message "This PDF contains no extractable text. Please try a different file."

### Processing Errors
- **Gemini API failure**: Retry up to 3 times with exponential backoff (1s, 2s, 4s). If all retries fail, display "AI processing failed. Please try again later."
- **Chunk merging failure**: Fall back to sequential reconstruction. If that fails, display "Unable to reconstruct haunted content. Please try again."
- **Network timeout**: Display "Request timed out. Please check your connection and try again."

### Export Errors
- **PDF generation failure**: Display "Unable to generate PDF. Please try TXT or Markdown export."
- **Browser download blocked**: Display "Download blocked. Please check your browser settings."

### General Error Handling Strategy
- All errors logged to console for debugging (no user data)
- User-friendly error messages displayed in gothic-styled modal
- Errors clear automatically when user takes corrective action
- Critical errors provide "Start Over" button to reset application state

## Testing Strategy

### Unit Testing

**Framework**: Jest with React Testing Library

**Key Unit Tests**:
1. File validation logic (size, extension, corruption detection)
2. Text chunking algorithm (boundary conditions, empty text)
3. Chunk merging logic (order preservation, completeness)
4. Export format generation (PDF, MD, TXT)
5. Page navigation logic (bounds checking, wraparound)
6. Settings toggle functionality (flicker mode, audio)

**Example Unit Tests**:
- Test that 10 MB file is accepted, 10.1 MB file is rejected
- Test that ".pdf", ".PDF", ".Pdf" extensions are all accepted
- Test that empty PDF returns appropriate error
- Test that page navigation to page 0 or page N+1 is prevented
- Test that non-flicker mode removes flicker class from elements

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations to ensure comprehensive coverage across random inputs.

**Test Tagging**: Each property-based test must include a comment with this format:
```javascript
// Feature: specterscript-generator, Property {number}: {property description}
```

**Property Tests**:

1. **Property 1 Test**: File size validation boundary
   - Generate random file sizes from 0 to 20 MB
   - Verify files ≤ 10 MB are accepted, files > 10 MB are rejected
   - **Feature: specterscript-generator, Property 1: File size validation boundary**

2. **Property 2 Test**: PDF extension validation
   - Generate random file extensions (including .pdf, .PDF, .txt, .doc, etc.)
   - Verify only .pdf extensions (case-insensitive) are accepted
   - **Feature: specterscript-generator, Property 2: PDF extension validation**

3. **Property 4 Test**: Chunk division completeness
   - Generate random text strings of varying lengths
   - Chunk with random chunk sizes
   - Verify concatenation equals original
   - **Feature: specterscript-generator, Property 4: Chunk division completeness**

4. **Property 6 Test**: Haunted text structure preservation
   - Generate random text with section markers
   - Mock Gemini transformation
   - Verify section count and order preserved
   - **Feature: specterscript-generator, Property 6: Haunted text structure preservation**

5. **Property 7 Test**: Page navigation bounds
   - Generate random page counts and navigation attempts
   - Verify navigation stays within bounds [1, N]
   - **Feature: specterscript-generator, Property 7: Page navigation bounds**

6. **Property 9 Test**: Export format round-trip for text
   - Generate random haunted content
   - Export as TXT, re-import
   - Verify content equality
   - **Feature: specterscript-generator, Property 9: Export format round-trip for text**

### Integration Testing

**Framework**: Playwright for end-to-end testing

**Key Integration Tests**:
1. Full upload → extract → haunt → view → export flow
2. Error recovery flows (API failure, invalid file)
3. Accessibility features (non-flicker mode, audio toggle)
4. Page navigation with animations
5. Export in all three formats

### Performance Testing

**Tools**: Lighthouse, Chrome DevTools Performance

**Metrics to Validate**:
- PDF extraction completes within 5 seconds for 10 MB files
- Page transitions maintain 60 FPS
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

## Implementation Notes

### PDF Text Extraction
Use pdf-parse library with streaming for large files:
```javascript
const pdfParse = require('pdf-parse');
const dataBuffer = await file.arrayBuffer();
const data = await pdfParse(Buffer.from(dataBuffer));
// data.text contains extracted text
// data.numpages contains page count
```

### Gemini API Integration
Use @google/generative-ai SDK with chunking:
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const prompt = `Rewrite the given text as a haunted, cursed, gothic horror version...`;
const result = await model.generateContent(prompt + chunk);
```

### Chunking Strategy
- Maximum chunk size: 30,000 characters (safe for Gemini context window)
- Split on paragraph boundaries when possible
- Include overlap of 200 characters between chunks for context continuity

### Animation Implementation
**Framer Motion for page transitions**:
```javascript
<motion.div
  key={currentPage}
  initial={{ opacity: 0, filter: "brightness(0.3)" }}
  animate={{ opacity: 1, filter: "brightness(1)" }}
  exit={{ opacity: 0, filter: "brightness(0.3)" }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
  {pageContent}
</motion.div>
```

**CSS keyframes for candle flicker**:
```css
@keyframes candleFlicker {
  0%, 100% { opacity: 1; transform: scale(1); }
  25% { opacity: 0.8; transform: scale(0.98); }
  50% { opacity: 0.9; transform: scale(1.02); }
  75% { opacity: 0.85; transform: scale(0.99); }
}
```

### Gothic Design System

**Color Palette**:
- Background: `#0a0a0a` (deep black)
- Secondary: `#1a1a1a` (charred grey)
- Accent: `#8b0000` (blood red)
- Text: `#d4c5b9` (aged parchment)
- Glow: `#ff6b35` (ember orange)

**Typography**:
- Primary: "Cinzel" (serif, gothic)
- Secondary: "Crimson Text" (readable body text)
- Monospace: "Special Elite" (typewriter effect)

**Effects**:
- Box shadows with red glow: `0 0 20px rgba(139, 0, 0, 0.5)`
- Text shadows for depth: `2px 2px 4px rgba(0, 0, 0, 0.8)`
- Backdrop blur for fog: `backdrop-filter: blur(2px)`

### Export Implementation

**PDF Export with pdfkit**:
```javascript
const PDFDocument = require('pdfkit');
const doc = new PDFDocument({ margins: { top: 50, bottom: 50, left: 50, right: 50 } });
doc.font('Times-Roman').fontSize(12);
doc.fillColor('#2a2a2a');
doc.text(hauntedContent, { align: 'justify' });
```

**Markdown Export**:
Simple string formatting with proper line breaks and heading markers.

**TXT Export**:
Plain text with UTF-8 encoding, preserving line breaks.

### Security Considerations
- File uploads processed in memory, never written to disk permanently
- Temporary files (if needed) stored in `/tmp` with unique UUIDs
- Cleanup function runs on process completion and error
- No logging of user content
- API keys stored in environment variables, never exposed to client
- CORS configured to allow only same-origin requests

### Deployment Configuration

**Vercel Configuration** (vercel.json):
```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

**Environment Variables**:
- `GEMINI_API_KEY`: Google Gemini API key
- `NODE_ENV`: production/development
- `NEXT_PUBLIC_MAX_FILE_SIZE`: 10485760 (10 MB in bytes)

### Accessibility Implementation
- Non-flicker mode: Remove all animations with `prefers-reduced-motion` CSS and manual toggle
- Audio toggle: Control ambient sound playback with mute button
- Keyboard navigation: Full support for tab navigation and enter/space activation
- ARIA labels: All interactive elements properly labeled
- Color contrast: Ensure 4.5:1 ratio for text readability
