# Setup Local Database (Postgres)
Source: https://antigravity.codes/workflows/integrations/setup-local-postgres-database-docker-compose

## AI Worker Instructions
When the user requests functionality related to Setup Local Database (Postgres), follow these guidelines and utilize this context.

## Scraped Content

# Setup Local Database (Postgres)
```
open https://www.docker.com/products/docker-desktop/
```
```
docker-compose.yml
```
```
docker-compose.yml
```
```
version: '3.8'   services:     db:       image: postgres:16-alpine       restart: always       environment:         POSTGRES_DB: mydatabase         POSTGRES_USER: myuser         POSTGRES_PASSWORD: mypassword       ports:         - "5432:5432"       volumes:         - db_data:/var/lib/postgresql/data   volumes:     db_data:
```
```
version: '3.8'   services:     db:       image: postgres:16-alpine       restart: always       environment:         POSTGRES_DB: mydatabase         POSTGRES_USER: myuser         POSTGRES_PASSWORD: mypassword       ports:         - "5432:5432"       volumes:         - db_data:/var/lib/postgresql/data   volumes:     db_data:
```
```
docker-compose up -d
```
```
psql
```
```
DBeaver
```
```
TablePlus
```
```
localhost
```
```
5432
```
```
myuser
```
```
mypassword
```
```
mydatabase
```
```
docker-compose down
```
```
docker-compose down -v
```
```
docker-compose.yml
```
```
.gitignore
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-local-postgres-database-docker-compose.md
```
setup-local-postgres-database-docker-compose.md
```
- In Antigravity, type /setup_local_postgres_database_docker_compose or just describe what you want to do
```
/setup_local_postgres_database_docker_compose
```
Learn more about workflows →

# Related Workflows

# Supabase Row Level Security (RLS)

# NextAuth.js (Auth.js) v5 Setup

# Stripe Checkout Integration

