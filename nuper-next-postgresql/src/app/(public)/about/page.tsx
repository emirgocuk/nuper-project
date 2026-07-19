import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Target, Network } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#0b1120] text-white relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-4xl px-4 mx-auto relative z-10">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold font-heading text-white tracking-wide">NUPER INDUSTRIES</h1>
                    <p className="text-xl text-gray-400">Geleceğin teknolojilerini kendi Ar-Ge mutfağımızda tasarlıyor ve hayata geçiriyoruz.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-16">
                    <Card className="text-center bg-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                        <CardHeader>
                            <div className="mx-auto bg-blue-500/10 border border-blue-400/20 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mb-2 text-blue-300">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-xl text-white font-bold font-heading">Ar-Ge & İnovasyon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 text-sm leading-relaxed">Bilimsel yaklaşımlar ve teknik araştırmalar ile geleceğin konseptlerini kendi bünyemizde tasarlıyoruz.</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center bg-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                        <CardHeader>
                            <div className="mx-auto bg-emerald-500/10 border border-emerald-400/20 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mb-2 text-emerald-300">
                                <Target className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-xl text-white font-bold font-heading">Geliştirme & Üretim</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 text-sm leading-relaxed">Yazılım ve donanım prototiplerimizi, yüksek kullanılabilirlik sunan kararlı ve ölçeklenebilir ürünlere dönüştürüyoruz.</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center bg-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                        <CardHeader>
                            <div className="mx-auto bg-indigo-500/10 border border-indigo-400/20 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mb-2 text-indigo-300">
                                <Network className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-xl text-white font-bold font-heading">Stratejik İlişkiler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 text-sm leading-relaxed">Projelerimizi, arka planda yüz yüze yürüttüğümüz prestijli yatırımcı ve endüstriyel iş ortaklığı ağlarımızla buluşturuyoruz.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="prose max-w-none bg-glass border border-white/10 p-8 rounded-3xl backdrop-blur-md text-gray-300">
                    <h3 className="text-2xl font-bold font-heading text-white mb-4">Hikayemiz & Vizyonumuz</h3>
                    <p className="mb-4 leading-relaxed">
                        Nuper Industries, teknoloji dünyasındaki en radikal yenilikleri yakından takip eden ve bu yenilikleri derin mühendislik standartlarıyla işleyen özel bir inovasyon merkezidir. Kurulduğumuz günden bu yana, dış kaynaklı fikirler yerine tamamen kendi özgün fikir ve projelerimize odaklanarak yüksek katma değerli dijital varlıklar üretiyoruz.
                    </p>
                    <p className="leading-relaxed">
                        Bu platform, kendi mutfağımızda geliştirdiğimiz konsept tasarımları, Ar-Ge aşamasındaki fikirleri ve çalışan aktif projelerimizi sakladığımız dijital bir arşiv ve vitrin görevi görmektedir. Bunun yanı sıra, girişimcilik ve yatırımcılık ekosistemindeki stratejik buluşmaları ve network yönetimi hizmetlerini web sitesi üzerinden değil, arka planda yüz yüze ve özel kanallarımız aracılığıyla yürütmekteyiz.
                    </p>
                </div>
            </div>
        </div>
    );
}
