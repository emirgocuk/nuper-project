import React from 'react';
import './index.css';

const App = () => {
  return (
    <div className="min-h-screen bg-nuper-gray font-sans text-gray-900">
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-nuper-blue">Nuper</h1>
          <div className="space-x-4">
            <a href="#home" className="text-nuper-blue hover:text-nuper-purple">Ana Sayfa</a>
            <a href="#about" className="text-nuper-blue hover:text-nuper-purple">Hakkında</a>
            <a href="#opportunities" className="text-nuper-blue hover:text-nuper-purple">Fırsatlar</a>
            <a href="#register" className="bg-nuper-blue text-white px-4 py-2 rounded-lg hover:bg-nuper-purple">Kaydol</a>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-24 pb-16 text-center bg-gradient-to-r from-nuper-blue to-nuper-purple text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">Nuper ile Geleceğini Şekillendir!</h1>
          <p className="mt-4 text-lg md:text-xl animate-slide-up">Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!</p>
          <a href="#register" className="mt-6 inline-block bg-white text-nuper-blue px-6 py-3 rounded-lg font-semibold hover:bg-nuper-gray animate-slide-up">Şimdi Kaydol</a>
        </div>
      </section>

      <section id="about" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in">Nuper Nedir?</h2>
          <p className="text-lg text-gray-700 animate-slide-up">
            Nuper, öğrencilerin kişisel ve akademik gelişimlerini destekleyen bir platformdur. Yarışmalar, atölyeler ve etkinlikler keşfet, okul duyurularını takip et, projelerini sosyal medyada tanıt!
          </p>
        </div>
      </section>

      <section id="opportunities" className="py-16 bg-nuper-gray">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in">Fırsatları Keşfet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Bilim Olimpiyatları', desc: 'Bilimde yeteneklerini göster! Son başvuru: 30 Haziran 2025', id: 1 },
              { title: 'Sanat Yarışması', desc: 'Resim ve müzikle parılda. İstanbul, 15 Temmuz 2025', id: 2 },
              { title: 'Kodlama Hackathonu', desc: 'Yazılım projeni geliştir! Online, 10 Ağustos 2025', id: 3 },
            ].map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-slide-up">
                <h3 className="text-xl font-semibold text-nuper-blue">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in">Hemen Katıl!</h2>
          <p className="text-lg text-gray-700 text-center mb-6 animate-slide-up">
            Öğrenci veya okul temsilcisiysen, Nuper’a katıl ve fırsatları yakala!
          </p>
          <div className="max-w-2xl mx-auto">
            <iframe
              src="YOUR_GOOGLE_FORM_LINK"
              width="100%"
              height="600"
              frameBorder="0"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="bg-nuper-blue text-white py-6 text-center">
        <p className="animate-fade-in">
          Bizi takip et:{' '}
          <a href="https://x.com/nuperplatform" className="text-nuper-gray hover:text-white">X</a> |{' '}
          <a href="https://linkedin.com/company/nuperplatform" className="text-nuper-gray hover:text-white">LinkedIn</a>
        </p>
        <p className="mt-2 animate-fade-in">Nuper © 2025</p>
      </footer>
    </div>
  );
};

export default App;