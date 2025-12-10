'use server';

import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Return success to avoid email enumeration
            return { success: true };
        }

        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        // Delete existing tokens for this user (using email as identifier)
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        });

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires
            }
        });

        const resetLink = `${process.env.NEXTAUTH_URL}/new-password?token=${token}`;

        await resend.emails.send({
            from: "Nuper <onboarding@resend.dev>", // Or verified domain
            to: email,
            subject: "Şifre Sıfırlama İsteği",
            html: `
                <h2>Şifrenizi Sıfırlayın</h2>
                <p>Nuper hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
                <p>Aşağıdaki linke tıklayarak yeni şifrenizi oluşturabilirsiniz:</p>
                <a href="${resetLink}">Şifremi Sıfırla</a>
                <p>Bu linkin geçerlilik süresi 1 saattir.</p>
            `
        });

        return { success: true };

    } catch (error) {
        console.error("Reset email error:", error);
        return { error: "Bir hata oluştu." };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const existingToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        if (!existingToken) {
            return { error: "Geçersiz token." };
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: "Token süresi dolmuş." };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: existingToken.identifier }
        });

        if (!existingUser) {
            return { error: "Kullanıcı bulunamadı." };
        }

        const hashedPassword = await hash(newPassword, 10);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword }
        });

        await prisma.verificationToken.delete({
            where: { token }
        });

        return { success: true };

    } catch (error) {
        console.error("Reset password error:", error);
        return { error: "Şifre sıfırlanamadı." };
    }
}
