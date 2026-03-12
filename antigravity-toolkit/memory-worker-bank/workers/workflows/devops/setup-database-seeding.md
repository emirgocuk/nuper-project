# Setup Database Seeding
Source: https://antigravity.codes/workflows/devops/setup-prisma-database-seeding-faker

## AI Worker Instructions
When the user requests functionality related to Setup Database Seeding, follow these guidelines and utilize this context.

## Scraped Content

# Setup Database Seeding
```
npm install --save-dev @faker-js/faker
```
```
prisma/seed.ts
```
```
import { PrismaClient } from '@prisma/client';   import { faker } from '@faker-js/faker';      const prisma = new PrismaClient();      async function main() {     // Clear existing data     await prisma.post.deleteMany();     await prisma.user.deleteMany();          // Create 10 users     const users = await Promise.all(       Array.from({ length: 10 }).map(() =>         prisma.user.create({           data: {             email: faker.internet.email(),             name: faker.person.fullName(),             avatar: faker.image.avatar(),           },         })       )     );          // Create 50 posts     await Promise.all(       Array.from({ length: 50 }).map(() =>         prisma.post.create({           data: {             title: faker.lorem.sentence(),             content: faker.lorem.paragraphs(3),             authorId: faker.helpers.arrayElement(users).id,           },         })       )     );          console.log('✅ Database seeded successfully');   }      main()     .catch(console.error)     .finally(() => prisma.$disconnect());
```
```
import { PrismaClient } from '@prisma/client';   import { faker } from '@faker-js/faker';      const prisma = new PrismaClient();      async function main() {     // Clear existing data     await prisma.post.deleteMany();     await prisma.user.deleteMany();          // Create 10 users     const users = await Promise.all(       Array.from({ length: 10 }).map(() =>         prisma.user.create({           data: {             email: faker.internet.email(),             name: faker.person.fullName(),             avatar: faker.image.avatar(),           },         })       )     );          // Create 50 posts     await Promise.all(       Array.from({ length: 50 }).map(() =>         prisma.post.create({           data: {             title: faker.lorem.sentence(),             content: faker.lorem.paragraphs(3),             authorId: faker.helpers.arrayElement(users).id,           },         })       )     );          console.log('✅ Database seeded successfully');   }      main()     .catch(console.error)     .finally(() => prisma.$disconnect());
```
```
{     "prisma": {       "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"     },     "scripts": {       "db:seed": "prisma db seed"     }   }
```
```
{     "prisma": {       "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"     },     "scripts": {       "db:seed": "prisma db seed"     }   }
```
```
npm run db:seed
```
```
npx prisma migrate reset
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-prisma-database-seeding-faker.md
```
setup-prisma-database-seeding-faker.md
```
- In Antigravity, type /setup_prisma_database_seeding_faker or just describe what you want to do
```
/setup_prisma_database_seeding_faker
```
Learn more about workflows →

# Related Workflows

# Database Migration Rollback

# Analyze Bundle Size

# Setup Vercel Cron Jobs

