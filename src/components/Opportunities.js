import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const events = [
  { id: '1', title: 'Bilim Olimpiyatları', date: '30 Haziran 2025', organizer: 'Türkiye Bilim Kurumu', image: 'https://via.placeholder.com/150x100.png?text=Bilim+Olimpiyatları', description: 'Genç bilim insanlarının yeteneklerini sergileyebileceği bir platform.', participants: 'Lise ve üniversite öğrencileri.' },
  { id: '2', title: 'Sanat Yarışması', date: '15 Temmuz 2025', organizer: 'İstanbul Sanat Vakfı', image: 'https://via.placeholder.com/150x100.png?text=Sanat+Yarışması', description: 'Resim ve müzik alanında yeteneklerini sergilemek isteyenler için.', participants: '18-25 yaş arası sanatçılar.' },
  { id: '3', title: 'Kodlama Hackathonu', date: '10 Ağustos 2025', organizer: 'Tech Türkiye', image: 'https://via.placeholder.com/150x100.png?text=Kodlama+Hackathonu', description: 'Yazılım tutkunları için yenilikçi projeler.', participants: 'Geliştiriciler ve öğrenciler.' },
];

const Opportunities = ({ darkMode }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const cardsPerSet = 3;
  const [currentSet, setCurrentSet] = useState(0);
  const visibleEvents = events.slice(currentSet * cardsPerSet, (currentSet + 1) * cardsPerSet);

  const handleNext = () => setCurrentSet((prev) => (prev + 1) % Math.ceil(events.length / cardsPerSet));
  const handlePrev = () => setCurrentSet((prev) => (prev - 1 + Math.ceil(events.length / cardsPerSet)) % Math.ceil(events.length / cardsPerSet));

  return (
    <section className={`${darkMode ? 'bg-nuper-dark-gray' : 'bg-nuper-gray'} py-16`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`text-3xl font-heading font-bold text-center mb-6 ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Fırsatları Keşfet</h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key={`expanded-${selectedEvent.id}`}
                className={`${darkMode ? 'bg-nuper-dark border-nuper-dark-gray' : 'bg-white'} rounded-xl border shadow-lg p-6 relative w-full h-64`}
                initial={{ width: '24rem', opacity: 0, scale: 0.95 }}
                animate={{ width: '100%', opacity: 1, scale: 1 }}
                exit={{ width: '24rem', opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ height: '16rem' }}
              >
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-nuper-blue">✕</button>
                <div className="flex space-x-4 h-full">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-1/3 h-32 object-cover rounded-lg" />
                  <div className="flex-1 overflow-y-auto">
                    <h3 className={`text-xl font-heading font-semibold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>{selectedEvent.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedEvent.date}</p>
                    <p className="text-gray-600 dark:text-gray-300">{selectedEvent.organizer}</p>
                    <p className="mt-2 text-gray-700 dark:text-nuper-light-text leading-relaxed">{selectedEvent.description}</p>
                    <p className="mt-2 text-gray-700 dark:text-nuper-light-text"><span className="font-semibold">Kimler Katılabilir:</span> {selectedEvent.participants}</p>
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
                    className={`${darkMode ? 'bg-nuper-dark border-nuper-dark-gray' : 'bg-white'} flex-shrink-0 rounded-xl border shadow-lg p-6 w-96 h-64`}
                    initial={{ opacity: 0, scale: 0.95, y: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex space-x-4">
                        <img src={event.image} alt={event.title} className="w-1/3 h-32 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className={`text-lg font-heading font-semibold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>{event.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
                          <p className="text-gray-600 dark:text-gray-300">{event.organizer}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedEvent(event)} className={`mt-2 text-nuper-blue hover:underline font-heading self-start`}>Detaylar ></button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {!selectedEvent && (
            <>
              <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-nuper-dark-blue shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-nuper-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-nuper-dark-blue shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Opportunities;