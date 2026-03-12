import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import type { Adapter } from "next-auth/adapters"
import { logger } from "@/lib/logger"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    session: { strategy: "jwt" },
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
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
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                session.user.role = token.role as string;
                session.user.userRole = token.userRole as string | undefined;
                session.user.isVerified = token.isVerified as boolean | undefined;
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.userRole = user.userRole
                token.isVerified = user.isVerified
            }
            return token
        }
    }
})
