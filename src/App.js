import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import About from './components/About';
import Opportunities from './components/Opportunities';
import Bulletins from './components/Bulletins';
import EventDetail from './components/EventDetail';
import BulletinDetail from './components/BulletinDetail';

const events = [
  { id: '1', title: 'Bilim Olimpiyatları', date: '30 Haziran 2025', organizer: 'Türkiye Bilim Kurumu', image: 'https://via.placeholder.com/150x100.png?text=Bilim+Olimpiyatları', description: 'Genç bilim insanlarının yeteneklerini sergileyebileceği bir platform.', participants: 'Lise ve üniversite öğrencileri.' },
  { id: '2', title: 'Sanat Yarışması', date: '15 Temmuz 2025', organizer: 'İstanbul Sanat Vakfı', image: 'https://via.placeholder.com/150x100.png?text=Sanat+Yarışması', description: 'Resim ve müzik alanında yeteneklerini sergilemek isteyenler için.', participants: '18-25 yaş arası sanatçılar.' },
  { id: '3', title: 'Kodlama Hackathonu', date: '10 Ağustos 2025', organizer: 'Tech Türkiye', image: 'https://via.placeholder.com/150x100.png?text=Kodlama+Hackathonu', description: 'Yazılım tutkunları için yenilikçi projeler.', participants: 'Geliştiriciler ve öğrenciler.' },
];

const HomeHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColorClass = isScrolled ? 'text-nuper-blue' : 'text-white';

  return (
    <nav className={`fixed w-full z-20 shadow-lg ${isScrolled ? 'bg-white/90' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className={`text-2xl font-heading font-bold ${textColorClass}`}>Nuper</h1>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={`font-heading py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Ana Sayfa</Link>
            <Link to="/about" className={`font-heading py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Hakkında</Link>
            <Link to="/opportunities" className={`font-heading py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Fırsatlar</Link>
            <Link to="/bulletins" className={`font-heading py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Bültenler</Link>
            <Link to="/#register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue">Kaydol</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const DefaultHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-20 shadow-lg ${isScrolled ? 'bg-white/90' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-nuper-blue">Nuper</h1>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="font-heading py-2 text-nuper-blue hover:text-nuper-dark-blue">Ana Sayfa</Link>
            <Link to="/about" className="font-heading py-2 text-nuper-blue hover:text-nuper-dark-blue">Hakkında</Link>
            <Link to="/opportunities" className="font-heading py-2 text-nuper-blue hover:text-nuper-dark-blue">Fırsatlar</Link>
            <Link to="/bulletins" className="font-heading py-2 text-nuper-blue hover:text-nuper-dark-blue">Bültenler</Link>
            <Link to="/#register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue">Kaydol</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900">
        <Routes>
          <Route path="/" element={
            <>
              <HomeHeader />
              <section id="home" className="bg-gradient-to-r from-nuper-blue to-nuper-dark-blue min-h-screen flex items-center justify-center text-center text-white">
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-4xl font-heading font-bold">Nuper ile Geleceğini Şekillendir!</h1>
                  <p className="mt-4 text-lg">Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!</p>
                  <Link to="/#register" className="bg-white text-nuper-blue mt-6 inline-block px-6 py-3 rounded-lg font-semibold hover:bg-nuper-gray font-heading">Şimdi Kaydol</Link>
                </div>
              </section>
              <section id="register" className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                  <h2 className="text-3xl font-heading font-bold text-center mb-6 text-nuper-blue">Hemen Katıl!</h2>
                  <p className="text-lg text-gray-700 text-center mb-6">
                    Öğrenci veya okul temsilcisiysen, Nuper’a katıl ve fırsatları yakala! Hemen formu doldur, aramıza katıl.
                  </p>
                  <div className="max-w-2xl mx-auto">
                    <iframe src="https://emirgocuk.notion.site/ebd/1f92ec2b978c8028aa7dc9820b6b9c56" width="100%" height="600" frameBorder="0" className="bg-white rounded-lg shadow-md border" allowFullScreen></iframe>
                  </div>
                </div>
              </section>
            </>
          } />
          <Route path="/about" element={<><DefaultHeader /><About /></>} />
          <Route path="/opportunities" element={<><DefaultHeader /><Opportunities /></>} />
          <Route path="/bulletins" element={<><DefaultHeader /><Bulletins /></>} />
          <Route path="/event/:id" element={<><DefaultHeader /><EventDetail /></>} />
          <Route path="/bulletin/:id" element={<><DefaultHeader /><BulletinDetail /></>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;