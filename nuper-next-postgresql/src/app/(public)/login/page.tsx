'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
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
                redirect: false,
            });

            if (res?.error) {
                toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
            } else {
                toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            toast.error('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-glass border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-heading text-white">Giriş Yap</h1>
                <p className="text-gray-400 mt-2">Nuper dünyasına tekrar hoş geldin</p>
            </div>
            
            {registered && (
                <div className="mb-6 p-4 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl text-sm backdrop-blur-sm">
                    Kayıt başarılı! Lütfen giriş yapın.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="ornek@email.com" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Şifre</Label>
                    <Input id="password" name="password" type="password" required className="bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12" />
                </div>

                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]" disabled={loading}>
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0f172a] px-3 py-1 rounded-full text-gray-400 border border-white/10">Veya</span>
                </div>
            </div>

            <Button variant="outline" className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white rounded-xl transition-colors" onClick={() => signIn('google', { callbackUrl: '/' })}>
                <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google ile Devam Et
            </Button>

            <div className="mt-8 text-center flex flex-col items-center gap-3">
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Şifremi Unuttum
                </Link>
                <p className="text-sm text-gray-400">
                    Hesabın yok mu? <Link href="/register" className="text-white hover:text-blue-300 font-medium transition-colors ml-1">Kayıt Ol</Link>
                </p>
                <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-400 mt-4 transition-colors">
                    Yönetici misin? (Admin Girişi)
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b1120] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
            
            <Suspense fallback={<div className="text-blue-300 text-center animate-pulse">Yükleniyor...</div>}>
                <div className="relative z-10 w-full flex justify-center p-4">
                    <LoginForm />
                </div>
            </Suspense>
        </div>
    );
}
