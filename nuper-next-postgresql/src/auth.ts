import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Adapter } from "next-auth/adapters"
import { logger } from "@/lib/logger"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        ...authConfig.providers,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                isAdminLogin: { label: "Is Admin Login", type: "text" },
            },
            authorize: async (credentials) => {
                try {
                    const email = credentials.email as string
                    const password = credentials.password as string
                    const isAdminLogin = credentials.isAdminLogin === 'true'

                    if (!email || !password) {
                        return null
                    }

                    const user = await prisma.user.findUnique({
                        where: { email },
                    })

                    if (!user || !user.password) {
                        return null
                    }

                    if (!user.isVerified) {
                        throw new Error("Hesabınız doğrulanmamış. Lütfen email kutunuzu kontrol edin.");
                    }

                    const isPasswordValid = await compare(password, user.password)

                    if (!isPasswordValid) {
                        return null
                    }

                    // Strict Role Separation
                    if (user.role === 'ADMIN') {
                        if (!isAdminLogin) {
                            throw new Error("Lütfen Yönetici Paneli girişini kullanın.");
                        }
                    } else {
                        if (isAdminLogin) {
                            throw new Error("Bu alana erişim yetkiniz yok.");
                        }
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        userRole: user.userRole ?? undefined,
                        isVerified: user.isVerified,
                    }
                } catch (error) {
                    logger.error('Auth credential error', error, {
                        email: credentials?.email as string,
                    })
                    throw error;
                }
            },
        }),
    ],
})
