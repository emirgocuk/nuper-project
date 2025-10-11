"use client";

// src/components/Bulletins.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const Bulletins = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchBulletins = async () => {
            setLoading(true); setError(null);
            try {
                const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const bulletinsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBulletins(bulletinsData);
            } catch (err) {
                console.error("Bültenler çekilirken hata oluştu:", err);
                setError("Bültenler yüklenirken bir sorun oluştu.");
            } finally { setLoading(false); }
        };
        fetchBulletins();
    }, [db]);

    if (loading) return <div className="pt-24 text-center">Yükleniyor...</div>;
    if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-100">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold font-heading text-nuper-blue">Bültenler</h1>
                    <p className="mt-2 text-lg text-gray-600">Sektörlerden haberler, kariyer ipuçları ve ilham verici içerikler.</p>
                </div>
                {bulletins.length === 0 ? (
                    <p className="text-lg text-center text-gray-600">Henüz bülten bulunmuyor.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {bulletins.map((bulletin) => (
                            <Link to={`/bulletin/${bulletin.slug}`} key={bulletin.id} className="block group">
                                <div className="flex flex-col h-full overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                                    {bulletin.cardImage && (
                                        <div className="w-full h-48 overflow-hidden bg-gray-200">
                                            <img src={bulletin.cardImage} alt={bulletin.title} className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                    )}
                                    <div className="flex flex-col flex-grow p-6">
                                        <h2 className="mb-2 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-nuper-blue">{bulletin.title}</h2>
                                        <p className="mb-4 text-sm text-gray-500">
                                            {bulletin.date} {bulletin.publisher && `- ${bulletin.publisher}`}
                                        </p>
                                        {/* KISA AÇIKLAMAYI GÖSTER */}
                                        <p className="flex-grow mb-4 text-base text-gray-700 line-clamp-3">{bulletin.description}</p>
                                        <div className="mt-auto text-right">
                                            <span className="text-sm font-semibold text-nuper-blue">Devamını Oku &rarr;</span>
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