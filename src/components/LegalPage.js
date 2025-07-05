import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { app } from '../firebaseConfig';

const LegalPage = () => {
    const { page } = useParams(); // 'terms', 'privacy', veya 'cookies'
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    // URL'deki sayfa adını hem Firestore belge kimliğine hem de okunabilir bir başlığa eşleştiriyoruz.
    const pageMap = {
        terms: {
            docId: 'terms_of_service',
            title: 'Kullanım Koşulları'
        },
        privacy: {
            docId: 'privacy_policy',
            title: 'Gizlilik Politikası'
        },
        cookies: {
            docId: 'cookie_policy',
            title: 'Çerez Politikası'
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const pageInfo = pageMap[page];

            if (!pageInfo) {
                setTitle('Sayfa Bulunamadı');
                setContent('Aradığınız yasal belge bulunamadı.');
                setLoading(false);
                return;
            }

            // Başlığı hemen haritadan ayarlıyoruz, böylece "Belge" yazısı hiç görünmüyor.
            setTitle(pageInfo.title);

            const db = getFirestore(app);
            const docRef = doc(db, 'legal_documents', pageInfo.docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Firestore'da özel bir başlık varsa onu kullan, yoksa haritadakini koru.
                setTitle(data.title || pageInfo.title);
                setContent(data.content || 'Bu belgenin içeriği henüz eklenmemiş.');
            } else {
                setContent('Bu belge henüz oluşturulmamış. Lütfen yönetici panelinden ekleyiniz.');
            }
            setLoading(false);
        };

        fetchContent();
    }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <div className="pt-32 text-center">Yükleniyor...</div>;
    }

    return (
        <div className="pt-32 pb-16 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <article className="prose lg:prose-xl">
                    {/* Başlık artık dinamik olarak doğru şekilde gösterilecek */}
                    <h1 className="font-heading">{title}</h1>
                    <ReactMarkdown children={content} />
                </article>
            </div>
        </div>
    );
};

export default LegalPage;
