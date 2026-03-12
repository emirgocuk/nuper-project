# spring-boot-crud-patterns
Source: https://antigravity.codes/agent-skills/backend/spring-boot-crud-patterns

## AI Worker Instructions
When the user requests functionality related to spring-boot-crud-patterns, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-crud-patterns
```
spring-boot-starter-web
```
```
spring-boot-starter-data-jpa
```
```
@RequiredArgsConstructor
```
```
jakarta.validation
```
```
ResponseStatusException
```
```
feature/<name>/
```
```
domain
```
```
application
```
```
presentation
```
```
infrastructure
```
```
create
```
```
update
```
```
domain/repository
```
```
infrastructure/persistence
```
```
JpaRepository
```
```
application/service
```
```
presentation/rest
```
```
references/examples-product-feature.md
```
```
Product.create
```
```
Money
```
```
Stock
```
```
@Entity
```
```
@Service
```
```
@Transactional
```
```
JpaRepository<ProductEntity, String>
```
```
application.yml
```
```
references/spring-official-docs.md
```
```
ProductController
```
```
/api/products
```
```
ResponseEntity
```
```
201 Created
```
```
200 OK
```
```
204 No Content
```
```
@Valid
```
```
@ControllerAdvice
```
```
ResponseStatusException
```
```
references/examples-product-feature.md
```
```
@DataJpaTest
```
```
info
```
```
python skills/spring-boot/spring-boot-crud-patterns/scripts/generate_crud_boilerplate.py --spec entity.json --package com.example.product --output ./generated
```
```
skills/spring-boot/spring-boot-crud-patterns/templates/
```
```
--templates-dir <path>
```
```
templates/README.md
```
```
skills/spring-boot/spring-boot-crud-patterns/assets/specs/product.json
```
```
skills/spring-boot/spring-boot-crud-patterns/assets/specs/product_with_rel.json
```
Building robust and maintainable backend services is paramount in modern application development. This agent skill empowers you to efficiently implement standardized Create, Read, Update, and Delete (CRUD) operations within your Spring Boot applications. By leveraging established patterns for aggregates, repositories, and DTOs, you can ensure consistency, reduce boilerplate, and accelerate development of RESTful APIs. It guides you in structuring your code for clarity and scalability, fostering a clean separation of concerns crucial for large-scale projects and team collaboration.

# When to Use This Skill
- •Implementing a new microservice that requires a set of standard CRUD endpoints for a domain entity (aggregate).
- •Refactoring an existing Spring Boot application to adhere to a more structured, feature-aligned architecture using DDD principles.
- •Developing secure and validated REST APIs by incorporating DTOs and request validation for incoming client data.
- •Debugging transaction issues or data consistency problems within Spring Data JPA repositories.

# Pro Tips
- 💡**Automate DTO Mapping:** Utilize libraries like MapStruct to automatically map between JPA entities and DTOs, significantly reducing manual mapping boilerplate and potential errors.
- 💡**Leverage Spring's Validation API:** Combine `@Valid` and JSR 380 annotations (like `@NotNull`, `@Size`) on DTOs to ensure robust input validation at the controller layer before data reaches your service logic.
- 💡**Strategic Transactional Boundaries:** Ensure your `@Transactional` annotations are placed correctly, typically at the service layer, to define clear transaction boundaries and maintain data integrity across multiple repository operations.

