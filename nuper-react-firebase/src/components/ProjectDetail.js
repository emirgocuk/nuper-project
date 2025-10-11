import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collectionGroup, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';
import DOMPurify from 'dompurify'; // Güvenlik için

// EventDetail'dan alınan ve içeriği render eden yardımcı fonksiyon
const renderBlock = (block) => {
    if (!block || !block.data) return null;
    // Gelen tüm HTML içeriğini DOMPurify ile temizliyoruz
    const sanitize = (html) => DOMPurify.sanitize(html);

    switch (block.type) {
        case 'header':
            const Tag = `h${block.data.level}`;
            return <Tag key={block.id} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
        case 'paragraph':
            return <p key={block.id} dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />;
        case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <ListTag key={block.id}>
                    {block.data.items.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: sanitize(item) }}></li>
                    ))}
                </ListTag>
            );
        case 'checklist':
            if (!block.data.items || !Array.isArray(block.data.items)) return null;
            return (
                <div key={block.id} className="pl-0 ml-0 checklist-container">
                    {block.data.items.map((item, index) => (
                        <div key={index} className="flex items-center my-1 not-prose">
                            <input type="checkbox" readOnly checked={item.checked} className="w-4 h-4 mr-3 rounded cursor-default form-checkbox text-nuper-blue focus:ring-0" />
                            <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-800'} dangerouslySetInnerHTML={{ __html: sanitize(item.text) }}></span>
                        </div>
                    ))}
                </div>
            );
        case 'image':
            // Resim URL'leri imgbb üzerinden gelecektir
            const imageClasses = block.data.stretched ? 'w-full' : 'max-w-2xl mx-auto';
            return (
                <figure key={block.id} className="my-6 not-prose">
                    <img src={block.data.file.url} alt={block.data.caption || 'Proje görseli'} className={`${imageClasses} max-w-full h-auto rounded-lg shadow-md`} />
                    {block.data.caption && <figcaption className="mt-2 text-sm text-center text-gray-500" dangerouslySetInnerHTML={{ __html: sanitize(block.data.caption) }}></figcaption>}
                </figure>
            );
        case 'quote':
            return (
                <blockquote key={block.id} className="pl-4 my-4 italic border-l-4 not-prose border-nuper-blue">
                    <p dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }}></p>
                    {block.data.caption && <footer className="mt-2 text-sm text-right" dangerouslySetInnerHTML={{ __html: sanitize(block.data.caption) }}></footer>}
                </blockquote>
            );
        case 'delimiter':
            return <hr key={block.id} className="my-8 border-gray-300" />;
        default: 
            return null;
    }
};


const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);
    const auth = getAuth(app); // Auth objesini de çekiyoruz

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetail = async () => {
            setLoading(true);
            setError(null);
            
            // Gerçek projede onaylanan projeler için ayrı bir collection (published_projects) kullanılmalıdır.
            // Bu örnekte, Collection Group Query veya Mock Data kullanıyoruz.
            
            try {
                // MOCK data (Sadece vitrin simülasyonu için)
                const mockProjects = [
                    { id: 'p1', projectName: 'Gezgin Otonom Robot', content: { blocks: [{ type: 'paragraph', data: { text: 'Depo yönetimini optimize eden yapay zeka destekli robot filosu fikridir. Girişimcilik potansiyeli yüksektir.' } }, { type: 'header', data: { text: 'Pazar Analizi Özeti', level: 3 } }, { type: 'list', data: { style: 'unordered', items: ['Lojistik sektörüne odaklanma', 'Yüksek otomasyon ihtiyacı', 'Düşük ilk yatırım maliyeti'] } }] }, ownerEmail: 'user1@mail.com', status: 'published', submittedAt: { toDate: () => new Date(2025, 8, 15) } },
                    { id: 'p2', projectName: 'Yol Boyunca Şarj Projesi', content: { blocks: [{ type: 'paragraph', data: { text: 'Elektrikli araçların menzil endişesini ortadan kaldıran, yol kenarına gömülü kablosuz şarj sistemi fikri.' } }, { type: 'quote', data: { text: 'Enerji geleceğin anahtarıdır.', caption: 'Fikir Sahibi' } }] }, ownerEmail: 'user2@mail.com', status: 'published', submittedAt: { toDate: () => new Date(2025, 9, 20) } },
                    { id: 'p3', projectName: 'Adaptif Eğitim Sistemi', content: { blocks: [{ type: 'paragraph', data: { text: 'Öğrencinin anlık performansına göre içerik akışını değiştiren kişisel öğrenme yolculuğu platformu.' } }] }, ownerEmail: 'user3@mail.com', status: 'published', submittedAt: { toDate: () => new Date(2025, 7, 10) } },
                ];
                
                const foundProject = mockProjects.find(p => p.id === projectId);

                if (foundProject) {
                    setProject(foundProject);
                } else {
                    setError("Proje bulunamadı.");
                }

            } catch (err) {
                console.error("Proje detayları çekilirken hata:", err);
                setError("Proje detayları yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, db]);


    if (loading) return <div className="pt-24 text-center">Yükleniyor...</div>;
    if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;
    if (!project) return <div className="pt-24 text-center">İstenen proje bulunamadı.</div>;
    
    // Proje içeriği bloklarını alıyoruz
    const contentBlocks = project.content?.blocks || [];

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
            <article className="p-8 mx-auto prose bg-white rounded-lg shadow-lg lg:prose-lg xl:prose-xl md:p-12">
                <div className="mb-4 not-prose">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-white rounded-full bg-nuper-blue">
                        GİRİŞİM PROJESİ
                    </span>
                </div>
                <h1 className="text-4xl font-heading text-nuper-blue">{project.projectName}</h1>
                
                <div className="flex items-start justify-between pb-4 my-6 border-b not-prose">
                    <div>
                        <p className="text-lg font-semibold text-gray-800">Fikir Sahibi: {project.ownerEmail}</p>
                        <p className="text-sm text-gray-500">Yayınlanma Tarihi: {project.submittedAt?.toDate().toLocaleDateString('tr-TR')}</p>
                    </div>
                    {/* Yatırımcı İletişim Butonu daha sonra eklenebilir */}
                </div>
                
                {/* Zengin İçerik Alanı */}
                {contentBlocks.length > 0 ? (
                    contentBlocks.map(block => renderBlock(block))
                ) : (
                    <p className="italic text-gray-500">Proje sahibi henüz detaylı tanıtım içeriği eklememiş.</p>
                )}

                <div className="mt-12 text-center not-prose">
                    <Link to="/projects" className="font-semibold text-nuper-blue hover:underline">
                        &larr; Tüm Proje Fırsatlarını Görüntüle
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default ProjectDetail;
