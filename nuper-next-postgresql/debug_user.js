const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser(email) {
    console.log(`Checking user: ${email}`);
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            console.log('User NOT found.');
        } else {
            console.log('User found:');
            console.log(`- ID: ${user.id}`);
            console.log(`- Email: ${user.email}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Verified: ${user.isVerified}`);
            console.log(`- Password Set: ${!!user.password}`);
        }
    } catch (e) {
        console.error('Error querying database:', e);
    } finally {
        await prisma.$disconnect();
    }
}

const emailToCheck = process.argv[2] || "ozanemirgoncuk@gmail.com";
checkUser(emailToCheck);
