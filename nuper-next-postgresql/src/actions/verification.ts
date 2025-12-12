'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { sendAccountApprovedEmail } from '@/lib/mail';

export async function approveUser(userId: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const currentData = (user.verificationData as any) || {};

        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
                verificationData: {
                    ...currentData,
                    status: 'APPROVED',
                    approvedAt: new Date().toISOString()
                }
            }
        });

        if (user.email && user.name) {
            await sendAccountApprovedEmail(user.email, user.name);
        }

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Approve user error:', error);
        throw new Error('Failed to approve user');
    }
}

export async function rejectUser(userId: string, reason?: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const currentData = (user.verificationData as any) || {};

        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: false,
                verificationData: {
                    ...currentData,
                    status: 'REJECTED',
                    rejectedAt: new Date().toISOString(),
                    rejectionReason: reason || "Belirtilmedi"
                }
            }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Reject user error:', error);
        throw new Error('Failed to reject user');
    }
}

export async function cancelVerification(userId: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const currentData = (user.verificationData as any) || {};

        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: false,
                verificationData: {
                    ...currentData,
                    status: 'CANCELLED',
                    cancelledAt: new Date().toISOString()
                }
            }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Cancel verification error:', error);
        throw new Error('Failed to cancel verification');
    }
}

export async function addAdminUser(data: { email: string; name: string; password: string }) {
    const session = await auth(); // Need to import auth
    // Strict Super Admin Check
    if (session?.user?.email !== 'admin@nuper.com') {
        throw new Error('Unauthorized: Only Super Admin can add admins.');
    }

    try {
        const { hash } = await import('bcryptjs');
        const hashedPassword = await hash(data.password, 12);

        await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                role: 'ADMIN',
                isVerified: true
            }
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error('Add admin error:', error);
        throw new Error('Failed to add admin user');
    }
}

export async function deleteUser(userId: string) {
    const session = await auth();
    const currentUserEmail = session?.user?.email;

    try {
        const userToDelete = await prisma.user.findUnique({ where: { id: userId } });
        if (!userToDelete) throw new Error("User not found");

        // Safety: Prevent deleting self
        if (userToDelete.email === currentUserEmail) {
            throw new Error("You cannot delete your own account.");
        }

        // Safety: Only Super Admin can delete other Admins
        if (userToDelete.role === 'ADMIN' && currentUserEmail !== 'admin@nuper.com') {
            throw new Error("Unauthorized: Only Super Admin can delete admins.");
        }

        await prisma.user.delete({ where: { id: userId } });
        revalidatePath('/admin/users');
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        console.error('Delete user error:', error);
        throw new Error(error.message || 'Failed to delete user');
    }
}
