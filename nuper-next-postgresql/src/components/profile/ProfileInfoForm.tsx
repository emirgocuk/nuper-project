'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Save, Check, ChevronsUpDown, X, Plus, Link as LinkIcon } from 'lucide-react';
import { saveProfileData, saveSocialLinks } from '@/actions/profile';
import {
    INDUSTRIES,
    BUSINESS_STAGES,
    INVESTMENT_RANGES,
    LOCATIONS,
    TEAM_SIZES,
    INVESTOR_TYPES,
    EXPERIENCE_RANGES,
    PORTFOLIO_SIZES,
    SOCIAL_PLATFORMS
} from '@/constants/profile';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ProfileInfoFormProps {
    userRole: string;
    isVerified: boolean;
    initialProfileData?: any;
    initialSocialLinks?: any;
}

export default function ProfileInfoForm({
    userRole,
    isVerified,
    initialProfileData,
    initialSocialLinks
}: ProfileInfoFormProps) {
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(initialProfileData || {});
    const [socialLinks, setSocialLinks] = useState(Array.isArray(initialSocialLinks) ? initialSocialLinks : []);
    const [openLocation, setOpenLocation] = useState(false);
    const [newSector, setNewSector] = useState("");

    // Helper functions for profile data updates
    const updateProfile = (field: string, value: any) => {
        setProfileData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveProfileData(profileData);
            alert('Profil bilgileri kaydedildi!');
        } catch (error) {
            alert('Kaydedilemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveSocialLinks(socialLinks);
            alert('Sosyal medya linkleri kaydedildi!');
        } catch (error) {
            alert('Kaydedilemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleMultiSelect = (field: string, value: string) => {
        const current = profileData[field] || [];
        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value];
        updateProfile(field, updated);
    };

    const handleAddSector = () => {
        if (!newSector.trim()) return;
        handleMultiSelect(userRole === 'INVESTOR' ? 'interestSectors' : 'industries', newSector.trim());
        setNewSector("");
    };

    // Social Link Logic
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

    return (
        <div className="space-y-6">
            {/* Verification Status */}
            <Card className="border-l-4 border-l-nuper-blue">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-nuper-blue" />
                            Doğrulama Durumu
                        </CardTitle>
                        <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-green-600" : ""}>
                            {isVerified ? "✓ Doğrulandı" : "Doğrulanmadı"}
                        </Badge>
                    </div>
                </CardHeader>
                {!isVerified && (
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Profilinizi doldurun ve sosyal medya hesaplarınızı ekleyin. Doğrulama süreci yakında aktif olacak.
                        </p>
                    </CardContent>
                )}
            </Card>

            {/* Role-Specific Profile Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Profil Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        {userRole === "ENTREPRENEUR" ? (
                            <>
                                {/* Entrepreneur Fields */}
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
                                        {/* Custom Sectors Display */}
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
                                        <select
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-nuper-blue focus:border-transparent transition-all"
                                            value={profileData.businessStage || ''}
                                            onChange={(e) => updateProfile('businessStage', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {BUSINESS_STAGES.map((stage) => (
                                                <option key={stage} value={stage}>{stage}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Aranan Yatırım Miktarı</Label>
                                        <select
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-nuper-blue focus:border-transparent transition-all"
                                            value={profileData.investmentRange || ''}
                                            onChange={(e) => updateProfile('investmentRange', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {INVESTMENT_RANGES.map((range) => (
                                                <option key={range} value={range}>{range}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2 flex flex-col">
                                        <Label>Konum</Label>
                                        <Popover open={openLocation} onOpenChange={setOpenLocation}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openLocation}
                                                    className="w-full justify-between font-normal text-left"
                                                >
                                                    {profileData.location
                                                        ? LOCATIONS.find((location) => location === profileData.location) || profileData.location
                                                        : "Şehir seçiniz..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Şehir ara..." />
                                                    <CommandList>
                                                        <CommandEmpty>Şehir bulunamadı.</CommandEmpty>
                                                        <CommandGroup>
                                                            {LOCATIONS.map((location) => (
                                                                <CommandItem
                                                                    key={location}
                                                                    value={location}
                                                                    onSelect={(currentValue) => {
                                                                        updateProfile("location", currentValue === profileData.location ? "" : currentValue)
                                                                        setOpenLocation(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            profileData.location === location ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {location}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ekip Büyüklüğü</Label>
                                        <select
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-nuper-blue focus:border-transparent transition-all"
                                            value={profileData.teamSize || ''}
                                            onChange={(e) => updateProfile('teamSize', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {TEAM_SIZES.map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
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

                                <div className="space-y-2">
                                    <Label>İş Tanımı (Max 500 karakter)</Label>
                                    <Textarea
                                        placeholder="İşinizi ve hedeflerinizi kısaca tanımlayın..."
                                        maxLength={500}
                                        rows={5}
                                        className="resize-none"
                                        value={profileData.businessDescription || ''}
                                        onChange={(e) => updateProfile('businessDescription', e.target.value)}
                                    />
                                    <p className="text-xs text-right text-gray-500">
                                        {(profileData.businessDescription || '').length}/500
                                    </p>
                                </div>
                            </>
                        ) : userRole === "INVESTOR" ? (
                            <>
                                {/* Investor Fields Refined */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Minimum Yatırım (TL)</Label>
                                        <Input
                                            type="number"
                                            placeholder="50000"
                                            value={profileData.investmentMin || ''}
                                            onChange={(e) => updateProfile('investmentMin', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Maximum Yatırım (TL)</Label>
                                        <Input
                                            type="number"
                                            placeholder="500000"
                                            value={profileData.investmentMax || ''}
                                            onChange={(e) => updateProfile('investmentMax', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Interest Sectors - Same Refined Logic */}
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

                                {/* Other Investor Fields (Condensed for brevity/readability, similar structure) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Konum Tercihi</Label>
                                        <Popover open={openLocation} onOpenChange={setOpenLocation}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openLocation}
                                                    className="w-full justify-between font-normal text-left"
                                                >
                                                    {profileData.locationPreference
                                                        ? LOCATIONS.find((location) => location === profileData.locationPreference) || profileData.locationPreference
                                                        : "Şehir seçiniz..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Şehir ara..." />
                                                    <CommandList>
                                                        <CommandEmpty>Şehir bulunamadı.</CommandEmpty>
                                                        <CommandGroup>
                                                            {LOCATIONS.map((location) => (
                                                                <CommandItem
                                                                    key={location}
                                                                    value={location}
                                                                    onSelect={(currentValue) => {
                                                                        updateProfile("locationPreference", currentValue === profileData.locationPreference ? "" : currentValue)
                                                                        setOpenLocation(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            profileData.locationPreference === location ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {location}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Yatırımcı Türü</Label>
                                        <select
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md"
                                            value={profileData.investorType || ''}
                                            onChange={(e) => updateProfile('investorType', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {INVESTOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Yatırım Deneyimi</Label>
                                        <select
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md"
                                            value={profileData.experience || ''}
                                            onChange={(e) => updateProfile('experience', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {EXPERIENCE_RANGES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Portföy Büyüklüğü</Label>
                                        <select
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md"
                                            value={profileData.portfolioSize || ''}
                                            onChange={(e) => updateProfile('portfolioSize', e.target.value)}
                                        >
                                            <option value="">Seçiniz</option>
                                            {PORTFOLIO_SIZES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">Lütfen önce kullanıcı rolünüzü seçin.</p>
                        )}

                        {userRole && (
                            <Button type="submit" disabled={loading} className="w-full bg-nuper-blue hover:bg-nuper-dark-blue">
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Kaydediliyor...' : 'Profil Bilgilerini Kaydet'}
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Dynamic Social Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Sosyal Medya Bağlantıları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSocialSubmit} className="space-y-4">
                        {socialLinks.map((link: any, index: number) => (
                            <div key={index} className="flex gap-2 items-start">
                                <select
                                    className="w-1/3 p-2.5 bg-white border border-gray-200 rounded-md"
                                    value={link.platform}
                                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                >
                                    {SOCIAL_PLATFORMS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
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

                        <Button type="button" variant="outline" onClick={addSocialLink} className="w-full border-dashed">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Bağlantı Ekle
                        </Button>

                        <Button type="submit" disabled={loading} className="w-full mt-4">
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Kaydediliyor...' : 'Bağlantıları Kaydet'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
