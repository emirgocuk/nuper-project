'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Sparkles, Lock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AdminSecretLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                isAdminLogin: 'true',
                redirect: false,
            });

            if (result?.error) {
                toast.error("Giriş başarısız: Yetkisiz erişim denemesi.");
            } else {
                toast.success("Yönetici girişi onaylandı.");
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            toast.error("Sistem hatası.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),rgba(0,0,0,0))]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

            <Card className="w-[400px] border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur-sm z-10">
                <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse">
                            <Lock className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent font-heading">
                        Yönetim Paneli
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Güvenli Erişim Kapısı
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Kimlik</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="yönetici@nuper.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500 text-slate-200 placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Anahtar</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500 text-slate-200"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 ring-offset-slate-900 border-0"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 animate-spin" /> Doğrulanıyor...
                                </span>
                            ) : (
                                "Sisteme Giriş"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-slate-800 pt-6">
                    <p className="text-xs text-slate-600 font-mono tracking-wider">
                        SECURE_GATEWAY_V2.4 • {new Date().getFullYear()}
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
