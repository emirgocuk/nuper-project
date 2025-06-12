import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { withSwal } from 'react-sweetalert2';

const AdminEventsList = (props) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const { swal } = props;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
                        const querySnapshot = await getDocs(q);
                        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setEvents(eventsData);
                    } else {
                        setError("Bu sayfayı görüntüleme yetkiniz yok.");
                    }
                } catch (err) {
                    setError("Yetki kontrolü sırasında bir hata oluştu.");
                    console.error(err);
                }
            } else {
                // AdminPanel zaten yönlendirme yapacağı için bu kısım genellikle çalışmaz
                setError("Lütfen giriş yapın.");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

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
        return <div className="text-center py-8">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }
    
    return (
        <div className="p-4">
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
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlık</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tarih</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Organizatör</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{event.title}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{event.date}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{event.organizer}</p></td>
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
