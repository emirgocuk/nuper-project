// src/components/EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../firebaseConfig';

// GÜNCELLENMİŞ RENDERBLOCK FONKSİYONU
const renderBlock = (block) => {
    if (!block || !block.data) return null;

    switch (block.type) {
        case 'header':
            const Tag = `h${block.data.level}`;
            return <Tag key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'paragraph':
            return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <ListTag key={block.id}>
                    {block.data.items.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))}
                </ListTag>
            );
        case 'checklist':
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <div key={block.id} className="checklist-container ml-0 pl-0">
                    {block.data.items.map((item, index) => (
                        <div key={index} className="flex items-center not-prose my-1">
                            <input type="checkbox" readOnly checked={item.checked} className="form-checkbox h-4 w-4 text-nuper-blue rounded mr-3 focus:ring-0 cursor-default" />
                            <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-800'} dangerouslySetInnerHTML={{ __html: item.text }}></span>
                        </div>
                    ))}
                </div>
            );
        case 'image':
            const imageClasses = block.data.stretched ? 'w-full' : 'max-w-2xl mx-auto';
            return (
                <figure key={block.id} className="not-prose my-6">
                    <img src={block.data.file.url} alt={block.data.caption || 'İçerik görseli'} className={`${imageClasses} max-w-full h-auto rounded-lg shadow-md`} />
                    {block.data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</figcaption>}
                </figure>
            );
        case 'quote':
            return (
                <blockquote key={block.id} className="not-prose border-l-4 border-nuper-blue pl-4 italic my-4">
                    <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
                    {block.data.caption && <footer className="text-sm text-right mt-2">{block.data.caption}</footer>}
                </blockquote>
            );
        case 'table':
            if (!block.data.content || !Array.isArray(block.data.content)) return null;
            return (
                <div key={block.id} className="not-prose overflow-x-auto my-6">
                    <table className="min-w-full border border-gray-300">
                        <tbody>
                            {block.data.content.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-2 border-r" dangerouslySetInnerHTML={{ __html: cell }}></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case 'delimiter':
            return <hr key={block.id} className="my-8 border-gray-300" />;
        default: 
            return null;
    }
};

const EventDetail = () => {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            setError(null);
            try {
                const q = query(collection(db, "events"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setEvent(querySnapshot.docs[0].data());
                } else {
                    setError("Etkinlik bulunamadı.");
                }
            } catch (err) {
                console.error("Etkinlik çekilirken hata oluştu:", err);
                setError("Etkinlik yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchEvent();

    }, [slug, db]);

    if (loading) {
        return <div className="pt-24 text-center">Yükleniyor...</div>;
    }
    if (error) {
        return <div className="pt-24 text-center text-red-500">{error}</div>;
    }
    if (!event) {
        return <div className="pt-24 text-center">İstenen etkinlik bulunamadı.</div>;
    }

    return (
        <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <article className="prose lg:prose-lg xl:prose-xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg">
                <div className="not-prose mb-4">
                    <span className="inline-block bg-nuper-blue text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ETKİNLİK
                    </span>
                </div>
                <h1 className="font-heading text-4xl text-nuper-blue">{event.title}</h1>
                {/* --- YENİ VE BÜTÜNCÜL TASARIM --- */}
                <div className="not-prose flex justify-between items-start my-6">
                    {/* Sol taraf: Tarih ve Organizatör */}
                    <div>
                        <p className="text-lg font-semibold text-gray-800">{event.date || 'Tarih Belirtilmemiş'}</p>
                        <p className="text-sm text-gray-500">{event.organizer || 'Organizatör Belirtilmemiş'}</p>
                    </div>
                    {/* Sağ taraf: Konum */}
                    {event.location && (
                        <div className="flex items-center gap-2 text-teal-600 text-sm">
                            {/* text-sm eklendi */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{event.location}</span>
                        </div>
                    )}
                </div>
                <hr className="my-8" />
                {event.content && event.content.blocks ? (
                    event.content.blocks.map(block => renderBlock(block))
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: event.content }} />
                )}
                <div className="mt-12 text-center not-prose">
                    <Link to="/events" className="text-nuper-blue hover:underline font-semibold">
                        &larr; Tüm Etkinlikleri Görüntüle
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default EventDetail;