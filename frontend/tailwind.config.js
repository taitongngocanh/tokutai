/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['Orbitron', 'Impact', 'sans-serif'],
      },
      colors: {
        bronze: '#cd7f32',
        gold: '#ffd700',
        diamond: '#b9f2ff',
        quest: {
          dark: '#0f0f1a',
          card: '#1a1a2e',
          accent: '#4a90d9',
          success: '#2ecc71',
          danger: '#e74c3c',
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'xp-bar': 'xpFill 0.8s ease-out forwards',
      },
      keyframes: {
        xpFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-progress)%' },
        }
      }
    },
  },
  plugins: [],
}
