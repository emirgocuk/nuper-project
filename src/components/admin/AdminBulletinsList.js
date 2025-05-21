// src/components/admin/AdminBulletinsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // firebaseConfig dosyanızın yolunu kontrol edin
import { confirm } from 'react-confirm-box'; // Onay kutusu için import

const AdminBulletinsList = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    const fetchBulletins = async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, "bulletins"), orderBy("createdAt", "desc")); // createdAt alanına göre azalan sırala
            const querySnapshot = await getDocs(q);
            const bulletinsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBulletins(bulletinsData);
        } catch (err) {
            console.error("Bültenler çekilirken hata oluştu:", err);
            setError("Bültenler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBulletins();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = async (bulletinId, bulletinTitle) => {
        const options = {
            labels: {
                confirmable: 'Evet',
                cancellable: 'İptal'
            }
        }
        const result = await confirm(`'${bulletinTitle}' bültenini silmek istediğinizden emin misiniz?`, options);
        if (result) {
            try {
                await deleteDoc(doc(db, "bulletins", bulletinId));
                setBulletins(bulletins.filter(bulletin => bulletin.id !== bulletinId));
                alert('Bülten başarıyla silindi!');
            } catch (err) {
                console.error("Bülten silinirken hata oluştu:", err);
                alert('Bülten silinirken bir hata oluştu.');
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
                <Link
                    to="/admin/bulletins/new"
                    className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Yeni Bülten Ekle
                </Link>
            </div>
            {bulletins.length === 0 ? (
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

export default AdminBulletinsList;