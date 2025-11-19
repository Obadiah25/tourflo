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
    },
  },
  plugins: [],
};
