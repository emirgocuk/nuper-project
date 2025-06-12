import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebaseConfig';

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth(app);

    // Sadece kullanıcı oturumunu kontrol et, admin yetkisini değil.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Kullanıcı yoksa login sayfasına yönlendir
                navigate('/admin/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, navigate]);

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
    
    // user yoksa render etme, yönlendirme gerçekleşir.
    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
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
                <div className="mt-auto">
                    <p className="text-sm text-gray-300 mb-2">Hoş Geldiniz, {user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                {/* Alt route'lar (örn: AdminEventsList) burada render edilecek */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
