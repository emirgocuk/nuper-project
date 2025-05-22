// src/pages/EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'; // Gerekli importlar
import { app } from '../firebaseConfig';

const EventDetail = () => {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const db = getFirestore(app);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true); // Yükleme her fetch çağrıldığında başlasın
            setError(null);   // Hata durumunu temizle
            try {
                console.log(`EventDetail: Fetching event with slug: "${slug}"`); // Debug için

                const q = query(collection(db, "events"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    console.log("EventDetail: Event found:", docSnap.data()); // Debug için
                    setEvent({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log(`EventDetail: No event found with slug: "${slug}"`); // Debug için
                    setError("Etkinlik bulunamadı.");
                }
            } catch (err) {
                console.error("EventDetail: Etkinlik çekilirken hata oluştu:", err);
                setError("Etkinlik yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
                console.log("EventDetail: Loading finished."); // Debug için
            }
        };

        if (slug) { // Slug değeri varsa çekmeye çalış
            fetchEvent();
        } else {
            setLoading(false);
            setError("Geçersiz etkinlik URL'si.");
        }
    }, [slug, db]); // slug veya db değiştiğinde tekrar çalışır

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

    // KRİTİK KONTROL: event null ise, aşağıdaki render kısmına geçmemeliyiz
    if (!event) {
        // Bu durum, yükleme bittiğinde ve hata yokken bile etkinlik bulunamazsa oluşur.
        // Genellikle yukarıdaki `setError` ile yakalanır, ancak yine de bir fallback iyidir.
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Etkinlik detayı görüntülenemiyor.</p>
            </div>
        );
    }

    // Event verisi başarıyla çekildiğinde render edilecek kısım
    return (
        <div className="pt-16 bg-nuper-gray min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-nuper-blue mb-4 leading-tight">
                    {event.title}
                </h1>

                <p className="text-gray-500 text-sm font-sans mb-8">
                    {/* `date` alanı formdan elle giriliyor. `createdAt` ise Firestore Timestamp.
                        Her ikisi de yoksa 'Tarih Bilgisi Yok' gösteririz. */}
                    {event.date || (event.createdAt && new Date(event.createdAt.toDate()).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })) || 'Tarih Bilgisi Yok'}
                </p>

                {event.image && (
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8"
                    />
                )}

                {/* AdminEventForm'daki alan adlarına göre güncellendi */}
                {(event.description || event.additionalInfo) && (
                    <div className="mb-8 text-gray-800 font-sans leading-relaxed">
                        {event.description && (
                            <p className="text-lg mb-4 whitespace-pre-line">
                                {event.description}
                            </p>
                        )}
                        {event.additionalInfo && (
                            <p className="text-lg whitespace-pre-line">
                                {event.additionalInfo}
                            </p>
                        )}
                    </div>
                )}

                <div className="text-center mt-12">
                    {/* AdminEventForm'dan gelen diğer bilgiler */}
                    {event.organizer && <p className="text-lg text-gray-800 mb-2"><strong>Organizatör:</strong> {event.organizer}</p>}
                    {event.participants && <p className="text-lg text-gray-800 mb-4"><strong>Katılımcılar:</strong> {event.participants}</p>}
                    
                    <Link to="/events" className="text-nuper-blue hover:underline font-semibold font-sans">
                        Tüm Etkinlikleri Görüntüle
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;