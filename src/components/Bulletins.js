// src/pages/Bulletin.js

import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { Link } from 'react-router-dom';

const Bulletin = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const db = getFirestore(app);

    useEffect(() => {
        const fetchBulletins = async () => {
            setLoading(true);
            setError(null);
            try {
                const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const bulletinsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    let summaryText = '';
                    if (data.content) {
                        // HTML'den etiketleri temizleyip kısaltma (basit bir DOMParser kullanımı)
                        // Bu yöntem tarayıcı ortamında çalışır ve daha güvenlidir.
                        const doc = new DOMParser().parseFromString(data.content, 'text/html');
                        summaryText = doc.body.textContent || '';
                        summaryText = summaryText.substring(0, 150) + (summaryText.length > 150 ? '...' : '');
                    }
                    return {
                        id: doc.id,
                        ...data,
                        summary: summaryText // Özeti buraya ekliyoruz
                    };
                });
                setBulletins(bulletinsList);
            } catch (err) {
                console.error("Bültenler çekilirken hata oluştu:", err);
                setError("Bültenler yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };
        fetchBulletins();
    }, [db]);

    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Bültenler Yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-heading font-bold text-nuper-blue mb-8 text-center">Tüm Bültenler</h1>
                {bulletins.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">Henüz hiç bülten bulunmuyor.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bulletins.map(bulletin => (
                            <Link to={`/bulletin/${bulletin.slug}`} key={bulletin.id}>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                    {bulletin.cardImage && (
                                        <img
                                            src={bulletin.cardImage}
                                            alt={bulletin.title}
                                            className="w-full h-48 object-cover object-center"
                                        />
                                    )}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                            {bulletin.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {bulletin.date || (bulletin.createdAt && new Date(bulletin.createdAt.toDate()).toLocaleDateString('tr-TR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })) || 'Tarih Bilgisi Yok'}
                                            {bulletin.publisher && ` - ${bulletin.publisher}`}
                                        </p>
                                        {bulletin.summary && ( // Önizlemeyi göster
                                            <p className="text-gray-700 text-base mb-4 flex-grow">
                                                {bulletin.summary}
                                            </p>
                                        )}
                                        <div className="text-right mt-auto">
                                            <span className="text-nuper-blue hover:underline font-semibold text-sm">
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

export default Bulletin;