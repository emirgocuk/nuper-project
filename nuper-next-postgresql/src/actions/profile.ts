'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function saveProfileData(profileData: object) {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { profileData },
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Save profile data error:', error);
        throw new Error('Failed to save profile data');
    }
}

export async function saveSocialLinks(socialLinks: object) {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { socialLinks },
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Save social links error:', error);
        throw new Error('Failed to save social links');
    }
}

export async function removeProfilePhoto() {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { profileImage: null },
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Remove photo error:', error);
        throw new Error('Failed to remove photo');
    }
}
