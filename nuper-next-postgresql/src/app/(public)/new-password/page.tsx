'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { resetPassword } from '@/actions/auth-reset';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';

function NewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!token) {
        return <div className="text-red-500 text-center">Geçersiz veya eksik token.</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor.');
            return;
        }

        if (password.length < 6) {
            toast.error('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword(token, password);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success('Şifreniz başarıyla güncellendi.');
                router.push('/login');
            }
        } catch (error) {
            toast.error('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Yeni Şifre Oluştur</CardTitle>
                <CardDescription>
                    Hesabınız için yeni bir şifre belirleyin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Yeni Şifre</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full bg-nuper-blue hover:bg-nuper-dark-blue" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Şifreyi Güncelle"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function NewPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <NewPasswordForm />
            </Suspense>
        </div>
    );
}
