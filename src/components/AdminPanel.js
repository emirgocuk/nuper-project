// src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // onAuthStateChanged ve signOut eklendi
import { app } from '../firebaseConfig'; // firebaseConfig dosyanızın yolunu kontrol edin

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth(app); // Firebase Auth servisini başlat

    // Kullanıcı oturum durumunu dinle
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Kullanıcı oturum açmışsa, user state'ini güncelle
                setUser(currentUser);
            } else {
                // Kullanıcı oturum açmamışsa, login sayfasına yönlendir
                navigate('/admin/login');
            }
            setLoading(false); // Yükleme tamamlandı
        });

        // Temizlik fonksiyonu: Bileşen unmount olduğunda dinleyiciyi kaldır
        return () => unsubscribe();
    }, [auth, navigate]);

    // Çıkış yapma fonksiyonu
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login'); // Çıkış sonrası login sayfasına yönlendir
        } catch (error) {
            console.error("Çıkış yapılırken hata oluştu:", error);
            alert("Çıkış yapılırken bir hata oluştu.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nuper-gray">
                <p className="text-nuper-blue text-lg">Yükleniyor...</p>
            </div>
        );
    }

    if (!user) {
        // Kullanıcı yoksa ve loading bittiyse (zaten navigate('/admin/login') yapmış olmalı)
        return null;
    }

    // Admin panelinin ana yapısı
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sol Menü */}
            <aside className="w-64 bg-nuper-dark-blue text-white p-6 shadow-lg flex flex-col">
                <h1 className="text-2xl font-heading font-bold mb-8">Nuper Admin</h1>
                <nav className="flex-grow">
                    <ul>
                        <li className="mb-3">
                            <Link 
                                to="/admin" 
                                className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${location.pathname === '/admin' ? 'bg-nuper-blue' : 'hover:bg-nuper-blue'}`}
                            >
                                Ana Sayfa
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link 
                                to="/admin/events" 
                                className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${location.pathname.startsWith('/admin/events') ? 'bg-nuper-blue' : 'hover:bg-nuper-blue'}`}
                            >
                                Etkinlik Yönetimi
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link 
                                to="/admin/bulletins" 
                                className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${location.pathname.startsWith('/admin/bulletins') ? 'bg-nuper-blue' : 'hover:bg-nuper-blue'}`}
                            >
                                Bülten Yönetimi
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto"> {/* En alta sabitlenmesi için */}
                    <p className="text-sm text-gray-300 mb-2">Hoş Geldiniz, {user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* İçerik Alanı */}
            <main className="flex-1 p-8 overflow-auto">
                <Outlet /> {/* Alt rotaların içeriği burada render edilecek */}
            </main>
        </div>
    );
};

export default AdminPanel;