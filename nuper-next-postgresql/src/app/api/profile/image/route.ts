import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const image = formData.get('image') as File;
        const userId = formData.get('userId') as string;

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Convert to base64
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');

        // Upload to ImageBB
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', base64);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            {
                method: 'POST',
                body: imgbbFormData,
            }
        );

        const data = await response.json();

        if (data.success) {
            // Update user profile image in database
            await prisma.user.update({
                where: { id: userId },
                data: { profileImage: data.data.url },
            });

            return NextResponse.json({
                success: true,
                url: data.data.url,
            });
        } else {
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Profile image upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
