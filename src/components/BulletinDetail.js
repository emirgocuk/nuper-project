import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Font Awesome importları artık bu dosyada kullanılmadığı için kaldırıldı.
// FontAwesomeIcon bileşenini de artık kullanmayacağız, dolayısıyla import etmiyoruz.
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// Örnek Bülten Verileri (Firebase entegrasyonundan sonra bu kaldırılacak)
const bulletins = [
    {
        id: 'b-1',
        slug: 'otomotiv-sektorunde-dort-ayin-rontgeni-yine-mis-gibi-yaptik',
        type: 'bülten',
        publisher: 'Pareto Mobilite', // Bu bilgi burada kalabilir ama sayfada gösterilmeyecek
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
    const { slug } = useParams();
    const [bulletin, setBulletin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundBulletin = bulletins.find((b) => b.slug === slug);
        if (foundBulletin) {
            setBulletin(foundBulletin);
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

    if (!bulletin) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Bülten bulunamadı.</p>
            </div>
        );
    }

    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md"> {/* İçeriği bir kart içine aldık */}
                {/* Başlık */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-4 leading-tight">
                    {bulletin.title}
                </h1>

                {/* Tarih - Sola dayalı, gri ve sönük. mb-4 boşluk ekliyoruz */}
                <p className="text-gray-500 text-sm font-sans mb-8"> {/* mb-8 ile daha fazla boşluk */}
                    {bulletin.date}
                </p>

                {/* Görsel Alanı (Tarihten sonra, içerikten önce) */}
                {bulletin.image && (
                    <img
                        src={bulletin.image}
                        alt={bulletin.title}
                        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8" // mb-8 ile daha fazla boşluk
                    />
                )}

                {/* Özet ve Tam İçerik - Font büyüklükleri aynı (text-lg) */}
                {(bulletin.summary || bulletin.fullContent) && (
                    <div className="mb-8 text-gray-800 font-sans leading-relaxed">
                        {bulletin.summary && (
                            <p className="text-lg mb-4"> {/* text-lg olarak ayarlandı */}
                                {bulletin.summary}
                            </p>
                        )}
                        {bulletin.fullContent && (
                            <p className="text-lg whitespace-pre-line"> {/* text-lg olarak ayarlandı */}
                                {bulletin.fullContent}
                            </p>
                        )}
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