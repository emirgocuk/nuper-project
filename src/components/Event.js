// src/pages/Events.js

import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { Link } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const db = getFirestore(app);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const eventsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    let summaryText = '';
                    if (data.content) {
                        // HTML'den etiketleri temizleyip kısaltma (basit bir regex)
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
                setEvents(eventsList);
            } catch (err) {
                console.error("Etkinlikler çekilirken hata oluştu:", err);
                setError("Etkinlikler yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [db]);

    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Etkinlikler Yükleniyor...</p>
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
                <h1 className="text-4xl font-heading font-bold text-nuper-blue mb-8 text-center">Tüm Etkinlikler</h1>
                {events.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">Henüz hiç etkinlik bulunmuyor.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <Link to={`/events/${event.slug}`} key={event.id}>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                    {event.cardImage && (
                                        <img
                                            src={event.cardImage}
                                            alt={event.title}
                                            className="w-full h-48 object-cover object-center"
                                        />
                                    )}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                            {event.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {event.date || (event.createdAt && new Date(event.createdAt.toDate()).toLocaleDateString('tr-TR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })) || 'Tarih Bilgisi Yok'}
                                            {event.publisher && ` - ${event.publisher}`}
                                        </p>
                                        {event.summary && ( // Önizlemeyi göster
                                            <p className="text-gray-700 text-base mb-4 flex-grow">
                                                {event.summary}
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

export default Events;