// src/components/admin/AdminEventForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const AdminEventForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        organizer: '',
        description: '',
        additionalInfo: '',
        participants: '',
        image: '', // Resim URL'si için burası kullanılacak
        slug: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false); // Resim yükleme durumu için

    // Imgur Client ID'nizi buraya ekleyin
    // NOT: Client Secret'ı BURAYA EKLEMEYİN! SADECE CLIENT ID!
    const IMGUR_CLIENT_ID = 'c8504be46b33df2'; // <-- Buraya kendi Client ID'nizi yapıştırdınız

    useEffect(() => {
        if (slug) {
            setIsEditing(true);
            setLoading(true);
            const fetchEvent = async () => {
                try {
                    const q = query(collection(db, "events"), where("slug", "==", slug));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const docData = querySnapshot.docs[0].data();
                        setCurrentEventId(querySnapshot.docs[0].id);
                        setFormData(docData);
                    } else {
                        setError("Etkinlik bulunamadı.");
                        navigate('/admin/events');
                    }
                } catch (err) {
                    console.error("Etkinlik çekilirken hata oluştu:", err);
                    setError("Etkinlik yüklenirken bir hata oluştu.");
                } finally {
                    setLoading(false);
                }
            };
            fetchEvent();
        }
    }, [slug, db, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Resim seçildiğinde otomatik Imgur'a yükleme
    const handleImageFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageUploadLoading(true); // Yükleme başladı
        setError(null); // Önceki hataları temizle

        try {
            const formDataImgur = new FormData();
            formDataImgur.append('image', file);

            const response = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: `Client-ID ${IMGUR_CLIENT_ID}`, // Client ID kullanılıyor
                },
                body: formDataImgur,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Resim yükleme hatası: ${errorData.data.error || response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                setFormData(prevState => ({
                    ...prevState,
                    image: result.data.link, // Gelen Imgur linkini state'e ata
                }));
                alert('Resim Imgur\'a başarıyla yüklendi!');
            } else {
                throw new Error('Imgur yüklemesi başarısız oldu.');
            }
        } catch (err) {
            console.error("Imgur'a resim yüklenirken hata oluştu:", err);
            setError("Resim yüklenirken bir hata oluştu: " + err.message);
        } finally {
            setImageUploadLoading(false); // Yükleme bitti
        }
    };


    const generateSlug = (title) => {
        return title
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const finalSlug = isEditing && formData.slug ? formData.slug : generateSlug(formData.title);

            const dataToSave = {
                ...formData,
                slug: finalSlug,
                createdAt: isEditing ? formData.createdAt : new Date(),
                updatedAt: new Date()
            };

            if (isEditing && currentEventId) {
                await updateDoc(doc(db, "events", currentEventId), dataToSave);
                alert('Etkinlik başarıyla güncellendi!');
            } else {
                await addDoc(collection(db, "events"), dataToSave);
                alert('Etkinlik başarıyla eklendi!');
            }
            navigate('/admin/events');
        } catch (err) {
            console.error("Etkinlik kaydedilirken hata oluştu:", err);
            setError("Etkinlik kaydedilirken bir hata oluştu: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return <div className="text-center py-8">Etkinlik bilgileri yükleniyor...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-nuper-blue mb-6">
                {isEditing ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Başlık</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Tarih</label>
                    <input
                        type="text"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Örn: 30 Haziran 2025"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="organizer" className="block text-gray-700 text-sm font-bold mb-2">Organizatör</label>
                    <input
                        type="text"
                        id="organizer"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Açıklama</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="additionalInfo" className="block text-gray-700 text-sm font-bold mb-2">Ek Bilgiler (Opsiyonel)</label>
                    <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows="2"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="participants" className="block text-gray-700 text-sm font-bold mb-2">Kimler Katılabilir?</label>
                    <input
                        type="text"
                        id="participants"
                        name="participants"
                        value={formData.participants}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Örn: Lise ve üniversite öğrencileri"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="imageFile" className="block text-gray-700 text-sm font-bold mb-2">Resim Yükle</label>
                    <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        accept="image/*"
                        onChange={handleImageFileChange} // Yeni fonksiyonu çağırıyoruz
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue"
                        disabled={imageUploadLoading} // Yüklenirken devre dışı bırak
                    />
                    {imageUploadLoading && <p className="text-nuper-blue text-sm mt-1">Resim yükleniyor...</p>}
                    {formData.image && (
                        <div className="mt-2">
                             <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Resim URL'si (Otomatik Dolduruldu)</label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange} // Kullanıcı manuel de değiştirebilir
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                placeholder="https://example.com/resim.jpg"
                                readOnly={imageUploadLoading} // Yüklenirken salt okunur yap
                            />
                            <p className="text-sm text-gray-600 mt-2">Mevcut Resim: <a href={formData.image} target="_blank" rel="noopener noreferrer" className="text-nuper-blue hover:underline">Görüntüle</a></p>
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">URL Slug (Otomatik oluşturulur, düzenlenebilir)</label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="shadow appearance-appearance border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                        placeholder="slug-ornek"
                    />
                     <p className="text-xs text-gray-500 mt-1">Örn: "bilim-olimpiyatlari". Otomatik oluşturulur ancak düzenlenebilir.</p>
                </div>
                <button
                    type="submit"
                    className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                    disabled={loading || imageUploadLoading} // Resim yüklenirken de submit etmeyi engelle
                >
                    {loading ? 'Kaydediliyor...' : (isEditing ? 'Değişiklikleri Kaydet' : 'Etkinliği Ekle')}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/admin/events')}
                    className="mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                >
                    İptal
                </button>
            </form>
        </div>
    );
};

export default AdminEventForm;