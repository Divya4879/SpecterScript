'use client';

import { useState, useEffect } from 'react';
import { themes, getTheme, Theme } from '@/lib/themes';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = getTheme(currentTheme);

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div className="relative">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-charred-grey border-2 border-blood-red rounded-lg
                   hover:bg-blood-red hover:text-deep-black
                   transition-all duration-300 shake-hover
                   shadow-red-glow"
          aria-label="Change theme"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎭</span>
            <span className="font-cinzel text-sm hidden md:block">
              𝔗𝔥𝔢𝔪𝔢
            </span>
          </div>
        </button>

        {/* Theme Dropdown */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 entrance-fade z-[9999]">
            <div className="gothic-frame p-4">
              <h3 className="font-cinzel text-xl text-blood-red mb-4 text-center text-shadow-gothic">
                ℭ𝔥𝔬𝔬𝔰𝔢 𝔶𝔬𝔲𝔯 𝔇𝔞𝔯𝔨 ℌ𝔢𝔯𝔦𝔱𝔞𝔤𝔢
              </h3>
              
              <div className="blood-drip-line mb-4"></div>

              <div className="space-y-3">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      onThemeChange(themeOption.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all duration-300
                      font-cinzel text-left group relative overflow-hidden
                      ${currentTheme === themeOption.id
                        ? 'border-ember-orange bg-ember-orange bg-opacity-20 shadow-orange-glow'
                        : 'border-blood-red bg-charred-grey hover:border-ember-orange hover:bg-blood-red hover:bg-opacity-10'
                      }
                    `}
                  >
                    {/* Theme preview background */}
                    <div 
                      className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(45deg, ${themeOption.colors.primary}, ${themeOption.colors.secondary})`
                      }}
                    ></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg text-shadow-gothic">
                          {themeOption.displayName}
                        </span>
                        {currentTheme === themeOption.id && (
                          <span className="text-ember-orange animate-pulse">✨</span>
                        )}
                      </div>
                      
                      <div className="text-sm text-parchment opacity-80 font-crimson">
                        {themeOption.id === 'vampire' && 'Blood-soaked crimson magnificence with vampire bats and blood moon'}
                        {themeOption.id === 'witch' && 'Mystical purple enchantments with cauldrons and spell circles'}
                        {themeOption.id === 'necromancer' && 'Deathly green necromancy with skeletal hands and soul orbs'}
                      </div>

                      {/* Theme color preview */}
                      <div className="flex space-x-2 mt-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-parchment"
                          style={{ backgroundColor: themeOption.colors.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full border border-parchment"
                          style={{ backgroundColor: themeOption.colors.secondary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full border border-parchment"
                          style={{ backgroundColor: themeOption.colors.accent }}
                        ></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-parchment opacity-60 font-crimson italic">
                  "Each theme carries its own dark magic and atmospheric power..."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
