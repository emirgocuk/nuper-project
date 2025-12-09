'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/admin",
            });

            if (result?.error) {
                setError("Giriş bilgileri hatalı veya yetkiniz yok.");
            }
        } catch (err) {
            setError("Bir hata oluştu.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Card className="w-[400px] border-none shadow-2xl bg-white/95">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <ShieldAlert className="w-8 h-8 text-red-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Yönetici Girişi</CardTitle>
                    <CardDescription>Sadece yetkili personel içindir.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@nuper.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Giriş Yap
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t pt-4">
                    <p className="text-xs text-gray-500">Nuper Yönetim Paneli v1.0</p>
                </CardFooter>
            </Card>
        </div>
    )
}
