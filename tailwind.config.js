/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        f1: {
          red: '#e10600',
          darkRed: '#b00500',
          yellow: '#fff200',
          carbon: '#15151e',
          panel: '#1f1f27',
          surface: '#121217',
          black: '#0b0b0e',
          gray: '#949498',
          lightGray: '#e0e0e4',
          border: 'rgba(255, 255, 255, 0.12)'
        }
      },
      fontFamily: {
        f1: ['"Formula1"', '"Titillium Web"', '"Rajdhani"', 'sans-serif'],
        f1wide: ['"Formula1Wide"', '"Formula1"', 'sans-serif'],
        f1bold: ['"Formula1"', '"Titillium Web"', 'sans-serif'],
        cursive: ['"Brittany Signature Script"', '"Northwell"', 'cursive'],
        signature: ['"Brittany Signature Script"', '"Northwell"', 'cursive'],
        display: ['"Formula1Wide"', '"Formula1"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        sweep: {
          '0%': { transform: 'rotate(-27deg) translateX(120%)' },
          '100%': { transform: 'rotate(-27deg) translateX(-10%)' },
        },
        pulseLive: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.85)' },
        }
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        sweep: 'sweep 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) forwards',
        'pulse-live': 'pulseLive 1.8s infinite',
      }
    },
  },
  plugins: [],
}
