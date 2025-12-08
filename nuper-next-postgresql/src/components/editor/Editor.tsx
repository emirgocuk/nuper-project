'use client';

import { useEffect, useRef, useState } from 'react';

interface EditorProps {
    data?: any;
    onChange: (data: any) => void;
    holder: string;
}

export default function Editor({ data, onChange, holder }: EditorProps) {
    const editorRef = useRef<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const initEditor = async () => {
            if (editorRef.current) return;

            const EditorJS = (await import('@editorjs/editorjs')).default;
            const Header = (await import('@editorjs/header')).default;
            const List = (await import('@editorjs/list')).default;
            const Paragraph = (await import('@editorjs/paragraph')).default;
            const Quote = (await import('@editorjs/quote')).default;
            const Image = (await import('@editorjs/image')).default;
            const Embed = (await import('@editorjs/embed')).default;
            const LinkTool = (await import('@editorjs/link')).default;
            const Marker = (await import('@editorjs/marker')).default;

            const editor = new EditorJS({
                holder: holder,
                data: data,
                placeholder: 'İçeriğinizi buraya yazın...',
                inlineToolbar: true,
                tools: {
                    header: {
                        class: Header as any,
                        config: {
                            placeholder: 'Başlık',
                            levels: [2, 3, 4],
                            defaultLevel: 2
                        }
                    },
                    list: {
                        class: List as any,
                        inlineToolbar: true,
                    },
                    paragraph: {
                        class: Paragraph as any,
                        inlineToolbar: true,
                    },
                    image: {
                        class: Image as any,
                        config: {
                            // Configure backend endpoint for image upload or use simple URL
                            endpoints: {
                                // byFile: '/api/uploadFile', // Backend file uploader endpoint
                                // byUrl: '/api/fetchUrl', // Endpoint that provides uploading by Url
                            }
                        }
                    },
                    quote: {
                        class: Quote as any,
                        inlineToolbar: true,
                        config: {
                            quotePlaceholder: 'Alıntı metni',
                            captionPlaceholder: 'Alıntı sahibi',
                        },
                    },
                    embed: {
                        class: Embed as any,
                        config: {
                            services: {
                                youtube: true,
                                coub: true
                            }
                        }
                    },
                    marker: {
                        class: Marker as any,
                    },
                },
                onChange: async (api, event) => {
                    const content = await api.saver.save();
                    onChange(content);
                },
            });
            editorRef.current = editor;
        };

        initEditor();

        return () => {
            if (editorRef.current && typeof editorRef.current.destroy === 'function') {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [isMounted, holder]);

    if (!isMounted) {
        return <div className="p-4 border rounded-lg bg-gray-50 text-gray-400">Editör yükleniyor...</div>;
    }

    return (
        <div
            id={holder}
            className="prose max-w-none min-h-[400px] border border-gray-200 rounded-lg p-4 bg-white focus-within:ring-2 focus-within:ring-nuper-blue/20"
        />
    );
}
