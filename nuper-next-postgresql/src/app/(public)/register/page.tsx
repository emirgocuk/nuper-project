'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from '@/actions/register';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target as HTMLFormElement);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            setLoading(false);
            return;
        }

        try {
            const result = await registerUser(formData);

            if (result.error) {
                setError(result.error);
            } else {
                router.push('/login?registered=true');
            }

        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold font-heading text-nuper-dark-blue">Kayıt Ol</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ad Soyad</label>
                            <Input name="name" type="text" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input name="email" type="email" required placeholder="ornek@email.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kullanıcı Rolü *</label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userRole"
                                        value="INVESTOR"
                                        required
                                        className="w-4 h-4 text-nuper-blue focus:ring-nuper-blue"
                                    />
                                    <span className="text-sm">Yatırımcı</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userRole"
                                        value="ENTREPRENEUR"
                                        required
                                        className="w-4 h-4 text-nuper-blue focus:ring-nuper-blue"
                                    />
                                    <span className="text-sm">Girişimci</span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Şifre</label>
                            <Input name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Şifre Tekrar</label>
                            <Input name="confirmPassword" type="password" required />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button className="w-full bg-nuper-blue hover:bg-nuper-dark-blue" disabled={loading}>
                            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Zaten hesabın var mı? <Link href="/login" className="text-nuper-blue hover:underline">Giriş Yap</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
