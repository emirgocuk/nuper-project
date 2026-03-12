# spring-boot-test-patterns
Source: https://antigravity.codes/agent-skills/testing/spring-boot-test-patterns

## AI Worker Instructions
When the user requests functionality related to spring-boot-test-patterns, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-test-patterns
```
@SpringBootTest
```
```
@DataJpaTest
```
```
@WebMvcTest
```
```
@WebFluxTest
```
```
@JsonTest
```
```
@ServiceConnection
```
```
@DynamicPropertySource
```
```
@Testcontainers
```
```
<dependencies>    <!-- Spring Boot Test Starter -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-test</artifactId>        <scope>test</scope>    </dependency>    <!-- Testcontainers -->    <dependency>        <groupId>org.testcontainers</groupId>        <artifactId>junit-jupiter</artifactId>        <version>1.19.0</version>        <scope>test</scope>    </dependency>    <dependency>        <groupId>org.testcontainers</groupId>        <artifactId>postgresql</artifactId>        <version>1.19.0</version>        <scope>test</scope>    </dependency>    <!-- Additional Testing Dependencies -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-data-jpa</artifactId>    </dependency>    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-web</artifactId>    </dependency></dependencies>
```
```
<dependencies>    <!-- Spring Boot Test Starter -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-test</artifactId>        <scope>test</scope>    </dependency>    <!-- Testcontainers -->    <dependency>        <groupId>org.testcontainers</groupId>        <artifactId>junit-jupiter</artifactId>        <version>1.19.0</version>        <scope>test</scope>    </dependency>    <dependency>        <groupId>org.testcontainers</groupId>        <artifactId>postgresql</artifactId>        <version>1.19.0</version>        <scope>test</scope>    </dependency>    <!-- Additional Testing Dependencies -->    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-data-jpa</artifactId>    </dependency>    <dependency>        <groupId>org.springframework.boot</groupId>        <artifactId>spring-boot-starter-web</artifactId>    </dependency></dependencies>
```
```
dependencies {    // Spring Boot Test Starter    testImplementation("org.springframework.boot:spring-boot-starter-test")    // Testcontainers    testImplementation("org.testcontainers:junit-jupiter:1.19.0")    testImplementation("org.testcontainers:postgresql:1.19.0")    // Additional Dependencies    implementation("org.springframework.boot:spring-boot-starter-data-jpa")    implementation("org.springframework.boot:spring-boot-starter-web")}
```
```
dependencies {    // Spring Boot Test Starter    testImplementation("org.springframework.boot:spring-boot-starter-test")    // Testcontainers    testImplementation("org.testcontainers:junit-jupiter:1.19.0")    testImplementation("org.testcontainers:postgresql:1.19.0")    // Additional Dependencies    implementation("org.springframework.boot:spring-boot-starter-data-jpa")    implementation("org.springframework.boot:spring-boot-starter-web")}
```
```
class UserServiceTest {    @Mock    private UserRepository userRepository;    @InjectMocks    private UserService userService;    @BeforeEach    void setUp() {        MockitoAnnotations.openMocks(this);    }    @Test    void shouldFindUserByIdWhenExists() {        // Arrange        Long userId = 1L;        User user = new User();        user.setId(userId);        user.setEmail("test@example.com");        when(userRepository.findById(userId)).thenReturn(Optional.of(user));        // Act        Optional<User> result = userService.findById(userId);        // Assert        assertThat(result).isPresent();        assertThat(result.get().getEmail()).isEqualTo("test@example.com");        verify(userRepository, times(1)).findById(userId);    }}
```
```
class UserServiceTest {    @Mock    private UserRepository userRepository;    @InjectMocks    private UserService userService;    @BeforeEach    void setUp() {        MockitoAnnotations.openMocks(this);    }    @Test    void shouldFindUserByIdWhenExists() {        // Arrange        Long userId = 1L;        User user = new User();        user.setId(userId);        user.setEmail("test@example.com");        when(userRepository.findById(userId)).thenReturn(Optional.of(user));        // Act        Optional<User> result = userService.findById(userId);        // Assert        assertThat(result).isPresent();        assertThat(result.get().getEmail()).isEqualTo("test@example.com");        verify(userRepository, times(1)).findById(userId);    }}
```
```
// Repository test with minimal context@DataJpaTest@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)@TestContainerConfigpublic class UserRepositoryIntegrationTest {    @Autowired    private UserRepository userRepository;    @Test    void shouldSaveAndRetrieveUserFromDatabase() {        // Arrange        User user = new User();        user.setEmail("test@example.com");        user.setName("Test User");        // Act        User saved = userRepository.save(user);        userRepository.flush();        Optional<User> retrieved = userRepository.findByEmail("test@example.com");        // Assert        assertThat(retrieved).isPresent();        assertThat(retrieved.get().getName()).isEqualTo("Test User");    }}
```
```
// Repository test with minimal context@DataJpaTest@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)@TestContainerConfigpublic class UserRepositoryIntegrationTest {    @Autowired    private UserRepository userRepository;    @Test    void shouldSaveAndRetrieveUserFromDatabase() {        // Arrange        User user = new User();        user.setEmail("test@example.com");        user.setName("Test User");        // Act        User saved = userRepository.save(user);        userRepository.flush();        Optional<User> retrieved = userRepository.findByEmail("test@example.com");        // Assert        assertThat(retrieved).isPresent();        assertThat(retrieved.get().getName()).isEqualTo("Test User");    }}
```
```
@SpringBootTest@AutoConfigureMockMvc@Transactionalpublic class UserControllerIntegrationTest {    @Autowired    private MockMvc mockMvc;    @Autowired    private ObjectMapper objectMapper;    @Autowired    private UserService userService;    @Test    void shouldCreateUserAndReturn201() throws Exception {        User user = new User();        user.setEmail("newuser@example.com");        user.setName("New User");        mockMvc.perform(post("/api/users")                .contentType(MediaType.APPLICATION_JSON)                .content(objectMapper.writeValueAsString(user)))            .andExpect(status().isCreated())            .andExpect(jsonPath("$.id").exists())            .andExpect(jsonPath("$.email").value("newuser@example.com"))            .andExpect(jsonPath("$.name").value("New User"));    }}
```
```
@SpringBootTest@AutoConfigureMockMvc@Transactionalpublic class UserControllerIntegrationTest {    @Autowired    private MockMvc mockMvc;    @Autowired    private ObjectMapper objectMapper;    @Autowired    private UserService userService;    @Test    void shouldCreateUserAndReturn201() throws Exception {        User user = new User();        user.setEmail("newuser@example.com");        user.setName("New User");        mockMvc.perform(post("/api/users")                .contentType(MediaType.APPLICATION_JSON)                .content(objectMapper.writeValueAsString(user)))            .andExpect(status().isCreated())            .andExpect(jsonPath("$.id").exists())            .andExpect(jsonPath("$.email").value("newuser@example.com"))            .andExpect(jsonPath("$.name").value("New User"));    }}
```
```
@TestConfigurationpublic class TestContainerConfig {    @Bean    @ServiceConnection    public PostgreSQLContainer<?> postgresContainer() {        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"))            .withDatabaseName("testdb")            .withUsername("test")            .withPassword("test");    }}
```
```
@TestConfigurationpublic class TestContainerConfig {    @Bean    @ServiceConnection    public PostgreSQLContainer<?> postgresContainer() {        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"))            .withDatabaseName("testdb")            .withUsername("test")            .withPassword("test");    }}
```
```
@Testvoid shouldCalculateTotalPrice() {    // Arrange    OrderItem item1 = new OrderItem();    item1.setPrice(10.0);    item1.setQuantity(2);    OrderItem item2 = new OrderItem();    item2.setPrice(15.0);    item2.setQuantity(1);    List<OrderItem> items = List.of(item1, item2);    // Act    double total = orderService.calculateTotal(items);    // Assert    assertThat(total).isEqualTo(35.0);}
```
```
@Testvoid shouldCalculateTotalPrice() {    // Arrange    OrderItem item1 = new OrderItem();    item1.setPrice(10.0);    item1.setQuantity(2);    OrderItem item2 = new OrderItem();    item2.setPrice(15.0);    item2.setQuantity(1);    List<OrderItem> items = List.of(item1, item2);    // Act    double total = orderService.calculateTotal(items);    // Assert    assertThat(total).isEqualTo(35.0);}
```
```
@SpringBootTest@TestContainerConfigpublic class OrderServiceIntegrationTest {    @Autowired    private OrderService orderService;    @Autowired    private UserRepository userRepository;    @MockBean    private PaymentService paymentService;    @Test    void shouldCreateOrderWithRealDatabase() {        // Arrange        User user = new User();        user.setEmail("customer@example.com");        user.setName("John Doe");        User savedUser = userRepository.save(user);        OrderRequest request = new OrderRequest();        request.setUserId(savedUser.getId());        request.setItems(List.of(            new OrderItemRequest(1L, 2),            new OrderItemRequest(2L, 1)        ));        when(paymentService.processPayment(any())).thenReturn(true);        // Act        OrderResponse response = orderService.createOrder(request);        // Assert        assertThat(response.getOrderId()).isNotNull();        assertThat(response.getStatus()).isEqualTo("COMPLETED");        verify(paymentService, times(1)).processPayment(any());    }}
```
```
@SpringBootTest@TestContainerConfigpublic class OrderServiceIntegrationTest {    @Autowired    private OrderService orderService;    @Autowired    private UserRepository userRepository;    @MockBean    private PaymentService paymentService;    @Test    void shouldCreateOrderWithRealDatabase() {        // Arrange        User user = new User();        user.setEmail("customer@example.com");        user.setName("John Doe");        User savedUser = userRepository.save(user);        OrderRequest request = new OrderRequest();        request.setUserId(savedUser.getId());        request.setItems(List.of(            new OrderItemRequest(1L, 2),            new OrderItemRequest(2L, 1)        ));        when(paymentService.processPayment(any())).thenReturn(true);        // Act        OrderResponse response = orderService.createOrder(request);        // Assert        assertThat(response.getOrderId()).isNotNull();        assertThat(response.getStatus()).isEqualTo("COMPLETED");        verify(paymentService, times(1)).processPayment(any());    }}
```
```
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)@AutoConfigureWebTestClientpublic class ReactiveUserControllerIntegrationTest {    @Autowired    private WebTestClient webTestClient;    @Test    void shouldReturnUserAsJsonReactive() {        // Arrange        User user = new User();        user.setEmail("reactive@example.com");        user.setName("Reactive User");        // Act & Assert        webTestClient.get()            .uri("/api/users/1")            .exchange()            .expectStatus().isOk()            .expectBody()            .jsonPath("$.email").isEqualTo("reactive@example.com")            .jsonPath("$.name").isEqualTo("Reactive User");    }}
```
```
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)@AutoConfigureWebTestClientpublic class ReactiveUserControllerIntegrationTest {    @Autowired    private WebTestClient webTestClient;    @Test    void shouldReturnUserAsJsonReactive() {        // Arrange        User user = new User();        user.setEmail("reactive@example.com");        user.setName("Reactive User");        // Act & Assert        webTestClient.get()            .uri("/api/users/1")            .exchange()            .expectStatus().isOk()            .expectBody()            .jsonPath("$.email").isEqualTo("reactive@example.com")            .jsonPath("$.name").isEqualTo("Reactive User");    }}
```
```
// Use @DataJpaTest for repository-only tests (fastest)@DataJpaTestpublic class UserRepositoryTest { }// Use @WebMvcTest for controller-only tests@WebMvcTest(UserController.class)public class UserControllerTest { }// Use @SpringBootTest only for full integration testing@SpringBootTestpublic class UserServiceFullIntegrationTest { }
```
```
// Use @DataJpaTest for repository-only tests (fastest)@DataJpaTestpublic class UserRepositoryTest { }// Use @WebMvcTest for controller-only tests@WebMvcTest(UserController.class)public class UserControllerTest { }// Use @SpringBootTest only for full integration testing@SpringBootTestpublic class UserServiceFullIntegrationTest { }
```
```
@ServiceConnection
```
```
@DynamicPropertySource
```
```
// Good - Spring Boot 3.5+@TestConfigurationpublic class TestConfig {    @Bean    @ServiceConnection    public PostgreSQLContainer<?> postgres() {        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"));    }}
```
```
// Good - Spring Boot 3.5+@TestConfigurationpublic class TestConfig {    @Bean    @ServiceConnection    public PostgreSQLContainer<?> postgres() {        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"));    }}
```
```
// Good - Explicit setup@BeforeEachvoid setUp() {    userRepository.deleteAll();    User user = new User();    user.setEmail("test@example.com");    userRepository.save(user);}// Avoid - Depending on other tests@Testvoid testUserExists() {    // Assumes previous test created a user    Optional<User> user = userRepository.findByEmail("test@example.com");    assertThat(user).isPresent();}
```
```
// Good - Explicit setup@BeforeEachvoid setUp() {    userRepository.deleteAll();    User user = new User();    user.setEmail("test@example.com");    userRepository.save(user);}// Avoid - Depending on other tests@Testvoid testUserExists() {    // Assumes previous test created a user    Optional<User> user = userRepository.findByEmail("test@example.com");    assertThat(user).isPresent();}
```
```
// Good - Clear, readable assertionsassertThat(user.getEmail())    .isEqualTo("test@example.com");assertThat(users)    .hasSize(3)    .contains(expectedUser);// Avoid - JUnit assertionsassertEquals("test@example.com", user.getEmail());assertTrue(users.size() == 3);
```
```
// Good - Clear, readable assertionsassertThat(user.getEmail())    .isEqualTo("test@example.com");assertThat(users)    .hasSize(3)    .contains(expectedUser);// Avoid - JUnit assertionsassertEquals("test@example.com", user.getEmail());assertTrue(users.size() == 3);
```
```
// Repository tests (uses @DataJpaTest)public class UserRepositoryTest { }// Controller tests (uses @WebMvcTest)public class UserControllerTest { }// Service tests (uses mocks, no context)public class UserServiceTest { }// Full integration tests (uses @SpringBootTest)public class UserFullIntegrationTest { }
```
```
// Repository tests (uses @DataJpaTest)public class UserRepositoryTest { }// Controller tests (uses @WebMvcTest)public class UserControllerTest { }// Service tests (uses mocks, no context)public class UserServiceTest { }// Full integration tests (uses @SpringBootTest)public class UserFullIntegrationTest { }
```
```
// Group repository tests with same configuration@DataJpaTest@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)@TestContainerConfig@TestPropertySource(properties = "spring.datasource.url=jdbc:postgresql:testdb")public class UserRepositoryTest { }// Group controller tests with same configuration@WebMvcTest(UserController.class)@AutoConfigureMockMvcpublic class UserControllerTest { }
```
```
// Group repository tests with same configuration@DataJpaTest@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)@TestContainerConfig@TestPropertySource(properties = "spring.datasource.url=jdbc:postgresql:testdb")public class UserRepositoryTest { }// Group controller tests with same configuration@WebMvcTest(UserController.class)@AutoConfigureMockMvcpublic class UserControllerTest { }
```
```
@Testcontainerspublic class ContainerConfig {    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>(        DockerImageName.parse("postgres:16-alpine"))        .withDatabaseName("testdb")        .withUsername("test")        .withPassword("test");    @BeforeAll    static void startAll() {        POSTGRES.start();    }    @AfterAll    static void stopAll() {        POSTGRES.stop();    }}
```
```
@Testcontainerspublic class ContainerConfig {    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>(        DockerImageName.parse("postgres:16-alpine"))        .withDatabaseName("testdb")        .withUsername("test")        .withPassword("test");    @BeforeAll    static void startAll() {        POSTGRES.start();    }    @AfterAll    static void stopAll() {        POSTGRES.stop();    }}
```
```
# Run all tests./mvnw test# Run specific test class./mvnw test -Dtest=UserServiceTest# Run integration tests only./mvnw test -Dintegration-test=true# Run tests with coverage./mvnw clean jacoco:prepare-agent test jacoco:report
```
```
# Run all tests./mvnw test# Run specific test class./mvnw test -Dtest=UserServiceTest# Run integration tests only./mvnw test -Dintegration-test=true# Run tests with coverage./mvnw clean jacoco:prepare-agent test jacoco:report
```
```
# Run all tests./gradlew test# Run specific test class./gradlew test --tests UserServiceTest# Run integration tests only./gradlew integrationTest# Run tests with coverage./gradlew test jacocoTestReport
```
```
# Run all tests./gradlew test# Run specific test class./gradlew test --tests UserServiceTest# Run integration tests only./gradlew integrationTest# Run tests with coverage./gradlew test jacocoTestReport
```
```
name: Spring Boot Testson: [push, pull_request]jobs:  test:    runs-on: ubuntu-latest    services:      postgres:        image: postgres:16-alpine        env:          POSTGRES_PASSWORD: test          POSTGRES_USER: test          POSTGRES_DB: testdb        options: >-          --health-cmd pg_isready          --health-interval 10s          --health-timeout 5s          --health-retries 5    steps:    - uses: actions/checkout@v3    - name: Set up JDK 17      uses: actions/setup-java@v3      with:        java-version: '17'        distribution: 'temurin'    - name: Cache Maven dependencies      uses: actions/cache@v3      with:        path: ~/.m2/repository        key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}        restore-keys: ${{ runner.os }}-maven-    - name: Run tests      run: ./mvnw test -Dspring.profiles.active=test
```
```
name: Spring Boot Testson: [push, pull_request]jobs:  test:    runs-on: ubuntu-latest    services:      postgres:        image: postgres:16-alpine        env:          POSTGRES_PASSWORD: test          POSTGRES_USER: test          POSTGRES_DB: testdb        options: >-          --health-cmd pg_isready          --health-interval 10s          --health-timeout 5s          --health-retries 5    steps:    - uses: actions/checkout@v3    - name: Set up JDK 17      uses: actions/setup-java@v3      with:        java-version: '17'        distribution: 'temurin'    - name: Cache Maven dependencies      uses: actions/cache@v3      with:        path: ~/.m2/repository        key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}        restore-keys: ${{ runner.os }}-maven-    - name: Run tests      run: ./mvnw test -Dspring.profiles.active=test
```
```
version: '3.8'services:  postgres:    image: postgres:16-alpine    environment:      POSTGRES_DB: testdb      POSTGRES_USER: test      POSTGRES_PASSWORD: test    ports:      - "5432:5432"    volumes:      - postgres_data:/var/lib/postgresql/datavolumes:  postgres_data:
```
```
version: '3.8'services:  postgres:    image: postgres:16-alpine    environment:      POSTGRES_DB: testdb      POSTGRES_USER: test      POSTGRES_PASSWORD: test    ports:      - "5432:5432"    volumes:      - postgres_data:/var/lib/postgresql/datavolumes:  postgres_data:
```
Building reliable Spring Boot applications demands a robust testing strategy, but navigating the myriad of tools and patterns can be daunting. This agent skill distills complex testing methodologies into actionable guidance, empowering developers to construct comprehensive and efficient test suites. Beyond merely showing you *how* to write tests, it delves into the *why*, fostering a deeper understanding of test architecture and performance optimization. Leverage this skill to elevate your testing game, ensuring high-quality code and faster feedback loops throughout your development lifecycle, from isolated unit tests to full-stack integration scenarios.

# When to Use This Skill
- •Designing a new Spring Boot application and needing a structured approach to integrate testing from the ground up.
- •Improving the test coverage and reliability of an existing Spring Boot codebase, especially for complex business logic or database interactions.
- •Optimizing CI/CD pipeline performance by reducing test execution times through context caching and efficient container management.
- •Migrating older Spring Boot test setups to modern JUnit 5 practices, leveraging Mockito and Testcontainers for enhanced clarity and maintainability.

# Pro Tips
- 💡Prioritize fast feedback: Start with isolated unit tests for core logic, then layer on integration and slice tests only where necessary to validate component interactions.
- 💡Leverage `@ServiceConnection` or Testcontainers' native integration for external services to ensure tests run against realistic environments without manual setup overhead.
- 💡Implement a robust test data management strategy. Use builders, factories, or database cleaning techniques (like `spring.jpa.hibernate.ddl-auto=create-drop` or specialized libraries) to ensure test isolation and reproducibility.

