import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventDetail = ({ darkMode }) => {
  const { id } = useParams();

  const events = [
    {
      id: '1',
      title: 'Bilim Olimpiyatları',
      date: '30 Haziran 2025',
      organizer: 'Türkiye Bilim Kurumu',
      image: 'https://via.placeholder.com/150x100.png?text=Bilim+Olimpiyatları',
      description: 'Bilim Olimpiyatları, genç bilim insanlarının yeteneklerini sergileyebileceği bir platformdur. Matematik, fizik, kimya ve biyoloji alanlarında zorlu sorularla karşılaşacak, ödüller kazanma şansı elde edeceksin.',
      participants: 'Lise ve üniversite öğrencileri katılabilir.',
    },
    {
      id: '2',
      title: 'Sanat Yarışması',
      date: '15 Temmuz 2025',
      organizer: 'İstanbul Sanat Vakfı',
      image: 'https://via.placeholder.com/150x100.png?text=Sanat+Yarışması',
      description: 'Sanat Yarışması, resim ve müzik alanında yeteneklerini sergilemek isteyen genç sanatçılar için düzenleniyor. Kendi eserlerini yarat, jüri karşısında sun ve ödüller kazan!',
      participants: '18-25 yaş arası genç sanatçılar katılabilir.',
    },
    {
      id: '3',
      title: 'Kodlama Hackathonu',
      date: '10 Ağustos 2025',
      organizer: 'Tech Türkiye',
      image: 'https://via.placeholder.com/150x100.png?text=Kodlama+Hackathonu',
      description: 'Kodlama Hackathonu, yazılım tutkunları için tasarlanmış bir etkinliktir. Ekip olarak veya bireysel olarak katıl, yenilikçi projeler geliştir ve ödüller kazan!',
      participants: 'Yazılım geliştiriciler ve öğrenciler katılabilir.',
    },
    {
      id: '4',
      title: 'Matematik Yarışması',
      date: '5 Eylül 2025',
      organizer: 'Eğitim Derneği',
      image: 'https://via.placeholder.com/150x100.png?text=Matematik+Yarışması',
      description: 'Matematik Yarışması, problem çözme becerilerini geliştirmek isteyen öğrenciler için harika bir fırsat. Zorlu sorularla kendini test et, ödüller kazan!',
      participants: 'Ortaokul ve lise öğrencileri katılabilir.',
    },
    {
      id: '5',
      title: 'Fotoğrafçılık Atölyesi',
      date: '20 Eylül 2025',
      organizer: 'Sanat Kulübü',
      image: 'https://via.placeholder.com/150x100.png?text=Fotoğrafçılık+Atölyesi',
      description: 'Fotoğrafçılık Atölyesi, doğa ve portre fotoğrafçılığı üzerine uygulamalı bir eğitim sunuyor. Profesyonel fotoğrafçılardan ipuçları al, yeteneklerini geliştir!',
      participants: 'Herkes katılabilir.',
    },
    {
      id: '6',
      title: 'Robotik Kodlama Kampı',
      date: '1 Ekim 2025',
      organizer: 'Teknoloji Enstitüsü',
      image: 'https://via.placeholder.com/150x100.png?text=Robotik+Kodlama',
      description: 'Robotik Kodlama Kampı, genç mucitler için tasarlandı. Robotlar tasarla, programla ve yarışmalara katıl. Teknolojiyle yaratıcılığını birleştir!',
      participants: '13-18 yaş arası öğrenciler katılabilir.',
    },
    {
      id: '7',
      title: 'Edebiyat Semineri',
      date: '15 Ekim 2025',
      organizer: 'Kültür Vakfı',
      image: 'https://via.placeholder.com/150x100.png?text=Edebiyat+Semineri',
      description: 'Edebiyat Semineri, ünlü yazarlarla tanışma ve yazım teknikleri öğrenme fırsatı sunuyor. Kendi hikayeni yaz, edebiyat dünyasına adım at!',
      participants: 'Edebiyat severler katılabilir.',
    },
    {
      id: '8',
      title: 'Çevre Bilinci Konferansı',
      date: '5 Kasım 2025',
      organizer: 'Yeşil Gelecek Derneği',
      image: 'https://via.placeholder.com/150x100.png?text=Çevre+Bilinci',
      description: 'Çevre Bilinci Konferansı, sürdürülebilirlik ve geri dönüşüm üzerine farkındalık yaratmayı hedefliyor. Çevreyi koruma projelerine katıl!',
      participants: 'Herkes katılabilir.',
    },
    {
      id: '9',
      title: 'Müzik Festivali',
      date: '20 Kasım 2025',
      organizer: 'Gençlik Kulübü',
      image: 'https://via.placeholder.com/150x100.png?text=Müzik+Festivali',
      description: 'Müzik Festivali, yerel sanatçıların sahne aldığı bir etkinlik. Canlı performanslar, atölyeler ve müzik dolu bir gün seni bekliyor!',
      participants: 'Müzik severler katılabilir.',
    },
  ];

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className={`${darkMode ? 'bg-nuper-dark-gray text-nuper-light-text' : 'bg-white text-gray-900'} min-h-screen font-sans transition-colors duration-500 pt-16`}>
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className={`text-3xl font-heading font-bold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>Etkinlik Bulunamadı</h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-nuper-light-text">Aradığınız etkinlik mevcut değil. Ana sayfaya dönerek diğer fırsatları keşfedebilirsiniz.</p>
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
            <h2 className={`text-3xl font-heading font-bold mb-6 ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'}`}>{event.title}</h2>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <img src={event.image} alt={event.title} className="w-full md:w-1/3 h-48 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{event.organizer}</p>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-nuper-light-text">{event.description}</p>
                <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-nuper-light-text">
                  <span className="font-semibold">Kimler Katılabilir:</span> {event.participants}
                </p>
              </div>
            </div>
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

export default EventDetail;