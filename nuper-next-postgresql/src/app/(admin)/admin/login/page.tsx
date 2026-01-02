'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                isAdminLogin: 'true',
                redirect: false,
            });

            if (result?.error) {
                toast.error('Giriş başarısız. Yetkiniz yok veya bilgileriniz hatalı.');
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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),rgba(0,0,0,0))]" />
            
            <Card className="w-[400px] border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur-sm z-10">
                <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            <Shield className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                        Yönetim Paneli
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@nuper.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500 text-slate-200 placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500 text-slate-200"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                        >
                            {loading ? 'Giriş Yapılıyor...' : 'Yönetici Girişi'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
