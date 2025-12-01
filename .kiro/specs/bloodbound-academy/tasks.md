# Implementation Plan

- [x] 1. Initialize Next.js project and configure dependencies





  - Create Next.js 14 app with App Router
  - Install dependencies: TailwindCSS, Framer Motion, pdf-parse, @google/generative-ai, pdfkit, fast-check
  - Configure TailwindCSS with gothic color palette
  - Set up environment variables for Gemini API key
  - _Requirements: All_

- [x] 2. Implement PDF upload and validation





  - [x] 2.1 Create UploadZone component with drag-and-drop functionality


    - Build file input with drag-and-drop handlers
    - Add visual feedback for drag states
    - _Requirements: 1.1_

  - [x] 2.2 Implement file validation logic


    - Write validation functions for file size, extension, and type
    - Add error state management and display
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 2.3 Write property test for file size validation


    - **Property 1: File size validation boundary**
    - **Validates: Requirements 1.3**

  - [x] 2.4 Write property test for PDF extension validation


    - **Property 2: PDF extension validation**
    - **Validates: Requirements 1.2**

  - [x] 2.5 Add upload confirmation UI


    - Display filename and file size on successful upload
    - _Requirements: 1.5_

- [x] 3. Build PDF text extraction engine





  - [x] 3.1 Create API route for PDF upload and extraction


    - Implement POST /api/upload endpoint
    - Integrate pdf-parse library for text extraction
    - Return structured response with extracted text and page count
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Add text sanitization


    - Remove control characters and invalid Unicode
    - Preserve line breaks and paragraph structure
    - _Requirements: 2.4_

  - [x] 3.3 Write property test for text extraction page preservation


    - **Property 3: Text extraction preserves page count**
    - **Validates: Requirements 2.2**

  - [x] 3.4 Handle extraction errors


    - Detect corrupted PDFs and empty documents
    - Return appropriate error messages
    - _Requirements: 1.4, 2.3_

- [x] 4. Implement AI haunting engine with Gemini integration




  - [x] 4.1 Create text chunking utility


    - Split text into chunks of max 30,000 characters
    - Split on paragraph boundaries with 200-character overlap
    - _Requirements: 3.1_

  - [x] 4.2 Write property test for chunk division completeness


    - **Property 4: Chunk division completeness**
    - **Validates: Requirements 3.1**

  - [x] 4.3 Create API route for AI transformation


    - Implement POST /api/haunt endpoint
    - Integrate Gemini 2.5 Pro API with haunted transformation prompt
    - Process each chunk and collect results
    - _Requirements: 3.2_

  - [x] 4.4 Implement retry logic for API failures


    - Add exponential backoff retry (1s, 2s, 4s)
    - Retry up to 3 times before failing
    - _Requirements: 3.5_

  - [x] 4.5 Write property test for API retry behavior


    - **Property 5: API retry on failure**
    - **Validates: Requirements 3.5**

  - [x] 4.6 Implement chunk merging logic


    - Merge transformed chunks in order
    - Add fallback sequential reconstruction
    - _Requirements: 3.4, 9.3_

  - [x] 4.7 Write property test for structure preservation


    - **Property 6: Haunted text structure preservation**
    - **Validates: Requirements 3.3**
-


- [x] 5. Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Build haunted viewer component





  - [x] 6.1 Create HauntedViewer component with parchment styling


    - Design parchment-textured background
    - Apply gothic font (Cinzel or Crimson Text)
    - Add dark gothic color palette
    - _Requirements: 4.1, 4.4, 10.1_

  - [x] 6.2 Write property test for font application


    - **Property 13: Cursor style application** (adapted for font)
    - **Validates: Requirements 4.4**

  - [x] 6.3 Implement page division logic


    - Split haunted content into pages based on character count
    - Create page navigation state management
    - _Requirements: 5.1_

  - [x] 6.5 Write property test for page navigation bounds


    - **Property 7: Page navigation bounds**
    - **Validates: Requirements 5.1**

  - [x] 6.4 Add custom ghost cursor styling


    - Create CSS for glowing ghost cursor
    - Apply to haunted viewer elements
    - _Requirements: 10.4_

- [x] 7. Implement atmospheric animations and effects





  - [x] 7.1 Create flickering candle animations with CSS keyframes


    - Design candle flame oscillation animation
    - Position candles at borders
    - _Requirements: 4.2, 10.5_

  - [x] 7.2 Add spectral fog overlay


    - Create fog effect with backdrop blur
    - Animate fog movement with CSS
    - _Requirements: 4.3_

  - [x] 7.3 Implement page transition animations with Framer Motion


    - Create flicker/glitch transition effect
    - Apply to page changes
    - _Requirements: 5.2_

  - [x] 7.4 Write property test for animation frame rate


    - **Property 8: Animation frame rate consistency**
    - **Validates: Requirements 5.3**

  - [x] 7.5 Add idle flicker animation


    - Implement 10-second idle timer
    - Trigger random flicker on timeout
    - _Requirements: 5.4_

  - [x] 7.6 Add floating ember particle effects


    - Create ember particles with CSS or canvas
    - Trigger on scroll events
    - _Requirements: 5.5_

  - [x] 7.7 Add hover effects


    - Implement spectral glow on text hover
    - Add shaking text effect on button hover
    - _Requirements: 4.5, 10.3_

