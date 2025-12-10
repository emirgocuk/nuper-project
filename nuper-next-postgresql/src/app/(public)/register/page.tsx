'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from '@/actions/register';
import { toast } from 'sonner';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

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
                toast.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
                router.push('/login?registered=true');
            }

        } catch (err) {
            toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
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
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input id="name" name="name" type="text" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="ornek@email.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Kullanıcı Rolü *</Label>
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
                            <Label htmlFor="password">Şifre</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required />
                        </div>

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
