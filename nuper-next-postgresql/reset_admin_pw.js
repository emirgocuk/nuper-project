const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
    const email = 'admin@nuper.com';
    const newPassword = 'Awseqdll.12';

    try {
        const hashedPassword = await hash(newPassword, 10);

        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'ADMIN',
                isVerified: true
            }
        });

        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        console.log(`User ID: ${user.id}`);
        console.log(`User Role: ${user.role}`);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
