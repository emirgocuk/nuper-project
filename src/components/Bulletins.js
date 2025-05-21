// src/components/Bulletins.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Slug eklenmiş örnek Bülten Verileri
const bulletinsData = [
  {
    id: 'b-1',
    slug: 'otomotiv-sektorunde-dort-ayin-rontgeni-yine-mis-gibi-yaptik', // Yeni slug
    type: 'bülten',
    publisher: 'Pareto Mobilite',
    publisherLogo: 'https://via.placeholder.com/40x40.png?text=PM',
    title: 'Otomotiv sektöründe dört ayın röntgeni: Yine -\'mış gibi\' yaptık',
    summary: 'Yılın ilk çeyreği, otomotiv sektörü için “bahar rüzgarı” havasında geçti. Satışlar yine rekor seviyedeydi, elektrikli otomobil pazarı yükseliş ivmesi gösterdi ve Rekabet Kurulu’ndan dev birleşmeye onay çıktı. Fakat sektör, esasında “-mış gibi” yaptığı bir dönemi geride...',
    image: 'https://via.placeholder.com/350x250.png?text=Otomotiv',
    authorName: 'Ahmet Çelik',
    date: '21 Mayıs 2025',
  },
  {
    id: 'b-2',
    slug: 'yapay-zeka-ve-gelecegimiz-yeni-donemin-trendleri', // Yeni slug
    type: 'bülten',
    publisher: 'Dijital Türkiye',
    publisherLogo: 'https://via.placeholder.com/40x40.png?text=DT',
    title: 'Yapay Zeka ve Geleceğimiz: Yeni Dönemin Trendleri',
    summary: 'Yapay zeka teknolojileri, hayatımızın her alanına hızla entegre olmaya devam ediyor. Bu bülten, en son yapay zeka trendlerini, iş dünyasına etkilerini ve gelecekte bizi nelerin beklediğini derinlemesine inceliyor...',
    image: 'https://via.placeholder.com/350x250.png?text=YapayZeka',
    authorName: 'Ayşe Yılmaz',
    date: '10 Nisan 2025',
  },
  {
    id: 'b-3',
    slug: 'uzaktan-egitimde-yeni-yaklasimlar-neler-degisti', // Yeni slug
    type: 'bülten',
    publisher: 'Eğitim Gündemi',
    publisherLogo: 'https://via.placeholder.com/40x40.png?text=EG',
    title: 'Uzaktan Eğitimde Yeni Yaklaşımlar: Neler Değişti?',
    summary: 'Pandemi ile hız kazanan uzaktan eğitim, bugün yeni yöntemlerle ve teknolojilerle evrilmeye devam ediyor. Bu bültende, uzaktan eğitimin avantajları, karşılaşılan zorluklar ve yenilikçi çözümler ele alınıyor...',
    image: 'https://via.placeholder.com/350x250.png?text=UzaktanEgitim',
    authorName: 'Zeynep Demir',
    date: '5 Mart 2025',
  },
];

const Bulletins = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-bold text-center text-nuper-blue mb-12">Bültenler</h1>
      <div className="grid grid-cols-1 gap-8">
        {bulletinsData.map((bulletin) => (
          <motion.div
            key={bulletin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch border border-gray-200"
          >
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="flex items-center text-sm text-gray-600 mb-3">
                {bulletin.publisherLogo && (
                  <img src={bulletin.publisherLogo} alt={bulletin.publisher} className="w-8 h-8 rounded-md mr-2 object-cover" />
                )}
                <span className="font-semibold text-nuper-blue">{bulletin.publisher}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-700 font-medium">{bulletin.type.toUpperCase()}</span>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 leading-tight mb-3">
                  {/* Link slug ile güncellendi */}
                  <Link to={`/bulletin/${bulletin.slug}`} className="hover:text-nuper-blue transition-colors duration-200">
                    {bulletin.title}
                  </Link>
                </h2>
                <p className="text-gray-700 text-base font-sans leading-relaxed mb-4">
                  {bulletin.summary}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
                <div className="flex items-center">
                  <span className="text-gray-700">{bulletin.date}</span>
                </div>
              </div>
            </div>

            {bulletin.image && (
              <div className="w-full md:w-2/5 flex-shrink-0">
                <img
                  src={bulletin.image}
                  alt={bulletin.title}
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

export default Bulletins;