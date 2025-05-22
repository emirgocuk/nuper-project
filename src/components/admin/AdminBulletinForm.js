import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage'; // Yardımcı fonksiyonu import ediyoruz
// import { toast } from 'react-toastify'; // Eğer toast kullanmak isterseniz

const AdminBulletinForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        publisher: '',
        content: '',
        cardImage: '', // Kartlar için resim URL'si
        mainImage: '', // Detay sayfası ve içerik için ana resim URL'si
        slug: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBulletinId, setCurrentBulletinId] = useState(null);

    // Kırpma ile ilgili state'ler
    const [imageSrc, setImageSrc] = useState(null); // Kırpılacak resmin orijinal base64/URL'si
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [currentCropType, setCurrentCropType] = useState(null); // 'card' veya 'main' hangi resmin kırpıldığı bilgisini tutar
    const [imageUploadLoading, setImageUploadLoading] = useState(false);

    // ImgBB API Anahtarınız
    const IMGBB_API_KEY = '8ab17bcf2c1347f94a929352547a29ba'; 

    // Maksimum resim boyutu (MB)
    const MAX_IMAGE_SIZE_MB = 5;
    const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Resim türlerine göre en-boy oranları
    const IMAGE_ASPECT_RATIOS = {
        card: 1 / 1, // Kartlar için kare (1:1)
        main: 16 / 9, // Detay sayfası için yatay (16:9)
    };

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
                        setError("Bülten bulunamadı. Yönlendiriliyorsunuz...");
                        setTimeout(() => navigate('/admin/bulletins'), 2000); // 2 saniye sonra yönlendir
                    }
                } catch (err) {
                    console.error("Bülten çekilirken hata oluştu:", err);
                    setError("Bülten yüklenirken bir hata oluştu: " + err.message);
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

    // Resim seçildiğinde ve kırpma arayüzünü aç
    const handleFileChange = (e, type) => {
        setError(null);
        const file = e.target.files[0];
        if (!file) {
            e.target.value = null;
            return;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setError("Geçersiz dosya türü. Sadece JPG, PNG, GIF veya WEBP resimleri yükleyebilirsiniz.");
            e.target.value = null;
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            setError(`Resim boyutu çok büyük! Maksimum ${MAX_IMAGE_SIZE_MB} MB olmalı.`);
            e.target.value = null;
            return;
        }

        setCurrentCropType(type); // Hangi resmin kırpıldığını kaydet
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result); // Base64 olarak resmi al
            setShowCropper(true); // Kırpma modalını göster
        };
        reader.readAsDataURL(file);
        e.target.value = null; // Inputu sıfırla
    };

    // Cropper üzerinde kırpma alanı değiştiğinde
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Kırpma ve ImgBB'ye yükleme
    const handleCropAndUpload = async () => {
        setImageUploadLoading(true);
        setError(null);
        try {
            if (!imageSrc || !croppedAreaPixels || !currentCropType) {
                throw new Error("Resim veya kırpma alanı seçilmedi veya türü belirlenmedi.");
            }

            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            
            if (!croppedImageBlob) {
                throw new Error("Kırpılmış resim oluşturulamadı.");
            }

            const reader = new FileReader();
            reader.readAsDataURL(croppedImageBlob);
            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1];

                const formDataImgBB = new FormData();
                formDataImgBB.append('image', base64Image);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formDataImgBB,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`ImgBB yükleme hatası: ${errorData.error.message || response.statusText}`);
                }

                const result = await response.json();
                if (result.success && result.data && result.data.url) {
                    setFormData(prevState => ({
                        ...prevState,
                        [currentCropType + 'Image']: result.data.url, // 'cardImage' veya 'mainImage' olarak kaydet
                    }));
                    alert(`${currentCropType === 'card' ? 'Kart Resmi' : 'Ana Resim'} başarıyla kırpıldı ve ImgBB'ye yüklendi!`);
                    // toast.success(`${currentCropType === 'card' ? 'Kart Resmi' : 'Ana Resim'} başarıyla yüklendi!`);
                    setShowCropper(false);
                    setImageSrc(null);
                    setCurrentCropType(null); // Temizle
                    setCrop({ x: 0, y: 0 }); // Kırpma pozisyonunu sıfırla
                    setZoom(1); // Zoom seviyesini sıfırla
                } else {
                    throw new Error('ImgBB yüklemesi başarısız oldu veya link bulunamadı.');
                }
            };
            reader.onerror = (err) => {
                throw new Error("Kırpılmış resmi okuma hatası: " + err.message);
            };

        } catch (err) {
            console.error("Resim kırpılırken veya yüklenirken hata oluştu:", err);
            setError("Resim işlemi sırasında bir hata oluştu: " + err.message);
            // toast.error("Resim işlemi sırasında bir hata oluştu: " + err.message);
        } finally {
            setImageUploadLoading(false);
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

        if (!formData.cardImage) {
            setError("Lütfen Kart Resmi'ni yükleyin ve kırpın.");
            setLoading(false);
            return;
        }
        if (!formData.mainImage) {
            setError("Lütfen Ana Resim'i yükleyin ve kırpın.");
            setLoading(false);
            return;
        }

        try {
            const potentialSlug = generateSlug(formData.title);
            let finalSlug = potentialSlug;

            // Slug çakışması kontrolü (sadece yeni ekleme yaparken veya slug değiştiğinde)
            if (!isEditing || (isEditing && formData.slug !== potentialSlug)) {
                let slugExists = true;
                let counter = 0;
                while (slugExists) {
                    const currentSlug = counter === 0 ? potentialSlug : `${potentialSlug}-${counter}`;
                    const q = query(collection(db, "bulletins"), where("slug", "==", currentSlug));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty || (isEditing && querySnapshot.docs[0].id === currentBulletinId)) {
                        slugExists = false;
                        finalSlug = currentSlug;
                    } else {
                        counter++;
                    }
                }
            }


            const dataToSave = {
                ...formData,
                slug: finalSlug,
                createdAt: isEditing && formData.createdAt ? formData.createdAt : new Date(),
                updatedAt: new Date()
            };
            // console.log("Firebase'e kaydedilecek veri:", dataToSave); // Production'da kaldırılmalı

            if (isEditing && currentBulletinId) {
                await updateDoc(doc(db, "bulletins", currentBulletinId), dataToSave);
                alert('Bülten başarıyla güncellendi!');
                // toast.success('Bülten başarıyla güncellendi!');
            } else {
                await addDoc(collection(db, "bulletins"), dataToSave);
                alert('Bülten başarıyla eklendi!');
                // toast.success('Bülten başarıyla eklendi!');
            }
            navigate('/admin/bulletins');
        } catch (err) {
            console.error("Bülten kaydedilirken hata oluştu:", err);
            setError("Bülten kaydedilirken bir hata oluştu: " + err.message);
            // toast.error("Bülten kaydedilirken bir hata oluştu: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="text-center py-8">
                <p>Bülten bilgileri yükleniyor...</p>
                {/* <div className="spinner"></div> */} {/* Basit bir spinner ekleyebilirsiniz */}
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-nuper-blue mb-6">
                {isEditing ? 'Bülten Düzenle' : 'Yeni Bülten Ekle'}
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                {/* Diğer form alanları (Başlık, Tarih, Yayınlayan, İçerik vb.) burada kalır */}
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

                {/* Kart Resmi Yükleme ve Kırpma Bölümü */}
                <div className="border p-4 rounded-md bg-gray-50">
                    <label htmlFor="cardImageFile" className="block text-gray-700 text-sm font-bold mb-2">
                        Kart Resmi Yükle ve Kırp (Maks. {MAX_IMAGE_SIZE_MB}MB, Oran: {IMAGE_ASPECT_RATIOS.card.toFixed(2)}:1 - Yaklaşık Kare)
                    </label>
                    <input
                        type="file"
                        id="cardImageFile"
                        name="cardImageFile"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')} // Kabul edilen dosya türleri
                        onChange={(e) => handleFileChange(e, 'card')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue"
                        disabled={imageUploadLoading}
                    />
                    {formData.cardImage && (
                        <div className="mt-4 flex flex-col items-center">
                            <p className="text-sm text-gray-700 mb-2">Mevcut Kart Resmi:</p>
                            <img 
                                src={formData.cardImage} 
                                alt="Kart Resmi Önizlemesi" 
                                className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-md shadow-sm" 
                            />
                            <p className="text-sm text-gray-600 mt-2 break-all">URL: <a href={formData.cardImage} target="_blank" rel="noopener noreferrer" className="text-nuper-blue hover:underline">{formData.cardImage.length > 50 ? formData.cardImage.substring(0, 47) + '...' : formData.cardImage}</a></p>
                        </div>
                    )}
                </div>

                {/* Ana İçerik Resmi Yükleme ve Kırpma Bölümü */}
                <div className="border p-4 rounded-md bg-gray-50">
                    <label htmlFor="mainImageFile" className="block text-gray-700 text-sm font-bold mb-2">
                        Ana İçerik Resmi Yükle ve Kırp (Maks. {MAX_IMAGE_SIZE_MB}MB, Oran: {IMAGE_ASPECT_RATIOS.main.toFixed(2)}:1 - Yatay)
                    </label>
                    <input
                        type="file"
                        id="mainImageFile"
                        name="mainImageFile"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')} // Kabul edilen dosya türleri
                        onChange={(e) => handleFileChange(e, 'main')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue"
                        disabled={imageUploadLoading}
                    />
                    {formData.mainImage && (
                        <div className="mt-4 flex flex-col items-center">
                            <p className="text-sm text-gray-700 mb-2">Mevcut Ana İçerik Resmi:</p>
                            <img 
                                src={formData.mainImage} 
                                alt="Ana Resim Önizlemesi" 
                                className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-md shadow-sm" 
                            />
                            <p className="text-sm text-gray-600 mt-2 break-all">URL: <a href={formData.mainImage} target="_blank" rel="noopener noreferrer" className="text-nuper-blue hover:underline">{formData.mainImage.length > 50 ? formData.mainImage.substring(0, 47) + '...' : formData.mainImage}</a></p>
                        </div>
                    )}
                </div>

                {/* Kırpma Arayüzü (Modal gibi) */}
                {showCropper && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl h-3/4 flex flex-col">
                            <h3 className="text-xl font-bold text-nuper-blue mb-4">
                                Resmi Kırp ({currentCropType === 'card' ? 'Kart Resmi' : 'Ana Resim'})
                            </h3>
                            <div className="relative flex-grow min-h-[300px]">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={IMAGE_ASPECT_RATIOS[currentCropType]} // Dinamik en-boy oranı
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    showGrid={true}
                                    restrictPosition={true}
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <label htmlFor="zoomRange" className="block text-gray-700 text-sm font-bold mb-2">Yakınlaştır/Uzaklaştır:</label>
                                <input
                                    type="range"
                                    id="zoomRange"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCropper(false);
                                        setImageSrc(null);
                                        setCurrentCropType(null);
                                        setError(null);
                                        setCrop({ x: 0, y: 0 }); // Kırpma pozisyonunu sıfırla
                                        setZoom(1); // Zoom seviyesini sıfırla
                                    }}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    İptal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCropAndUpload}
                                    className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                                    disabled={imageUploadLoading}
                                >
                                    {imageUploadLoading ? 'Yükleniyor...' : 'Resmi Kırp ve Yükle'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">URL Slug (Otomatik oluşturulur, düzenlenebilir)</label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="shadow appearance-appearance border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
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