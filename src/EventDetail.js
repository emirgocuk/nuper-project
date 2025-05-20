import React from 'react';
import { useParams, Link } from 'react-router-dom';

const events = [
  {
    id: '1',
    title: 'Bilim Olimpiyatları',
    date: '30 Haziran 2025',
    organizer: 'Türkiye Bilim Kurumu',
    description: 'Bilim Olimpiyatları, genç bilim insanlarının yeteneklerini sergileyebileceği bir platformdur. Matematik, fizik, kimya ve biyoloji alanlarında zorlu sorularla karşılaşacak, ödüller kazanma şansı elde edeceksin. Bu etkinlik, bilimsel düşünceyi geliştirmek ve rekabet ortamında kendini test etmek isteyen öğrenciler için harika bir fırsat! Katılım için hemen kaydol, bu eşsiz deneyimi kaçırma.',
    participants: 'Lise ve üniversite öğrencileri katılabilir.'
  },
  {
    id: '2',
    title: 'Sanat Yarışması',
    date: '15 Temmuz 2025',
    organizer: 'İstanbul Sanat Vakfı',
    description: 'Sanat Yarışması, resim ve müzik alanında yeteneklerini sergilemek isteyen genç sanatçılar için düzenleniyor. Kendi eserlerini yarat, jüri karşısında sun ve ödüller kazan! İstanbul’un tarihi mekanlarında gerçekleşecek bu etkinlik, sanat tutkunları için unutulmaz bir deneyim sunacak. Hayal gücünü özgür bırak, sanatınla fark yarat!',
    participants: '18-25 yaş arası genç sanatçılar katılabilir.'
  },
  {
    id: '3',
    title: 'Kodlama Hackathonu',
    date: '10 Ağustos 2025',
    organizer: 'Tech Türkiye',
    description: 'Kodlama Hackathonu, yazılım tutkunları için tasarlanmış bir etkinliktir. Ekip olarak veya bireysel olarak katıl, yenilikçi projeler geliştir ve ödüller kazan! 48 saat sürecek bu maratonda, mentorlar eşliğinde kodlama becerilerini geliştirecek, yeni teknolojiler keşfedeceksin. Online platformda gerçekleşecek bu etkinlik, sınırları zorlamak isteyenler için ideal.',
    participants: 'Yazılım geliştiriciler ve öğrenciler katılabilir.'
  },
];

const EventDetail = ({ darkMode }) => {
  const { id } = useParams();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-nuper-dark text-nuper-light-text' : 'bg-nuper-gray text-gray-900'}`}>Etkinlik bulunamadı.</div>;
  }

  return (
    <div className={`${darkMode ? 'dark bg-nuper-dark' : 'bg-nuper-gray'} min-h-screen font-sans text-gray-900 dark:text-nuper-light-text pt-24 pb-16`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${darkMode ? 'bg-nuper-dark-gray' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8 border ${darkMode ? 'border-nuper-dark-gray' : 'border-gray-200'}`}>
          <h1 className={`text-3xl font-heading font-bold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'} mb-4`}>{event.title}</h1>
          <div className="flex flex-col sm:flex-row sm:space-x-6 text-gray-600 dark:text-gray-300">
            <p>{event.date}</p>
            <p>{event.organizer}</p>
          </div>
          <Link to="/" className={`mt-4 inline-block text-nuper-blue hover:underline font-heading`}>← Geri Dön</Link>
        </div>
        <div className={`${darkMode ? 'bg-nuper-dark-gray' : 'bg-white'} rounded-xl shadow-lg p-6 border ${darkMode ? 'border-nuper-dark-gray' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-heading font-semibold ${darkMode ? 'text-nuper-light-text' : 'text-nuper-blue'} mb-4`}>Etkinlik Hakkında</h2>
          <p className="text-lg text-gray-700 dark:text-nuper-light-text leading-relaxed">{event.description}</p>
          <p className="mt-2 text-lg text-gray-700 dark:text-nuper-light-text leading-relaxed"><span className="font-semibold">Kimler Katılabilir:</span> {event.participants}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;