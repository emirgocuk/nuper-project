import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  return (
    <div className="pt-32 pb-16 bg-nuper-gray min-h-screen flex items-start justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-lg font-heading font-semibold transition-colors duration-300 ${activeTab === 'login' ? 'text-nuper-blue border-b-2 border-nuper-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-lg font-heading font-semibold transition-colors duration-300 ${activeTab === 'register' ? 'text-nuper-blue border-b-2 border-nuper-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Kaydol
          </button>
        </div>

        <div>
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;