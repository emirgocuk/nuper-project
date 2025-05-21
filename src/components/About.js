// src/pages/About.js
import React from 'react';

const About = () => { // Bileşen adını About olarak bırakıyoruz
  return (
    <div className="pt-16 bg-nuper-gray min-h-screen flex items-center justify-center">
      {/* BURADA DEĞİŞİKLİK: bg-white rounded-lg shadow-md kaldırıldı */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-6">
          Hakkımızda
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed font-sans mb-4">
          Nuper olarak, genç yeteneklerin ve kariyerine yön vermek isteyen herkesin bilgiye ulaşımını kolaylaştırmayı hedefliyoruz. Bilimden sanata, teknolojiden inovasyona kadar geniş bir yelpazede güncel bültenler, ilham veren etkinlikler ve özel kariyer fırsatları sunuyoruz. Amacımız, dinamik bir öğrenme ve gelişim platformu yaratarak, bireylerin potansiyellerini tam anlamıyla keşfetmelerine ve geleceğe güvenle adım atmalarına yardımcı olmaktır.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed font-sans">
          Ekibimiz, sürekli değişen dünyada en doğru ve güncel bilgiyi size ulaştırmak için tutkuyla çalışıyor. Her bir içeriğimiz, sizlere değer katmak ve yolculuğunuzda ışık tutmak amacıyla özenle hazırlanmaktadır. Nuper ailesi olarak, bilginin gücüne inanıyor ve bu gücü sizinle paylaşmaktan mutluluk duyuyoruz. Geleceğin liderlerini ve yenilikçilerini birlikte inşa etmek için buradayız.
        </p>
      </div>
    </div>
  );
};

export default About;