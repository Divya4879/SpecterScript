# Design Document

## Overview

SpecterScript is a Next.js 14 web application that transforms syllabus images into comprehensive, AI-generated lesson plans with a gothic horror aesthetic. The architecture follows a serverless model with a React-based frontend and API routes for backend processing. The system uses Google's Gemini 2.5 Flash API with vision capabilities for syllabus structure extraction and lesson plan generation, and relies entirely on CSS animations and keyframes for atmospheric effects (no Framer Motion).

The application flow: User uploads syllabus image → AI vision analysis extracts structure → User selects topic → AI generates lesson plan → Display in ancient scroll viewer → Export options (TXT/Markdown).

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 14)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Upload UI    │  │ Syllabus     │  │ Ancient      │      │
│  │ Component    │  │ Viewer       │  │ Scroll       │      │
│  │              │  │              │  │ Viewer       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Export       │  │ Theme        │  │ Haunting     │      │
│  │ Controls     │  │ System       │  │ Effects      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
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
│ Image Upload   │  │ AI Vision       │  │ Lesson Plan    │
│ & Validation   │  │ Analysis        │  │ Generation     │
│                │  │ (Gemini 2.5     │  │ (Gemini 2.5    │
│                │  │  Flash Vision)  │  │  Flash)        │
└────────────────┘  └─────────────────┘  └────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14 (App Router) - React framework with client components
- TailwindCSS - Utility-first styling with extensive custom CSS
- CSS Keyframes & Animations - All atmospheric effects (no Framer Motion)
- React hooks for state management
- Custom theme system with useTheme hook

**Backend:**
- Next.js API Routes (serverless functions)
- @google/genai - Gemini 2.5 Flash integration with vision capabilities
- No PDF processing libraries (image-based workflow)
- No PDF export (TXT and Markdown only)

**Deployment:**
- Vercel - Hosting and serverless functions
- Environment variables for API keys
- 60-second function timeout for AI processing
- 1024 MB memory allocation

## Components and Interfaces

### Frontend Components

