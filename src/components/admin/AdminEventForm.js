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

    // ImgBB API Anahtarınız buraya eklendi
    const IMGBB_API_KEY = '8ab17bcf2c1347f94a929352547a29ba'; 

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

    // Resim seçildiğinde otomatik ImgBB'ye yükleme
    const handleImageFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        setImageUploadLoading(true); 
        setError(null); 

        try {
            const formDataImgBB = new FormData();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1]; 
                formDataImgBB.append('image', base64Image); 

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formDataImgBB,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Resim yükleme hatası: ${errorData.error.message || response.statusText}`);
                }

                const result = await response.json();
                if (result.success && result.data && result.data.url) {
                    setFormData(prevState => ({
                        ...prevState,
                        image: result.data.url, 
                    }));
                    console.log("ImgBB'ye yüklenen ve forma eklenen link:", result.data.url);
                    alert('Resim ImgBB\'ye başarıyla yüklendi ve forma eklendi!');
                } else {
                    throw new Error('ImgBB yüklemesi başarısız oldu veya link bulunamadı.');
                }
                setImageUploadLoading(false); 
                e.target.value = null; 
            };

            reader.onerror = (err) => {
                console.error("Dosya okuma hatası:", err);
                setError("Dosya okuma sırasında bir hata oluştu.");
                setImageUploadLoading(false);
            };

            reader.readAsDataURL(file); 

        } catch (err) {
            console.error("ImgBB'ye resim yüklenirken hata oluştu:", err);
            setError("Resim yüklenirken bir hata oluştu: " + err.message);
            setImageUploadLoading(false); 
            e.target.value = null; 
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

        if (!formData.image) {
            setError("Lütfen bir resim yükleyin veya resim URL'si girin.");
            setLoading(false);
            return;
        }

        try {
            const finalSlug = isEditing && formData.slug ? formData.slug : generateSlug(formData.title);

            const dataToSave = {
                ...formData,
                slug: finalSlug,
                createdAt: isEditing ? formData.createdAt : new Date(),
                updatedAt: new Date()
            };
            console.log("Firebase'e kaydedilecek veri:", dataToSave); 

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

                {/* Resim Yükleme ve Manuel URL Girişi Bölümü */}
                <div className="border p-4 rounded-md bg-gray-50">
                    <label htmlFor="imageFile" className="block text-gray-700 text-sm font-bold mb-2">Resim Yükle (ImgBB'ye otomatik yükle)</label>
                    <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue"
                        disabled={imageUploadLoading}
                    />
                    {imageUploadLoading && <p className="text-nuper-blue text-sm mt-1">Resim yükleniyor...</p>}
                    
                    <p className="text-center text-gray-500 my-3">-- VEYA --</p>

                    <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Resim URL'si (Manuel Girin)</label>
                    <input
                        type="url" 
                        id="image" 
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="https://i.ibb.co/your-image.jpg"
                        disabled={imageUploadLoading} 
                    />
                    {formData.image && !imageUploadLoading && (
                        <p className="text-sm text-gray-600 mt-2">Mevcut Resim: <a href={formData.image} target="_blank" rel="noopener noreferrer" className="text-nuper-blue hover:underline">Görüntüle</a></p>
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
                    disabled={loading || imageUploadLoading} 
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