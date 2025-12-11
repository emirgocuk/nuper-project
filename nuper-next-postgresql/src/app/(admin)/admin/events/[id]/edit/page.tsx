'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Editor from '@/components/editor/Editor';
import { updateEvent } from '@/actions/events';

interface EditEventPageProps {
    params: Promise<{ id: string }>;
}

export default function EditEventPage(props: EditEventPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<any>(null);
    const [event, setEvent] = useState<any>(null);
    const [id, setId] = useState<string>('');

    useEffect(() => {
        props.params.then(p => {
            setId(p.id);
            // Fetch event data
            fetch(`/api/events/${p.id}`)
                .then(res => res.json())
                .then(data => {
                    setEvent(data);
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
                .catch(err => console.error('Failed to fetch event:', err));
        });
    }, [props.params]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('content', JSON.stringify(content));

        try {
            await updateEvent(id, formData);
        } catch (error: any) {
            if (error.message === 'NEXT_REDIRECT' || error.digest === 'NEXT_REDIRECT') {
                return;
            }
            console.error(error);
            alert("Etkinlik güncellenirken bir hata oluştu.");
            setLoading(false);
        }
    };

    if (!event) {
        return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-heading">Etkinliği Düzenle</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Etkinlik Detayları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Başlık</label>
                            <Input
                                id="title"
                                name="title"
                                required
                                defaultValue={event.title}
                                placeholder="Etkinlik Başlığı"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                defaultValue={event.slug}
                                placeholder="etkinlik-basligi-2024"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="date" className="text-sm font-medium">Tarih</label>
                                <Input
                                    id="date"
                                    name="date"
                                    defaultValue={event.date || ''}
                                    placeholder="20 Ekim 2024"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="cardImage" className="text-sm font-medium">Kapak Resmi URL</label>
                                <Input
                                    id="cardImage"
                                    name="cardImage"
                                    defaultValue={event.cardImage || ''}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Kısa Açıklama</label>
                            <Input
                                id="description"
                                name="description"
                                required
                                defaultValue={event.description || ''}
                                placeholder="Etkinlik hakkında kısa bir özet..."
                            />
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-gray-50">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                name="isFeatured"
                                defaultChecked={event.isFeatured}
                                className="h-5 w-5 text-nuper-blue rounded border-gray-300 focus:ring-nuper-blue"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                Bu etkinliği Ana Sayfada "Öne Çıkan" olarak göster
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium block">İçerik</label>
                            <div className="min-h-[400px]">
                                <Editor
                                    holder="editorjs-container-edit"
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
