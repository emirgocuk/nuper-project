# aws-rds-spring-boot-integration
Source: https://antigravity.codes/agent-skills/database/aws-rds-spring-boot-integration

## AI Worker Instructions
When the user requests functionality related to aws-rds-spring-boot-integration, follow these guidelines and utilize this context.

## Scraped Content

# aws-rds-spring-boot-integration
```
<dependencies>    <!-- Spring Data JPA -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-data-jpa</artifactId>    </dependency>    <!-- Aurora MySQL Driver -->    <dependency>        <groupId>com.mysql</groupId>        <artifactId>mysql-connector-j</artifactId>        <version>8.2.0</version>        <scope>runtime</scope>    </dependency>    <!-- Aurora PostgreSQL Driver (alternative) -->    <dependency>        <groupId>org.postgresql</groupId>        <artifactId>postgresql</artifactId>        <scope>runtime</scope>    </dependency>    <!-- Flyway for database migrations -->    <dependency>        <groupId>org.flywaydb</groupId>        <artifactId>flyway-core</artifactId>    </dependency>    <!-- Validation -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-validation</artifactId>    </dependency></dependencies>
```
```
<dependencies>    <!-- Spring Data JPA -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-data-jpa</artifactId>    </dependency>    <!-- Aurora MySQL Driver -->    <dependency>        <groupId>com.mysql</groupId>        <artifactId>mysql-connector-j</artifactId>        <version>8.2.0</version>        <scope>runtime</scope>    </dependency>    <!-- Aurora PostgreSQL Driver (alternative) -->    <dependency>        <groupId>org.postgresql</groupId>        <artifactId>postgresql</artifactId>        <scope>runtime</scope>    </dependency>    <!-- Flyway for database migrations -->    <dependency>        <groupId>org.flywaydb</groupId>        <artifactId>flyway-core</artifactId>    </dependency>    <!-- Validation -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-validation</artifactId>    </dependency></dependencies>
```
```
dependencies {    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'    implementation 'org.springframework.boot:spring-boot-starter-validation'    // Aurora MySQL    runtimeOnly 'com.mysql:mysql-connector-j:8.2.0'    // Aurora PostgreSQL (alternative)    runtimeOnly 'org.postgresql:postgresql'    // Flyway    implementation 'org.flywaydb:flyway-core'}
```
```
dependencies {    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'    implementation 'org.springframework.boot:spring-boot-starter-validation'    // Aurora MySQL    runtimeOnly 'com.mysql:mysql-connector-j:8.2.0'    // Aurora PostgreSQL (alternative)    runtimeOnly 'org.postgresql:postgresql'    // Flyway    implementation 'org.flywaydb:flyway-core'}
```
```
# Aurora MySQL Datasource - Cluster Endpointspring.datasource.url=jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devopsspring.datasource.username=adminspring.datasource.password=${DB_PASSWORD}spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver# JPA/Hibernate Configurationspring.jpa.hibernate.ddl-auto=validatespring.jpa.show-sql=falsespring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialectspring.jpa.properties.hibernate.format_sql=truespring.jpa.open-in-view=false# HikariCP Connection Poolspring.datasource.hikari.maximum-pool-size=20spring.datasource.hikari.minimum-idle=5spring.datasource.hikari.connection-timeout=20000spring.datasource.hikari.idle-timeout=300000spring.datasource.hikari.max-lifetime=1200000# Flyway Configurationspring.flyway.enabled=truespring.flyway.baseline-on-migrate=truespring.flyway.locations=classpath:db/migration
```
```
# Aurora MySQL Datasource - Cluster Endpointspring.datasource.url=jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devopsspring.datasource.username=adminspring.datasource.password=${DB_PASSWORD}spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver# JPA/Hibernate Configurationspring.jpa.hibernate.ddl-auto=validatespring.jpa.show-sql=falsespring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialectspring.jpa.properties.hibernate.format_sql=truespring.jpa.open-in-view=false# HikariCP Connection Poolspring.datasource.hikari.maximum-pool-size=20spring.datasource.hikari.minimum-idle=5spring.datasource.hikari.connection-timeout=20000spring.datasource.hikari.idle-timeout=300000spring.datasource.hikari.max-lifetime=1200000# Flyway Configurationspring.flyway.enabled=truespring.flyway.baseline-on-migrate=truespring.flyway.locations=classpath:db/migration
```
```
# Aurora PostgreSQL Datasourcespring.datasource.url=jdbc:postgresql://myapp-aurora-pg-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:5432/devopsspring.datasource.username=adminspring.datasource.password=${DB_PASSWORD}spring.datasource.driver-class-name=org.postgresql.Driver# JPA/Hibernate Configurationspring.jpa.hibernate.ddl-auto=validatespring.jpa.show-sql=falsespring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialectspring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=truespring.jpa.open-in-view=false
```
```
# Aurora PostgreSQL Datasourcespring.datasource.url=jdbc:postgresql://myapp-aurora-pg-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:5432/devopsspring.datasource.username=adminspring.datasource.password=${DB_PASSWORD}spring.datasource.driver-class-name=org.postgresql.Driver# JPA/Hibernate Configurationspring.jpa.hibernate.ddl-auto=validatespring.jpa.show-sql=falsespring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialectspring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=truespring.jpa.open-in-view=false
```
```
# Production environment variablesexport DB_PASSWORD=YourStrongPassword123!export SPRING_PROFILES_ACTIVE=prod# For developmentexport SPRING_PROFILES_ACTIVE=dev
```
```
# Production environment variablesexport DB_PASSWORD=YourStrongPassword123!export SPRING_PROFILES_ACTIVE=prod# For developmentexport SPRING_PROFILES_ACTIVE=dev
```
```
spring:  application:    name: DevOps  datasource:    url: jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devops    username: admin    password: ${DB_PASSWORD}    driver-class-name: com.mysql.cj.jdbc.Driver    hikari:      pool-name: AuroraHikariPool      maximum-pool-size: 20      minimum-idle: 5      connection-timeout: 20000      idle-timeout: 300000      max-lifetime: 1200000      leak-detection-threshold: 60000      connection-test-query: SELECT 1  jpa:    hibernate:      ddl-auto: validate    show-sql: false    open-in-view: false    properties:      hibernate:        dialect: org.hibernate.dialect.MySQL8Dialect        format_sql: true        jdbc:          batch_size: 20        order_inserts: true        order_updates: true  flyway:    enabled: true    baseline-on-migrate: true    locations: classpath:db/migration    validate-on-migrate: truelogging:  level:    org.hibernate.SQL: WARN    com.zaxxer.hikari: INFO
```
```
spring:  application:    name: DevOps  datasource:    url: jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devops    username: admin    password: ${DB_PASSWORD}    driver-class-name: com.mysql.cj.jdbc.Driver    hikari:      pool-name: AuroraHikariPool      maximum-pool-size: 20      minimum-idle: 5      connection-timeout: 20000      idle-timeout: 300000      max-lifetime: 1200000      leak-detection-threshold: 60000      connection-test-query: SELECT 1  jpa:    hibernate:      ddl-auto: validate    show-sql: false    open-in-view: false    properties:      hibernate:        dialect: org.hibernate.dialect.MySQL8Dialect        format_sql: true        jdbc:          batch_size: 20        order_inserts: true        order_updates: true  flyway:    enabled: true    baseline-on-migrate: true    locations: classpath:db/migration    validate-on-migrate: truelogging:  level:    org.hibernate.SQL: WARN    com.zaxxer.hikari: INFO
```
```
# Aurora MySQL - Writer Endpointspring.datasource.writer.jdbc-url=jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devopsspring.datasource.writer.username=adminspring.datasource.writer.password=${DB_PASSWORD}spring.datasource.writer.driver-class-name=com.mysql.cj.jdbc.Driver# Aurora MySQL - Reader Endpoint (Read Replicas)spring.datasource.reader.jdbc-url=jdbc:mysql://myapp-aurora-cluster.cluster-ro-abc123xyz.us-east-1.rds.amazonaws.com:3306/devopsspring.datasource.reader.username=adminspring.datasource.reader.password=${DB_PASSWORD}spring.datasource.reader.driver-class-name=com.mysql.cj.jdbc.Driver# HikariCP for Writerspring.datasource.writer.hikari.maximum-pool-size=15spring.datasource.writer.hikari.minimum-idle=5# HikariCP for Readerspring.datasource.reader.hikari.maximum-pool-size=25spring.datasource.reader.hikari.minimum-idle=10
```
```
# Aurora MySQL - Writer Endpointspring.datasource.writer.jdbc-url=jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devopsspring.datasource.writer.username=adminspring.datasource.writer.password=${DB_PASSWORD}spring.datasource.writer.driver-class-name=com.mysql.cj.jdbc.Driver# Aurora MySQL - Reader Endpoint (Read Replicas)spring.datasource.reader.jdbc-url=jdbc:mysql://myapp-aurora-cluster.cluster-ro-abc123xyz.us-east-1.rds.amazonaws.com:3306/devopsspring.datasource.reader.username=adminspring.datasource.reader.password=${DB_PASSWORD}spring.datasource.reader.driver-class-name=com.mysql.cj.jdbc.Driver# HikariCP for Writerspring.datasource.writer.hikari.maximum-pool-size=15spring.datasource.writer.hikari.minimum-idle=5# HikariCP for Readerspring.datasource.reader.hikari.maximum-pool-size=25spring.datasource.reader.hikari.minimum-idle=10
```
```
spring.datasource.url=jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devops?useSSL=true&requireSSL=true&verifyServerCertificate=true
```
```
spring.datasource.url=jdbc:mysql://myapp-aurora-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:3306/devops?useSSL=true&requireSSL=true&verifyServerCertificate=true
```
```
spring.datasource.url=jdbc:postgresql://myapp-aurora-pg-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:5432/devops?ssl=true&sslmode=require
```
```
spring.datasource.url=jdbc:postgresql://myapp-aurora-pg-cluster.cluster-abc123xyz.us-east-1.rds.amazonaws.com:5432/devops?ssl=true&sslmode=require
```
```
# Local MySQL for developmentspring.datasource.url=jdbc:mysql://localhost:3306/devops_devspring.datasource.username=rootspring.datasource.password=root# Enable DDL auto-update in developmentspring.jpa.hibernate.ddl-auto=updatespring.jpa.show-sql=true# Smaller connection pool for local devspring.datasource.hikari.maximum-pool-size=5spring.datasource.hikari.minimum-idle=2
```
```
# Local MySQL for developmentspring.datasource.url=jdbc:mysql://localhost:3306/devops_devspring.datasource.username=rootspring.datasource.password=root# Enable DDL auto-update in developmentspring.jpa.hibernate.ddl-auto=updatespring.jpa.show-sql=true# Smaller connection pool for local devspring.datasource.hikari.maximum-pool-size=5spring.datasource.hikari.minimum-idle=2
```
```
# Aurora Cluster Endpoint (Production)spring.datasource.url=jdbc:mysql://${AURORA_ENDPOINT}:3306/${DB_NAME}spring.datasource.username=${DB_USERNAME}spring.datasource.password=${DB_PASSWORD}# Validate schema only in productionspring.jpa.hibernate.ddl-auto=validatespring.jpa.show-sql=falsespring.jpa.open-in-view=false# Production-optimized connection poolspring.datasource.hikari.maximum-pool-size=30spring.datasource.hikari.minimum-idle=10spring.datasource.hikari.connection-timeout=20000spring.datasource.hikari.idle-timeout=300000spring.datasource.hikari.max-lifetime=1200000# Enable Flyway migrationsspring.flyway.enabled=truespring.flyway.validate-on-migrate=true
```
```
# Aurora Cluster Endpoint (Production)spring.datasource.url=jdbc:mysql://${AURORA_ENDPOINT}:3306/${DB_NAME}spring.datasource.username=${DB_USERNAME}spring.datasource.password=${DB_PASSWORD}# Validate schema only in productionspring.jpa.hibernate.ddl-auto=validatespring.jpa.show-sql=falsespring.jpa.open-in-view=false# Production-optimized connection poolspring.datasource.hikari.maximum-pool-size=30spring.datasource.hikari.minimum-idle=10spring.datasource.hikari.connection-timeout=20000spring.datasource.hikari.idle-timeout=300000spring.datasource.hikari.max-lifetime=1200000# Enable Flyway migrationsspring.flyway.enabled=truespring.flyway.validate-on-migrate=true
```
```
src/main/resources/db/migration/├── V1__create_users_table.sql├── V2__add_phone_column.sql└── V3__create_orders_table.sql
```
```
src/main/resources/db/migration/├── V1__create_users_table.sql├── V2__add_phone_column.sql└── V3__create_orders_table.sql
```
```
CREATE TABLE users (    id BIGINT AUTO_INCREMENT PRIMARY KEY,    name VARCHAR(100) NOT NULL,    email VARCHAR(255) NOT NULL UNIQUE,    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    INDEX idx_email (email)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
```
CREATE TABLE users (    id BIGINT AUTO_INCREMENT PRIMARY KEY,    name VARCHAR(100) NOT NULL,    email VARCHAR(255) NOT NULL UNIQUE,    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    INDEX idx_email (email)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
```
@RestController@RequestMapping("/api/health")public class DatabaseHealthController {    @Autowired    private DataSource dataSource;    @GetMapping("/db-connection")    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {        Map<String, Object> response = new HashMap<>();        try (Connection connection = dataSource.getConnection()) {            response.put("status", "success");            response.put("database", connection.getCatalog());            response.put("url", connection.getMetaData().getURL());            response.put("connected", true);            return ResponseEntity.ok(response);        } catch (Exception e) {            response.put("status", "failed");            response.put("error", e.getMessage());            response.put("connected", false);            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);        }    }}
```
```
@RestController@RequestMapping("/api/health")public class DatabaseHealthController {    @Autowired    private DataSource dataSource;    @GetMapping("/db-connection")    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {        Map<String, Object> response = new HashMap<>();        try (Connection connection = dataSource.getConnection()) {            response.put("status", "success");            response.put("database", connection.getCatalog());            response.put("url", connection.getMetaData().getURL());            response.put("connected", true);            return ResponseEntity.ok(response);        } catch (Exception e) {            response.put("status", "failed");            response.put("error", e.getMessage());            response.put("connected", false);            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);        }    }}
```
```
curl http://localhost:8080/api/health/db-connection
```
```
curl http://localhost:8080/api/health/db-connection
```
Leverage this powerful agent skill to streamline the integration of AWS RDS databases with your Spring Boot applications. Designed for developers seeking robust, production-ready database connectivity, it covers everything from initial datasource setup and secure credential management using AWS Secrets Manager to advanced connection pooling with HikariCP. Accelerate your development cycle by automating common configuration tasks and ensure your applications benefit from scalable and reliable data persistence on the AWS cloud. This skill provides structured guidance and code examples to simplify complex database interactions, making your applications more resilient and performant.

# When to Use This Skill
- •Setting up AWS RDS Aurora with Spring Data JPA for data access layers.
- •Implementing HikariCP connection pooling to optimize database performance and resource usage.
- •Integrating with AWS Secrets Manager for secure and centralized credential management.
- •Configuring SSL connections to AWS RDS instances for enhanced data security.

# Pro Tips
- 💡Always externalize database credentials using AWS Secrets Manager or environment variables; never embed them directly in application code or configuration files.
- 💡Carefully tune HikariCP connection pool settings (e.g., `maximumPoolSize`, `idleTimeout`) based on your application's load and RDS instance capacity to prevent connection exhaustion or unnecessary resource consumption.
- 💡Utilize database migration tools like Flyway or Liquibase to manage schema changes in a version-controlled manner, ensuring consistency across development, staging, and production environments.

