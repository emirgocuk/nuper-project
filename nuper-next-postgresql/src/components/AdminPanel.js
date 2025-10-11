"use client";

import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                        setUser(currentUser);
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                        navigate('/'); 
                    }
                } else {
                    navigate('/admin/login');
                }
            } catch (error) {
                console.error("Yetki kontrolü hatası:", error);
                setIsAuthorized(false);
                navigate('/');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db, navigate]);


    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login');
        } catch (error) {
            console.error("Çıkış yapılırken hata oluştu:", error);
        }
    };

    if (loading) {
        return <div className="py-8 text-center">Yönetici bilgileri yükleniyor...</div>;
    }
    
    if (!isAuthorized) {
        return null;
    }

    const navItems = [
        { to: "/admin", text: "Ana Sayfa", condition: location.pathname === '/admin' },
        { to: "/admin/events", text: "Etkinlik Yönetimi", condition: location.pathname.startsWith('/admin/events') },
        { to: "/admin/bulletins", text: "Bülten Yönetimi", condition: location.pathname.startsWith('/admin/bulletins') },
        { to: "/admin/projects", text: "Proje İnceleme", condition: location.pathname.startsWith('/admin/projects') },
        { to: "/admin/contracts", text: "Sözleşme Yönetimi", condition: location.pathname.startsWith('/admin/contracts') },
        // { to: "/admin/logs", text: "Eylem Geçmişi", condition: location.pathname.startsWith('/admin/logs') } // ARTIK KALDIRILDI
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* DÜZENLEME: Sol menü artık 'sticky' ve tam ekran yüksekliğinde */}
            <aside className="sticky top-0 flex flex-col w-64 h-screen p-6 text-white shadow-lg bg-nuper-dark-blue">
                <h1 className="mb-8 text-2xl font-bold font-heading">Nuper Admin</h1>
                <nav className="flex-grow overflow-y-auto">
                    <ul>
                        {navItems.map(item => (
                             <li className="mb-3" key={item.to}>
                                <Link
                                    to={item.to}
                                    className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${item.condition ? 'bg-nuper-blue' : 'hover:bg-nuper-blue'}`}
                                >
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="pt-4 mt-auto border-t border-gray-700">
                    {user && (
                        <div className="mb-3">
                            <p className="text-sm text-gray-100">Hoş Geldiniz,</p>
                            <p className="text-sm text-gray-300 truncate">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </aside>
            {/* DÜZENLEME: Ana içerik alanı artık kendi içinde kaydırılabilir */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;