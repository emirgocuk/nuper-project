# database-schema-designer
Source: https://antigravity.codes/agent-skills/database/database-schema-designer

## AI Worker Instructions
When the user requests functionality related to database-schema-designer, follow these guidelines and utilize this context.

## Scraped Content

# database-schema-designer
```
design a schema for an e-commerce platform with users, products, orders
```
```
design a schema for an e-commerce platform with users, products, orders
```
```
CREATE TABLE users (  id BIGINT AUTO_INCREMENT PRIMARY KEY,  email VARCHAR(255) UNIQUE NOT NULL,  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);CREATE TABLE orders (  id BIGINT AUTO_INCREMENT PRIMARY KEY,  user_id BIGINT NOT NULL REFERENCES users(id),  total DECIMAL(10,2) NOT NULL,  INDEX idx_orders_user (user_id));
```
```
CREATE TABLE users (  id BIGINT AUTO_INCREMENT PRIMARY KEY,  email VARCHAR(255) UNIQUE NOT NULL,  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);CREATE TABLE orders (  id BIGINT AUTO_INCREMENT PRIMARY KEY,  user_id BIGINT NOT NULL REFERENCES users(id),  total DECIMAL(10,2) NOT NULL,  INDEX idx_orders_user (user_id));
```
```
design schema
```
```
database design
```
```
create tables
```
```
schema for
```
```
model data
```
```
I need a database
```
```
design NoSQL
```
```
Your Data Requirements    |    v+-----------------------------------------------------+| Phase 1: ANALYSIS                                   || * Identify entities and relationships               || * Determine access patterns (read vs write heavy)   || * Choose SQL or NoSQL based on requirements         |+-----------------------------------------------------+    |    v+-----------------------------------------------------+| Phase 2: DESIGN                                     || * Normalize to 3NF (SQL) or embed/reference (NoSQL) || * Define primary keys and foreign keys              || * Choose appropriate data types                     || * Add constraints (UNIQUE, CHECK, NOT NULL)         |+-----------------------------------------------------+    |    v+-----------------------------------------------------+| Phase 3: OPTIMIZE                                   || * Plan indexing strategy                            || * Consider denormalization for read-heavy queries   || * Add timestamps (created_at, updated_at)           |+-----------------------------------------------------+    |    v+-----------------------------------------------------+| Phase 4: MIGRATE                                    || * Generate migration scripts (up + down)            || * Ensure backward compatibility                     || * Plan zero-downtime deployment                     |+-----------------------------------------------------+    |    vProduction-Ready Schema
```
```
Your Data Requirements    |    v+-----------------------------------------------------+| Phase 1: ANALYSIS                                   || * Identify entities and relationships               || * Determine access patterns (read vs write heavy)   || * Choose SQL or NoSQL based on requirements         |+-----------------------------------------------------+    |    v+-----------------------------------------------------+| Phase 2: DESIGN                                     || * Normalize to 3NF (SQL) or embed/reference (NoSQL) || * Define primary keys and foreign keys              || * Choose appropriate data types                     || * Add constraints (UNIQUE, CHECK, NOT NULL)         |+-----------------------------------------------------+    |    v+-----------------------------------------------------+| Phase 3: OPTIMIZE                                   || * Plan indexing strategy                            || * Consider denormalization for read-heavy queries   || * Add timestamps (created_at, updated_at)           |+-----------------------------------------------------+    |    v+-----------------------------------------------------+| Phase 4: MIGRATE                                    || * Generate migration scripts (up + down)            || * Ensure backward compatibility                     || * Plan zero-downtime deployment                     |+-----------------------------------------------------+    |    vProduction-Ready Schema
```
```
design schema for {domain}
```
```
normalize {table}
```
```
add indexes for {table}
```
```
migration for {change}
```
```
review schema
```
```
design schema
```
```
normalize
```
```
add indexes
```
```
migration
```
```
product_ids = '1,2,3'
```
```
-- BAD: Multiple values in columnCREATE TABLE orders (  id INT PRIMARY KEY,  product_ids VARCHAR(255)  -- '101,102,103');-- GOOD: Separate table for itemsCREATE TABLE orders (  id INT PRIMARY KEY,  customer_id INT);CREATE TABLE order_items (  id INT PRIMARY KEY,  order_id INT REFERENCES orders(id),  product_id INT);
```
```
-- BAD: Multiple values in columnCREATE TABLE orders (  id INT PRIMARY KEY,  product_ids VARCHAR(255)  -- '101,102,103');-- GOOD: Separate table for itemsCREATE TABLE orders (  id INT PRIMARY KEY,  customer_id INT);CREATE TABLE order_items (  id INT PRIMARY KEY,  order_id INT REFERENCES orders(id),  product_id INT);
```
```
-- BAD: customer_name depends only on customer_idCREATE TABLE order_items (  order_id INT,  product_id INT,  customer_name VARCHAR(100),  -- Partial dependency!  PRIMARY KEY (order_id, product_id));-- GOOD: Customer data in separate tableCREATE TABLE customers (  id INT PRIMARY KEY,  name VARCHAR(100));
```
```
-- BAD: customer_name depends only on customer_idCREATE TABLE order_items (  order_id INT,  product_id INT,  customer_name VARCHAR(100),  -- Partial dependency!  PRIMARY KEY (order_id, product_id));-- GOOD: Customer data in separate tableCREATE TABLE customers (  id INT PRIMARY KEY,  name VARCHAR(100));
```
```
-- BAD: country depends on postal_codeCREATE TABLE customers (  id INT PRIMARY KEY,  postal_code VARCHAR(10),  country VARCHAR(50)  -- Transitive dependency!);-- GOOD: Separate postal_codes tableCREATE TABLE postal_codes (  code VARCHAR(10) PRIMARY KEY,  country VARCHAR(50));
```
```
-- BAD: country depends on postal_codeCREATE TABLE customers (  id INT PRIMARY KEY,  postal_code VARCHAR(10),  country VARCHAR(50)  -- Transitive dependency!);-- GOOD: Separate postal_codes tableCREATE TABLE postal_codes (  code VARCHAR(10) PRIMARY KEY,  country VARCHAR(50));
```
```
-- Denormalized for performanceCREATE TABLE orders (  id INT PRIMARY KEY,  customer_id INT,  total_amount DECIMAL(10,2),  -- Calculated  item_count INT               -- Calculated);
```
```
-- Denormalized for performanceCREATE TABLE orders (  id INT PRIMARY KEY,  customer_id INT,  total_amount DECIMAL(10,2),  -- Calculated  item_count INT               -- Calculated);
```
```
-- Good sizingemail VARCHAR(255)phone VARCHAR(20)country_code CHAR(2)
```
```
-- Good sizingemail VARCHAR(255)phone VARCHAR(20)country_code CHAR(2)
```
```
-- ALWAYS use DECIMAL for moneyprice DECIMAL(10, 2)  -- $99,999,999.99-- NEVER use FLOAT for moneyprice FLOAT  -- Rounding errors!
```
```
-- ALWAYS use DECIMAL for moneyprice DECIMAL(10, 2)  -- $99,999,999.99-- NEVER use FLOAT for moneyprice FLOAT  -- Rounding errors!
```
```
DATE        -- 2025-10-31TIME        -- 14:30:00DATETIME    -- 2025-10-31 14:30:00TIMESTAMP   -- Auto timezone conversion-- Always store in UTCcreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMPupdated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```
```
DATE        -- 2025-10-31TIME        -- 14:30:00DATETIME    -- 2025-10-31 14:30:00TIMESTAMP   -- Auto timezone conversion-- Always store in UTCcreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMPupdated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```
```
-- PostgreSQLis_active BOOLEAN DEFAULT TRUE-- MySQLis_active TINYINT(1) DEFAULT 1
```
```
-- PostgreSQLis_active BOOLEAN DEFAULT TRUE-- MySQLis_active TINYINT(1) DEFAULT 1
```
```
-- Foreign key indexCREATE INDEX idx_orders_customer ON orders(customer_id);-- Query pattern indexCREATE INDEX idx_orders_status_date ON orders(status, created_at);
```
```
-- Foreign key indexCREATE INDEX idx_orders_customer ON orders(customer_id);-- Query pattern indexCREATE INDEX idx_orders_status_date ON orders(status, created_at);
```
```
price > 100
```
```
email = 'x@y.com'
```
```
MATCH AGAINST
```
```
WHERE is_active = true
```
```
CREATE INDEX idx_customer_status ON orders(customer_id, status);-- Uses index (customer_id first)SELECT * FROM orders WHERE customer_id = 123;SELECT * FROM orders WHERE customer_id = 123 AND status = 'pending';-- Does NOT use index (status alone)SELECT * FROM orders WHERE status = 'pending';
```
```
CREATE INDEX idx_customer_status ON orders(customer_id, status);-- Uses index (customer_id first)SELECT * FROM orders WHERE customer_id = 123;SELECT * FROM orders WHERE customer_id = 123 AND status = 'pending';-- Does NOT use index (status alone)SELECT * FROM orders WHERE status = 'pending';
```
```
-- Auto-increment (simple)id INT AUTO_INCREMENT PRIMARY KEY-- UUID (distributed systems)id CHAR(36) PRIMARY KEY DEFAULT (UUID())-- Composite (junction tables)PRIMARY KEY (student_id, course_id)
```
```
-- Auto-increment (simple)id INT AUTO_INCREMENT PRIMARY KEY-- UUID (distributed systems)id CHAR(36) PRIMARY KEY DEFAULT (UUID())-- Composite (junction tables)PRIMARY KEY (student_id, course_id)
```
```
FOREIGN KEY (customer_id) REFERENCES customers(id)  ON DELETE CASCADE     -- Delete children with parent  ON DELETE RESTRICT    -- Prevent deletion if referenced  ON DELETE SET NULL    -- Set to NULL when parent deleted  ON UPDATE CASCADE     -- Update children when parent changes
```
```
FOREIGN KEY (customer_id) REFERENCES customers(id)  ON DELETE CASCADE     -- Delete children with parent  ON DELETE RESTRICT    -- Prevent deletion if referenced  ON DELETE SET NULL    -- Set to NULL when parent deleted  ON UPDATE CASCADE     -- Update children when parent changes
```
```
-- Uniqueemail VARCHAR(255) UNIQUE NOT NULL-- Composite uniqueUNIQUE (student_id, course_id)-- Checkprice DECIMAL(10,2) CHECK (price >= 0)discount INT CHECK (discount BETWEEN 0 AND 100)-- Not nullname VARCHAR(100) NOT NULL
```
```
-- Uniqueemail VARCHAR(255) UNIQUE NOT NULL-- Composite uniqueUNIQUE (student_id, course_id)-- Checkprice DECIMAL(10,2) CHECK (price >= 0)discount INT CHECK (discount BETWEEN 0 AND 100)-- Not nullname VARCHAR(100) NOT NULL
```
```
CREATE TABLE orders (  id INT PRIMARY KEY,  customer_id INT NOT NULL REFERENCES customers(id));CREATE TABLE order_items (  id INT PRIMARY KEY,  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,  product_id INT NOT NULL,  quantity INT NOT NULL);
```
```
CREATE TABLE orders (  id INT PRIMARY KEY,  customer_id INT NOT NULL REFERENCES customers(id));CREATE TABLE order_items (  id INT PRIMARY KEY,  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,  product_id INT NOT NULL,  quantity INT NOT NULL);
```
```
-- Junction tableCREATE TABLE enrollments (  student_id INT REFERENCES students(id) ON DELETE CASCADE,  course_id INT REFERENCES courses(id) ON DELETE CASCADE,  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (student_id, course_id));
```
```
-- Junction tableCREATE TABLE enrollments (  student_id INT REFERENCES students(id) ON DELETE CASCADE,  course_id INT REFERENCES courses(id) ON DELETE CASCADE,  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (student_id, course_id));
```
```
CREATE TABLE employees (  id INT PRIMARY KEY,  name VARCHAR(100) NOT NULL,  manager_id INT REFERENCES employees(id));
```
```
CREATE TABLE employees (  id INT PRIMARY KEY,  name VARCHAR(100) NOT NULL,  manager_id INT REFERENCES employees(id));
```
```
-- Approach 1: Separate FKs (stronger integrity)CREATE TABLE comments (  id INT PRIMARY KEY,  content TEXT NOT NULL,  post_id INT REFERENCES posts(id),  photo_id INT REFERENCES photos(id),  CHECK (    (post_id IS NOT NULL AND photo_id IS NULL) OR    (post_id IS NULL AND photo_id IS NOT NULL)  ));-- Approach 2: Type + ID (flexible, weaker integrity)CREATE TABLE comments (  id INT PRIMARY KEY,  content TEXT NOT NULL,  commentable_type VARCHAR(50) NOT NULL,  commentable_id INT NOT NULL);
```
```
-- Approach 1: Separate FKs (stronger integrity)CREATE TABLE comments (  id INT PRIMARY KEY,  content TEXT NOT NULL,  post_id INT REFERENCES posts(id),  photo_id INT REFERENCES photos(id),  CHECK (    (post_id IS NOT NULL AND photo_id IS NULL) OR    (post_id IS NULL AND photo_id IS NOT NULL)  ));-- Approach 2: Type + ID (flexible, weaker integrity)CREATE TABLE comments (  id INT PRIMARY KEY,  content TEXT NOT NULL,  commentable_type VARCHAR(50) NOT NULL,  commentable_id INT NOT NULL);
```
```
{  "_id": "order_123",  "customer": {    "id": "cust_456",    "name": "Jane Smith",    "email": "jane@example.com"  },  "items": [    { "product_id": "prod_789", "quantity": 2, "price": 29.99 }  ],  "total": 109.97}
```
```
{  "_id": "order_123",  "customer": {    "id": "cust_456",    "name": "Jane Smith",    "email": "jane@example.com"  },  "items": [    { "product_id": "prod_789", "quantity": 2, "price": 29.99 }  ],  "total": 109.97}
```
```
{  "_id": "order_123",  "customer_id": "cust_456",  "item_ids": ["item_1", "item_2"],  "total": 109.97}
```
```
{  "_id": "order_123",  "customer_id": "cust_456",  "item_ids": ["item_1", "item_2"],  "total": 109.97}
```
```
// Single fielddb.users.createIndex({ email: 1 }, { unique: true });// Compositedb.orders.createIndex({ customer_id: 1, created_at: -1 });// Text searchdb.articles.createIndex({ title: "text", content: "text" });// Geospatialdb.stores.createIndex({ location: "2dsphere" });
```
```
// Single fielddb.users.createIndex({ email: 1 }, { unique: true });// Compositedb.orders.createIndex({ customer_id: 1, created_at: -1 });// Text searchdb.articles.createIndex({ title: "text", content: "text" });// Geospatialdb.stores.createIndex({ location: "2dsphere" });
```
```
-- Step 1: Add nullable columnALTER TABLE users ADD COLUMN phone VARCHAR(20);-- Step 2: Deploy code that writes to new column-- Step 3: Backfill existing rowsUPDATE users SET phone = '' WHERE phone IS NULL;-- Step 4: Make required (if needed)ALTER TABLE users MODIFY phone VARCHAR(20) NOT NULL;
```
```
-- Step 1: Add nullable columnALTER TABLE users ADD COLUMN phone VARCHAR(20);-- Step 2: Deploy code that writes to new column-- Step 3: Backfill existing rowsUPDATE users SET phone = '' WHERE phone IS NULL;-- Step 4: Make required (if needed)ALTER TABLE users MODIFY phone VARCHAR(20) NOT NULL;
```
```
-- Step 1: Add new columnALTER TABLE users ADD COLUMN email_address VARCHAR(255);-- Step 2: Copy dataUPDATE users SET email_address = email;-- Step 3: Deploy code reading from new column-- Step 4: Deploy code writing to new column-- Step 5: Drop old columnALTER TABLE users DROP COLUMN email;
```
```
-- Step 1: Add new columnALTER TABLE users ADD COLUMN email_address VARCHAR(255);-- Step 2: Copy dataUPDATE users SET email_address = email;-- Step 3: Deploy code reading from new column-- Step 4: Deploy code writing to new column-- Step 5: Drop old columnALTER TABLE users DROP COLUMN email;
```
```
-- Migration: YYYYMMDDHHMMSS_description.sql-- UPBEGIN;ALTER TABLE users ADD COLUMN phone VARCHAR(20);CREATE INDEX idx_users_phone ON users(phone);COMMIT;-- DOWNBEGIN;DROP INDEX idx_users_phone ON users;ALTER TABLE users DROP COLUMN phone;COMMIT;
```
```
-- Migration: YYYYMMDDHHMMSS_description.sql-- UPBEGIN;ALTER TABLE users ADD COLUMN phone VARCHAR(20);CREATE INDEX idx_users_phone ON users(phone);COMMIT;-- DOWNBEGIN;DROP INDEX idx_users_phone ON users;ALTER TABLE users DROP COLUMN phone;COMMIT;
```
```
EXPLAIN SELECT * FROM ordersWHERE customer_id = 123 AND status = 'pending';
```
```
EXPLAIN SELECT * FROM ordersWHERE customer_id = 123 AND status = 'pending';
```
```
# BAD: N+1 queriesorders = db.query("SELECT * FROM orders")for order in orders:    customer = db.query(f"SELECT * FROM customers WHERE id = {order.customer_id}")# GOOD: Single JOINresults = db.query("""    SELECT orders.*, customers.name    FROM orders    JOIN customers ON orders.customer_id = customers.id""")
```
```
# BAD: N+1 queriesorders = db.query("SELECT * FROM orders")for order in orders:    customer = db.query(f"SELECT * FROM customers WHERE id = {order.customer_id}")# GOOD: Single JOINresults = db.query("""    SELECT orders.*, customers.name    FROM orders    JOIN customers ON orders.customer_id = customers.id""")
```
Crafting an efficient database schema is foundational to any successful application, ensuring data integrity, blazing-fast queries, and seamless scalability. This AI agent skill streamlines the often-complex process of designing database structures, offering intelligent guidance whether you're building a new system or refactoring an existing one. It empowers developers to define entities, relationships, and constraints with best practices automatically integrated, reducing errors and accelerating development cycles. Leverage its expertise to lay a solid data foundation that supports robust, performant, and maintainable applications, making complex database design accessible and efficient for projects of any scale.

# When to Use This Skill
- •Starting a new application project (e.g., e-commerce, SaaS, content management system) and needing a robust database foundation.
- •Refactoring an existing application's database schema to improve performance, scalability, or maintainability.
- •Learning best practices in database design by generating schemas for various business requirements.
- •Prototyping and comparing different data models quickly for a proof-of-concept or architectural review.

# Pro Tips
- 💡Specify scale hints (e.g., 'high-traffic', 'millions of records') to get optimized indexing strategies and potential partitioning suggestions.
- 💡Always define key entities, their attributes, and explicit relationships (e.g., 'users have many orders', 'products have categories') for a more accurate and normalized schema.
- 💡Indicate your preferred database type (SQL/NoSQL) or even a specific vendor (e.g., 'PostgreSQL', 'MongoDB') for tailored syntax and feature utilization.

