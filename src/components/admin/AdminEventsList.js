import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// useSweetAlert yerine withSwal import edildi
import { withSwal } from 'react-sweetalert2'; // GÜNCELLENEN İMPORT

const AdminEventsList = (props) => { // props parametresini ekledik
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const db = getFirestore(app);
    const auth = getAuth(app);
    // withSwal tarafından sağlanan swal prop'unu kullanıyoruz
    const swal = props.swal; // GÜNCELLENEN KULLANIM

    // Etkinlikleri Firebase'den çeken fonksiyon
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const eventsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
        } catch (err) {
            console.error("Etkinlikler çekilirken hata oluştu:", err);
            setError("Etkinlikleri yüklerken bir hata oluştu: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Kullanıcı oturum durumunu ve admin yetkisini kontrol eden useEffect
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                        setIsAdmin(true);
                        await fetchEvents(); // Admin ise etkinlikleri çek
                    } else {
                        setIsAdmin(false);
                        setLoading(false);
                        setError("Bu sayfaya erişim yetkiniz yok. Yönetici olarak giriş yapmalısınız.");
                        setEvents([]); // Yetkisizse etkinlikleri boşalt
                    }
                } catch (err) {
                    console.error("Kullanıcı rolü çekilirken hata oluştu:", err);
                    setLoading(false);
                    setError("Kullanıcı yetkisi kontrol edilirken bir hata oluştu: " + err.message);
                    setEvents([]);
                }
            } else {
                // Kullanıcı giriş yapmamışsa
                setIsAdmin(false);
                setLoading(false);
                setError("Etkinlikleri yönetmek için lütfen giriş yapın.");
                setEvents([]);
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, [db, auth]); // Bağımlılıklar: db ve auth değiştiğinde tekrar çalıştır

    // Etkinlik silme fonksiyonu - SWEETALERT2 ile güncellendi
    const handleDelete = async (eventId, eventTitle) => {
        // Admin değilse silme işlemine izin verme
        if (!isAdmin) {
            alert("Silme işlemi için yönetici yetkisine sahip olmalısınız.");
            return;
        }

        try {
            // SweetAlert2 onay kutusunu göster
            const result = await swal.fire({ // 'fire' yerine 'swal.fire' kullandık
                title: 'Emin misiniz?',
                text: `'${eventTitle}' etkinliğini silmek istediğinizden emin misiniz?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Evet, sil!',
                cancelButtonText: 'İptal'
            });

            // Kullanıcı onayladıysa (Evet, sil! butonuna bastıysa)
            if (result.isConfirmed) {
                await deleteDoc(doc(db, "events", eventId)); // Firestore'dan sil
                // Silinen etkinliği listeden çıkararak UI'ı güncelle
                setEvents(events.filter(event => event.id !== eventId));
                swal.fire('Silindi!', 'Etkinlik başarıyla silindi.', 'success'); // Başarı mesajı için SweetAlert2 kullandık
            }
        } catch (err) {
            console.error("Etkinlik silinirken hata oluştu:", err);
            // Firebase izin hatası kontrolü
            if (err.code === 'permission-denied') {
                setError("Silme işlemi için yetkiniz yok. Lütfen yönetici olarak oturum açtığınızdan emin olun.");
                swal.fire('Hata!', 'Silme işlemi için yetkiniz yok.', 'error'); // Hata mesajı için SweetAlert2 kullandık
            } else {
                setError('Etkinlik silinirken bir hata oluştu: ' + err.message);
                swal.fire('Hata!', 'Etkinlik silinirken bir hata oluştu.', 'error'); // Hata mesajı için SweetAlert2 kullandık
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
                {isAdmin && (
                    <Link
                        to="/admin/events/new"
                        className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Yeni Etkinlik Ekle
                    </Link>
                )}
                {!isAdmin && (
                    <p className="text-sm text-gray-500">Yeni etkinlik eklemek için yönetici yetkisine sahip olmalısınız.</p>
                )}
            </div>
            {events.length === 0 && !loading && !error ? (
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
                                        {isAdmin ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <span className="text-gray-400">Yetkisiz</span>
                                        )}
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

// Component'i withSwal HOC ile sarmalıyoruz
export default withSwal(AdminEventsList);