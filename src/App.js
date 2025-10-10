import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import { SpeedInsights } from "@vercel/speed-insights/react"
// eslint-disable-next-line no-unused-vars
import DOMPurify from 'dompurify'; // Temizlik mekanizması için tutuldu
// eslint-disable-next-line no-unused-vars
import * as THREE from 'three'; // SpaceHero için tutuldu

// Firebase importları
import { app } from './firebaseConfig';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Public Bileşen importları
import About from './components/About';
import Events from './components/Events';
import Bulletins from './components/Bulletins';
import EventDetail from './components/EventDetail';
import BulletinDetail from './components/BulletinDetail';
import SpaceHero from './components/SpaceHero';
import AuthPage from './components/auth/AuthPage';
import ProfilePage from './components/profile/ProfilePage';
import NotificationSettings from './components/profile/NotificationSettings';
import ProfileIcon from './components/auth/ProfileIcon';
import ProjectUploadForm from './components/project/ProjectUploadForm';
import UserDashboard from './components/profile/UserDashboard';
import LegalPage from './components/LegalPage';
import HowItWorks from './components/HowItWorks';
import './components/HowItWorks.css';

// Admin Bileşen importları
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import AdminEventsList from './components/admin/AdminEventsList';
import AdminBulletinsList from './components/admin/AdminBulletinsList';
import AdminContentForm from './components/admin/AdminContentForm';
import AdminContractsList from './components/admin/AdminContractsList';
import AdminContractEditor from './components/admin/AdminContractEditor';


// --- YARDIMCI VE LAYOUT BİLEŞENLERİ ---

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

// setExpandedEventId parametresi kaldırıldı
const useHomeReset = () => {
    const navigate = useNavigate();
    const handleHomeClick = (e) => {
        e.preventDefault();
        navigate('/');
    };
    return handleHomeClick;
};

