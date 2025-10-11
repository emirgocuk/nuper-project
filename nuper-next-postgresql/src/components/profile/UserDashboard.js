import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, orderBy, updateDoc, doc, serverTimestamp } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// YENİ VE GÜNCELLENMİŞ SVG IKON TANIMLARI
const SubmittedIcon = ({ color }) => (<svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const ClockIcon = ({ color }) => (<svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>); 
const ReviewIcon = ({ color }) => (<svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const ApprovedIcon = ({ color }) => (<svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>);
const GlobeIcon = ({ color }) => (<svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.945A8.999 8.999 0 0112 21a8.999 8.999 0 014-17.055m-4 0v10M12 21v-4" /></svg>);
const RejectedIcon = ({ color }) => (<svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>);

const STATUS_STEPS = [
    { key: 'submitted', label: 'Gönderildi', detail: 'Projeniz başarıyla sisteme kaydedildi.', Icon: SubmittedIcon },
    { key: 'queued', label: 'Sıraya Alındı', detail: 'Ön inceleme sırasındaki yeriniz ayrıldı.', Icon: ClockIcon }, 
    { key: 'under_review', label: 'İnceleniyor', detail: 'Ekibimiz projenizi detaylı olarak değerlendiriyor.', Icon: ReviewIcon },
    { key: 'revision_requested', label: 'Revizyon Talep Edildi', detail: 'Revizyon talep edildi. Lütfen aşağıdaki hakem notlarını inceleyin ve projeyi güncelleyin.', Icon: ReviewIcon }, 
    { key: 'approved', label: 'Onaylandı', detail: 'Projeniz yatırımcı sunumu için onaylandı.', Icon: ApprovedIcon },
    { key: 'published', label: 'Yayınlandı', detail: 'Projeniz artık yatırımcı platformunda yayında!', Icon: GlobeIcon },
    { key: 'rejected', label: 'Reddedildi', detail: 'Projeniz maalesef bu aşamada onaylanmadı. Detaylı geri bildirim için e-posta kutunuzu kontrol edin.', Icon: RejectedIcon },
];

const getStatusDisplay = (status) => {
    switch (status) {
        case 'submitted':
        case 'pending_review':
            return { text: 'Gönderildi (İnceleme Bekleniyor)', color: 'text-nuper-blue', stepKey: 'submitted' }; 
        case 'queued':
            return { text: 'Sıraya Alındı', color: 'text-nuper-blue', stepKey: 'queued' };
        case 'under_review':
            return { text: 'İnceleniyor', color: 'text-nuper-blue', stepKey: 'under_review' };
        case 'revision_requested':
            return { text: 'REVİZYON TALEP EDİLDİ', color: 'text-orange-600', stepKey: 'revision_requested' };
        case 'approved':
            return { text: 'Onaylandı', color: 'text-nuper-blue', stepKey: 'approved' };
        case 'published':
            return { text: 'Yayınlandı', color: 'text-nuper-dark-blue', stepKey: 'published' };
        case 'rejected':
            return { text: 'Reddedildi', color: 'text-red-600', stepKey: 'rejected' }; 
        default:
            return { text: 'Durum Bilinmiyor', color: 'text-gray-500', stepKey: 'unknown' };
    }
};

const UserDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    
    const auth = getAuth(app);
    const db = getFirestore(app);

    const fetchProjects = async () => {
        const user = auth.currentUser;
        if (user) {
            const projectsCollectionRef = collection(db, "users", user.uid, "projects");
            const q = query(projectsCollectionRef, orderBy("submittedAt", "desc"));
            
            const querySnapshot = await getDocs(q);
            const userProjects = querySnapshot.docs.map(doc => ({ 
                id: doc.id, 
                status: doc.data().status || 'submitted',
                ...doc.data() 
            }));
            setProjects(userProjects);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchProjects().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, db]);

    // handleRevisionSubmit fonksiyonu artık UserDashboard'da kullanılmayacak.
    // Proje düzenleme linki ile ProjectUploadForm'a yönlendirme yapılacak.

    const handleToggleDetails = (projectId) => {
        setExpandedProjectId(projectId === expandedProjectId ? null : projectId);
    };

    const renderTimeline = (project) => {
        const currentStatusInfo = getStatusDisplay(project.status || 'submitted');
        const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === currentStatusInfo.stepKey);
        const isRejected = currentStatusInfo.stepKey === 'rejected';
        const isRevisionRequested = currentStatusInfo.stepKey === 'revision_requested';

        const stepsToRender = isRejected 
            ? [STATUS_STEPS.find(s => s.key === 'rejected')] 
            : STATUS_STEPS.filter(step => step.key !== 'rejected');

        const latestAdminNote = project?.adminNotes?.latest;
        
        return (
            <div className="pt-6">
                <h3 className="pb-2 mb-4 text-xl font-bold border-b border-gray-200 font-heading text-nuper-dark-blue">Durum Takip Çizelgesi</h3>
                
                {/* Revizyon Alanı (Link ile yönlendirme yapıldı) */}
                {isRevisionRequested && (
                    <div className="p-4 mb-6 bg-orange-100 border border-orange-300 rounded-lg shadow-inner">
                        <p className="mb-2 font-bold text-orange-700">📢 REVİZYON GEREKLİ</p>
                        <p className="text-sm italic text-orange-800">Hakem Notu: {latestAdminNote || 'Detaylı not bulunamadı.'}</p>
                        <p className="mt-3 text-sm">Lütfen projenizi güncelledikten sonra aşağıdaki butona basarak tekrar incelemeye gönderin.</p>
                        <Link
                            to={`/project-upload/${project.id}`} // Proje ID'si ile düzenleme sayfasına yönlendir
                            className="inline-block px-4 py-2 mt-3 text-sm font-bold text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            İçeriği Düzenle ve Tekrar Gönder
                        </Link>
                    </div>
                )}
                
                {/* Timeline */}
                <div className="relative ml-3 space-y-8">
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: expandedProjectId ? '100%' : 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{ backgroundColor: 'rgb(74,144,226)' }} 
                        className="absolute left-0 top-0 bottom-0 w-1 -ml-0.5 rounded-full" 
                        aria-hidden="true"
                    />

                    {stepsToRender.map((step, index) => {
                        const isCompleted = isRejected ? false : index <= currentStepIndex; 
                        const isActive = isRejected ? step.key === 'rejected' : index === currentStepIndex;
                        
                        const IconComponent = step.Icon;
                        
                        let ringClasses = 'ring-4 ring-white bg-white border border-gray-300';
                        let iconColor = 'text-gray-500';
                        let cardClasses = 'bg-white border-gray-200';
                        let titleColor = 'text-gray-600';

                        if (isCompleted) {
                            if (isRejected) {
                                // Reddedildi
                                ringClasses = 'ring-4 ring-white bg-white border-red-600 border-2 shadow-md';
                                iconColor = 'text-red-600';
                                cardClasses = 'bg-red-50 border-red-300 shadow-md';
                                titleColor = 'text-red-800';
                            } else {
                                // Aktif veya Tamamlandı (Mavi tonlar)
                                ringClasses = `ring-4 ring-white bg-white border-nuper-blue border-2 shadow-md`;
                                iconColor = 'text-nuper-blue';
                                cardClasses = `border ${index === currentStepIndex ? 'border-nuper-blue bg-nuper-blue/10' : 'border-gray-200 bg-gray-50'}`;
                                titleColor = 'text-nuper-dark-blue';
                                
                                // Tamamlanmış adımları yeşil tik yap (Aktif adımdan öncekiler)
                                if (index < currentStepIndex) {
                                    iconColor = 'text-green-500';
                                    ringClasses = 'ring-4 ring-white bg-white border-green-500 border-2 shadow-md';
                                }
                            }
                        }

                        return (
                            <div key={step.key} className="relative flex items-center min-h-[50px]"> 
                                
                                {/* Timeline Noktası: top-1/2 ve -translate-y-1/2 ile tam ortalandı */}
                                <div className={`absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${ringClasses}`}>
                                    <IconComponent color={iconColor} />
                                </div>
                                
                                {/* İçerik Kartı */}
                                <div className={`ml-6 flex-1 p-4 rounded-lg transition-all duration-300 ${cardClasses} shadow-sm`}>
                                    <p className={`font-bold ${titleColor}`}>{step.label}</p>
                                    <p className="mt-1 text-sm text-gray-600">{step.detail}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="pt-32 text-center">Projeler Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen pt-32 pb-16 bg-nuper-gray">
            <div className="max-w-4xl px-4 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold font-heading text-nuper-dark-blue">Projelerim</h1>
                    <Link to="/project-upload" className="px-6 py-2 font-bold text-white transition-colors duration-200 rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue">
                        Yeni Proje Yükle
                    </Link>
                </div>
                <div className="p-8 bg-white shadow-lg rounded-xl">
                    {projects.length > 0 ? (
                        <ul className="space-y-4">
                            <AnimatePresence>
                                {projects.map(project => {
                                    const statusInfo = getStatusDisplay(project.status);
                                    const isExpanded = expandedProjectId === project.id;
                                    const isNewRevision = project?.adminNotes?.isNew && project.status === 'revision_requested';
                                    
                                    return (
                                        <motion.li 
                                            key={project.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className={`border border-gray-200 p-4 rounded-xl flex justify-between items-center transition-shadow duration-200 hover:shadow-md bg-white ${isNewRevision ? 'border-orange-500 ring-4 ring-orange-200/50' : ''}`}>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold truncate text-nuper-dark-blue">{project.projectName}</h3>
                                                    <p className="mt-1 text-sm text-gray-700">
                                                        Durum: 
                                                        <span className={`inline-block ml-2 text-sm font-bold ${statusInfo.color}`}>
                                                            {statusInfo.text}
                                                        </span>
                                                        {isNewRevision && <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full font-bold">YENİ NOT</span>}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => handleToggleDetails(project.id)}
                                                    className={`flex-shrink-0 text-sm font-semibold py-1 px-4 rounded-full transition-colors duration-200 ml-4 border-2 ${isExpanded ? 'bg-nuper-dark-blue text-white border-nuper-dark-blue' : 'border-nuper-blue text-nuper-blue hover:bg-nuper-blue hover:text-white'}`}
                                                >
                                                    {isExpanded ? 'Detayları Kapat' : 'Durum Detayları'}
                                                </button>
                                            </div>

                                            {/* Detay Kartı (Açılıp Kapanan Kısım) */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="px-4 pt-2 pb-6 mt-2 overflow-hidden bg-white border border-gray-200 shadow-inner rounded-xl -z-10"
                                                    >
                                                        {renderTimeline(project)}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.li>
                                    );
                                })}
                            </AnimatePresence>
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-gray-600">
                            <p>Henüz bir proje yüklemediniz.</p>
                            <p className="mt-2 text-sm">"Yeni Proje Yükle" butonu ile ilk projenizi ekleyebilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;