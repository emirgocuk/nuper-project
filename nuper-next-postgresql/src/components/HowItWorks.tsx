'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles, Network, Rocket } from 'lucide-react';
import SharedStarfield from './SharedStarfield';

const steps = [
    {
        icon: <Sparkles className="w-8 h-8 text-blue-300" />,
        title: "1. Vizyonunu Paylaş",
        desc: "Geleceği şekillendirecek projenle ilk adımı at. Güvenli ekosistemimizde fikrin parlamaya başlasın."
    },
    {
        icon: <Network className="w-8 h-8 text-blue-300" />,
        title: "2. Doğru Ağlara Katıl",
        desc: "Nuper Match ile potansiyelin keşfedilsin. Mentorlar ve doğru yatırımcılarla eşleşerek hikayeni güçlendir."
    },
    {
        icon: <Rocket className="w-8 h-8 text-blue-300" />,
        title: "3. Zirveye Ulaş",
        desc: "Yatırım, strateji ve doğru adımlarla projen gerçeğe dönüşsün. İşte bu senin başarı hikayen."
    }
];

const cardVariants: Variants = {
    offscreen: { y: 100, opacity: 0, scale: 0.95 },
    onscreen: (custom: number) => ({
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 1,
            delay: custom * 0.2
        }
    })
};

const HowItWorks = () => (
    <section className="relative overflow-hidden bg-[#0b1120] py-24">
        <SharedStarfield />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.7 }}
                className="mb-20"
            >
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-blue-300 bg-blue-900/30 border border-blue-500/20 rounded-full">
                    Süreç Nasıl İşler?
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                    Fikirden Başarıya: <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-500">
                        3 Adımda Yatırım Yolculuğun
                    </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                    Nuper, parlak fikirleri sadece desteklemekle kalmaz; onları doğru ekosistem, yatırımcı ve stratejiyle buluşturarak hayalleri gerçeğe dönüştürür.
                </p>
            </motion.div>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent -translate-x-1/2 hidden md:block"></div>
                
                <div className="flex flex-col space-y-24 items-center">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={cardVariants}
                            className="bg-glass hover:bg-glass-hover w-full max-w-lg rounded-3xl p-8 md:p-10 relative group z-10"
                        >
                            {/* Animated Background Glow on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                            
                            <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-blue-900/50 border border-blue-500/30 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 -rotate-3 group-hover:rotate-0">
                                {step.icon}
                            </div>
                            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
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
