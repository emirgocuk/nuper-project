import React from 'react';

const About = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8 text-nuper-blue">Nuper Nedir?</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Nuper, öğrencilerin kişisel ve akademik gelişimlerini destekleyen bir platformdur. Yarışmalar, atölyeler ve etkinlikler keşfet, okul duyurularını takip et, projelerini sosyal medyada tanıt! Herkes için bir şeyler var, potansiyelini burada keşfet. Biz, gençlerin yeteneklerini ortaya çıkarmalarına ve geleceğe adım atmalarına yardımcı oluyoruz.
        </p>
        <div className="mt-8">
          <h3 className="text-2xl font-heading font-semibold mb-4 text-nuper-blue">Misyonumuz</h3>
          <p className="text-lg leading-relaxed text-gray-700">
            Eğitimde fırsat eşitliği sağlamak ve gençlerin yaratıcılığını teşvik etmek. Teknoloji ve sanatı bir araya getirerek yenilikçi çözümler sunuyoruz.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;