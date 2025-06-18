// src/components/EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const renderBlock = (block) => {
    // block veya block.data null ise hiçbir şey render etme
    if (!block || !block.data) return null;

    switch (block.type) {
        case 'header':
            const Tag = `h${block.data.level}`;
            return <Tag key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        
        case 'paragraph':
            return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        
        case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            // items dizisinin var olduğundan emin ol
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <ListTag key={block.id}>
                    {block.data.items.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))}
                </ListTag>
            );
        
        case 'checklist':
            // items dizisinin var olduğundan emin ol
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <div key={block.id} className="checklist-container ml-0 pl-0">
                    {block.data.items.map((item, index) => (
                        <div key={index} className="flex items-center not-prose my-1">
                            <input type="checkbox" readOnly checked={item.checked} className="form-checkbox h-4 w-4 text-nuper-blue rounded mr-3 focus:ring-0 cursor-default" />
                            <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-800'}>{item.text}</span>
                        </div>
                    ))}
                </div>
            );
            
        case 'image':
            const imageClasses = block.data.stretched 
                ? 'w-full' 
                : 'max-w-2xl mx-auto';
            
            return (
                <figure key={block.id} className="not-prose my-6">
                    <img src={block.data.file.url} alt={block.data.caption || 'İçerik görseli'} className={`${imageClasses} h-auto rounded-lg shadow-md`} />
                    {block.data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</figcaption>}
                </figure>
            );

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

    // --- Render öncesi kontrol ---
    if (loading) {
        return <div className="pt-24 text-center">Yükleniyor...</div>;
    }
    if (error) {
        return <div className="pt-24 text-center text-red-500">{error}</div>;
    }
    if (!event) {
        return <div className="pt-24 text-center">İstenen etkinlik bulunamadı.</div>;
    }
    // --- Kontrol sonu ---

    return (
        <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <article className="prose lg:prose-lg xl:prose-xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg">
                <div className="not-prose mb-4">
                    <span className="inline-block bg-nuper-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ETKİNLİK
                    </span>
                </div>
                <h1 className="text-nuper-blue">{event.title}</h1>
                <div className="lead text-gray-600">
                    <p><strong>Tarih:</strong> {event.date || 'Belirtilmemiş'}</p>
                    <p><strong>Konum:</strong> {event.location || 'Belirtilmemiş'}</p>
                    <p><strong>Organizatör:</strong> {event.organizer || 'Belirtilmemiş'}</p>
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