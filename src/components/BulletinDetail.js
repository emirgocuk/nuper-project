import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Firebase Firestore fonksiyonları
import { app } from '../firebaseConfig'; // Firebase uygulamanızın yapılandırması

const BulletinDetail = () => {
    const { slug } = useParams(); // URL'den bültenin 'slug' değerini alırız
    const [bulletin, setBulletin] = useState(null); // Bülten verisini tutar
    const [loading, setLoading] = useState(true); // Yüklenme durumunu tutar
    const [error, setError] = useState(null); // Hata durumunu tutar

    const db = getFirestore(app); // Firestore veritabanı örneğini başlatırız

    useEffect(() => {
        const fetchBulletin = async () => {
            try {
                // Firestore'dan belirli bir bülteni çekmek için kullanılır.
                // Burada 'slug' değerinin aynı zamanda Firestore belge ID'si olduğunu varsayıyoruz.
                // Eğer 'slug' belge ID'si değil de belgenin içindeki bir alan ise,
                // bunun yerine bir sorgu (query) kullanmanız gerekirdi.
                const bulletinRef = doc(db, "bulletins", slug);
                const docSnap = await getDoc(bulletinRef); // Belgeyi getir

                if (docSnap.exists()) { // Belge varsa
                    setBulletin({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Bülten bulunamadı."); // Belge yoksa hata mesajı
                }
            } catch (err) {
                console.error("Bülten çekilirken hata oluştu:", err);
                setError("Bülten yüklenirken bir sorun oluştu."); // Hata oluşursa genel hata mesajı
            } finally {
                setLoading(false); // Yükleme tamamlandı
            }
        };

        fetchBulletin(); // Bülteni getir fonksiyonunu çalıştır
    }, [slug, db]); // 'slug' veya 'db' değiştiğinde tekrar çalışır

    // Yüklenme durumunda gösterilecek UI
    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Yükleniyor...</p>
            </div>
        );
    }

    // Hata durumunda gösterilecek UI
    if (error) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    // Bülten bulunamadıysa (ancak 'error' durumu yoksa) gösterilecek UI
    if (!bulletin) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Bülten bulunamadı.</p>
            </div>
        );
    }

    // Bülten verisi yüklendiyse gösterilecek UI
    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
                {/* Başlık */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-4 leading-tight">
                    {bulletin.title}
                </h1>

                {/* Tarih */}
                <p className="text-gray-500 text-sm font-sans mb-8">
                    {/* Eğer Firebase'den gelen tarih bir Timestamp ise, okunabilir bir formata dönüştürün */}
                    {bulletin.date || (bulletin.createdAt && new Date(bulletin.createdAt.toDate()).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })) || 'Tarih Bilgisi Yok'}
                </p>

                {/* Görsel Alanı */}
                {bulletin.image && (
                    <img
                        src={bulletin.image}
                        alt={bulletin.title}
                        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
                    />
                )}

                {/* Özet ve Tam İçerik */}
                {(bulletin.summary || bulletin.fullContent) && (
                    <div className="mb-8 text-gray-800 font-sans leading-relaxed">
                        {bulletin.summary && (
                            <p className="text-lg mb-4">
                                {bulletin.summary}
                            </p>
                        )}
                        {bulletin.fullContent && (
                            // 'whitespace-pre-line' ile içeriğin içindeki satır sonlarını koruruz
                            <p className="text-lg whitespace-pre-line">
                                {bulletin.fullContent}
                            </p>
                        )}
                    </div>
                )}

                {/* Tüm Bültenlere Geri Dön Linki */}
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