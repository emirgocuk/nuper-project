import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// useSweetAlert yerine withSwal import edildi
import { withSwal } from 'react-sweetalert2'; // GÜNCELLENEN İMPORT

const AdminBulletinsList = (props) => { // props parametresini ekledik
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const db = getFirestore(app);
    const auth = getAuth(app);
    // withSwal tarafından sağlanan swal prop'unu kullanıyoruz
    const swal = props.swal; // GÜNCELLENEN KULLANIM

    // Bültenleri Firebase'den çeken fonksiyon
    const fetchBulletins = async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const bulletinsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBulletins(bulletinsData);
        } catch (err) {
            console.error("Bültenler çekilirken hata oluştu:", err);
            setError("Bültenleri yüklerken bir hata oluştu: " + err.message);
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
                        await fetchBulletins(); // Admin ise bültenleri çek
                    } else {
                        setIsAdmin(false);
                        setLoading(false);
                        setError("Bu sayfaya erişim yetkiniz yok. Yönetici olarak giriş yapmalısınız.");
                        setBulletins([]); // Yetkisizse bültenleri boşalt
                    }
                } catch (err) {
                    console.error("Kullanıcı rolü çekilirken hata oluştu:", err);
                    setLoading(false);
                    setError("Kullanıcı yetkisi kontrol edilirken bir hata oluştu: " + err.message);
                    setBulletins([]);
                }
            } else {
                // Kullanıcı giriş yapmamışsa
                setIsAdmin(false);
                setLoading(false);
                setError("Bültenleri yönetmek için lütfen giriş yapın.");
                setBulletins([]);
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, [db, auth]); // Bağımlılıklar: db ve auth değiştiğinde tekrar çalıştır

    // Bülten silme fonksiyonu - SWEETALERT2 ile güncellendi
    const handleDelete = async (bulletinId, bulletinTitle) => {
        // Admin değilse silme işlemine izin verme
        if (!isAdmin) {
            alert("Silme işlemi için yönetici yetkisine sahip olmalısınız.");
            return;
        }

        try {
            // SweetAlert2 onay kutusunu göster
            const result = await swal.fire({ // 'fire' yerine 'swal.fire' kullandık
                title: 'Emin misiniz?',
                text: `'${bulletinTitle}' bültenini silmek istediğinizden emin misiniz?`,
                icon: 'warning', // Uyarı ikonu
                showCancelButton: true, // İptal butonu göster
                confirmButtonColor: '#d33', // Onay butonu rengi (kırmızı)
                cancelButtonColor: '#3085d6', // İptal butonu rengi (mavi)
                confirmButtonText: 'Evet, sil!', // Onay butonu metni
                cancelButtonText: 'İptal' // İptal butonu metni
            });

            // Kullanıcı onayladıysa (Evet, sil! butonuna bastıysa)
            if (result.isConfirmed) {
                await deleteDoc(doc(db, "bulletins", bulletinId)); // Firestore'dan sil
                // Silinen bülteni listeden çıkararak UI'ı güncelle
                setBulletins(bulletins.filter(bulletin => bulletin.id !== bulletinId));
                swal.fire('Silindi!', 'Bülten başarıyla silindi.', 'success'); // Başarı mesajı için SweetAlert2 kullandık
            }
        } catch (err) {
            console.error("Bülten silinirken hata oluştu:", err);
            // Firebase izin hatası kontrolü
            if (err.code === 'permission-denied') {
                setError("Silme işlemi için yetkiniz yok. Lütfen yönetici olarak oturum açtığınızdan emin olun.");
                swal.fire('Hata!', 'Silme işlemi için yetkiniz yok.', 'error'); // Hata mesajı için SweetAlert2 kullandık
            } else {
                setError('Bülten silinirken bir hata oluştu: ' + err.message);
                swal.fire('Hata!', 'Bülten silinirken bir hata oluştu.', 'error'); // Hata mesajı için SweetAlert2 kullandık
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8">Bültenler yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-nuper-blue mb-6">Bülten Yönetimi</h2>
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700">Toplam {bulletins.length} bülten bulundu.</p>
                {isAdmin && (
                    <Link
                        to="/admin/bulletins/new"
                        className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Yeni Bülten Ekle
                    </Link>
                )}
                {!isAdmin && (
                    <p className="text-sm text-gray-500">Yeni bülten eklemek için yönetici yetkisine sahip olmalısınız.</p>
                )}
            </div>
            {bulletins.length === 0 && !loading && !error ? (
                <p className="text-center text-gray-600 py-8">Henüz hiç bülten eklenmemiş.</p>
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
                                    Yayınlayan
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bulletins.map((bulletin) => (
                                <tr key={bulletin.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{bulletin.title}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{bulletin.date}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{bulletin.publisher}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {isAdmin ? (
                                            <>
                                                <Link
                                                    to={`/admin/bulletins/edit/${bulletin.slug}`}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Düzenle
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(bulletin.id, bulletin.title)}
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
export default withSwal(AdminBulletinsList);