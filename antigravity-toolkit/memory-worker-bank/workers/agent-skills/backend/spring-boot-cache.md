# spring-boot-cache
Source: https://antigravity.codes/agent-skills/backend/spring-boot-cache

## AI Worker Instructions
When the user requests functionality related to spring-boot-cache, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-cache
```
@Cacheable
```
```
@CachePut
```
```
@CacheEvict
```
```
spring-boot-starter-cache
```
```
spring-boot-starter-data-redis
```
```
caffeine
```
```
ehcache
```
```
<!-- Maven -->   <dependency>       <groupId>org.springframework.boot</groupId>       <artifactId>spring-boot-starter-cache</artifactId>   </dependency>   <dependency> <!-- Optional: Caffeine -->       <groupId>com.github.ben-manes.caffeine</groupId>       <artifactId>caffeine</artifactId>   </dependency>
```
```
<!-- Maven -->   <dependency>       <groupId>org.springframework.boot</groupId>       <artifactId>spring-boot-starter-cache</artifactId>   </dependency>   <dependency> <!-- Optional: Caffeine -->       <groupId>com.github.ben-manes.caffeine</groupId>       <artifactId>caffeine</artifactId>   </dependency>
```
```
implementation "org.springframework.boot:spring-boot-starter-cache"   implementation "com.github.ben-manes.caffeine:caffeine"
```
```
implementation "org.springframework.boot:spring-boot-starter-cache"   implementation "com.github.ben-manes.caffeine:caffeine"
```
```
@Configuration   @EnableCaching   class CacheConfig {       @Bean       CacheManager cacheManager() {           return new CaffeineCacheManager("users", "orders");       }   }
```
```
@Configuration   @EnableCaching   class CacheConfig {       @Bean       CacheManager cacheManager() {           return new CaffeineCacheManager("users", "orders");       }   }
```
```
@Service   @CacheConfig(cacheNames = "users")   class UserService {       @Cacheable(key = "#id", unless = "#result == null")       User findUser(Long id) { ... }       @CachePut(key = "#user.id")       User refreshUser(User user) { ... }       @CacheEvict(key = "#id", beforeInvocation = false)       void deleteUser(Long id) { ... }   }
```
```
@Service   @CacheConfig(cacheNames = "users")   class UserService {       @Cacheable(key = "#id", unless = "#result == null")       User findUser(Long id) { ... }       @CachePut(key = "#user.id")       User refreshUser(User user) { ... }       @CacheEvict(key = "#id", beforeInvocation = false)       void deleteUser(Long id) { ... }   }
```
```
cache
```
```
@Cacheable
```
```
@CachePut
```
```
@CacheEvict
```
```
allEntries = true
```
```
@Caching
```
```
key = "#user.id"
```
```
condition = "#price > 0"
```
```
unless = "#result == null"
```
```
sync = true
```
```
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
```
```
spring.cache.redis.time-to-live=600000
```
```
ttl
```
```
spring.cache.cache-names=users,orders,catalog
```
```
CacheManagementService
```
```
cacheManager.getCache(name)
```
```
@Scheduled
```
```
cache
```
```
sync = true
```
```
@CacheResult
```
```
@CacheRemove
```
```
Mono
```
```
Flux
```
```
CompletableFuture
```
```
CacheControl
```
```
references/cache-examples.md
```
```
references/cache-core-reference.md
```
```
references/spring-framework-cache-docs.md
```
```
references/spring-cache-doc-snippet.md
```
```
references/cache-core-reference.md
```
```
references/cache-examples.md
```
```
users
```
```
orders
```
```
skills/spring-boot/spring-boot-rest-api-standards
```
```
skills/spring-boot/spring-boot-test-patterns
```
```
skills/junit-test/unit-test-caching
```
This skill empowers developers to seamlessly integrate and manage robust caching solutions within their Spring Boot applications. Moving beyond basic `@Cacheable` usage, it guides you through selecting appropriate cache providers like Caffeine or Redis, configuring their specific managers, and handling advanced scenarios such as cache eviction strategies and diagnostic monitoring. Enhance the responsiveness and scalability of your Java services by minimizing redundant computations and database calls. Leverage this skill to implement intelligent caching that significantly boosts performance for critical business logic, ensuring a smoother user experience and more efficient resource utilization.

# When to Use This Skill
- •Implementing a new feature that requires a high-performance lookup of frequently accessed data.
- •Optimizing an existing Spring Boot microservice struggling with slow response times due to repeated database queries.
- •Setting up a distributed caching layer using Redis for improved scalability across multiple service instances.
- •Diagnosing and resolving issues related to stale data or unexpected cache behavior in a production environment.

# Pro Tips
- 💡Always define explicit cache keys using the `key` attribute to avoid unexpected behavior when method parameters change or are complex objects.
- 💡Implement a cache health check endpoint using Spring Boot Actuator to monitor cache hits/misses and eviction policies in production.
- 💡Consider using Spring's `CacheResolver` for dynamic cache selection based on runtime conditions, especially in multi-tenancy scenarios.

