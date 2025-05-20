import React from 'react';
import { useParams } from 'react-router-dom';

const bulletins = [
  { id: '1', title: 'Yaz Dönemi Yarışmaları', date: '1 Haziran 2025', image: 'https://via.placeholder.com/150x100.png?text=Yaz+Yarışmaları', content: 'Bu yaz katılabileceğin en heyecan verici yarışmalar burada! Detaylar için kaydolmayı unutma. Yarışmalar, gençlerin yeteneklerini sergilemeleri ve ödüller kazanmaları için eşsiz bir fırsat sunuyor. Kayıtlar 15 Haziran’da sona eriyor.' },
  { id: '2', title: 'Yeni Atölye Programları', date: '15 Haziran 2025', image: 'https://via.placeholder.com/150x100.png?text=Atölye+Programları', content: 'Sanat ve teknoloji atölyeleri için kayıtlar başladı. Hemen yerini ayır! Bu programlar, katılımcılara pratik deneyim ve uzman rehberliği sunuyor. Son başvuru tarihi 30 Haziran.' },
  { id: '3', title: 'Burs Duyuruları', date: '1 Temmuz 2025', image: 'https://via.placeholder.com/150x100.png?text=Burs+Duyuruları', content: '2025 burs fırsatları açıklandı, başvuru için son tarih 15 Temmuz. Başvurular için gerekli belgeleri hazırlamayı unutmayın! Detaylar için Nuper’a göz atın.' },
];

const BulletinDetail = () => {
  const { id } = useParams();
  const bulletin = bulletins.find(b => b.id === id);

  if (!bulletin) return <div>Bülten bulunamadı.</div>;

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-heading font-bold text-nuper-blue mb-2">{bulletin.title}</h2>
        <p className="text-gray-600 mb-4">{bulletin.date}</p>
        <img src={bulletin.image} alt={bulletin.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        <p className="text-gray-700 leading-relaxed">{bulletin.content}</p>
      </div>
    </section>
  );
};

export default BulletinDetail;