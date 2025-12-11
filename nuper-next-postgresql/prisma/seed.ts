import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

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
