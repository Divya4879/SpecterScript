export interface Theme {
  id: string;
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    glow: string;
  };
  effects: {
    backgroundElements: string[];
    floatingElements: string[];
    atmosphericEffects: string[];
    cursorEffect?: string;
  };
  fonts: {
    title: string;
    heading: string;
    body: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'vampire',
    name: 'vampire',
    displayName: '🧛‍♂️ 𝔙𝔞𝔪𝔭𝔦𝔯𝔢 𝔏𝔬𝔯𝔡',
    colors: {
      primary: '#8B0000',      // Deep crimson
      secondary: '#DC143C',    // Crimson red  
      accent: '#B22222',       // Fire brick red
      background: '#0A0000',   // Deep blood black
      surface: '#1A0000',      // Dark blood
      text: '#F5F5DC',         // Bone white
      textSecondary: '#CD5C5C', // Indian red
      border: '#8B0000',       // Deep crimson
      glow: '#DC143C',         // Crimson glow
    },
    effects: {
      backgroundElements: ['blood-moon', 'blood-rain', 'crimson-mist', 'vampire-bats'],
      floatingElements: ['blood-drops', 'crimson-orbs', 'vampire-eyes'],
      atmosphericEffects: ['blood-lightning', 'crimson-fog', 'pulsing-veins'],
      cursorEffect: 'blood-trail'
    },
    fonts: {
      title: 'Cinzel',
      heading: 'Cinzel', 
      body: 'Crimson Text'
    }
  },
  // Placeholder for future themes
  {
    id: 'witch',
    name: 'witch',
    displayName: '🧙‍♀️ 𝔚𝔦𝔱𝔠𝔥 ℭ𝔬𝔳𝔢𝔫',
    colors: {
      primary: '#4B0082',
      secondary: '#8A2BE2', 
      accent: '#9932CC',
      background: '#000000',
      surface: '#1C1C1C',
      text: '#E6E6FA',
      textSecondary: '#DDA0DD',
      border: '#4B0082',
      glow: '#8A2BE2',
    },
    effects: {
      backgroundElements: ['purple-moon', 'witch-cauldron', 'mystical-smoke'],
      floatingElements: ['magic-sparkles', 'potion-bubbles', 'crystal-orbs'],
      atmosphericEffects: ['purple-lightning', 'mystical-fog', 'spell-circles'],
    },
    fonts: {
      title: 'Cinzel',
      heading: 'Cinzel',
      body: 'Crimson Text'
    }
  },
  {
    id: 'necromancer', 
    name: 'necromancer',
    displayName: '💀 𝔑𝔢𝔠𝔯𝔬𝔪𝔞𝔫𝔠𝔢𝔯',
    colors: {
      primary: '#2F4F2F',
      secondary: '#228B22',
      accent: '#32CD32', 
      background: '#000000',
      surface: '#0F0F0F',
      text: '#F0FFF0',
      textSecondary: '#90EE90',
      border: '#2F4F2F',
      glow: '#32CD32',
    },
    effects: {
      backgroundElements: ['green-moon', 'graveyard-mist', 'skeleton-hands'],
      floatingElements: ['soul-orbs', 'bone-fragments', 'ghostly-wisps'],
      atmosphericEffects: ['necro-lightning', 'death-fog', 'summoning-circles'],
    },
    fonts: {
      title: 'Cinzel',
      heading: 'Cinzel',
      body: 'Crimson Text'
    }
  }
];

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};
