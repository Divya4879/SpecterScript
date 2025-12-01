'use client';

import React from 'react';

interface ExportControlsProps {
  hauntedContent: string;
  filename: string;
  onExport: (format: 'md' | 'txt') => void;
  disabled?: boolean;
}

export default function ExportControls({
  hauntedContent,
  filename,
  onExport,
  disabled = false,
}: ExportControlsProps) {
  const handleExport = (format: 'md' | 'txt') => {
    if (!disabled && hauntedContent) {
      onExport(format);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="gothic-frame p-8">
        <div className="text-center mb-8">
          <div className="skull-decoration mb-4">💀📜💀</div>
          
          <h2 className="font-cinzel text-3xl text-blood-red mb-4 text-shadow-gothic">
            ℌ𝔞𝔯𝔳𝔢𝔰𝔱 𝔞𝔫𝔡 ℌ𝔞𝔯𝔫𝔢𝔰𝔰
          </h2>
          
          <div className="blood-drip-line mb-6"></div>
          
          <p className="font-cinzel text-xl text-ember-orange glow-pulse">
            ℭ𝔞𝔰𝔱 𝔶𝔬𝔲𝔯 𝔩𝔢𝔰𝔰𝔬𝔫 𝔦𝔫𝔱𝔬 𝔞 𝔪𝔬𝔯𝔱𝔞𝔩 𝔣𝔬𝔯𝔪
          </p>
        </div>
        
        {/* Export Ritual Circles */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Markdown Export Altar */}
          <div className="export-altar group">
            <div className="relative">
              {/* Mystical glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-ember-orange via-transparent to-blood-red opacity-20 rounded-lg blur-sm group-hover:opacity-40 transition-all duration-500"></div>
              
              <button
                onClick={() => handleExport('md')}
                disabled={disabled || !hauntedContent}
                className={`
                  relative w-full p-8 font-cinzel text-lg text-parchment 
                  border-4 border-ember-orange rounded-lg bg-charred-grey
                  transition-all duration-500 group
                  ${disabled || !hauntedContent
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-ember-orange hover:text-deep-black hover:scale-105 hover:rotate-1 shake-hover'
                  }
                `}
                aria-label="Export as Markdown"
              >
                {/* Floating symbols */}
                <div className="absolute top-2 left-2 text-2xl opacity-60 spirit-orb">📝</div>
                <div className="absolute top-2 right-2 text-2xl opacity-60 spirit-orb" style={{animationDelay: '1s'}}>✨</div>
                <div className="absolute bottom-2 left-2 text-2xl opacity-60 spirit-orb" style={{animationDelay: '2s'}}>🌟</div>
                <div className="absolute bottom-2 right-2 text-2xl opacity-60 spirit-orb" style={{animationDelay: '3s'}}>💫</div>

                <div className="relative z-10 space-y-4">
                  <div className="text-5xl group-hover:animate-bounce">📝</div>
                  <div className="text-xl text-shadow-gothic">
                    𝔐𝔞𝔯𝔨𝔡𝔬𝔴𝔫 ℌ𝔞𝔯𝔳𝔢𝔰𝔱
                  </div>
                  <div className="text-sm opacity-80 font-crimson">
                    Structured formatting with mystical markdown powers
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Text Export Altar */}
          <div className="export-altar group">
            <div className="relative">
              {/* Mystical glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blood-red via-transparent to-ember-orange opacity-20 rounded-lg blur-sm group-hover:opacity-40 transition-all duration-500"></div>
              
              <button
                onClick={() => handleExport('txt')}
                disabled={disabled || !hauntedContent}
                className={`
                  relative w-full p-8 font-cinzel text-lg text-parchment 
                  border-4 border-blood-red rounded-lg bg-charred-grey
                  transition-all duration-500 group
                  ${disabled || !hauntedContent
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-blood-red hover:text-deep-black hover:scale-105 hover:rotate-1 shake-hover'
                  }
                `}
                aria-label="Export as plain text"
              >
                {/* Floating symbols */}
                <div className="absolute top-2 left-2 text-2xl opacity-60 spirit-orb">📄</div>
                <div className="absolute top-2 right-2 text-2xl opacity-60 spirit-orb" style={{animationDelay: '1.5s'}}>✨</div>
                <div className="absolute bottom-2 left-2 text-2xl opacity-60 spirit-orb" style={{animationDelay: '3s'}}>🌟</div>
                <div className="absolute bottom-2 right-2 text-2xl opacity-60 spirit-orb" style={{animationDelay: '4.5s'}}>💫</div>

                <div className="relative z-10 space-y-4">
                  <div className="text-5xl group-hover:animate-bounce">📄</div>
                  <div className="text-xl text-shadow-gothic">
                    ℌ𝔞𝔯𝔳𝔢𝔰𝔱 𝔞𝔰 𝔗𝔢𝔵𝔱
                  </div>
                  <div className="text-sm opacity-80 font-crimson">
                    Pure knowledge in its most ancient form
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Filename Display */}
        {hauntedContent && (
          <div className="text-center">
            <div className="ancient-scroll-bg p-4 inline-block">
              <p className="text-parchment font-crimson">
                <span className="font-cinzel text-ember-orange">ℌ𝔞𝔯𝔳𝔢𝔰𝔱𝔦𝔫𝔤:</span> {filename}
              </p>
            </div>
          </div>
        )}

        {/* Mystical instructions */}
        <div className="mt-8 text-center">
          <div className="ancient-scroll-bg p-6">
            <p className="font-crimson text-parchment italic leading-relaxed text-sm">
              "Choose thy vessel wisely, for each format carries different mystical properties. 
              Markdown preserves the sacred structure, while plain text offers pure, unadorned wisdom..."
            </p>
          </div>
        </div>

        <div className="skull-decoration mt-6">💀📜💀</div>
      </div>
    </div>
  );
}
