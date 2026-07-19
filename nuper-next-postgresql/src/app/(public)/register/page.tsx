'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b1120]">
            <div className="text-white text-center">
                <p className="text-lg animate-pulse">Yönlendiriliyorsunuz...</p>
            </div>
        </div>
    );
}
