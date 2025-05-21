// src/components/admin/AdminEventsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // firebaseConfig dosyanızın yolunu kontrol edin
import { confirm } from 'react-confirm-box'; // Onay kutusu için import

const AdminEventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, "events"), orderBy("createdAt", "desc")); // createdAt alanına göre azalan sırala
            const querySnapshot = await getDocs(q);
            const eventsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
        } catch (err) {
            console.error("Etkinlikler çekilirken hata oluştu:", err);
            setError("Etkinlikler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = async (eventId, eventTitle) => {
        const options = {
            labels: {
                confirmable: 'Evet',
                cancellable: 'İptal'
            }
        }
        const result = await confirm(`'${eventTitle}' etkinliğini silmek istediğinizden emin misiniz?`, options);
        if (result) {
            try {
                await deleteDoc(doc(db, "events", eventId));
                setEvents(events.filter(event => event.id !== eventId));
                alert('Etkinlik başarıyla silindi!');
            } catch (err) {
                console.error("Etkinlik silinirken hata oluştu:", err);
                alert('Etkinlik silinirken bir hata oluştu.');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8">Etkinlikler yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-nuper-blue mb-6">Etkinlik Yönetimi</h2>
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700">Toplam {events.length} etkinlik bulundu.</p>
                <Link
                    to="/admin/events/new"
                    className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Yeni Etkinlik Ekle
                </Link>
            </div>
            {events.length === 0 ? (
                <p className="text-center text-gray-600 py-8">Henüz hiç etkinlik eklenmemiş.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Başlık
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Tarih
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Organizatör
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{event.title}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{event.date}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{event.organizer}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <Link
                                            to={`/admin/events/edit/${event.slug}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Düzenle
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event.id, event.title)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminEventsList;