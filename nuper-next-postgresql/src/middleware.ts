import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { pathname } = req.nextUrl
    const session = req.auth

    // ─── Admin Rotaları Koruması ────────────────────────────────────────────────
    // /admin/* altındaki her şeyi koru — sadece /admin/login hariç
    const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login"
    if (isAdminRoute) {
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/admin/login", req.url))
        }
    }

    // ─── Doğrulanmamış Kullanıcı Yönlendirmesi ──────────────────────────────────
    // Giriş yapmış ama email onayı yapılmamış kullanıcıları bekletme sayfasına at
    const protectedRoutes = ["/dashboard", "/my-projects", "/my-ideas", "/profile"]
    const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

    if (isProtected && session && session.user.isVerified === false) {
        return NextResponse.redirect(new URL("/verify-email", req.url))
    }

    // ─── Giriş Gerektiren Sayfalara Anonim Kullanıcı Erişimi ────────────────────
    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/admin/:path*",
        "/dashboard/:path*",
        "/my-projects/:path*",
        "/my-ideas/:path*",
        "/profile/:path*",
    ],
}
