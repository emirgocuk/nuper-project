import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// İkonlar için SVG bileşenleri (Heroicons'tan alınmıştır)
const NewspaperIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-nuper-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-nuper-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-nuper-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

// Animasyon varyantları
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};


const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* 1. Bölüm: Kahraman Alanı */}
      <div className="pt-24 pb-16 bg-nuper-gray">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-heading font-bold text-nuper-dark-blue">
            Bilginin ve Fırsatların Kesişim Noktası
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-sans">
            Nuper olarak, genç yeteneklerin ve kariyerine yön vermek isteyen herkesin potansiyelini en üst düzeye çıkarması için bir köprü görevi görüyoruz.
          </motion.p>
        </motion.div>
      </div>

      {/* 2. Bölüm: Misyonumuz */}
      <div className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}>
             {/* Not: Bu görseli projenizdeki public klasörüne ekleyip yolunu güncelleyebilirsiniz. */}
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1784&auto=format&fit=crop" alt="Ekip çalışması" className="rounded-lg shadow-2xl" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-heading font-bold text-nuper-blue mb-4">Misyonumuz</h2>
            <p className="font-sans text-lg leading-relaxed">
              Amacımız, dinamik bir öğrenme ve gelişim platformu yaratarak, bireylerin potansiyellerini tam anlamıyla keşfetmelerine ve geleceğe güvenle adım atmalarına yardımcı olmaktır. Bilimden sanata, teknolojiden inovasyona kadar geniş bir yelpazede güncel içerikler ve özel fırsatlar sunuyoruz.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 3. Bölüm: Neler Sunuyoruz? */}
      <div className="py-20 bg-nuper-gray px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center text-nuper-dark-blue mb-12">Nuper'de Seni Neler Bekliyor?</h2>
          <motion.div 
            initial="initial"
            whileInView="animate"
            variants={stagger}
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg text-center">
              <NewspaperIcon />
              <h3 className="text-xl font-bold font-sans mt-4 mb-2 text-nuper-dark-blue">Güncel Bültenler</h3>
              <p className="text-gray-600 font-sans">Sektörlerden haberler, kariyer ipuçları ve ilham verici içeriklerle her an güncel kal.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg text-center">
              <CalendarIcon />
              <h3 className="text-xl font-bold font-sans mt-4 mb-2 text-nuper-dark-blue">İlham Veren Etkinlikler</h3>
              <p className="text-gray-600 font-sans">Alanında uzman isimlerle buluş, yeni beceriler kazan ve network'ünü genişlet.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg text-center">
              <SparklesIcon />
              <h3 className="text-xl font-bold font-sans mt-4 mb-2 text-nuper-dark-blue">Özel Fırsatlar</h3>
              <p className="text-gray-600 font-sans">Staj, yarışma ve kariyer olanaklarından ilk senin haberin olsun, geleceğine yön ver.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* 4. Bölüm: Çağrı (CTA) */}
      <div className="py-20 px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-nuper-dark-blue">Geleceğini Şekillendirmeye Hazır Mısın?</h2>
            <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto font-sans">
                Nuper ailesine katılarak sen de bu yolculuğun bir parçası ol. Fırsatları yakala, potansiyelini keşfet!
            </p>
            <Link
                to="/register"
                className="mt-8 inline-block bg-nuper-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-nuper-dark-blue transition-colors duration-300 transform hover:scale-105"
            >
                Hemen Kaydol
            </Link>
        </motion.div>
      </div>

    </div>
  );
};

export default About;