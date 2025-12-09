'use server';

import { prisma } from '@/lib/db';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export async function deleteUserAccount() {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    try {
        await prisma.user.delete({
            where: { email: session.user.email },
        });

        await signOut({ redirect: false });
        redirect('/');
    } catch (error) {
        console.error('Delete account error:', error);
        throw new Error('Failed to delete account');
    }
}
