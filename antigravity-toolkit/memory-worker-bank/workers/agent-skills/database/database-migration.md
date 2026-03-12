# database-migration
Source: https://antigravity.codes/agent-skills/database/database-migration

## AI Worker Instructions
When the user requests functionality related to database-migration, follow these guidelines and utilize this context.

## Scraped Content

# database-migration
```
// migrations/20231201-create-users.jsmodule.exports = {  up: async (queryInterface, Sequelize) => {    await queryInterface.createTable("users", {      id: {        type: Sequelize.INTEGER,        primaryKey: true,        autoIncrement: true,      },      email: {        type: Sequelize.STRING,        unique: true,        allowNull: false,      },      createdAt: Sequelize.DATE,      updatedAt: Sequelize.DATE,    });  },  down: async (queryInterface, Sequelize) => {    await queryInterface.dropTable("users");  },};// Run: npx sequelize-cli db:migrate// Rollback: npx sequelize-cli db:migrate:undo
```
```
// migrations/20231201-create-users.jsmodule.exports = {  up: async (queryInterface, Sequelize) => {    await queryInterface.createTable("users", {      id: {        type: Sequelize.INTEGER,        primaryKey: true,        autoIncrement: true,      },      email: {        type: Sequelize.STRING,        unique: true,        allowNull: false,      },      createdAt: Sequelize.DATE,      updatedAt: Sequelize.DATE,    });  },  down: async (queryInterface, Sequelize) => {    await queryInterface.dropTable("users");  },};// Run: npx sequelize-cli db:migrate// Rollback: npx sequelize-cli db:migrate:undo
```
```
// migrations/1701234567-CreateUsers.tsimport { MigrationInterface, QueryRunner, Table } from "typeorm";export class CreateUsers1701234567 implements MigrationInterface {  public async up(queryRunner: QueryRunner): Promise<void> {    await queryRunner.createTable(      new Table({        name: "users",        columns: [          {            name: "id",            type: "int",            isPrimary: true,            isGenerated: true,            generationStrategy: "increment",          },          {            name: "email",            type: "varchar",            isUnique: true,          },          {            name: "created_at",            type: "timestamp",            default: "CURRENT_TIMESTAMP",          },        ],      }),    );  }  public async down(queryRunner: QueryRunner): Promise<void> {    await queryRunner.dropTable("users");  }}// Run: npm run typeorm migration:run// Rollback: npm run typeorm migration:revert
```
```
// migrations/1701234567-CreateUsers.tsimport { MigrationInterface, QueryRunner, Table } from "typeorm";export class CreateUsers1701234567 implements MigrationInterface {  public async up(queryRunner: QueryRunner): Promise<void> {    await queryRunner.createTable(      new Table({        name: "users",        columns: [          {            name: "id",            type: "int",            isPrimary: true,            isGenerated: true,            generationStrategy: "increment",          },          {            name: "email",            type: "varchar",            isUnique: true,          },          {            name: "created_at",            type: "timestamp",            default: "CURRENT_TIMESTAMP",          },        ],      }),    );  }  public async down(queryRunner: QueryRunner): Promise<void> {    await queryRunner.dropTable("users");  }}// Run: npm run typeorm migration:run// Rollback: npm run typeorm migration:revert
```
```
// schema.prismamodel User {  id        Int      @id @default(autoincrement())  email     String   @unique  createdAt DateTime @default(now())}// Generate migration: npx prisma migrate dev --name create_users// Apply: npx prisma migrate deploy
```
```
// schema.prismamodel User {  id        Int      @id @default(autoincrement())  email     String   @unique  createdAt DateTime @default(now())}// Generate migration: npx prisma migrate dev --name create_users// Apply: npx prisma migrate deploy
```
```
// Safe migration: add column with defaultmodule.exports = {  up: async (queryInterface, Sequelize) => {    await queryInterface.addColumn("users", "status", {      type: Sequelize.STRING,      defaultValue: "active",      allowNull: false,    });  },  down: async (queryInterface) => {    await queryInterface.removeColumn("users", "status");  },};
```
```
// Safe migration: add column with defaultmodule.exports = {  up: async (queryInterface, Sequelize) => {    await queryInterface.addColumn("users", "status", {      type: Sequelize.STRING,      defaultValue: "active",      allowNull: false,    });  },  down: async (queryInterface) => {    await queryInterface.removeColumn("users", "status");  },};
```
```
// Step 1: Add new columnmodule.exports = {  up: async (queryInterface, Sequelize) => {    await queryInterface.addColumn("users", "full_name", {      type: Sequelize.STRING,    });    // Copy data from old column    await queryInterface.sequelize.query("UPDATE users SET full_name = name");  },  down: async (queryInterface) => {    await queryInterface.removeColumn("users", "full_name");  },};// Step 2: Update application to use new column// Step 3: Remove old columnmodule.exports = {  up: async (queryInterface) => {    await queryInterface.removeColumn("users", "name");  },  down: async (queryInterface, Sequelize) => {    await queryInterface.addColumn("users", "name", {      type: Sequelize.STRING,    });  },};
```
```
// Step 1: Add new columnmodule.exports = {  up: async (queryInterface, Sequelize) => {    await queryInterface.addColumn("users", "full_name", {      type: Sequelize.STRING,    });    // Copy data from old column    await queryInterface.sequelize.query("UPDATE users SET full_name = name");  },  down: async (queryInterface) => {    await queryInterface.removeColumn("users", "full_name");  },};// Step 2: Update application to use new column// Step 3: Remove old columnmodule.exports = {  up: async (queryInterface) => {    await queryInterface.removeColumn("users", "name");  },  down: async (queryInterface, Sequelize) => {    await queryInterface.addColumn("users", "name", {      type: Sequelize.STRING,    });  },};
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    // For large tables, use multi-step approach    // 1. Add new column    await queryInterface.addColumn("users", "age_new", {      type: Sequelize.INTEGER,    });    // 2. Copy and transform data    await queryInterface.sequelize.query(      UPDATE users      SET age_new = CAST(age AS INTEGER)      WHERE age IS NOT NULL    );    // 3. Drop old column    await queryInterface.removeColumn("users", "age");    // 4. Rename new column    await queryInterface.renameColumn("users", "age_new", "age");  },  down: async (queryInterface, Sequelize) => {    await queryInterface.changeColumn("users", "age", {      type: Sequelize.STRING,    });  },};
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    // For large tables, use multi-step approach    // 1. Add new column    await queryInterface.addColumn("users", "age_new", {      type: Sequelize.INTEGER,    });    // 2. Copy and transform data    await queryInterface.sequelize.query(      UPDATE users      SET age_new = CAST(age AS INTEGER)      WHERE age IS NOT NULL    );    // 3. Drop old column    await queryInterface.removeColumn("users", "age");    // 4. Rename new column    await queryInterface.renameColumn("users", "age_new", "age");  },  down: async (queryInterface, Sequelize) => {    await queryInterface.changeColumn("users", "age", {      type: Sequelize.STRING,    });  },};
```
```
UPDATE users      SET age_new = CAST(age AS INTEGER)      WHERE age IS NOT NULL
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    // Get all records    const [users] = await queryInterface.sequelize.query(      "SELECT id, address_string FROM users",    );    // Transform each record    for (const user of users) {      const addressParts = user.address_string.split(",");      await queryInterface.sequelize.query(        UPDATE users         SET street = :street,             city = :city,             state = :state         WHERE id = :id,        {          replacements: {            id: user.id,            street: addressParts[0]?.trim(),            city: addressParts[1]?.trim(),            state: addressParts[2]?.trim(),          },        },      );    }    // Drop old column    await queryInterface.removeColumn("users", "address_string");  },  down: async (queryInterface, Sequelize) => {    // Reconstruct original column    await queryInterface.addColumn("users", "address_string", {      type: Sequelize.STRING,    });    await queryInterface.sequelize.query(      UPDATE users      SET address_string = CONCAT(street, ', ', city, ', ', state)    );    await queryInterface.removeColumn("users", "street");    await queryInterface.removeColumn("users", "city");    await queryInterface.removeColumn("users", "state");  },};
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    // Get all records    const [users] = await queryInterface.sequelize.query(      "SELECT id, address_string FROM users",    );    // Transform each record    for (const user of users) {      const addressParts = user.address_string.split(",");      await queryInterface.sequelize.query(        UPDATE users         SET street = :street,             city = :city,             state = :state         WHERE id = :id,        {          replacements: {            id: user.id,            street: addressParts[0]?.trim(),            city: addressParts[1]?.trim(),            state: addressParts[2]?.trim(),          },        },      );    }    // Drop old column    await queryInterface.removeColumn("users", "address_string");  },  down: async (queryInterface, Sequelize) => {    // Reconstruct original column    await queryInterface.addColumn("users", "address_string", {      type: Sequelize.STRING,    });    await queryInterface.sequelize.query(      UPDATE users      SET address_string = CONCAT(street, ', ', city, ', ', state)    );    await queryInterface.removeColumn("users", "street");    await queryInterface.removeColumn("users", "city");    await queryInterface.removeColumn("users", "state");  },};
```
```
UPDATE users         SET street = :street,             city = :city,             state = :state         WHERE id = :id
```
```
UPDATE users      SET address_string = CONCAT(street, ', ', city, ', ', state)
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    const transaction = await queryInterface.sequelize.transaction();    try {      await queryInterface.addColumn(        "users",        "verified",        { type: Sequelize.BOOLEAN, defaultValue: false },        { transaction },      );      await queryInterface.sequelize.query(        "UPDATE users SET verified = true WHERE email_verified_at IS NOT NULL",        { transaction },      );      await transaction.commit();    } catch (error) {      await transaction.rollback();      throw error;    }  },  down: async (queryInterface) => {    await queryInterface.removeColumn("users", "verified");  },};
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    const transaction = await queryInterface.sequelize.transaction();    try {      await queryInterface.addColumn(        "users",        "verified",        { type: Sequelize.BOOLEAN, defaultValue: false },        { transaction },      );      await queryInterface.sequelize.query(        "UPDATE users SET verified = true WHERE email_verified_at IS NOT NULL",        { transaction },      );      await transaction.commit();    } catch (error) {      await transaction.rollback();      throw error;    }  },  down: async (queryInterface) => {    await queryInterface.removeColumn("users", "verified");  },};
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    // Create backup table    await queryInterface.sequelize.query(      "CREATE TABLE users_backup AS SELECT * FROM users",    );    try {      // Perform migration      await queryInterface.addColumn("users", "new_field", {        type: Sequelize.STRING,      });      // Verify migration      const [result] = await queryInterface.sequelize.query(        "SELECT COUNT(*) as count FROM users WHERE new_field IS NULL",      );      if (result[0].count > 0) {        throw new Error("Migration verification failed");      }      // Drop backup      await queryInterface.dropTable("users_backup");    } catch (error) {      // Restore from backup      await queryInterface.sequelize.query("DROP TABLE users");      await queryInterface.sequelize.query(        "CREATE TABLE users AS SELECT * FROM users_backup",      );      await queryInterface.dropTable("users_backup");      throw error;    }  },};
```
```
module.exports = {  up: async (queryInterface, Sequelize) => {    // Create backup table    await queryInterface.sequelize.query(      "CREATE TABLE users_backup AS SELECT * FROM users",    );    try {      // Perform migration      await queryInterface.addColumn("users", "new_field", {        type: Sequelize.STRING,      });      // Verify migration      const [result] = await queryInterface.sequelize.query(        "SELECT COUNT(*) as count FROM users WHERE new_field IS NULL",      );      if (result[0].count > 0) {        throw new Error("Migration verification failed");      }      // Drop backup      await queryInterface.dropTable("users_backup");    } catch (error) {      // Restore from backup      await queryInterface.sequelize.query("DROP TABLE users");      await queryInterface.sequelize.query(        "CREATE TABLE users AS SELECT * FROM users_backup",      );      await queryInterface.dropTable("users_backup");      throw error;    }  },};
```
```
// Phase 1: Make changes backward compatiblemodule.exports = {  up: async (queryInterface, Sequelize) => {    // Add new column (both old and new code can work)    await queryInterface.addColumn("users", "email_new", {      type: Sequelize.STRING,    });  },};// Phase 2: Deploy code that writes to both columns// Phase 3: Backfill datamodule.exports = {  up: async (queryInterface) => {    await queryInterface.sequelize.query(      UPDATE users      SET email_new = email      WHERE email_new IS NULL    );  },};// Phase 4: Deploy code that reads from new column// Phase 5: Remove old columnmodule.exports = {  up: async (queryInterface) => {    await queryInterface.removeColumn("users", "email");  },};
```
```
// Phase 1: Make changes backward compatiblemodule.exports = {  up: async (queryInterface, Sequelize) => {    // Add new column (both old and new code can work)    await queryInterface.addColumn("users", "email_new", {      type: Sequelize.STRING,    });  },};// Phase 2: Deploy code that writes to both columns// Phase 3: Backfill datamodule.exports = {  up: async (queryInterface) => {    await queryInterface.sequelize.query(      UPDATE users      SET email_new = email      WHERE email_new IS NULL    );  },};// Phase 4: Deploy code that reads from new column// Phase 5: Remove old columnmodule.exports = {  up: async (queryInterface) => {    await queryInterface.removeColumn("users", "email");  },};
```
```
UPDATE users      SET email_new = email      WHERE email_new IS NULL
```
```
// Handle differencesmodule.exports = {  up: async (queryInterface, Sequelize) => {    const dialectName = queryInterface.sequelize.getDialect();    if (dialectName === "mysql") {      await queryInterface.createTable("users", {        id: {          type: Sequelize.INTEGER,          primaryKey: true,          autoIncrement: true,        },        data: {          type: Sequelize.JSON, // MySQL JSON type        },      });    } else if (dialectName === "postgres") {      await queryInterface.createTable("users", {        id: {          type: Sequelize.INTEGER,          primaryKey: true,          autoIncrement: true,        },        data: {          type: Sequelize.JSONB, // PostgreSQL JSONB type        },      });    }  },};
```
```
// Handle differencesmodule.exports = {  up: async (queryInterface, Sequelize) => {    const dialectName = queryInterface.sequelize.getDialect();    if (dialectName === "mysql") {      await queryInterface.createTable("users", {        id: {          type: Sequelize.INTEGER,          primaryKey: true,          autoIncrement: true,        },        data: {          type: Sequelize.JSON, // MySQL JSON type        },      });    } else if (dialectName === "postgres") {      await queryInterface.createTable("users", {        id: {          type: Sequelize.INTEGER,          primaryKey: true,          autoIncrement: true,        },        data: {          type: Sequelize.JSONB, // PostgreSQL JSONB type        },      });    }  },};
```
This powerful AI agent skill empowers developers to navigate the complexities of database schema evolution and data movement with precision. It automates critical steps for seamless transitions between different ORMs, ensuring data integrity and application uptime. From creating new tables to refactoring existing models, this skill provides intelligent assistance, streamlining development workflows. Leverage its capabilities to implement robust migration strategies, minimize risks, and maintain a consistent, high-performing data layer across your projects.

# When to Use This Skill
- •Implementing a new feature requiring significant schema changes with no service interruption.
- •Refactoring a legacy database schema to a modern ORM (e.g., Sequelize to Prisma).
- •Performing large-scale data transformations or data type changes in a production environment.
- •Setting up automated, fault-tolerant deployment pipelines for database updates.

# Pro Tips
- 💡Always test migrations thoroughly in a staging environment before applying them to production, including rollback scenarios.
- 💡Utilize transactional migrations where possible to ensure atomicity and easier recovery from failures.
- 💡Break down large migrations into smaller, reversible steps to minimize risk and simplify debugging.

