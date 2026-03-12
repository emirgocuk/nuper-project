'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Shield } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const res = await signIn('credentials', {
                email,
                password,
                isAdminLogin: "true",
                redirect: false,
            });

            if (res?.error) {
                toast.error(res.error || 'Yönetici girişi başarısız. Yetkinizi kontrol edin.');
            } else {
                toast.success('Yönetici girişi başarılı!');
                router.push('/admin');
                router.refresh();
            }
        } catch (err) {
            toast.error('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-glass border border-red-500/20 rounded-3xl shadow-2xl overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-transparent"></div>
            
            <div className="text-center mb-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold font-heading text-white">Yönetici Paneli</h1>
                <p className="text-gray-400 mt-2">Sadece yetkili personel içindir.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Yönetici E-postası</Label>
                    <Input id="email" name="email" type="email" required placeholder="admin@nuper.com" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Şifre</Label>
                    <Input id="password" name="password" type="password" required className="bg-white/5 border-white/10 text-white focus:border-red-500 focus:ring-red-500 rounded-xl h-12" />
                </div>

                <Button className="w-full h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.4)]" disabled={loading}>
                    {loading ? 'Yetkilendiriliyor...' : 'Yönetici Olarak Giriş Yap'}
                </Button>
            </form>
            
            <div className="mt-8 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">
                    &larr; Standart kullanıcı girişine dön
                </Link>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b1120] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none"></div>
            
            <Suspense fallback={<div className="text-red-300 text-center animate-pulse">Yükleniyor...</div>}>
                <div className="relative z-10 w-full flex justify-center p-4">
                    <AdminLoginForm />
                </div>
            </Suspense>
        </div>
    );
}
