// src/components/admin/AdminBulletinForm.js
import React, { useState, useEffect } from 'react'; // <-- Burası düzeltildi!
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const AdminBulletinForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        publisher: '',
        content: '',
        image: '', // Resim URL'si için burası kullanılacak
        slug: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBulletinId, setCurrentBulletinId] = useState(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false); // Resim yükleme durumu için

    // Imgur Client ID'nizi buraya ekleyin
    // NOT: Client Secret'ı BURAYA EKLEMEYİN! SADECE CLIENT ID!
    const IMGUR_CLIENT_ID = 'c8504be46b33df2'; // <-- Buraya kendi Client ID'nizi yapıştırdınız

    useEffect(() => {
        if (slug) {
            setIsEditing(true);
            setLoading(true);
            const fetchBulletin = async () => {
                try {
                    const q = query(collection(db, "bulletins"), where("slug", "==", slug));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const docData = querySnapshot.docs[0].data();
                        setCurrentBulletinId(querySnapshot.docs[0].id);
                        setFormData(docData);
                    } else {
                        setError("Bülten bulunamadı.");
                        navigate('/admin/bulletins');
                    }
                } catch (err) {
                    console.error("Bülten çekilirken hata oluştu:", err);
                    setError("Bülten yüklenirken bir hata oluştu.");
                } finally {
                    setLoading(false);
                }
            };
            fetchBulletin();
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
                    image: result.data.link,
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

            if (isEditing && currentBulletinId) {
                await updateDoc(doc(db, "bulletins", currentBulletinId), dataToSave);
                alert('Bülten başarıyla güncellendi!');
            } else {
                await addDoc(collection(db, "bulletins"), dataToSave);
                alert('Bülten başarıyla eklendi!');
            }
            navigate('/admin/bulletins');
        } catch (err) {
            console.error("Bülten kaydedilirken hata oluştu:", err);
            setError("Bülten kaydedilirken bir hata oluştu: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return <div className="text-center py-8">Bülten bilgileri yükleniyor...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-nuper-blue mb-6">
                {isEditing ? 'Bülten Düzenle' : 'Yeni Bülten Ekle'}
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
                        placeholder="Örn: 10 Mayıs 2025"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="publisher" className="block text-gray-700 text-sm font-bold mb-2">Yayınlayan</label>
                    <input
                        type="text"
                        id="publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">İçerik</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="6"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    ></textarea>
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
                        disabled={imageUploadLoading}
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
                                readOnly={imageUploadLoading}
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
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                        placeholder="bulten-ornek"
                    />
                    <p className="text-xs text-gray-500 mt-1">Örn: "mayis-bulteni". Otomatik oluşturulur ancak düzenlenebilir.</p>
                </div>
                <button
                    type="submit"
                    className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                    disabled={loading || imageUploadLoading}
                >
                    {loading ? 'Kaydediliyor...' : (isEditing ? 'Değişiklikleri Kaydet' : 'Bülteni Ekle')}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/admin/bulletins')}
                    className="mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                >
                    İptal
                </button>
            </form>
        </div>
    );
};

export default AdminBulletinForm;