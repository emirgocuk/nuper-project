'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Editor from '@/components/editor/Editor';

export default function ProjectUploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreed) {
            alert("Lütfen yayınlama sözleşmesini kabul edin.");
            return;
        }

        setLoading(true);
        console.log("Projeyi gönder:", { title });

        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-4xl px-4 mx-auto">
                <h1 className="mb-8 text-3xl font-bold font-heading text-nuper-dark-blue">Proje Paylaş</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Projeni Dünyayla Paylaş</CardTitle>
                        <CardDescription>
                            Geliştirdiğin projeyi Nuper topluluğuna tanıtmak için aşağıdaki formu doldur.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">Proje Başlığı</label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Projenin adı nedir?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium block">Proje Detayları</label>
                                <div className="min-h-[400px]">
                                    <Editor
                                        holder="project-editor"
                                        onChange={(data) => console.log(data)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50/50">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-nuper-blue rounded border-gray-300 focus:ring-nuper-blue"
                                />
                                <label htmlFor="agreement" className="text-sm text-gray-600">
                                    <span className="font-semibold text-nuper-dark-blue">Nuper Proje Yayınlama Sözleşmesi</span>'ni okudum ve kabul ediyorum. Projemin özgün olduğunu ve telif haklarını ihlal etmediğini beyan ederim.
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" size="lg" className="bg-nuper-blue hover:bg-nuper-dark-blue" disabled={loading}>
                                    {loading ? 'Gönderiliyor...' : 'Projeyi Gönder'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
