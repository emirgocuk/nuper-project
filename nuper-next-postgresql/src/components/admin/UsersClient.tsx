'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { approveUser, rejectUser, cancelVerification } from '@/actions/verification';
import { deleteUser } from '@/actions/admin-users';
import { toast } from 'sonner';
import { Check, X, ChevronDown, ChevronUp, FileText, Globe, Linkedin, Twitter, Instagram, AlertCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';

type User = {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    userRole: string | null;
    isVerified: boolean;
    profileImage: string | null;
    createdAt: Date;
    profileData: any;
    socialLinks: any;
    verificationData: any;
};

interface UsersClientProps {
    investors: User[];
    entrepreneurs: User[];
    admins: User[];
}

export default function UsersClient({ investors, entrepreneurs, admins }: UsersClientProps) {
    const { data: session } = useSession();
    const isSuperAdmin = session?.user?.email === 'admin@nuper.com';

    const [activeTab, setActiveTab] = useState<'investors' | 'entrepreneurs' | 'admins'>('investors');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

    // Rejection State
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [userToReject, setUserToReject] = useState<string | null>(null);

    const formatCurrency = (val: string | number) => {
        if (!val || val === '0' || val === 0) return '-';
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Filter Logic
    const getFilteredUsers = (list: User[]) => {
        if (statusFilter === 'all') return list;
        return list.filter(u => {
            const status = getVerificationStatus(u);
            return status === statusFilter;
        });
    };

    const currentList = activeTab === 'investors' ? investors : activeTab === 'entrepreneurs' ? entrepreneurs : admins;
    const filteredList = getFilteredUsers(currentList);

    const handleAction = async (action: 'approve' | 'reject' | 'cancel' | 'delete', userId: string) => {
        try {
            if (action === 'approve') await approveUser(userId);
            else if (action === 'reject') {
                setUserToReject(userId);
                setRejectDialogOpen(true);
                return;
            }
            else if (action === 'cancel') await cancelVerification(userId);
            else if (action === 'delete') {
                if (!confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?")) return;
                await deleteUser(userId);
            }

            toast.success(`İşlem başarılı: ${action}`);
            if (action === 'delete') setExpandedUserId(null);

        } catch (error: any) {
            toast.error(error.message || 'İşlem başarısız.');
        }
    };

    const toggleExpand = (userId: string) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const executeRejection = async () => {
        if (!userToReject) return;
        try {
            await rejectUser(userToReject, rejectReason);
            toast.success("Kullanıcı reddedildi.");
            setRejectDialogOpen(false);
            setRejectReason("");
            setUserToReject(null);
        } catch (error: any) {
            toast.error(error.message || 'Red işlemi başarısız.');
        }
    };

    return (
        <div className="space-y-4">
            {/* Tabs & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                    <button
                        onClick={() => { setActiveTab('investors'); setExpandedUserId(null); }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'investors' ? 'bg-white text-nuper-blue shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Yatırımcılar ({investors.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('entrepreneurs'); setExpandedUserId(null); }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'entrepreneurs' ? 'bg-white text-nuper-blue shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Girişimciler ({entrepreneurs.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('admins'); setExpandedUserId(null); }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'admins' ? 'bg-white text-nuper-blue shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Yöneticiler ({admins.length})
                    </button>
                </div>

                {activeTab !== 'admins' && (
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Durum Filtrele" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="pending">🟡 Onay Bekleyen</SelectItem>
                            <SelectItem value="verified">🟢 Doğrulanmış</SelectItem>
                            <SelectItem value="unverified">⚪ Doğrulanmamış</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* List */}
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[60px]">Avatar</TableHead>
                            <TableHead className="w-[200px]">İsim</TableHead>
                            <TableHead className="w-[250px]">Email</TableHead>
                            <TableHead>Rol</TableHead>
                            {activeTab !== 'admins' && <TableHead>Doğrulama Durumu</TableHead>}
                            <TableHead className="text-right w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Kullanıcı bulunamadı.</TableCell>
                            </TableRow>
                        ) : (
                            filteredList.map((user) => (
                                <React.Fragment key={user.id}>
                                    <TableRow
                                        key={user.id}
                                        className={`cursor-pointer transition-colors ${expandedUserId === user.id ? 'bg-blue-50/50 hover:bg-blue-50/60' : 'hover:bg-gray-50/50'}`}
                                        onClick={() => toggleExpand(user.id)}
                                    >
                                        <TableCell>
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.profileImage || ""} />
                                                <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "NU"}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium truncate max-w-[150px]" title={user.name || ''}>
                                            {user.name || "İsimsiz"}
                                        </TableCell>
                                        <TableCell className="truncate max-w-[200px]" title={user.email || ''}>
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            {activeTab === 'admins' ? (
                                                <Badge variant="outline" className={`
                                                    ${user.email === 'admin@nuper.com' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-gray-200 bg-gray-50 text-gray-700'}
                                                `}>
                                                    {user.email === 'admin@nuper.com' ? 'Süper Admin' : 'Admin'}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="capitalize">
                                                    {user.userRole?.toLowerCase()}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        {activeTab !== 'admins' && (
                                            <TableCell>
                                                <StatusBadge user={user} />
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right">
                                            {expandedUserId === user.id ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                                        </TableCell>
                                    </TableRow>

                                    {expandedUserId === user.id && (
                                        <TableRow className="bg-gray-50/40 hover:bg-gray-50/40 border-b-2 border-b-gray-100">
                                            <TableCell colSpan={6} className="p-0">
                                                <div className="p-6 animate-in slide-in-from-top-2 duration-300">

                                                    {/* Admin View: Simple, Just Delete Action */}
                                                    {activeTab === 'admins' ? (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <Avatar className="h-12 w-12">
                                                                    <AvatarImage src={user.profileImage || ""} />
                                                                    <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "NU"}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                                    <Badge variant="outline" className="mt-1 border-purple-200 bg-purple-50 text-purple-700">
                                                                        {user.email === 'admin@nuper.com' ? 'Süper Admin' : 'Admin'}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            {isSuperAdmin && user.email !== 'admin@nuper.com' && (
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={(e) => { e.stopPropagation(); handleAction('delete', user.id); }}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Admini Sil
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        /* Regular User View (Investors/Entrepreneurs) */
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            {/* Check if user has submitted data */}
                                                            {!user.verificationData && !user.isVerified ? (
                                                                <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-yellow-50/50 border border-yellow-100 rounded-lg text-center space-y-3">
                                                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                                                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                                                                    </div>
                                                                    <h4 className="font-semibold text-gray-900">Doğrulama Talebi Bulunamadı</h4>
                                                                    <p className="text-sm text-gray-500 max-w-md">
                                                                        Bu kullanıcı henüz profil bilgilerini doldurup doğrulama isteği göndermemiş.
                                                                        Bu nedenle onaylama işlemi şu an yapılamaz.
                                                                    </p>
                                                                    <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed">
                                                                        <Check className="w-4 h-4 mr-2" /> Onayla (Devre Dışı)
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => handleAction('delete', user.id)}
                                                                        className="mt-2 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 shadow-sm"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" /> Kullanıcıyı Sil
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                /* Full Verification Data View */
                                                                <>
                                                                    <div className="space-y-6">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="text-sm font-semibold flex items-center gap-2 text-gray-900">
                                                                                <FileText className="w-4 h-4 text-nuper-blue" /> Profil Detayları
                                                                            </h4>
                                                                        </div>
                                                                        <Separator className="bg-gray-200" />

                                                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                                                                            <div>
                                                                                <span className="text-xs text-gray-500 uppercase font-semibold">Sektörler</span>
                                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                                    {(user.profileData?.industries || user.profileData?.interestSectors || []).length > 0 ? (
                                                                                        (user.profileData?.industries || user.profileData?.interestSectors || []).map((i: string) => (
                                                                                            <Badge key={i} variant="secondary" className="text-xs bg-white border border-gray-200">{i}</Badge>
                                                                                        ))
                                                                                    ) : <span className="text-gray-400">-</span>}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-xs text-gray-500 uppercase font-semibold">Konum</span>
                                                                                <div className="mt-1 font-medium text-gray-800">
                                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                                        {(() => {
                                                                                            let locs: string[] = [];
                                                                                            const pd = user.profileData || {};

                                                                                            if (Array.isArray(pd.location) && pd.location.length > 0) {
                                                                                                locs = pd.location;
                                                                                            } else if (typeof pd.location === 'string' && pd.location) {
                                                                                                locs = pd.location.split(/(?=[A-ZÇĞİÖŞÜ])/).filter(Boolean);
                                                                                            } else if (Array.isArray(pd.locationPreference) && pd.locationPreference.length > 0) {
                                                                                                locs = pd.locationPreference;
                                                                                            } else if (typeof pd.locationPreference === 'string' && pd.locationPreference) {
                                                                                                locs = pd.locationPreference.split(/(?=[A-ZÇĞİÖŞÜ])/).filter(Boolean);
                                                                                            }

                                                                                            if (locs.length > 0) {
                                                                                                return locs.map((loc: string, idx: number) => (
                                                                                                    <Badge key={idx} variant="outline" className="text-xs border-gray-200 bg-gray-50 text-gray-700">{loc}</Badge>
                                                                                                ));
                                                                                            }
                                                                                            return <span className="text-sm font-medium text-gray-800">-</span>;
                                                                                        })()}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {user.userRole === 'ENTREPRENEUR' && (
                                                                                <>
                                                                                    <div>
                                                                                        <span className="text-xs text-gray-500 uppercase font-semibold">Aşama</span>
                                                                                        <span className="block mt-1 font-medium text-gray-800">{user.profileData?.businessStage || '-'}</span>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="text-xs text-gray-500 uppercase font-semibold">Aranan Yatırım</span>
                                                                                        <span className="block mt-1 font-medium text-gray-800">
                                                                                            {formatCurrency(user.profileData?.investmentMin || user.profileData?.investmentRange?.[0])} ₺ -
                                                                                            {formatCurrency(user.profileData?.investmentMax || user.profileData?.investmentRange?.[1])} ₺
                                                                                        </span>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {user.userRole === 'INVESTOR' && (
                                                                                <div>
                                                                                    <span className="text-xs text-gray-500 uppercase font-semibold">Bütçe</span>
                                                                                    <span className="block mt-1 font-medium text-gray-800">
                                                                                        {formatCurrency(user.profileData?.investmentMin)} ₺ - {formatCurrency(user.profileData?.investmentMax)} ₺
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {Array.isArray(user.socialLinks) && user.socialLinks.length > 0 && (
                                                                            <div className="space-y-2 pt-2">
                                                                                <span className="text-xs text-gray-500 uppercase font-semibold">Sosyal Medya</span>
                                                                                <div className="flex gap-2">
                                                                                    {user.socialLinks.map((link: any, i: number) => {
                                                                                        let Icon = Globe;
                                                                                        if (link.platform === 'linkedin') Icon = Linkedin;
                                                                                        if (link.platform === 'twitter') Icon = Twitter;
                                                                                        if (link.platform === 'instagram') Icon = Instagram;
                                                                                        return (
                                                                                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                                                                                                <Button variant="outline" size="sm" className="h-8 gap-2 bg-white">
                                                                                                    <Icon className="h-3 w-3" /> <span className="capitalize">{link.platform}</span>
                                                                                                </Button>
                                                                                            </a>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="space-y-6 flex flex-col h-full">
                                                                        {user.profileData?.businessDescription && (
                                                                            <div className="space-y-2">
                                                                                <h4 className="text-sm font-semibold text-gray-900">İş Tanımı</h4>
                                                                                <p className="text-sm bg-white p-3 rounded-lg border border-gray-200 text-gray-600 leading-relaxed shadow-sm">
                                                                                    {user.profileData.businessDescription}
                                                                                </p>
                                                                            </div>
                                                                        )}

                                                                        {(user.verificationData?.presentation || user.profileData?.presentation) && (
                                                                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-2">
                                                                                <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-900">
                                                                                    <FileText className="w-4 h-4" /> Fikir Sunumu
                                                                                </h4>
                                                                                <p className="text-sm text-blue-800">
                                                                                    {user.verificationData?.presentation?.description || "Başlık yok"}
                                                                                </p>
                                                                                {user.verificationData?.presentation?.url && (
                                                                                    <a
                                                                                        href={user.verificationData.presentation.url}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="inline-flex items-center gap-2 text-xs font-medium text-white bg-blue-600 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                                                                    >
                                                                                        <Globe className="w-3 h-3" /> Dosyayı İncele
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        <div className="mt-auto pt-4 flex justify-end gap-3 border-t border-gray-200">
                                                                            {user.isVerified ? (
                                                                                <Button
                                                                                    variant="destructive"
                                                                                    size="sm"
                                                                                    onClick={() => handleAction('cancel', user.id)}
                                                                                    className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm"
                                                                                >
                                                                                    <X className="w-4 h-4 mr-2" /> Onayı İptal Et
                                                                                </Button>
                                                                            ) : (
                                                                                <>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => handleAction('reject', user.id)}
                                                                                        className="text-red-600 hover:bg-red-50 border-red-200"
                                                                                    >
                                                                                        <X className="w-4 h-4 mr-2" /> Reddet
                                                                                    </Button>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        onClick={() => handleAction('approve', user.id)}
                                                                                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                                                                    >
                                                                                        <Check className="w-4 h-4 mr-2" /> Onayla
                                                                                    </Button>
                                                                                </>
                                                                            )}
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() => handleAction('delete', user.id)}
                                                                                className="ml-auto bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 shadow-sm"
                                                                            >
                                                                                <Trash2 className="w-4 h-4 mr-2" /> Sil
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kullanıcıyı Reddet</DialogTitle>
                        <DialogDescription>
                            Kullanıcıya gönderilmek üzere bir red sebebi veya düzeltme notu girin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Red Sebebi / Editör Notu</Label>
                            <Textarea
                                id="reason"
                                placeholder="Örn: Konum bilgisi çok genel, lütfen şehir seçiniz."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>İptal</Button>
                        <Button variant="destructive" onClick={executeRejection} disabled={!rejectReason.trim()}>Reddet ve Gönder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}

function StatusBadge({ user }: { user: User }) {
    const status = getVerificationStatus(user);

    if (status === 'verified') {
        return <Badge className="bg-green-600 hover:bg-green-700 text-white shadow-sm px-2 py-0.5"><Check className="w-3 h-3 mr-1" /> Doğrulandı</Badge>;
    }
    if (status === 'pending') {
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm px-2 py-0.5"><AlertCircle className="w-3 h-3 mr-1" /> Onay Bekliyor</Badge>;
    }
    return <Badge variant="secondary" className="text-gray-500 bg-gray-100 border-gray-200">Doğrulanmadı</Badge>;
}

function getVerificationStatus(user: User): 'verified' | 'pending' | 'unverified' {
    if (user.isVerified) return 'verified';
    if (user.verificationData && (user.verificationData as any).status === 'PENDING') return 'pending';
    return 'unverified';
}
