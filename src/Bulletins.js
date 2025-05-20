import React from 'react';
import { motion } from 'framer-motion';

const Bulletins = ({ darkMode }) => {
  const bulletins = [
    {
      id: '1',
      title: 'Mayıs 2025 Bülteni',
      date: '20 Mayıs 2025',
      content: 'Bu ayın öne çıkan etkinlikleri: Bilim Olimpiyatları, Sanat Yarışması ve Kodlama Hackathonu. Detaylar için fırsatlar sayfamızı ziyaret edin! Yeni üyelerimiz için özel indirimler de mevcut.',
    },
    {
      id: '2',
      title: 'Haziran 2025 Bülteni',
      date: '15 Haziran 2025',
      content: 'Yaz dönemi etkinlikleri başlıyor! Fotoğrafçılık Atölyesi ve Robotik Kodlama Kampı ile yeteneklerinizi geliştirin. Katılım için kayıt formunu doldurun.',
    },
    {
      id: '3',
      title: 'Eylül 2025 Bülteni',
      date: '1 Eylül 2025',
      content: 'Yeni eğitim yılına özel: Matematik Yarışması ve Edebiyat Semineri. Öğrenciler için burs fırsatları da duyuruldu. Detaylar yakında!',
    },
  ];

  return (
    <div className={`${darkMode ? 'bg-nuper-dark-gray text-nuper-light-text' : 'bg-white text-gray-900'} min-h-screen font-serif transition-colors duration-500 pt-16`}>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className={`text-4xl font-heading font-bold text-center mb-12 ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'} animate-fade-in`}>Bültenler</h2>
          <div className="flex flex-col items-center space-y-12">
            {bulletins.map((bulletin) => (
              <motion.div
                key={bulletin.id}
                className={`${darkMode ? 'bg-nuper-dark border-nuper-dark-gray' : 'bg-white border-gray-200'} rounded-lg border shadow-lg p-8 max-w-2xl w-full`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className={`text-2xl font-serif font-semibold mb-4 ${darkMode ? 'text-nuper-light-text' : 'text-gray-900'}`}>{bulletin.title}</h3>
                <p className={`text-sm text-gray-600 dark:text-gray-400 mb-4`}>{bulletin.date}</p>
                <p className={`text-lg font-serif leading-relaxed ${darkMode ? 'text-nuper-light-text' : 'text-gray-700'}`}>
                  {bulletin.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className={`${darkMode ? 'bg-nuper-dark-gray' : 'bg-nuper-blue'} text-nuper-light-text py-6 text-center`}>
        <p className="animate-fade-in">
          Bizi takip et:{' '}
          <a href="https://x.com/nuperplatform" className="text-nuper-gray hover:text-nuper-blue">X</a> |{' '}
          <a href="https://linkedin.com/company/nuperplatform" className="text-nuper-gray hover:text-nuper-blue">LinkedIn</a>
        </p>
        <p className="mt-2 animate-fade-in font-heading">Nuper © 2025</p>
      </footer>
    </div>
  );
};

export default Bulletins;