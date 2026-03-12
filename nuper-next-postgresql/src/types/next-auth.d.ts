import { type DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string          // "USER" | "ADMIN"
            userRole?: string     // "INVESTOR" | "ENTREPRENEUR"
            isVerified?: boolean
        } & DefaultSession["user"]
    }

    interface User {
        role?: string
        userRole?: string
        isVerified?: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        userRole?: string
        isVerified?: boolean
        sub?: string
    }
}
