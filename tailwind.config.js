/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'florida-ocean': '#0077BE',
        'florida-sand': '#F4E4C1',
        'florida-sunset': '#FF6B35',
      },
      borderRadius: {
        'DEFAULT': '0.5rem',    // 8px - subtle rounded
        'sm': '0.375rem',       // 6px
        'md': '0.5rem',         // 8px
        'lg': '0.625rem',       // 10px
        'xl': '0.75rem',        // 12px - cards
        '2xl': '0.875rem',      // 14px
        '3xl': '0.75rem',       // 12px - main card radius (was 32px)
        'card': '0.75rem',      // 12px for cards
      },
    },
  },
  plugins: [],
};
