'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { sendPasswordResetEmail } from '@/actions/auth-reset';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await sendPasswordResetEmail(email);
            if (res.error) {
                toast.error(res.error);
            } else {
                setSubmitted(true);
                toast.success('Sıfırlama bağlantısı e-posta adresinize gönderildi.');
            }
        } catch (error) {
            toast.error('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>E-posta Gönderildi</CardTitle>
                        <CardDescription>
                            {email} adresine şifre sıfırlama talimatlarını içeren bir e-posta gönderdik.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link href="/login">
                            <Button variant="outline">Giriş Yap'a Dön</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Şifremi Unuttum</CardTitle>
                    <CardDescription>
                        Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-nuper-blue hover:bg-nuper-dark-blue" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sıfırlama Bağlantısı Gönder"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/login" className="text-sm text-gray-600 hover:text-nuper-blue hover:underline">
                        Giriş Yap'a Dön
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
