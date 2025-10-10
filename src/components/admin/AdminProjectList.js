import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, collectionGroup, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { withSwal } from 'react-sweetalert2';

// Proje durumlarını ve stillerini haritalama
const statusMap = {
    'pending_review': { text: 'İnceleme Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
    'in_progress': { text: 'Değerlendirmede', color: 'bg-blue-100 text-blue-800' },
    'approved': { text: 'Onaylandı', color: 'bg-green-100 text-green-800' },
    'rejected': { text: 'Reddedildi', color: 'bg-red-100 text-red-800' },
};

const AdminProjectList = (props) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);
    const { swal } = props;

    // Tüm kullanıcıların projelerini çeken fonksiyon
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // collectionGroup: Tüm kullanıcıların altındaki 'projects' koleksiyonlarına erişir.
            // NOT: Bunun çalışması için Firebase Console'da 'projects' için Koleksiyon Grubu Dizini oluşturulmalıdır.
            const projectsQuery = query(collectionGroup(db, 'projects'), orderBy('submittedAt', 'desc'));
            const snapshot = await getDocs(projectsQuery);
            
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                userId: doc.ref.parent.parent.id, // Projenin ait olduğu kullanıcı UID'si
                submittedDate: doc.data().submittedAt?.toDate().toLocaleDateString('tr-TR') || 'Tarih Yok',
            }));
            
            setProjects(projectsData);
        } catch (err) {
            console.error("Projeler çekilirken hata oluştu:", err);
            setError(`Projeler yüklenirken hata oluştu. Firebase Dizinini kontrol edin. Hata: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [db]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Proje durumunu güncelleme işlevi
    const handleStatusChange = async (project) => {
        const { value: newStatus } = await swal.fire({
            title: 'Proje Durumu Değiştir',
            input: 'select',
            inputOptions: {
                pending_review: 'İnceleme Bekliyor',
                in_progress: 'Değerlendirmede',
                approved: 'Onaylandı',
                rejected: 'Reddedildi'
            },
            inputValue: project.status,
            showCancelButton: true,
            confirmButtonText: 'Kaydet',
        });

        if (newStatus && newStatus !== project.status) {
            // Proje belgesinin tam yolu: users/{userId}/projects/{projectId}
            const projectRef = doc(db, 'users', project.userId, 'projects', project.id);

            try {
                await updateDoc(projectRef, {
                    status: newStatus,
                    statusUpdated: new Date()
                });
                
                // Lokal state'i güncelle
                setProjects(projects.map(p => 
                    p.id === project.id ? { ...p, status: newStatus } : p
                ));
                
                swal.fire('Başarılı', 'Proje durumu güncellendi.', 'success');
            } catch (err) {
                swal.fire('Hata', `Durum güncellenirken bir sorun oluştu: ${err.message}`, 'error');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="py-8 text-center">Tüm Projeler Yükleniyor...</div>;
    }

    if (error) {
        return <div className="py-8 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="mb-6 text-2xl font-bold text-nuper-blue">Proje İnceleme Yönetimi ({projects.length})</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Proje Adı</th>
                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Kullanıcı (UID)</th>
                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Gönderim Tarihi</th>
                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Durum</th>
                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                    <p className="font-semibold text-gray-900 whitespace-no-wrap">{project.projectName}</p>
                                    <p className="max-w-xs mt-1 text-xs text-gray-500 truncate">{project.projectSummary}</p>
                                </td>
                                <td className="px-5 py-5 text-xs bg-white border-b border-gray-200">
                                    <span className="font-mono text-gray-600">{project.userId}</span>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                    <p className="text-gray-900 whitespace-no-wrap">{project.submittedDate}</p>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[project.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                        {statusMap[project.status]?.text || project.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                    <button 
                                        onClick={() => handleStatusChange(project)}
                                        className="mr-3 font-semibold transition-colors text-nuper-blue hover:text-nuper-dark-blue"
                                    >
                                        Durumu Değiştir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default withSwal(AdminProjectList);