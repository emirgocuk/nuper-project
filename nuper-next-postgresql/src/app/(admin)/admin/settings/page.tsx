"use client";

import { useAdminSettings } from "@/context/AdminSettingsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { addAdminUser } from "@/actions/verification";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ShieldAlert, Plus, Save, Eye, EyeOff, Wand2 } from "lucide-react";

export default function SettingsPage() {
    const { isDevMode, toggleDevMode } = useAdminSettings();
    const { data: session } = useSession();
    const isSuperAdmin = session?.user?.email === 'admin@nuper.com';

    // Add Admin State
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addAdminUser(newAdmin);
            toast.success('Yeni yönetici başarıyla eklendi.');
            setNewAdmin({ name: '', email: '', password: '' });
        } catch (error: any) {
            toast.error(error.message || 'Yönetici eklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let retVal = "";
        for (let i = 0, n = charset.length; i < 12; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setNewAdmin({ ...newAdmin, password: retVal });
        setShowPassword(true);
        toast.info("Yeni şifre oluşturuldu.");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold font-heading text-gray-900">Ayarlar</h1>

            {/* Developer Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Geliştirici Seçenekleri</CardTitle>
                    <CardDescription>
                        Uygulama geliştirme ve test süreçlerini kolaylaştıran araçlar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="dev-mode" className="font-medium text-base">Geliştirici Modu</Label>
                            <span className="text-sm text-gray-500">
                                Etkinleştirildiğinde formlarda "Test Verisi Doldur" butonu aktif olur.
                            </span>
                        </div>
                        <Switch
                            id="dev-mode"
                            checked={isDevMode}
                            onCheckedChange={toggleDevMode}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Super Admin Panel */}
            {isSuperAdmin && (
                <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-900">
                            <ShieldAlert className="w-5 h-5" />
                            Süper Admin Paneli
                        </CardTitle>
                        <CardDescription className="text-purple-700">
                            Bu alan sadece "admin@nuper.com" hesabı tarafından görüntülenebilir. Sisteme yeni yöneticiler ekleyebilirsiniz.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddAdmin} className="space-y-4 bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-purple-600" />
                                Yeni Yönetici Ekle
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Ad Soyad</Label>
                                    <Input
                                        placeholder="Mehmet Yılmaz"
                                        required
                                        value={newAdmin.name}
                                        onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-posta Adresi</Label>
                                    <Input
                                        type="email"
                                        placeholder="yonetici@nuper.com"
                                        required
                                        value={newAdmin.email}
                                        onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Şifre</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="******"
                                            required
                                            value={newAdmin.password}
                                            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            className="pr-20"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-8 top-0 h-full px-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-2 hover:bg-transparent text-purple-600 hover:text-purple-700"
                                            onClick={generatePassword}
                                            title="Rastgele Şifre Oluştur"
                                            tabIndex={-1}
                                        >
                                            <Wand2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={loading} className="bg-purple-700 hover:bg-purple-800 text-white">
                                    {loading ? 'Ekleniyor...' : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Admin Olarak Kaydet
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
