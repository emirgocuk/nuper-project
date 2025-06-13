import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import { SpeedInsights } from "@vercel/speed-insights/react"

// Firebase importları
import { app } from './firebaseConfig';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';

// Public Bileşen importları
import About from './components/About';
import Events from './components/Events'; 
import Bulletins from './components/Bulletins';
import EventDetail from './components/EventDetail'; 
import BulletinDetail from './components/BulletinDetail';
import Register from './components/Register';
import SpaceHero from './components/SpaceHero'; // En üste ekleyin

// Admin Bileşen importları
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import AdminEventsList from './components/admin/AdminEventsList';
import AdminEventForm from './components/admin/AdminEventForm';
import AdminBulletinsList from './components/admin/AdminBulletinsList';
import AdminBulletinForm from './components/admin/AdminBulletinForm';

// --- Helper & Layout Components ---

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const useHomeReset = (setExpandedEventId) => {
    const navigate = useNavigate();
    const handleHomeClick = (e) => {
        e.preventDefault();
        if (setExpandedEventId) {
            setExpandedEventId(null);
        }
        navigate('/');
    };
    return handleHomeClick;
};

const HomeHeader = ({ setExpandedEventId }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const handleHomeClick = useHomeReset(setExpandedEventId);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const textColorClass = isScrolled ? 'text-nuper-blue' : 'text-white';
    const linkHoverClass = isScrolled ? 'hover:text-nuper-dark-blue' : 'hover:text-nuper-gray'; 

    return (
        <nav className={`fixed w-full z-20 shadow-lg ${isScrolled ? 'bg-white/90 backdrop-blur-sm' : 'bg-transparent'}`}>
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" onClick={handleHomeClick}>
                    <h1 className={`text-2xl font-heading font-bold ${textColorClass} cursor-pointer`}>Nuper</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-5"> {/* Boşluk azaltıldı */}
                        <Link to="/" onClick={handleHomeClick} className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Ana Sayfa</Link>
                        <Link to="/about" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Hakkımızda</Link>
                        <Link to="/events" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Etkinlikler</Link>
                        <Link to="/bulletins" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Bültenler</Link>
                        <Link to="/register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans">Kaydol</Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`focus:outline-none ${textColorClass}`}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`md:hidden ${isScrolled ? 'bg-white' : 'bg-nuper-dark-blue'} py-2 px-4 shadow-lg`}>
                        <nav className="flex flex-col space-y-2">
                            <Link to="/" onClick={() => { handleHomeClick(); setIsMenuOpen(false); }} className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}>Ana Sayfa</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}>Hakkımızda</Link>
                            <Link to="/events" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}>Etkinlikler</Link>
                            <Link to="/bulletins" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-nuper-blue hover:bg-nuper-gray' : 'text-white hover:bg-nuper-blue'}`}>Bültenler</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans text-left`}>Kaydol</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const DefaultHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-20 shadow-lg bg-white/90 backdrop-blur-sm`}>
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/">
                    <h1 className="text-2xl font-heading font-bold text-nuper-blue cursor-pointer">Nuper</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-5">
                        <Link to="/" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Ana Sayfa</Link>
                        <Link to="/about" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Hakkımızda</Link>
                        <Link to="/events" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Etkinlikler</Link>
                        <Link to="/bulletins" className="font-sans py-2 text-nuper-blue hover:text-nuper-dark-blue">Bültenler</Link>
                        <Link to="/register" className="px-4 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans">Kaydol</Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none text-nuper-blue"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white py-2 px-4 shadow-lg">
                        <nav className="flex flex-col space-y-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray">Ana Sayfa</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray">Hakkımızda</Link>
                            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray">Etkinlikler</Link>
                            <Link to="/bulletins" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray">Bültenler</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans text-left`}>Kaydol</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};


const Footer = () => {
    return (
        <footer className="bg-nuper-dark-blue text-white py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm font-sans">&copy; {new Date().getFullYear()} Nuper. Tüm Hakları Saklıdır.</p>
                <div className="flex justify-center space-x-4 mt-4"><a href="#!" className="hover:text-nuper-blue transition-colors duration-200">Gizlilik Politikası</a><a href="#!" className="hover:text-nuper-blue transition-colors duration-200">Kullanım Koşulları</a></div>
            </div>
        </footer>
    );
};

const MainLayout = ({ setExpandedEventId }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    
    useEffect(() => {
        if (location.pathname !== '/') {
            setExpandedEventId(null);
        }
    }, [location.pathname, setExpandedEventId]);

    return (
        <>
            {isHomePage ? <HomeHeader setExpandedEventId={setExpandedEventId} /> : <DefaultHeader />}
            <Outlet />
            <Footer />
        </>
    );
};