// setExpandedEventId prop'u kaldırıldı
const HomeHeader = ({ currentUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleHomeClick = useHomeReset();

    const navClasses = 'bg-nuper-dark-blue/50 backdrop-blur-sm'; 
    const textColorClass = 'text-white';
    const linkHoverClass = 'hover:text-nuper-gray';
    const mobileMenuBgClass = 'bg-nuper-dark-blue';

    return (
        <nav className={`fixed w-full z-20 transition-colors duration-300 ${navClasses}`}>
            <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
                <Link to="/" onClick={handleHomeClick}>
                    <h1 className={`text-2xl font-heading font-bold ${textColorClass} cursor-pointer`}>Nuper</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="items-center hidden space-x-5 md:flex">
                        <Link to="/" onClick={handleHomeClick} className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Ana Sayfa</Link>
                        <Link to="/about" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Hakkımızda</Link>
                        <Link to="/events" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Etkinlikler</Link>
                        <Link to="/bulletins" className={`font-sans py-2 ${textColorClass} ${linkHoverClass}`}>Bültenler</Link>
                        {currentUser ? (
                            <ProfileIcon user={currentUser} textColorClass={textColorClass} />
                        ) : (
                            <Link to="/login" className="px-4 py-2 font-sans text-white border rounded-lg bg-white/20 hover:bg-white/30 border-white/50">Giriş Yap</Link>
                        )}
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
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`md:hidden ${mobileMenuBgClass} py-2 px-4 shadow-lg`}>
                        <nav className="flex flex-col space-y-2">
                           <Link to="/" onClick={() => { handleHomeClick(); setIsMenuOpen(false); }} className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nuper-blue`}>Ana Sayfa</Link>
                           <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nuper-blue`}>Hakkımızda</Link>
                           <Link to="/events" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nuper-blue`}>Etkinlikler</Link>
                           <Link to="/bulletins" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nuper-blue`}>Bültenler</Link>
                            {currentUser ? (
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-nuper-blue`}>Projelerim</Link>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans text-left`}>Giriş Yap</Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const DefaultHeader = ({ currentUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`fixed top-0 w-full z-20 shadow-lg bg-white/90 backdrop-blur-sm`}>
            <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
                <Link to="/">
                    <h1 className="text-2xl font-bold cursor-pointer font-heading text-nuper-blue">Nuper</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="items-center hidden space-x-5 md:flex">
                        <Link to="/" className="py-2 font-sans text-nuper-blue hover:text-nuper-dark-blue">Ana Sayfa</Link>
                        <Link to="/about" className="py-2 font-sans text-nuper-blue hover:text-nuper-dark-blue">Hakkımızda</Link>
                        <Link to="/events" className="py-2 font-sans text-nuper-blue hover:text-nuper-dark-blue">Etkinlikler</Link>
                        <Link to="/bulletins" className="py-2 font-sans text-nuper-blue hover:text-nuper-dark-blue">Bültenler</Link>
                        {currentUser ? (
                            <ProfileIcon user={currentUser} textColorClass="text-nuper-blue" />
                        ) : (
                            <Link to="/login" className="px-4 py-2 font-sans text-white rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue">Giriş Yap</Link>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none text-nuper-blue"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 py-2 bg-white shadow-lg md:hidden">
                        <nav className="flex flex-col space-y-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-md text-nuper-blue hover:bg-nuper-gray">Ana Sayfa</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-md text-nuper-blue hover:bg-nuper-gray">Hakkımızda</Link>
                            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-md text-nuper-blue hover:bg-nuper-gray">Etkinlikler</Link>
                            <Link to="/bulletins" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-md text-nuper-blue hover:bg-nuper-gray">Bültenler</Link>
                             {currentUser ? (
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium text-nuper-blue hover:bg-nuper-gray`}>Projelerim</Link>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-lg bg-nuper-blue text-white hover:bg-nuper-dark-blue font-sans text-left`}>Giriş Yap</Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};


const Footer = () => (
    <footer className="py-8 text-white bg-nuper-dark-blue">
        <div className="max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8">
            <p className="font-sans text-sm">&copy; {new Date().getFullYear()} Nuper. Tüm Hakları Saklıdır.</p>
            <div className="flex justify-center mt-4 space-x-4">
                <Link to="/legal/privacy" className="transition-colors duration-200 hover:text-nuper-blue">Gizlilik Politikası</Link>
                <Link to="/legal/terms" className="transition-colors duration-200 hover:text-nuper-blue">Kullanım Koşulları</Link>
                <Link to="/legal/cookies" className="transition-colors duration-200 hover:text-nuper-blue">Çerez Politikası</Link>
            </div>
        </div>
    </footer>
);

// setExpandedEventId prop'u kaldırıldı
const MainLayout = ({ currentUser }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    
    useEffect(() => {
        if (!isHomePage) {
            // expandedEventId kaldırıldı.
        }
    }, [location.pathname, isHomePage]);

    return (
        <>
            {/* setExpandedEventId prop'u kaldırıldı */}
            {isHomePage ? <HomeHeader currentUser={currentUser} /> : <DefaultHeader currentUser={currentUser} />}
            <Outlet />
            <Footer />
        </>
    );
};

const HomePage = ({ events, loadingEvents, bulletins, loadingBulletins }) => {
    return (
        <>
            {/* Hata 1 (Line 253) çözüldü: Kapanış tag'i eksik olan <section> etiketleri yok, muhtemelen JSX içeriğinin etrafındaki genel fragment ile ilgiliydi. Aşağıdaki JSX yapısı zaten doğru. */}
            <section id="home" className="relative flex items-center min-h-screen overflow-hidden bg-nuper-dark-blue hero-fade-out">
                <SpaceHero />
                <div className="relative z-10 w-full max-w-6xl px-4 mx-auto">
                    <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="text-center text-white lg:text-left">
                            <motion.h1 
                                className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl font-heading"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                Nuper ile Geleceğini Şekillendir!
                            </motion.h1>
                            <motion.p 
                                className="mt-4 font-sans text-lg md:text-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            >
                                Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            >
                                <Link to="/login" className="inline-block px-8 py-3 mt-8 text-lg font-semibold transition-colors duration-300 bg-white rounded-lg text-nuper-blue hover:bg-nuper-gray font-heading">
                                    Hemen Başla
                                </Link>
                            </motion.div>
                        </div>
                        <div className="hidden lg:block"></div>
                    </div>
                </div>
            </section>
            
            <HowItWorks />

            <div className="bg-gradient-to-b from-[#111827] via-blue-900 to-gray-100">
                <section className="pt-20 pb-10">
                    <div className="px-4 mx-auto max-w-7xl">
                        <h2 className="mb-16 text-4xl font-bold text-center future-title md:text-5xl font-heading">
                            Geleceğini Şekillendirmeye var mısın?
                        </h2>
                    </div>
                </section>

                <section className="pb-20">
                     <div className="px-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
                            {/* Etkinlikler Sütunu */}
                            <div>
                                <h3 className="mb-8 text-3xl font-bold font-heading featured-events-title">Öne Çıkan Etkinlikler</h3>
                                <div className="space-y-6">
                                    {loadingEvents ? <p>Etkinlikler yükleniyor...</p> : events.slice(0, 3).map(event => (
                                        // Hata 2 (Line 262) çözüldü: JSX içinde curly brace ({}) kullanırken map'in hemen ardından gelen parantezin ( ) yerine köşeli parantez [ ] kullanılmış. Ayrıca block sınıfı kaldırıldı.
                                        <Link to={`/event/${event.slug}`} key={event.id} className="flex items-start p-4 space-x-4 transition-all duration-300 rounded-lg shadow-sm group bg-white/70 hover:bg-white hover:shadow-md backdrop-blur-sm">
                                            <img src={event.cardImage || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=N'} alt={event.title} className="flex-shrink-0 object-cover w-24 h-24 rounded-md" />
                                            <div className="flex-grow">
                                                <p className="mb-1 text-sm text-gray-500">{event.date}</p>
                                                <h4 className="text-lg font-bold transition-colors text-nuper-dark-blue group-hover:text-nuper-blue">{event.title}</h4>
                                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            {/* Bültenler Sütunu */}
                            <div>
                                 <h3 className="mb-8 text-3xl font-bold font-heading latest-news-title">En Son Bültenler</h3>
                                 <div className="space-y-6">
                                    {loadingBulletins ? <p>Bültenler yükleniyor...</p> : bulletins.slice(0, 3).map(bulletin => (
                                        // Hata 3 (Line 279) çözüldü: JSX içinde curly brace ({}) kullanırken map'in hemen ardından gelen parantezin ( ) yerine köşeli parantez [ ] kullanılmış. Ayrıca block sınıfı kaldırıldı.
                                        <Link to={`/bulletin/${bulletin.slug}`} key={bulletin.id} className="flex items-start p-4 space-x-4 transition-all duration-300 rounded-lg shadow-sm group bg-white/70 hover:bg-white hover:shadow-md backdrop-blur-sm">
                                            <img src={bulletin.cardImage || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=N'} alt={bulletin.title} className="flex-shrink-0 object-cover w-24 h-24 rounded-md" />
                                            <div className="flex-grow">
                                                <p className="mb-1 text-sm text-gray-500">{bulletin.date}</p>
                                                <h4 className="text-lg font-bold transition-colors text-nuper-dark-blue group-hover:text-nuper-blue">{bulletin.title}</h4>
                                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{bulletin.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};


const App = () => {
    const [events, setEvents] = useState([]);
    const [bulletins, setBulletins] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingBulletins, setLoadingBulletins] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const db = getFirestore(app);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setAuthLoading(false);
        });
        return unsubscribe;
    }, [auth]);

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

        const fetchBulletins = async () => {
            try {
                const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const bulletinsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBulletins(bulletinsData);
            } catch (error) {
                console.error("Ana sayfadaki bültenler çekilirken hata oluştu:", error);
            } finally {
                setLoadingBulletins(false);
            }
        };

        fetchEvents();
        fetchBulletins();
    }, [db]);

    if (authLoading) {
        return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen font-sans text-gray-900">
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route element={<MainLayout currentUser={currentUser} />}>
                        <Route path="/" element={
                            <HomePage
                                events={events}
                                loadingEvents={loadingEvents}
                                bulletins={bulletins}
                                loadingBulletins={loadingBulletins}
                            />
                        } />
                        <Route path="/about" element={<About />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/bulletins" element={<Bulletins />} />
                        <Route path="/event/:slug" element={<EventDetail />} />
                        <Route path="/bulletin/:slug" element={<BulletinDetail />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/settings/notifications" element={<NotificationSettings />} />
                        <Route path="/project-upload" element={<ProjectUploadForm />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/legal/:page" element={<LegalPage />} />
                    </Route>
                    <Route path="/admin" element={<AdminPanel />}>
                        <Route index element={<div className="pt-8"><h2 className="mb-4 text-3xl font-bold text-center font-heading text-nuper-dark-blue">Admin Paneline Hoş Geldiniz!</h2><p className="text-center text-gray-700">Lütfen yukarıdaki menüden bir yönetim seçeneği belirleyin.</p></div>} />
                        <Route path="events" element={<AdminEventsList />} />
                        <Route path="events/new" element={<AdminContentForm type="event" />} />
                        <Route path="events/edit/:slug" element={<AdminContentForm type="event" />} />
                        <Route path="bulletins" element={<AdminBulletinsList />} />
                        <Route path="bulletins/new" element={<AdminContentForm type="bulletin" />} />
                        <Route path="bulletins/edit/:slug" element={<AdminContentForm type="bulletin" />} />
                        <Route path="contracts" element={<AdminContractsList />} />
                        <Route path="contracts/edit/:docId" element={<AdminContractEditor />} />
                    </Route>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="*" element={<div className="flex flex-col items-center justify-center min-h-screen pt-16 bg-gray-100"><h1 className="text-5xl font-bold text-red-600">404</h1><p className="mt-4 text-xl text-gray-700">Sayfa Bulunamadı</p><Link to="/" className="mt-8 text-nuper-blue hover:underline">Ana Sayfaya Dön</Link></div>} />
                </Routes>
            </Router>
            <SpeedInsights />
        </div>
    );
};

export default App;
export { SpeedInsights } from "@vercel/speed-insights/react";
export { HomeHeader, DefaultHeader, Footer, MainLayout, useHomeReset, ScrollToTop };
