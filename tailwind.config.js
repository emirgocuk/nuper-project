/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
      },
      colors: {
        'nuper-blue': '#1a73e8', // Ana mavi tonu
        'nuper-dark-blue': '#0d0f5e', // Daha koyu mavi tonu (eskisi #155bb5 idi)
        'nuper-gray': '#f5f5f5', // Açık gri arka plan
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // kartlarda sonunu kesen üç nokta için
  ], // Bu kapanan parantezin olduğundan emin olun!
}