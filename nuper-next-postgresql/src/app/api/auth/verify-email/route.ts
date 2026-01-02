import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 400 }
            );
        }

        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({
                where: { token },
            });
            return NextResponse.json(
                { error: 'Token expired' },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { isVerified: true },
        });

        await prisma.verificationToken.delete({
            where: { token },
        });

        console.log('Email verified', { email: verificationToken.identifier });

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify email' },
            { status: 500 }
        );
    }
}
