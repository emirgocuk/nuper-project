import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { withSwal } from 'react-sweetalert2';

const STATUS_OPTIONS = [
    { key: 'submitted', label: 'Gönderildi (Beklemede)' },
    { key: 'queued', label: 'Sıraya Alındı / Hakem Atandı' },
    { key: 'under_review', label: 'İnceleniyor (Hakem Değerlendirmesi)' },
    { key: 'revision_requested', label: 'Revizyon Talep Edildi' },
    { key: 'approved', label: 'Onaylandı' },
    { key: 'published', label: 'Yayınlandı' },
    { key: 'rejected', label: 'Reddedildi' },
];

const AdminProjectReview = ({ swal }) => {
    const { userId, projectId } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewNote, setReviewNote] = useState('');
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!userId || !projectId) return;
            setLoading(true);
            try {
                const docRef = doc(db, "users", userId, "projects", projectId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProject(data);
                    setStatus(data.status || 'submitted');
                    setReviewNote(data.adminNotes?.latest || '');
                } else {
                    setError("Proje bulunamadı.");
                }
            } catch (err) {
                console.error("Projeyi çekerken hata:", err);
                setError("Proje detayları yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, userId, projectId]);

    const handleUpdate = async (newStatus, noteOverride = null) => {
        const oldStatus = project?.status;
        setSaving(true);
        setError(null);

        const finalNote = noteOverride !== null ? noteOverride : reviewNote;
        
        // Zorunlu Not Kontrolü: Revizyon için
        if (newStatus === 'revision_requested' && !finalNote.trim()) {
             swal.fire('Eksik Bilgi', 'Revizyon talep ederken geri bildirim notu zorunludur.', 'warning');
             setSaving(false);
             return;
        }

        const projectRef = doc(db, "users", userId, "projects", projectId);
        const currentTimestamp = serverTimestamp();
        
        // YENİ: Log Girişi Hazırlanıyor
        const newLogEntry = {
            action: `${STATUS_OPTIONS.find(o => o.key === oldStatus)?.label || oldStatus} -> ${STATUS_OPTIONS.find(o => o.key === newStatus)?.label || newStatus}`,
            note: finalNote,
            timestamp: new Date().toLocaleTimeString('tr-TR'),
            date: new Date().toLocaleDateString('tr-TR'),
            user: "Admin", // Yönetici rolü eklenebilir
        };
        
        let updateData = {
            status: newStatus,
            updatedAt: currentTimestamp,
            adminNotes: {
                latest: finalNote,
                timestamp: currentTimestamp,
                isNew: newStatus === 'revision_requested' ? true : false, 
            },
        };

        try {
            await updateDoc(projectRef, {
                ...updateData,
                // Log geçmişine ekleme
                history: [...(project?.history || []), newLogEntry]
            });
            
            swal.fire('Başarılı!', `Proje durumu: ${STATUS_OPTIONS.find(o => o.key === newStatus)?.label || newStatus} olarak güncellendi.`, 'success');
            setSaving(false);
            
            // Local state'i history ile birlikte güncelleyeceğiz.
            setProject(prev => ({ 
                ...prev, 
                ...updateData, 
                status: newStatus,
                history: [...(prev?.history || []), newLogEntry]
            }));
            setStatus(newStatus);
            setReviewNote(finalNote);
            
        } catch (err) {
            setError(`Durum güncellenirken hata oluştu: ${err.message}`);
            setSaving(false);
        }
    };

    // Reddetme işlemi için özel fonksiyon
    const handleReject = () => {
        const rejectNote = document.getElementById('rejectNote').value;
        if (!rejectNote.trim()) {
            swal.fire('Eksik Bilgi', 'Reddetme notu zorunludur.', 'warning');
            return;
        }
        handleUpdate('rejected', rejectNote);
    };

    if (loading) return <div className="py-8 text-center">Proje yükleniyor...</div>;
    if (error) return <div className="py-8 text-center text-red-600">{error}</div>;

    const projectHistory = project?.history || [];

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <h2 className="pb-4 mb-6 text-3xl font-bold border-b font-heading text-nuper-dark-blue">
                Proje İncelemesi: {project?.projectName}
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                
                {/* Sol Panel: Proje Detayları */}
                <div className="p-6 space-y-4 bg-white rounded-lg shadow-md md:col-span-2">
                    <div className="flex items-center justify-between pb-3 border-b">
                        <p className="text-xl font-semibold text-gray-700">Mevcut Durum:</p>
                        <span className={`px-4 py-1 rounded-full text-white font-bold text-sm ${
                            project.status === 'approved' || project.status === 'published' ? 'bg-green-600' :
                            project.status === 'rejected' ? 'bg-red-600' :
                            project.status === 'revision_requested' ? 'bg-orange-500' :
                            'bg-nuper-blue'
                        }`}>
                            {STATUS_OPTIONS.find(o => o.key === project.status)?.label}
                        </span>
                    </div>

                    {/* Proje İçeriği Linki */}
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                        <p className="text-sm font-semibold text-nuper-dark-blue">Proje İçeriği:</p>
                        <a href={project.fileLink} target="_blank" rel="noopener noreferrer" className="block text-sm truncate text-nuper-blue hover:underline">{project.fileLink || 'Link bilgisi yok'}</a>
                        <p className="mt-1 text-xs text-gray-500">Lütfen projeyi incelemek için dosyaya/linke erişin.</p>
                    </div>

                    <p><strong>Gönderen E-posta:</strong> {project?.ownerEmail || 'N/A'}</p>
                    <p><strong>Gönderim Tarihi:</strong> {project?.submittedAt?.toDate().toLocaleString('tr-TR') || 'N/A'}</p>
                    
                    <h3 className="pt-3 mt-4 text-xl font-semibold border-t">Özet</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{project?.projectSummary}</p>

                    <h3 className="pt-3 mt-4 text-xl font-semibold border-t">Hakem/Revizyon Notları</h3>
                    <div className="p-3 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-700">{project?.adminNotes?.latest || 'Hakem/Revizyon notu henüz yok.'}</p>
                    </div>
                </div>
                
                {/* Sağ Panel: Yönetim Kontrolleri */}
                <div className="space-y-6 md:col-span-1">

                    {/* DETAYLI DURUM GÜNCELLEME */}
                    <div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
                        <h3 className="mb-4 text-xl font-semibold text-nuper-dark-blue">Durum Yönetimi</h3>

                        {/* Durum Seçimi */}
                        <div>
                            <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-700">Yeni Durum:</label>
                            <select
                                id="statusSelect"
                                className="form-input-std"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={saving}
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.key} value={option.key}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Hakem/Yönetici Notu */}
                        <div>
                            <label htmlFor="reviewNote" className="block text-sm font-medium text-gray-700">Hakem Notu / Geri Bildirim:</label>
                            <textarea
                                id="reviewNote"
                                rows="4"
                                className="form-input-std"
                                value={reviewNote}
                                onChange={(e) => setReviewNote(e.target.value)}
                                placeholder="Projeye özel geri bildirim notlarını buraya yazın."
                                disabled={saving}
                            />
                            {status === 'revision_requested' && <p className="mt-1 text-xs font-semibold text-orange-600">UYARI: Revizyon için not zorunludur.</p>}
                        </div>

                        {/* Eylem Butonu (Reddetme hariç tüm durumlar için) */}
                        <button
                            onClick={() => handleUpdate(status)}
                            disabled={saving || (status === 'rejected')} 
                            className="w-full px-4 py-2 font-bold text-white transition-colors rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue disabled:bg-gray-400"
                        >
                            {saving ? 'Güncelleniyor...' : 'Durumu Kaydet'}
                        </button>
                    </div>

                    {/* REDDETME BÖLÜMÜ (Zorunlu Not) */}
                    <div className="p-6 space-y-4 border-2 border-red-300 rounded-lg shadow-lg bg-red-50">
                         <h3 className="text-xl font-semibold text-red-700">❗ PROJEYİ REDDET</h3>
                         
                         <div>
                            <label htmlFor="rejectNote" className="block text-sm font-medium text-red-700">Ret Notu (Zorunlu)</label>
                            <textarea
                                id="rejectNote"
                                rows="3"
                                className="border-red-300 form-input-std"
                                placeholder="Neden reddedildiğini açıklayın. Bu not kullanıcıya gönderilecektir."
                            />
                            <p className="mt-1 text-xs font-semibold text-red-700">UYARI: Ret işlemi geri alınamaz ve not zorunludur.</p>
                         </div>
                         
                         <button
                            onClick={handleReject}
                            disabled={saving}
                            className="w-full px-4 py-3 font-bold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                        >
                            {saving ? 'İşleniyor...' : 'Reddet ve Notu Gönder'}
                        </button>
                    </div>
                </div>
            </div>

            {/* YENİ BÖLÜM: Proje Geçmişi Logları */}
            <div className="p-6 mt-10 bg-white shadow-lg rounded-xl">
                <h3 className="pb-2 mb-4 text-2xl font-bold border-b font-heading text-nuper-dark-blue">Proje Eylem Geçmişi</h3>
                
                {projectHistory.length > 0 ? (
                    <div className="space-y-4">
                        {projectHistory.slice().reverse().map((log, index) => ( // En yeniyi üste almak için ters çevrildi
                            <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-start justify-between text-sm">
                                    <p className="font-bold text-gray-800">{log.action}</p>
                                    <span className="flex-shrink-0 ml-4 font-mono text-xs text-gray-500">{log.date} - {log.timestamp}</span>
                                </div>
                                {log.note && (
                                    <p className="pt-2 mt-1 text-xs italic text-gray-600 border-t border-gray-200">
                                        Not: {log.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Bu proje için henüz bir işlem geçmişi bulunmamaktadır.</p>
                )}
            </div>
            
            <div className="flex justify-end mt-8">
                <button 
                    onClick={() => navigate('/admin/projects')}
                    className="px-6 py-2 font-bold text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    Tüm Projelere Geri Dön
                </button>
            </div>
        </div>
    );
};

export default withSwal(AdminProjectReview);