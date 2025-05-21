// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Firebase importları
import { app, analytics } from './firebaseConfig';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';

// Public Bileşen importları
import About from './components/About';
import Opportunities from './components/Opportunities';
import Bulletins from './components/Bulletins';
import OpportunityDetail from './components/EventDetail';
import BulletinDetail from './components/BulletinDetail';
import Register from './components/Register'; // <<<<<<<<<<<< BU SATIRI EKLEYİN

// Admin Bileşen importları
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import AdminEventsList from './components/admin/AdminEventsList';
import AdminEventForm from './components/admin/AdminEventForm';
import AdminBulletinsList from './components/admin/AdminBulletinsList';
import AdminBulletinForm from './components/admin/AdminBulletinForm';

// Sizin mevcut HomeHeader ve DefaultHeader bileşenleriniz (DEĞİŞİKLİK YOK)
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
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobil menü durumu
    const handleHomeClick = useHomeReset(setExpandedEventId);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const textColorClass = isScrolled ? 'text-nuper-blue' : 'text-white';
    const linkHoverClass = isScrolled ? 'hover:text-nuper-dark-blue' : 'hover:text-nuper-gray'; // Renk uyumu için

    return (
        <nav className={`fixed w-full z-20 shadow-lg ${isScrolled ? 'bg-white/90' : 'bg-transparent'}`}>
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" onClick={handleHomeClick}>
                    <h1 className={`text-2xl font-heading font-bold ${textColorClass} cursor-pointer`}>Nuper</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    {/* Desktop Navigasyon */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" onClick={handleHomeClick} className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Ana Sayfa</Link>
                        <Link to="/about" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Hakkımızda</Link>
                        <Link to="/opportunities" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Etkinlikler</Link>
                        <Link to="/bulletins" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Bültenler</Link>
                        {/* "Kaydol" butonu artık "/register" rotasına yönlendiren bir Link */}
                        <Link to="/register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans">Kaydol</Link>
                    </div>

                    {/* Mobil Menü Butonu (Hamburger) */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`focus:outline-none ${textColorClass}`}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobil Menü İçeriği */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`md:hidden ${isScrolled ? 'bg-white' : 'bg-nuper-dark-blue'} py-2 px-4 shadow-lg`}
                    >
                        <nav className="flex flex-col space-y-2">
                            <Link
                                to="/"
                                onClick={() => { handleHomeClick(); setIsMenuOpen(false); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}
                            >
                                Hakkımızda
                            </Link>
                            <Link
                                to="/opportunities"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}
                            >
                                Etkinlikler
                            </Link>
                            <Link
                                to="/bulletins"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}
                            >
                                Bültenler
                            </Link>
                            {/* Mobil menüdeki "Kaydol" linki de "/register" rotasına yönlendiriyor */}
                            <Link
                                to="/register"
                                onClick={() => setIsMenuOpen(false)} // Menüyü kapatmak için
                                className={`block px-3 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans text-left`}
                            >
                                Kaydol
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const DefaultHeader = () => { // DEĞİŞİKLİK YOK
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobil menü durumu

    useEffect(() => {
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
                    {/* Desktop Navigasyon */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Ana Sayfa</Link>
                        <Link to="/about" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Hakkımızda</Link>
                        <Link to="/opportunities" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Etkinlikler</Link>
                        <Link to="/bulletins" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Bültenler</Link>
                        {/* "Kaydol" butonu artık "/register" rotasına yönlendiren bir Link */}
                        <Link to="/register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans">Kaydol</Link>
                    </div>

                    {/* Mobil Menü Butonu (Hamburger) */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none text-nuper-blue">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobil Menü İçeriği */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white py-2 px-4 shadow-lg"
                    >
                        <nav className="flex flex-col space-y-2">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray"
                            >
                                Hakkımızda
                            </Link>
                            <Link
                                to="/opportunities"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray"
                            >
                                Etkinlikler
                            </Link>
                            <Link
                                to="/bulletins"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray"
                            >
                                Bültenler
                            </Link>
                            {/* Mobil menüdeki "Kaydol" linki de "/register" rotasına yönlendiriyor */}
                            <Link
                                to="/register"
                                onClick={() => setIsMenuOpen(false)} // Menüyü kapatmak için
                                className="block px-3 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans text-left"
                            >
                                Kaydol
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// Footer bileşenini App.js içinde tanımlayalım (eğer dışarıda değilse) (DEĞİŞİKLİK YOK)
const Footer = () => {
    return (
        <footer className="bg-nuper-dark-blue text-white py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm font-sans">&copy; {new Date().getFullYear()} Nuper. Tüm Hakları Saklıdır.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" className="hover:text-nuper-blue transition-colors duration-200">Gizlilik Politikası</a>
                    <a href="#" className="hover:text-nuper-blue transition-colors duration-200">Kullanım Koşulları</a>
                </div>
            </div>
        </footer>
    );
};


const App = () => {
    const [currentSet, setCurrentSet] = useState(0);
    const [expandedEventId, setExpandedEventId] = useState(null);

    // Firebase'den etkinlikleri çekme state'leri
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const eventsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(eventsData);
            } catch (error) {
                console.error("Ana sayfadaki etkinlikler çekilirken hata oluştu:", error);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEvents();
    }, [db]);

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

    const handleCardClick = (eventSlug) => {
        setExpandedEventId(eventSlug);
    };

    const handleCloseExpanded = (e) => {
        e.stopPropagation();
        setExpandedEventId(null);
    };

    const selectedEvent = events.find(event => event.slug === expandedEventId);

    const getCardPositionClass = (index) => {
        const cardIndexInSet = index % cardsPerSet;
        if (cardIndexInSet === 0) return 'origin-top-right';
        if (cardIndexInSet === 1) return 'origin-top';
        if (cardIndexInSet === 2) return 'origin-top-left';
        return '';
    };

    // Ana sayfa hero bölümündeki "Şimdi Kaydol" butonu için basit Link
    const handleHeroRegisterLink = "/register";


    return (
        <div className="min-h-screen font-sans text-gray-900">
            <Router> {/* <<<<<<<<<<<< ROUTER BURADA BAŞLIYOR */}
                <Routes>
                    <Route element={<MainLayout setExpandedEventId={setExpandedEventId} />}>
                        <Route path="/" element={
                            <>
                                <section id="home" className="bg-gradient-to-r from-nuper-blue to-nuper-dark-blue min-h-screen flex items-center justify-center text-center text-white">
                                    <div className="max-w-4xl mx-auto px-4 py-20">
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">Nuper ile Geleceğini Şekillendir!</h1>
                                        <p className="mt-4 text-lg md:text-xl font-sans">Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!</p>
                                        <Link to={handleHeroRegisterLink} className="bg-white text-nuper-blue mt-6 inline-block px-6 py-3 rounded-lg font-semibold hover:bg-nuper-gray font-heading transition-colors duration-300">Şimdi Kaydol</Link>
                                    </div>
                                </section>
                                <section id="opportunities-home" className="bg-nuper-gray py-16">
                                    <div className="max-w-6xl mx-auto px-4 relative">
                                        <h2 className="text-3xl font-heading font-bold text-center mb-8 text-nuper-blue">Öne Çıkan Etkinlikler</h2>
                                        <div className="relative z-0 h-64">
                                            <AnimatePresence mode="wait">
                                                {loadingEvents ? (
                                                    <div className="text-center text-nuper-blue font-semibold">Etkinlikler yükleniyor...</div>
                                                ) : expandedEventId && selectedEvent ? (
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
                                                                    <strong>Ek Bilgi:</strong> {selectedEvent.additionalInfo}
                                                                </p>
                                                            )}

                                                            <div className="flex-grow"></div>

                                                            <p className="text-gray-600 text-sm font-sans mt-2 mb-0.5">
                                                                <strong className="text-nuper-blue">Kimler Katılabilir:</strong> {selectedEvent.participants}
                                                            </p>
                                                            <Link to={`/opportunity/${selectedEvent.slug}`} className="text-nuper-blue text-sm font-semibold hover:underline font-sans mt-1">
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
                                                        {visibleEvents.length > 0 ? (
                                                            visibleEvents.map((event, index) => (
                                                                <motion.div
                                                                    key={event.id}
                                                                    layoutId={`card-${event.id}`}
                                                                    onClick={() => handleCardClick(event.slug)}
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
                                                            ))
                                                        ) : (
                                                            !loadingEvents && <div className="text-center text-gray-600">Henüz etkinlik bulunmamaktadır.</div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            {!expandedEventId && !loadingEvents && events.length > cardsPerSet && (
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
                            </>
                        } />
                        <Route path="/about" element={<div className="pt-16"><About /></div>} />
                        <Route path="/opportunities" element={<div className="pt-16"><Opportunities /></div>} />
                        <Route path="/bulletins" element={<div className="pt-16"><Bulletins /></div>} />
                        <Route path="/opportunity/:slug" element={<div className="pt-16"><OpportunityDetail /></div>} />
                        <Route path="/bulletin/:slug" element={<div className="pt-16"><BulletinDetail /></div>} />

                        {/* <<<<<<<<<<<< BU SATIR GÜNCELLENDİ >>>>>>>>>>>> */}
                        <Route path="/register" element={<Register />} />
                        {/* <<<<<<<<<<<< YUKARIDAKİ SATIR GÜNCELLENDİ >>>>>>>>>>>> */}

                    </Route>

                    <Route path="/admin/login" element={<AdminLogin />} />

                    <Route path="/admin" element={<AdminPanel />}>
                        <Route index element={
                            <div className="pt-8">
                                <h2 className="text-3xl font-heading font-bold text-center text-nuper-dark-blue mb-4">Admin Paneline Hoş Geldiniz!</h2>
                                <p className="text-center text-gray-700">Lütfen yukarıdaki menüden bir yönetim seçeneği belirleyin.</p>
                            </div>
                        } />
                        <Route path="events" element={<AdminEventsList />} />
                        <Route path="events/new" element={<AdminEventForm />} />
                        <Route path="events/edit/:slug" element={<AdminEventForm />} />
                        <Route path="bulletins" element={<AdminBulletinsList />} />
                        <Route path="bulletins/new" element={<AdminBulletinForm />} />
                        <Route path="bulletins/edit/:slug" element={<AdminBulletinForm />} />
                    </Route>

                    <Route path="*" element={
                        <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gray-100">
                            <h1 className="text-5xl font-bold text-red-600">404</h1>
                            <p className="text-xl text-gray-700 mt-4">Sayfa Bulunamadı</p>
                            <Link to="/" className="mt-8 text-nuper-blue hover:underline">Ana Sayfaya Dön</Link>
                        </div>
                    } />

                </Routes>
            </Router> {/* <<<<<<<<<<<< ROUTER BURADA KAPANIYOR */}
        </div>
    );
};

// Public sayfalar için Header ve Footer'ı yöneten Layout bileşeni (DEĞİŞİKLİK YOK)
const MainLayout = ({ setExpandedEventId }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <>
            {isHomePage ? <HomeHeader setExpandedEventId={setExpandedEventId} /> : <DefaultHeader />}
            <Outlet />
            <Footer />
        </>
    );
};

export default App;