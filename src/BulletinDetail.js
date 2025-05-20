import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const BulletinDetail = ({ darkMode }) => {
  const { id } = useParams();

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

  const bulletin = bulletins.find((b) => b.id === id);

  if (!bulletin) {
    return (
      <div className={`${darkMode ? 'bg-nuper-dark-gray text-nuper-light-text' : 'bg-white text-gray-900'} min-h-screen font-sans transition-colors duration-500 pt-16`}>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className={`text-3xl font-heading font-bold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Bülten Bulunamadı</h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-nuper-light-text">Aradığınız bülten mevcut değil. Bültenler sayfasına dönerek diğer bültenleri keşfedebilirsiniz.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-nuper-dark-gray text-nuper-light-text' : 'bg-white text-gray-900'} min-h-screen font-sans transition-colors duration-500 pt-16`}>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-3xl font-heading font-bold mb-6 ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>{bulletin.title}</h2>
            <p className={`text-gray-600 dark:text-gray-300 mb-4`}>{bulletin.date}</p>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-nuper-light-text' : 'text-gray-700'}`}>{bulletin.content}</p>
          </motion.div>
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

export default BulletinDetail;