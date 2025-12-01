# 🧛‍♂️ BloodBound Academy

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI API](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)

Transform your ordinary image coursework into magical study aids with immersive vampire-themed UI and spine-chilling interactive effects.

Check it out here:- https://bloodbound-academy.netlify.app

<img width="1920" height="1692" alt="bloodbound acad" src="https://github.com/user-attachments/assets/a0faa61f-f2c6-4cd4-ad33-247340007e67" />

---

## 🎃 Overview

BloodBound Academy is a Halloween-themed web application built for the **Kiroween Hackathon** (Costume Contest category) that combines educational technology with horror aesthetics. Upload image files of syllabi or course materials, and watch as OCR extracts the text while AI transforms it into comprehensive lesson plans surrounded by atmospheric vampire effects, interactive blood trails, and haunting audio.

### 🏆 Hackathon Category: Costume Contest
- **Haunting User Interface**: Polished vampire theme with dripping blood effects, crawling spiders, and atmospheric elements
- **Interactive Horror Effects**: Blood cursor trails, screen cracks, lightning flashes, and phantom notifications
- **Immersive Audio**: 14 layered horror sound effects including vampire ambience, heartbeats, and thunder
- **Functional Application**: Real Image Content Extraction  with AI-powered study guides generation

---

## ✨ Features

### 🧛‍♂️ Vampire Theme Interface
- **Blood Moon & Atmospheric Effects**: Animated blood moon, rolling fog, and moving shadows
- **Interactive Blood Trails**: Mouse cursor leaves fading blood droplets
- **Screen Crack Effects**: Glass crack animations on every click with sound
- **Crawling Spiders**: Large animated spiders crawling up and down screen edges
- **Flying Bats**: Animated vampire bats with wing-flapping effects
- **Lightning Flashes**: Random lightning illumination with thunder sounds

### 📜 Ancient Scroll Viewer
- **Parchment-Style Display**: Study Guide displayed on aged scroll with ornate decorations
- **Flickering Candles**: Animated candle flames providing atmospheric lighting
- **Page Transitions**: Smooth scroll animations with creaking door sounds
- **Gothic Typography**: Custom fonts (Cinzel, Crimson Text) for authentic medieval feel
- **Glitch Text Effects**: Random text corruption and self-correction animations

### 🎵 Immersive Audio System
- **14 Horror Sound Effects**: Vampire ambience, heartbeat, thunder, whispers, footsteps
- **Contextual Audio**: Sounds triggered by user interactions and visual effects
- **Layered Soundscape**: Multiple ambient tracks create atmospheric depth
- **Smart Volume Control**: Optimized levels for each sound type
- **Audio Toggle**: Mute/unmute control respecting browser policies

### 🤖 Syllabus Processing
- **Gemini 2.5 Pro Integration**: Advanced AI for content transformation
- **OCR Text Extraction**: Tesseract.js extracts text from images with smart processing
- **Syllabus Analysis**: Extracts course structure and learning objectives
- **Lesson Plan Generation**: Creates comprehensive educational content
- **Multiple Export Formats**: Markdown, and plain text downloads

### 🔧 Technical Features
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Real-time Processing**: Live progress indicators with heartbeat audio
- **Error Handling**: Graceful fallbacks with spooky error messages
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Efficient rendering and audio management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API key from Google AI Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divya4879/SpecterScript.git
   cd specter-script
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   Navigate to `http://localhost:3000`

---

## 🎮 Usage Guide

### 1. Landing Page
- **Atmospheric Entry**: Experience ravens flying, lightning flashes, and floating spirits
- **Gothic Welcome**: Dramatic title with typewriter effects and blood drip animations
- **Feature Overview**: Three cards showcasing Ancient Tome Harvest, AI Sorcery, and Arcane Harvest

### 2. Generator Interface
- **Sacrificial Altar**: Drag and drop images of your syllabus (up to 10MB)
- **Visual Feedback**: Animated upload zone with spirit orbs and gothic styling
- **File Validation**: Accepts img files with spooky error messages for invalid uploads