const App = () => {
    const [expandedEventId, setExpandedEventId] = useState(null);
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

    return (
        <div className="min-h-screen font-sans text-gray-900">
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route element={<MainLayout setExpandedEventId={setExpandedEventId} />}>
                        <Route path="/" element={
                            <HomePage
                                events={events}
                                loading={loadingEvents}
                                expandedEventId={expandedEventId}
                                setExpandedEventId={setExpandedEventId}
                            />
                        } />
                        <Route path="/about" element={<About />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/bulletins" element={<Bulletins />} />
                        <Route path="/event/:slug" element={<EventDetail />} />
                        <Route path="/bulletin/:slug" element={<BulletinDetail />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route path="/admin" element={<AdminPanel />}>
                        <Route index element={<div className="pt-8"><h2 className="text-3xl font-heading font-bold text-center text-nuper-dark-blue mb-4">Admin Paneline Hoş Geldiniz!</h2><p className="text-center text-gray-700">Lütfen yukarıdaki menüden bir yönetim seçeneği belirleyin.</p></div>} />
                        <Route path="events" element={<AdminEventsList />} />
                        <Route path="events/new" element={<AdminEventForm />} />
                        <Route path="events/edit/:slug" element={<AdminEventForm />} />
                        <Route path="bulletins" element={<AdminBulletinsList />} />
                        <Route path="bulletins/new" element={<AdminBulletinForm />} />
                        <Route path="bulletins/edit/:slug" element={<AdminBulletinForm />} />
                    </Route>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="*" element={<div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gray-100"><h1 className="text-5xl font-bold text-red-600">404</h1><p className="text-xl text-gray-700 mt-4">Sayfa Bulunamadı</p><Link to="/" className="mt-8 text-nuper-blue hover:underline">Ana Sayfaya Dön</Link></div>} />
                </Routes>
            </Router>
        </div>
    );
};

const HomePage = ({ events, loading, expandedEventId, setExpandedEventId }) => {
    const [currentSet, setCurrentSet] = useState(0);
    const cardsPerSet = 3;
    const totalSets = Math.ceil(events.length / cardsPerSet);
    const visibleEvents = events.slice(currentSet * cardsPerSet, (currentSet + 1) * cardsPerSet);

    const handleNext = () => setCurrentSet((prev) => (prev + 1) % totalSets);
    const handlePrev = () => setCurrentSet((prev) => (prev - 1 + totalSets) % totalSets);
    const handleCardClick = (slug) => setExpandedEventId(slug);
    const handleCloseExpanded = (e) => { e.stopPropagation(); setExpandedEventId(null); };
    const selectedEvent = events.find(event => event.slug === expandedEventId);

    return (
        <>
            <section id="home" className="relative bg-gradient-to-r from-nuper-blue to-nuper-dark-blue min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
                {/* SpaceHero arka plan animasyonu */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <SpaceHero />
                </div>
                {/* Ana içerik */}
                <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">Nuper ile Geleceğini Şekillendir!</h1>
                    <p className="mt-4 text-lg md:text-xl font-sans">Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!</p>
                    <Link to="/register" className="bg-white text-nuper-blue mt-6 inline-block px-6 py-3 rounded-lg font-semibold hover:bg-nuper-gray font-heading transition-colors duration-300">Şimdi Kaydol</Link>
                </div>
            </section>
            <section id="events-home" className="bg-nuper-gray py-16">
                <div className="max-w-6xl mx-auto px-4 relative">
                    <h2 className="text-3xl font-heading font-bold text-center mb-8 text-nuper-blue">Öne Çıkan Etkinlikler</h2>
                    <div className="relative z-0 h-64">
                        <AnimatePresence>
                            {loading ? (<div className="text-center text-nuper-blue font-semibold">Yükleniyor...</div>) 
                            : expandedEventId && selectedEvent ? (
                                <motion.div key="expanded-card" layoutId={`card-${expandedEventId}`} className="absolute inset-0 z-10 bg-white rounded-xl border shadow-lg p-6 flex items-start text-left gap-6 h-64 overflow-hidden">
                                    <button onClick={handleCloseExpanded} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 p-1 z-20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                    {selectedEvent.cardImage && <img src={selectedEvent.cardImage} alt={selectedEvent.title} className="w-48 h-48 object-cover rounded-lg flex-shrink-0" />}
                                    <div className="flex-1 flex flex-col h-full">
                                        <h3 className="text-xl font-heading font-bold text-nuper-blue mb-1 leading-tight">{selectedEvent.title}</h3>
                                        <div className="mb-2">
                                            <p className="text-sm font-medium text-gray-600">{selectedEvent.organizer}</p>
                                            <p className="text-sm text-gray-500">{selectedEvent.date}</p>
                                        </div>
                                        <div className="relative flex-grow overflow-hidden">
                                            <p className="text-gray-800 text-sm leading-snug">{selectedEvent.description}</p>
                                            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                                        </div>
                                        <div className="mt-auto flex justify-between items-center text-sm">
                                            <Link to={`/event/${selectedEvent.slug}`} className="font-semibold text-nuper-blue hover:underline text-xs">Detaylı Görüntüle &rarr;</Link>
                                            {selectedEvent.location &&
                                                <div className="flex items-center gap-1 text-teal-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                                    <span className="font-medium">{selectedEvent.location}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key={`set-${currentSet}`} className="flex gap-4 py-4 justify-center w-full mx-auto" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                                    {visibleEvents.map((event) => (
                                        <motion.div key={event.id} layoutId={`card-${event.id}`} onClick={() => handleCardClick(event.slug)} className="flex-shrink-0 w-96 h-64 bg-white rounded-xl border shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow flex flex-col">
                                            <div className="flex-grow">
                                                <div className="flex items-start gap-4 mb-2">
                                                    {event.cardImage && <img src={event.cardImage} alt={event.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-heading font-semibold text-nuper-blue mb-2">{event.title}</h3>
                                                        <p className="text-sm font-medium text-gray-600">{event.organizer}</p>
                                                        <p className="text-sm text-gray-500">{event.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-auto">
                                                <p className="text-xs text-nuper-blue font-semibold hover:underline">Detaylar için tıklayın</p>
                                                {event.location && (
                                                    <div className="flex items-center gap-1 text-teal-600 text-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                                        <span>{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!expandedEventId && !loading && events.length > cardsPerSet && (
                            <>
                                <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">&lt;</button>
                                <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">&gt;</button>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default App;
export { SpeedInsights } from "@vercel/speed-insights/react";
export { HomeHeader, DefaultHeader, Footer, MainLayout, useHomeReset, ScrollToTop };