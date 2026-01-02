'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

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

        // Create the user with isVerified: false
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
        const verificationToken = randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: verificationToken,
                expires: expiresAt
            }
        });

        // Construct verification link
        const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendVerificationEmail(email, name, verifyLink);

        console.log('Registration verification email sent', { email });

        return { success: true, message: 'User created. Check your email to verify.' };

    } catch (error) {
        console.error('Registration Error:', error);
        return { error: 'Kayıt sırasında bir hata oluştu.' };
    }
}
