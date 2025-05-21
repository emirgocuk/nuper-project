// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import About from './components/About';
import Opportunities from './components/Opportunities'; // Etkinlikler sayfasının adı
import Bulletins from './components/Bulletins';
import EventDetail from './components/EventDetail';
import BulletinDetail from './components/BulletinDetail';

// Slug eklenmiş events verisi
const events = [
  { id: '1', slug: 'bilim-olimpiyatlari', title: 'Bilim Olimpiyatları', date: '30 Haziran 2025', organizer: 'Türkiye Bilim Kurumu', image: 'https://via.placeholder.com/400x250.png?text=Bilim+Olimpiyatları', description: 'Genç bilim insanlarının yeteneklerini sergileyebileceği bir platform.', additionalInfo: 'Katılımcılar için özel mentorluk programları ve hazırlık destekleri sunulmaktadır.', participants: 'Lise ve üniversite öğrencileri.' },
  { id: '2', slug: 'sanat-yarismasi', title: 'Sanat Yarışması', date: '15 Temmuz 2025', organizer: 'İstanbul Sanat Vakfı', image: 'https://via.placeholder.com/400x250.png?text=Sanat+Yarışması', description: 'Resim ve müzik alanında yeteneklerini sergilemek isteyenler için bir fırsat.', additionalInfo: 'Eserler profesyonel bir jüri tarafından değerlendirilecek ve en iyileri sergilenecektir.', participants: '18-25 yaş arası sanatçılar.' },
  { id: '3', slug: 'kodlama-hackathonu', title: 'Kodlama Hackathonu', date: '10 Ağustos 2025', organizer: 'Tech Türkiye', image: 'https://via.placeholder.com/400x250.png?text=Kodlama+Hackathonu', description: 'Yazılım tutkunları için 24 saat sürecek yenilikçi projeler geliştirme etkinliği.', additionalInfo: 'Ekiplerin projeleri, sektör liderleri ve potansiyel yatırımcılar karşısında sunulacaktır.', participants: 'Geliştiriciler ve öğrenciler.' },
  { id: '4', slug: 'robotik-atolyesi', title: 'Robotik Atölyesi', date: '5 Eylül 2025', organizer: 'Robotik Topluluğu', image: 'https://via.placeholder.com/400x250.png?text=Robotik+Atölyesi', description: 'Robot yapımı ve programlama üzerine uygulamalı eğitim.', additionalInfo: 'Temel robotik bilgisi olan veya olmayan herkes için uygun, eğlenceli ve öğretici bir deneyim.', participants: 'Ortaokul ve lise öğrencileri.' },
  { id: '5', slug: 'edebiyat-maratonu', title: 'Edebiyat Maratonu', date: '20 Eylül 2025', organizer: 'Yazarlar Birliği', image: 'https://via.placeholder.com/400x250.png?text=Edebiyat+Maratonu', description: 'Genç yazarlar için ilham verici bir etkinlik: şiir, öykü ve deneme atölyeleri.', additionalInfo: 'Katılımcılar, ünlü yazarların mentorluğunda kendi eserlerini geliştirme şansı bulacak.', participants: 'Tüm yaş grupları.' },
  { id: '6', slug: 'girisimcilik-zirvesi', title: 'Girişimcilik Zirvesi', date: '1 Ekim 2025', organizer: 'Girişimcilik Vakfı', image: 'https://via.placeholder.com/400x250.png?text=Girişimcilik+Zirvesi', description: 'Yenilikçi fikirleri olan gençler için ilham veren konuşmalar ve mentorluk seansları.', additionalInfo: 'Zirve, yeni nesil girişimcileri bir araya getirerek iş fikirlerini gerçeğe dönüştürmelerine yardımcı olmayı hedefliyor.', participants: 'Üniversite öğrencileri ve genç profesyoneller.' },
];

const useHomeReset = (setExpandedEventId) => {
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    setExpandedEventId(null);
    navigate('/');
  };

  return handleHomeClick;
};

