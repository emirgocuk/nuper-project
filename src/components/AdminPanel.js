// src/components/AdminPanel.js

import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // getFirestore, doc, getDoc import edildi
import { app } from '../firebaseConfig';

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu için yeni state
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth(app);
    const db = getFirestore(app); // Firestore instance'ı

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                        setUser(currentUser);
                        setIsAuthorized(true); // Kullanıcı yetkili
                    } else {
                        // Yetkili değilse, anasayfaya yönlendir.
                        setIsAuthorized(false);
                        navigate('/');
                    }
                } catch (error) {
                    console.error("Yetki kontrolü hatası:", error);
                    setIsAuthorized(false);
                    navigate('/');
                }
            } else {
                // Kullanıcı yoksa login sayfasına yönlendir
                navigate('/admin/login');
            }
            setLoading(false);
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
        return <div className="text-center py-8">Yönetici bilgileri yükleniyor...</div>;
    }

    // Yetkili değilse hiçbir şey render etme, yönlendirme zaten yapılmış olur.
    if (!isAuthorized) {
        return null;
    }

    // ----- Sidebar İçeriği Başlangıç -----
    const navItems = [
        { to: "/admin", text: "Ana Sayfa", condition: location.pathname === '/admin' },
        { to: "/admin/events", text: "Etkinlik Yönetimi", condition: location.pathname.startsWith('/admin/events') },
        { to: "/admin/bulletins", text: "Bülten Yönetimi", condition: location.pathname.startsWith('/admin/bulletins') }
    ];
    // ----- Sidebar İçeriği Bitiş -----

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-nuper-dark-blue text-white p-6 shadow-lg flex flex-col">
                <h1 className="text-2xl font-heading font-bold mb-8">Nuper Admin</h1>
                <nav className="flex-grow">
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
                <div className="mt-auto">
                    {user && <p className="text-sm text-gray-300 mb-2">Hoş Geldiniz, {user.email}</p>}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;