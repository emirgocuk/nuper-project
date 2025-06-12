// src/components/admin/AdminEventForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
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
    organizer: '',
    description: '', // Yeni kısa açıklama alanı
    content: '',
    cardImage: '',
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

  const IMAGE_ASPECT_RATIOS = { card: 1 / 1 };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [ 'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image' ];
  
  const generateSlug = (title) => {
    if (!title) return '';
    return title.toString().toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  useEffect(() => {
    if (slug) {
      setIsEditing(true);
      setLoading(true);
      const fetchEvent = async () => {
        try {
          const q = query(collection(db, 'events'), where('slug', '==', slug));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const eventData = querySnapshot.docs[0].data();
            setCurrentEventId(querySnapshot.docs[0].id);
            setFormData(eventData);
          } else {
            setError('Etkinlik bulunamadı. Yönlendiriliyorsunuz...');
            setTimeout(() => navigate('/admin/events'), 2000);
          }
        } catch (err) {
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
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prevState) => ({ ...prevState, content }));
  };

  const handleFileChange = (e, type) => {
    setError(null);
    setCroppedAreaPixels(null);
    const file = e.target.files[0];
    if (file) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            setError(`Geçersiz dosya. Lütfen en fazla ${MAX_IMAGE_SIZE_MB}MB boyutunda bir resim dosyası seçin.`);
            e.target.value = null; return;
        }
        setCurrentCropType(type);
        const reader = new FileReader();
        reader.onload = () => { setImageSrc(reader.result); setShowCropper(true); };
        reader.readAsDataURL(file);
        e.target.value = null;
    }
  };

  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropAndUpload = async () => {
    if (!imageSrc || !croppedAreaPixels || croppedAreaPixels.width === 0) {
      setError('Geçersiz kırpma alanı. Lütfen tekrar deneyin.');
      return;
    }
    setImageUploadLoading(true);
    setError(null);
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formDataImgBB = new FormData();
      formDataImgBB.append('image', croppedImageBlob, 'cropped-image.jpg');

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formDataImgBB });
      if (!response.ok) throw new Error('ImgBB yüklemesi başarısız oldu.');
      
      const result = await response.json();
      if (result.success) {
        setFormData((prevState) => ({ ...prevState, [currentCropType + 'Image']: result.data.url }));
        setShowCropper(false);
        setImageSrc(null);
      } else {
        throw new Error('ImgBB hatası: ' + result.error.message);
      }
    } catch (err) {
      setError(`Resim işlemi hatası: ${err.message}`);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const insertImage = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', ACCEPTED_IMAGE_TYPES.join(','));
    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        setImageUploadLoading(true);
        try {
            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
            });
            const formDataImgBB = new FormData();
            formDataImgBB.append('image', base64Image);
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formDataImgBB });
            const result = await response.json();
            if (result.success) {
                const newContent = `${formData.content}<p><img src="${result.data.url}" alt="Uploaded Image" /></p>`;
                setFormData(prevState => ({ ...prevState, content: newContent }));
            } else { throw new Error('ImgBB hatası.'); }
        } catch (err) {
            setError('İçeriğe görsel eklenirken hata oluştu: ' + err.message);
        } finally {
            setImageUploadLoading(false);
        }
    };
    input.click();
  }, [formData.content, IMGBB_API_KEY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.title || !formData.cardImage || !formData.content) {
      setError('Başlık, Kart Resmi ve İçerik alanları zorunludur.');
      setLoading(false);
      return;
    }
    
    const finalSlug = generateSlug(formData.title);
    if (!finalSlug) {
      setError('URL oluşturmak için geçerli bir başlık girin.');
      setLoading(false);
      return;
    }

    try {
      const dataToSave = { ...formData, slug: finalSlug, updatedAt: serverTimestamp() };
      if (isEditing) {
        await updateDoc(doc(db, 'events', currentEventId), dataToSave);
        alert('Etkinlik başarıyla güncellendi!');
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, 'events'), dataToSave);
        alert('Etkinlik başarıyla eklendi!');
      }
      navigate('/admin/events');
    } catch (err) {
      setError('Etkinlik kaydedilirken hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-nuper-blue mb-6">{isEditing ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Başlık</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Tarih</label>
          <input type="text" id="date" name="date" value={formData.date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Örn: 10 Mayıs 2025" required />
        </div>
        <div>
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Konum</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
        </div>
        <div>
          <label htmlFor="organizer" className="block text-gray-700 text-sm font-bold mb-2">Organizatör</label>
          <input type="text" id="organizer" name="organizer" value={formData.organizer} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Örn: Nuper Kulübü" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Kısa Açıklama (Kartlarda Görünecek)</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Etkinliğin ana sayfada görünecek kısa özeti." />
        </div>
        <div className="border p-4 rounded-md bg-gray-50">
          <label htmlFor="cardImageFile" className="block text-gray-700 text-sm font-bold mb-2">Kart Resmi (Kare)</label>
          <input type="file" id="cardImageFile" accept="image/*" onChange={(e) => handleFileChange(e, 'card')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue" disabled={imageUploadLoading}/>
          {formData.cardImage && <div className="mt-4 flex flex-col items-center"><p className="text-sm text-gray-700 mb-2">Mevcut Kart Resmi:</p><img src={formData.cardImage} alt="Kart Resmi" className="max-w-xs max-h-48 object-contain border rounded-md" /></div>}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Detaylı İçerik</label>
          <ReactQuill value={formData.content} onChange={handleContentChange} modules={quillModules} formats={quillFormats} className="min-h-[200px]" />
          <button type="button" onClick={insertImage} className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm" disabled={imageUploadLoading}>İçeriğe Görsel Ekle</button>
        </div>
        {showCropper && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl h-3/4 flex flex-col">
              <h3 className="text-xl font-bold text-nuper-blue mb-4">Resmi Kırp</h3>
              <div className="relative flex-grow min-h-[300px]"><Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={IMAGE_ASPECT_RATIOS[currentCropType]} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowCropper(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">İptal</button>
                <button type="button" onClick={handleCropAndUpload} className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg" disabled={!croppedAreaPixels || imageUploadLoading}>{imageUploadLoading ? 'Yükleniyor...' : 'Kırp ve Yükle'}</button>
              </div>
            </div>
          </div>
        )}
        <div>
          <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">URL Slug</label>
          <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50" placeholder="etkinlik-basligi-buraya"/>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/admin/events')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg w-full">İptal</button>
          <button type="submit" className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg w-full" disabled={loading || imageUploadLoading}>{loading ? 'Kaydediliyor...' : (isEditing ? 'Değişiklikleri Kaydet' : 'Etkinliği Ekle')}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventForm;
