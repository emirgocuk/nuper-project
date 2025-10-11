"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig'; // firebaseConfig dosyanızın yolunu kontrol edin

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth(app); // Firebase Auth servisini başlat

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Hata mesajını sıfırla

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Giriş başarılı olursa admin paneline yönlendir
            navigate('/admin');
        } catch (err) {
            console.error("Giriş hatası:", err);
            // Hata mesajını kullanıcıya göster
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential': // Yeni Firebase versiyonlarında yaygın
                    setError('E-posta veya şifre yanlış.');
                    break;
                case 'auth/invalid-email':
                    setError('Geçersiz e-posta adresi.');
                    break;
                case 'auth/too-many-requests':
                    setError('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.');
                    break;
                default:
                    setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-nuper-gray p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-heading font-bold text-center text-nuper-blue mb-6">Admin Girişi</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-posta</label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-nuper-blue"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-nuper-blue"
                            placeholder="Şifreniz"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    <button
                        type="submit"
                        className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;