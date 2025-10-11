import Navbar from '@/components/Navbar'; // Kendi Navbar'ımızı import ediyoruz
import './globals.css';

export const metadata = {
  title: 'Nuper',
  description: 'Creative Project Hub',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-white bg-gray-900">
        <Navbar />
        <main>{children}</main>
        {/* Footer gibi diğer genel bileşenler de buraya eklenebilir */}
      </body>
    </html>
  );
}