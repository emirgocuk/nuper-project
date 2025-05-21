// src/components/BulletinDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faBuilding, faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Bulletins.js'deki (veya Firebase'deki) veri yapısına uygun bir bülten detayı
const bulletins = [
    {
        id: 'b-1',
        slug: 'otomotiv-sektorunde-dort-ayin-rontgeni-yine-mis-gibi-yaptik',
        type: 'bülten',
        publisher: 'Pareto Mobilite',
        publisherLogo: 'https://via.placeholder.com/40x40.png?text=PM',
        title: 'Otomotiv sektöründe dört ayın röntgeni: Yine -\'mış gibi\' yaptık',
        summary: 'Yılın ilk çeyreği, otomotiv sektörü için “bahar rüzgarı” havasında geçti. Satışlar yine rekor seviyedeydi, elektrikli otomobil pazarı yükseliş ivmesi gösterdi ve Rekabet Kurulu’ndan dev birleşmeye onay çıktı. Fakat sektör, esasında “-mış gibi” yaptığı bir dönemi geride...',
        image: 'https://via.placeholder.com/800x450.png?text=OtomotivSektoru',
        authorName: 'Ahmet Çelik',
        date: '21 Mayıs 2025',
        fullContent: `Otomotiv sektöründe 2025 yılının ilk dört ayı, beklentilerin üzerinde bir satış performansıyla geçti. Özellikle elektrikli araç segmentinde yaşanan büyüme, sektördeki dönüşümün hızlandığını gösteriyor. Ancak, küresel tedarik zinciri sorunları ve hammadde fiyatlarındaki dalgalanmalar, sektörün önündeki belirsizlikleri koruyor.
        
        Rekabet Kurulu'ndan gelen dev birleşme onayı, sektörde konsolidasyon eğilimlerinin devam edeceğinin sinyallerini verdi. Bu birleşmelerin, pazar dinamiklerini nasıl etkileyeceği merak konusu. Öte yandan, Ar-Ge yatırımları ve otonom sürüş teknolojilerine olan ilgi artarak devam ediyor. Sektör temsilcileri, sürdürülebilirlik ve dijitalleşmenin önümüzdeki dönemin ana gündem maddeleri olacağını belirtiyor.`,
        tags: ['otomotiv', 'elektrikli araç', 'ekonomi', 'sektör analizi']
    },
    {
      id: 'b-2',
      slug: 'yapay-zeka-ve-gelecegimiz-yeni-donemin-trendleri',
      type: 'bülten',
      publisher: 'Dijital Türkiye',
      publisherLogo: 'https://via.placeholder.com/40x40.png?text=DT',
      title: 'Yapay Zeka ve Geleceğimiz: Yeni Dönemin Trendleri',
      summary: 'Yapay zeka teknolojileri, hayatımızın her alanına hızla entegre olmaya devam ediyor. Bu bülten, en son yapay zeka trendlerini, iş dünyasına etkilerini ve gelecekte bizi nelerin beklediğini derinlemesine inceliyor...',
      image: 'https://via.placeholder.com/350x250.png?text=YapayZeka',
      authorName: 'Ayşe Yılmaz',
      date: '10 Nisan 2025',
      fullContent: `Yapay zeka, sadece teknoloji dünyasında değil, sağlık, eğitim, finans gibi birçok sektörde devrim niteliğinde değişimler yaratıyor. Makine öğrenimi, derin öğrenme ve doğal dil işleme gibi alt dallarındaki gelişmeler, yapay zekanın yeteneklerini her geçen gün artırıyor. Bu bültende, en güncel yapay zeka uygulamalarını, etik tartışmaları ve gelecekteki potansiyelini ele alıyoruz.`,
      tags: ['yapay zeka', 'teknoloji', 'inovasyon', 'gelecek']
    },
];

const BulletinDetail = () => {
    const { slug } = useParams(); // Slug'ı URL'den çekiyoruz
    const [bulletin, setBulletin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Normalde burada Firebase'den veya API'den slug'a göre veri çekilir
        const foundBulletin = bulletins.find((b) => b.slug === slug); // Slug ile bülten buluyoruz
        if (foundBulletin) {
            setBulletin(foundBulletin);
        }
        setLoading(false);
    }, [slug]); // Bağımlılık slug'a göre ayarlandı

    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Yükleniyor...</p>
            </div>
        );
    }

    if (!bulletin) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Bülten bulunamadı.</p>
            </div>
        );
    }

    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Görsel Alanı */}
                {bulletin.image && (
                    <img
                        src={bulletin.image}
                        alt={bulletin.title}
                        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
                    />
                )}

                {/* Başlık */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-6 leading-tight">
                    {bulletin.title}
                </h1>

                {/* Özet */}
                {bulletin.summary && (
                    <p className="text-xl text-gray-700 font-sans mb-8 leading-relaxed">
                        {bulletin.summary}
                    </p>
                )}

                {/* Temel Bilgiler */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                    <h2 className="text-2xl font-heading font-bold text-nuper-blue mb-4">Bülten Detayları</h2>
                    <ul className="space-y-3 text-gray-800 font-sans">
                        <li>
                            <FontAwesomeIcon icon={faBuilding} className="text-nuper-blue mr-3 w-5" />
                            <strong>Yayınlayan:</strong> {bulletin.publisher}
                        </li>
                        {bulletin.authorName && (
                            <li>
                                <FontAwesomeIcon icon={faUser} className="text-nuper-blue mr-3 w-5" />
                                <strong>Yazar:</strong> {bulletin.authorName}
                            </li>
                        )}
                        <li>
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-nuper-blue mr-3 w-5" />
                            <strong>Yayın Tarihi:</strong> {bulletin.date}
                        </li>
                    </ul>
                </div>

                {/* Tam İçerik */}
                {bulletin.fullContent && (
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                        <h2 className="text-2xl font-heading font-bold text-nuper-blue mb-4">İçerik</h2>
                        <p className="text-gray-800 leading-relaxed font-sans whitespace-pre-line">
                            {bulletin.fullContent}
                        </p>
                    </div>
                )}

                {/* Etiketler (Opsiyonel) */}
                {bulletin.tags && bulletin.tags.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                        <h2 className="text-2xl font-heading font-bold text-nuper-blue mb-4">Etiketler</h2>
                        <div className="flex flex-wrap gap-2">
                            {bulletin.tags.map((tag, index) => (
                                <span key={index} className="bg-nuper-blue/10 text-nuper-blue text-sm font-semibold px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link to="/bulletins" className="text-nuper-blue hover:underline font-semibold font-sans">
                        Tüm Bültenleri Görüntüle
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BulletinDetail;