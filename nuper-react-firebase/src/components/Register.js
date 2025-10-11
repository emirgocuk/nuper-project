// src/components/Register.js
import React from 'react';

const Register = () => {
    return (
        <div className="pt-24 pb-16 bg-white min-h-screen"> {/* Header ile çakışmaması için pt-24 ekledik */}
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-heading font-bold text-center mb-6 text-nuper-blue">Nuper'a Kaydol!</h2>
                <p className="text-lg text-gray-700 text-center mb-6 font-sans">
                    Girişimci, yatırımcı veya projene destek arıyan bir öğrenciysen, Nuper’e katıl ve fırsatları yakala! Hemen formu doldur, aramıza katıl.
                </p>
                <div className="max-w-2xl mx-auto">
                    <iframe
                        src="https://emirgocuk.notion.site/ebd/1f92ec2b978c8028aa7dc9820b6b9c56"
                        width="100%"
                        height="600"
                        frameBorder="0"
                        className="bg-white rounded-lg shadow-md border"
                        allowFullScreen
                        title="Nuper Kayıt Formu" // Erişilebilirlik için title ekledik
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Register;