import React from 'react';
import { Link } from 'react-router-dom';

const events = [
  { id: '1', title: 'Bilim Olimpiyatları', date: '30 Haziran 2025', organizer: 'Türkiye Bilim Kurumu', image: 'https://via.placeholder.com/150x100.png?text=Bilim+Olimpiyatları', description: 'Genç bilim insanlarının yeteneklerini sergileyebileceği bir platform.', participants: 'Lise ve üniversite öğrencileri.' },
  { id: '2', title: 'Sanat Yarışması', date: '15 Temmuz 2025', organizer: 'İstanbul Sanat Vakfı', image: 'https://via.placeholder.com/150x100.png?text=Sanat+Yarışması', description: 'Resim ve müzik alanında yeteneklerini sergilemek isteyenler için.', participants: '18-25 yaş arası sanatçılar.' },
  { id: '3', title: 'Kodlama Hackathonu', date: '10 Ağustos 2025', organizer: 'Tech Türkiye', image: 'https://via.placeholder.com/150x100.png?text=Kodlama+Hackathonu', description: 'Yazılım tutkunları için yenilikçi projeler.', participants: 'Geliştiriciler ve öğrenciler.' },
  { id: '4', title: 'Matematik Yarışması', date: '5 Eylül 2025', organizer: 'Eğitim Derneği', image: 'https://via.placeholder.com/150x100.png?text=Matematik+Yarışması', description: 'Problem çözme becerilerini geliştirmek için.', participants: 'Ortaokul ve lise öğrencileri.' },
  { id: '5', title: 'Fotoğrafçılık Atölyesi', date: '20 Eylül 2025', organizer: 'Sanat Kulübü', image: 'https://via.placeholder.com/150x100.png?text=Fotoğrafçılık+Atölyesi', description: 'Doğa ve portre fotoğrafçılığı eğitimi.', participants: 'Herkes.' },
  { id: '6', title: 'Robotik Kodlama Kampı', date: '1 Ekim 2025', organizer: 'Teknoloji Enstitüsü', image: 'https://via.placeholder.com/150x100.png?text=Robotik+Kodlama', description: 'Genç mucitler için robot tasarlama.', participants: '13-18 yaş arası öğrenciler.' },
  { id: '7', title: 'Edebiyat Semineri', date: '15 Ekim 2025', organizer: 'Kültür Vakfı', image: 'https://via.placeholder.com/150x100.png?text=Edebiyat+Semineri', description: 'Yazarlarla yazım teknikleri öğrenme.', participants: 'Edebiyat severler.' },
  { id: '8', title: 'Çevre Bilinci Konferansı', date: '5 Kasım 2025', organizer: 'Yeşil Gelecek Derneği', image: 'https://via.placeholder.com/150x100.png?text=Çevre+Bilinci', description: 'Sürdürülebilirlik ve geri dönüşüm.', participants: 'Herkes.' },
  { id: '9', title: 'Müzik Festivali', date: '20 Kasım 2025', organizer: 'Gençlik Kulübü', image: 'https://via.placeholder.com/150x100.png?text=Müzik+Festivali', description: 'Yerel sanatçıların sahne aldığı etkinlik.', participants: 'Müzik severler.' },
];

const Opportunities = () => {
  return (
    <section className="bg-nuper-gray py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8 text-nuper-blue">Fırsatlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link to={`/event/${event.id}`} key={event.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="text-lg font-heading font-semibold text-nuper-blue">{event.title}</h3>
                <p className="text-gray-600">{event.date}</p>
                <p className="text-gray-600">{event.organizer}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Opportunities;