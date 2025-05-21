import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faBuilding, faMapMarkerAlt, faUsers, faInfoCircle, faClipboardList, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

// App.js'deki events verisini burada kullanmak için kopyaladım ve slug ekledim.
// Normalde bu veri props olarak gelir veya Firebase'den çekilir.
const events = [
    {
        id: '1',
        slug: 'ulusal-bilim-olimpiyatlari-basvurulari-basladi', // Slug eklendi
        title: 'Ulusal Bilim Olimpiyatları Başvuruları Başladı!',
        date: '30 Haziran 2025',
        organizer: 'Türkiye Bilim Kurumu',
        image: 'https://via.placeholder.com/800x450.png?text=Ulusal+Bilim+Olimpiyatları',
        location: 'Ankara Üniversitesi Kampüsü',
        summary: 'Genç bilim insanlarının yeteneklerini sergileyebileceği, akademik kariyerlerine yön verecek ulusal çapta prestijli bir platform. Matematik, Fizik, Kimya ve Biyoloji dallarında yeteneklerini test etme fırsatı seni bekliyor...',
        description: `Ülke genelindeki lise ve üniversite öğrencilerini kapsayan Ulusal Bilim Olimpiyatları, bilimsel düşünme ve problem çözme becerilerini geliştirmeyi hedeflemektedir. Katılımcılar, alanında uzman akademisyenler tarafından hazırlanan sorularla bilgi ve yeteneklerini sınayacaklardır. Bu etkinlik, geleceğin bilim insanlarını keşfetmek ve onlara destek olmak amacıyla düzenlenmektedir. Olimpiyatlar, aynı zamanda öğrencilere farklı üniversitelerin akademik ortamlarını tanıma ve bilimsel networklerini geliştirme imkanı sunar.`,
        additionalInfo: `Olimpiyatlara katılım için online başvuru formu doldurulması gerekmektedir. Son başvuru tarihi 15 Haziran 2025'tir. Ön eleme sınavları çevrimiçi yapılacak olup, finale kalan öğrenciler Ankara'daki kampüste yüz yüze yarışacaklardır. Konaklama ve yemek masrafları organizasyon tarafından karşılanacaktır. Detaylı bilgilere ve geçmiş yıl sorularına web sitemizden ulaşabilirsiniz.`,
        participants: 'Lise ve üniversite öğrencileri (14-23 yaş arası)',
        programSchedule: [
            { time: '09:00', activity: 'Kayıt ve Açılış Seremonisi' },
            { time: '10:00', activity: 'Matematik Sınavı (1. Oturum)' },
            { time: '11:30', activity: 'Fizik Sınavı (1. Oturum)' },
            { time: '13:00', activity: 'Öğle Yemeği' },
            { time: '14:00', activity: 'Kimya Sınavı (2. Oturum)' },
            { time: '15:30', activity: 'Biyoloji Sınavı (2. Oturum)' },
            { time: '17:00', activity: 'Kapanış Konuşması ve Ödül Töreni' },
        ],
        registrationLink: 'https://form.example.com/bilim-olimpiyatlari',
        contactEmail: 'bilimolimpiyatlari@example.com'
    },
    {
      id: '2',
      slug: 'sanat-yarismasi', // Slug eklendi
      title: 'Sanat Yarışması', date: '15 Temmuz 2025', organizer: 'İstanbul Sanat Vakfı', image: 'https://via.placeholder.com/400x250.png?text=Sanat+Yarışması', description: 'Resim ve müzik alanında yeteneklerini sergilemek isteyenler için bir fırsat.', additionalInfo: 'Eserler profesyonel bir jüri tarafından değerlendirilecek ve en iyileri sergilenecektir.', participants: '18-25 yaş arası sanatçılar.', location: 'İstanbul Sanat Merkezi'
    },
    // ... diğer etkinlik verileri buraya eklenebilir
];


const EventDetail = () => {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Normalde burada Firebase'den veya API'den slug'a göre veri çekilir
        const foundEvent = events.find((e) => e.slug === slug);
        if (foundEvent) {
            setEvent(foundEvent);
        }
        setLoading(false);
    }, [slug]);

    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Yükleniyor...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Etkinlik bulunamadı.</p>
            </div>
        );
    }

    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md"> {/* İçeriği bir kart içine aldık */}
                {/* Başlık */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-4 leading-tight">
                    {event.title}
                </h1>
                
                {/* Özet (Artık text-lg) */}
                {event.summary && (
                    <p className="text-lg text-gray-700 font-sans mb-8 leading-relaxed">
                        {event.summary}
                    </p>
                )}
                
                {/* Temel Bilgiler */}
                <div className="mb-8">
                    <ul className="space-y-3 text-gray-800 font-sans">
                        <li>
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-nuper-blue mr-3 w-5" />
                            <strong>Tarih:</strong> {event.date}
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faBuilding} className="text-nuper-blue mr-3 w-5" />
                            <strong>Düzenleyen:</strong> {event.organizer}
                        </li>
                        {event.location && (
                            <li>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-nuper-blue mr-3 w-5" />
                                <strong>Yer:</strong> {event.location}
                            </li>
                        )}
                        {event.participants && (
                            <li>
                                <FontAwesomeIcon icon={faUsers} className="text-nuper-blue mr-3 w-5" />
                                <strong>Katılımcılar:</strong> {event.participants}
                            </li>
                        )}
                    </ul>
                </div>

                {/* Etkinlik Görseli (Buraya, temel bilgilerden sonra taşındı) */}
                {event.image && (
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
                    />
                )}

                {/* Detaylı Açıklama ve Ek Bilgiler birleştirildi - Başlık kaldırıldı */}
                {(event.description || event.additionalInfo) && (
                    <div className="mb-8">
                        {/* Description (Artık text-lg) */}
                        {event.description && (
                            <p className="text-lg text-gray-800 leading-relaxed font-sans whitespace-pre-line mb-4">
                                {event.description}
                            </p>
                        )}
                        {event.additionalInfo && (
                            <p className="text-lg text-gray-800 leading-relaxed font-sans whitespace-pre-line">
                                {event.additionalInfo}
                            </p>
                        )}
                    </div>
                )}
                
                {/* Program Akışı */}
                {event.programSchedule && event.programSchedule.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-heading font-bold text-nuper-blue mb-4">Program Akışı</h2>
                        <ul className="space-y-3 text-gray-800 font-sans">
                            {event.programSchedule.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <FontAwesomeIcon icon={faClipboardList} className="text-nuper-blue mr-3 mt-1 flex-shrink-0 w-5" />
                                    <span>
                                        <strong>{item.time}:</strong> {item.activity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Eylem Butonları */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    {event.registrationLink && (
                        <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-nuper-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-nuper-dark-blue transition-colors duration-300 flex items-center justify-center font-heading"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                            Hemen Kaydol
                        </a>
                    )}
                    {event.contactEmail && (
                        <a
                            href={`mailto:${event.contactEmail}`}
                            className="bg-gray-200 text-nuper-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center font-heading"
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                            İletişime Geç
                        </a>
                    )}
                </div>

                <div className="text-center mt-12">
                    <Link to="/opportunities" className="text-nuper-blue hover:underline font-semibold font-sans">
                        Tüm Etkinlikleri Görüntüle
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;