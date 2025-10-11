"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true); setError(null);
            try {
                const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(eventsData);
            } catch (err) {
                console.error("Etkinlikler çekilirken hata oluştu:", err);
                setError("Etkinlikler yüklenirken bir sorun oluştu.");
            } finally { setLoading(false); }
        };
        fetchEvents();
    }, [db]);

    if (loading) return <div className="pt-24 text-center">Yükleniyor...</div>;
    if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;

    return (
        <div className="pt-24 pb-12 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold text-nuper-blue">Etkinlikler</h1>
                    <p className="mt-2 text-lg text-gray-600">En son etkinlikleri ve kaçırılmayacak fırsatları burada keşfedin.</p>
                </div>
                {events.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">Henüz etkinlik bulunamadı.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <Link to={`/event/${event.slug}`} key={event.id} className="block group">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                    {event.cardImage && (
                                        <div className="w-full h-48 bg-gray-200 overflow-hidden">
                                            <img src={event.cardImage} alt={event.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"/>
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-nuper-blue transition-colors duration-300">{event.title}</h2>
                                        <div className="mb-4">
                                            <p className="text-gray-500 text-sm">{event.organizer}</p>
                                            <p className="text-gray-600 text-sm font-medium">{event.date}</p>
                                        </div>
                                        {/* KISA AÇIKLAMAYI GÖSTER */}
                                        <p className="text-gray-700 text-base mb-4 flex-grow line-clamp-3">{event.description}</p>
                                        <div className="mt-auto flex justify-end items-center text-sm">
                                            <span className="text-nuper-blue font-semibold">Devamını Oku &rarr;</span>
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