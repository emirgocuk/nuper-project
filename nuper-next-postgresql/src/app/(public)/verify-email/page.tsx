'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { verifyEmail } from '@/actions/auth-verify';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [loading, setLoading] = useState(true);

    const onSubmit = useCallback(async () => {
        if (success || error) return;

        if (!token) {
            setError("Token bulunamadı.");
            setLoading(false);
            return;
        }

        try {
            const data = await verifyEmail(token);
            if (data.success) {
                setSuccess(data.success);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg text-center p-6">
                <CardHeader>
                    <CardTitle className="flex flex-col items-center gap-4 text-2xl">
                        {loading && "Doğrulanıyor..."}
                        {!loading && success && "Hesap Doğrulandı!"}
                        {!loading && error && "Doğrulama Hatası"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {loading && (
                        <Loader2 className="h-12 w-12 animate-spin text-nuper-blue" />
                    )}

                    {!loading && success && (
                        <div className="flex flex-col items-center gap-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <p className="text-gray-600">{success}</p>
                            <Button asChild className="mt-4 bg-nuper-blue hover:bg-nuper-dark-blue">
                                <Link href="/login">Giriş Yap</Link>
                            </Button>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center gap-4">
                            <XCircle className="h-16 w-16 text-red-500" />
                            <p className="text-red-500">{error}</p>
                            <Button asChild variant="outline" className="mt-4">
                                <Link href="/login">Giriş Sayfasına Dön</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
