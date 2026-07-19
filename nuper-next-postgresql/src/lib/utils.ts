import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Doğru base URL'i döner.
 * Öncelik sırası: NEXTAUTH_URL → VERCEL_URL (otomatik) → localhost fallback
 */
export function getBaseUrl(): string {
    // 1. Explicit olarak set edilen URL (en güvenilir)
    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL.replace(/\/$/, '');
    }

    // 2. Vercel tarafından otomatik set edilen URL
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // 3. Geliştirme ortamı fallback
    return 'http://localhost:3000';
}
