import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// Firestore fonksiyonları eklendi
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
            <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
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
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
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
                className="w-full bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
                Kaydol
            </button>
        </form>
    );
};

export default RegisterForm;
