# spring-data-jpa
Source: https://antigravity.codes/agent-skills/database/spring-data-jpa

## AI Worker Instructions
When the user requests functionality related to spring-data-jpa, follow these guidelines and utilize this context.

## Scraped Content

# spring-data-jpa
```
@Repository   public interface UserRepository extends JpaRepository<User, Long> {       // Custom methods defined here   }
```
```
@Repository   public interface UserRepository extends JpaRepository<User, Long> {       // Custom methods defined here   }
```
```
Optional<User> findByEmail(String email);   List<User> findByStatusOrderByCreatedDateDesc(String status);
```
```
Optional<User> findByEmail(String email);   List<User> findByStatusOrderByCreatedDateDesc(String status);
```
```
@Query("SELECT u FROM User u WHERE u.status = :status")   List<User> findActiveUsers(@Param("status") String status);
```
```
@Query("SELECT u FROM User u WHERE u.status = :status")   List<User> findActiveUsers(@Param("status") String status);
```
```
@Entity   @Table(name = "users")   public class User {       @Id       @GeneratedValue(strategy = GenerationType.IDENTITY)       private Long id;       @Column(nullable = false, length = 100)       private String email;   }
```
```
@Entity   @Table(name = "users")   public class User {       @Id       @GeneratedValue(strategy = GenerationType.IDENTITY)       private Long id;       @Column(nullable = false, length = 100)       private String email;   }
```
```
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)   private List<Order> orders = new ArrayList<>();
```
```
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)   private List<Order> orders = new ArrayList<>();
```
```
@CreatedDate   @Column(nullable = false, updatable = false)   private LocalDateTime createdDate;
```
```
@CreatedDate   @Column(nullable = false, updatable = false)   private LocalDateTime createdDate;
```
```
@Repositorypublic interface ProductRepository extends JpaRepository<Product, Long> {    // Derived query    List<Product> findByCategory(String category);    // Custom query    @Query("SELECT p FROM Product p WHERE p.price > :minPrice")    List<Product> findExpensiveProducts(@Param("minPrice") BigDecimal minPrice);}
```
```
@Repositorypublic interface ProductRepository extends JpaRepository<Product, Long> {    // Derived query    List<Product> findByCategory(String category);    // Custom query    @Query("SELECT p FROM Product p WHERE p.price > :minPrice")    List<Product> findExpensiveProducts(@Param("minPrice") BigDecimal minPrice);}
```
```
@Servicepublic class ProductService {    private final ProductRepository repository;    public Page<Product> getProducts(int page, int size) {        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());        return repository.findAll(pageable);    }}
```
```
@Servicepublic class ProductService {    private final ProductRepository repository;    public Page<Product> getProducts(int page, int size) {        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());        return repository.findAll(pageable);    }}
```
```
@Entity@EntityListeners(AuditingEntityListener.class)public class Order {    @Id    @GeneratedValue(strategy = GenerationType.IDENTITY)    private Long id;    @CreatedDate    @Column(nullable = false, updatable = false)    private LocalDateTime createdDate;    @LastModifiedDate    private LocalDateTime lastModifiedDate;    @CreatedBy    @Column(nullable = false, updatable = false)    private String createdBy;}
```
```
@Entity@EntityListeners(AuditingEntityListener.class)public class Order {    @Id    @GeneratedValue(strategy = GenerationType.IDENTITY)    private Long id;    @CreatedDate    @Column(nullable = false, updatable = false)    private LocalDateTime createdDate;    @LastModifiedDate    private LocalDateTime lastModifiedDate;    @CreatedBy    @Column(nullable = false, updatable = false)    private String createdBy;}
```
```
final
```
```
@Value
```
```
@Id
```
```
@GeneratedValue
```
```
@Table
```
```
@Column
```
```
@Query
```
```
@Param
```
```
Optional<T>
```
```
@Transactional
```
```
@EntityGraph
```
```
@Transactional(readOnly = true)
```
Unlock the full potential of Spring Data JPA with this specialized agent skill, designed to streamline your database interaction in Spring applications. This skill serves as an indispensable guide for developers aiming to build efficient and scalable persistence layers. It offers practical insights into leveraging Spring Data JPA's declarative programming model, from defining robust data models to implementing sophisticated query strategies. Whether you're integrating new features or refactoring existing database access logic, this skill provides the essential patterns and best practices to ensure your applications handle data with elegance and performance. Elevate your backend development by mastering advanced JPA concepts.

# When to Use This Skill
- •Developing a new Spring Boot application requiring robust data persistence and CRUD operations for various entities.
- •Refactoring an existing application's data access layer to improve performance, maintainability, and leverage Spring Data JPA's advanced features like pagination or auditing.
- •Implementing complex data queries and relationships (e.g., one-to-many, many-to-many) in a declarative and efficient manner.
- •Setting up multiple database connections or integrating UUIDs as primary keys for microservices architectures.

# Pro Tips
- 💡Leverage `Querydsl` for Complex Queries: While `@Query` and derived methods are powerful, consider integrating Querydsl for type-safe, dynamic, and complex query construction, especially in large applications with intricate search criteria.
- 💡Understand N+1 Problem: Be mindful of the N+1 select problem when defining relationships. Use `@EntityGraph` or `JOIN FETCH` clauses in your queries to eagerly fetch related entities and prevent excessive database roundtrips, significantly boosting performance.
- 💡Use DTOs for Read Operations: Avoid returning raw JPA entities directly from your service layer, especially for read-heavy operations. Map entities to Data Transfer Objects (DTOs) to decouple the domain model from the API, improve security, and tailor the data shape for consumers.

