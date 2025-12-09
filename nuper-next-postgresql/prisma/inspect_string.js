
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function inspect() {
    let log = 'Testing String input for Json field...\n';
    try {
        const res = await prisma.event.create({
            data: {
                title: "Test String 3",
                slug: "test-string-" + Date.now(),
                content: JSON.stringify({ foo: "bar" }), // Passing String
                published: true
            }
        });
        log += "Success with String! ID: " + res.id + "\n";
        // Cleanup
        await prisma.event.delete({ where: { id: res.id } });
    } catch (e) {
        log += "Error with String:\n" + e.message + "\n";
    }
    fs.writeFileSync('prisma_error.log', log);
}

inspect()
    .catch((e) => fs.writeFileSync('prisma_error.log', e.message))
    .finally(() => prisma.$disconnect());
