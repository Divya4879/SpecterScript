'use client';

import { useState, useEffect } from 'react';
import { getTheme } from '@/lib/themes';

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState('vampire');

  useEffect(() => {
    // Always use vampire theme
    const theme = getTheme('vampire');
    const root = document.documentElement;
    
    // Remove existing theme classes
    document.documentElement.classList.remove('theme-vampire', 'theme-witch', 'theme-necromancer');
    
    // Add vampire theme class
    document.documentElement.classList.add('theme-vampire');
    
    // Apply CSS custom properties for vampire theme
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-glow', theme.colors.glow);
  }, []);

  const changeTheme = (themeId: string) => {
    // Do nothing - vampire theme only
  };

  return {
    currentTheme: 'vampire',
    changeTheme,
    theme: getTheme('vampire')
  };
}
