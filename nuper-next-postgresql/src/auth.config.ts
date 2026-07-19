import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
    session: { strategy: "jwt" },
    pages: {
        signIn: '/login',
    },
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
    ],
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
} satisfies NextAuthConfig;
