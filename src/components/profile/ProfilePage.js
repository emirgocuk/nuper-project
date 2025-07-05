import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const ProfilePage = () => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleDeleteAccount = async () => {
    // Onay metni kontrolü
    if (confirmationText !== 'onaylıyorum') {
      setError('Lütfen devam etmek için onay metnini doğru bir şekilde yazın.');
      return;
    }

    setLoading(true);
    setError('');

    const user = auth.currentUser;

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
        setLoading(false);
      }
    } else {
      setError('Kullanıcı bulunamadı veya oturum süresi doldu.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-16 bg-nuper-gray min-h-screen">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Profil Bilgileri Kartı */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-heading font-bold text-nuper-dark-blue mb-6">Profil Bilgileri</h1>
          <p>Profil bilgileriniz ve ayarlarınız burada görünecektir. (Bu alan gelecekte geliştirilecektir)</p>
        </div>

        {/* Tehlikeli Alan Kartı */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-200">
          <h2 className="text-2xl font-heading font-bold text-red-700 mb-4">Tehlikeli Alan</h2>
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
                className="form-input-std mt-1"
                placeholder="onaylıyorum"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              onClick={handleDeleteAccount}
              disabled={confirmationText !== 'onaylıyorum' || loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Hesap Siliniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
