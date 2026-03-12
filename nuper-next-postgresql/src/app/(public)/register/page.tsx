'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from '@/actions/register';
import { toast } from 'sonner';
import { Loader2, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'role' | 'details'>('role');
    const [role, setRole] = useState<'ENTREPRENEUR' | 'INVESTOR' | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleRoleSelect = (selectedRole: 'ENTREPRENEUR' | 'INVESTOR') => {
        setRole(selectedRole);
        setTimeout(() => setStep('details'), 300);
    };

    const checkPasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 6) strength += 1;
        if (pass.length >= 10) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
        setPasswordStrength(strength);
    };

    const getStrengthLabel = () => {
        if (passwordStrength === 0) return { label: '', color: 'bg-white/10' };
        if (passwordStrength <= 2) return { label: 'Zayıf', color: 'bg-red-500' };
        if (passwordStrength <= 3) return { label: 'Orta', color: 'bg-yellow-500' };
        return { label: 'Güçlü', color: 'bg-green-500' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        if (role) formData.append('userRole', role);

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (passwordStrength < 2) {
            toast.error('Şifreniz çok zayıf. Lütfen güvenliği artırın.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Girdiğiniz şifreler eşleşmiyor.');
            setLoading(false);
            return;
        }

        try {
            const result = await registerUser(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Elit Ağa başarıyla katıldınız! Lütfen e-postanızı doğrulayın.');
                router.push('/login?verification=sent');
            }
        } catch (err) {
            toast.error('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b1120] relative overflow-hidden py-12 px-4">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-2xl bg-glass border border-white/10 rounded-3xl shadow-2xl relative z-10 overflow-hidden">
                <div className="p-10 pb-6 text-center">
                    <h1 className="text-3xl font-bold font-heading text-white mb-3">
                        {step === 'role' ? 'Nuper Ekosistemine Adım At' : 'Hedefine Çok Yakınsın'}
                    </h1>
                    <p className="text-gray-400">
                        {step === 'role' 
                            ? 'Sana özel fırsatları sunabilmemiz için önce seni tanıyalım.' 
                            : 'Giriş bilgilerini doldurarak elit ağımızda yerini al.'}
                    </p>
                </div>

                <div className="p-10 pt-4 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {step === 'role' ? (
                            <motion.div
                                key="role-selection"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="grid md:grid-cols-2 gap-6 mt-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRoleSelect('ENTREPRENEUR')}
                                    className={cn(
                                        "cursor-pointer rounded-2xl border p-8 transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden",
                                        role === 'ENTREPRENEUR' 
                                            ? "border-blue-400 bg-blue-900/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                                            : "border-white/10 bg-white/5 hover:border-white/30"
                                    )}
                                >
                                    <div className={cn("p-5 rounded-full transition-colors", role === 'ENTREPRENEUR' ? "bg-blue-500/20 text-blue-300" : "bg-white/10 text-gray-400")}>
                                        <Lightbulb className="w-10 h-10" />
                                    </div>
                                    <div className="z-10">
                                        <h3 className="font-heading font-bold text-xl text-white mb-2">Girişimci / Üretici</h3>
                                        <p className="text-sm text-gray-400">Hayallerimi projelendirmek, ekip kurmak ve doğru yatırımcıyı bulmak istiyorum.</p>
                                    </div>
                                    {role === 'ENTREPRENEUR' && <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-blue-400" />}
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRoleSelect('INVESTOR')}
                                    className={cn(
                                        "cursor-pointer rounded-2xl border p-8 transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden",
                                        role === 'INVESTOR' 
                                            ? "border-emerald-400 bg-emerald-900/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                                            : "border-white/10 bg-white/5 hover:border-white/30"
                                    )}
                                >
                                    <div className={cn("p-5 rounded-full transition-colors", role === 'INVESTOR' ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-gray-400")}>
                                        <TrendingUp className="w-10 h-10" />
                                    </div>
                                    <div className="z-10">
                                        <h3 className="font-heading font-bold text-xl text-white mb-2">Yatırımcı</h3>
                                        <p className="text-sm text-gray-400">Parlak geleceğe sahip yeni nesil projelere öncelikle ve güvenle ulaşmak istiyorum.</p>
                                    </div>
                                    {role === 'INVESTOR' && <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-emerald-400" />}
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="details-form"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-300">Ad Soyad</Label>
                                        <Input id="name" name="name" type="text" required placeholder="Tam adınız" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500 rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-300">Email Adresi</Label>
                                        <Input id="email" name="email" type="email" required placeholder="ornek@email.com" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500 rounded-xl h-12" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-300">Şifre</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="bg-white/5 border-white/10 text-white focus:border-blue-500 rounded-xl h-12"
                                            onChange={(e) => checkPasswordStrength(e.target.value)}
                                        />
                                        
                                        {/* Security Bar */}
                                        <div className="pt-2">
                                            <div className="flex gap-1.5 h-1.5">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={cn(
                                                            "h-full flex-1 rounded-full transition-all duration-500",
                                                            level <= passwordStrength ? getStrengthLabel().color : "bg-white/10"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <p className={cn("text-xs mt-2 font-medium transition-colors", getStrengthLabel().color.replace('bg-', 'text-'))}>
                                                Güvenlik: {getStrengthLabel().label || 'Lütfen şifre girin'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-gray-300">Şifre Tekrar</Label>
                                        <Input id="confirmPassword" name="confirmPassword" type="password" required className="bg-white/5 border-white/10 text-white focus:border-blue-500 rounded-xl h-12" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row-reverse gap-4">
                                    <Button className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl text-lg font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)]" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Kaydı Tamamla'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:flex-1 border-white/10 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white h-12 rounded-xl"
                                        type="button"
                                        onClick={() => setStep('role')}
                                        disabled={loading}
                                    >
                                        Geri Dön
                                    </Button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="py-6 text-center bg-black/20 border-t border-white/5">
                    <p className="text-sm text-gray-400">
                        Zaten aramızda mısın? <Link href="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors ml-1">Giriş Yap</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
