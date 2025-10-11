import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // Not: Projeler users/{uid}/projects altındadır ve Firestore Security Rules gereği
                // herkesin bu belgelere erişimi kısıtlanmıştır. Bu nedenle, public vitrinde
                // görüntülenmek üzere admin tarafından 'published_projects' gibi bir ana koleksiyona
                // kopyalanması beklenir. Simülasyon amacıyla Collection Group Query kullanıyoruz.
                
                // Collection Group Query kullanarak projenin detayını bulmaya çalışıyoruz
                const q = query(collection(db, 'users', 'MOCK_UID', 'projects'), where('id', '==', projectId));
                // Gerçek projede bu, CollectionGroupQuery veya ana bir "published_projects" koleksiyonu gerektirir.
                
                // Basitleştirilmiş: AdminProjectList'ten gelen mantıkla ilerleyerek
                // users altındaki projeleri listelemek için buraya mantık koymak yerine,
                // sadece onaylanmış projeleri çeken bir servis olduğunu varsayıyoruz.

                // Gerekli veri: Proje Adı, Özet ve Gönderen E-postası.
                // Projenin sadece public vitrinden görünmesi ve düzenlenememesi gerekir.

                // Şu anda projenin tam yolunu (users/{uid}/projects/{pid}) bilmediğimiz için 
                // bu bileşen statik mock veriye düşecektir. Ancak yapısal olarak bu bileşeni koruyoruz.

                const mockData = { 
                    projectName: 'Yol Boyunca Şarj Projesi', 
                    projectSummary: 'Yapay zeka destekli sensörlerle entegre çalışan, otoyol kenarlarına kurulacak kablosuz elektrik şarj üniteleri konsepti.', 
                    ownerEmail: 'yatirimci@nuper.com', 
                    submittedAt: { toDate: () => new Date() }
                };

                // Eğer projeyi admin panelinden kopyalamazsak, buraya erişim kural dışı olur.
                // Şimdilik simülasyon amacıyla mock data kullanıyoruz.
                setProject({ id: projectId, ...mockData }); 

            } catch (err) {
                console.error("Proje detayları çekilirken hata:", err);
                setError("Proje detayları yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };

        // Bu bileşeni Public Proje Detay rotası olarak kullanacağımız için,
        // geriye dönük uyumluluk sağlamak adına bu mock datayı kullanıyoruz.
        fetchProjectDetail();
    }, [projectId, db, navigate]);


    if (loading) return <div className="pt-24 text-center">Yükleniyor...</div>;
    if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;
    if (!project) return <div className="pt-24 text-center">İstenen proje bulunamadı.</div>;
    
    // Proje özeti içeriği
    const content = project.projectSummary || "Bu projenin detaylı bir özeti bulunmamaktadır. Ancak fikir oldukça yenilikçidir.";

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <article className="p-8 mx-auto prose bg-white rounded-lg shadow-lg lg:prose-lg xl:prose-xl md:p-12">
                <div className="mb-4 not-prose">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-white rounded-full bg-nuper-blue">
                        GİRİŞİM PROJESİ
                    </span>
                </div>
                <h1 className="text-4xl font-heading text-nuper-blue">{project.projectName}</h1>
                
                <div className="flex items-start justify-between my-6 not-prose">
                    <div>
                        <p className="text-lg font-semibold text-gray-800">Fikir Sahibi: {project.ownerEmail}</p>
                        <p className="text-sm text-gray-500">Yayınlanma Tarihi: {project.submittedAt?.toDate().toLocaleDateString('tr-TR')}</p>
                    </div>
                </div>
                <hr className="my-8" />
                
                {/* Proje Özet Alanı (Tıpkı Bülten içeriği gibi) */}
                <p className="mb-6 font-sans text-xl text-gray-700">
                    {content}
                </p>

                {/* Eğer daha uzun bir içerik olsaydı buraya renderBlock fonksiyonu ile listeler vb gelirdi */}
                <h2 className="mt-12 text-3xl font-heading text-nuper-dark-blue">Proje Hakkında Daha Fazla Bilgi</h2>
                <p>Bu alan, fikrin detaylı iş planını, pazar analizini ve finansal projeksiyonlarını içerecektir. Yatırımcılar için özel erişim gerekebilir.</p>


                <div className="mt-12 text-center not-prose">
                    <Link to="/projects" className="font-semibold text-nuper-blue hover:underline">
                        &larr; Tüm Proje Fırsatlarını Görüntüle
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default ProjectDetail;