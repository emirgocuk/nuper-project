/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'nuper-blue': '#1E3A8A',
        'nuper-dark-blue': '#172554',
        'nuper-gray': '#F3F4F6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Bu satır en önemlisi!
  ],
};