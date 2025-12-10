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

export async function submitVerification(data: {
    profileData: any;
    socialLinks: any[];
    presentation: any;
}) {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    try {
        // Merge presentation into verificationData (preserving existing if any, though likely null)
        // Actually, let's just save it.
        const verificationData = {
            presentation: data.presentation,
            submittedAt: new Date().toISOString(),
            status: 'PENDING'
        };

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                profileData: data.profileData,
                socialLinks: data.socialLinks,
                verificationData: verificationData,
                // Optionally set isVerified to false if it requires admin approval?
                // User said "dogrulama bekiyor" in screenshot implies pending.
                // But schema has boolean isVerified.
                // Let's assume validation happens offline/admin, so maybe don't toggle isVerified true yet.
                // Or maybe set it to false if they re-submit?
            },
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Submit verification error:', error);
        throw new Error('Failed to submit verification');
    }
}
