import React from 'react';
import { useParams } from 'react-router-dom';

const bulletins = [
  { id: '1', title: 'Yaz Dönemi Yarışmaları', date: '1 Haziran 2025', content: 'Bu yaz katılabileceğin en heyecan verici yarışmalar burada! Detaylar için kaydolmayı unutma.' },
  { id: '2', title: 'Yeni Atölye Programları', date: '15 Haziran 2025', content: 'Sanat ve teknoloji atölyeleri için kayıtlar başladı. Hemen yerini ayır!' },
  { id: '3', title: 'Burs Duyuruları', date: '1 Temmuz 2025', content: '2025 burs fırsatları açıklandı, başvuru için son tarih 15 Temmuz.' },
];

const BulletinDetail = () => {
  const { id } = useParams();
  const bulletin = bulletins.find(b => b.id === id);

  if (!bulletin) return <div>Bülten bulunamadı.</div>;

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-nuper-blue mb-4">{bulletin.title}</h2>
        <p className="text-gray-600">Tarih: {bulletin.date}</p>
        <p className="mt-2 text-gray-700">{bulletin.content}</p>
      </div>
    </section>
  );
};

export default BulletinDetail;