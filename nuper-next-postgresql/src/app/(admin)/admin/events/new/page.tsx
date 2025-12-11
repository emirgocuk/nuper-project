'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Editor from '@/components/editor/Editor';

import { createEvent } from '@/actions/events';
import { useAdminSettings } from '@/context/AdminSettingsContext';

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<any>(null);
    const { isDevMode } = useAdminSettings();

    const fillTestData = () => {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const slugInput = document.getElementById('slug') as HTMLInputElement;
        const dateInput = document.getElementById('date') as HTMLInputElement;
        const cardImageInput = document.getElementById('cardImage') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;

        if (titleInput) titleInput.value = "Test Etkinlik " + new Date().toLocaleTimeString();
        if (slugInput) slugInput.value = "test-etkinlik-" + Date.now();
        if (dateInput) dateInput.value = "25 Aralık 2024";
        if (cardImageInput) cardImageInput.value = "https://picsum.photos/seed/" + (Date.now() + 1) + "/800/600";
        if (descriptionInput) descriptionInput.value = "Bu etkinlik test amaçlı otomatik oluşturulmuştur.";

        const dummyContent = {
            time: Date.now(),
            blocks: [
                {
                    id: "eh1-" + Date.now(),
                    type: "header",
                    data: {
                        text: "The standard Lorem Ipsum passage, used since the 1500s",
                        level: 3
                    }
                },
                {
                    id: "ep1-" + Date.now(),
                    type: "paragraph",
                    data: {
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    }
                },
                {
                    id: "eh2-" + Date.now(),
                    type: "header",
                    data: {
                        text: "Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC",
                        level: 3
                    }
                },
                {
                    id: "ep2-" + Date.now(),
                    type: "paragraph",
                    data: {
                        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                    }
                },
                {
                    id: "eh3-" + Date.now(),
                    type: "header",
                    data: {
                        text: "1914 translation by H. Rackham",
                        level: 4
                    }
                },
                {
                    id: "ep3-" + Date.now(),
                    type: "paragraph",
                    data: {
                        text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
                    }
                },
                {
                    id: "eh4-" + Date.now(),
                    type: "header",
                    data: {
                        text: "Section 1.10.33 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC",
                        level: 3
                    }
                },
                {
                    id: "ep4-" + Date.now(),
                    type: "paragraph",
                    data: {
                        text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                    }
                },
                {
                    id: "eh5-" + Date.now(),
                    type: "header",
                    data: {
                        text: "1914 translation by H. Rackham",
                        level: 4
                    }
                },
                {
                    id: "ep5-" + Date.now(),
                    type: "paragraph",
                    data: {
                        text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
                    }
                }
            ],
            version: "2.31.0"
        };
        setContent(dummyContent);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('content', JSON.stringify(content));
        formData.append('published', 'on');

        try {
            await createEvent(formData);
            // router.push('/admin/events'); // Removed creating manual push if server action redirects
        } catch (error: any) {
            if (error.message === 'NEXT_REDIRECT' || error.digest === 'NEXT_REDIRECT') {
                // Redirect is expected
                return;
            }
            console.error(error);
            alert("Etkinlik oluşturulurken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-heading">Yeni Etkinlik Ekle</h1>
                {isDevMode && (
                    <Button type="button" variant="secondary" onClick={fillTestData} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">
                        🛠 Test Verisi Doldur
                    </Button>
                )}
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
                                placeholder="Etkinlik Başlığı"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                placeholder="etkinlik-basligi-2024"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="date" className="text-sm font-medium">Tarih</label>
                                <Input
                                    id="date"
                                    name="date"
                                    placeholder="20 Ekim 2024"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="cardImage" className="text-sm font-medium">Kapak Resmi URL</label>
                                <Input
                                    id="cardImage"
                                    name="cardImage"
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
                                placeholder="Etkinlik hakkında kısa bir özet..."
                            />
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-gray-50">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                name="isFeatured"
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
                                    holder="editorjs-container"
                                    onChange={(data) => setContent(data)}
                                />
                                {content && isDevMode && <p className="text-xs text-green-600 mt-1">Test içeriği yüklendi (Editörde görünmeyebilir ama gönderilecek).</p>}
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