const HomeHeader = ({ setExpandedEventId }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const handleHomeClick = useHomeReset(setExpandedEventId);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColorClass = isScrolled ? 'text-nuper-blue' : 'text-white';

  return (
    <nav className={`fixed w-full z-20 shadow-lg ${isScrolled ? 'bg-white/90' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" onClick={handleHomeClick}>
          <h1 className={`text-2xl font-heading font-bold ${textColorClass} cursor-pointer`}>Nuper</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" onClick={handleHomeClick} className={`font-sans py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Ana Sayfa</Link>
            <Link to="/about" className={`font-sans py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Hakkında</Link>
            <Link to="/opportunities" className={`font-sans py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Etkinlikler</Link> {/* Fırsatlar -> Etkinlikler */}
            <Link to="/bulletins" className={`font-sans py-2 ${textColorClass} hover:text-nuper-dark-blue`}>Bültenler</Link>
            <Link to="/#register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans">Kaydol</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const DefaultHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-20 shadow-lg ${isScrolled ? 'bg-white/90' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-heading font-bold text-nuper-blue cursor-pointer">Nuper</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Ana Sayfa</Link>
            <Link to="/about" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Hakkında</Link>
            <Link to="/opportunities" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Etkinlikler</Link> {/* Fırsatlar -> Etkinlikler */}
            <Link to="/bulletins" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Bültenler</Link>
            <Link to="/#register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans">Kaydol</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};


const App = () => {
  const [currentSet, setCurrentSet] = useState(0);
  const [expandedEventId, setExpandedEventId] = useState(null); // ID yerine slug tutacağız
  const cardsPerSet = 3;
  const totalSets = Math.ceil(events.length / cardsPerSet);
  const visibleEvents = events.slice(currentSet * cardsPerSet, (currentSet + 1) * cardsPerSet);

  const handleNext = () => {
    setExpandedEventId(null);
    setCurrentSet((prev) => (prev + 1) % totalSets);
  };
  const handlePrev = () => {
    setExpandedEventId(null);
    setCurrentSet((prev) => (prev - 1 + totalSets) % totalSets);
  };

  // Artık id yerine slug kullanıyoruz
  const handleCardClick = (eventSlug) => {
    setExpandedEventId(eventSlug);
  };

  const handleCloseExpanded = (e) => {
    e.stopPropagation();
    setExpandedEventId(null);
  };

  // Event'i slug ile buluyoruz
  const selectedEvent = events.find(event => event.slug === expandedEventId);

  const getCardPositionClass = (index) => {
    const cardIndexInSet = index % cardsPerSet;
    if (cardIndexInSet === 0) return 'origin-top-right';
    if (cardIndexInSet === 1) return 'origin-top';
    if (cardIndexInSet === 2) return 'origin-top-left';
    return '';
  };

  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900">
        <Routes>
          <Route path="/" element={
            <>
              <HomeHeader setExpandedEventId={setExpandedEventId} />
              <section id="home" className="bg-gradient-to-r from-nuper-blue to-nuper-dark-blue min-h-screen flex items-center justify-center text-center text-white">
                <div className="max-w-4xl mx-auto px-4 py-20">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">Nuper ile Geleceğini Şekillendir!</h1>
                  <p className="mt-4 text-lg md:text-xl font-sans">Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!</p>
                  <Link to="/#register" className="bg-white text-nuper-blue mt-6 inline-block px-6 py-3 rounded-lg font-semibold hover:bg-nuper-gray font-heading transition-colors duration-300">Şimdi Kaydol</Link>
                </div>
              </section>
              <section id="opportunities-home" className="bg-nuper-gray py-16"> {/* id'yi opportunities-home olarak değiştirdim, opportunities sayfasıyla karışmasın */}
                <div className="max-w-6xl mx-auto px-4 relative">
                  <h2 className="text-3xl font-heading font-bold text-center mb-8 text-nuper-blue">Öne Çıkan Etkinlikler</h2> {/* Fırsatları Keşfet -> Öne Çıkan Etkinlikler */}
                  <div className="relative z-0 h-64">
                    <AnimatePresence mode="wait">
                      {expandedEventId && selectedEvent ? (
                        <motion.div
                          key="expanded-card"
                          layoutId={`card-${expandedEventId}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 z-10 bg-white rounded-xl border shadow-lg p-6 flex flex-col md:flex-row items-start text-left gap-4 h-64"
                        >
                          <button
                            onClick={handleCloseExpanded}
                            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition-colors duration-200 z-20 p-2"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                          <img
                            src={selectedEvent.image}
                            alt={selectedEvent.title}
                            className="w-1/3 h-full object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 text-left flex flex-col py-0.5">
                            <h3 className="text-xl font-heading font-bold text-nuper-blue mb-0.5 leading-tight">{selectedEvent.title}</h3>
                            <p className="text-gray-700 text-base font-sans mb-0.5">{selectedEvent.date}</p>
                            <p className="text-gray-700 text-base font-sans mb-2">{selectedEvent.organizer}</p>
                            <p className="text-gray-800 leading-snug text-sm font-sans mb-1">{selectedEvent.description}</p>

                            {selectedEvent.additionalInfo && (
                              <p className="text-gray-700 text-sm font-sans mb-1">
                                {selectedEvent.additionalInfo}
                              </p>
                            )}

                            <div className="flex-grow"></div>

                            <p className="text-gray-600 text-sm font-sans mt-2 mb-0.5">
                              <strong className="text-nuper-blue">Kimler Katılabilir:</strong> {selectedEvent.participants}
                            </p>
                            {/* Link slug ile güncellendi */}
                            <Link to={`/event/${selectedEvent.slug}`} className="text-nuper-blue text-sm font-semibold hover:underline font-sans mt-1">
                              Detaylı Etkinlik Sayfasına Git
                            </Link>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`set-${currentSet}`}
                          className="flex gap-4 py-4 justify-center w-full mx-auto"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          {visibleEvents.map((event, index) => (
                            <motion.div
                              key={event.id}
                              layoutId={`card-${event.id}`} // layoutId hala id ile olabilir, animasyon için daha tutarlı
                              onClick={() => handleCardClick(event.slug)} // Tıklamada slug kullan
                              className={`flex-shrink-0 w-96 h-64 bg-white rounded-xl border shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between ${getCardPositionClass(index)}`}
                            >
                              <div className="flex space-x-4 items-center">
                                <img src={event.image} alt={event.title} className="w-1/3 h-32 object-cover rounded-lg" />
                                <div className="flex-1">
                                  <h3 className="text-lg font-heading font-semibold text-nuper-blue">{event.title}</h3>
                                  <p className="text-gray-600 font-sans">{event.date}</p>
                                  <p className="text-gray-600 font-sans">{event.organizer}</p>
                                </div>
                              </div>
                              <p className="mt-4 text-nuper-blue font-semibold hover:underline font-sans">Detaylar için tıklayın</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!expandedEventId && (
                      <>
                        <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-nuper-dark-blue shadow-md transition-colors duration-200">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-nuper-dark-blue shadow-md transition-colors duration-200">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </section>
              <section id="register" className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                  <h2 className="text-3xl font-heading font-bold text-center mb-6 text-nuper-blue">Hemen Katıl!</h2>
                  <p className="text-lg text-gray-700 text-center mb-6 font-sans">
                    Öğrenci veya okul temsilcisiysen, Nuper’a katıl ve fırsatları yakala! Hemen formu doldur, aramıza katıl.
                  </p>
                  <div className="max-w-2xl mx-auto">
                    <iframe src="https://emirgocuk.notion.site/ebd/1f92ec2b978c8028aa7dc9820b6b9c56" width="100%" height="600" frameBorder="0" className="bg-white rounded-lg shadow-md border" allowFullScreen></iframe>
                  </div>
                </div>
              </section>
            </>
          } />
          {/* Rota tanımlamalarında ':id' yerine ':slug' kullanıldı */}
          <Route path="/about" element={<><DefaultHeader /><div className="pt-16"><About /></div></>} />
          <Route path="/opportunities" element={<><DefaultHeader /><div className="pt-16"><Opportunities /></div></>} />
          <Route path="/bulletins" element={<><DefaultHeader /><div className="pt-16"><Bulletins /></div></>} />
          <Route path="/event/:slug" element={<><DefaultHeader /><div className="pt-16"><EventDetail /></div></>} /> {/* ':slug' olarak değiştirildi */}
          <Route path="/bulletin/:slug" element={<><DefaultHeader /><div className="pt-16"><BulletinDetail /></div></>} /> {/* ':slug' olarak değiştirildi */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;