import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Shield } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-4xl px-4 mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold font-heading text-nuper-dark-blue">Hakkımızda</h1>
                    <p className="text-xl text-gray-600">Nuper olarak geleceği şekillendiren projeler üretiyoruz.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-12">
                    <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                                <Users className="w-8 h-8 text-nuper-blue" />
                            </div>
                            <CardTitle className="text-xl">Ekibimiz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Alanında uzman, tutkulu ve deneyimli profesyonellerden oluşan dinamik bir kadro.</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                                <Target className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="text-xl">Vizyonumuz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Teknoloji ve inovasyonla sürdürülebilir bir gelecek inşa etmek.</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="mx-auto bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                                <Shield className="w-8 h-8 text-purple-600" />
                            </div>
                            <CardTitle className="text-xl">Değerlerimiz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Güven, şeffaflık ve kalite odaklı çalışma prensipleri.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="prose max-w-none bg-white p-8 rounded-xl shadow-sm">
                    <h3>Hikayemiz</h3>
                    <p>
                        Nuper, teknoloji dünyasındaki yenilikleri yakından takip eden ve bu yenilikleri iş dünyasına entegre etmeyi hedefleyen bir girişim olarak yola çıktı.
                        Kurulduğumuz günden bu yana, müşteri memnuniyetini ve kaliteyi her şeyin üzerinde tutarak, sayısız başarılı projeye imza attık.
                    </p>
                    <p>
                        Sadece bir yazılım şirketi değil, aynı zamanda iş ortaklarımızın dijital dönüşüm yolculuğunda onlara rehberlik eden bir çözüm ortağıyız.
                    </p>
                </div>
            </div>
        </div>
    );
}
