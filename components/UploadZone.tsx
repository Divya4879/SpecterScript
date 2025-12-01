'use client';

import { useState, useCallback } from 'react';

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
  processingStage: 'idle' | 'extracting' | 'haunting' | 'complete';
  disabled?: boolean;
}

export default function UploadZone({ 
  onFileAccepted, 
  isProcessing, 
  processingStage, 
  disabled = false 
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are accepted by the ancient spirits (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('The tome is too large for our mystical powers (max 10MB)');
      return;
    }

    onFileAccepted(file);
  }, [onFileAccepted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isProcessing) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile, disabled, isProcessing]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) {
      setIsDragging(true);
    }
  }, [disabled, isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const getProcessingMessage = () => {
    switch (processingStage) {
      case 'extracting':
        return '🔮 𝔈𝔵𝔱𝔯𝔞𝔠𝔱𝔦𝔫𝔤 𝔞𝔫𝔠𝔦𝔢𝔫𝔱 𝔨𝔫𝔬𝔴𝔩𝔢𝔡𝔤𝔢...';
      case 'haunting':
        return '🧙‍♂️ 𝔦𝔫𝔳𝔬𝔨𝔦𝔫𝔤 𝔞𝔦 𝔰𝔭𝔦𝔯𝔦𝔱𝔰...';
      case 'complete':
        return '✨ ℌ𝔞𝔯𝔳𝔢𝔰𝔱 𝔠𝔬𝔪𝔭𝔩𝔢𝔱𝔢!';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="gothic-frame p-8">
        <h2 className="font-cinzel text-3xl text-blood-red mb-6 text-center text-shadow-gothic">
          𝔖𝔞𝔠𝔯𝔦𝔣𝔦𝔠𝔦𝔞𝔩 𝔄𝔩𝔱𝔞𝔯
        </h2>
        
        <div className="blood-drip-line mb-8"></div>

        {/* Upload Area */}
        <div
          className={`
            relative border-4 border-dashed rounded-lg p-12 text-center
            transition-all duration-500 cursor-pointer group
            ${isDragging 
              ? 'border-ember-orange bg-ember-orange bg-opacity-10 shadow-orange-glow transform scale-105' 
              : 'border-blood-red hover:border-ember-orange hover:bg-blood-red hover:bg-opacity-5'
            }
            ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && !isProcessing && document.getElementById('file-input')?.click()}
        >
          {/* Mystical background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blood-red via-transparent to-ember-orange opacity-5 rounded-lg"></div>
          
          {/* Floating orbs around upload area */}
          <div className="absolute top-4 left-4 text-2xl opacity-60 spirit-orb">✨</div>
          <div className="absolute top-4 right-4 text-2xl opacity-60 spirit-orb" style={{animationDelay: '2s'}}>🌟</div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-60 spirit-orb" style={{animationDelay: '4s'}}>💫</div>
          <div className="absolute bottom-4 right-4 text-2xl opacity-60 spirit-orb" style={{animationDelay: '6s'}}>⭐</div>

          <div className="relative z-10">
            {isProcessing ? (
              <div className="space-y-6">
                <div className="text-6xl animate-spin-slow">🔮</div>
                <p className="font-cinzel text-2xl text-ember-orange glow-pulse">
                  {getProcessingMessage()}
                </p>
                <div className="ritual-progress">
                  <div className="w-full bg-charred-grey rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blood-red to-ember-orange rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-8xl group-hover:animate-bounce transition-all duration-300">
                  {isDragging ? '🔥' : '📜'}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-cinzel text-2xl text-parchment text-shadow-gothic">
                    𝔇𝔯𝔞𝔤 & 𝔇𝔯𝔬𝔭 𝔶𝔬𝔲𝔯 𝔖𝔶𝔩𝔩𝔞𝔟𝔲𝔰 ℑ𝔪𝔞𝔤𝔢
                  </h3>
                  
                  <p className="font-crimson text-lg text-parchment opacity-80">
                    or click to select from thy digital grimoire
                  </p>
                  
                  <div className="text-sm text-parchment opacity-60 font-crimson">
                    📋 Accepted formats: JPG, PNG, GIF, WebP<br/>
                    📏 Maximum size: 10MB of ancient wisdom
                  </div>
                </div>

                <div className="mt-6">
                  <div className="inline-block px-8 py-3 font-cinzel text-lg text-parchment 
                                border-2 border-blood-red rounded bg-charred-grey
                                hover:bg-blood-red hover:text-deep-black
                                transition-all duration-300 shake-hover">
                    ⚡ ℑ𝔫𝔳𝔬𝔨𝔢 𝔞 𝔖𝔞𝔠𝔯𝔦𝔣𝔦𝔠𝔢 ⚡
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || isProcessing}
          />
        </div>

        {/* Cursed Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-blood-red bg-opacity-20 border-2 border-blood-red rounded-lg entrance-fade">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl animate-pulse">💀</span>
              <p className="font-crimson text-parchment text-center">
                <span className="font-cinzel text-blood-red">ℭ𝔲𝔯𝔰𝔢 𝔞𝔠𝔱𝔦𝔳𝔞𝔱𝔢𝔡:</span> {error}
              </p>
              <span className="text-2xl animate-pulse">💀</span>
            </div>
          </div>
        )}

        {/* Mystical instructions */}
        <div className="mt-8 text-center">
          <div className="ancient-scroll-bg p-6">
            <p className="font-crimson text-parchment italic leading-relaxed">
              "Place thy syllabus image upon this sacred altar, and witness as the ancient AI spirits 
              analyze the structure and extract topics for comprehensive lesson plan creation..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
