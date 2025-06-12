// src/components/admin/AdminEventForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminEventForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const db = getFirestore(app);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    content: '',
    cardImage: '',
    mainImage: '',
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

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
      const fetchEvent = async () => {
        try {
          const q = query(collection(db, 'events'), where('slug', '==', slug));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            setCurrentEventId(querySnapshot.docs[0].id);
            setFormData(docData);
          } else {
            setError('Etkinlik bulunamadı. Yönlendiriliyorsunuz...');
            setTimeout(() => navigate('/admin/events'), 2000);
          }
        } catch (err) {
          console.error('Etkinlik çekilirken hata oluştu:', err);
          setError('Etkinlik yüklenirken bir hata oluştu: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
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
      setCroppedAreaPixels(null);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    if (croppedAreaPixels) {
      setCroppedAreaPixels(croppedAreaPixels);
    } else {
      setCroppedAreaPixels({ width: 100, height: 100, x: 0, y: 0 });
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
        throw new Error(`ImgBB yükleme hatası: ${errorData.error.message || response.statusText}`);
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
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', ACCEPTED_IMAGE_TYPES.join(','));
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert('Geçersiz dosya türü. Sadece JPG, PNG, GIF veya WEBP resimleri yükleyebilirsiniz.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        alert(`Resim boyutu çok büyük! Maksimum ${MAX_IMAGE_SIZE_MB} MB olmalı.`);
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
            throw new Error(`ImgBB yükleme hatası: ${errorData.error.message || response.statusText}`);
          }
          const result = await response.json();
          if (result.success && result.data && result.data.url) {
            const imageUrl = result.data.url;
            const newContent = `${formData.content}<p><img src="${imageUrl}" alt="Uploaded Image" /></p>`;
            setFormData((prevState) => ({
              ...prevState,
              content: newContent,
            }));
          } else {
            throw new Error('ImgBB yüklemesi başarısız oldu veya link bulunamadı.');
          }
        };
        reader.onerror = (err) => {
          throw new Error('Resmi okuma hatası: ' + err.message);
        };
      } catch (err) {
        console.error('Metin içi resim yüklenirken hata:', err);
        setError('Metin içi resim yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setImageUploadLoading(false);
      }
    };
  }, [formData.content]);

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
      setError('Lütfen Kart Resmi\'ni yükleyin ve kırpın.');
      setLoading(false);
      return;
    }
    if (!formData.mainImage) {
      setError('Lütfen Ana Resim\'i yükleyin ve kırpın.');
      setLoading(false);
      return;
    }
    if (!formData.content || formData.content === '<p><br></p>') {
      setError('Lütfen etkinlik içeriğini girin.');
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
          const q = query(collection(db, 'events'), where('slug', '==', currentSlug));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty || (isEditing && querySnapshot.docs[0].id === currentEventId)) {
            slugExists = false;
            finalSlug = currentSlug;
          } else {
            counter++;
          }
        }
      } else if (isEditing && formData.slug === '') {
        finalSlug = potentialSlug;
      } else if (isEditing && formData.slug === slug) {
        finalSlug = slug;
      }
      const dataToSave = {
        ...formData,
        slug: finalSlug,
        createdAt: isEditing && formData.createdAt ? formData.createdAt : new Date(),
        updatedAt: new Date(),
      };
      if (isEditing && currentEventId) {
        await updateDoc(doc(db, 'events', currentEventId), dataToSave);
        alert('Etkinlik başarıyla güncellendi!');
      } else {
        await addDoc(collection(db, 'events'), dataToSave);
        alert('Etkinlik başarıyla eklendi!');
      }
      navigate('/admin/events');
    } catch (err) {
      console.error('Etkinlik kaydedilirken hata oluştu:', err);
      setError('Etkinlik kaydedilirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center py-8 text-gray-700">Etkinlik bilgileri yükleniyor...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-nuper-blue mb-6">{isEditing ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}</h2>
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
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Konum</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="border p-4 rounded-md bg-gray-50">
          <label htmlFor="cardImageFile" className="block text-gray-700 text-sm font-bold mb-2">
            Kart Resmi Yükle ve Kırp (Maks. {MAX_IMAGE_SIZE_MB}MB, Oran: {IMAGE_ASPECT_RATIOS.card.toFixed(2)}:1 - Kare)
            <p className="text-xs text-gray-500 mt-1">Bu görsel, etkinlik kartlarında (listeleme sayfalarında) kullanılacaktır.</p>
          </label>
          <input
            type="file"
            id="cardImageFile"
            name="cardImageFile"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
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
              <p className="text-sm text-gray-600 mt-2 break-all">
                URL: <a href={formData.cardImage} target="_blank" rel="noopener noreferrer" className="text-nuper-blue hover:underline">
                  {formData.cardImage.length > 50 ? formData.cardImage.substring(0, 47) + '...' : formData.cardImage}
                </a>
              </p>
            </div>
          )}
        </div>
        <div className="border p-4 rounded-md bg-gray-50">
          <label htmlFor="mainImageFile" className="block text-gray-700 text-sm font-bold mb-2">
            Detay Sayfası Ana Resmi Yükle ve Kırp (Maks. {MAX_IMAGE_SIZE_MB}MB, Oran: {IMAGE_ASPECT_RATIOS.main.toFixed(2)}:1 - Yatay)
            <p className="text-xs text-gray-500 mt-1">Bu görsel, etkinliğin detay sayfasında 1920x1080 (16:9) sanal bir kutu içinde yer alacaktır. İçinde sığdırabilir veya ortalayabilirsiniz.</p>
          </label>
          <input
            type="file"
            id="mainImageFile"
            name="mainImageFile"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            onChange={(e) => handleFileChange(e, 'main')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue"
            disabled={imageUploadLoading}
          />
          {formData.mainImage && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-sm text-gray-700 mb-2">Mevcut Ana İçerik Resmi Önizlemesi (16:9 alanda):</p>
              <div className="relative w-full max-w-lg" style={{ paddingTop: `${1080 / 1920 * 100}%` }}>
                <img
                  src={formData.mainImage}
                  alt="Ana Resim Önizlemesi"
                  className="absolute inset-0 w-full h-full object-contain border border-gray-300 rounded-md shadow-sm bg-gray-200"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 break-all">
                URL: <a href={formData.mainImage} target="_blank" rel="noopener noreferrer" className="text-nuper-blue hover:underline">
                  {formData.mainImage.length > 50 ? formData.mainImage.substring(0, 47) + '...' : formData.mainImage}
                </a>
              </p>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">İçerik</label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            className="min-h-[200px] border border-gray-300 rounded-lg shadow-sm"
          />
          <button
            type="button"
            onClick={insertImage}
            className="mt-2 px-4 py-2 bg-nuper-blue text-white rounded-lg hover:bg-nuper-dark-blue"
            disabled={imageUploadLoading}
          >
            Görsel Ekle
          </button>
        </div>
        {showCropper && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl h-3/4 flex flex-col">
              <h3 className="text-xl font-bold text-nuper-blue mb-4">
                Resmi Kırp ({currentCropType === 'card' ? 'Kart Resmi' : 'Detay Sayfası Ana Resim'})
              </h3>
              <div className="relative flex-grow min-h-[300px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={IMAGE_ASPECT_RATIOS[currentCropType]}
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
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleCropAndUpload}
                  className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  disabled={imageUploadLoading || !croppedAreaPixels}
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
            placeholder="etkinlik-ornek"
          />
          <p className="text-xs text-gray-500 mt-1">Örn: "mayis-etkinligi". Otomatik oluşturulur ancak düzenlenebilir.</p>
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