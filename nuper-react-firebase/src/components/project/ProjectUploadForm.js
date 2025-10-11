import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

// EditorJS ve gerekli tool'ları import ediyoruz
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
// import Checklist from '@editorjs/checklist'; // KALDIRILDI: Nested Array riskini azaltmak için
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
// import Table from '@editorjs/table'; // KALDIRILDI: Nested Array riskini azaltmak için
import Marker from '@editorjs/marker';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import CodeTool from '@editorjs/code';
import Warning from '@editorjs/warning';
import RawTool from '@editorjs/raw';


const ProjectUploadForm = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;
    const editorInstanceRef = useRef(null); 

    // IMGBB API Key'in .env dosyasında REACT_APP_IMGBB_API_KEY olarak tanımlandığı varsayılır.
    const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;

    const [formData, setFormData] = useState({
        projectName: '',
        content: { blocks: [] }, 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalStatus, setOriginalStatus] = useState('');
    const [agreed, setAgreed] = useState(false);
    
    // EditorJS başlatma ve veri çekme
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProject = async () => {
            setLoading(true);
            let initialContent = { blocks: [] };
            
            if (projectId) {
                setIsEditMode(true);
                try {
                    const docRef = doc(db, "users", user.uid, "projects", projectId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        if (data.status !== 'revision_requested') {
                             setError('Bu projeyi şu anda düzenleyemezsiniz. Revizyon talep edilmeli.');
                             setLoading(false);
                             return;
                        }

                        setFormData({
                            projectName: data.projectName || '',
                            content: data.content || { blocks: [] },
                        });
                        setOriginalStatus(data.status);
                        initialContent = data.content || { blocks: [] };

                    } else {
                        setError("Düzenlenecek proje bulunamadı.");
                    }
                } catch (err) {
                    setError("Proje yüklenirken bir hata oluştu.");
                }
            } else {
                 setIsEditMode(false);
            }
            
            // EditorJS'i başlat
            if (!editorInstanceRef.current && user) {
                editorInstanceRef.current = new EditorJS({
                    holder: 'editorjs',
                    minHeight: 500,
                    placeholder: 'Proje tanıtımınızı, fikirlerinizi, iş planınızı burada oluşturun...',
                    tools: {
                        header: { class: Header, inlineToolbar: true, config: { placeholder: 'Başlık Girin', levels: [1, 2, 3, 4], defaultLevel: 2 }},
                        list: { class: List, inlineToolbar: true },
                        // checklist: { class: Checklist, inlineToolbar: true }, // KALDIRILDI
                        quote: { class: Quote, inlineToolbar: true },
                        // table: { class: Table, inlineToolbar: true }, // KALDIRILDI
                        marker: { class: Marker },
                        delimiter: Delimiter,
                        embed: { class: Embed, config: { services: { youtube: true, codepen: true, vimeo: true }}},
                        code: CodeTool,
                        warning: Warning,
                        raw: RawTool,
                         image: {
                            class: ImageTool,
                            config: { 
                                uploader: {
                                    async uploadByFile(file) {
                                        const body = new FormData();
                                        body.append('image', file);
                                        
                                        if (!IMGBB_API_KEY) {
                                            console.error("IMGBB API Key bulunamadı!");
                                            return { success: 0, message: "API Anahtarı eksik." };
                                        }

                                        try {
                                            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { 
                                                method: 'POST', 
                                                body 
                                            });
                                            const result = await response.json();
                                            
                                            if (result.success) {
                                                return {
                                                    success: 1,
                                                    file: {
                                                        url: result.data.url, 
                                                    }
                                                };
                                            }
                                            throw new Error(result.error?.message || 'Görsel Yüklemesi Başarısız');
                                        } catch (err) { 
                                            console.error("Görsel yükleme hatası:", err); 
                                            return { success: 0 }; 
                                        }
                                    }
                                }
                            }
                        }
                    },
                    data: initialContent,
                });
            }

            setLoading(false);
        };
        fetchProject();

        return () => {
            // EditorJS instance'ını temizle
            if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, projectId, db, navigate]); 
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!agreed) {
            setError('Devam etmek için yasal koşulları kabul etmelisiniz.');
            return;
        }

        setError('');
        setLoading(true);
        
        const contentData = await editorInstanceRef.current.save();
        
        // Firestore Nested Array hatası almamak için temizlik yapılabilir (opsiyonel)
        // Ancak tablo ve checklist kaldırıldığı için bu risk minimize edilmiştir.
        
        if (!formData.projectName || contentData.blocks.length === 0) {
            setError('Lütfen Proje Adını girin ve Proje İçeriğini (en az bir blok) doldurun.');
            setLoading(false);
            return;
        }
        
        const projectData = {
            ownerEmail: user.email,
            projectName: formData.projectName,
            content: contentData, // Zengin içerik bloğu
        };

        try {
            if (isEditMode) {
                const docRef = doc(db, "users", user.uid, "projects", projectId);
                await updateDoc(docRef, {
                    ...projectData,
                    status: 'submitted', 
                    'adminNotes.isNew': false, 
                    lastRevisionDate: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                alert('Projeniz revize edildi ve başarıyla tekrar incelemeye gönderildi!');
            } else {
                const projectsCollectionRef = collection(db, "users", user.uid, "projects");
                await addDoc(projectsCollectionRef, {
                    ...projectData,
                    status: 'submitted',
                    submittedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                alert('Projeniz başarıyla yüklendi ve incelemeye gönderildi!');
            }
            navigate('/dashboard'); 
        } catch (err) {
            console.error("Proje yüklenirken/güncellenirken hata:", err);
            setError(`Hata oluştu: ${err.message}. Lütfen içeriğinizdeki karmaşık listeleri kontrol edin.`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="pt-32 text-center">Proje yükleniyor...</div>;
    
    if (isEditMode && originalStatus !== 'revision_requested' && !loading) {
         return <div className="pt-32 text-center text-red-600">Bu projeyi düzenleme yetkiniz bulunmamaktadır. Mevcut durumu: {originalStatus}.</div>;
    }

    return (
        <div className="min-h-screen pt-32 pb-16 bg-nuper-gray">
            <div className="max-w-xl px-4 mx-auto">
                <h1 className="mb-6 text-3xl font-bold font-heading text-nuper-dark-blue">
                    {isEditMode ? 'Proje Revizyonu ve Tekrar Gönderim' : 'Yeni Proje Yükle'}
                </h1>
                
                {isEditMode && (
                    <div className="p-4 mb-4 text-orange-700 bg-orange-100 border-l-4 border-orange-500">
                        <p className="font-bold">Revizyon Modu Aktif:</p>
                        <p>Hakem notlarını inceleyin, gerekli düzenlemeleri yapın ve tekrar gönderin.</p>
                    </div>
                )}
                
                <div className="p-8 bg-white shadow-lg rounded-xl">
                    {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Proje Adı */}
                        <div>
                            <label htmlFor="projectName" className="block mb-1 text-sm font-medium text-gray-700">Proje Adı <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="projectName"
                                name="projectName"
                                className="form-input-std"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Zengin Proje İçeriği */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Proje İçeriği (Tanıtım)</label>
                            <div id="editorjs" className="bg-white border rounded-md p-2 min-h-[500px] editor-container"></div>
                        </div>

                        <div className="p-4 bg-gray-100 rounded-lg">
                            <h3 className="font-semibold text-gray-800">Yasal Bilgilendirme ve Onay</h3>
                            <p className="mt-2 text-xs text-gray-600">
                                Projenizi göndererek, fikrinizin platformumuzdaki kayıtlı yatırımcılarla paylaşılabileceğini kabul etmiş olursunuz. Platformumuz, fikirlerinizin gizliliğini korumak için yatırımcılardan Gizlilik Sözleşmesi (NDA) onayı alır ancak fikirlerinizin tam hukuki koruması için patent veya marka tescili gibi adımları atmanız sizin sorumluluğunuzdadır.
                            </p>
                            <div className="mt-4">
                                <label className="flex items-center">
                                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 rounded text-nuper-blue" />
                                    <span className="ml-2 text-sm text-gray-700">Okudum, anladım ve kabul ediyorum. <span className="text-red-500">*</span></span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 font-bold text-white transition-colors duration-200 rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue disabled:bg-gray-400"
                        >
                            {loading 
                                ? 'İşleniyor...' 
                                : isEditMode 
                                    ? 'Revize Edildi, Tekrar Gönder' 
                                    : 'Projeyi Yükle ve İncelemeye Gönder'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectUploadForm;