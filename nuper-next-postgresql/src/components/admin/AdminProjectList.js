import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collectionGroup, query, getDocs, orderBy, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const AdminProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchAllProjects = async () => {
            setLoading(true);
            try {
                // Collection Group Query: Tüm kullanıcıların projelerini tek bir yerde listelemek için kullanılır.
                const q = query(collectionGroup(db, "projects"), orderBy("submittedAt", "desc"));
                const querySnapshot = await getDocs(q);
                
                const projectsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const userId = doc.ref.parent.parent.id; 
                    return {
                        id: doc.id,
                        userId: userId,
                        ...data,
                        status: data.status || 'submitted',
                        isRevised: data.lastRevisionDate ? true : false, // Revize edildi mi?
                    };
                });
                setProjects(projectsData);
            } catch (err) {
                setError("Projeler yüklenirken bir hata oluştu. Collection Group Index'i kontrol edin.");
                console.error("Proje Listesi Çekme Hatası:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db]);

    const getStatusText = (status, isRevised) => {
        switch (status) {
            case 'approved': return <span className="font-semibold text-green-600">Onaylandı</span>;
            case 'rejected': return <span className="font-semibold text-red-600">Reddedildi</span>;
            case 'revision_requested': return <span className="font-semibold text-orange-500">Revizyon İsteniyor</span>;
            case 'published': return <span className="font-semibold text-teal-600">YAYINLANDI</span>;
            case 'under_review': return <span className="font-semibold text-indigo-600">İnceleniyor</span>;
            case 'queued': return <span className="font-semibold text-nuper-blue">Sıraya Alındı</span>;
            case 'submitted':
                if (isRevised) {
                    return <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-md text-xs font-bold">Revize Edildi / Hazır</span>;
                }
                return <span className="text-gray-500">Yeni Gönderi</span>;
            default: return <span className="text-gray-500">Beklemede</span>;
        }
    };

    if (loading) return <div className="py-8 text-center">Tüm Projeler Yükleniyor...</div>;
    if (error) return <div className="py-8 text-center text-red-600">{error}</div>;

    return (
        <div className="p-4">
            <h2 className="mb-6 text-2xl font-bold text-nuper-blue">Proje İnceleme Merkezi</h2>
            {projects.length === 0 ? (
                <p className="py-8 text-center text-gray-600">Henüz incelenmeyi bekleyen proje yok.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Proje Adı</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Gönderen UID</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Durum</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className={project.status === 'revision_requested' ? 'bg-orange-50/50' : 'hover:bg-gray-50'}>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200"><p className="text-gray-900 whitespace-no-wrap">{project.projectName}</p></td>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200"><p className="max-w-xs text-gray-500 truncate whitespace-no-wrap">{project.userId}</p></td>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{getStatusText(project.status, project.isRevised)}</td>
                                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                        <Link to={`/admin/projects/${project.userId}/review/${project.id}`} className="font-semibold text-nuper-blue hover:text-nuper-dark-blue">İncele/Güncelle</Link>
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

export default AdminProjectList;