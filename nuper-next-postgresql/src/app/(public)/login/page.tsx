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
                toast.success('Giriş başarılı!');
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
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-heading text-nuper-dark-blue">Giriş Yap</CardTitle>
            </CardHeader>
            <CardContent>
                {registered && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 border border-green-200 rounded text-sm">
                        Kayıt başarılı! Lütfen giriş yapın.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="ornek@email.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    <Button className="w-full bg-nuper-blue hover:bg-nuper-dark-blue" disabled={loading}>
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </Button>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Veya şununla devam et</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: '/' })}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google ile Giriş Yap
                    </Button>
                </div>
            </CardContent>
            <div className="p-6 pt-0 flex justify-center">
                <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-nuper-blue mr-4">
                    Şifremi Unuttum
                </Link>
                <p className="text-sm text-gray-600">
                    Hesabın yok mu? <Link href="/register" className="text-nuper-blue hover:underline">Kayıt Ol</Link>
                </p>
            </div>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
