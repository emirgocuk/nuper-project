/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Next.js'in yeni App Router yapısını buraya ekliyoruz
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Eski projedeki özel tema ayarlarınız burada korunuyor
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
    require('@tailwindcss/typography'),
  ],
};