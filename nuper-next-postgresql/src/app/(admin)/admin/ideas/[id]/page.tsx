'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data fetch since we don't have real IDs yet
export default function IdeaDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    // In real app: const idea = await prisma.idea.findUnique(...)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading">Fikir Detayı</h1>
                <Button variant="outline" onClick={() => router.back()}>Geri Dön</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fikir Başlığı: Test Fikir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Durum</p>
                            <p>Beklemede</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Gönderen</p>
                            <p>user@example.com</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">İçerik</p>
                        <div className="p-4 bg-gray-50 rounded-lg min-h-[200px]">
                            <p>Fikir içeriği burada görünecek (EditorJS JSON render).</p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                        <Button className="bg-green-600 hover:bg-green-700">Onayla</Button>
                        <Button variant="destructive">Reddet</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
