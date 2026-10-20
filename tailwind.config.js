/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#18110f',
        ivory: '#faf6f1',
        sand: '#efe6dc',
        blush: '#f5dde2',
        rose: { DEFAULT: '#c4496f', deep: '#9f3558', soft: '#e58aa8' },
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '.5' }, '100%': { transform: 'scale(1.8)', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        pulseRing: 'pulseRing 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