- [x] 8. Build export functionality




  - [x] 8.1 Create ExportControls component


    - Add buttons for PDF, Markdown, and TXT export
    - Wire up export handlers
    - _Requirements: 6.1_

  - [x] 8.2 Implement TXT export


    - Generate plain text file from haunted content
    - Trigger browser download
    - _Requirements: 6.4, 6.5_

  - [x] 8.3 Write property test for TXT export round-trip


    - **Property 9: Export format round-trip for text**
    - **Validates: Requirements 6.4**

  - [x] 8.4 Implement Markdown export


    - Format haunted content as Markdown
    - Preserve structure with heading markers
    - Trigger browser download
    - _Requirements: 6.3, 6.5_

  - [x] 8.5 Implement PDF export with pdfkit


    - Generate PDF with gothic styling
    - Apply custom fonts and formatting
    - Trigger browser download
    - _Requirements: 6.2, 6.5_

- [x] 9. Add accessibility features




  - [x] 9.1 Create SettingsPanel component


    - Add toggles for non-flicker mode and audio
    - Manage settings state
    - _Requirements: 7.1, 7.4_

  - [x] 9.2 Implement non-flicker mode


    - Disable flickering animations when enabled
    - Maintain gothic aesthetic without flicker
    - Add prefers-reduced-motion CSS support
    - _Requirements: 7.2, 7.3_

  - [x] 9.3 Write property test for non-flicker mode


    - **Property 10: Non-flicker mode disables flickering**
    - **Validates: Requirements 7.2**

  - [x] 9.4 Add audio toggle functionality


    - Implement ambient sound playback (optional)
    - Mute/unmute on toggle
    - _Requirements: 7.5_

  - [x] 9.5 Add keyboard navigation support


    - Enable tab navigation for all interactive elements
    - Add ARIA labels for accessibility
    - _Requirements: 7.1, 7.4_

- [x] 10. Implement security and cleanup




  - [x] 10.1 Add temporary file cleanup


    - Delete temp files after processing completes
    - Delete temp files on error
    - _Requirements: 8.2_

  - [x] 10.2 Write property test for temporary file cleanup


    - **Property 11: Temporary file cleanup**
    - **Validates: Requirements 8.2**

  - [x] 10.3 Ensure HTTPS for API calls


    - Verify Gemini API uses HTTPS
    - Configure secure headers
    - _Requirements: 8.5_

  - [x] 10.4 Add CORS configuration


    - Restrict to same-origin requests
    - Configure security headers
    - _Requirements: 8.1, 8.4_

- [x] 11. Build main application flow and state management





  - [x] 11.1 Create main page component


    - Integrate UploadZone, HauntedViewer, ExportControls, SettingsPanel
    - Manage application state (uploaded file, extracted text, haunted content, current page, processing status, errors, settings)
    - _Requirements: All_

  - [x] 11.2 Wire up upload → extract → haunt → view → export flow

    - Connect upload to extraction API
    - Connect extraction to haunting API
    - Display haunted content in viewer
    - Enable export when content is ready
    - _Requirements: All_

  - [x] 11.3 Add loading states and progress indicators

    - Show spinner during PDF extraction
    - Show progress during AI transformation
    - Display processing status messages
    - _Requirements: 9.5_

  - [x] 11.4 Implement error handling and display

    - Show user-friendly error messages in gothic-styled modal
    - Add "Start Over" button for critical errors
    - Clear errors on corrective action
    - _Requirements: 1.3, 1.4, 2.3, 3.5, 9.3_

- [x] 12. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Polish UI and optimize performance





  - [x] 13.1 Add gothic fonts from Google Fonts


    - Import Cinzel, Crimson Text, Special Elite
    - Apply to appropriate elements
    - _Requirements: 4.4_

  - [x] 13.2 Optimize animations for 60 FPS


    - Use CSS transforms instead of position changes
    - Enable GPU acceleration with will-change
    - Test with Chrome DevTools Performance
    - _Requirements: 5.3, 9.4_

  - [x] 13.3 Add moving shadow effects


    - Create CSS keyframe animations for shadows
    - Apply to UI elements
    - _Requirements: 10.2_

  - [x] 13.4 Fine-tune color palette and styling


    - Apply consistent gothic colors throughout
    - Add box shadows with red glow
    - Add text shadows for depth
    - _Requirements: 10.1_

- [x] 14. Configure deployment





  - [x] 14.1 Create vercel.json configuration
    - Set function timeout to 60 seconds
    - Set memory to 1024 MB
    - Configure environment variables
    - _Requirements: All_

  - [x] 14.2 Add environment variable documentation


    - Document GEMINI_API_KEY requirement
    - Document NEXT_PUBLIC_MAX_FILE_SIZE
    - Create .env.example file
    - _Requirements: All_

  - [x] 14.3 Test deployment on Vercel



    - Deploy to Vercel
    - Verify all features work in production
    - Test with various PDF files
    - _Requirements: All_

- [x] 15. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
