# sql-optimization-patterns
Source: https://antigravity.codes/agent-skills/database/sql-optimization-patterns

## AI Worker Instructions
When the user requests functionality related to sql-optimization-patterns, follow these guidelines and utilize this context.

## Scraped Content

# sql-optimization-patterns
```
-- Basic explainEXPLAIN SELECT * FROM users WHERE email = 'user@example.com';-- With actual execution statsEXPLAIN ANALYZESELECT * FROM users WHERE email = 'user@example.com';-- Verbose output with more detailsEXPLAIN (ANALYZE, BUFFERS, VERBOSE)SELECT u.*, o.order_totalFROM users uJOIN orders o ON u.id = o.user_idWHERE u.created_at > NOW() - INTERVAL '30 days';
```
```
-- Basic explainEXPLAIN SELECT * FROM users WHERE email = 'user@example.com';-- With actual execution statsEXPLAIN ANALYZESELECT * FROM users WHERE email = 'user@example.com';-- Verbose output with more detailsEXPLAIN (ANALYZE, BUFFERS, VERBOSE)SELECT u.*, o.order_totalFROM users uJOIN orders o ON u.id = o.user_idWHERE u.created_at > NOW() - INTERVAL '30 days';
```
```
-- Standard B-Tree indexCREATE INDEX idx_users_email ON users(email);-- Composite index (order matters!)CREATE INDEX idx_orders_user_status ON orders(user_id, status);-- Partial index (index subset of rows)CREATE INDEX idx_active_users ON users(email)WHERE status = 'active';-- Expression indexCREATE INDEX idx_users_lower_email ON users(LOWER(email));-- Covering index (include additional columns)CREATE INDEX idx_users_email_covering ON users(email)INCLUDE (name, created_at);-- Full-text search indexCREATE INDEX idx_posts_search ON postsUSING GIN(to_tsvector('english', title || ' ' || body));-- JSONB indexCREATE INDEX idx_metadata ON events USING GIN(metadata);
```
```
-- Standard B-Tree indexCREATE INDEX idx_users_email ON users(email);-- Composite index (order matters!)CREATE INDEX idx_orders_user_status ON orders(user_id, status);-- Partial index (index subset of rows)CREATE INDEX idx_active_users ON users(email)WHERE status = 'active';-- Expression indexCREATE INDEX idx_users_lower_email ON users(LOWER(email));-- Covering index (include additional columns)CREATE INDEX idx_users_email_covering ON users(email)INCLUDE (name, created_at);-- Full-text search indexCREATE INDEX idx_posts_search ON postsUSING GIN(to_tsvector('english', title || ' ' || body));-- JSONB indexCREATE INDEX idx_metadata ON events USING GIN(metadata);
```
```
-- Bad: Fetches unnecessary columnsSELECT * FROM users WHERE id = 123;-- Good: Fetch only what you needSELECT id, email, name FROM users WHERE id = 123;
```
```
-- Bad: Fetches unnecessary columnsSELECT * FROM users WHERE id = 123;-- Good: Fetch only what you needSELECT id, email, name FROM users WHERE id = 123;
```
```
-- Bad: Function prevents index usageSELECT * FROM users WHERE LOWER(email) = 'user@example.com';-- Good: Create functional index or use exact matchCREATE INDEX idx_users_email_lower ON users(LOWER(email));-- Then:SELECT * FROM users WHERE LOWER(email) = 'user@example.com';-- Or store normalized dataSELECT * FROM users WHERE email = 'user@example.com';
```
```
-- Bad: Function prevents index usageSELECT * FROM users WHERE LOWER(email) = 'user@example.com';-- Good: Create functional index or use exact matchCREATE INDEX idx_users_email_lower ON users(LOWER(email));-- Then:SELECT * FROM users WHERE LOWER(email) = 'user@example.com';-- Or store normalized dataSELECT * FROM users WHERE email = 'user@example.com';
```
```
-- Bad: Cartesian product then filterSELECT u.name, o.totalFROM users u, orders oWHERE u.id = o.user_id AND u.created_at > '2024-01-01';-- Good: Filter before joinSELECT u.name, o.totalFROM users uJOIN orders o ON u.id = o.user_idWHERE u.created_at > '2024-01-01';-- Better: Filter both tablesSELECT u.name, o.totalFROM (SELECT * FROM users WHERE created_at > '2024-01-01') uJOIN orders o ON u.id = o.user_id;
```
```
-- Bad: Cartesian product then filterSELECT u.name, o.totalFROM users u, orders oWHERE u.id = o.user_id AND u.created_at > '2024-01-01';-- Good: Filter before joinSELECT u.name, o.totalFROM users uJOIN orders o ON u.id = o.user_idWHERE u.created_at > '2024-01-01';-- Better: Filter both tablesSELECT u.name, o.totalFROM (SELECT * FROM users WHERE created_at > '2024-01-01') uJOIN orders o ON u.id = o.user_id;
```
```
# Bad: Executes N+1 queriesusers = db.query("SELECT * FROM users LIMIT 10")for user in users:    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user.id)    # Process orders
```
```
# Bad: Executes N+1 queriesusers = db.query("SELECT * FROM users LIMIT 10")for user in users:    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user.id)    # Process orders
```
```
-- Solution 1: JOINSELECT    u.id, u.name,    o.id as order_id, o.totalFROM users uLEFT JOIN orders o ON u.id = o.user_idWHERE u.id IN (1, 2, 3, 4, 5);-- Solution 2: Batch querySELECT * FROM ordersWHERE user_id IN (1, 2, 3, 4, 5);
```
```
-- Solution 1: JOINSELECT    u.id, u.name,    o.id as order_id, o.totalFROM users uLEFT JOIN orders o ON u.id = o.user_idWHERE u.id IN (1, 2, 3, 4, 5);-- Solution 2: Batch querySELECT * FROM ordersWHERE user_id IN (1, 2, 3, 4, 5);
```
```
# Good: Single query with JOIN or batch load# Using JOINresults = db.query("""    SELECT u.id, u.name, o.id as order_id, o.total    FROM users u    LEFT JOIN orders o ON u.id = o.user_id    WHERE u.id IN (1, 2, 3, 4, 5)""")# Or batch loadusers = db.query("SELECT * FROM users LIMIT 10")user_ids = [u.id for u in users]orders = db.query(    "SELECT * FROM orders WHERE user_id IN (?)",    user_ids)# Group orders by user_idorders_by_user = {}for order in orders:    orders_by_user.setdefault(order.user_id, []).append(order)
```
```
# Good: Single query with JOIN or batch load# Using JOINresults = db.query("""    SELECT u.id, u.name, o.id as order_id, o.total    FROM users u    LEFT JOIN orders o ON u.id = o.user_id    WHERE u.id IN (1, 2, 3, 4, 5)""")# Or batch loadusers = db.query("SELECT * FROM users LIMIT 10")user_ids = [u.id for u in users]orders = db.query(    "SELECT * FROM orders WHERE user_id IN (?)",    user_ids)# Group orders by user_idorders_by_user = {}for order in orders:    orders_by_user.setdefault(order.user_id, []).append(order)
```
```
-- Slow for large offsetsSELECT * FROM usersORDER BY created_at DESCLIMIT 20 OFFSET 100000;  -- Very slow!
```
```
-- Slow for large offsetsSELECT * FROM usersORDER BY created_at DESCLIMIT 20 OFFSET 100000;  -- Very slow!
```
```
-- Much faster: Use cursor (last seen ID)SELECT * FROM usersWHERE created_at < '2024-01-15 10:30:00'  -- Last cursorORDER BY created_at DESCLIMIT 20;-- With composite sortingSELECT * FROM usersWHERE (created_at, id) < ('2024-01-15 10:30:00', 12345)ORDER BY created_at DESC, id DESCLIMIT 20;-- Requires indexCREATE INDEX idx_users_cursor ON users(created_at DESC, id DESC);
```
```
-- Much faster: Use cursor (last seen ID)SELECT * FROM usersWHERE created_at < '2024-01-15 10:30:00'  -- Last cursorORDER BY created_at DESCLIMIT 20;-- With composite sortingSELECT * FROM usersWHERE (created_at, id) < ('2024-01-15 10:30:00', 12345)ORDER BY created_at DESC, id DESCLIMIT 20;-- Requires indexCREATE INDEX idx_users_cursor ON users(created_at DESC, id DESC);
```
```
-- Bad: Counts all rowsSELECT COUNT(*) FROM orders;  -- Slow on large tables-- Good: Use estimates for approximate countsSELECT reltuples::bigint AS estimateFROM pg_classWHERE relname = 'orders';-- Good: Filter before countingSELECT COUNT(*) FROM ordersWHERE created_at > NOW() - INTERVAL '7 days';-- Better: Use index-only scanCREATE INDEX idx_orders_created ON orders(created_at);SELECT COUNT(*) FROM ordersWHERE created_at > NOW() - INTERVAL '7 days';
```
```
-- Bad: Counts all rowsSELECT COUNT(*) FROM orders;  -- Slow on large tables-- Good: Use estimates for approximate countsSELECT reltuples::bigint AS estimateFROM pg_classWHERE relname = 'orders';-- Good: Filter before countingSELECT COUNT(*) FROM ordersWHERE created_at > NOW() - INTERVAL '7 days';-- Better: Use index-only scanCREATE INDEX idx_orders_created ON orders(created_at);SELECT COUNT(*) FROM ordersWHERE created_at > NOW() - INTERVAL '7 days';
```
```
-- Bad: Group by then filterSELECT user_id, COUNT(*) as order_countFROM ordersGROUP BY user_idHAVING COUNT(*) > 10;-- Better: Filter first, then group (if possible)SELECT user_id, COUNT(*) as order_countFROM ordersWHERE status = 'completed'GROUP BY user_idHAVING COUNT(*) > 10;-- Best: Use covering indexCREATE INDEX idx_orders_user_status ON orders(user_id, status);
```
```
-- Bad: Group by then filterSELECT user_id, COUNT(*) as order_countFROM ordersGROUP BY user_idHAVING COUNT(*) > 10;-- Better: Filter first, then group (if possible)SELECT user_id, COUNT(*) as order_countFROM ordersWHERE status = 'completed'GROUP BY user_idHAVING COUNT(*) > 10;-- Best: Use covering indexCREATE INDEX idx_orders_user_status ON orders(user_id, status);
```
```
-- Bad: Correlated subquery (runs for each row)SELECT u.name, u.email,    (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_countFROM users u;-- Good: JOIN with aggregationSELECT u.name, u.email, COUNT(o.id) as order_countFROM users uLEFT JOIN orders o ON o.user_id = u.idGROUP BY u.id, u.name, u.email;-- Better: Use window functionsSELECT DISTINCT ON (u.id)    u.name, u.email,    COUNT(o.id) OVER (PARTITION BY u.id) as order_countFROM users uLEFT JOIN orders o ON o.user_id = u.id;
```
```
-- Bad: Correlated subquery (runs for each row)SELECT u.name, u.email,    (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_countFROM users u;-- Good: JOIN with aggregationSELECT u.name, u.email, COUNT(o.id) as order_countFROM users uLEFT JOIN orders o ON o.user_id = u.idGROUP BY u.id, u.name, u.email;-- Better: Use window functionsSELECT DISTINCT ON (u.id)    u.name, u.email,    COUNT(o.id) OVER (PARTITION BY u.id) as order_countFROM users uLEFT JOIN orders o ON o.user_id = u.id;
```
```
-- Using Common Table ExpressionsWITH recent_users AS (    SELECT id, name, email    FROM users    WHERE created_at > NOW() - INTERVAL '30 days'),user_order_counts AS (    SELECT user_id, COUNT(*) as order_count    FROM orders    WHERE created_at > NOW() - INTERVAL '30 days'    GROUP BY user_id)SELECT ru.name, ru.email, COALESCE(uoc.order_count, 0) as ordersFROM recent_users ruLEFT JOIN user_order_counts uoc ON ru.id = uoc.user_id;
```
```
-- Using Common Table ExpressionsWITH recent_users AS (    SELECT id, name, email    FROM users    WHERE created_at > NOW() - INTERVAL '30 days'),user_order_counts AS (    SELECT user_id, COUNT(*) as order_count    FROM orders    WHERE created_at > NOW() - INTERVAL '30 days'    GROUP BY user_id)SELECT ru.name, ru.email, COALESCE(uoc.order_count, 0) as ordersFROM recent_users ruLEFT JOIN user_order_counts uoc ON ru.id = uoc.user_id;
```
```
-- Bad: Multiple individual insertsINSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');INSERT INTO users (name, email) VALUES ('Carol', 'carol@example.com');-- Good: Batch insertINSERT INTO users (name, email) VALUES    ('Alice', 'alice@example.com'),    ('Bob', 'bob@example.com'),    ('Carol', 'carol@example.com');-- Better: Use COPY for bulk inserts (PostgreSQL)COPY users (name, email) FROM '/tmp/users.csv' CSV HEADER;
```
```
-- Bad: Multiple individual insertsINSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');INSERT INTO users (name, email) VALUES ('Carol', 'carol@example.com');-- Good: Batch insertINSERT INTO users (name, email) VALUES    ('Alice', 'alice@example.com'),    ('Bob', 'bob@example.com'),    ('Carol', 'carol@example.com');-- Better: Use COPY for bulk inserts (PostgreSQL)COPY users (name, email) FROM '/tmp/users.csv' CSV HEADER;
```
```
-- Bad: Update in loopUPDATE users SET status = 'active' WHERE id = 1;UPDATE users SET status = 'active' WHERE id = 2;-- ... repeat for many IDs-- Good: Single UPDATE with IN clauseUPDATE usersSET status = 'active'WHERE id IN (1, 2, 3, 4, 5, ...);-- Better: Use temporary table for large batchesCREATE TEMP TABLE temp_user_updates (id INT, new_status VARCHAR);INSERT INTO temp_user_updates VALUES (1, 'active'), (2, 'active'), ...;UPDATE users uSET status = t.new_statusFROM temp_user_updates tWHERE u.id = t.id;
```
```
-- Bad: Update in loopUPDATE users SET status = 'active' WHERE id = 1;UPDATE users SET status = 'active' WHERE id = 2;-- ... repeat for many IDs-- Good: Single UPDATE with IN clauseUPDATE usersSET status = 'active'WHERE id IN (1, 2, 3, 4, 5, ...);-- Better: Use temporary table for large batchesCREATE TEMP TABLE temp_user_updates (id INT, new_status VARCHAR);INSERT INTO temp_user_updates VALUES (1, 'active'), (2, 'active'), ...;UPDATE users uSET status = t.new_statusFROM temp_user_updates tWHERE u.id = t.id;
```
```
-- Create materialized viewCREATE MATERIALIZED VIEW user_order_summary ASSELECT    u.id,    u.name,    COUNT(o.id) as total_orders,    SUM(o.total) as total_spent,    MAX(o.created_at) as last_order_dateFROM users uLEFT JOIN orders o ON u.id = o.user_idGROUP BY u.id, u.name;-- Add index to materialized viewCREATE INDEX idx_user_summary_spent ON user_order_summary(total_spent DESC);-- Refresh materialized viewREFRESH MATERIALIZED VIEW user_order_summary;-- Concurrent refresh (PostgreSQL)REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;-- Query materialized view (very fast)SELECT * FROM user_order_summaryWHERE total_spent > 1000ORDER BY total_spent DESC;
```
```
-- Create materialized viewCREATE MATERIALIZED VIEW user_order_summary ASSELECT    u.id,    u.name,    COUNT(o.id) as total_orders,    SUM(o.total) as total_spent,    MAX(o.created_at) as last_order_dateFROM users uLEFT JOIN orders o ON u.id = o.user_idGROUP BY u.id, u.name;-- Add index to materialized viewCREATE INDEX idx_user_summary_spent ON user_order_summary(total_spent DESC);-- Refresh materialized viewREFRESH MATERIALIZED VIEW user_order_summary;-- Concurrent refresh (PostgreSQL)REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;-- Query materialized view (very fast)SELECT * FROM user_order_summaryWHERE total_spent > 1000ORDER BY total_spent DESC;
```
```
-- Range partitioning by date (PostgreSQL)CREATE TABLE orders (    id SERIAL,    user_id INT,    total DECIMAL,    created_at TIMESTAMP) PARTITION BY RANGE (created_at);-- Create partitionsCREATE TABLE orders_2024_q1 PARTITION OF orders    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');CREATE TABLE orders_2024_q2 PARTITION OF orders    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');-- Queries automatically use appropriate partitionSELECT * FROM ordersWHERE created_at BETWEEN '2024-02-01' AND '2024-02-28';-- Only scans orders_2024_q1 partition
```
```
-- Range partitioning by date (PostgreSQL)CREATE TABLE orders (    id SERIAL,    user_id INT,    total DECIMAL,    created_at TIMESTAMP) PARTITION BY RANGE (created_at);-- Create partitionsCREATE TABLE orders_2024_q1 PARTITION OF orders    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');CREATE TABLE orders_2024_q2 PARTITION OF orders    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');-- Queries automatically use appropriate partitionSELECT * FROM ordersWHERE created_at BETWEEN '2024-02-01' AND '2024-02-28';-- Only scans orders_2024_q1 partition
```
```
-- Force index usage (MySQL)SELECT * FROM usersUSE INDEX (idx_users_email)WHERE email = 'user@example.com';-- Parallel query (PostgreSQL)SET max_parallel_workers_per_gather = 4;SELECT * FROM large_table WHERE condition;-- Join hints (PostgreSQL)SET enable_nestloop = OFF;  -- Force hash or merge join
```
```
-- Force index usage (MySQL)SELECT * FROM usersUSE INDEX (idx_users_email)WHERE email = 'user@example.com';-- Parallel query (PostgreSQL)SET max_parallel_workers_per_gather = 4;SELECT * FROM large_table WHERE condition;-- Join hints (PostgreSQL)SET enable_nestloop = OFF;  -- Force hash or merge join
```
```
-- Update statisticsANALYZE users;ANALYZE VERBOSE orders;-- Vacuum (PostgreSQL)VACUUM ANALYZE users;VACUUM FULL users;  -- Reclaim space (locks table)-- ReindexREINDEX INDEX idx_users_email;REINDEX TABLE users;
```
```
-- Update statisticsANALYZE users;ANALYZE VERBOSE orders;-- Vacuum (PostgreSQL)VACUUM ANALYZE users;VACUUM FULL users;  -- Reclaim space (locks table)-- ReindexREINDEX INDEX idx_users_email;REINDEX TABLE users;
```
```
LIKE '%abc'
```
```
-- Find slow queries (PostgreSQL)SELECT query, calls, total_time, mean_timeFROM pg_stat_statementsORDER BY mean_time DESCLIMIT 10;-- Find missing indexes (PostgreSQL)SELECT    schemaname,    tablename,    seq_scan,    seq_tup_read,    idx_scan,    seq_tup_read / seq_scan AS avg_seq_tup_readFROM pg_stat_user_tablesWHERE seq_scan > 0ORDER BY seq_tup_read DESCLIMIT 10;-- Find unused indexes (PostgreSQL)SELECT    schemaname,    tablename,    indexname,    idx_scan,    idx_tup_read,    idx_tup_fetchFROM pg_stat_user_indexesWHERE idx_scan = 0ORDER BY pg_relation_size(indexrelid) DESC;
```
```
-- Find slow queries (PostgreSQL)SELECT query, calls, total_time, mean_timeFROM pg_stat_statementsORDER BY mean_time DESCLIMIT 10;-- Find missing indexes (PostgreSQL)SELECT    schemaname,    tablename,    seq_scan,    seq_tup_read,    idx_scan,    seq_tup_read / seq_scan AS avg_seq_tup_readFROM pg_stat_user_tablesWHERE seq_scan > 0ORDER BY seq_tup_read DESCLIMIT 10;-- Find unused indexes (PostgreSQL)SELECT    schemaname,    tablename,    indexname,    idx_scan,    idx_tup_read,    idx_tup_fetchFROM pg_stat_user_indexesWHERE idx_scan = 0ORDER BY pg_relation_size(indexrelid) DESC;
```
This Agent Skill is your definitive guide to unlocking peak database performance. In today's data-driven applications, slow SQL queries can cripple user experience and inflate infrastructure costs. This skill empowers you to diagnose performance bottlenecks, understand query execution plans, and apply proven optimization techniques. Whether you're fine-tuning an existing system or architecting a new one, leverage this expertise to ensure your database operations are consistently fast, scalable, and efficient. Elevate your coding assistant's ability to transform sluggish queries into high-speed data retrieval, ensuring your applications run smoothly under any load.

# When to Use This Skill
- •Debugging slow-running queries to identify bottlenecks.
- •Designing performant database schemas from the ground up.
- •Optimizing application response times by improving data retrieval.
- •Analyzing `EXPLAIN` query plans to understand execution strategies.

# Pro Tips
- 💡Always use `EXPLAIN ANALYZE` (or equivalent for your DB) for real-world execution statistics, not just theoretical plans.
- 💡Prioritize optimizing queries that run frequently or process large datasets, as they offer the most significant performance gains.
- 💡Beware of over-indexing; while indexes speed up reads, they add overhead to writes, consume storage, and can sometimes confuse the query optimizer.

