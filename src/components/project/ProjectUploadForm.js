import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig';

const ProjectUploadForm = () => {
    const [projectName, setProjectName] = useState('');
    const [projectSummary, setProjectSummary] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    
    const navigate = useNavigate();
    const db = getFirestore(app);
    const auth = getAuth(app);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) {
            setError('Devam etmek için yasal koşulları kabul etmelisiniz.');
            return;
        }
        setError('');
        setLoading(true);

        const user = auth.currentUser;
        if (!user) {
            setError('Proje yüklemek için giriş yapmalısınız.');
            setLoading(false);
            return;
        }

        try {
            // DÜZENLEME: Proje artık kullanıcının kendi alt koleksiyonuna ekleniyor.
            const projectsCollectionRef = collection(db, "users", user.uid, "projects");

            await addDoc(projectsCollectionRef, {
                // ownerId ve ownerEmail alanlarına artık gerek yok, çünkü bu bilgi yoldan geliyor.
                projectName,
                projectSummary,
                status: 'pending_review',
                submittedAt: serverTimestamp()
            });
            
            navigate('/dashboard');
        } catch (err) {
            setError('Proje yüklenirken bir hata oluştu.');
            console.error("Project upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
                    <h1 className="text-3xl font-heading font-bold text-nuper-dark-blue">Projeni Yatırımcılarla Buluştur</h1>
                    <p className="text-gray-600">Proje detaylarını girerek ilk adımı at. Fikrin, platformumuz aracılığıyla potansiyel yatırımcılara sunulacaktır.</p>
                    
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
                    
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Proje Adı</label>
                        <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="form-input-std" required />
                    </div>

                    <div>
                        <label htmlFor="projectSummary" className="block text-sm font-medium text-gray-700 mb-1">Proje Özeti</label>
                        <textarea id="projectSummary" value={projectSummary} onChange={(e) => setProjectSummary(e.target.value)} rows="6" className="form-input-std" required />
                        <p className="text-xs text-gray-500 mt-1">Projenizin amacını, hedef kitlesini ve çözümünü kısaca açıklayınız.</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800">Yasal Bilgilendirme ve Onay</h3>
                        <p className="text-xs text-gray-600 mt-2">
                            Projenizi göndererek, fikrinizin platformumuzdaki kayıtlı yatırımcılarla paylaşılabileceğini kabul etmiş olursunuz. Platformumuz, fikirlerinizin gizliliğini korumak için yatırımcılardan Gizlilik Sözleşmesi (NDA) onayı alır ancak fikirlerinizin tam hukuki koruması için patent veya marka tescili gibi adımları atmanız sizin sorumluluğunuzdadır.
                        </p>
                        <div className="mt-4">
                            <label className="flex items-center">
                                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-nuper-blue rounded" />
                                <span className="ml-2 text-sm text-gray-700">Okudum, anladım ve kabul ediyorum.</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-400">
                        {loading ? 'Gönderiliyor...' : 'Projemi Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProjectUploadForm;
