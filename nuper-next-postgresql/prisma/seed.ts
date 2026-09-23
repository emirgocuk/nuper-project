import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

let connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''
const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1")

const pool = new Pool({
    connectionString,
    ssl: isLocalhost ? false : {
        rejectUnauthorized: false
    }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await hash('Xk9$vL2#mP5@qR8', 12)
    const user = await prisma.user.upsert({
        where: { email: 'admin@nuper.com' },
        update: {
            role: 'ADMIN',
            password,
            name: 'Super Admin',
            isVerified: true
        },
        create: {
            email: 'admin@nuper.com',
            name: 'Super Admin',
            password, // Xk9$vL2#mP5@qR8
            role: 'ADMIN',
            isVerified: true,
            userRole: 'INVESTOR'
        },
    })
    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
