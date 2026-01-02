const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking prisma.idea...');
    if (prisma.idea) {
        console.log('SUCCESS: prisma.idea exists!');
        // Try a simple count to be sure
        const count = await prisma.idea.count();
        console.log(`Count: ${count}`);
    } else {
        console.error('FAILURE: prisma.idea is undefined!');
        console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
