
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
    console.log('Prisma Client Version:', require('@prisma/client/package.json').version);
    // There is no easy way to inspect runtime types without explicit dmmf access, 
    // but we can try to rely on typescript or just test the behavior.

    // We will try to create a dummy event with Object content
    try {
        console.log("Attempting to validate Event create with Object content...");
        // We won't actually await this or we wrap it in a transaction we rollback, 
        // or just catch the validation error.
        await prisma.event.create({
            data: {
                title: "Test",
                slug: "test-" + Date.now(),
                content: { foo: "bar" }, // Object
                published: true
            }
        });
        console.log("Success with Object!");
    } catch (e) {
        console.log("Error with Object:", e.message);
    }

    // Try with String
    try {
        console.log("Attempting to validate Event create with String content...");
        await prisma.event.create({
            data: {
                title: "Test String",
                slug: "test-string-" + Date.now(),
                content: JSON.stringify({ foo: "bar" }), // String
                published: true
            }
        });
        console.log("Success with String!");
    } catch (e) {
        console.log("Error with String:", e.message);
    }
}

inspect()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
