'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Save, X, Plus, Rocket, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { submitVerification } from '@/actions/profile';
import {
    INDUSTRIES,
    BUSINESS_STAGES,
    LOCATIONS,
    TEAM_SIZES,
    INVESTOR_TYPES,
    SOCIAL_PLATFORMS
} from '@/constants/profile';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface ProfileInfoFormProps {
    userRole: string;
    isVerified: boolean;
    initialProfileData?: any;
    initialSocialLinks?: any;
    initialVerificationData?: any;
}

export default function ProfileInfoForm({
    userRole,
    isVerified,
    initialProfileData,
    initialSocialLinks,
    initialVerificationData
}: ProfileInfoFormProps) {
    const [loading, setLoading] = useState(false);

    // Consolidated State
    const [profileData, setProfileData] = useState(initialProfileData || {});
    const [socialLinks, setSocialLinks] = useState(Array.isArray(initialSocialLinks) ? initialSocialLinks : []);
    const [presentation, setPresentation] = useState(initialVerificationData?.presentation || { description: '', url: '' });
    const [newSector, setNewSector] = useState("");

    // Investment Range State (Strings for formatting)
    const formatNumber = (num: string | number) => {
        if (!num) return "";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [investmentRange, setInvestmentRange] = useState<string[]>([
        profileData.investmentMin ? formatNumber(profileData.investmentMin) : "",
        profileData.investmentMax ? formatNumber(profileData.investmentMax) : ""
    ]);

    // Helper functions
    const updateProfile = (field: string, value: any) => {
        setProfileData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleMultiSelect = (field: string, value: string) => {
        const current = profileData[field] || [];
        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value];
        updateProfile(field, updated);
    };

    const handleLocationSelect = (selectedLocations: string[]) => {
        // Handle both 'location' (Entrepreneur) and 'locationPreference' (Investor)
        // Actually, user asked for multi-location for Entrepreneur too "konum olarak birçok şehir seçebilelim"
        const fieldName = userRole === 'INVESTOR' ? 'locationPreference' : 'location';
        updateProfile(fieldName, selectedLocations);
    };

    const handleAddSector = () => {
        if (!newSector.trim()) return;
        handleMultiSelect(userRole === 'INVESTOR' ? 'interestSectors' : 'industries', newSector.trim());
        setNewSector("");
    };

    // Social Links Logic
    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: 'linkedin', url: '' }]);
    };

    const removeSocialLink = (index: number) => {
        const updated = [...socialLinks];
        updated.splice(index, 1);
        setSocialLinks(updated);
    };

    const updateSocialLink = (index: number, field: string, value: string) => {
        const updated = [...socialLinks];
        updated[index][field] = value;
        setSocialLinks(updated);
    };

    // Range Input Handler with Formatting
    const handleRangeChange = (index: 0 | 1, value: string) => {
        // Remove existing dots to get raw number string
        const rawValue = value.replace(/\./g, "");

        // Allow empty
        if (rawValue === "") {
            const newRange = [...investmentRange];
            newRange[index] = "";
            setInvestmentRange(newRange);
            updateProfile(index === 0 ? 'investmentMin' : 'investmentMax', 0);
            return;
        }

        // Validate number
        if (!/^\d+$/.test(rawValue)) return;

        const formatted = formatNumber(rawValue);
        const newRange = [...investmentRange];
        newRange[index] = formatted;
        setInvestmentRange(newRange);

        // Update profile data (save as number)
        updateProfile(index === 0 ? 'investmentMin' : 'investmentMax', parseInt(rawValue));
    };

    // Validation Logic
    const validateForm = () => {
        const errors: string[] = [];

        if (userRole === 'INVESTOR') {
            if (!profileData.locationPreference || profileData.locationPreference.length === 0) {
                errors.push("En az bir konum tercihi seçmelisiniz.");
            }
            if (!profileData.investorType) {
                errors.push("Yatırımcı türünü seçmelisiniz.");
            }
            if (!profileData.interestSectors || profileData.interestSectors.length === 0) {
                errors.push("İlgi alanı sektörlerinden en az birini seçmelisiniz.");
            }
        } else {
            // ENTREPRENEUR
            if (!profileData.industries || profileData.industries.length === 0) {
                errors.push("Sektörlerden en az birini seçmelisiniz.");
            }
            if (!profileData.businessStage) {
                errors.push("İşletme aşamasını seçmelisiniz.");
            }
            if (!profileData.location || profileData.location.length === 0) {
                errors.push("Konum bilgisini girmelisiniz.");
            }
            if (!profileData.teamSize) {
                errors.push("Ekip büyüklüğünü seçmelisiniz.");
            }
            if (!profileData.foundedYear) {
                errors.push("Kuruluş yılını girmelisiniz.");
            }
            if (!profileData.businessDescription || profileData.businessDescription.length < 20) {
                errors.push("İş tanımı en az 20 karakter olmalıdır.");
            }
            if (!presentation.description) {
                errors.push("Fikir sunumu başlığını veya açıklamasını girmelisiniz.");
            }
        }

        // Common Validation
        if (socialLinks.length === 0) {
            errors.push("En az 1 tane sosyal medya veya iletişim bağlantısı eklemelisiniz.");
        }

        return errors;
    };

    // Main Submit Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setLoading(true);

        try {
            await submitVerification({
                profileData,
                socialLinks,
                // Only send presentation for Entrepreneurs
                presentation: userRole === 'ENTREPRENEUR' ? presentation : null
            });
            toast.success('Doğrulama bilgileri başarıyla kaydedildi!');
        } catch (error) {
            toast.error('Kaydetme işlemi başarısız oldu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-t-4 border-t-nuper-blue shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Shield className="w-6 h-6 text-nuper-blue" />
                                {userRole === 'INVESTOR' ? 'Yatırımcı Doğrulaması' : 'Girişimci Doğrulaması'}
                            </CardTitle>
                            <CardDescription className="mt-2">
                                {userRole === 'INVESTOR'
                                    ? 'Yatırım tercihlerinizi ve profil detaylarınızı güncelleyin.'
                                    : 'Girişiminizi tanıtın ve yatırım fırsatlarını yakalayın.'}
                            </CardDescription>
                        </div>
                        <Badge variant={isVerified ? "default" : "secondary"} className={`text-base px-4 py-1 ${isVerified ? "bg-green-600 hover:bg-green-700" : ""}`}>
                            {isVerified ? "✓ Hesabınız Doğrulandı" : "Doğrulama Bekleniyor"}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    {initialVerificationData?.status === 'REJECTED' && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
                            <div>
                                <h4 className="font-semibold text-sm text-red-900">Doğrulama Başvurunuz Reddedildi</h4>
                                <p className="text-sm mt-1 text-red-800">{initialVerificationData.rejectionReason || "Bir sebep belirtilmedi."}</p>
                                <p className="text-xs mt-2 text-red-600/80 font-medium">Lütfen bilgilerinizi güncelleyerek tekrar doğrulamaya gönderiniz.</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* 1. Profile Information Section */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-nuper-blue text-white text-xs">1</span>
                                Profil Bilgileri
                            </h3>
                            <Separator />

                            {userRole === "ENTREPRENEUR" ? (
                                <div className="space-y-6 pt-2">
                                    <div className="space-y-3">
                                        <Label className="text-base">Sektörler</Label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {INDUSTRIES.filter(i => i !== "Diğer").map((industry) => (
                                                <Badge
                                                    key={industry}
                                                    variant={(profileData.industries || []).includes(industry) ? "default" : "outline"}
                                                    className="cursor-pointer px-3 py-1 text-sm hover:scale-105 transition-transform"
                                                    onClick={() => handleMultiSelect('industries', industry)}
                                                >
                                                    {industry}
                                                </Badge>
                                            ))}
                                            {(profileData.industries || [])
                                                .filter((i: string) => !INDUSTRIES.includes(i))
                                                .map((custom: string) => (
                                                    <Badge
                                                        key={custom}
                                                        variant="default"
                                                        className="cursor-pointer px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700"
                                                        onClick={() => handleMultiSelect('industries', custom)}
                                                    >
                                                        {custom} <X className="w-3 h-3 ml-1" />
                                                    </Badge>
                                                ))}
                                        </div>
                                        <div className="flex gap-2 max-w-sm">
                                            <Input
                                                placeholder="Diğer sektör ekle..."
                                                value={newSector}
                                                onChange={(e) => setNewSector(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSector())}
                                            />
                                            <Button type="button" variant="secondary" onClick={handleAddSector}>Ekle</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>İşletme Aşaması</Label>
                                            <Select
                                                value={profileData.businessStage || ''}
                                                onValueChange={(value) => updateProfile('businessStage', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {BUSINESS_STAGES.map((stage) => (
                                                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Konum</Label>
                                            <MultiSelect
                                                options={LOCATIONS}
                                                selected={Array.isArray(profileData.location) ? profileData.location : []}
                                                onChange={(selected) => updateProfile('location', selected)}
                                                placeholder="Şehirleri seçiniz..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Ekip Büyüklüğü</Label>
                                            <Select
                                                value={profileData.teamSize || ''}
                                                onValueChange={(value) => updateProfile('teamSize', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TEAM_SIZES.map((size) => (
                                                        <SelectItem key={size} value={size}>{size}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Kuruluş Yılı</Label>
                                            <Input
                                                type="number"
                                                placeholder="2024"
                                                value={profileData.foundedYear || ''}
                                                onChange={(e) => updateProfile('foundedYear', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Entrepreneur Investment Range (New) */}
                                    <div className="space-y-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                        <Label className="text-base font-semibold">Aranan Yatırım Miktarı (TL)</Label>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Yatırım turunda hedeflediğiniz minimum ve maksimum tutar aralığı.
                                        </p>
                                        <div className="flex gap-4 items-center">
                                            <div className="space-y-2 flex-1">
                                                <Label className="text-xs text-gray-500 uppercase">Minimum</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="text"
                                                        placeholder="50.000"
                                                        value={investmentRange[0]}
                                                        onChange={(e) => handleRangeChange(0, e.target.value)}
                                                        className="pl-8"
                                                    />
                                                    <span className="absolute left-3 top-2.5 text-gray-500">₺</span>
                                                </div>
                                            </div>
                                            <div className="text-gray-400 font-bold">-</div>
                                            <div className="space-y-2 flex-1">
                                                <Label className="text-xs text-gray-500 uppercase">Maximum</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="text"
                                                        placeholder="500.000"
                                                        value={investmentRange[1]}
                                                        onChange={(e) => handleRangeChange(1, e.target.value)}
                                                        className="pl-8"
                                                    />
                                                    <span className="absolute left-3 top-2.5 text-gray-500">₺</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>İş Tanımı</Label>
                                        <Textarea
                                            placeholder="İşinizi, hedeflerinizi ve vizyonunuzu detaylı bir şekilde anlatın..."
                                            rows={8}
                                            className="resize-none min-h-[150px]"
                                            value={profileData.businessDescription || ''}
                                            onChange={(e) => updateProfile('businessDescription', e.target.value)}
                                        />
                                        <p className="text-xs text-right text-gray-500">Paragraf kullanarak detaylı açıklama yapabilirsiniz.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pt-2">
                                    {/* Investor Fields */}
                                    <div className="space-y-8">
                                        {/* Investment Range Inputs */}
                                        <div className="space-y-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                            <Label className="text-base font-semibold">Yatırım Aralığı (TL)</Label>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Yatırım yapmak istediğiniz minimum ve maksimum tutarı giriniz.
                                            </p>
                                            <div className="flex gap-4 items-center">
                                                <div className="space-y-2 flex-1">
                                                    <Label className="text-xs text-gray-500 uppercase">Minimum</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="text"
                                                            placeholder="50.000"
                                                            value={investmentRange[0]}
                                                            onChange={(e) => handleRangeChange(0, e.target.value)}
                                                            className="pl-8"
                                                        />
                                                        <span className="absolute left-3 top-2.5 text-gray-500">₺</span>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400 font-bold">-</div>
                                                <div className="space-y-2 flex-1">
                                                    <Label className="text-xs text-gray-500 uppercase">Maximum</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="text"
                                                            placeholder="500.000"
                                                            value={investmentRange[1]}
                                                            onChange={(e) => handleRangeChange(1, e.target.value)}
                                                            className="pl-8"
                                                        />
                                                        <span className="absolute left-3 top-2.5 text-gray-500">₺</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-base">İlgi Alanı Sektörler</Label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {INDUSTRIES.filter(i => i !== "Diğer").map((industry) => (
                                                    <Badge
                                                        key={industry}
                                                        variant={(profileData.interestSectors || []).includes(industry) ? "default" : "outline"}
                                                        className="cursor-pointer px-3 py-1 text-sm hover:scale-105 transition-transform"
                                                        onClick={() => handleMultiSelect('interestSectors', industry)}
                                                    >
                                                        {industry}
                                                    </Badge>
                                                ))}
                                                {(profileData.interestSectors || [])
                                                    .filter((i: string) => !INDUSTRIES.includes(i))
                                                    .map((custom: string) => (
                                                        <Badge
                                                            key={custom}
                                                            variant="default"
                                                            className="cursor-pointer px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700"
                                                            onClick={() => handleMultiSelect('interestSectors', custom)}
                                                        >
                                                            {custom} <X className="w-3 h-3 ml-1" />
                                                        </Badge>
                                                    ))}
                                            </div>
                                            <div className="flex gap-2 max-w-sm">
                                                <Input
                                                    placeholder="Diğer sektör ekle..."
                                                    value={newSector}
                                                    onChange={(e) => setNewSector(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSector())}
                                                />
                                                <Button type="button" variant="secondary" onClick={handleAddSector}>Ekle</Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Konum Tercihleri</Label>
                                                <MultiSelect
                                                    options={LOCATIONS}
                                                    selected={Array.isArray(profileData.locationPreference) ? profileData.locationPreference : []}
                                                    onChange={(selected) => updateProfile('locationPreference', selected)}
                                                    placeholder="Şehirleri seçiniz..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Yatırımcı Türü</Label>
                                                <Select
                                                    value={profileData.investorType || ''}
                                                    onValueChange={(value) => updateProfile('investorType', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {INVESTOR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {/* Removed Experience & Portfolio Size */}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 2. Social Media Section */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-nuper-blue text-white text-xs">2</span>
                                Sosyal Medya Bağlantıları
                            </h3>
                            <Separator />
                            <div className="pt-2 space-y-4">
                                {socialLinks.map((link: any, index: number) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <Select
                                            value={link.platform}
                                            onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                                        >
                                            <SelectTrigger className="w-1/3 md:w-1/4">
                                                <SelectValue placeholder="Platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SOCIAL_PLATFORMS.map(p => (
                                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex-1">
                                            <Input
                                                placeholder={SOCIAL_PLATFORMS.find(p => p.value === link.platform)?.placeholder || "Link"}
                                                value={link.url}
                                                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeSocialLink(index)}
                                            className="text-red-500 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button type="button" variant="outline" onClick={addSocialLink} className="border-dashed w-full md:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Yeni Bağlantı Ekle
                                </Button>
                            </div>
                        </section>

                        {/* 3. Idea Presentation Section (Only for Entrepreneurs) */}
                        {userRole === 'ENTREPRENEUR' && (
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-nuper-blue text-white text-xs">3</span>
                                    Fikir Sunumu
                                </h3>
                                <Separator />
                                <div className="pt-2 space-y-4">
                                    <p className="text-sm text-gray-500">
                                        Fikrinizi veya yatırım stratejinizi anlatan bir sunum veya detaylı açıklama ekleyin.
                                    </p>
                                    <div className="space-y-2">
                                        <Label>Sunum Başlığı / Kısa Açıklama</Label>
                                        <Input
                                            placeholder="Örn: 2025 Yatırım Stratejisi veya Proje Pitch Deck"
                                            value={presentation.description}
                                            onChange={(e) => setPresentation({ ...presentation, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sunum Dosyası Linki (Google Drive, DocSend, vb.)</Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                className="pl-9"
                                                placeholder="https://..."
                                                value={presentation.url}
                                                onChange={(e) => setPresentation({ ...presentation, url: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4 sticky bottom-0 bg-white pb-4 border-t mt-8 z-10">
                            <Button size="lg" type="submit" disabled={loading} className="w-full bg-nuper-blue hover:bg-nuper-dark-blue shadow-lg hover:shadow-xl transition-all h-auto min-h-[3rem] py-3 text-sm md:text-lg whitespace-normal leading-tight">
                                {loading ? (
                                    <>
                                        <Rocket className="w-5 h-5 mr-2 animate-bounce" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Bilgileri Kaydet / Doğrulamaya Gönder
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
