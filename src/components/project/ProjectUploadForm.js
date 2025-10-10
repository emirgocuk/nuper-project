import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const ProjectUploadForm = () => {
    // URL'den projectId'yi alıyoruz. Eğer varsa, düzenleme modundayız.
    const { projectId } = useParams();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

    const [formData, setFormData] = useState({
        projectName: '',
        projectSummary: '',
        // techStack ve fileLink kaldırıldı
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalStatus, setOriginalStatus] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (projectId) {
            setIsEditMode(true);
            setLoading(true);
            const fetchProject = async () => {
                try {
                    const docRef = doc(db, "users", user.uid, "projects", projectId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Sadece revizyon istendiğinde düzenlemeye izin verilir.
                        if (data.status !== 'revision_requested') {
                             setError('Bu projeyi şu anda düzenleyemezsiniz.');
                             setLoading(false);
                             return;
                        }

                        setFormData({
                            projectName: data.projectName || '',
                            projectSummary: data.projectSummary || '',
                            // techStack ve fileLink kaldırıldığı için burada da kaldırıldı
                        });
                        setOriginalStatus(data.status);

                    } else {
                        setError("Düzenlenecek proje bulunamadı.");
                    }
                } catch (err) {
                    console.error("Projeyi çekerken hata:", err);
                    setError("Proje yüklenirken bir hata oluştu.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, projectId, db, navigate]); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const projectData = {
            ownerEmail: user.email,
            ...formData,
        };
        
        // Yeni projelerde zorunlu alan kontrolü
        if (!projectData.projectName || !projectData.projectSummary) {
             setError('Lütfen tüm zorunlu alanları (Proje Adı ve Özeti) doldurun.');
             setLoading(false);
             return;
        }

        try {
            if (isEditMode) {
                // Revizyonu tekrar gönder (Durumu 'submitted' olarak değiştir)
                const docRef = doc(db, "users", user.uid, "projects", projectId);
                await updateDoc(docRef, {
                    ...projectData,
                    status: 'submitted', // Tekrar incelemeye gönderildi
                    'adminNotes.isNew': false, // Admin'e gönderilen uyarıyı sıfırla
                    lastRevisionDate: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                alert('Projeniz revize edildi ve başarıyla tekrar incelemeye gönderildi!');
            } else {
                // Yeni Proje Oluştur
                const projectsCollectionRef = collection(db, "users", user.uid, "projects");
                await addDoc(projectsCollectionRef, {
                    ...projectData,
                    status: 'submitted',
                    submittedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                alert('Projeniz başarıyla yüklendi ve incelemeye gönderildi!');
            }
            navigate('/dashboard'); // Dashboard'a geri dön
        } catch (err) {
            console.error("Proje yüklenirken/güncellenirken hata:", err);
            setError(`Hata oluştu: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="pt-32 text-center">Proje yükleniyor...</div>;
    
    // Revizyon modunda değilsek ve bir proje ID'si varsa (ki olmamalı) veya düzenlemeye izin verilmiyorsa
    if (isEditMode && originalStatus !== 'revision_requested' && !loading) {
         return <div className="pt-32 text-center text-red-600">Bu projeyi düzenleme yetkiniz bulunmamaktadır. Mevcut durumu: {originalStatus}.</div>;
    }

    return (
        <div className="min-h-screen pt-32 pb-16 bg-nuper-gray">
            <div className="max-w-xl px-4 mx-auto">
                <h1 className="mb-6 text-3xl font-bold font-heading text-nuper-dark-blue">
                    {isEditMode ? 'Proje Revizyonu ve Tekrar Gönderim' : 'Yeni Proje Yükle'}
                </h1>
                
                {isEditMode && (
                    <div className="p-4 mb-4 text-orange-700 bg-orange-100 border-l-4 border-orange-500">
                        <p className="font-bold">Revizyon Modu Aktif:</p>
                        <p>Hakem notlarını inceleyin, gerekli düzenlemeleri yapın ve tekrar gönderin.</p>
                    </div>
                )}
                
                <div className="p-8 bg-white shadow-lg rounded-xl">
                    {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Proje Adı */}
                        <div>
                            <label htmlFor="projectName" className="block mb-1 text-sm font-medium text-gray-700">Proje Adı</label>
                            <input
                                type="text"
                                id="projectName"
                                name="projectName"
                                className="form-input-std"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Proje Özeti */}
                        <div>
                            <label htmlFor="projectSummary" className="block mb-1 text-sm font-medium text-gray-700">Proje Özeti (Maks. 500 kelime)</label>
                            <textarea
                                id="projectSummary"
                                name="projectSummary"
                                rows="5"
                                className="form-input-std"
                                value={formData.projectSummary}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        {/* Kullanılan Teknolojiler (KALDIRILDI) */}

                        {/* Proje Dosya Linki (KALDIRILDI) */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 font-bold text-white transition-colors duration-200 rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue disabled:bg-gray-400"
                        >
                            {loading 
                                ? 'İşleniyor...' 
                                : isEditMode 
                                    ? 'Revize Edildi, Tekrar Gönder' 
                                    : 'Projeyi Yükle ve İncelemeye Gönder'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectUploadForm;