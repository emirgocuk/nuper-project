import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// Firestore fonksiyonları eklendi
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState(''); // YENİ: Görünen ad state'i
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app); // Firestore başlatıldı

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // YENİ: Başarılı kayıt sonrası Firestore'a kullanıcı belgesi oluşturuluyor
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: 'user', // Varsayılan rol olarak 'user' atanıyor
                profile: {
                    name: displayName, // YENİ: Görünen adı kaydediyoruz
                    avatar: null
                },
                settings: {
                    notifications: true // Varsayılan bildirim ayarı
                },
                createdAt: serverTimestamp()
            });

            navigate('/'); // Anasayfaya yönlendir
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Bu e-posta adresi zaten kullanılıyor.');
            } else {
                setError('Kayıt sırasında bir hata oluştu.');
            }
            console.error("Register error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-nuper-dark-blue">Yeni Hesap Oluştur</h2>
            {error && <p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
            <div>
                <label htmlFor="register-displayname" className="block mb-1 text-sm font-medium text-gray-700">Görünen Ad</label>
                <input
                    type="text"
                    id="register-displayname"
                    className="form-input-std"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Adınız Soyadınız veya Kullanıcı Adınız"
                    required
                />
            </div>
            <div>
                <label htmlFor="register-email" className="block mb-1 text-sm font-medium text-gray-700">E-posta</label>
                <input
                    type="email"
                    id="register-email"
                    className="form-input-std"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="register-password" className="block mb-1 text-sm font-medium text-gray-700">Şifre</label>
                <input
                    type="password"
                    id="register-password"
                    className="form-input-std"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-3 font-bold text-white transition-colors duration-200 rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue"
            >
                Kaydol
            </button>
        </form>
    );
};

export default RegisterForm;