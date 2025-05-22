// src/pages/BulletinDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'; // Gerekli importlar güncellendi
import { app } from '../firebaseConfig'; // Firebase uygulamanızın yapılandırması

const BulletinDetail = () => {
    const { slug } = useParams(); // URL'den bültenin 'slug' değerini alırız
    const [bulletin, setBulletin] = useState(null); // Bülten verisini tutar
    const [loading, setLoading] = useState(true); // Yüklenme durumunu tutar
    const [error, setError] = useState(null); // Hata durumunu tutar

    const db = getFirestore(app); // Firestore veritabanı örneğini başlatırız

    useEffect(() => {
        const fetchBulletin = async () => {
            setLoading(true); // Yükleme her fetch çağrıldığında başlasın
            setError(null);   // Hata durumunu temizle
            try {
                console.log(`BulletinDetail: Fetching bulletin with slug: "${slug}"`); // Debug için

                // Firestore'dan belirli bir bülteni çekmek için sorgu kullanırız.
                // 'slug' alanı URL'den gelen 'slug' değerine eşit olan belgeyi ararız.
                const q = query(collection(db, "bulletins"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q); // Sorguyu çalıştır ve sonuçları al

                if (!querySnapshot.empty) { // Belge varsa
                    const docSnap = querySnapshot.docs[0]; // İlk belgeyi al
                    console.log("BulletinDetail: Bulletin found:", docSnap.data()); // Debug için
                    setBulletin({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log(`BulletinDetail: No bulletin found with slug: "${slug}"`); // Debug için
                    setError("Bülten bulunamadı."); // Belge yoksa hata mesajı
                }
            } catch (err) {
                console.error("BulletinDetail: Bülten çekilirken hata oluştu:", err);
                setError("Bülten yüklenirken bir sorun oluştu."); // Hata oluşursa genel hata mesajı
            } finally {
                setLoading(false); // Yükleme tamamlandı
                console.log("BulletinDetail: Loading finished."); // Debug için
            }
        };

        if (slug) { // Slug değeri varsa çekmeye çalış
            fetchBulletin();
        } else {
            setLoading(false);
            setError("Geçersiz bülten URL'si.");
        }
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

    // KRİTİK KONTROL: bulletin null ise, aşağıdaki render kısmına geçmemeliyiz
    if (!bulletin) {
        // Bu durum, yükleme bittiğinde ve hata yokken bile bülten bulunamazsa oluşur.
        // Genellikle yukarıdaki `setError` ile yakalanır, ancak yine de bir fallback iyidir.
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Bülten detayı görüntülenemiyor.</p>
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

                {/* Tarih ve Yayınlayan */}
                <p className="text-gray-500 text-sm font-sans mb-8">
                    {/* `date` alanı formdan elle giriliyor. `createdAt` ise Firestore Timestamp.
                        Her ikisi de yoksa 'Tarih Bilgisi Yok' gösteririz. */}
                    {bulletin.date || (bulletin.createdAt && new Date(bulletin.createdAt.toDate()).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })) || 'Tarih Bilgisi Yok'}
                    {bulletin.publisher && ` - ${bulletin.publisher}`}
                </p>

                {/* Görsel Alanı */}
                {bulletin.image && (
                    <img
                        src={bulletin.image}
                        alt={bulletin.title}
                        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
                    />
                )}

                {/* İçerik */}
                {bulletin.content && ( // content alanını kullanıyoruz
                    <div className="mb-8 text-gray-800 font-sans leading-relaxed">
                        <p className="text-lg whitespace-pre-line">
                            {bulletin.content}
                        </p>
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