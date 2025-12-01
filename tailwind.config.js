/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0a0a0a',
        'charred-grey': '#1a1a1a',
        'blood-red': '#8b0000',
        'parchment': '#d4c5b9',
        'ember-orange': '#ff6b35',
      },
      fontFamily: {
        'cinzel': ['var(--font-cinzel)', 'serif'],
        'crimson': ['var(--font-crimson)', 'serif'],
        'typewriter': ['var(--font-typewriter)', 'monospace'],
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(139, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