#### 1. UploadZone Component
```typescript
interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
  processingStage: 'idle' | 'extracting' | 'syllabus' | 'choosing' | 'haunting' | 'complete';
  disabled?: boolean;
}
```
Handles drag-and-drop image upload, validates file type (image/*) and size (10MB), displays processing status with mystical animations.

#### 2. SyllabusViewer Component
```typescript
interface Topic {
  id: string;
  title: string;
  topics: string[];
}

interface SyllabusViewerProps {
  syllabusData: {
    units: Topic[];
  };
  onTopicSelect: (unitTitle: string, topic: string, type: 'overview' | 'indepth' | 'takeaways') => void;
}
```
Displays extracted syllabus structure in an ancient scroll interface with expandable units, topic selection, and lesson plan type modal.

#### 3. AncientScrollViewer Component
```typescript
interface AncientScrollViewerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
}
```
Displays lesson plan content in an ancient scroll with parchment texture, flickering candles, scroll rods, page navigation, and markdown rendering.

#### 4. ExportControls Component
```typescript
interface ExportControlsProps {
  hauntedContent: string;
  filename: string;
  onExport: (format: 'md' | 'txt') => void;
  disabled?: boolean;
}
```
Provides download buttons for Markdown and TXT formats with gothic styling and mystical hover effects.

#### 5. HauntingEffects Component
```typescript
interface HauntingEffectsProps {
  // No props - pure atmospheric component
}
```
Renders interactive atmospheric effects including flying ravens, floating spirits, lightning flashes, and spider webs.

#### 6. VampireAudio Component
```typescript
interface VampireAudioProps {
  // No props - self-contained audio control
}
```
Provides audio control for vampire theme-specific ambient sounds with play/pause toggle.

#### 7. ThemeSelector Component
```typescript
interface ThemeSelectorProps {
  // Uses useTheme hook internally
}
```
Allows users to switch between gothic themes (default, vampire) with visual theme indicators.

#### 8. useTheme Hook
```typescript
interface UseThemeReturn {
  currentTheme: string;
  changeTheme: (theme: string) => void;
}
```
Custom React hook for managing theme state across the application.

### Backend API Endpoints

#### POST /api/upload
```typescript
interface UploadRequest {
  file: File; // multipart/form-data (image file)
}

interface SyllabusData {
  units: Array<{
    id: string;
    title: string;
    topics: string[];
  }>;
}

interface UploadResponse {
  success: boolean;
  type: 'syllabus';
  syllabusData: SyllabusData;
  extractionStatus: 'success' | 'fallback' | 'empty';
  extractionMessage: string;
  error?: string;
}
```
Accepts syllabus image upload, converts to base64, sends to Gemini 2.5 Flash with vision for structure extraction, returns structured JSON with units and topics.

#### POST /api/haunt
```typescript
interface HauntRequest {
  text: string; // Contains prompt + topic information
  chunkSize?: number; // Optional, defaults to 30000
}

interface HauntResponse {
  success: boolean;
  hauntedText: string; // Generated lesson plan content
  processedChunks: number;
  error?: string;
}
```
Processes lesson plan generation request through Gemini 2.5 Flash API, returns formatted educational content with markdown structure.

#### POST /api/export-pdf (Legacy - Not Used)
```typescript
interface ExportRequest {
  content: string;
  filename: string;
}

interface ExportResponse {
  // Returns PDF blob directly
}
```
Legacy PDF export endpoint using pdfkit. Currently not used in the application (TXT and Markdown exports are client-side only).

## Data Models

### SyllabusImage
```typescript
interface SyllabusImage {
  filename: string;
  sizeBytes: number;
  type: string; // MIME type (image/jpeg, image/png, etc.)
  base64Data: string; // Base64-encoded image data
}
```

### SyllabusUnit
```typescript
interface SyllabusUnit {
  id: string; // Unique identifier (e.g., "unit1")
  title: string; // Full unit title including number
  topics: string[]; // Array of sub-topics/keywords
}
```

### SyllabusData
```typescript
interface SyllabusData {
  units: SyllabusUnit[];
}
```

### LessonPlanType
```typescript
type LessonPlanType = 'overview' | 'indepth' | 'takeaways';
```

### LessonPlanContent
```typescript
interface LessonPlanContent {
  originalTopic: string;
  unitTitle: string;
  type: LessonPlanType;
  content: string; // Markdown-formatted lesson plan
  pages: string[]; // Content divided into pages
  totalCharacters: number;
}
```

### AppState
```typescript
interface AppState {
  uploadedFile: File | null;
  contentType: 'syllabus' | 'text' | null;
  syllabusData: SyllabusData | null;
  extractedText: string;
  extractionStatus: 'success' | 'fallback' | 'empty' | null;
  extractionMessage: string;
  hauntedContent: string; // Generated lesson plan
  pages: string[]; // Divided pages for navigation
  currentPage: number;
  isProcessing: boolean;
  processingStage: 'idle' | 'extracting' | 'syllabus' | 'choosing' | 'haunting' | 'complete';
  error: string | null;
  settings: {
    enableFlicker: boolean;
    enableAudio: boolean;
    pageSize: number; // Characters per page
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: File size validation boundary
*For any* uploaded file, if the file size is less than or equal to 10,485,760 bytes (10 MB), the system should accept it; if greater, the system should reject it with an error message.
**Validates: Requirements 1.3**

### Property 2: Image type validation
*For any* uploaded file, if the file type starts with "image/" (MIME type), the system should proceed to processing; otherwise, the system should reject it immediately with an error message.
**Validates: Requirements 1.2**

### Property 3: Syllabus structure extraction completeness
*For any* valid syllabus image with N distinct units, after AI vision analysis completes, the system should return exactly N unit objects in the structured JSON response.
**Validates: Requirements 2.2**

### Property 4: Chunk division completeness
*For any* text of length L characters, when divided into chunks of maximum size C with no overlap, the concatenation of all chunks should equal the original text.
**Validates: Requirements 4.1** (adapted for lesson plan generation)

### Property 5: API retry on failure
*For any* failed Gemini API request, the system should retry the request up to 3 times with exponential backoff before reporting a final error to the user.
**Validates: Requirements 4.4**

### Property 6: Topic selection modal display
*For any* selected topic from the syllabus viewer, the system should display a modal with exactly three lesson plan options (overview, in-depth, takeaways).
**Validates: Requirements 3.4**

### Property 7: Page navigation bounds
*For any* lesson plan content with N pages, when the user attempts to navigate to page P, the system should only allow 0 ≤ P < N (zero-indexed).
**Validates: Requirements 6.4**

### Property 8: Page division consistency
*For any* lesson plan content of length L characters with page size S, the number of pages should be ceil(L / S) or greater (accounting for natural boundaries).
**Validates: Requirements 6.1**

### Property 9: Export format round-trip for text
*For any* lesson plan content exported as TXT and then re-imported, the text content should be identical to the original lesson plan text.
**Validates: Requirements 7.4**

### Property 10: Theme application consistency
*For any* selected theme, all UI components should apply the theme-specific CSS classes and color palette consistently across the application.
**Validates: Requirements 8.1, 8.2, 8.3**

### Property 11: Base64 image encoding correctness
*For any* uploaded image file, the base64 encoding should be reversible such that decoding produces the original image data.
**Validates: Requirements 10.1**

### Property 12: Markdown rendering preservation
*For any* lesson plan content with markdown syntax (headings, bold, lists), the rendered HTML should preserve the structure and formatting.
**Validates: Requirements 5.5**

### Property 13: Navigation button state correctness
*For any* page navigation state, when on the first page, the previous button should be disabled; when on the last page, the next button should be disabled.
**Validates: Requirements 6.4**

## Error Handling

### Upload Errors
- **File too large**: Display error message "The tome is too large for our mystical powers (max 10MB)"
- **Invalid file type**: Display error message "Only image files are accepted by the ancient spirits (JPG, PNG, etc.)"
- **No file provided**: Display error message "No file provided"

### Processing Errors
- **Gemini API failure**: Retry up to 3 times with exponential backoff (1s, 2s, 4s). If all retries fail, display "AI service rate limit exceeded. Please try again later."
- **Syllabus extraction failure**: Display "Could not identify course units in the syllabus. Please ensure the image contains a clear syllabus structure."
- **Lesson plan generation failure**: Display "AI processing failed. Please try again later."
- **Network timeout**: Display "Request timed out. Please check your connection and try again."

### Export Errors
- **Export failure**: Display "Failed to export file. Please try again."
- **Browser download blocked**: Display "Download blocked. Please check your browser settings."

### General Error Handling Strategy
- All errors logged to console for debugging (no user data)
- User-friendly error messages displayed in gothic-styled containers with skull icons and blood-red borders
- Errors clear automatically when user takes corrective action
- Processing errors display in the main content area with mystical styling
- API errors include retry logic before displaying to user

## Testing Strategy

### Unit Testing

**Framework**: Jest with @testing-library/react and @testing-library/jest-dom

**Key Unit Tests**:
1. File validation logic (size, image type validation)
2. Text chunking algorithm (boundary conditions, empty text, overlap handling)
3. Chunk merging logic (order preservation, completeness, fallback)
4. Export format generation (MD, TXT)
5. Text sanitization (control character removal, Unicode handling)
6. Security headers application (CORS, CSP)

**Implemented Unit Tests**:
- `lib/__tests__/validation.test.ts`: File size and type validation
- `lib/__tests__/chunking.test.ts`: Text chunking and merging
- `lib/__tests__/export.test.ts`: Export format round-trip
- `lib/__tests__/extraction.test.ts`: Text extraction and sanitization
- `lib/__tests__/securityHeaders.test.ts`: Security header validation
- `lib/__tests__/retry.test.ts`: Retry logic with exponential backoff
- `lib/__tests__/structure-preservation.test.ts`: Content structure validation
- `lib/__tests__/fileCleanup.test.ts`: Temporary file cleanup

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test runs a minimum of 100 iterations to ensure comprehensive coverage across random inputs.

**Test Tagging**: Each property-based test includes a comment with this format:
```javascript
/**
 * Feature: specterscript-generator, Property {number}: {property description}
 * Validates: Requirements {requirement numbers}
 */
```

**Implemented Property Tests**:

1. **Property 1 Test**: File size validation boundary
   - Location: `lib/__tests__/validation.test.ts`
   - Generates random file sizes from 0 to 20 MB
   - Verifies files ≤ 10 MB are accepted, files > 10 MB are rejected
   - **Feature: specterscript-generator, Property 1: File size validation boundary**
   - **Validates: Requirements 1.3**

2. **Property 2 Test**: Image extension validation
   - Location: `lib/__tests__/validation.test.ts`
   - Generates random file extensions (including image types and non-image types)
   - Verifies only image/* MIME types are accepted
   - **Feature: specterscript-generator, Property 2: Image type validation**
   - **Validates: Requirements 1.2**

3. **Property 4 Test**: Chunk division completeness
   - Location: `lib/__tests__/chunking.test.ts`
   - Generates random text strings of varying lengths (0 to 100,000 characters)
   - Chunks with random chunk sizes (100 to 50,000 characters)
   - Verifies concatenation equals original text
   - **Feature: specterscript-generator, Property 4: Chunk division completeness**
   - **Validates: Requirements 4.1**

4. **Property 9 Test**: Export format round-trip for text
   - Location: `lib/__tests__/export.test.ts`
   - Generates random lesson plan content with special characters and Unicode
   - Exports as TXT, re-imports via Blob API
   - Verifies content equality including whitespace and line breaks
   - **Feature: specterscript-generator, Property 9: Export format round-trip for text**
   - **Validates: Requirements 7.4**

### Integration Testing

**Framework**: Jest with React Testing Library for component integration

**Implemented Integration Tests**:
- `components/__tests__/HauntedViewer.test.tsx`: Scroll viewer rendering and navigation
- `components/__tests__/SettingsPanel.test.tsx`: Theme switching and settings management

**Key Integration Scenarios**:
1. Upload → syllabus extraction → topic selection → lesson plan generation → view → export flow
2. Error recovery flows (API failure, invalid file, rate limiting)
3. Theme switching (default gothic, vampire theme)
4. Page navigation with scroll transitions
5. Export in both formats (TXT, Markdown)

### Performance Testing

**Tools**: Chrome DevTools Performance, Lighthouse

**Metrics to Validate**:
- Syllabus image analysis completes within 10 seconds for 10 MB images
- Lesson plan generation completes within 15 seconds for typical topics
- CSS animations maintain smooth performance (no jank)
- First Contentful Paint < 2s
- Time to Interactive < 3.5s
- No memory leaks during extended usage

## Implementation Notes

### Syllabus Image Processing
Convert image to base64 and send to Gemini with vision:
```typescript
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
const base64Data = buffer.toString('base64');
const mimeType = file.type;
const imageBase64Url = `data:${mimeType};base64,${base64Data}`;

// Extract MIME type and data
const match = imageBase64Url.match(/^data:(.*);base64,(.*)$/);
const extractedMimeType = match[1];
const data = match[2];

const imagePart = { inlineData: { mimeType: extractedMimeType, data } };
```

### Gemini API Integration with Vision
Use @google/genai SDK with structured output schema:
```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const syllabusSchema = {
  type: Type.OBJECT,
  properties: {
    units: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          topics: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "title", "topics"]
      }
    }
  },
  required: ["units"]
};

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: { parts: [textPart, imagePart] },
  config: {
    responseMimeType: "application/json",
    responseSchema: syllabusSchema
  }
});
```

### Lesson Plan Generation
Simple prompt-based generation without chunking:
```typescript
const prompt = `${userPrompt}\n\nUse proper markdown formatting with clear headings and structure. Make it comprehensive and educational.`;

