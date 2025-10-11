// src/components/admin/AdminEventsList.js
// Bu dosya, Etkinlikler CRUD listesini gösterir.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, query, orderBy, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { app } from '../../firebaseConfig'; // Doğru Firebase yolu
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
                // Sadece events koleksiyonundaki verileri çekiyor.
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
    
    // Öne Çıkan Durumunu Değiştirme (Monetization Phase'den kalan)
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
        const result = await swal.fire({
            title: 'Emin misiniz?',
            text: `'${eventTitle}' etkinliğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal'
        });

        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "events", eventId));
                setEvents(events.filter(event => event.id !== eventId));
                swal.fire('Silindi!', 'Etkinlik başarıyla silindi.', 'success');
            } catch (err) {
                swal.fire('Hata!', `Etkinlik silinirken hata: ${err.message}`, 'error');
            }
        }
    };

    if (loading) {
        return <div className="py-8 text-center">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="py-8 text-center text-red-600">{error}</div>;
    }
    
    return (
        <div className="p-4">
            {/* DOĞRU BAŞLIK */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-nuper-blue">Etkinlik Yönetimi</h2>
                <Link to="/admin/events/new" className="px-4 py-2 font-bold text-white rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue">Yeni Etkinlik Ekle</Link>
            </div>
            
            {events.length === 0 ? (
                <p className="py-8 text-center text-gray-600">Henüz etkinlik eklenmemiş.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Öne Çıkan</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Başlık</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Tarih</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                        <input 
                                            type="checkbox"
                                            className="w-5 h-5 rounded cursor-pointer text-nuper-blue focus:ring-nuper-blue"
                                            checked={!!event.isFeatured}
                                            onChange={() => handleFeatureToggle(event.id, event.isFeatured)}
                                        />
                                    </td>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200"><p className="text-gray-900 whitespace-no-wrap">{event.title}</p></td>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200"><p className="text-gray-900 whitespace-no-wrap">{event.date}</p></td>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                        <Link to={`/admin/events/edit/${event.slug}`} className="mr-3 text-indigo-600 hover:text-indigo-900">Düzenle</Link>
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