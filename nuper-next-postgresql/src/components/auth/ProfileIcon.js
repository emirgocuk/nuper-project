import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore importları
import { app } from '../../firebaseConfig'; // app import

const ProfileIcon = ({ user, textColorClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user.email.charAt(0).toUpperCase()); // Varsayılan: Email baş harfi
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth(app); // app ile auth başlatıldı
  const db = getFirestore(app); // db başlatıldı

  // YENİ: Kullanıcının görünen adını Firestore'dan çek
  useEffect(() => {
    if (user) {
        const fetchDisplayName = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const profileName = docSnap.data().profile?.name;
                    if (profileName) {
                        setDisplayName(profileName);
                    }
                }
            } catch (error) {
                console.error("Görünen ad çekilemedi:", error);
            }
        };
        fetchDisplayName();
    }
  }, [user, db]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Görüntülenen baş harfi hesaplama
  const avatarText = displayName && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        {/* Avatar/Baş Harf Gösterimi */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-nuper-blue text-white font-bold text-lg ${textColorClass}`}>
          {avatarText}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 w-48 py-1 mt-2 bg-white rounded-md shadow-xl">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <p className="font-semibold">Hoş Geldiniz:</p>
            <p className="truncate text-nuper-blue">{displayName}</p>
          </div>
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Profil Bilgileri
          </Link>
          <Link to="/settings/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Bildirim Ayarları
          </Link>
          <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Projelerim
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
          >
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;