import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import { SpeedInsights } from "@vercel/speed-insights/react"
import DOMPurify from 'dompurify';
import * as THREE from 'three';

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
import SpaceHero from './components/SpaceHero';

// Admin Bileşen importları
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import AdminEventsList from './components/admin/AdminEventsList';
import AdminBulletinsList from './components/admin/AdminBulletinsList';
import AdminContentForm from './components/admin/AdminContentForm';

// --- YARDIMCI VE LAYOUT BİLEŞENLERİ ---

const useMediaQuery = (query) => {
    const isBrowser = typeof window !== 'undefined';
    const [matches, setMatches] = useState(isBrowser ? window.matchMedia(query).matches : false);

    useEffect(() => {
        if (!isBrowser) return;

        const mediaQueryList = window.matchMedia(query);
        const listener = (event) => setMatches(event.matches);
        
        try {
            mediaQueryList.addEventListener('change', listener);
        } catch (e) {
            mediaQueryList.addListener(listener);
        }

        setMatches(mediaQueryList.matches);

        return () => {
            try {
                mediaQueryList.removeEventListener('change', listener);
            } catch (e) {
                mediaQueryList.removeListener(listener);
            }
        };
    }, [query, isBrowser]);

    return matches;
};

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
                    <div className="hidden md:flex items-center space-x-5">
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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


const Footer = () => (
    <footer className="bg-nuper-dark-blue text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-sans">&copy; {new Date().getFullYear()} Nuper. Tüm Hakları Saklıdır.</p>
            <div className="flex justify-center space-x-4 mt-4"><a href="#!" className="hover:text-nuper-blue transition-colors duration-200">Gizlilik Politikası</a><a href="#!" className="hover:text-nuper-blue transition-colors duration-200">Kullanım Koşulları</a></div>
        </div>
    </footer>
);

const MainLayout = ({ setExpandedEventId }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    
    useEffect(() => {
        if (!isHomePage) {
            setExpandedEventId(null);
        }
    }, [location.pathname, isHomePage, setExpandedEventId]);

    return (
        <>
            {isHomePage ? <HomeHeader setExpandedEventId={setExpandedEventId} /> : <DefaultHeader />}
            <Outlet />
            <Footer />
        </>
    );
};


const renderBlock = (block) => {
    if (!block || !block.data) return null;
    const sanitize = (html) => DOMPurify.sanitize(html);

    switch (block.type) {
        case 'header':
            const Tag = `h${block.data.level}`;
            return <Tag key={block.id} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
        case 'paragraph':
            return <p key={block.id} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
        case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <ListTag key={block.id}>
                    {block.data.items.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: sanitize(item) }}></li>
                    ))}
                </ListTag>
            );
        case 'checklist':
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <div key={block.id} className="checklist-container ml-0 pl-0">
                    {block.data.items.map((item, index) => (
                        <div key={index} className="flex items-center not-prose my-1">
                            <input type="checkbox" readOnly checked={item.checked} className="form-checkbox h-4 w-4 text-nuper-blue rounded mr-3 focus:ring-0 cursor-default" />
                            <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-800'} dangerouslySetInnerHTML={{ __html: sanitize(item.text) }}></span>
                        </div>
                    ))}
                </div>
            );
        case 'image':
            const imageClasses = block.data.stretched ? 'w-full' : 'max-w-2xl mx-auto';
            return (
                <figure key={block.id} className="not-prose my-6">
                    <img src={block.data.file.url} alt={block.data.caption || 'İçerik görseli'} className={`${imageClasses} max-w-full h-auto rounded-lg shadow-md`} />
                    {block.data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: sanitize(block.data.caption) }}></figcaption>}
                </figure>
            );
        case 'quote':
            return (
                <blockquote key={block.id} className="not-prose border-l-4 border-nuper-blue pl-4 italic my-4">
                    <p dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }}></p>
                    {block.data.caption && <footer className="text-sm text-right mt-2" dangerouslySetInnerHTML={{ __html: sanitize(block.data.caption) }}></footer>}
                </blockquote>
            );
        case 'table':
            if (!block.data.content || !Array.isArray(block.data.content)) return null;
            return (
                <div key={block.id} className="not-prose overflow-x-auto my-6">
                    <table className="min-w-full border border-gray-300">
                        <tbody>
                            {block.data.content.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-2 border-r" dangerouslySetInnerHTML={{ __html: sanitize(cell) }}></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case 'delimiter':
            return <hr key={block.id} className="my-8 border-gray-300" />;
        default: 
            return null;
    }
};