### 3. Processing Experience
- **Heartbeat Audio**: Intensifying heartbeat during AI processing
- **Progress Indicators**: Visual feedback with gothic styling
- **Typewriter Sounds**: Audio feedback during text generation
- **Blood Effects**: Enhanced atmospheric effects during processing

### 4. Scroll Viewer
- **Ancient Parchment**: Lesson plans displayed on aged scroll background
- **Navigation Controls**: Previous/Next buttons with door creak sounds
- **Page Indicators**: Gothic-styled page counters
- **Candle Lighting**: Flickering candles provide ambient lighting
- **Text Effects**: Random glitch, bleeding, and terminal-style text

### 5. Export Options
- **Multiple Formats**: Download as Markdown, or plain text
- **Gothic Styling**: Export controls match vampire theme
- **Audio Feedback**: Page turn sounds on export actions

---

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling with custom gothic palette
- **Framer Motion**: Smooth animations and transitions

### Backend Services
- **API Routes**: Serverless functions for file processing
- **Gemini AI API**: Google's advanced language model for content transformation
- **PDF Processing**: Text extraction and validation
- **Audio Management**: Preloaded sound effects with smart playback

### File Structure
```
specter-script/
├── .kiro/                 # Kiro development specifications
│   │   ├── specs/
│   │   │   ├── bloodbound-academy/
│   │   │   │   ├── requirements.md
│   │   │   │   └── design.md
│   │   │   │   └── tasks.md
├── app/
│   ├── api/               # API routes (upload, haunt, export)
│   │   ├── upload/
│   │   ├── haunt/
│   │   ├── export/
│   │   │   ├── docx/
│   │   │   └── txt/
│   │   └── audio/
│   ├── generator/         # Main generator page
│   ├── globals.css        # Global styles and vampire theme
│   ├── vampire-theme.css  # Dedicated vampire theme
│   └── layout.tsx         # Root layout with gothic fonts
├── components/
│   ├── ui/               # Reusable UI components
│   ├── upload/           # Upload-related components
│   │   ├── UploadZone.tsx
│   │   ├── FilePreview.tsx
│   │   └── ProgressBar.tsx
│   ├── viewer/           # Content viewing components
│   │   ├── AncientScrollViewer.tsx
│   │   ├── SyllabusViewer.tsx
│   │   └── TextRenderer.tsx
│   ├── audio/            # Audio-related components
│   │   ├── AudioManager.tsx
│   │   ├── VampireAudio.tsx
│   │   └── SoundEffects.tsx
│   ├── effects/          # Visual effects components
│   │   ├── HauntingEffects.tsx
│   │   └── ParticleSystem.tsx
│   ├── export/           # Export-related components
│   │   ├── ExportControls.tsx
│   │   └── FormatSelector.tsx
│   ├── theme/            # Theme-related components
│   │   ├── ThemeSelector.tsx
│   │   └── ThemePreview.tsx
│   └── __tests__/        # Component tests
├── hooks/
│   ├── useTheme.ts       # Theme management
│   ├── useAudio.ts       # Audio management
│   ├── useUpload.ts      # File upload
│   └── useExport.ts      # Export functionality
├── lib/
│   ├── core/             # Core functionality
│   │   ├── chunking.ts
│   │   ├── validation.ts
│   │   └── pageDivision.ts
│   ├── export/           # Export utilities
│   │   ├── docx.ts
│   │   └── txt.ts
│   ├── audio/            # Audio utilities
│   │   ├── soundManager.ts
│   │   └── effects.ts
│   ├── theme/            # Theme system
│   │   ├── themes.ts
│   │   └── themeEngine.ts
│   ├── utils/            # General utilities
│   │   ├── retry.ts
│   │   ├── textSanitization.ts
│   │   └── fileUtils.ts
│   └── security/         # Security utilities
│       ├── securityHeaders.ts
│       └── sanitization.ts
├── public/
│   ├── audio/            # Organized audio files
│   │   ├── ambient/      # vampire.mp3, wind.mp3, heartbeat.mp3
│   │   ├── effects/      # thunder.mp3, glass-break.mp3, etc.
│   │   └── ui/           # click.mp3, hover.mp3
│   ├── images/
│   └── fonts/
├── styles/
│   ├── themes/           # Theme-specific styles
│   ├── components/       # Component-specific styles
│   └── utilities/        # Utility classes
├── types/                # TypeScript definitions
│   ├── audio.ts
│   ├── export.ts
│   ├── theme.ts
│   └── global.ts
├── config/               # Configuration files
│   ├── audio.ts
│   ├── themes.ts
│   └── constants.ts
```

