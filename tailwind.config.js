/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Font isimlerini buraya, tam olarak Google Fonts'tan aldığınız gibi yazmalısınız.
        // Tırnak işaretlerinin ('') içinde font adını yazın. Eğer font adında boşluk varsa,
        // hem tek tırnak hem de çift tırnak kullanmalısınız (örn: ['"Playfair Display"', 'serif']).
        heading: ['"Playfair Display"', 'serif'], // Başlık fontu için (örnek)
        sans: ['Inter', 'sans-serif'],           // Metin fontu için (örnek)
      },
      colors: {
        'nuper-blue': '#1E3A8A',
        'nuper-dark-blue': '#172554',
        'nuper-gray': '#F3F4F6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Eklenti burada doğru şekilde import ediliyor
  ],
};