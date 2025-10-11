import React from 'react';
import { motion } from 'framer-motion';
import './HowItWorks.css';
import SharedStarfield from './SharedStarfield';

// Özel SVG İkonları
const UploadIcon = () => (
    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V16a4 4 0 01-4 4H7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10L12 8m0 0l-2 2m2-2v6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 12h2a4 4 0 014 4v2" />
    </svg>
);

const ConnectIcon = () => (
    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const SuccessIcon = () => (
    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const steps = [
    {
        icon: <UploadIcon />,
        title: "1. Hayalini Paylaş",
        desc: "Geleceği şekillendirecek projenle ilk adımı at. Güvenli ortamımızda vizyonunu sergile, ilk ışık burada doğar."
    },
    {
        icon: <ConnectIcon />,
        title: "2. Doğru Bağlantılarla Güçlen",
        desc: "Fikrinin potansiyeli fark edilir. Uygun yatırımcılarla buluşarak hikayen gerçek bir yolculuğa dönüşür."
    },
    {
        icon: <SuccessIcon />,
        title: "3. Hayalini Gerçeğe Dönüştür",
        desc: "Yatırım, mentorluk ve destekle projen başarıya ulaşır. Bu artık sadece senin değil, herkesin ilham alacağı bir başarı hikayesi."
    }
];

const cardVariants = {
    offscreen: { y: 100, opacity: 0 },
    onscreen: (custom) => ({
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 1,
            delay: custom * 0.25
        }
    })
};

const HowItWorks = () => (
    <section className="how-it-works-section relative overflow-hidden">
        <SharedStarfield />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative z-10">
            <motion.h2 
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.7 }}
                // DEĞİŞİKLİK: Emoji kaldırıldı ve yazı rengi için class eklendi
                className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
            >
                Fikirden Başarıya: <br className="md:hidden"/> 3 Adımda Yatırım Yolculuğun
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                // DEĞİŞİKLİK: Animasyonun sadece bir kez çalışması için once: true eklendi
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-16 max-w-3xl mx-auto"
            >
                Nuper, parlak fikirleri doğru yatırımcılarla buluşturarak hayalleri gerçeğe dönüştürür. İşte başarıya giden yol haritan:
            </motion.p>

            <div className="relative">
                <div className="timeline-line"></div>
                <div className="flex flex-col space-y-24 items-center">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            initial="offscreen"
                            whileInView="onscreen"
                            // DEĞİŞİKLİK: Animasyonun sadece bir kez çalışması için once: true eklendi
                            viewport={{ once: true, amount: 0.5 }}
                            variants={cardVariants}
                            className={`step-card ${i === 1 ? "step-card--connect" : ""} relative`}
                        >
                            <div className="step-icon-wrapper relative mx-auto mb-6">{step.icon}</div>
                            <h3 className="step-title mb-2">
                                {step.title}
                            </h3>
                            <p className="step-description">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default HowItWorks;