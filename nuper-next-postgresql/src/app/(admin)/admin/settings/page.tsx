"use client";

import { useAdminSettings } from "@/context/AdminSettingsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    const { isDevMode, toggleDevMode } = useAdminSettings();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="mb-6 text-3xl font-bold font-heading text-gray-900">Ayarlar</h1>

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
        </div>
    );
}
