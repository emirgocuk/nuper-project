"use client";

import React, { useEffect, useState } from 'react';
// collectionGroup eklendi
import { collectionGroup, getDocs, getFirestore, query, where, orderBy } from 'firebase/firestore'; 
import { app } from '../firebaseConfig';
import Link from 'next/link';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchPublishedProjects = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // HATA DÜZELTİLDİ: Firestore'dan Collection Group Query ile sadece 'published' olanları çekiyoruz.
                // Bu, users/UID/projects altındaki tüm projelere bakar.
                const projectsCollectionGroupRef = collectionGroup(db, 'projects');
                const q = query(
                    projectsCollectionGroupRef,
                    where('status', '==', 'published'),
                    orderBy('submittedAt', 'desc')
                );
                
                const querySnapshot = await getDocs(q);
                
                const publishedProjects = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Proje ID'sini ve Veriyi doğrudan kullanıyoruz.
                    return {
                        id: doc.id,
                        ...data,
                        // Firestore Timestamp'i Date objesine çevirme
                        submittedAt: data.submittedAt?.toDate() || new Date(), 
                    };
                });
                
                setProjects(publishedProjects);

            } catch (err) {
                console.error("Projeler çekilirken hata oluştu:", err);
                setError("Proje vitrini yüklenirken bir sorun oluştu. (Hata kodu: CGQ)");
            } finally {
                setLoading(false);
            }
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
                                        
                                        {/* Proje içeriğinin ilk paragrafını özet olarak kullanıyoruz */}
                                        <p className="mt-2 text-base text-gray-700 line-clamp-2">
                                            {project.content?.blocks[0]?.data?.text || "Detaylı içerik bekleniyor..."}
                                        </p>
                                        
                                        <p className="mt-4 text-sm font-semibold text-gray-500">
                                            Detaylı Tanıtım Sayfasına Git &rarr;
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