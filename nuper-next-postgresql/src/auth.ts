import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const email = credentials.email as string
                    const password = credentials.password as string

                    if (!email || !password) {
                        return null
                    }

                    const user = await prisma.user.findUnique({
                        where: { email },
                    })

                    if (!user || !user.password) {
                        return null
                    }

                    // Real password comparison
                    const isPasswordValid = await compare(password, user.password)

                    if (!isPasswordValid) {
                        return null
                    }

                    const isLoginAdminRequest = (credentials as any).isAdminLogin === 'true';

                    // Strict Role Separation
                    if (user.role === 'ADMIN') {
                        if (!isLoginAdminRequest) {
                            throw new Error("Lütfen Yönetici Paneli girişini (adminlogin) kullanın.");
                        }
                    } else {
                        // User trying to login to Admin Panel
                        if (isLoginAdminRequest) {
                            throw new Error("Bu alana erişim yetkiniz yok.");
                        }
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    } as any
                } catch (error) {
                    console.error("Auth System Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.sub
                // @ts-ignore
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        }
    }
})
