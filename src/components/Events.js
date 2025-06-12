// src/components/Events.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';

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
                const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(eventsData);
            } catch (err) {
                console.error("Etkinlikler çekilirken hata oluştu:", err);
                setError("Etkinlikler yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [db]);

    if (loading) return <div className="pt-16 flex justify-center items-center h-screen"><p className="text-xl text-nuper-blue">Yükleniyor...</p></div>;
    if (error) return <div className="pt-16 flex justify-center items-center h-screen"><p className="text-xl text-red-600">{error}</p></div>;

    return (
        <div className="pt-24 pb-12 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
                                            <img src={event.cardImage} alt={event.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"/>
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-nuper-blue transition-colors duration-300">{event.title}</h2>
                                        <div className="mb-4">
                                            <p className="text-gray-500 text-sm">{event.organizer}</p>
                                            <p className="text-gray-600 text-sm font-medium">{event.date}</p>
                                        </div>
                                        <p className="text-gray-700 text-base mb-4 flex-grow line-clamp-3">{event.description}</p>
                                        <div className="mt-auto flex justify-between items-center text-sm">
                                            <span className="text-nuper-blue font-semibold">Devamını Oku &rarr;</span>
                                            {event.location && (
                                                <div className="flex items-center gap-1 text-teal-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
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
