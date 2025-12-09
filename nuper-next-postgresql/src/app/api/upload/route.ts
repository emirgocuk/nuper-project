import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ success: 0, error: 'No file uploaded' }, { status: 400 });
        }

        // Convert File to base64
        const buffer = Buffer.from(await file.arrayBuffer());
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
            // Return EditorJS expected format
            return NextResponse.json({
                success: 1,
                file: {
                    url: data.data.url,
                },
            });
        } else {
            console.error('ImageBB upload failed:', data);
            return NextResponse.json({ success: 0, error: 'Upload failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: 0, error: 'Upload failed' }, { status: 500 });
    }
}
