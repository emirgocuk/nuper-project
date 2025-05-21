import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

const AtomAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const p5 = window.p5;
    if (!p5) return;

    const sketch = (p) => {
      let angle1 = 0;
      let angle2 = 0;
      let angle3 = 0;

      p.setup = () => {
        p.createCanvas(300, 300);
        p.background(0, 0, 0, 0); // Şeffaf arka plan
      };

      p.draw = () => {
        p.clear();
        p.translate(p.width / 2, p.height / 2);

        // Merkezdeki çekirdek
        p.fill(255);
        p.noStroke();
        p.ellipse(0, 0, 30, 30);

        // Yörüngeler
        p.stroke(255, 100);
        p.noFill();
        p.ellipse(0, 0, 100, 100); // 1. yörünge
        p.ellipse(0, 0, 150, 150); // 2. yörünge
        p.ellipse(0, 0, 200, 200); // 3. yörünge

        // Parçacıklar
        p.fill(255);
        p.noStroke();
        // 1. parçacık
        let x1 = 50 * p.cos(angle1);
        let y1 = 50 * p.sin(angle1);
        p.ellipse(x1, y1, 10, 10);

        // 2. parçacık
        let x2 = 75 * p.cos(angle2);
        let y2 = 75 * p.sin(angle2);
        p.ellipse(x2, y2, 10, 10);

        // 3. parçacık
        let x3 = 100 * p.cos(angle3);
        let y3 = 100 * p.sin(angle3);
        p.ellipse(x3, y3, 10, 10);

        // Açıyı güncelle
        angle1 += 0.05;
        angle2 -= 0.03;
        angle3 += 0.02;
      };
    };

    new p5(sketch, canvasRef.current);

    return () => {
      canvasRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={canvasRef} />;
};

const App = () => {
  const [currentSet, setCurrentSet] = React.useState(0);
  const cardsPerSet = 3;
  const visibleEvents = events.slice(currentSet * cardsPerSet, (currentSet + 1) * cardsPerSet);

  const handleNext = () => setCurrentSet((prev) => (prev + 1) % Math.ceil(events.length / cardsPerSet));
  const handlePrev = () => setCurrentSet((prev) => (prev - 1 + Math.ceil(events.length / cardsPerSet)) % Math.ceil(events.length / cardsPerSet));

  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900">
        <Routes>
          <Route path="/" element={
            <>
              <HomeHeader />
              <section id="home" className="bg-gradient-to-r from-nuper-blue to-nuper-dark-blue min-h-screen flex items-center justify-center text-white">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                  <div className="w-1/2 text-left">
                    <h1 className="text-4xl font-heading font-bold">Nuper ile Geleceğini Şekillendir!</h1>
                    <p className="mt-4 text-lg">Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!</p>
                    <Link to="/#register" className="bg-white text-nuper-blue mt-6 inline-block px-6 py-3 rounded-lg font-semibold hover:bg-nuper-gray font-heading">Şimdi Kaydol</Link>
                  </div>
                  <div className="w-1/2 flex justify-center">
                    <AtomAnimation />
                  </div>
                </div>
              </section>
              <section id="opportunities" className="bg-nuper-gray py-16">
                <div className="max-w-6xl mx-auto px-4">
                  <h2 className="text-3xl font-heading font-bold text-center mb-8 text-nuper-blue">Fırsatları Keşfet</h2>
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`set-${currentSet}`}
                        className="flex space-x-6 py-4 justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        {visibleEvents.map((event) => (
                          <Link to={`/event/${event.id}`} key={event.id} className="flex-shrink-0 w-96 h-64 bg-white rounded-xl border shadow-lg p-6">
                            <div className="flex flex-col h-full">
                              <div className="flex space-x-4">
                                <img src={event.image} alt={event.title} className="w-1/3 h-32 object-cover rounded-lg" />
                                <div className="flex-1">
                                  <h3 className="text-lg font-heading font-semibold text-nuper-blue">{event.title}</h3>
                                  <p className="text-gray-600">{event.date}</p>
                                  <p className="text-gray-600">{event.organizer}</p>
                                </div>
                              </div>
                              <p className="mt-2 text-gray-700">Detaylar için tıklayın</p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                    <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-nuper-dark-blue shadow-md">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-nuper-dark-blue shadow-md">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
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
          <Route path="/about" element={<><DefaultHeader /><div className="pt-16"><About /></div></>} />
          <Route path="/opportunities" element={<><DefaultHeader /><div className="pt-16"><Opportunities /></div></>} />
          <Route path="/bulletins" element={<><DefaultHeader /><div className="pt-16"><Bulletins /></div></>} />
          <Route path="/event/:id" element={<><DefaultHeader /><EventDetail /></>} />
          <Route path="/bulletin/:id" element={<><DefaultHeader /><BulletinDetail /></>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;