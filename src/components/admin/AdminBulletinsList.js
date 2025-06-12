import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { withSwal } from 'react-sweetalert2';

const AdminBulletinsList = (props) => {
    const [bulletins, setBulletins] = useState([]);
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
                        const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc"));
                        const querySnapshot = await getDocs(q);
                        const bulletinsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setBulletins(bulletinsData);
                    } else {
                        setError("Bu sayfayı görüntüleme yetkiniz yok.");
                    }
                } catch (err) {
                    setError("Yetki kontrolü sırasında bir hata oluştu.");
                    console.error(err);
                }
            } else {
                setError("Lütfen giriş yapın.");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    const handleDelete = async (bulletinId, bulletinTitle) => {
        const result = await swal.fire({
            title: 'Emin misiniz?',
            text: `'${bulletinTitle}' bültenini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal'
        });

        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "bulletins", bulletinId));
                setBulletins(bulletins.filter(bulletin => bulletin.id !== bulletinId));
                swal.fire('Silindi!', 'Bülten başarıyla silindi.', 'success');
            } catch (err) {
                swal.fire('Hata!', `Bülten silinirken hata: ${err.message}`, 'error');
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-nuper-blue">Bülten Yönetimi</h2>
                <Link to="/admin/bulletins/new" className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg">Yeni Bülten Ekle</Link>
            </div>
            {bulletins.length === 0 ? (
                <p className="text-center text-gray-600 py-8">Henüz hiç bülten eklenmemiş.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlık</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tarih</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Yayınlayan</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bulletins.map((bulletin) => (
                                <tr key={bulletin.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{bulletin.title}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{bulletin.date}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{bulletin.publisher}</p></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <Link to={`/admin/bulletins/edit/${bulletin.slug}`} className="text-indigo-600 hover:text-indigo-900 mr-3">Düzenle</Link>
                                        <button onClick={() => handleDelete(bulletin.id, bulletin.title)} className="text-red-600 hover:text-red-900">Sil</button>
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

export default withSwal(AdminBulletinsList);
