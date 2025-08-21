/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'dark-bg': '#0a0a0a',
        'dark-surface': '#1a1a1a',
        'dark-border': '#2a2a2a',
        'green-stock': '#10b981',
        'red-stock': '#ef4444',
      }
    },
  },
  plugins: [],
}