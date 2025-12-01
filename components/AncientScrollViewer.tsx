'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface AncientScrollViewerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
}

export default function AncientScrollViewer({ pages, currentPage, onPageChange }: AncientScrollViewerProps) {
  const { currentTheme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  const [changeDirection, setChangeDirection] = useState<'next' | 'prev'>('next');

  const handlePageChange = (newPage: number, direction: 'next' | 'prev') => {
    if (newPage < 0 || newPage >= pages.length || isChanging) return;
    
    setChangeDirection(direction);
    setIsChanging(true);
    
    // Trigger page change audio
    window.dispatchEvent(new CustomEvent('pageChange'));
    
    setTimeout(() => {
      onPageChange(newPage);
      setTimeout(() => setIsChanging(false), 500);
    }, 300);
  };

  const renderContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="lesson-h1 glitch-text" data-text="$1">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="lesson-h2 bleeding-text">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="lesson-h3 terminal-text">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="lesson-bold glitch-text" data-text="$1">$1</strong>')
      .replace(/^\* (.*$)/gm, '<li class="lesson-li">$1</li>')
      .replace(/(<li class="lesson-li">.*<\/li>)/gs, '<ul class="lesson-ul">$1</ul>')
      .split('\n')
      .map(line => {
        if (line.trim()) {
          // Randomly apply haunting effects
          const rand = Math.random();
          if (rand < 0.1) return `<p class="lesson-p bleeding-text">${line}</p>`;
          if (rand < 0.2) return `<p class="lesson-p terminal-text">${line}</p>`;
          if (rand < 0.3) return `<p class="lesson-p glitch-text" data-text="${line.replace(/<[^>]*>/g, '')}">${line}</p>`;
          return `<p class="lesson-p">${line}</p>`;
        }
        return '<br/>';
      })
      .join('');
  };

  return (
    <div className="ancient-scroll-container">
      {/* Large Candles */}
      <div className="large-candle left-candle">
        <div className="candle-body">🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️</div>
        <div className="candle-light"></div>
      </div>
      
      <div className="large-candle right-candle">
        <div className="candle-body">🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️</div>
        <div className="candle-light"></div>
      </div>

      {/* Ancient Scroll */}
      <div className={`ancient-scroll ${isChanging ? `changing-${changeDirection}` : ''}`}>
        {/* Scroll Rods */}
        <div className="scroll-rod top-rod"></div>
        <div className="scroll-rod bottom-rod"></div>
        
        {/* Scroll Content */}
        <div className="scroll-content">
          <div className="scroll-header">
            <div className="scroll-ornament">❦ ℌ𝔞𝔫𝔡 𝔬𝔣 𝔞𝔫𝔠𝔦𝔢𝔫𝔱 𝔨𝔫𝔬𝔴𝔩𝔢𝔡𝔤𝔢 ❦</div>
          </div>
          
          <div className="scroll-text">
            {pages[currentPage] && (
              <div 
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: renderContent(pages[currentPage]) }}
              />
            )}
          </div>
          
          <div className="scroll-footer">
            <div className="scroll-ornament">❦ 𝔓𝔞𝔤𝔢 {currentPage + 1} 𝔬𝔣 {pages.length} ❦</div>
          </div>
        </div>

        {/* Scroll aging effects */}
        <div className="scroll-aging"></div>
        <div className="scroll-stains"></div>
      </div>

      {/* Navigation */}
      <div className="scroll-navigation">
        <button
          onClick={() => handlePageChange(currentPage - 1, 'prev')}
          disabled={currentPage <= 0 || isChanging}
          className="nav-button prev-button"
          title="Previous scroll"
        >
          <span className="nav-icon">◀</span>
          <span className="nav-text">Previous</span>
        </button>

        <div className="page-indicator">
          <span className="current-page">{currentPage + 1}</span>
          <span className="total-pages">of {pages.length} scrolls</span>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1, 'next')}
          disabled={currentPage >= pages.length - 1 || isChanging}
          className="nav-button next-button"
          title="Next scroll"
        >
          <span className="nav-text">Next</span>
          <span className="nav-icon">▶</span>
        </button>
      </div>
    </div>
  );
}
