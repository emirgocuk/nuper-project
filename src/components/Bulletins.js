import React from 'react';
import { Link } from 'react-router-dom';

const bulletins = [
  { id: '1', title: 'Yaz Dönemi Yarışmaları', date: '1 Haziran 2025', image: 'https://via.placeholder.com/150x100.png?text=Yaz+Yarışmaları', content: 'Bu yaz katılabileceğin en heyecan verici yarışmalar burada! Detaylar için kaydolmayı unutma. Yarışmalar, gençlerin yeteneklerini sergilemeleri ve ödüller kazanmaları için eşsiz bir fırsat sunuyor.' },
  { id: '2', title: 'Yeni Atölye Programları', date: '15 Haziran 2025', image: 'https://via.placeholder.com/150x100.png?text=Atölye+Programları', content: 'Sanat ve teknoloji atölyeleri için kayıtlar başladı. Hemen yerini ayır! Bu programlar, katılımcılara pratik deneyim ve uzman rehberliği sunuyor.' },
  { id: '3', title: 'Burs Duyuruları', date: '1 Temmuz 2025', image: 'https://via.placeholder.com/150x100.png?text=Burs+Duyuruları', content: '2025 burs fırsatları açıklandı, başvuru için son tarih 15 Temmuz. Başvurular için gerekli belgeleri hazırlamayı unutmayın!' },
];

const Bulletins = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8 text-nuper-blue">Bültenler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bulletins.map((bulletin) => (
            <Link to={`/bulletin/${bulletin.id}`} key={bulletin.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img src={bulletin.image} alt={bulletin.title} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="text-lg font-heading font-semibold text-nuper-blue">{bulletin.title}</h3>
                <p className="text-gray-600">{bulletin.date}</p>
                <p className="mt-2 text-gray-700">{bulletin.content.substring(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bulletins;