'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!name || !email || !password) {
        return { error: 'Tüm alanları doldurunuz.' }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: 'Bu email adresi zaten kullanımda.' }
        }

        const hashedPassword = await hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        })

        return { success: true }
    } catch (error) {
        console.error('Registration error:', error)
        return { error: 'Kayıt oluşturulurken bir hata meydana geldi.' }
    }
}
