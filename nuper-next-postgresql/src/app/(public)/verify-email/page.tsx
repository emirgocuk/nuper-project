'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-nuper-blue" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Verification token not found');
                return;
            }

            try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus('success');
                    setMessage('Email verified successfully! Redirecting...');
                    setTimeout(() => router.push('/login'), 2000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed');
                }
            } catch (error) {
                console.error('Email verification error:', error);
                setStatus('error');
                setMessage('An error occurred during verification');
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg text-center p-6">
                <CardHeader>
                    <CardTitle className="flex flex-col items-center gap-4 text-2xl">
                        {status === 'loading' && 'Verifying...'}
                        {status === 'success' && 'Verification Successful!'}
                        {status === 'error' && 'Verification Error'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {status === 'loading' && (
                        <Loader2 className="h-12 w-12 animate-spin text-nuper-blue" />
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <p className="text-gray-600">✓ {message}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4">
                            <XCircle className="h-16 w-16 text-red-500" />
                            <p className="text-red-500">✗ {message}</p>
                            <Button asChild variant="outline" className="mt-4">
                                <Link href="/register">Back to Register</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