const HomePage = ({ events, loading, expandedEventId, setExpandedEventId, bulletins, loadingBulletins }) => {
    // const navigate = useNavigate(); // KULLANILMIYOR, SİLİNDİ
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const cardsPerSet = isDesktop ? 3 : 1;
    const totalEvents = events.length;
    const canCycle = totalEvents > cardsPerSet;

    const paginate = useCallback((newDirection) => {
        if (!canCycle) return;
        setDirection(newDirection);
        setCurrentIndex(prevIndex => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) {
                nextIndex = totalEvents - 1;
            } else if (nextIndex >= totalEvents) {
                nextIndex = 0;
            }
            return nextIndex;
        });
    }, [canCycle, totalEvents]);
    
    const visibleEvents = [];
    if (!loading && totalEvents > 0) {
        for (let i = 0; i < cardsPerSet; i++) {
            if (i >= totalEvents) break;
            const eventIndex = (currentIndex + i) % totalEvents;
            visibleEvents.push(events[eventIndex]);
        }
    }

    const handleCardClick = (event) => setExpandedEventId(event.slug);
    const handleCloseExpanded = (e) => { e.stopPropagation(); setExpandedEventId(null); };
    const selectedEvent = events.find(event => event.slug === expandedEventId);
    
    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <>
            <section id="home" className="relative bg-nuper-dark-blue min-h-screen flex items-center overflow-hidden">
                {/* SpaceHero artık tüm bölümün arka planı olarak davranacak */}
                <SpaceHero />

                {/* İçerik, z-10 ile SpaceHero'nun önüne getiriliyor */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="text-white text-center lg:text-left">
                            <motion.h1 
                                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                Nuper ile Geleceğini Şekillendir!
                            </motion.h1>
                            <motion.p 
                                className="mt-4 text-lg md:text-xl font-sans"
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
                                <Link to="/register" className="bg-white text-nuper-blue mt-8 inline-block px-8 py-3 rounded-lg font-semibold hover:bg-nuper-gray font-heading transition-colors duration-300 text-lg">
                                    Şimdi Kaydol
                                </Link>
                            </motion.div>
                        </div>
                        {/* Bu boş div, grid yapısını korumak için var */}
                        <div className="hidden lg:block"></div>
                    </div>
                </div>
            </section>
            
            <AnimatePresence>
                {expandedEventId && selectedEvent && (
                    <motion.div key="overlay" className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={handleCloseExpanded} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div layoutId={`card-${expandedEventId}`} className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="relative">
                                {selectedEvent.cardImage && <img src={selectedEvent.cardImage} alt={selectedEvent.title} className="w-full h-48 object-cover rounded-t-xl" />}
                                <button onClick={handleCloseExpanded} className="absolute top-2 right-2 bg-white/70 rounded-full p-1 text-gray-700 hover:text-black hover:bg-white transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-6 flex flex-col flex-1 overflow-y-auto">
                                <h3 className="text-2xl font-heading font-bold text-nuper-blue mb-2 leading-tight">{selectedEvent.title}</h3>
                                <div className="mb-4 text-sm text-gray-500">
                                    <p>{selectedEvent.organizer}</p>
                                    <p>{selectedEvent.date}</p>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed mb-4">
                                    {selectedEvent.content && selectedEvent.content.blocks ? (
                                        selectedEvent.content.blocks.map(block => renderBlock(block))
                                    ) : (
                                        <p>{selectedEvent.description}</p>
                                    )}
                                </div>
                                <div className="mt-auto pt-4 border-t flex justify-between items-center text-sm">
                                    <Link to={`/event/${selectedEvent.slug}`} className="font-semibold text-nuper-blue hover:underline">Detaylı Görüntüle &rarr;</Link>
                                    {selectedEvent.location && (
                                        <div className="flex items-center gap-1 text-teal-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">{selectedEvent.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <section id="events-home" className="bg-nuper-gray py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-heading font-bold text-center mb-12 text-nuper-blue">Öne Çıkan Etkinlikler</h2>
                    <div className="relative flex items-center justify-center min-h-[26rem] overflow-hidden">
                        {canCycle && (
                            <>
                                <button onClick={() => paginate(-1)} className="absolute left-0 -translate-x-0 md:-translate-x-0 top-1/2 -translate-y-1/2 bg-white text-nuper-blue w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 hover:bg-gray-100 transition-colors">&lt;</button>
                                <button onClick={() => paginate(1)} className="absolute right-0 translate-x-0 md:translate-x-0 top-1/2 -translate-y-1/2 bg-white text-nuper-blue w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 hover:bg-gray-100 transition-colors">&gt;</button>
                            </>
                        )}
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                                className="absolute flex flex-wrap justify-center gap-8"
                            >
                                {loading ? (
                                    <div className="text-center text-nuper-blue font-semibold">Yükleniyor...</div>
                                ) : (
                                    (isDesktop ? visibleEvents : events.length > 0 ? [events[currentIndex]] : []).map((event) => event && (
                                        <motion.div
                                            key={event.slug}
                                            layoutId={`card-${event.slug}`}
                                            onClick={() => handleCardClick(event)}
                                            className="group w-80 h-96 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden"
                                        >
                                            <div className="w-full h-40 bg-gray-200 overflow-hidden">
                                                {event.cardImage ? (
                                                    <img src={event.cardImage} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                                ) : <div className="w-full h-full bg-gray-300"></div>}
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="text-lg font-heading font-semibold text-nuper-dark-blue mb-1 group-hover:text-nuper-blue transition-colors line-clamp-2" title={event.title}>
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                                                <p className="text-sm text-gray-700 flex-grow line-clamp-3">
                                                    {event.description || event.organizer}
                                                </p>
                                                <div className="mt-auto pt-2 text-right">
                                                    <span className="text-sm font-semibold text-nuper-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Detayları Gör &rarr;
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
            
            <section id="bulletins-home" className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-heading font-bold text-center mb-4 text-nuper-blue">En Son Bültenler</h2>
                    <p className="text-center text-lg text-gray-600 mb-12">Sektörlerden haberler, kariyer ipuçları ve ilham verici içerikler.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loadingBulletins ? (
                            <p className="text-center col-span-3">Yükleniyor...</p>
                        ) : (
                            bulletins.slice(0, 3).map((bulletin) => (
                                <Link to={`/bulletin/${bulletin.slug}`} key={bulletin.id} className="block group">
                                    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden h-full">
                                        <div className="w-full h-40 bg-gray-200 overflow-hidden">
                                            {bulletin.cardImage ? (
                                                <img src={bulletin.cardImage} alt={bulletin.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                            ) : <div className="w-full h-full bg-gray-300"></div>}
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-lg font-heading font-semibold text-nuper-dark-blue mb-1 group-hover:text-nuper-blue transition-colors line-clamp-2" title={bulletin.title}>
                                                {bulletin.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">{bulletin.date}</p>
                                            <p className="text-sm text-gray-700 flex-grow line-clamp-3">
                                                {bulletin.description || bulletin.publisher}
                                            </p>
                                            <div className="mt-auto pt-2 text-right">
                                                <span className="text-sm font-semibold text-nuper-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Devamını Oku &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};


const App = () => {
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [events, setEvents] = useState([]);
    const [bulletins, setBulletins] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingBulletins, setLoadingBulletins] = useState(true);
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
                                bulletins={bulletins}
                                loadingBulletins={loadingBulletins}
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
                        <Route path="events/new" element={<AdminContentForm type="event" />} />
                        <Route path="events/edit/:slug" element={<AdminContentForm type="event" />} />
                        <Route path="bulletins" element={<AdminBulletinsList />} />
                        <Route path="bulletins/new" element={<AdminContentForm type="bulletin" />} />
                        <Route path="bulletins/edit/:slug" element={<AdminContentForm type="bulletin" />} />
                    </Route>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="*" element={<div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gray-100"><h1 className="text-5xl font-bold text-red-600">404</h1><p className="text-xl text-gray-700 mt-4">Sayfa Bulunamadı</p><Link to="/" className="mt-8 text-nuper-blue hover:underline">Ana Sayfaya Dön</Link></div>} />
                </Routes>
            </Router>
            <SpeedInsights />
        </div>
    );
};

export default App;
export { SpeedInsights } from "@vercel/speed-insights/react";
export { HomeHeader, DefaultHeader, Footer, MainLayout, useHomeReset, ScrollToTop };