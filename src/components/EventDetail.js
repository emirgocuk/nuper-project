import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Firebase uygulamanızın yapılandırması

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
                console.log(`EventDetail: Fetching event with slug: "${slug}"`);

                const q = query(collection(db, "events"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    const data = { id: docSnap.id, ...docSnap.data() };
                    setEvent(data);
                } else {
                    console.log(`EventDetail: No event found with slug: "${slug}"`);
                    setError("Etkinlik bulunamadı.");
                }
            } catch (err) {
                console.error("EventDetail: Etkinlik çekilirken hata oluştu:", err);
                setError("Etkinlik yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
                console.log("EventDetail: Loading finished.");
            }
        };

        if (slug) {
            fetchEvent();
        } else {
            setLoading(false);
            setError("Geçersiz etkinlik URL'si.");
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

    if (!event) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Etkinlik detayı görüntülenemiyor.</p>
            </div>
        );
    }

    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md bulletin-detail-container"> {/* bulletin-detail-container sınıfı EventDetail için de aynı şekilde kullanılacak */}
                {/* Başlık */}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-4 leading-tight bulletin-title">
                    {event.title}
                </h1>

                {/* Tarih ve Yer */}
                <p className="text-gray-500 text-sm font-sans mb-8">
                    {event.date || (event.createdAt && new Date(event.createdAt.toDate()).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })) || 'Tarih Bilgisi Yok'}
                    {event.location && ` - ${event.location}`}
                </p>

                {/* Görsel Alanı - mainImage kullanıyoruz */}
                {event.mainImage && (
                    <div className="bulletin-image-wrapper">
                        <img
                            src={event.mainImage}
                            alt={event.title}
                            className="w-full h-auto max-h-96 object-cover object-position-top rounded-lg shadow-md mb-8 bulletin-main-image"
                        />
                    </div>
                )}

                {/* İçerik - Direkt HTML olarak gösteriyoruz */}
                {event.content && (
                    <div className="mb-8 text-gray-800 font-sans leading-relaxed ql-editor-display" dangerouslySetInnerHTML={{ __html: event.content }} />
                )}

                {/* Tüm Etkinliklere Geri Dön Linki */}
                <div className="text-center mt-12">
                    <Link to="/events" className="text-nuper-blue hover:underline font-semibold font-sans">
                        Tüm Etkinlikleri Görüntüle
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;