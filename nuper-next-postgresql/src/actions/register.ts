'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/mail";

export async function registerUser(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('userRole') as string;

        if (!name || !email || !password || !role) {
            return { error: 'Tüm alanları doldurun.' };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'Bu email adresi zaten kayıtlı.' };
        }

        const hashedPassword = await hash(password, 10);

        // Create the user but with isVerified = false (default in schema but verifying here logic)
        // Schema default is false, so we rely on that.
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                userRole: role,
                isVerified: false,
            },
        });

        // Generate Verification Token
        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires
            }
        });

        // Send Verification Email
        const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

        await sendEmail({
            to: email,
            subject: "Hoş Geldiniz! Hesabınızı Doğrulayın",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #1e3a8a;">Nuper'a Hoş Geldiniz! 🎉</h1>
                    <p>Merhaba ${name},</p>
                    <p>Hesabınızı oluşturduk. Başlamadan önce lütfen e-posta adresinizi doğrulayın.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Hesabımı Doğrula</a>
                    </div>
                    <p>Bu linkin geçerlilik süresi 24 saattir.</p>
                </div>
            `
        });

        return { success: true };

    } catch (error) {
        console.error('Registration Error:', error);
        return { error: 'Kayıt sırasında bir hata oluştu.' };
    }
}
