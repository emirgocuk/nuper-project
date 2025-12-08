'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Editor from '@/components/editor/Editor';

export default function NewBulletinPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [publisher, setPublisher] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log({ title, slug, publisher });

        setTimeout(() => {
            setLoading(false);
            router.push('/admin/bulletins');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="mb-6 text-3xl font-bold font-heading">Yeni Bülten Ekle</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Bülten Detayları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Başlık</label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Bülten Başlığı"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                placeholder="bulten-basligi"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="publisher" className="text-sm font-medium">Yayınlayan</label>
                            <Input
                                id="publisher"
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                                required
                                placeholder="Yayıncı Adı"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium block">İçerik</label>
                            <div className="min-h-[400px]">
                                <Editor
                                    holder="bulletin-editor"
                                    onChange={(data) => console.log(data)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
