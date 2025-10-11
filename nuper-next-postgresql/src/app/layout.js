import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // Footer'ı import ettik
import SharedStarfield from '@/components/SharedStarfield';
import './globals.css';

export const metadata = {
  title: 'Nuper',
  description: 'Creative Project Hub',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white bg-nuper-dark-blue">
        <SharedStarfield />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          {/* main'i esnek büyüyen bir alana çevirdik */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}