'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Editor from '@/components/editor/Editor';
import { updateBulletin } from '@/actions/bulletins';

interface EditBulletinPageProps {
    params: Promise<{ id: string }>;
}

export default function EditBulletinPage(props: EditBulletinPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<any>(null);
    const [bulletin, setBulletin] = useState<any>(null);
    const [id, setId] = useState<string>('');

    useEffect(() => {
        props.params.then(p => {
            setId(p.id);
            // Fetch bulletin data
            fetch(`/api/bulletins/${p.id}`)
                .then(res => res.json())
                .then(data => {
                    setBulletin(data);
                    if (data.content) {
                        try {
                            const parsedContent = typeof data.content === 'string'
                                ? JSON.parse(data.content)
                                : data.content;
                            setContent(parsedContent);
                        } catch (e) {
                            console.error('Failed to parse content:', e);
                        }
                    }
                })
                .catch(err => console.error('Failed to fetch bulletin:', err));
        });
    }, [props.params]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('content', JSON.stringify(content));

        try {
            await updateBulletin(id, formData);
        } catch (error) {
            console.error(error);
            alert("Bülten güncellenirken bir hata oluştu.");
            setLoading(false);
        }
    };

    if (!bulletin) {
        return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-heading">Bülteni Düzenle</h1>
            </div>
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
                                name="title"
                                required
                                defaultValue={bulletin.title}
                                placeholder="Bülten Başlığı"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    required
                                    defaultValue={bulletin.slug}
                                    placeholder="bulten-basligi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="publisher" className="text-sm font-medium">Yayınlayan</label>
                                <Input
                                    id="publisher"
                                    name="publisher"
                                    required
                                    defaultValue={bulletin.publisher || ''}
                                    placeholder="Yayıncı Adı"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Kısa Açıklama</label>
                            <Input
                                id="description"
                                name="description"
                                required
                                defaultValue={bulletin.description || ''}
                                placeholder="Bülten hakkında kısa bir özet..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="cardImage" className="text-sm font-medium">Kapak Resmi URL</label>
                            <Input
                                id="cardImage"
                                name="cardImage"
                                defaultValue={bulletin.cardImage || ''}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium block">İçerik</label>
                            <div className="min-h-[400px]">
                                <Editor
                                    holder="bulletin-editor-edit"
                                    onChange={(data) => setContent(data)}
                                    initialData={content}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Güncelleniyor...' : 'Güncelle'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
