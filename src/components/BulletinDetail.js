import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Firebase uygulamanızın yapılandırması

const BulletinDetail = () => {
    const { slug } = useParams();
    const [bulletin, setBulletin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const db = getFirestore(app);

    useEffect(() => {
        const fetchBulletin = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log(`BulletinDetail: Fetching bulletin with slug: "${slug}"`);

                const q = query(collection(db, "bulletins"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    const data = { id: docSnap.id, ...docSnap.data() };
                    setBulletin(data);
                } else {
                    console.log(`BulletinDetail: No bulletin found with slug: "${slug}"`);
                    setError("Bülten bulunamadı.");
                }
            } catch (err) {
                console.error("BulletinDetail: Bülten çekilirken hata oluştu:", err);
                setError("Bülten yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
                console.log("BulletinDetail: Loading finished.");
            }
        };

        if (slug) {
            fetchBulletin();
        } else {
            setLoading(false);
            setError("Geçersiz bülten URL'si.");
        }
    }, [slug, db]);

    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-nuper-blue">Yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    if (!bulletin) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Bülten detayı görüntülenemiyor.</p>
            </div>
        );
    }

    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md bulletin-detail-container">
                {/* Başlık */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-4 leading-tight bulletin-title">
                    {bulletin.title}
                </h1>

                {/* Tarih ve Yayınlayan */}
                <p className="text-gray-500 text-sm font-sans mb-8">
                    {bulletin.date || (bulletin.createdAt && new Date(bulletin.createdAt.toDate()).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })) || 'Tarih Bilgisi Yok'}
                    {bulletin.publisher && ` - ${bulletin.publisher}`}
                </p>

                {/* Görsel Alanı - mainImage kullanıyoruz */}
                {bulletin.mainImage && (
                    <div className="bulletin-image-wrapper">
                        <img
                            src={bulletin.mainImage}
                            alt={bulletin.title}
                            className="w-full h-auto max-h-96 object-cover object-position-top rounded-lg shadow-md mb-8 bulletin-main-image"
                        />
                    </div>
                )}

                {/* İçerik - Direkt HTML olarak gösteriyoruz */}
                {bulletin.content && (
                    <div className="mb-8 text-gray-800 font-sans leading-relaxed ql-editor-display" dangerouslySetInnerHTML={{ __html: bulletin.content }} />
                )}

                {/* Tüm Bültenlere Geri Dön Linki */}
                <div className="text-center mt-12">
                    <Link to="/bulletins" className="text-nuper-blue hover:underline font-semibold font-sans">
                        Tüm Bültenleri Görüntüle
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BulletinDetail;