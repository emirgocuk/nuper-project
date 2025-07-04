// src/components/admin/AdminEventsList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, query, orderBy, updateDoc } from 'firebase/firestore'; // updateDoc eklendi
import { app } from '../../firebaseConfig';
import { withSwal } from 'react-sweetalert2';

const AdminEventsList = (props) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);
    const { swal } = props;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(eventsData);
            } catch (err) {
                setError("Etkinlikler yüklenirken bir hata oluştu.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [db]);
    
    // YENİ FONKSİYON: Öne Çıkan Durumunu Değiştirme
    const handleFeatureToggle = async (eventId, currentStatus) => {
        const eventRef = doc(db, "events", eventId);
        const newStatus = !currentStatus;
        try {
            await updateDoc(eventRef, {
                isFeatured: newStatus
            });
            // Lokal state'i güncelle
            setEvents(events.map(event => 
                event.id === eventId ? { ...event, isFeatured: newStatus } : event
            ));
        } catch (err) {
            swal.fire('Hata!', `Durum güncellenirken hata: ${err.message}`, 'error');
        }
    };

    const handleDelete = async (eventId, eventTitle) => {
        // ... (Bu fonksiyon aynı kalacak)
    };

    if (loading) {
        return <div className="text-center py-8">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }
    
    return (
        <div className="p-4">
            {/* ... (Başlık ve Yeni Ekle butonu aynı kalacak) */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-nuper-blue">Etkinlik Yönetimi</h2>
                <Link to="/admin/events/new" className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg">Yeni Etkinlik Ekle</Link>
            </div>
            {events.length === 0 ? (
                <p className="text-center text-gray-600 py-8">Henüz etkinlik eklenmemiş.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                {/* YENİ KOLON EKLENDİ */}
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Öne Çıkan</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlık</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tarih</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    {/* YENİ KOLON İÇERİĞİ */}
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <input 
                                            type="checkbox"
                                            className="h-5 w-5 text-nuper-blue rounded cursor-pointer focus:ring-nuper-blue"
                                            checked={!!event.isFeatured}
                                            onChange={() => handleFeatureToggle(event.id, event.isFeatured)}
                                        />
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{event.title}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{event.date}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <Link to={`/admin/events/edit/${event.slug}`} className="text-indigo-600 hover:text-indigo-900 mr-3">Düzenle</Link>
                                        <button onClick={() => handleDelete(event.id, event.title)} className="text-red-600 hover:text-red-900">Sil</button>
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

export default withSwal(AdminEventsList);