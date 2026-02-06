/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['Space Mono', 'Courier Prime', 'monospace'],
        sans: ['Space Mono', 'Courier Prime', 'monospace'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
        canvas: {
          white: '#FAFAFA',
        },
        charcoal: '#1A1A1A',
        yarn: {
          blue: '#4A90E2',
        },
        accent: {
          green: '#2ECC71',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
