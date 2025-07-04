// src/components/admin/AdminContentForm.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, updateDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

// Gerekli tüm araçları import ediyoruz
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';
// Yeni eklenen araçlar:
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';

const AdminContentForm = ({ type }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);
    const editorInstanceRef = useRef(null);

    const collectionName = type === 'event' ? 'events' : 'bulletins';
    const pageTitle = type === 'event' ? 'Etkinlik' : 'Bülten';
    const listPath = `/admin/${collectionName}`;
    
    // --- State Yönetimi ---
    const initialFormState = {
        title: '', slug: '', date: '', cardImage: '', description: '',
        content: { blocks: [] }, // İçerik her zaman tanımlı olsun
        ...(type === 'event' ? { organizer: '', location: '' } : { publisher: '' }),
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // Editörün sadece ilk veri yüklendiğinde başlatılması için ayrı state
    const [initialContent, setInitialContent] = useState(null);

    // --- KART RESMİ İÇİN STATE'LER ---
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    
    const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;

    // --- Veri Çekme Effect'i ---
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            if (slug) {
                setIsEditing(true);
                const q = query(collection(db, collectionName), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    setCurrentId(querySnapshot.docs[0].id);
                    setFormData({ ...initialFormState, ...docData });
                    setInitialContent(docData.content || { blocks: [] }); // Editör için başlangıç içeriğini ayarla
                } else { setError(`${pageTitle} bulunamadı.`); }
            } else {
                setIsEditing(false);
                setFormData(initialFormState);
                setInitialContent({ blocks: [] }); // Yeni içerik için boş ayarla
            }
            setLoading(false);
        };
        fetchContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, type, db, collectionName, initialFormState, pageTitle]);

    // --- EditorJS Başlatma ve Sonlandırma Effect'i ---
    useEffect(() => {
        if (initialContent === null) return; // Başlangıç verisi yoksa başlatma

        if (!editorInstanceRef.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Başlık Girin',
                            levels: [1, 2, 3, 4],
                            defaultLevel: 2
                        }
                    },
                    list: { 
                        class: List, 
                        inlineToolbar: true 
                    },
                    checklist: { 
                        class: Checklist, 
                        inlineToolbar: true 
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+O',
                        config: {
                            quotePlaceholder: 'Alıntı metnini girin',
                            captionPlaceholder: 'Alıntıyı yapanı girin',
                        },
                    },
                    table: {
                        class: Table,
                        inlineToolbar: true,
                        config: {
                            rows: 2,
                            cols: 3,
                        },
                    },
                    marker: {
                        class: Marker,
                        shortcut: 'CMD+SHIFT+M',
                    },
                    delimiter: Delimiter,
                    image: {
                        class: ImageTool,
                        config: { uploader: {
                            async uploadByFile(file) {
                                setImageUploadLoading(true);
                                const body = new FormData();
                                body.append('image', file);
                                try {
                                    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body });
                                    const result = await response.json();
                                    if (result.success) return { success: 1, file: { url: result.data.url } };
                                    throw new Error(result.error?.message || 'ImgBB Yüklemesi Başarısız');
                                } catch (err) { console.error("Görsel yükleme hatası:", err); return { success: 0 }; }
                                finally { setImageUploadLoading(false); }
                            }
                        } }
                    }
                },
                data: initialContent,
            });
            editorInstanceRef.current = editor;
        }

        return () => {
            if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialContent, IMGBB_API_KEY]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSlugChange = (e) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
        setFormData(prevState => ({ ...prevState, slug: value }));
    };

    const handleCardImageFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => { setImageSrc(reader.result); setShowCropper(true); };
            e.target.value = null;
        }
    };
    
    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels), []);
    
    const handleCardImageUpload = async () => {
        if (!croppedAreaPixels) return;
        setImageUploadLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const body = new FormData();
            body.append('image', croppedImageBlob, 'card-image.jpg');
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body });
            const result = await response.json();
            if (result.success) {
                setFormData(prevState => ({ ...prevState, cardImage: result.data.url }));
                setShowCropper(false); setImageSrc(null);
            } else { throw new Error(result.error?.message || 'Kart resmi yüklenemedi.'); }
        } catch (err) { setError(`Kart resmi hatası: ${err.message}`); } finally { setImageUploadLoading(false); }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!editorInstanceRef.current) {
            setError("Editör başlatılamadı. Lütfen sayfayı yenileyin.");
            return;
        }
        
        const content = await editorInstanceRef.current.save();
        if (!formData.title || !formData.slug || !formData.date || !formData.cardImage) {
            setError('Lütfen tüm zorunlu alanları (Başlık, Slug, Tarih, Kart Resmi) doldurun.');
            return;
        }

        const dataToSave = { ...formData, content, updatedAt: serverTimestamp() };

        try {
            if (isEditing) {
                const docRef = doc(db, collectionName, currentId);
                await updateDoc(docRef, dataToSave);
            } else {
                await addDoc(collection(db, collectionName), { ...dataToSave, createdAt: serverTimestamp() });
            }
            navigate(listPath);
        } catch (err) {
            setError(`Kaydedilirken hata oluştu: ${err.message}`);
            console.error(err);
        }
    };
    
    if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
    if (error) return <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>;

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-3xl font-bold text-nuper-dark-blue mb-6 border-b pb-4">{isEditing ? `${pageTitle} Düzenle` : `Yeni ${pageTitle} Ekle`}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                 {/* KART RESMİ YÜKLEME ALANI */}
                 <div className="p-4 border-2 border-dashed rounded-lg bg-white">
                    <label htmlFor="cardImageFile" className="block text-sm font-medium text-gray-700 mb-2">
                        Kart Resmi <span className="text-red-500">*</span>
                        <span className="block text-xs text-gray-500">Bu görsel, ana sayfa ve liste kartlarında görünecektir.</span>
                    </label>
                    <div className="flex items-center gap-4">
                        {formData.cardImage && (
                            <img src={formData.cardImage} alt="Mevcut Kart Resmi" className="w-24 h-24 object-cover rounded-md border" />
                        )}
                        <div className="flex-1">
                            <input type="file" id="cardImageFile" accept="image/*" onChange={handleCardImageFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue cursor-pointer"/>
                            <p className="text-xs text-gray-500 mt-1">Yeni bir resim seçerek mevcut resmi değiştirebilirsiniz.</p>
                        </div>
                    </div>
                </div>

                {/* Diğer Form Alanları */}
                <div><label htmlFor="title" className="block text-sm font-medium text-gray-700">Başlık <span className="text-red-500">*</span></label><input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nuper-blue focus:ring-nuper-blue" required /></div>
                <div><label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL (Slug) <span className="text-red-500">*</span></label><input type="text" name="slug" id="slug" value={formData.slug} onChange={handleSlugChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nuper-blue focus:ring-nuper-blue" required /><p className="text-xs text-gray-500 mt-1">Örn: "yeni-etkinlik-adi"</p></div>
                <div><label htmlFor="date" className="block text-sm font-medium text-gray-700">Tarih <span className="text-red-500">*</span></label><input type="text" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nuper-blue focus:ring-nuper-blue" required /><p className="text-xs text-gray-500 mt-1">Örn: "15 Ağustos 2024" veya "Ağustos 2024"</p></div>
                <div><label htmlFor="description" className="block text-sm font-medium text-gray-700">Kısa Açıklama (Kartlarda Görünecek)</label><textarea name="description" id="description" rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nuper-blue focus:ring-nuper-blue" /></div>
                
                {type === 'event' && (<>
                    <div><label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizatör</label><input type="text" name="organizer" id="organizer" value={formData.organizer || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nuper-blue focus:ring-nuper-blue" /></div>
                    <div><label htmlFor="location" className="block text-sm font-medium text-gray-700">Konum</label><input type="text" name="location" id="location" value={formData.location || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nuper-blue focus:ring-nuper-blue" /></div>
                </>)}
                
                {type === 'bulletin' && (<div><label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Yayınlayan</label><input type="text" name="publisher" id="publisher" value={formData.publisher || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nuper-blue focus:ring-nuper-blue" /></div>)}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                    <div id="editorjs" className="bg-white border rounded-md p-2 min-h-[400px]"></div>
                </div>
                
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate(listPath)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg">İptal</button>
                    <button type="submit" className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-6 rounded-lg" disabled={imageUploadLoading}>{imageUploadLoading ? 'Görsel Yükleniyor...' : (isEditing ? 'Güncelle' : 'Kaydet')}</button>
                </div>
            </form>

            {/* CROPPER MODAL */}
            {showCropper && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl flex flex-col">
                        <h3 className="text-xl font-bold text-nuper-blue mb-4">Kart Resmini Kırp</h3>
                        <div className="relative h-96 w-full bg-gray-200"><Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => { setShowCropper(false); setImageSrc(null); }} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">İptal</button>
                            <button type="button" onClick={handleCardImageUpload} className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg" disabled={imageUploadLoading}>{imageUploadLoading ? 'Yükleniyor...' : 'Kırp ve Kaydet'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContentForm;