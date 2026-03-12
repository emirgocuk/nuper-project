# spring-data-neo4j
Source: https://antigravity.codes/agent-skills/database/spring-data-neo4j

## AI Worker Instructions
When the user requests functionality related to spring-data-neo4j, follow these guidelines and utilize this context.

## Scraped Content

# spring-data-neo4j
```
<dependency>    <groupId>org.springframework.boot</groupId>    <artifactId>spring-boot-starter-data-neo4j</artifactId></dependency>
```
```
<dependency>    <groupId>org.springframework.boot</groupId>    <artifactId>spring-boot-starter-data-neo4j</artifactId></dependency>
```
```
dependencies {    implementation 'org.springframework.boot:spring-boot-starter-data-neo4j'}
```
```
dependencies {    implementation 'org.springframework.boot:spring-boot-starter-data-neo4j'}
```
```
spring.neo4j.uri=bolt://localhost:7687spring.neo4j.authentication.username=neo4jspring.neo4j.authentication.password=secret
```
```
spring.neo4j.uri=bolt://localhost:7687spring.neo4j.authentication.username=neo4jspring.neo4j.authentication.password=secret
```
```
@Configurationpublic class Neo4jConfig {    @Bean    Configuration cypherDslConfiguration() {        return Configuration.newConfig()            .withDialect(Dialect.NEO4J_5).build();    }}
```
```
@Configurationpublic class Neo4jConfig {    @Bean    Configuration cypherDslConfiguration() {        return Configuration.newConfig()            .withDialect(Dialect.NEO4J_5).build();    }}
```
```
@Node("Movie")public class MovieEntity {    @Id    private final String title;  // Business key as ID    @Property("tagline")    private final String description;    private final Integer year;    @Relationship(type = "ACTED_IN", direction = Direction.INCOMING)    private List<Roles> actorsAndRoles = new ArrayList<>();    @Relationship(type = "DIRECTED", direction = Direction.INCOMING)    private List<PersonEntity> directors = new ArrayList<>();    public MovieEntity(String title, String description, Integer year) {        this.title = title;        this.description = description;        this.year = year;    }}
```
```
@Node("Movie")public class MovieEntity {    @Id    private final String title;  // Business key as ID    @Property("tagline")    private final String description;    private final Integer year;    @Relationship(type = "ACTED_IN", direction = Direction.INCOMING)    private List<Roles> actorsAndRoles = new ArrayList<>();    @Relationship(type = "DIRECTED", direction = Direction.INCOMING)    private List<PersonEntity> directors = new ArrayList<>();    public MovieEntity(String title, String description, Integer year) {        this.title = title;        this.description = description;        this.year = year;    }}
```
```
@Node("Movie")public class MovieEntity {    @Id @GeneratedValue    private Long id;    private final String title;    @Property("tagline")    private final String description;    public MovieEntity(String title, String description) {        this.id = null;  // Never set manually        this.title = title;        this.description = description;    }    // Wither method for immutability with generated IDs    public MovieEntity withId(Long id) {        if (this.id != null && this.id.equals(id)) {            return this;        } else {            MovieEntity newObject = new MovieEntity(this.title, this.description);            newObject.id = id;            return newObject;        }    }}
```
```
@Node("Movie")public class MovieEntity {    @Id @GeneratedValue    private Long id;    private final String title;    @Property("tagline")    private final String description;    public MovieEntity(String title, String description) {        this.id = null;  // Never set manually        this.title = title;        this.description = description;    }    // Wither method for immutability with generated IDs    public MovieEntity withId(Long id) {        if (this.id != null && this.id.equals(id)) {            return this;        } else {            MovieEntity newObject = new MovieEntity(this.title, this.description);            newObject.id = id;            return newObject;        }    }}
```
```
@Repositorypublic interface MovieRepository extends Neo4jRepository<MovieEntity, String> {    // Query derivation from method name    MovieEntity findOneByTitle(String title);    List<MovieEntity> findAllByYear(Integer year);    List<MovieEntity> findByYearBetween(Integer startYear, Integer endYear);}
```
```
@Repositorypublic interface MovieRepository extends Neo4jRepository<MovieEntity, String> {    // Query derivation from method name    MovieEntity findOneByTitle(String title);    List<MovieEntity> findAllByYear(Integer year);    List<MovieEntity> findByYearBetween(Integer startYear, Integer endYear);}
```
```
@Repositorypublic interface MovieRepository extends ReactiveNeo4jRepository<MovieEntity, String> {    Mono<MovieEntity> findOneByTitle(String title);    Flux<MovieEntity> findAllByYear(Integer year);}
```
```
@Repositorypublic interface MovieRepository extends ReactiveNeo4jRepository<MovieEntity, String> {    Mono<MovieEntity> findOneByTitle(String title);    Flux<MovieEntity> findAllByYear(Integer year);}
```
```
Neo4jRepository
```
```
ReactiveNeo4jRepository
```
```
@Repositorypublic interface AuthorRepository extends Neo4jRepository<Author, Long> {    @Query("MATCH (b:Book)-[:WRITTEN_BY]->(a:Author) " +           "WHERE a.name = $name AND b.year > $year " +           "RETURN b")    List<Book> findBooksAfterYear(@Param("name") String name,                                   @Param("year") Integer year);    @Query("MATCH (b:Book)-[:WRITTEN_BY]->(a:Author) " +           "WHERE a.name = $name " +           "RETURN b ORDER BY b.year DESC")    List<Book> findBooksByAuthorOrderByYearDesc(@Param("name") String name);}
```
```
@Repositorypublic interface AuthorRepository extends Neo4jRepository<Author, Long> {    @Query("MATCH (b:Book)-[:WRITTEN_BY]->(a:Author) " +           "WHERE a.name = $name AND b.year > $year " +           "RETURN b")    List<Book> findBooksAfterYear(@Param("name") String name,                                   @Param("year") Integer year);    @Query("MATCH (b:Book)-[:WRITTEN_BY]->(a:Author) " +           "WHERE a.name = $name " +           "RETURN b ORDER BY b.year DESC")    List<Book> findBooksByAuthorOrderByYearDesc(@Param("name") String name);}
```
```
$parameterName
```
```
@Param
```
```
@DataNeo4jTestclass BookRepositoryIntegrationTest {    private static Neo4j embeddedServer;    @BeforeAll    static void initializeNeo4j() {        embeddedServer = Neo4jBuilders.newInProcessBuilder()            .withDisabledServer()  // No HTTP access needed            .withFixture(                "CREATE (b:Book {isbn: '978-0547928210', " +                "name: 'The Fellowship of the Ring', year: 1954})" +                "-[:WRITTEN_BY]->(a:Author {id: 1, name: 'J. R. R. Tolkien'}) " +                "CREATE (b2:Book {isbn: '978-0547928203', " +                "name: 'The Two Towers', year: 1956})" +                "-[:WRITTEN_BY]->(a)"            )            .build();    }    @AfterAll    static void stopNeo4j() {        embeddedServer.close();    }    @DynamicPropertySource    static void neo4jProperties(DynamicPropertyRegistry registry) {        registry.add("spring.neo4j.uri", embeddedServer::boltURI);        registry.add("spring.neo4j.authentication.username", () -> "neo4j");        registry.add("spring.neo4j.authentication.password", () -> "null");    }    @Autowired    private BookRepository bookRepository;    @Test    void givenBookExists_whenFindOneByTitle_thenBookIsReturned() {        Book book = bookRepository.findOneByTitle("The Fellowship of the Ring");        assertThat(book.getIsbn()).isEqualTo("978-0547928210");    }}
```
```
@DataNeo4jTestclass BookRepositoryIntegrationTest {    private static Neo4j embeddedServer;    @BeforeAll    static void initializeNeo4j() {        embeddedServer = Neo4jBuilders.newInProcessBuilder()            .withDisabledServer()  // No HTTP access needed            .withFixture(                "CREATE (b:Book {isbn: '978-0547928210', " +                "name: 'The Fellowship of the Ring', year: 1954})" +                "-[:WRITTEN_BY]->(a:Author {id: 1, name: 'J. R. R. Tolkien'}) " +                "CREATE (b2:Book {isbn: '978-0547928203', " +                "name: 'The Two Towers', year: 1956})" +                "-[:WRITTEN_BY]->(a)"            )            .build();    }    @AfterAll    static void stopNeo4j() {        embeddedServer.close();    }    @DynamicPropertySource    static void neo4jProperties(DynamicPropertyRegistry registry) {        registry.add("spring.neo4j.uri", embeddedServer::boltURI);        registry.add("spring.neo4j.authentication.username", () -> "neo4j");        registry.add("spring.neo4j.authentication.password", () -> "null");    }    @Autowired    private BookRepository bookRepository;    @Test    void givenBookExists_whenFindOneByTitle_thenBookIsReturned() {        Book book = bookRepository.findOneByTitle("The Fellowship of the Ring");        assertThat(book.getIsbn()).isEqualTo("978-0547928210");    }}
```
```
Neo4jRepository
```
```
ReactiveNeo4jRepository
```
```
withFixture()
```
```
@DataNeo4jTest
```
Unlock the full potential of graph databases in your Spring Boot applications with this specialized Spring Data Neo4j Agent Skill. It streamlines the complexities of integrating Neo4j with Java projects, helping you define intricate graph models, map relationships, and craft optimized Cypher queries. This skill empowers you to build scalable and performant graph-based systems, whether you're working with imperative or reactive patterns. Leverage its expertise to accelerate development, ensure best practices, and achieve seamless interaction with your Neo4j instances, transforming how you approach graph data management efficiently.

# When to Use This Skill
- •Designing and implementing graph data models with Spring Data Neo4j
- •Developing microservices that leverage Neo4j as their primary data store
- •Creating custom repositories and complex Cypher queries for advanced graph traversals
- •Integrating reactive programming patterns for high-throughput Neo4j operations

# Pro Tips
- 💡Always define clear relationship directions and types to optimize query performance and ensure semantic clarity in your graph model.
- 💡Utilize the `Neo4jTemplate` for complex, dynamic queries or batch operations that are difficult to express via derived repository methods.
- 💡Leverage Spring's `@Transactional` annotation for graph operations to ensure data consistency, especially when modifying multiple nodes or relationships.

