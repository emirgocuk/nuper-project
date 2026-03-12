# spring-boot-dependency-injection
Source: https://antigravity.codes/agent-skills/backend/spring-boot-dependency-injection

## AI Worker Instructions
When the user requests functionality related to spring-boot-dependency-injection, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-dependency-injection
```
@Service
```
```
@Component
```
```
@Repository
```
```
@ServiceConnection
```
```
./gradlew test
```
```
mvn test
```
```
./references/
```
```
@Autowired
```
```
@RequiredArgsConstructor
```
```
final
```
```
Objects.requireNonNull
```
```
@Configuration
```
```
@Bean
```
```
./references/reference.md
```
```
@Autowired(required = false)
```
```
ObjectProvider<T>
```
```
./references/examples.md#example-2-setter-injection-for-optional-dependencies
```
```
@Primary
```
```
@Qualifier
```
```
./references/reference.md#conditional-bean-registration
```
```
@WebMvcTest
```
```
@DataJpaTest
```
```
@SpringBootTest
```
```
./references/reference.md#testing-with-dependency-injection
```
```
@Service@RequiredArgsConstructorpublic class UserService {    private final UserRepository userRepository;    private final EmailService emailService;    public User register(UserRegistrationRequest request) {        User user = User.create(request.email(), request.name());        userRepository.save(user);        emailService.sendWelcome(user);        return user;    }}
```
```
@Service@RequiredArgsConstructorpublic class UserService {    private final UserRepository userRepository;    private final EmailService emailService;    public User register(UserRegistrationRequest request) {        User user = User.create(request.email(), request.name());        userRepository.save(user);        emailService.sendWelcome(user);        return user;    }}
```
```
new UserService(mockRepo, mockEmailService);
```
```
@Servicepublic class ReportService {    private final ReportRepository reportRepository;    private CacheService cacheService = CacheService.noOp();    public ReportService(ReportRepository reportRepository) {        this.reportRepository = reportRepository;    }    @Autowired(required = false)    public void setCacheService(CacheService cacheService) {        this.cacheService = cacheService;    }}
```
```
@Servicepublic class ReportService {    private final ReportRepository reportRepository;    private CacheService cacheService = CacheService.noOp();    public ReportService(ReportRepository reportRepository) {        this.reportRepository = reportRepository;    }    @Autowired(required = false)    public void setCacheService(CacheService cacheService) {        this.cacheService = cacheService;    }}
```
```
CacheService.noOp()
```
```
@Configuration@Import(DatabaseConfig.class)public class MessagingConfig {    @Bean    @ConditionalOnProperty(name = "feature.notifications.enabled", havingValue = "true")    public NotificationService emailNotificationService(JavaMailSender sender) {        return new EmailNotificationService(sender);    }    @Bean    @ConditionalOnMissingBean(NotificationService.class)    public NotificationService noopNotificationService() {        return NotificationService.noOp();    }}
```
```
@Configuration@Import(DatabaseConfig.class)public class MessagingConfig {    @Bean    @ConditionalOnProperty(name = "feature.notifications.enabled", havingValue = "true")    public NotificationService emailNotificationService(JavaMailSender sender) {        return new EmailNotificationService(sender);    }    @Bean    @ConditionalOnMissingBean(NotificationService.class)    public NotificationService noopNotificationService() {        return NotificationService.noOp();    }}
```
```
@Import
```
```
./references/examples.md
```
```
@Autowired
```
```
null
```
```
@Lazy
```
```
spring-boot-crud-patterns
```
```
spring-boot-rest-api-standards
```
```
unit-test-service-layer
```
This skill elevates your Spring Boot development by codifying best practices for dependency injection. It champions a constructor-first approach, ensuring your components are explicit, immutable, and inherently testable. Beyond basic wiring, discover advanced techniques for managing optional collaborations and resolving bean ambiguities with precision. By integrating these patterns, developers can build more resilient, maintainable, and framework-agnostic services, fostering a codebase that's easier to understand, debug, and evolve. This guide empowers you to craft cleaner, more efficient Spring applications right from the start.

# When to Use This Skill
- •Refactoring existing Spring applications from field injection to constructor injection.
- •Designing new `@Service`, `@Component`, or `@Repository` classes with explicit dependencies.
- •Implementing flexible, pluggable features using optional collaborators or feature flags.
- •Conducting pre-integration test audits of Spring bean configurations before deployment.

# Pro Tips
- 💡Always make injected dependencies `final` when using constructor injection to ensure immutability and prevent accidental reassignment.
- 💡Leverage Java Records (Java 17+) for data-carrying DTOs and even simple service components to get constructor injection, `equals()`, `hashCode()`, and `toString()` for free.
- 💡Prioritize `@Qualifier` for resolving bean ambiguity over `@Primary` as it offers more explicit control and reduces hidden dependencies, improving clarity.

