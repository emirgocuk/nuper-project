import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import SpaceHero from './components/SpaceHero'; // Yeni oluşturduğunuz bileşen

// Test için geçici Header
const TestHeader = () => (
    <nav className="fixed w-full z-20 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-heading font-bold text-white">Nuper</Link>
            <div className="flex items-center space-x-5 text-white">
                <span>Ana Sayfa</span>
                <span>Hakkımızda</span>
                <span>Etkinlikler</span>
                <span>Bültenler</span>
                <span className="px-4 py-2 rounded-lg bg-white text-nuper-blue font-semibold">Kaydol</span>
            </div>
        </div>
    </nav>
);

// Sadece SpaceHero'yu test etmek için basitleştirilmiş App bileşeni
const App = () => {
    return (
        <Router>
            <TestHeader />
            <Routes>
                <Route path="/" element={<SpaceHero />} />
                {/* Diğer tüm routelar bu test sırasında devre dışı */}
            </Routes>
        </Router>
    );
};

export default App;
