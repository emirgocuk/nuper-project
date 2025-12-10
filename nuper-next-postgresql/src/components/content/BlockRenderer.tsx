import React from 'react';
import Image from 'next/image';

interface BlockRendererProps {
    content: any; // Can be string (JSON) or object
}

export default function BlockRenderer({ content }: BlockRendererProps) {
    if (!content) return null;

    let data;
    try {
        if (typeof content === 'string') {
            data = JSON.parse(content);
        } else {
            data = content;
        }
    } catch (e) {
        console.error("Failed to parse content:", e);
        return <div className="text-red-500">İçerik yüklenirken hata oluştu.</div>;
    }

    if (!data?.blocks || !Array.isArray(data.blocks)) {
        return null; // No blocks to render
    }

    return (
        <div className="prose prose-lg max-w-none text-gray-800">
            {data.blocks.map((block: any) => {
                switch (block.type) {
                    case 'header':
                        const Tag = `h${block.data.level}` as keyof React.JSX.IntrinsicElements;
                        return <Tag key={block.id} className="mt-8 mb-4 font-bold text-gray-900">{block.data.text}</Tag>;

                    case 'paragraph':
                        return (
                            <p
                                key={block.id}
                                className="mb-4 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: block.data.text }}
                            />
                        );

                    case 'list':
                        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                        return (
                            <ListTag key={block.id} className="mb-6 list-inside">
                                {block.data.items.map((item: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </ListTag>
                        );

                    case 'image':
                        return (
                            <div key={block.id} className="my-8 relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100">
                                {block.data.file?.url && (
                                    <Image
                                        src={block.data.file.url}
                                        alt={block.data.caption || "Görsel"}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                {block.data.caption && (
                                    <p className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</p>
                                )}
                            </div>
                        );

                    case 'quote':
                        return (
                            <blockquote key={block.id} className="my-6 border-l-4 border-nuper-blue pl-4 italic bg-gray-50 p-4 rounded-r-lg">
                                <p className="mb-2">{block.data.text}</p>
                                {block.data.caption && <footer className="text-sm font-semibold not-italic">- {block.data.caption}</footer>}
                            </blockquote>
                        );

                    default:
                        console.warn(`Unknown block type: ${block.type}`);
                        return null;
                }
            })}
        </div>
    );
}
