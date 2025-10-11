import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const settings = docSnap.data().settings || {};
          // Eğer notifications alanı varsa kullan, yoksa varsayılan true
          setNotificationsEnabled(settings.notifications !== undefined ? settings.notifications : true);
        }
      } catch (err) {
        setError("Ayarlar yüklenirken bir sorun oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user, db]);

  const handleToggle = () => {
    setNotificationsEnabled(prev => !prev);
  };
  
  const handleSave = async () => {
    if (!user) {
        setError('Kullanıcı oturumu bulunamadı.');
        return;
    }
    setSaving(true);
    setError(null);
    try {
        await updateDoc(doc(db, "users", user.uid), {
            'settings.notifications': notificationsEnabled
        });
        alert('Bildirim ayarları kaydedildi!');
    } catch (err) {
        setError('Ayarlar kaydedilirken bir hata oluştu.');
        console.error(err);
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return <div className="pt-32 text-center">Ayarlar Yükleniyor...</div>;
  }
  
  // YENİ: Email Notifications Integration için placeholder
  const emailIntegrationNote = notificationsEnabled ? 
    "Email bildirimleri etkin. Entegrasyon (backend servisi) şu anda simüle ediliyor." :
    "Email bildirimleri pasif durumda. Entegrasyon (backend servisi) şu anda simüle ediliyor.";

  return (
    <div className="min-h-screen pt-32 pb-16 bg-nuper-gray">
      <div className="max-w-4xl px-4 mx-auto">
        <h1 className="mb-8 text-4xl font-bold font-heading text-nuper-dark-blue">Bildirim Ayarları</h1>
        <div className="p-8 space-y-6 bg-white shadow-lg rounded-xl">
            
            {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
            
            {/* Bildirim Tercihi */}
            <div className="flex items-center justify-between pb-4 border-b">
                <label htmlFor="notification-toggle" className="text-lg font-medium text-gray-700">
                    E-posta Bildirimlerini Aç/Kapat
                </label>
                <button
                    onClick={handleToggle}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${notificationsEnabled ? 'bg-nuper-blue' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={notificationsEnabled}
                    id="notification-toggle"
                    disabled={saving}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                    ></span>
                </button>
            </div>
            
            {/* Email Notifications Integration Placeholder */}
            <div className="pt-4">
                <h3 className="mb-2 text-xl font-semibold text-nuper-dark-blue">Email Entegrasyonu Durumu</h3>
                <p className="text-sm italic text-gray-500">{emailIntegrationNote}</p>
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-bold">Geliştirici Notu:</span> Email bildirim entegrasyonu (backend servisi) ileri aşama görevidir. Frontend arayüzü hazırdır.
                </p>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 font-bold text-white transition-colors duration-200 rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue disabled:bg-gray-400"
                >
                    {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;