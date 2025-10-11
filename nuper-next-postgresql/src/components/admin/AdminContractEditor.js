import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const AdminContractEditor = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const db = getFirestore(app);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchContract = async () => {
            setLoading(true);
            const docRef = doc(db, 'legal_documents', docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.title || 'Başlık Bulunamadı');
                setContent(data.content || '');
            } else {
                setTitle('Belge Bulunamadı');
            }
            setLoading(false);
        };
        fetchContract();
    }, [db, docId]);

    const handleSave = async () => {
        setSaving(true);
        const docRef = doc(db, 'legal_documents', docId);
        try {
            await setDoc(docRef, {
                title,
                content,
                lastUpdated: serverTimestamp()
            }, { merge: true });
            navigate('/admin/contracts');
        } catch (error) {
            console.error("Sözleşme kaydedilirken hata:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-8">Yükleniyor...</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-heading font-bold text-nuper-dark-blue mb-6 border-b pb-4">
                {`"${title}" Belgesini Düzenle`}
            </h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Sözleşme İçeriği (Markdown formatında yazabilirsiniz)
                    </label>
                    <textarea
                        id="content"
                        rows="25"
                        className="form-input-std font-mono text-sm" // Stil güncellendi
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/contracts')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Geri
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-nuper-blue hover:bg-nuper-dark-blue text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                    >
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminContractEditor;
