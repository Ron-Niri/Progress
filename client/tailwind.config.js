/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FBFBFA', // Alabaster White
        surface: '#F1F1EF',    // Soft Stone
        primary: '#1E293B',    // Forest Slate
        secondary: '#6B7280',  // Mist Grey
        accent: '#10B981',     // Growth Sage
        action: '#3B82F6',     // Ascent Blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
