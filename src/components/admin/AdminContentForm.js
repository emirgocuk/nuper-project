// src/components/admin/AdminContentForm.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

// Gerekli tüm araçları import ediyoruz
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';

const AdminContentForm = ({ type }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);
    const editorInstanceRef = useRef(null);
    const isEditorInitialized = useRef(false);

    const collectionName = type === 'event' ? 'events' : 'bulletins';
    const pageTitle = type === 'event' ? 'Etkinlik' : 'Bülten';
    const listPath = `/admin/${collectionName}`;
    
    // --- State Yönetimi ---
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    
    // --- KART RESMİ İÇİN STATE'LER EKLENDİ ---
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    
    const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;

    // ... (EDITOR_JS_TOOLS ve diğer fonksiyonlar aynı) ...
    const EDITOR_JS_TOOLS = {
        header: { class: Header, inlineToolbar: true },
        list: { class: List, inlineToolbar: true },
        checklist: { class: Checklist, inlineToolbar: true },
        image: {
            class: ImageTool,
            config: {
                uploader: {
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
                }
            }
        }
    };
    
    useEffect(() => {
        // ... (useEffect içeriği aynı kalabilir) ...
    }, [slug, type]);
    
    // --- KART RESMİ FONKSİYONLARI ---
    const handleCardImageFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => { setImageSrc(reader.result); setShowCropper(true); };
            e.target.value = null;
        }
    };
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels), []);
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
        // ... (handleSubmit içeriği aynı kalabilir)
    };

    if (loading || !formData) return <div className="text-center py-8">Yükleniyor...</div>;
    if (error) return <p className="text-red-500 mb-4">{error}</p>;

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-3xl font-bold text-nuper-dark-blue mb-6 border-b pb-4">{isEditing ? `${pageTitle} Düzenle` : `Yeni ${pageTitle} Ekle`}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- KART RESMİ YÜKLEME ALANI --- */}
                <div className="p-4 border-2 border-dashed rounded-lg bg-white">
                    <label htmlFor="cardImageFile" className="block text-sm font-medium text-gray-700 mb-2">
                        Kart Resmi <span className="text-red-500">*</span>
                        <span className="block text-xs text-gray-500">Bu görsel, ana sayfa ve liste kartlarında görünecek.</span>
                    </label>
                    <div className="flex items-center gap-4">
                        {formData.cardImage && (
                            <img
                                src={formData.cardImage}
                                alt="Kart Resmi"
                                className="w-24 h-24 object-cover rounded-md border"
                            />
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                id="cardImageFile"
                                accept="image/*"
                                onChange={handleCardImageFileChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-nuper-blue file:text-white hover:file:bg-nuper-dark-blue"
                            />
                            <p className="text-xs text-gray-500 mt-1">Kare bir görsel seçmeniz önerilir.</p>
                        </div>
                    </div>
                </div>
                {/* ...existing code for other form fields... */}
            </form>
            {/* --- CROPPER MODAL --- */}
            {showCropper && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl flex flex-col">
                        <h3 className="text-xl font-bold text-nuper-blue mb-4">Kart Resmini Kırp</h3>
                        <div className="relative h-96"><Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setShowCropper(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">İptal</button>
                            <button type="button" onClick={handleCardImageUpload} className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-4 rounded-lg" disabled={imageUploadLoading}>{imageUploadLoading ? 'Yükleniyor...' : 'Kırp ve Yükle'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContentForm;