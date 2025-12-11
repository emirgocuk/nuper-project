'use server';

import { prisma } from "@/lib/db";

export async function verifyEmail(token: string) {
    try {
        const existingToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        if (!existingToken) {
            return { error: "Geçersiz veya süresi dolmuş token." };
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: "Token süresi dolmuş." };
        }

        const user = await prisma.user.findUnique({
            where: { email: existingToken.identifier }
        });

        if (!user) {
            return { error: "Kullanıcı bulunamadı." };
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                emailVerified: new Date()
            }
        });

        await prisma.verificationToken.delete({
            where: { token }
        });

        return { success: "Email başarıyla doğrulandı!" };

    } catch (error) {
        console.error("Verification error:", error);
        return { error: "Doğrulama sırasında bir hata oluştu." };
    }
}
