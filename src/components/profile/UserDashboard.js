import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchProjects = async () => {
            const user = auth.currentUser;
            if (user) {
                // DÜZENLEME: Sorgu artık doğrudan kullanıcının alt koleksiyonuna yapılıyor.
                // 'where' filtresine gerek kalmadı.
                const projectsCollectionRef = collection(db, "users", user.uid, "projects");
                const q = query(projectsCollectionRef, orderBy("submittedAt", "desc"));
                
                const querySnapshot = await getDocs(q);
                const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(userProjects);
            }
            setLoading(false);
        };

        fetchProjects();
    }, [auth, db]);

    if (loading) {
        return <div className="pt-32 text-center">Projeler Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen pt-32 pb-16 bg-nuper-gray">
            <div className="max-w-4xl px-4 mx-auto space-y-8">
                
                {/* Projelerim Bölümü */}
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold font-heading text-nuper-dark-blue">Projelerim</h1>
                    <Link to="/project-upload" className="px-6 py-2 font-bold text-white rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue">
                        Yeni Proje Yükle
                    </Link>
                </div>
                <div className="p-8 bg-white shadow-lg rounded-xl">
                    {projects.length > 0 ? (
                        <ul className="space-y-4">
                            {projects.map(project => (
                                <li key={project.id} className="flex items-center justify-between p-4 transition-colors border rounded-md hover:bg-gray-50">
                                    <div>
                                        <h3 className="text-lg font-semibold text-nuper-dark-blue">{project.projectName}</h3>
                                        <p className="text-sm text-gray-500">
                                            Durum: <span className="font-medium text-gray-700">{project.status}</span>
                                        </p>
                                    </div>
                                    <button className="text-sm text-nuper-blue hover:underline">Detaylar</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-gray-600">
                            <p>Henüz bir proje yüklemediniz.</p>
                            <p className="mt-2 text-sm">"Yeni Proje Yükle" butonu ile ilk projenizi ekleyebilirsiniz.</p>
                        </div>
                    )}
                </div>
                
                {/* YENİ BÖLÜM: Kullanıcı Etkinlik Geçmişi */}
                <div className="p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="mb-6 text-2xl font-bold font-heading text-nuper-dark-blue">Etkinlik Geçmişi</h2>
                    <div className="pl-4 space-y-4 border-l-4 border-gray-200">
                        <div className="p-3 rounded-lg bg-gray-50">
                            <p className="text-sm font-semibold text-gray-800">2025-10-09: <span className="font-normal text-gray-600">Proje: "{projects[0]?.projectName || 'Örnek Proje'}" incelemeye gönderildi.</span></p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50">
                            <p className="text-sm font-semibold text-gray-800">2025-09-20: <span className="font-normal text-gray-600">Profil bilgileri güncellendi.</span></p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50">
                            <p className="text-sm font-semibold text-gray-800">2025-09-15: <span className="font-normal text-gray-600">Platforma başarıyla kaydoldunuz.</span></p>
                        </div>
                        <p className="mt-4 text-sm italic text-gray-500">
                            Daha kapsamlı etkinlik geçmişi (girişler, bülten okumaları vb.) bu alana gelecekte eklenecektir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;