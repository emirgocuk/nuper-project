import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebaseConfig';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth(app);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
            console.error("Login error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-nuper-dark-blue">Hesabınıza Giriş Yapın</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
            <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                    type="email"
                    id="login-email"
                    className="form-input-std" // Stil güncellendi
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <input
                    type="password"
                    id="login-password"
                    className="form-input-std" // Stil güncellendi
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
                Giriş Yap
            </button>
        </form>
    );
};

export default LoginForm;
