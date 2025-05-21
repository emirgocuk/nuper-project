// src/components/Opportunities.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

// Slug eklenmiş örnek Etkinlik Verileri
const opportunitiesData = [
  {
    id: 'o-1', // ID'ler hala kendi içlerinde benzersiz kalabilir, ancak linkleme slug ile
    slug: 'ulusal-bilim-olimpiyatlari-basvurulari-basladi', // Yeni slug
    type: 'etkinlik',
    organizerName: 'Türkiye Bilim Kurumu',
    organizerLogo: 'https://via.placeholder.com/40x40.png?text=TBK',
    title: 'Ulusal Bilim Olimpiyatları Başvuruları Başladı!',
    summary: 'Genç bilim insanlarının yeteneklerini sergileyebileceği, akademik kariyerlerine yön verecek ulusal çapta prestijli bir platform. Matematik, Fizik, Kimya ve Biyoloji dallarında yeteneklerini test etme fırsatı seni bekliyor...',
    image: 'https://via.placeholder.com/350x250.png?text=BilimOlimpiyat',
    date: '30 Haziran 2025',
    participants: 'Lise ve üniversite öğrencileri',
    location: 'Ankara',
  },
  {
    id: 'o-2',
    slug: 'genc-sanatcilar-resim-ve-muzik-yarismasi', // Yeni slug
    type: 'etkinlik',
    organizerName: 'İstanbul Sanat Vakfı',
    organizerLogo: 'https://via.placeholder.com/40x40.png?text=ISV',
    title: 'Genç Sanatçılar Resim ve Müzik Yarışması',
    summary: 'Sanatın farklı disiplinlerinde yeteneklerini sergilemek isteyen genç sanatçılar için büyük bir fırsat. Profesyonel jüri değerlendirmesi ve sergileme imkanı sunuluyor...',
    image: 'https://via.placeholder.com/350x250.png?text=SanatYarismasi',
    date: '15 Temmuz 2025',
    participants: '18-25 yaş arası sanatçılar',
    location: 'İstanbul',
  },
  {
    id: 'o-3',
    slug: '24-saatlik-yenilikci-kodlama-hackathonu', // Yeni slug
    type: 'etkinlik',
    organizerName: 'Tech Türkiye',
    organizerLogo: 'https://via.placeholder.com/40x40.png?text=TT',
    title: '24 Saatlik Yenilikçi Kodlama Hackathonu',
    summary: 'Yazılım tutkunları için tasarlanmış bu hackathon, 24 saat içinde sıfırdan yenilikçi projeler geliştirme ve sektör liderleriyle tanışma fırsatı sunuyor. En iyi projeler ödüllendirilecek...',
    image: 'https://via.placeholder.com/350x250.png?text=Hackathon',
    date: '10 Ağustos 2025',
    participants: 'Geliştiriciler ve üniversite öğrencileri',
    location: 'Online',
  },
];


const Opportunities = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-bold text-center text-nuper-blue mb-12">Etkinlikler</h1>
      <div className="grid grid-cols-1 gap-8">
        {opportunitiesData.map((opportunity) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch border border-gray-200"
          >
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="flex items-center text-sm text-gray-600 mb-3">
                {opportunity.organizerLogo && (
                  <img src={opportunity.organizerLogo} alt={opportunity.organizerName} className="w-8 h-8 rounded-md mr-2 object-cover" />
                )}
                <span className="font-semibold text-nuper-blue">{opportunity.organizerName}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-700 font-medium">{opportunity.type.toUpperCase()}</span>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 leading-tight mb-3">
                  {/* Link slug ile güncellendi */}
                  <Link to={`/event/${opportunity.slug}`} className="hover:text-nuper-blue transition-colors duration-200">
                    {opportunity.title}
                  </Link>
                </h2>
                <p className="text-gray-700 text-base font-sans leading-relaxed mb-4">
                  {opportunity.summary}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 mt-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <span className="font-medium">{opportunity.date}</span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-700">{opportunity.participants}</span>
                </div>
                {opportunity.location && (
                  <div className="flex items-center text-nuper-blue font-semibold">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                    <span>{opportunity.location}</span>
                  </div>
                )}
              </div>
            </div>

            {opportunity.image && (
              <div className="w-full md:w-2/5 flex-shrink-0">
                <img
                  src={opportunity.image}
                  alt={opportunity.title}
                  className="w-full h-48 md:h-full object-cover rounded-tr-lg rounded-br-lg md:rounded-bl-none"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;