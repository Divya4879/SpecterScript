'use client';

import { useState } from 'react';

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

export default function SyllabusViewer({ syllabusData, onTopicSelect }: SyllabusViewerProps) {
  const [selectedTopic, setSelectedTopic] = useState<{unit: string, topic: string} | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleTopicClick = (unitTitle: string, topic: string) => {
    setSelectedTopic({ unit: unitTitle, topic });
  };

  const handleOptionSelect = (type: 'overview' | 'indepth' | 'takeaways') => {
    if (selectedTopic) {
      onTopicSelect(selectedTopic.unit, selectedTopic.topic, type);
      setSelectedTopic(null);
    }
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

      {/* Syllabus Scroll */}
      <div className="ancient-scroll">
        <div className="scroll-rod top-rod"></div>
        <div className="scroll-rod bottom-rod"></div>
        
        <div className="scroll-content">
          <div className="scroll-header">
            <div className="scroll-ornament">❦ 𝔖𝔶𝔩𝔩𝔞𝔟𝔲𝔰 𝔗𝔬𝔭𝔦𝔠𝔰 ❦</div>
          </div>
          
          <div className="syllabus-units">
            {syllabusData.units.map((unit) => (
              <div key={unit.id} className="unit-section">
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="unit-header"
                >
                  <span className="unit-icon">
                    {expandedUnits.includes(unit.id) ? '📖' : '📚'}
                  </span>
                  <span className="unit-title">{unit.title}</span>
                  <span className="expand-icon">
                    {expandedUnits.includes(unit.id) ? '▼' : '▶'}
                  </span>
                </button>

                {expandedUnits.includes(unit.id) && (
                  <div className="topics-list">
                    {unit.topics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleTopicClick(unit.title, topic)}
                        className="topic-item"
                      >
                        <span className="topic-bullet">❦</span>
                        <span className="topic-text">{topic}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-aging"></div>
        <div className="scroll-stains"></div>
      </div>

      {/* Topic Options Modal */}
      {selectedTopic && (
        <div className="topic-options-overlay">
          <div className="topic-options-modal">
            <div className="gothic-frame p-6">
              <h3 className="font-cinzel text-2xl text-blood-red mb-4 text-center text-shadow-gothic">
                {selectedTopic.topic}
              </h3>
              
              <div className="blood-drip-line mb-6"></div>
              
              <p className="font-crimson text-parchment text-center mb-6">
                Choose your learning approach:
              </p>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleOptionSelect('overview')}
                  className="option-button"
                >
                  <span className="option-icon">📋</span>
                  <span className="option-text">Quick Overview</span>
                </button>

                <button
                  onClick={() => handleOptionSelect('indepth')}
                  className="option-button"
                >
                  <span className="option-icon">🔍</span>
                  <span className="option-text">In-Depth Explanation</span>
                </button>

                <button
                  onClick={() => handleOptionSelect('takeaways')}
                  className="option-button"
                >
                  <span className="option-icon">💡</span>
                  <span className="option-text">Key Takeaways</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedTopic(null)}
                className="close-button mt-4"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