const result = await genAI.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt
});

const lessonPlan = result.text;
```

### Retry Logic with Exponential Backoff
```typescript
async function generateContentWithRetry(requestPayload: any, ai: any) {
  const MAX_RETRIES = 3;
  const INITIAL_DELAY_MS = 1000;
  
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      return await ai.models.generateContent(requestPayload);
    } catch (error: any) {
      if (error.message && error.message.includes('429')) {
        retries++;
        if (retries >= MAX_RETRIES) {
          throw new Error("API rate limit exceeded. Please wait a minute and try again.");
        }
        const delayTime = INITIAL_DELAY_MS * Math.pow(2, retries - 1);
        await new Promise(resolve => setTimeout(resolve, delayTime));
      } else {
        throw error;
      }
    }
  }
}
```

### Animation Implementation
**Pure CSS keyframes for all animations** (no Framer Motion):
```css
@keyframes candleFlicker {
  0%, 100% { 
    transform: scale(1) rotate(-1deg);
    filter: drop-shadow(0 0 25px rgba(255, 165, 0, 1));
  }
  25% { 
    transform: scale(1.15) rotate(1deg);
    filter: drop-shadow(0 0 35px rgba(255, 165, 0, 1));
  }
  50% { 
    transform: scale(0.9) rotate(-0.5deg);
    filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.8));
  }
}

