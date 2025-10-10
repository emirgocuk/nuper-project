import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'; // getDoc ve updateDoc eklendi
import { app } from '../../firebaseConfig';

const ProfilePage = () => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // YENİ: Profil state'leri
  const [displayName, setDisplayName] = useState('');
  const [initialDisplayName, setInitialDisplayName] = useState(''); 
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setUserEmail(user.email);
        try {
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const currentName = data.profile?.name || '';
                setDisplayName(currentName);
                setInitialDisplayName(currentName);
            }
        } catch (err) {
            console.error("Profil bilgisi çekme hatası:", err);
            setError('Profil bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
  }, [user, db, navigate]);
  
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (displayName === initialDisplayName) return; // Değişiklik yoksa kaydetme
    
    setSaving(true);
    setError('');

    try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            'profile.name': displayName
        });
        setInitialDisplayName(displayName); // Başarılı kayıttan sonra başlangıç değerini güncelle
        alert('Profil başarıyla güncellendi!');
    } catch (err) {
        console.error("Profil güncelleme hatası:", err);
        setError('Profil güncellenirken bir hata oluştu.');
    } finally {
        setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Onay metni kontrolü
    if (confirmationText !== 'onaylıyorum') {
      setError('Lütfen devam etmek için onay metnini doğru bir şekilde yazın.');
      return;
    }

    setSaving(true); // Yükleniyor durumunu kullan
    setError('');

    if (user) {
      try {
        // Önce Firestore'daki kullanıcı belgesini siliyoruz.
        await deleteDoc(doc(db, "users", user.uid));
        
        // Ardından Firebase Authentication'daki kullanıcıyı siliyoruz.
        await deleteUser(user);

        // Başarılı silme sonrası kullanıcıyı anasayfaya yönlendiriyoruz.
        navigate('/');

      } catch (error) {
        console.error("Hesap silinirken hata oluştu:", error);
        // Yeniden kimlik doğrulama gerektiren hatalar için kullanıcıya bilgi verilir.
        if (error.code === 'auth/requires-recent-login') {
            setError('Bu işlem yüksek güvenlik gerektirir. Lütfen çıkış yapıp tekrar giriş yaptıktan sonra tekrar deneyin.');
        } else {
            setError('Hesap silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
        setSaving(false);
      }
    } else {
      setError('Kullanıcı bulunamadı veya oturum süresi doldu.');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="pt-32 text-center">Yükleniyor...</div>;
  }
  
  const hasChanges = displayName !== initialDisplayName;

  return (
    <div className="min-h-screen pt-32 pb-16 bg-nuper-gray">
      <div className="max-w-4xl px-4 mx-auto space-y-8">
        
        {/* Profil Bilgileri / Özelleştirme Kartı */}
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <h1 className="mb-6 text-3xl font-bold font-heading text-nuper-dark-blue">Profil Bilgileri</h1>
          {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">E-posta</label>
                <input
                    type="email"
                    className="cursor-not-allowed form-input-std bg-gray-50"
                    value={userEmail}
                    disabled
                />
                <p className="mt-1 text-xs text-gray-500">E-posta adresi değiştirilemez.</p>
            </div>
            <div>
                <label htmlFor="displayname" className="block mb-1 text-sm font-medium text-gray-700">Görünen Ad</label>
                <input
                    type="text"
                    id="displayname"
                    className="form-input-std"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
            </div>
            
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={!hasChanges || saving}
                    className="px-6 py-2 font-bold text-white transition-colors duration-200 rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue disabled:bg-gray-400"
                >
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>
          </form>
        </div>

        {/* Tehlikeli Alan Kartı */}
        <div className="p-8 bg-white border-2 border-red-200 shadow-lg rounded-xl">
          <h2 className="mb-4 text-2xl font-bold text-red-700 font-heading">Tehlikeli Alan</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Hesabınızı silmek, geri alınamaz bir işlemdir. Tüm projeleriniz, profil bilgileriniz ve ayarlarınız kalıcı olarak silinecektir.
            </p>
            <div>
              <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700">
                Devam etmek için lütfen aşağıdaki alana "<span className="font-bold text-red-600">onaylıyorum</span>" yazın.
              </label>
              <input
                type="text"
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="mt-1 form-input-std"
                placeholder="onaylıyorum"
              />
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={confirmationText !== 'onaylıyorum' || saving}
              className="w-full px-4 py-3 font-bold text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {saving ? 'Hesap Siliniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;