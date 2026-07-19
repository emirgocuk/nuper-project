import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BadgeCheck, XCircle, Clock, User, Calendar,
  Lightbulb, BarChart3, DollarSign, Timer, Users, FileText,
  BrainCircuit, CheckCircle2, AlertTriangle
} from "lucide-react";
import { revalidatePath } from "next/cache";

async function getProject(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true, userRole: true, profileImage: true } } },
    });
  } catch {
    return null;
  }
}

async function approveProject(id: string) {
  "use server";
  await prisma.project.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/projects");
}

async function rejectProject(id: string) {
  "use server";
  await prisma.project.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/projects");
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  SUBMITTED: { label: "İnceleme Bekliyor", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  APPROVED:  { label: "Onaylandı",         color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: BadgeCheck },
  REJECTED:  { label: "Reddedildi",        color: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
  IDEA:      { label: "Fikir Aşaması",     color: "text-blue-700 bg-blue-50 border-blue-200", icon: Lightbulb },
};

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.SUBMITTED;
  const StatusIcon = status.icon;

  const approveWithId = approveProject.bind(null, project.id);
  const rejectWithId = rejectProject.bind(null, project.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Projelere Dön
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-700 truncate max-w-xs">{project.title}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.color}`}>
          <StatusIcon className="w-3.5 h-3.5" /> {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{project.title}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(project.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihinde gönderildi
                </p>
              </div>
            </div>
            {project.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Açıklama</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{project.description}</p>
              </div>
            )}
          </div>

          {/* AI Feasibility */}
          {project.aiFeasibilityReport && (
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl border border-blue-800/30 shadow-sm p-6 text-white">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
                <h2 className="font-bold text-blue-100">AI Fizibilite Raporu</h2>
                {project.aiDifficultyScore !== null && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                    project.aiDifficultyScore >= 75 ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                    project.aiDifficultyScore >= 50 ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}>
                    Zorluk: {project.aiDifficultyScore}/100
                  </span>
                )}
              </div>
              <p className="text-blue-100/80 text-sm leading-relaxed whitespace-pre-line">{project.aiFeasibilityReport}</p>
            </div>
          )}

          {/* Action Buttons */}
          {project.status === "SUBMITTED" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Admin Kararı
              </h3>
              <div className="flex gap-3">
                <form action={approveWithId} className="flex-1">
                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md active:scale-95">
                    <CheckCircle2 className="w-4 h-4" /> Projeyi Onayla
                  </button>
                </form>
                <form action={rejectWithId} className="flex-1">
                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-md active:scale-95">
                    <XCircle className="w-4 h-4" /> Projeyi Reddet
                  </button>
                </form>
              </div>
            </div>
          )}

          {project.status !== "SUBMITTED" && (
            <div className={`rounded-xl border p-4 flex items-center gap-3 ${project.status === "APPROVED" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
              {project.status === "APPROVED" ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
              <p className={`text-sm font-medium ${project.status === "APPROVED" ? "text-emerald-700" : "text-red-700"}`}>
                Bu proje {project.status === "APPROVED" ? "onaylanmış" : "reddedilmiş"} durumda.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Submitter */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Gönderen
            </h3>
            <div className="flex items-center gap-3">
              {project.user?.profileImage ? (
                <img src={project.user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 text-sm">{project.user?.name || "Anonim"}</p>
                <p className="text-xs text-gray-500">{project.user?.email || "—"}</p>
                {project.user?.userRole && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">
                    {project.user.userRole === "INVESTOR" ? "Yatırımcı" : "Girişimci"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Stats */}
          {(project.aiBudgetEstimate || project.aiTimeEstimate || project.aiDifficultyScore !== null || project.aiRolesNeeded) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> AI Tahminleri
              </h3>
              {project.aiBudgetEstimate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase">Bütçe</p>
                    <p className="text-sm font-bold text-gray-800">{project.aiBudgetEstimate}</p>
                  </div>
                </div>
              )}
              {project.aiTimeEstimate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Timer className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase">Süre</p>
                    <p className="text-sm font-bold text-gray-800">{project.aiTimeEstimate}</p>
                  </div>
                </div>
              )}
              {project.aiDifficultyScore !== null && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 font-medium uppercase mb-2">Teknik Zorluk</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${project.aiDifficultyScore >= 75 ? "bg-red-500" : project.aiDifficultyScore >= 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${project.aiDifficultyScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{project.aiDifficultyScore}/100</span>
                  </div>
                </div>
              )}
              {Array.isArray(project.aiRolesNeeded) && (project.aiRolesNeeded as string[]).length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <p className="text-[10px] text-gray-500 font-medium uppercase">Gerekli Roller</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.aiRolesNeeded as string[]).map((role, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-full border border-purple-100">{role}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Bilgiler
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Görünürlük</span>
                <span className="font-semibold text-gray-700">{project.visibility === "PUBLIC" ? "Herkese Açık" : project.visibility === "PRIVATE" ? "Özel" : "Yarı Açık"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tarih</span>
                <span className="text-gray-700 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(project.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



