'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import VampireAudio from '@/components/VampireAudio';
import UploadZone from '@/components/UploadZone';
import SyllabusViewer from '@/components/SyllabusViewer';
import AncientScrollViewer from '@/components/AncientScrollViewer';
import ExportControls from '@/components/ExportControls';
import HauntingEffects from '@/components/HauntingEffects';
import { divideIntoPages } from '@/lib/pageDivision';
import { exportAsTxt, exportAsMarkdown } from '@/lib/export';

interface AppState {
  uploadedFile: File | null;
  contentType: 'syllabus' | 'text' | null;
  syllabusData: any;
  extractedText: string;
  extractionStatus: 'success' | 'fallback' | 'empty' | null;
  extractionMessage: string;
  hauntedContent: string;
  pages: string[];
  currentPage: number;
  isProcessing: boolean;
  processingStage: 'idle' | 'extracting' | 'syllabus' | 'choosing' | 'haunting' | 'complete';
  error: string | null;
  settings: {
    enableFlicker: boolean;
    enableAudio: boolean;
    pageSize: number;
  };
}

export default function Generator() {
  const { currentTheme, changeTheme } = useTheme();
  const [state, setState] = useState<AppState>({
    uploadedFile: null,
    contentType: null,
    syllabusData: null,
    extractedText: '',
    extractionStatus: null,
    extractionMessage: '',
    hauntedContent: '',
    pages: [],
    currentPage: 0,
    isProcessing: false,
    processingStage: 'idle',
    error: null,
    settings: {
      enableFlicker: true,
      enableAudio: false,
      pageSize: 1000,
    },
  });

  const handleFileAccepted = async (file: File) => {
    setState(prev => ({
      ...prev,
      uploadedFile: file,
      extractedText: '',
      hauntedContent: '',
      pages: [],
      currentPage: 0,
      isProcessing: true,
      processingStage: 'extracting',
      error: null,
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to extract text from PDF');
      }

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'An error occurred during PDF processing.');
      }

      if (uploadData.type === 'syllabus') {
        setState(prev => ({
          ...prev,
          contentType: 'syllabus',
          syllabusData: uploadData.syllabusData,
          extractionStatus: uploadData.extractionStatus || 'success',
          extractionMessage: uploadData.extractionMessage || 'Syllabus analyzed successfully',
          processingStage: 'syllabus',
          isProcessing: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          contentType: 'text',
          extractedText: uploadData.extractedText,
          extractionStatus: uploadData.extractionStatus || 'success',
          extractionMessage: uploadData.extractionMessage || 'Text extracted successfully',
          processingStage: 'choosing',
          isProcessing: false,
        }));
      }
    } catch (error) {
      console.error('Processing error:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        processingStage: 'idle',
        error: (error as Error).message,
      }));
    }
  };

  const handlePageChange = (pageIndex: number) => {
    setState(prev => ({
      ...prev,
      currentPage: pageIndex,
    }));
  };

  const handleSettingsChange = (newSettings: Partial<AppState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));

    if (newSettings.pageSize && state.hauntedContent) {
      const pages = divideIntoPages(state.hauntedContent, newSettings.pageSize);
      setState(prev => ({
        ...prev,
        pages,
        currentPage: Math.min(prev.currentPage, pages.length - 1),
      }));
    }
  };

  const handleExport = async (format: 'md' | 'txt') => {
    if (!state.hauntedContent) return;

    const filename = state.uploadedFile
      ? state.uploadedFile.name.replace(/\.[^/.]+$/, '')
      : 'lesson_plan';

    try {
      if (format === 'txt') {
        exportAsTxt(state.hauntedContent, filename);
      } else if (format === 'md') {
        exportAsMarkdown(state.hauntedContent, filename);
      }
    } catch (error) {
      console.error('Export error:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to export file. Please try again.',
      }));
    }
  };

  const handleProcessingChoice = async (prompt: string, text: string) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      processingStage: 'haunting',
    }));

    try {
      const hauntResponse = await fetch('/api/haunt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `${prompt}\n\n${text}`,
          chunkSize: 30000,
        }),
      });

      if (!hauntResponse.ok) {
        const errorData = await hauntResponse.json();
        throw new Error(errorData.error || 'AI service rate limit exceeded. Please try again later.');
      }

      const hauntData = await hauntResponse.json();
      if (!hauntData.success) {
        throw new Error(hauntData.error || 'AI processing failed. Please try again later.');
      }

      const pages = divideIntoPages(hauntData.hauntedText, state.settings.pageSize);

      setState(prev => ({
        ...prev,
        hauntedContent: hauntData.hauntedText,
        pages,
        currentPage: 0,
        isProcessing: false,
        processingStage: 'complete',
      }));
    } catch (error) {
      console.error('Processing error:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        processingStage: 'choosing',
        error: (error as Error).message,
      }));
    }
  };

  const handleTopicSelect = async (unitTitle: string, topic: string, type: 'overview' | 'indepth' | 'takeaways') => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      processingStage: 'haunting',
    }));

    const prompts = {
      overview: `Provide a comprehensive overview of "${topic}" from the unit "${unitTitle}". Include the main concepts, key definitions, and important points that explain what this topic is about. Use clear headings and bullet points.`,
      indepth: `Provide an in-depth explanation of "${topic}" from the unit "${unitTitle}". Include detailed explanations, examples, step-by-step breakdowns, and comprehensive coverage of all aspects of this topic. Use proper headings and formatting.`,
      takeaways: `Provide the key takeaways for "${topic}" from the unit "${unitTitle}". Focus on the most important facts, concepts, and information that someone must know about this topic. Present as clear, memorable points.`
    };

    try {
      const hauntResponse = await fetch('/api/haunt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `${prompts[type]}\n\nTopic: ${topic}\nUnit: ${unitTitle}`,
          chunkSize: 30000,
        }),
      });

      if (!hauntResponse.ok) {
        const errorData = await hauntResponse.json();
        throw new Error(errorData.error || 'AI service rate limit exceeded. Please try again later.');
      }

      const hauntData = await hauntResponse.json();
      if (!hauntData.success) {
        throw new Error(hauntData.error || 'AI processing failed. Please try again later.');
      }

      const pages = divideIntoPages(hauntData.hauntedText, state.settings.pageSize);

      setState(prev => ({
        ...prev,
        hauntedContent: hauntData.hauntedText,
        pages,
        currentPage: 0,
        isProcessing: false,
        processingStage: 'complete',
      }));
    } catch (error) {
      console.error('Processing error:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        processingStage: 'syllabus',
        error: (error as Error).message,
      }));
    }
  };

  return (
    <div className={`min-h-screen bg-deep-black text-parchment overflow-hidden relative ${currentTheme}`}>
      {/* Haunting Interactive Effects */}
      <HauntingEffects />

      {/* Vampire Audio Control */}
      {currentTheme === 'vampire' && <VampireAudio />}

      {/* Vampire Theme Effects */}
      {currentTheme === 'vampire' && (
        <>
          <div className="blood-moon"></div>
          <div className="blood-rain"></div>
          <div className="vampire-bats">
            <div className="bat">🦇</div>
            <div className="bat">🦇</div>
            <div className="bat">🦇</div>
          </div>
          <div className="blood-drops">
            <div className="blood-drop" style={{left: '10%', top: '20%', animationDelay: '0s'}}>🩸</div>
            <div className="blood-drop" style={{left: '80%', top: '40%', animationDelay: '2s'}}>🩸</div>
            <div className="blood-drop" style={{left: '60%', top: '60%', animationDelay: '4s'}}>🩸</div>
            <div className="blood-drop" style={{left: '30%', top: '80%', animationDelay: '1s'}}>🩸</div>
            <div className="blood-drop" style={{left: '90%', top: '10%', animationDelay: '3s'}}>🩸</div>
          </div>
          <div className="crimson-mist"></div>
          <div className="blood-lightning"></div>
          <div className="pulsing-veins"></div>
          <div className="vampire-eyes">
            <div className="vampire-eye" style={{left: '5%', top: '15%', animationDelay: '0s'}}></div>
            <div className="vampire-eye" style={{left: '95%', top: '25%', animationDelay: '1s'}}></div>
            <div className="vampire-eye" style={{left: '10%', top: '85%', animationDelay: '2s'}}></div>
            <div className="vampire-eye" style={{left: '90%', top: '75%', animationDelay: '1.5s'}}></div>
          </div>
          <div className="crawling-spiders">
            <div className="spider spider-1">🕷️</div>
            <div className="spider spider-2">🕷️</div>
            <div className="spider spider-3">🕷️</div>
            <div className="spider spider-4">🕷️</div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Dramatic Header with return link */}
        <header className="text-center mb-16 entrance-fade">
          <div className="gothic-frame p-8 mb-8 max-w-4xl mx-auto">
            <div className="skull-decoration mb-4">💀⚔️💀</div>
            
            <h1 className="font-cinzel text-6xl md:text-8xl text-blood-red mb-6 text-shadow-deep typewriter-effect">
              𝔄𝔯𝔠𝔞𝔫𝔢 𝔄𝔩𝔠𝔥𝔢𝔪𝔶
            </h1>
            
            <div className="blood-drip-line mb-6"></div>
            
            <p className="font-cinzel text-2xl md:text-3xl text-ember-orange glow-pulse mb-6">
              ℌ𝔞𝔯𝔳𝔢𝔰𝔱 𝔞𝔫𝔡 𝔗𝔯𝔞𝔫𝔰𝔪𝔲𝔱𝔢 𝔎𝔫𝔬𝔴𝔩𝔢𝔡𝔤𝔢
            </p>

            <Link 
              href="/"
              className="inline-block px-6 py-2 font-cinzel text-lg text-parchment 
                       border-2 border-ember-orange rounded
                       hover:bg-ember-orange hover:text-deep-black
                       transition-all duration-300 shake-hover mb-4"
            >
              ← ℜ𝔢𝔱𝔲𝔯𝔫 𝔱𝔬 ℭ𝔯𝔶𝔭𝔱
            </Link>

            <div className="skull-decoration">💀⚔️💀</div>
          </div>
        </header>

        {/* Cursed Error Display */}
        {state.error && (
          <div className="max-w-4xl mx-auto mb-8 entrance-fade">
            <div className="bg-blood-red bg-opacity-20 border-4 border-blood-red rounded-lg p-6 
                          shadow-red-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blood-red to-transparent opacity-10 animate-pulse"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-2">⚠️💀⚠️</div>
                <p className="text-parchment font-crimson text-lg">
                  <span className="font-cinzel text-blood-red">𝔄 ℭ𝔲𝔯𝔰𝔢 ℌ𝔞𝔰 𝔅𝔢𝔣𝔞𝔩𝔩𝔢𝔫:</span><br/>
                  {state.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Ritual Area */}
        <div className="space-y-12">
          
          {/* Upload Sanctum */}
          {!state.hauntedContent && (
            <div className="entrance-fade" style={{animationDelay: '0.5s'}}>
              <UploadZone
                onFileAccepted={handleFileAccepted}
                isProcessing={state.isProcessing}
                processingStage={state.processingStage}
                disabled={state.isProcessing}
              />
            </div>
          )}

          {/* Syllabus Viewer */}
          {state.processingStage === 'syllabus' && state.syllabusData && (
            <div className="entrance-fade" style={{animationDelay: '0.5s'}}>
              <SyllabusViewer
                syllabusData={state.syllabusData}
                onTopicSelect={handleTopicSelect}
              />
            </div>
          )}

          {/* Sacred Viewer */}
          {state.hauntedContent && (
            <div className="entrance-fade" style={{animationDelay: '1s'}}>
              <AncientScrollViewer
                pages={state.pages}
                currentPage={state.currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Export Altar */}
          {state.hauntedContent && (
            <div className="entrance-fade" style={{animationDelay: '1.5s'}}>
              <ExportControls
                hauntedContent={state.hauntedContent}
                filename={
                  state.uploadedFile
                    ? state.uploadedFile.name.replace(/\.[^/.]+$/, '')
                    : 'lesson_plan'
                }
                onExport={handleExport}
              />
            </div>
          )}
        </div>
      </div>

      {/* Atmospheric candles */}
      {state.settings.enableFlicker && (
        <>
          <div className="fixed top-8 left-8 candle-realistic opacity-70">🕯️</div>
          <div className="fixed top-16 right-12 candle-realistic opacity-70" style={{animationDelay: '1.2s'}}>🕯️</div>
          <div className="fixed bottom-12 left-16 candle-realistic opacity-70" style={{animationDelay: '2.4s'}}>🕯️</div>
          <div className="fixed bottom-8 right-8 candle-realistic opacity-70" style={{animationDelay: '0.8s'}}>🕯️</div>
        </>
      )}

      {/* Corner enchantments */}
      <div className="fixed top-0 left-0 text-4xl opacity-20 web-sway">🕸️</div>
      <div className="fixed top-0 right-0 text-4xl opacity-20 web-sway" style={{animationDelay: '3s'}}>🕸️</div>
      <div className="fixed bottom-0 left-0 text-4xl opacity-20 web-sway" style={{animationDelay: '6s'}}>🕸️</div>
      <div className="fixed bottom-0 right-0 text-4xl opacity-20 web-sway" style={{animationDelay: '9s'}}>🕸️</div>
    </div>
  );
}
