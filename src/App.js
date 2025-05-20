import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import EventDetail from './EventDetail';
import Bulletins from './Bulletins';

const App = () => {
  const [darkMode, setDarkMode] = useState('light'); // Varsayılan aydınlık mod
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSet, setCurrentSet] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Tema yönetim fonksiyonları
  const setPreference = () => {
    localStorage.setItem('theme-preference', darkMode);
    document.firstElementChild.setAttribute('data-theme', darkMode);
    document.querySelector('#theme-toggle')?.setAttribute('aria-label', darkMode);
  };

  const reflectPreference = () => {
    setPreference();
  };

  // Kaydırma olayını dinle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const events = [
    {
      id: '1',
      title: 'Bilim Olimpiyatları',
      date: '30 Haziran 2025',
      organizer: 'Türkiye Bilim Kurumu',
      image: 'https://via.placeholder.com/150x100.png?text=Bilim+Olimpiyatları',
      description: 'Bilim Olimpiyatları, genç bilim insanlarının yeteneklerini sergileyebileceği bir platformdur. Matematik, fizik, kimya ve biyoloji alanlarında zorlu sorularla karşılaşacak, ödüller kazanma şansı elde edeceksin.',
      participants: 'Lise ve üniversite öğrencileri katılabilir.'
    },
    {
      id: '2',
      title: 'Sanat Yarışması',
      date: '15 Temmuz 2025',
      organizer: 'İstanbul Sanat Vakfı',
      image: 'https://via.placeholder.com/150x100.png?text=Sanat+Yarışması',
      description: 'Sanat Yarışması, resim ve müzik alanında yeteneklerini sergilemek isteyen genç sanatçılar için düzenleniyor. Kendi eserlerini yarat, jüri karşısında sun ve ödüller kazan!',
      participants: '18-25 yaş arası genç sanatçılar katılabilir.'
    },
    {
      id: '3',
      title: 'Kodlama Hackathonu',
      date: '10 Ağustos 2025',
      organizer: 'Tech Türkiye',
      image: 'https://via.placeholder.com/150x100.png?text=Kodlama+Hackathonu',
      description: 'Kodlama Hackathonu, yazılım tutkunları için tasarlanmış bir etkinliktir. Ekip olarak veya bireysel olarak katıl, yenilikçi projeler geliştir ve ödüller kazan!',
      participants: 'Yazılım geliştiriciler ve öğrenciler katılabilir.'
    },
    {
      id: '4',
      title: 'Matematik Yarışması',
      date: '5 Eylül 2025',
      organizer: 'Eğitim Derneği',
      image: 'https://via.placeholder.com/150x100.png?text=Matematik+Yarışması',
      description: 'Matematik Yarışması, problem çözme becerilerini geliştirmek isteyen öğrenciler için harika bir fırsat. Zorlu sorularla kendini test et, ödüller kazan!',
      participants: 'Ortaokul ve lise öğrencileri katılabilir.'
    },
    {
      id: '5',
      title: 'Fotoğrafçılık Atölyesi',
      date: '20 Eylül 2025',
      organizer: 'Sanat Kulübü',
      image: 'https://via.placeholder.com/150x100.png?text=Fotoğrafçılık+Atölyesi',
      description: 'Fotoğrafçılık Atölyesi, doğa ve portre fotoğrafçılığı üzerine uygulamalı bir eğitim sunuyor. Profesyonel fotoğrafçılardan ipuçları al, yeteneklerini geliştir!',
      participants: 'Herkes katılabilir.'
    },
    {
      id: '6',
      title: 'Robotik Kodlama Kampı',
      date: '1 Ekim 2025',
      organizer: 'Teknoloji Enstitüsü',
      image: 'https://via.placeholder.com/150x100.png?text=Robotik+Kodlama',
      description: 'Robotik Kodlama Kampı, genç mucitler için tasarlandı. Robotlar tasarla, programla ve yarışmalara katıl. Teknolojiyle yaratıcılığını birleştir!',
      participants: '13-18 yaş arası öğrenciler katılabilir.'
    },
    {
      id: '7',
      title: 'Edebiyat Semineri',
      date: '15 Ekim 2025',
      organizer: 'Kültür Vakfı',
      image: 'https://via.placeholder.com/150x100.png?text=Edebiyat+Semineri',
      description: 'Edebiyat Semineri, ünlü yazarlarla tanışma ve yazım teknikleri öğrenme fırsatı sunuyor. Kendi hikayeni yaz, edebiyat dünyasına adım at!',
      participants: 'Edebiyat severler katılabilir.'
    },
    {
      id: '8',
      title: 'Çevre Bilinci Konferansı',
      date: '5 Kasım 2025',
      organizer: 'Yeşil Gelecek Derneği',
      image: 'https://via.placeholder.com/150x100.png?text=Çevre+Bilinci',
      description: 'Çevre Bilinci Konferansı, sürdürülebilirlik ve geri dönüşüm üzerine farkındalık yaratmayı hedefliyor. Çevreyi koruma projelerine katıl!',
      participants: 'Herkes katılabilir.'
    },
    {
      id: '9',
      title: 'Müzik Festivali',
      date: '20 Kasım 2025',
      organizer: 'Gençlik Kulübü',
      image: 'https://via.placeholder.com/150x100.png?text=Müzik+Festivali',
      description: 'Müzik Festivali, yerel sanatçıların sahne aldığı bir etkinlik. Canlı performanslar, atölyeler ve müzik dolu bir gün seni bekliyor!',
      participants: 'Müzik severler katılabilir.'
    },
  ];

  const cardsPerSet = 3;
  const totalSets = Math.ceil(events.length / cardsPerSet);

  const handleNext = () => {
    setCurrentSet((prev) => (prev + 1) % totalSets);
  };

  const handlePrev = () => {
    setCurrentSet((prev) => (prev - 1 + totalSets) % totalSets);
  };

  const visibleEvents = events.slice(currentSet * cardsPerSet, (currentSet + 1) * cardsPerSet);

  const handleThemeToggle = () => {
    setDarkMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    setPreference();
  };

  // Navbar öğeleri için kayma animasyonu iptal edildi
  const navItemVariants = {
    initial: { x: 0 },
    scrolled: { x: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
    unscrolled: { x: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
  };

  const themeButtonVariants = {
    initial: { x: 0 },
    scrolled: { x: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
    unscrolled: { x: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
  };

  return (
    <Router>
      <div className={`${darkMode} min-h-screen font-sans text-gray-900 dark:text-nuper-light-text transition-colors duration-500`}>
        {/* Navbar */}
        <nav className={`fixed w-full z-20 shadow-lg transition-all duration-300 ${isScrolled ? (darkMode === 'dark' ? 'bg-nuper-dark-gray/90' : 'bg-white/90') : (darkMode === 'dark' ? 'bg-nuper-dark-gray/90' : 'bg-transparent')}`}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className={`text-2xl font-heading font-bold transition-colors duration-300 ${darkMode === 'dark' ? 'text-nuper-light-text' : isScrolled ? 'text-nuper-blue' : 'text-white'}`}>Nuper</h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <motion.div
                  variants={navItemVariants}
                  initial="initial"
                  animate={isScrolled ? 'scrolled' : 'unscrolled'}
                >
                  <Link to="/" className={`font-heading py-2 transition-colors duration-300 ${darkMode === 'dark' ? 'text-nuper-light-text hover:text-nuper-blue' : isScrolled ? 'text-nuper-blue hover:text-nuper-dark-blue' : 'text-white hover:text-nuper-dark-blue'}`}>Ana Sayfa</Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="initial"
                  animate={isScrolled ? 'scrolled' : 'unscrolled'}
                >
                  <Link to="/#about" className={`font-heading py-2 transition-colors duration-300 ${darkMode === 'dark' ? 'text-nuper-light-text hover:text-nuper-blue' : isScrolled ? 'text-nuper-blue hover:text-nuper-dark-blue' : 'text-white hover:text-nuper-dark-blue'}`}>Hakkında</Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="initial"
                  animate={isScrolled ? 'scrolled' : 'unscrolled'}
                >
                  <Link to="/#opportunities" className={`font-heading py-2 transition-colors duration-300 ${darkMode === 'dark' ? 'text-nuper-light-text hover:text-nuper-blue' : isScrolled ? 'text-nuper-blue hover:text-nuper-dark-blue' : 'text-white hover:text-nuper-dark-blue'}`}>Fırsatlar</Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="initial"
                  animate={isScrolled ? 'scrolled' : 'unscrolled'}
                >
                  <Link to="/bulletins" className={`font-heading py-2 transition-colors duration-300 ${darkMode === 'dark' ? 'text-nuper-light-text hover:text-nuper-blue' : isScrolled ? 'text-nuper-blue hover:text-nuper-dark-blue' : 'text-white hover:text-nuper-dark-blue'}`}>Bültenler</Link>
                </motion.div>
                <Link to="/#register" className={`px-4 py-2 rounded-lg font-heading transition-colors duration-300 ${darkMode === 'dark' ? 'bg-nuper-blue text-white hover:bg-nuper-dark-blue' : 'bg-nuper-blue text-white hover:bg-nuper-dark-blue'}`}>Kaydol</Link>
                <motion.div
                  variants={themeButtonVariants}
                  initial="initial"
                  animate={isScrolled ? 'scrolled' : 'unscrolled'}
                  style={{
                    '--icon-fill': darkMode === 'light' ? (isScrolled ? 'var(--nuper-blue)' : '#fff') : '#fff',
                    '--icon-fill-hover': darkMode === 'light' ? (isScrolled ? '#1d4ed8' : '#ddd') : '#e5e7eb',
                  }}
                >
                  <button
                    className="theme-toggle"
                    id="theme-toggle"
                    title="Toggles light & dark"
                    aria-label={darkMode}
                    aria-live="polite"
                    onClick={handleThemeToggle}
                  >
                    <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                      <mask className="moon" id="moon-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <circle cx="24" cy="10" r="6" fill="black" />
                      </mask>
                      <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
                      <g className="sun-beams" stroke="currentColor">
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </g>
                    </svg>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <section id="home" className={`${darkMode === 'dark' ? 'bg-nuper-dark-gray' : 'bg-gradient-to-r from-nuper-blue to-nuper-dark-blue'} min-h-screen flex items-center justify-center text-center text-white relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#fff_0%,_transparent_80%)] animate-pulse"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                  <h1 className="text-4xl md:text-5xl font-heading font-bold animate-fade-in">Nuper ile Geleceğini Şekillendir!</h1>
                  <p className="mt-4 text-lg md:text-xl animate-slide-up">Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!</p>
                  <Link to="/#register" className={`${darkMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white text-nuper-blue'} mt-6 inline-block px-6 py-3 rounded-lg font-semibold hover:bg-nuper-gray animate-slide-up font-heading`}>Şimdi Kaydol</Link>
                </div>
              </section>

              {/* About Section */}
              <section id="about" className={`${darkMode === 'dark' ? 'bg-nuper-dark' : 'bg-white'} py-16`}>
                <div className="max-w-4xl mx-auto px-4">
                  <h2 className={`text-3xl font-heading font-bold text-center mb-6 animate-fade-in ${darkMode === 'dark' ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Nuper Nedir?</h2>
                  <p className="text-lg text-gray-700 dark:text-nuper-light-text animate-slide-up leading-relaxed">
                    Nuper, öğrencilerin kişisel ve akademik gelişimlerini destekleyen bir platformdur. Yarışmalar, atölyeler ve etkinlikler keşfet, okul duyurularını takip et, projelerini sosyal medyada tanıt! Herkes için bir şeyler var, potansiyelini burada keşfet.
                  </p>
                </div>
              </section>

              {/* Opportunities Section */}
              <section id="opportunities" className={`${darkMode === 'dark' ? 'bg-nuper-dark-gray' : 'bg-nuper-gray'} py-16`}>
                <div className="max-w-6xl mx-auto px-4">
                  <h2 className={`text-3xl font-heading font-bold text-center mb-6 animate-fade-in ${darkMode === 'dark' ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Fırsatları Keşfet</h2>
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {selectedEvent ? (
                        <motion.div
                          key={`expanded-${selectedEvent.id}`}
                          className={`${darkMode === 'dark' ? 'bg-nuper-dark border-nuper-dark-gray' : 'bg-white'} rounded-xl border shadow-lg p-6 relative w-full`}
                          initial={{ width: '20rem', opacity: 0, scale: 0.95 }}
                          animate={{ width: '100%', opacity: 1, scale: 1 }}
                          exit={{ width: '20rem', opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-nuper-blue"
                          >
                            ✕
                          </button>
                          <div className="flex space-x-4">
                            <img src={selectedEvent.image} alt={selectedEvent.title} className="w-1/3 h-32 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h3 className={`text-xl font-heading font-semibold ${darkMode === 'dark' ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>{selectedEvent.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300">{selectedEvent.date}</p>
                              <p className="text-gray-600 dark:text-gray-300">{selectedEvent.organizer}</p>
                              <p className="mt-2 text-gray-700 dark:text-nuper-light-text leading-relaxed">{selectedEvent.description}</p>
                              <p className="mt-2 text-gray-700 dark:text-nuper-light-text leading-relaxed"><span className="font-semibold">Kimler Katılabilir:</span> {selectedEvent.participants}</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`set-${currentSet}`}
                          className="flex space-x-6 py-4 justify-center"
                          initial={{ opacity: 0, x: 50, y: 0 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, x: -50, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {visibleEvents.map((event) => (
                            <motion.div
                              key={event.id}
                              className={`${darkMode === 'dark' ? 'bg-nuper-dark border-nuper-dark-gray' : 'bg-white'} flex-shrink-0 w-80 rounded-xl border shadow-lg p-6`}
                              initial={{ opacity: 0, scale: 0.95, y: 0 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex space-x-4">
                                <img src={event.image} alt={event.title} className="w-1/3 h-24 object-cover rounded-lg" />
                                <div className="flex-1">
                                  <h3 className={`text-lg font-heading font-semibold ${darkMode === 'dark' ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>{event.title}</h3>
                                  <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
                                  <p className="text-gray-600 dark:text-gray-300">{event.organizer}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedEvent(event)}
                                className={`mt-4 text-nuper-blue hover:underline font-heading`}
                              >
                                Detaylar >
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!selectedEvent && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white p-2 rounded-full hover:bg-nuper-dark-blue"
                          disabled={currentSet === 0}
                        >
                          ←
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white p-2 rounded-full hover:bg-nuper-dark-blue"
                          disabled={currentSet === totalSets - 1}
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* Register Section */}
              <section id="register" className={`${darkMode === 'dark' ? 'bg-nuper-dark' : 'bg-white'} py-16`}>
                <div className="max-w-4xl mx-auto px-4">
                  <h2 className={`text-3xl font-heading font-bold text-center mb-6 animate-fade-in ${darkMode === 'dark' ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Hemen Katıl!</h2>
                  <p className="text-lg text-gray-700 dark:text-nuper-light-text text-center mb-6 animate-slide-up leading-relaxed">
                    Öğrenci veya okul temsilcisiysen, Nuper’a katıl ve fırsatları yakala! Hemen formu doldur, aramıza katıl.
                  </p>
                  <div className="max-w-2xl mx-auto">
                    <iframe
                      src="YOUR_GOOGLE_FORM_LINK"
                      width="100%"
                      height="600"
                      frameBorder="0"
                      className={`${darkMode === 'dark' ? 'bg-nuper-dark-gray border-nuper-dark' : 'bg-white'} rounded-lg shadow-md border`}
                    ></iframe>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className={`${darkMode === 'dark' ? 'bg-nuper-dark-gray' : 'bg-nuper-blue'} text-nuper-light-text py-6 text-center`}>
                <p className="animate-fade-in">
                  Bizi takip et:{' '}
                  <a href="https://x.com/nuperplatform" className="text-nuper-gray hover:text-nuper-blue">X</a> |{' '}
                  <a href="https://linkedin.com/company/nuperplatform" className="text-nuper-gray hover:text-nuper-blue">LinkedIn</a>
                </p>
                <p className="mt-2 animate-fade-in font-heading">Nuper © 2025</p>
              </footer>
            </>
          } />
          <Route path="/event/:id" element={<EventDetail darkMode={darkMode === 'dark'} />} />
          <Route path="/bulletins" element={<Bulletins darkMode={darkMode === 'dark'} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;