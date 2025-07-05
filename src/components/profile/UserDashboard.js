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
        <div className="pt-32 pb-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-heading font-bold text-nuper-dark-blue">Projelerim</h1>
                    <Link to="/project-upload" className="bg-nuper-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-nuper-dark-blue">
                        Yeni Proje Yükle
                    </Link>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    {projects.length > 0 ? (
                        <ul className="space-y-4">
                            {projects.map(project => (
                                <li key={project.id} className="border p-4 rounded-md flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h3 className="font-semibold text-lg text-nuper-dark-blue">{project.projectName}</h3>
                                        <p className="text-sm text-gray-500">
                                            Durum: <span className="font-medium text-gray-700">{project.status}</span>
                                        </p>
                                    </div>
                                    <button className="text-sm text-nuper-blue hover:underline">Detaylar</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-gray-600 py-8">
                            <p>Henüz bir proje yüklemediniz.</p>
                            <p className="mt-2 text-sm">"Yeni Proje Yükle" butonu ile ilk projenizi ekleyebilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
