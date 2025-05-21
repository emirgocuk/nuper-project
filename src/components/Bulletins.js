// src/pages/Bulletins.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore'; // Firebase Firestore fonksiyonları
import { app } from '../firebaseConfig'; // Firebase uygulamanızın yapılandırması

const Bulletins = () => {
    const [bulletins, setBulletins] = useState([]); // Bültenlerin listesini tutar
    const [loading, setLoading] = useState(true); // Yüklenme durumunu tutar
    const [error, setError] = useState(null); // Hata durumunu tutar
    const db = getFirestore(app); // Firestore veritabanı örneğini başlatırız

    useEffect(() => {
        const fetchBulletins = async () => {
            try {
                console.log("Firebase'den bültenler çekiliyor...");
                // "bulletins" koleksiyonundaki belgeleri 'createdAt' alanına göre azalan sırada sorgularız.
                // Firestore'da 'createdAt' adında bir Timestamp alanı olmalı.
                const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q); // Sorguyu çalıştır ve sonuçları al

                const bulletinsData = querySnapshot.docs.map(doc => {
                    console.log("Çekilen bülten belge ID:", doc.id, "Veri:", doc.data());

                    // Firebase Timestamp'ini okunabilir bir tarih formatına dönüştür
                    const date = doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : 'Tarih Yok';

                    return {
                        id: doc.id, // Belge ID'si
                        ...doc.data(), // Belgenin tüm verileri
                        date: date, // Formatlanmış tarih
                        // Listeleme görünümünde 'summary' alanını kullanmak daha uygun olabilir.
                        // Eğer 'summary' yoksa 'fullContent' veya 'İçerik yok.' gösterir.
                        summary: doc.data().summary || doc.data().fullContent || 'İçerik yok.',
                        // Eğer 'authorName' alanı varsa onu kullan, yoksa 'Yazar Bilgisi Yok' göster
                        author: doc.data().authorName || 'Yazar Bilgisi Yok'
                    };
                });
                setBulletins(bulletinsData); // Bülten verilerini state'e kaydet
                console.log("Çekilen toplam bülten sayısı:", bulletinsData.length);
            } catch (err) {
                console.error("Bültenler çekilirken hata oluştu:", err);
                setError("Bültenler yüklenirken bir sorun oluştu."); // Hata durumunda mesaj ayarla
            } finally {
                setLoading(false); // Yükleme tamamlandı
                console.log("Bülten yüklemesi tamamlandı. Loading durumu:", false);
            }
        };

        fetchBulletins(); // Bültenleri çek fonksiyonunu çalıştır
    }, [db]); // 'db' değiştiğinde tekrar çalışır

    // Yüklenme durumunda gösterilecek UI
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Bültenler yükleniyor...</p>
            </div>
        );
    }

    // Hata durumunda gösterilecek UI
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    // Bülten listesi yüklendiyse gösterilecek UI
    return (
        <div className="pt-16 min-h-screen bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-heading font-bold text-center text-nuper-blue mb-10">Tüm Bültenler</h1>

                {bulletins.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">Henüz bülten bulunamadı.</p>
                ) : (
                    // Bültenleri tek sütunlu bir liste olarak gösterir
                    <div className="flex flex-col gap-8">
                        {bulletins.map((bulletin) => (
                            // Her bülten için detay sayfasına giden bir Link oluşturur
                            <Link to={`/bulletin/${bulletin.slug}`} key={bulletin.id} className="block w-full">
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row h-full">
                                    {bulletin.image && (
                                        <img
                                            src={bulletin.image}
                                            alt={bulletin.title}
                                            className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                                        />
                                    )}
                                    <div className="p-6 flex-grow flex flex-col justify-between md:w-2/3">
                                        <div>
                                            <h2 className="text-xl font-heading font-semibold text-nuper-dark-blue mb-2">
                                                {bulletin.title}
                                            </h2>
                                            {/* Tarih ve yazar bilgilerini gösterir */}
                                            <p className="text-gray-600 text-sm mb-4">
                                                {bulletin.date} - {bulletin.author}
                                            </p>
                                            {/* Bültenin özetini gösterir */}
                                            <p className="text-gray-700 text-base">
                                                {bulletin.summary}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <span className="text-nuper-blue hover:underline font-medium">
                                                Devamını Oku
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bulletins;