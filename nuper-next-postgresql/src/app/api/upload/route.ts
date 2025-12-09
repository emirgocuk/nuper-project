import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ success: 0, error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replaceAll(" ", "_");
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            await fs.promises.mkdir(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: 1,
            file: {
                url: `/uploads/${filename}`,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: 0, error: 'Upload failed' }, { status: 500 });
    }
}
