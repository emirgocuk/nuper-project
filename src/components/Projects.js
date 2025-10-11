import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where, orderBy } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { Link } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchPublishedProjects = async () => {
            setLoading(true);
            setError(null);
            
            // Proje Vitrini için mock veri
            const exampleProjects = [
                { id: 'p1', projectName: 'Gezgin Otonom Robot', projectSummary: 'Depo yönetimini optimize eden yapay zeka destekli robot filosu.', ownerEmail: 'user1@mail.com', status: 'published', submittedAt: new Date(2025, 8, 15) },
                { id: 'p2', projectName: 'Yol Boyunca Şarj Projesi', projectSummary: 'Otoyollarda kablosuz elektrik şarj altyapısı konsepti. Sadece bir fikir olarak sunulmuştur.', ownerEmail: 'user2@mail.com', status: 'published', submittedAt: new Date(2025, 9, 20) },
                { id: 'p3', projectName: 'Adaptif Eğitim Sistemi', projectSummary: 'Öğrenci performansına göre ders içeriklerini dinamik olarak değiştiren platform.', ownerEmail: 'user3@mail.com', status: 'published', submittedAt: new Date(2025, 7, 10) },
                { id: 'p4', projectName: 'Güneş Enerjili Tarım Sensörleri', projectSummary: 'Sıfır enerji tüketimli, bulut tabanlı tarım sensör ağı.', ownerEmail: 'user4@mail.com', status: 'published', submittedAt: new Date(2025, 9, 5) },
            ];
            
            // Projeleri submittedAt'e göre sırala (en yeniyi üste)
            exampleProjects.sort((a, b) => b.submittedAt - a.submittedAt);

            // Gerçek Firestore Query burada Collection Group Query olarak çalışmalıdır.
            
            setProjects(exampleProjects.map(p => ({
                ...p,
                // Slug yerine ProjectId kullanacağız, bu nedenle mock datayı kullanıyoruz.
                slug: p.id
            })));


            setLoading(false);
        };
        fetchPublishedProjects();
    }, [db]);

    if (loading) {
        return <div className="pt-24 text-center">Yatırımcı Projeleri Yükleniyor...</div>;
    }

    if (error) {
        return <div className="pt-24 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-nuper-gray">
            <div className="max-w-4xl px-4 py-8 mx-auto">
                <h1 className="mb-4 text-4xl font-bold text-center font-heading text-nuper-dark-blue">Proje Vitrini: Fikir & Girişim Fırsatları</h1>
                <p className="mb-10 text-lg text-center text-gray-600">
                    Sadece yazılım değil, mühendislik, tasarım ve girişim fikirlerini keşfedin. Her proje, bir potansiyel yatırım fırsatıdır.
                </p>

                {projects.length === 0 ? (
                    <div className="py-12 text-center text-gray-600 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">Henüz Yayınlanmış Proje Yok</h2>
                        <p className="mt-2">Yeni fikirler onaylandıkça burada görünecektir.</p>
                    </div>
                ) : (
                    // Tek sütunlu liste
                    <div className="grid grid-cols-1 gap-6"> 
                        {projects.map(project => {
                            return (
                                <Link to={`/projects/${project.id}`} key={project.id} className="block group">
                                    <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl hover:border-nuper-blue">
                                        <div className="flex items-start justify-between mb-2">
                                            <h2 className="text-2xl font-bold font-heading text-nuper-dark-blue group-hover:text-nuper-blue">
                                                {project.projectName}
                                            </h2>
                                            <span className="text-xs font-medium text-gray-500">
                                                {project.submittedAt?.toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        
                                        {/* Özet Kartı */}
                                        <p className="mt-2 text-base text-gray-700 line-clamp-2">
                                            {project.projectSummary}
                                        </p>
                                        
                                        <p className="mt-4 text-sm font-semibold text-gray-500">
                                            Detayları Görüntüle &rarr;
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;