@keyframes bat-flight {
  0% { transform: translateX(-150px) translateY(0px) rotate(-5deg); opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { transform: translateX(calc(100vw + 150px)) translateY(-40px) rotate(8deg); opacity: 0; }
}
```

### Gothic Design System

**Default Gothic Theme Color Palette**:
- Background: `#0a0a0a` (deep black)
- Secondary: `#1a1a1a` (charred grey)
- Accent: `#8b0000` (blood red)
- Text: `#d4c5b9` (aged parchment)
- Glow: `#ff6b35` (ember orange)

**Vampire Theme Color Palette**:
- Primary: `#8B0000` (dark blood red)
- Secondary: `#DC143C` (crimson)
- Accent: `#B22222` (firebrick)
- Background: `#0A0000` (pure black with red tint)
- Surface: `#1A0000` (dark red-black)
- Text: `#F5F5DC` (beige)

**Typography**:
- Primary: "Cinzel" (serif, gothic) - Used for headings and titles
- Secondary: "Crimson Text" (readable serif) - Used for body text
- Monospace: "Special Elite" (typewriter effect) - Used for special effects

**Effects**:
- Box shadows with red glow: `0 0 20px rgba(139, 0, 0, 0.5), 0 0 40px rgba(139, 0, 0, 0.3)`
- Text shadows for depth: `0 0 5px #8b0000, 0 0 10px #8b0000, 2px 2px 0px #000`
- Backdrop blur for fog: `backdrop-filter: blur(2px)`
- Blood drip animations: Realistic dripping effects with gradients and shadows
- Candle light effects: Radial gradients with animated flickering

### Export Implementation

**Client-Side TXT Export**:
```typescript
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
```

**Client-Side Markdown Export**:
```typescript
export function exportAsMarkdown(content: string, filename: string): void {
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
```

**Note**: PDF export functionality exists in the API but is not currently used in the UI. Only TXT and Markdown exports are available to users.

### Security Considerations
- Image uploads converted to base64 in memory, never written to disk
- No temporary file storage - all processing happens in memory
- No logging of user content or uploaded images
- API keys stored in environment variables, never exposed to client
- CORS configured with security headers (CSP, X-Frame-Options, etc.)
- Secure HTTPS connections for all API calls
- No persistent storage of user data on server

### Deployment Configuration

**Vercel Configuration** (vercel.json):
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

**Environment Variables**:
- `GEMINI_API_KEY`: Google Gemini API key (required)
- `NEXT_PUBLIC_MAX_FILE_SIZE`: 10485760 (10 MB in bytes)
- `NODE_ENV`: production/development

### Page Division Strategy
```typescript
export function divideIntoPages(
  content: string,
  charactersPerPage: number = 2000
): string[] {
  // Split on natural boundaries (paragraphs, sentences, words)
  // Prefer paragraph breaks (double newline)
  // Fall back to single newline, then sentence end, then word boundary
  // Ensures pages break at readable points
}
```

### Theme System Implementation
```typescript
// hooks/useTheme.ts
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState('default');
  
  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    // Apply theme class to document root
    document.documentElement.className = `theme-${theme}`;
  };
  
  return { currentTheme, changeTheme };
}
```

### Accessibility Implementation
- CSS animations respect `prefers-reduced-motion` media query
- All interactive elements have proper ARIA labels
- Keyboard navigation supported for all controls
- Color contrast meets WCAG AA standards (4.5:1 for normal text)
- Focus indicators visible on all interactive elements
- Semantic HTML structure for screen readers
