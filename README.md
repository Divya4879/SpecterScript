# SpecterScript

Transform your PDF coursework into haunted, gothic horror versions using AI.

## Features

- 📄 PDF upload with drag-and-drop support
- 🎃 AI-powered haunted text transformation using Gemini 2.5 Pro
- 👻 Atmospheric gothic viewer with flickering candles and fog effects
- 📖 Page-by-page navigation with glitch transitions
- 💾 Export to PDF, Markdown, or TXT formats
- ♿ Accessibility features including non-flicker mode
- 🔒 Secure processing with no permanent file storage

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and add your Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NODE_ENV=development
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository

3. Configure environment variables in Vercel:
   - Add `GEMINI_API_KEY` with your API key
   - Add `NEXT_PUBLIC_MAX_FILE_SIZE` (default: 10485760)

4. Deploy:
   - Vercel will automatically build and deploy your application
   - The `vercel.json` configuration sets function timeout to 60 seconds and memory to 1024 MB

5. Test your deployment:
   - Upload various PDF files (small, large, multi-page)
   - Verify text extraction works correctly
   - Test AI transformation with different content
   - Check all export formats (PDF, Markdown, TXT)
   - Verify animations and effects render properly
   - Test accessibility features (non-flicker mode, audio toggle)

### Vercel Configuration

The project includes a `vercel.json` file that configures:
- Function timeout: 60 seconds (for AI processing)
- Memory allocation: 1024 MB (for PDF processing)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS with custom gothic theme
- **Animations**: Framer Motion + CSS keyframes
- **PDF Processing**: pdf-parse, pdfkit
- **AI**: Google Gemini 2.5 Pro API
- **Testing**: fast-check (property-based testing)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles and animations
│   └── api/                # API routes (to be implemented)
├── components/             # React components (to be implemented)
├── .env.local              # Environment variables (not in git)
├── .env.example            # Example environment variables
├── tailwind.config.js      # TailwindCSS configuration
└── next.config.mjs         # Next.js configuration
```

## Gothic Design System

### Color Palette
- Deep Black: `#0a0a0a`
- Charred Grey: `#1a1a1a`
- Blood Red: `#8b0000`
- Parchment: `#d4c5b9`
- Ember Orange: `#ff6b35`

### Typography
- Primary: Cinzel (gothic serif)
- Body: Crimson Text (readable serif)
- Monospace: Special Elite (typewriter)

## License

MIT
# SpecterScript
