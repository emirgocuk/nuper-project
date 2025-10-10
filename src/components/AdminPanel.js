import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { MessageSquare, Calendar, BookOpen, Users, LogOut, FileText, CheckCircle } from 'lucide-react'; // Lucide ikonları eklendi

const AdminPanel = ({ currentUser, userProfile }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // AdminLogin sayfasına yönlendir
                navigate('/admin/login');
                setLoading(false);
                return;
            }
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    navigate('/'); 
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
        { name: 'Etkinlik Yönetimi', path: '/admin/events', icon: Calendar },
        { name: 'Bülten Yönetimi', path: '/admin/bulletins', icon: BookOpen },
        { name: 'Sözleşme Yönetimi', path: '/admin/contracts', icon: FileText },
        // Proje İnceleme Paneli
        { name: 'Proje İnceleme', path: '/admin/projects', icon: CheckCircle },
        { name: 'Kullanıcılar', path: '/admin/users', icon: Users, disabled: true },
        { name: 'Ayarlar', path: '/admin/settings', icon: MessageSquare, disabled: true },
    ];

    const activeClass = "bg-nuper-blue text-white shadow-lg";
    const inactiveClass = "text-gray-700 hover:bg-gray-100";

    return (
        <div className="flex h-screen font-sans bg-gray-50">
            {/* Sidebar */}
            <div className="fixed flex flex-col w-64 h-full bg-white shadow-xl">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-nuper-dark-blue">Nuper Admin</h1>
                    {/* Görünen Adı (fullName varsa onu kullan) */}
                    <p className="mt-1 text-xs text-gray-500">Hoş Geldin, {userProfile?.fullName || currentUser?.email || 'Admin'}</p>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.name}
                                to={item.path} 
                                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${item.disabled ? 'opacity-50 cursor-not-allowed' : isActive ? activeClass : inactiveClass}`}
                                onClick={(e) => { if (item.disabled) e.preventDefault(); }}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center justify-center w-full p-3 text-red-600 transition-colors duration-200 bg-red-100 rounded-lg hover:bg-red-200"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {/* İçerik Alanı */}
            <main className="flex-1 pt-4 overflow-y-auto pl-72">
                 <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                     <Outlet />
                 </div>
            </main>
        </div>
    );
};

export default AdminPanel;