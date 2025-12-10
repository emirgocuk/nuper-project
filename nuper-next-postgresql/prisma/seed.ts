import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('remege12', 12)
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
            password, // remege12
            role: 'ADMIN',
            isVerified: true,
            userRole: 'INVESTOR' // Or leave blank, but better to have some default
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
