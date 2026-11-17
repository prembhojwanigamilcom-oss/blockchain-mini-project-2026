/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F3F0E8',
          light: '#F8F6F0',
          dark: '#E8E3D7',
        },
        forest: {
          DEFAULT: '#182C2A',
          deep: '#0F1E1C',
          surface: '#203936',
          light: '#2A4A46',
        },
        stone: {
          muted: '#D8D2C5',
          light: '#E5E1D8',
          dark: '#B8B0A0',
        },
        gold: {
          DEFAULT: '#9C815D',
          hover: '#876F4E',
          light: '#C7B69D',
          dark: '#735F43',
        },
        'soft-white': '#FAF9F5',
        veritas: {
          crimson: '#8B2635', // For revocation / tampered states
          emerald: '#235347', // For authentic badge
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(24, 44, 42, 0.05), 0 1px 2px 0 rgba(24, 44, 42, 0.03)',
        'elevated': '0 4px 20px -2px rgba(24, 44, 42, 0.08)',
        'modal': '0 20px 40px -10px rgba(15, 30, 28, 0.25)',
      },
      borderWidth: {
        'hairline': '1px',
      }
    },
  },
  plugins: [],
}
