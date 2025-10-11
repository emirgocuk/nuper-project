"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'; 
import { app } from '../../firebaseConfig';

const ProfilePage = () => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // GÜNCELLENDİ: Daha fazla profil detayı eklendi
  const [profileData, setProfileData] = useState({
    displayName: '',
    dateOfBirth: '',
    city: '',
    educationLevel: '',
    linkedinUrl: '',
    userEmail: '',
  });
  const [initialProfileData, setInitialProfileData] = useState({});

  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;
  
  // Eğitim Durumu Seçenekleri
  const educationOptions = [
    { value: '', label: 'Seçiniz' },
    { value: 'student', label: 'Öğrenci' },
    { value: 'graduate', label: 'Yeni Mezun' },
    { value: 'professional', label: 'Profesyonel Çalışan' },
    { value: 'other', label: 'Diğer' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);
            
            let data = { displayName: '', dateOfBirth: '', city: '', educationLevel: '', linkedinUrl: '' };

            if (docSnap.exists()) {
                const docData = docSnap.data();
                data = {
                    displayName: docData.profile?.name || '',
                    dateOfBirth: docData.details?.dateOfBirth || '',
                    city: docData.details?.city || '',
                    educationLevel: docData.details?.educationLevel || '',
                    linkedinUrl: docData.details?.linkedinUrl || '',
                };
            }
            
            const fullData = { ...data, userEmail: user.email };
            setProfileData(fullData);
            setInitialProfileData(fullData);
        } catch (err) {
            console.error("Profil bilgisi çekme hatası:", err);
            setError('Profil bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, db, navigate]); 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Değişiklik kontrolü
    const hasChanges = Object.keys(profileData).some(key => {
        if (key === 'userEmail') return false; // E-posta değişmez
        return profileData[key] !== initialProfileData[key];
    });

    if (!hasChanges) return; 
    
    setSaving(true);
    setError('');

    try {
        const userDocRef = doc(db, "users", user.uid);
        
        // Sadece değişen alanları göndermek için bir obje oluşturuluyor
        await updateDoc(userDocRef, {
            'profile.name': profileData.displayName,
            // YENİ: Ayrı bir 'details' alanı oluşturularak ek bilgiler kaydediliyor
            details: {
                dateOfBirth: profileData.dateOfBirth,
                city: profileData.city,
                educationLevel: profileData.educationLevel,
                linkedinUrl: profileData.linkedinUrl,
            }
        });
        
        setInitialProfileData(profileData); // Başarılı kayıttan sonra başlangıç değerini güncelle
        alert('Profil başarıyla güncellendi!');
    } catch (err) {
        console.error("Profil güncelleme hatası:", err);
        setError('Profil güncellenirken bir hata oluştu.');
    } finally {
        setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'onaylıyorum') {
      setError('Lütfen devam etmek için onay metnini doğru bir şekilde yazın.');
      return;
    }

    setSaving(true);
    setError('');

    if (user) {
      try {
        // Önce Firestore'daki kullanıcı belgesini siliyoruz.
        await deleteDoc(doc(db, "users", user.uid));
        
        // Ardından Firebase Authentication'daki kullanıcıyı siliyoruz.
        await deleteUser(user);

        navigate('/');

      } catch (error) {
        console.error("Hesap silinirken hata oluştu:", error);
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

  const hasUnsavedChanges = Object.keys(profileData).some(key => {
        if (key === 'userEmail') return false;
        return profileData[key] !== initialProfileData[key];
    });

  if (loading) {
    return <div className="pt-32 text-center">Yükleniyor...</div>;
  }
  
  return (
    <div className="min-h-screen pt-32 pb-16 bg-nuper-gray">
      <div className="max-w-4xl px-4 mx-auto space-y-8">
        
        {/* Profil Bilgileri / Özelleştirme Kartı */}
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <h1 className="mb-6 text-3xl font-bold font-heading text-nuper-dark-blue">Profil Bilgileri</h1>
          {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {/* E-posta (Okunamaz) */}
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">E-posta</label>
                <input
                    type="email"
                    className="cursor-not-allowed form-input-std bg-gray-50"
                    value={profileData.userEmail}
                    disabled
                />
            </div>
            
            {/* Görünen Ad */}
            <div>
                <label htmlFor="displayName" className="block mb-1 text-sm font-medium text-gray-700">Görünen Ad</label>
                <input
                    type="text"
                    name="displayName"
                    id="displayName"
                    className="form-input-std"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Doğum Tarihi */}
            <div>
                <label htmlFor="dateOfBirth" className="block mb-1 text-sm font-medium text-gray-700">Doğum Tarihi</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className="form-input-std"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                />
            </div>

            {/* Şehir */}
            <div>
                <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">Şehir</label>
                <input
                    type="text"
                    name="city"
                    id="city"
                    className="form-input-std"
                    value={profileData.city}
                    onChange={handleInputChange}
                />
            </div>

            {/* Eğitim Durumu */}
            <div>
                <label htmlFor="educationLevel" className="block mb-1 text-sm font-medium text-gray-700">Eğitim Durumu</label>
                <select
                    name="educationLevel"
                    id="educationLevel"
                    className="form-input-std"
                    value={profileData.educationLevel}
                    onChange={handleInputChange}
                >
                    {educationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            
            {/* LinkedIn URL'si */}
            <div>
                <label htmlFor="linkedinUrl" className="block mb-1 text-sm font-medium text-gray-700">LinkedIn Profil URL</label>
                <input
                    type="url"
                    name="linkedinUrl"
                    id="linkedinUrl"
                    className="form-input-std"
                    value={profileData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                />
            </div>
            
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={!hasUnsavedChanges || saving}
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