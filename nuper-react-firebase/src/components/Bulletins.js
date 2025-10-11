// src/components/Bulletins.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="pt-24 pb-12 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold text-nuper-blue">Bültenler</h1>
                    <p className="mt-2 text-lg text-gray-600">Sektörlerden haberler, kariyer ipuçları ve ilham verici içerikler.</p>
                </div>
                {bulletins.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">Henüz bülten bulunmuyor.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bulletins.map((bulletin) => (
                            <Link to={`/bulletin/${bulletin.slug}`} key={bulletin.id} className="block group">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                    {bulletin.cardImage && (
                                        <div className="w-full h-48 bg-gray-200 overflow-hidden">
                                            <img src={bulletin.cardImage} alt={bulletin.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-nuper-blue transition-colors duration-300">{bulletin.title}</h2>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {bulletin.date} {bulletin.publisher && `- ${bulletin.publisher}`}
                                        </p>
                                        {/* KISA AÇIKLAMAYI GÖSTER */}
                                        <p className="text-gray-700 text-base mb-4 flex-grow line-clamp-3">{bulletin.description}</p>
                                        <div className="text-right mt-auto">
                                            <span className="text-nuper-blue font-semibold text-sm">Devamını Oku &rarr;</span>
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