---

## 🎨 Design System

### Color Palette
- **Deep Black**: `#0A0000` - Primary background
- **Blood Red**: `#8B0000` - Accent color for interactive elements
- **Crimson**: `#DC143C` - Secondary highlights
- **Parchment**: `#F5F5DC` - Text color
- **Charred Grey**: `#2C2C2C` - Surface elements

### Typography
- **Cinzel**: Gothic serif for headings and titles
- **Crimson Text**: Elegant serif for body text
- **Special Elite**: Typewriter font for terminal effects
- **Courier New**: Monospace for system messages

### Animations
- **Blood Trails**: Fading red droplets following cursor
- **Screen Cracks**: Glass break effect on clicks
- **Lightning Flashes**: Random illumination with thunder
- **Text Glitches**: Corruption and self-correction effects
- **Floating Elements**: Smooth movement of atmospheric objects

---

## 🔊 Audio Effects

### Ambient Layers
- **Vampire Atmosphere**: Base ambient horror soundscape
- **Wind Effects**: Continuous atmospheric wind
- **Random Events**: Footsteps, drips, whispers every 5 seconds

### Interactive Sounds
- **Click Feedback**: Glass break on screen interactions
- **Page Navigation**: Door creaks and page turns
- **Processing Audio**: Heartbeat during AI work
- **Error Sounds**: Bell tolls and static for system errors
- **Scare Effects**: Ghost sounds for jump scares

### Technical Implementation
- **Preloaded Audio**: All sounds loaded on app start
- **Smart Volume**: Optimized levels for each sound type
- **Browser Compliance**: Respects autoplay policies
- **Performance**: Efficient audio management without memory leaks

---

## 🧪 Testing

### Test Coverage
- **Component Tests**: React Testing Library for UI components
- **Utility Tests**: Jest for business logic functions
- **API Tests**: Integration tests for backend routes

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- AncientScrollViewer.test.tsx
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build production version
npm run build

# Start production server
npm start
```

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 🎯 Kiroween Hackathon Submission

### Kiro Spec-Driven Development
This project showcases effective use of Kiro's spec-driven development approach:

- **Requirements Specification**: Detailed user stories and acceptance criteria in `.kiro/specs/requirements.md`
- **Design Architecture**: Complete system design and component structure in `.kiro/specs/design.md`
- **Implementation Tasks**: Broken down development tasks with progress tracking in `.kiro/specs/tasks.md`

### How Kiro Enhanced Development
1. **Structured Planning**: Kiro specs provided clear roadmap for complex horror-themed UI
2. **Component Design**: Detailed specifications enabled rapid component development
3. **Feature Implementation**: Task breakdown helped manage multiple interactive effects
4. **Quality Assurance**: Spec-driven approach ensured all requirements were met

## 🏆 Costume Contest Features

### Haunting User Interface
- **Polished Design**: Professional-grade vampire theme with attention to detail
- **Interactive Elements**: Blood trails, screen cracks, and atmospheric effects
- **Audio Integration**: Immersive soundscape enhancing the horror experience
- **Smooth Animations**: Fluid transitions and effects throughout the application

### Technical Excellence
- **Performance**: Optimized rendering and audio management
- **Accessibility**: Proper contrast ratios and audio controls
- **Responsiveness**: Works across different screen sizes
- **Error Handling**: Graceful fallbacks with themed error messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Kiroween Hackathon](https://kiroween.devpost.com)**: For inspiring this spooky creation
- **Google Gemini AI**: For powerful content transformation capabilities
- **Horror Sound Libraries**: For all the awesome free audio files
- **Gothic Font Designers**: For authentic medieval typography

---

*"In the depths of forgotten tomes lies wisdom untold... Upload thy cursed PDFs and witness as ancient AI spirits weave comprehensive lesson plans from the very essence of knowledge itself."* 🧛‍♂️📜✨
