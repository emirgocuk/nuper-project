// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const Events = () => { // Bileşen adını Events olarak değiştirdik
    const [events, setEvents] = useState([]); // State adını events olarak değiştirdik
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchEvents = async () => { // Fonksiyon adını fetchEvents olarak değiştirdik
            try {
                console.log("Firebase'den etkinlikler çekiliyor...");
                // KOLEKSİYON ADINI 'events' OLARAK DEĞİŞTİRDİK
                const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const eventsData = querySnapshot.docs.map(doc => { // Değişken adını eventsData olarak değiştirdik
                    console.log("Çekilen etkinlik belge ID:", doc.id, "Veri:", doc.data());

                    const date = doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : 'Tarih Yok';

                    return {
                        id: doc.id,
                        ...doc.data(),
                        date: date,
                        summary: doc.data().summary || doc.data().fullContent || 'İçerik yok.',
                        author: doc.data().authorName || 'Yazar Bilgisi Yok'
                    };
                });
                setEvents(eventsData); // State'i setEvents ile güncelledik
                console.log("Çekilen toplam etkinlik sayısı:", eventsData.length);
            } catch (err) {
                console.error("Etkinlikler çekilirken hata oluştu:", err);
                setError("Etkinlikler yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
                console.log("Etkinlik yüklemesi tamamlandı. Loading durumu:", false);
            }
        };

        fetchEvents();
    }, [db]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Etkinlikler yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-heading font-bold text-center text-nuper-blue mb-10">Tüm Etkinlikler</h1>

                {events.length === 0 ? ( // events state'ini kontrol ettik
                    <p className="text-center text-lg text-gray-600">Henüz etkinlik bulunamadı.</p>
                ) : (
                    <div className="flex flex-col gap-8">
                        {events.map((event) => ( // map içinde event olarak kullandık
                            // Linkin 'to' özelliğini '/event/:slug' olarak güncelledik
                            <Link to={`/event/${event.slug}`} key={event.id} className="block w-full">
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row h-full">
                                    {event.image && (
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                                        />
                                    )}
                                    <div className="p-6 flex-grow flex flex-col justify-between md:w-2/3">
                                        <div>
                                            <h2 className="text-xl font-heading font-semibold text-nuper-dark-blue mb-2">
                                                {event.title}
                                            </h2>
                                            <p className="text-gray-600 text-sm mb-4">
                                                {event.date} - {event.author}
                                            </p>
                                            <p className="text-gray-700 text-base">
                                                {event.summary}
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

export default Events; // Export adını Events olarak değiştirdik