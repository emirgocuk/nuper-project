'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from '@/actions/register';
import { toast } from 'sonner';
import { Loader2, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'role' | 'details'>('role');
    const [role, setRole] = useState<'ENTREPRENEUR' | 'INVESTOR' | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleRoleSelect = (selectedRole: 'ENTREPRENEUR' | 'INVESTOR') => {
        setRole(selectedRole);
        setStep('details');
    };

    const checkPasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 6) strength += 1; // Base length
        if (pass.length >= 10) strength += 1; // Good length
        if (/[A-Z]/.test(pass)) strength += 1; // Uppercase
        if (/[0-9]/.test(pass)) strength += 1; // Number
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1; // Special char
        setPasswordStrength(strength);
    };

    const getStrengthLabel = () => {
        if (passwordStrength === 0) return { label: '', color: 'bg-gray-200' };
        if (passwordStrength <= 2) return { label: 'Zayıf', color: 'bg-red-500' };
        if (passwordStrength <= 3) return { label: 'Orta', color: 'bg-yellow-500' };
        return { label: 'Güçlü', color: 'bg-green-500' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        // Manually append role if it's not in the form (since we select it in step 1)
        if (role) formData.append('userRole', role);

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (passwordStrength < 2) {
            toast.error('Şifreniz çok zayıf. Daha güçlü bir şifre seçin.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor.');
            setLoading(false);
            return;
        }

        try {
            const result = await registerUser(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
                // Redirects to success page or login with a flag
                router.push('/login?verification=sent');
            }

        } catch (err) {
            toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <Card className="w-full max-w-2xl shadow-xl border-none overflow-hidden bg-white/80 backdrop-blur-sm">
                <div className="p-8 pb-0 text-center">
                    <CardTitle className="text-3xl font-bold font-heading text-nuper-dark-blue mb-2">
                        {step === 'role' ? 'Aramıza Hoş Geldiniz' : 'Son Bir Adım Kaldı'}
                    </CardTitle>
                    <p className="text-gray-500">
                        {step === 'role' ? 'Size en uygun deneyimi sunabilmemiz için sizi tanıyalım.' : 'Hesabınızı oluşturmak için bilgilerinizi girin.'}
                    </p>
                </div>

                <CardContent className="p-8">
                    {step === 'role' ? (
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <motion.div
                                whileHover={{ scale: 1.02, borderColor: '#3b82f6' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleSelect('ENTREPRENEUR')}
                                className={cn(
                                    "cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 flex flex-col items-center text-center gap-4 bg-white",
                                    role === 'ENTREPRENEUR' ? "border-nuper-blue bg-blue-50/50 shadow-md" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                )}
                            >
                                <div className={cn("p-4 rounded-full", role === 'ENTREPRENEUR' ? "bg-nuper-blue/10 text-nuper-blue" : "bg-gray-100 text-gray-500")}>
                                    <Lightbulb className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Girişimciyim</h3>
                                    <p className="text-sm text-gray-500 mt-2">Fikirlerimi hayata geçirmek, proje geliştirmek ve destek bulmak istiyorum.</p>
                                </div>
                                {role === 'ENTREPRENEUR' && <CheckCircle2 className="w-6 h-6 text-nuper-blue mt-auto" />}
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02, borderColor: '#10b981' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleSelect('INVESTOR')}
                                className={cn(
                                    "cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 flex flex-col items-center text-center gap-4 bg-white",
                                    role === 'INVESTOR' ? "border-emerald-500 bg-emerald-50/50 shadow-md" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                )}
                            >
                                <div className={cn("p-4 rounded-full", role === 'INVESTOR' ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500")}>
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Yatırımcıyım</h3>
                                    <p className="text-sm text-gray-500 mt-2">Geleceğin teknolojilerine ve parlak fikirlere yatırım yapmak istiyorum.</p>
                                </div>
                                {role === 'INVESTOR' && <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-auto" />}
                            </motion.div>
                        </div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ad Soyad</Label>
                                    <Input id="name" name="name" type="text" required placeholder="John Doe" className="bg-gray-50/50 border-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required placeholder="ornek@email.com" className="bg-gray-50/50 border-gray-200" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Şifre</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-gray-50/50 border-gray-200"
                                        onChange={(e) => checkPasswordStrength(e.target.value)}
                                    />
                                    {/* Password Strength Indicator */}
                                    <div className="flex gap-1 h-1.5 mt-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={cn(
                                                    "h-full flex-1 rounded-full transition-all duration-300",
                                                    level <= passwordStrength ? getStrengthLabel().color : "bg-gray-100"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className={cn("text-xs mt-1 font-medium transition-colors", getStrengthLabel().color.replace('bg-', 'text-'))}>
                                        {getStrengthLabel().label}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                                    <Input id="confirmPassword" name="confirmPassword" type="password" required className="bg-gray-50/50 border-gray-200" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button className="w-full bg-nuper-blue hover:bg-nuper-dark-blue h-12 text-lg font-medium shadow-lg shadow-blue-500/20" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Kaydı Tamamla'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full mt-2"
                                    type="button"
                                    onClick={() => setStep('role')}
                                    disabled={loading}
                                >
                                    Geri Dön
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </CardContent>

                <CardFooter className="justify-center py-6 bg-gray-50 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Zaten hesabın var mı? <Link href="/login" className="text-nuper-blue font-semibold hover:underline">Giriş Yap</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
