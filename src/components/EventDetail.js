import React from 'react';
import { useParams } from 'react-router-dom';

const events = [
  { id: '1', title: 'Bilim Olimpiyatları', date: '30 Haziran 2025', organizer: 'Türkiye Bilim Kurumu', image: 'https://via.placeholder.com/150x100.png?text=Bilim+Olimpiyatları', description: 'Genç bilim insanlarının yeteneklerini sergileyebileceği bir platform.', participants: 'Lise ve üniversite öğrencileri.' },
  { id: '2', title: 'Sanat Yarışması', date: '15 Temmuz 2025', organizer: 'İstanbul Sanat Vakfı', image: 'https://via.placeholder.com/150x100.png?text=Sanat+Yarışması', description: 'Resim ve müzik alanında yeteneklerini sergilemek isteyenler için.', participants: '18-25 yaş arası sanatçılar.' },
  { id: '3', title: 'Kodlama Hackathonu', date: '10 Ağustos 2025', organizer: 'Tech Türkiye', image: 'https://via.placeholder.com/150x100.png?text=Kodlama+Hackathonu', description: 'Yazılım tutkunları için yenilikçi projeler.', participants: 'Geliştiriciler ve öğrenciler.' },
];

const EventDetail = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === id);

  if (!event) return <div>Etkinlik bulunamadı.</div>;

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-nuper-blue mb-4">{event.title}</h2>
        <div className="flex space-x-4">
          <img src={event.image} alt={event.title} className="w-1/3 h-32 object-cover rounded-lg" />
          <div>
            <p className="text-gray-600">Tarih: {event.date}</p>
            <p className="text-gray-600">Organizatör: {event.organizer}</p>
            <p className="mt-2 text-gray-700">{event.description}</p>
            <p className="mt-2 text-gray-700"><strong>Kimler Katılabilir:</strong> {event.participants}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetail;