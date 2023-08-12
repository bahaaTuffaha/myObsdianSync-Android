/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './routers/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      white: '#ffffff',
      gray: '#C9C9C9',
      black: '#000000',
    },
  },
  plugins: [],
};
