// src/components/admin/AdminBulletinForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Bileşen adı AdminBulletinForm olarak değiştirildi
const AdminBulletinForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const db = getFirestore(app);

  // State isimleri "bülten"e uygun hale getirildi
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    publisher: '', // "location" yerine "publisher"
    content: '',
    cardImage: '',
    mainImage: '',
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBulletinId, setCurrentBulletinId] = useState(null); // currentEventId -> currentBulletinId

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [currentCropType, setCurrentCropType] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;
  const MAX_IMAGE_SIZE_MB = 5;
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const IMAGE_ASPECT_RATIOS = {
    card: 1 / 1,
    main: 16 / 9,
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
  ];

  useEffect(() => {
    if (slug) {
      setIsEditing(true);
      setLoading(true);
      const fetchBulletin = async () => {
        try {
          // Koleksiyon "bulletins" olarak değiştirildi
          const q = query(collection(db, 'bulletins'), where('slug', '==', slug));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            setCurrentBulletinId(querySnapshot.docs[0].id); // state adı güncellendi
            setFormData(docData);
          } else {
            setError('Bülten bulunamadı. Yönlendiriliyorsunuz...');
            setTimeout(() => navigate('/admin/bulletins'), 2000); // Yönlendirme yolu güncellendi
          }
        } catch (err) {
          console.error('Bülten çekilirken hata oluştu:', err);
          setError('Bülten yüklenirken bir hata oluştu: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBulletin();
    }
  }, [slug, db, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prevState) => ({
      ...prevState,
      content,
    }));
  };
  
  const handleFileChange = (e, type) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) {
      e.target.value = null;
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Geçersiz dosya türü. Sadece JPG, PNG, GIF veya WEBP resimleri yükleyebilirsiniz.');
      e.target.value = null;
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Resim boyutu çok büyük! Maksimum ${MAX_IMAGE_SIZE_MB} MB olmalı.`);
      e.target.value = null;
      return;
    }
    setCurrentCropType(type);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null); // Yeni dosya seçildiğinde kırpma alanı sıfırlanır
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const onCropComplete = useCallback((croppedArea, newCroppedAreaPixels) => {
    if (newCroppedAreaPixels && newCroppedAreaPixels.width > 0 && newCroppedAreaPixels.height > 0) {
      setCroppedAreaPixels(newCroppedAreaPixels);
    } else {
      setCroppedAreaPixels(null);
    }
  }, []);

  const handleCropAndUpload = async () => {
    setImageUploadLoading(true);
    setError(null);
    try {
      if (!imageSrc || !croppedAreaPixels) {
        throw new Error('Resim veya kırpma alanı seçilmedi.');
      }
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImageBlob) {
        throw new Error('Kırpılmış resim oluşturulamadı.');
      }
      const formDataImgBB = new FormData();
      formDataImgBB.append('image', croppedImageBlob, 'cropped-image.jpg');

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formDataImgBB,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ImgBB yükleme hatası: ${errorData.error?.message || response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success && result.data && result.data.url) {
        const imageUrl = result.data.url;
        setFormData((prevState) => ({
          ...prevState,
          [currentCropType + 'Image']: imageUrl,
        }));
        alert(`${currentCropType === 'card' ? 'Kart Resmi' : 'Ana Resim'} başarıyla kırpıldı ve ImgBB'ye yüklendi!`);
        setShowCropper(false);
        setImageSrc(null);
        setCurrentCropType(null);
      } else {
        throw new Error('ImgBB yüklemesi başarısız oldu veya link bulunamadı.');
      }
    } catch (err) {
      console.error('Resim kırpılırken veya yüklenirken hata oluştu:', err);
      setError('Resim işlemi sırasında bir hata oluştu: ' + err.message);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const insertImage = useCallback(async () => {
    if (!IMGBB_API_KEY) {
      setError('ImgBB API anahtarı eksik. Lütfen yapılandırmayı kontrol edin.');
      return;
    }
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', ACCEPTED_IMAGE_TYPES.join(','));
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Geçersiz dosya türü.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setError(`Resim boyutu çok büyük! Maksimum ${MAX_IMAGE_SIZE_MB} MB olmalı.`);
        return;
      }
      setImageUploadLoading(true);
      setError(null);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
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
            throw new Error(`ImgBB yükleme hatası: ${errorData.error?.message || response.statusText}`);
          }
          const result = await response.json();
          if (result.success && result.data && result.data.url) {
            const imageUrl = result.data.url;
            const newContent = `${formData.content}<p><img src="${imageUrl}" alt="Uploaded Image" style="max-width: 100%; height: auto;" /></p>`;
            setFormData((prevState) => ({ ...prevState, content: newContent }));
          } else {
            throw new Error('ImgBB yüklemesi başarısız oldu veya link bulunamadı.');
          }
        };
      } catch (err) {
        console.error('Metin içi resim yüklenirken hata:', err);
        setError('Metin içi resim yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setImageUploadLoading(false);
      }
    };
  }, [formData.content, IMGBB_API_KEY]);

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
    if (!formData.cardImage || !formData.mainImage) {
      setError('Lütfen Kart ve Ana Resim için görselleri yükleyip kırpın.');
      setLoading(false);
      return;
    }
    if (!formData.content || formData.content === '<p><br></p>') {
      setError('Lütfen bülten içeriğini girin.');
      setLoading(false);
      return;
    }
    try {
      const potentialSlug = generateSlug(formData.title);
      let finalSlug = formData.slug;
      if (!isEditing || (isEditing && formData.slug !== potentialSlug && slug !== potentialSlug)) {
        let slugExists = true;
        let counter = 0;
        while (slugExists) {
          const currentSlug = counter === 0 ? potentialSlug : `${potentialSlug}-${counter}`;
          const q = query(collection(db, 'bulletins'), where('slug', '==', currentSlug)); // Koleksiyon adı güncellendi
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty || (isEditing && querySnapshot.docs[0].id === currentBulletinId)) {
            slugExists = false;
            finalSlug = currentSlug;
          } else {
            counter++;
          }
        }
      } else if (isEditing && !formData.slug) {
        finalSlug = potentialSlug;
      }
      
      const dataToSave = {
        ...formData,
        slug: finalSlug,
        createdAt: isEditing && formData.createdAt ? formData.createdAt : new Date(),
        updatedAt: new Date(),
      };

      if (isEditing && currentBulletinId) {
        await updateDoc(doc(db, 'bulletins', currentBulletinId), dataToSave);
        alert('Bülten başarıyla güncellendi!');
      } else {
        await addDoc(collection(db, 'bulletins'), dataToSave);
        alert('Bülten başarıyla eklendi!');
      }
      navigate('/admin/bulletins');
    } catch (err) {
      console.error('Bülten kaydedilirken hata oluştu:', err);
      setError('Bülten kaydedilirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center py-8 text-gray-700">Bülten bilgileri yükleniyor...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-nuper-blue mb-6">{isEditing ? 'Bülten Düzenle' : 'Yeni Bülten Ekle'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Başlık</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Tarih</label>
          <input type="text" id="date" name="date" value={formData.date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Örn: 10 Mayıs 2025" required />
        </div>
        <div>
          <label htmlFor="publisher" className="block text-gray-700 text-sm font-bold mb-2">Yayınlayan</label>
          <input type="text" id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
        </div>
        
        {/* Resim Yükleme Alanları */}
        <div className="border p-4 rounded-md bg-gray-50">
          <label htmlFor="cardImageFile" className="block text-gray-700 text-sm font-bold mb-2">
            Kart Resmi (Kare)
          </label>
          <input type="file" onChange={(e) => handleFileChange(e, 'card')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue" disabled={imageUploadLoading}/>
          {formData.cardImage && <img src={formData.cardImage} alt="Kart Resmi Önizleme" className="mt-2 h-32 w-32 object-cover" />}
        </div>
        <div className="border p-4 rounded-md bg-gray-50">
          <label htmlFor="mainImageFile" className="block text-gray-700 text-sm font-bold mb-2">
            Ana Resim (16:9)
          </label>
          <input type="file" onChange={(e) => handleFileChange(e, 'main')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue" disabled={imageUploadLoading} />
          {formData.mainImage && <img src={formData.mainImage} alt="Ana Resim Önizleme" className="mt-2 h-32 w-auto object-contain" />}
        </div>
        
        {/* ReactQuill Editörü */}
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">İçerik</label>
          <ReactQuill value={formData.content} onChange={handleContentChange} modules={quillModules} formats={quillFormats} className="min-h-[200px]" />
          <button type="button" onClick={insertImage} className="mt-2 px-4 py-2 bg-nuper-blue text-white rounded-lg hover:bg-nuper-dark-blue" disabled={imageUploadLoading}>
            Görsel Ekle
          </button>
        </div>

        {/* Resim Kırpma Modalı */}
        {showCropper && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl h-3/4 flex flex-col">
              <h3 className="text-xl font-bold text-nuper-blue mb-4">Resmi Kırp</h3>
              <div className="relative flex-grow min-h-[300px]">
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={IMAGE_ASPECT_RATIOS[currentCropType]} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} showGrid={true} restrictPosition={true} />
              </div>
              <div className="flex flex-col mt-4">
                <label htmlFor="zoomRange" className="block text-gray-700 text-sm font-bold mb-2">Yakınlaştır/Uzaklaştır:</label>
                <input type="range" id="zoomRange" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setShowCropper(false); setImageSrc(null); }} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">İptal</button>
                <button type="button" onClick={handleCropAndUpload} className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg" disabled={imageUploadLoading || !croppedAreaPixels}>
                  {imageUploadLoading ? 'Yükleniyor...' : 'Kırp ve Yükle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slug ve Butonlar */}
        <div>
          <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">URL Slug</label>
          <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50" placeholder="bulten-ornek"/>
        </div>
        <button type="submit" className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded w-full" disabled={loading || imageUploadLoading}>
          {loading ? 'Kaydediliyor...' : (isEditing ? 'Değişiklikleri Kaydet' : 'Bülteni Ekle')}
        </button>
        <button type="button" onClick={() => navigate('/admin/bulletins')} className="mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full">
          İptal
        </button>
      </form>
    </div>
  );
};

export default AdminBulletinForm;