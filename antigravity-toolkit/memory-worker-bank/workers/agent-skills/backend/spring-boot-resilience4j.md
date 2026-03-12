# spring-boot-resilience4j
Source: https://antigravity.codes/agent-skills/backend/spring-boot-resilience4j

## AI Worker Instructions
When the user requests functionality related to spring-boot-resilience4j, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-resilience4j
```
pom.xml
```
```
<dependency>    <groupId>io.github.resilience4j</groupId>    <artifactId>resilience4j-spring-boot3</artifactId>    <version>2.2.0</version> // Use latest stable version</dependency><dependency>    <groupId>org.springframework.boot</groupId>    <artifactId>spring-boot-starter-aop</artifactId></dependency><dependency>    <groupId>org.springframework.boot</groupId>    <artifactId>spring-boot-starter-actuator</artifactId></dependency>
```
```
<dependency>    <groupId>io.github.resilience4j</groupId>    <artifactId>resilience4j-spring-boot3</artifactId>    <version>2.2.0</version> // Use latest stable version</dependency><dependency>    <groupId>org.springframework.boot</groupId>    <artifactId>spring-boot-starter-aop</artifactId></dependency><dependency>    <groupId>org.springframework.boot</groupId>    <artifactId>spring-boot-starter-actuator</artifactId></dependency>
```
```
build.gradle
```
```
implementation "io.github.resilience4j:resilience4j-spring-boot3:2.2.0"implementation "org.springframework.boot:spring-boot-starter-aop"implementation "org.springframework.boot:spring-boot-starter-actuator"
```
```
implementation "io.github.resilience4j:resilience4j-spring-boot3:2.2.0"implementation "org.springframework.boot:spring-boot-starter-aop"implementation "org.springframework.boot:spring-boot-starter-actuator"
```
```
@EnableAspectJAutoProxy
```
```
@CircuitBreaker
```
```
@Servicepublic class PaymentService {    private final RestTemplate restTemplate;    public PaymentService(RestTemplate restTemplate) {        this.restTemplate = restTemplate;    }    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")    public PaymentResponse processPayment(PaymentRequest request) {        return restTemplate.postForObject("http://payment-api/process",            request, PaymentResponse.class);    }    private PaymentResponse paymentFallback(PaymentRequest request, Exception ex) {        return PaymentResponse.builder()            .status("PENDING")            .message("Service temporarily unavailable")            .build();    }}
```
```
@Servicepublic class PaymentService {    private final RestTemplate restTemplate;    public PaymentService(RestTemplate restTemplate) {        this.restTemplate = restTemplate;    }    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")    public PaymentResponse processPayment(PaymentRequest request) {        return restTemplate.postForObject("http://payment-api/process",            request, PaymentResponse.class);    }    private PaymentResponse paymentFallback(PaymentRequest request, Exception ex) {        return PaymentResponse.builder()            .status("PENDING")            .message("Service temporarily unavailable")            .build();    }}
```
```
application.yml
```
```
resilience4j:  circuitbreaker:    configs:      default:        registerHealthIndicator: true        slidingWindowSize: 10        minimumNumberOfCalls: 5        failureRateThreshold: 50        waitDurationInOpenState: 10s    instances:      paymentService:        baseConfig: default
```
```
resilience4j:  circuitbreaker:    configs:      default:        registerHealthIndicator: true        slidingWindowSize: 10        minimumNumberOfCalls: 5        failureRateThreshold: 50        waitDurationInOpenState: 10s    instances:      paymentService:        baseConfig: default
```
```
@Retry
```
```
@Servicepublic class ProductService {    private final RestTemplate restTemplate;    public ProductService(RestTemplate restTemplate) {        this.restTemplate = restTemplate;    }    @Retry(name = "productService", fallbackMethod = "getProductFallback")    public Product getProduct(Long productId) {        return restTemplate.getForObject(            "http://product-api/products/" + productId,            Product.class);    }    private Product getProductFallback(Long productId, Exception ex) {        return Product.builder()            .id(productId)            .name("Unavailable")            .available(false)            .build();    }}
```
```
@Servicepublic class ProductService {    private final RestTemplate restTemplate;    public ProductService(RestTemplate restTemplate) {        this.restTemplate = restTemplate;    }    @Retry(name = "productService", fallbackMethod = "getProductFallback")    public Product getProduct(Long productId) {        return restTemplate.getForObject(            "http://product-api/products/" + productId,            Product.class);    }    private Product getProductFallback(Long productId, Exception ex) {        return Product.builder()            .id(productId)            .name("Unavailable")            .available(false)            .build();    }}
```
```
application.yml
```
```
resilience4j:  retry:    configs:      default:        maxAttempts: 3        waitDuration: 500ms        enableExponentialBackoff: true        exponentialBackoffMultiplier: 2    instances:      productService:        baseConfig: default        maxAttempts: 5
```
```
resilience4j:  retry:    configs:      default:        maxAttempts: 3        waitDuration: 500ms        enableExponentialBackoff: true        exponentialBackoffMultiplier: 2    instances:      productService:        baseConfig: default        maxAttempts: 5
```
```
@RateLimiter
```
```
@Servicepublic class NotificationService {    private final EmailClient emailClient;    public NotificationService(EmailClient emailClient) {        this.emailClient = emailClient;    }    @RateLimiter(name = "notificationService",        fallbackMethod = "rateLimitFallback")    public void sendEmail(EmailRequest request) {        emailClient.send(request);    }    private void rateLimitFallback(EmailRequest request, Exception ex) {        throw new RateLimitExceededException(            "Too many requests. Please try again later.");    }}
```
```
@Servicepublic class NotificationService {    private final EmailClient emailClient;    public NotificationService(EmailClient emailClient) {        this.emailClient = emailClient;    }    @RateLimiter(name = "notificationService",        fallbackMethod = "rateLimitFallback")    public void sendEmail(EmailRequest request) {        emailClient.send(request);    }    private void rateLimitFallback(EmailRequest request, Exception ex) {        throw new RateLimitExceededException(            "Too many requests. Please try again later.");    }}
```
```
application.yml
```
```
resilience4j:  ratelimiter:    configs:      default:        registerHealthIndicator: true        limitForPeriod: 10        limitRefreshPeriod: 1s        timeoutDuration: 500ms    instances:      notificationService:        baseConfig: default        limitForPeriod: 5
```
```
resilience4j:  ratelimiter:    configs:      default:        registerHealthIndicator: true        limitForPeriod: 10        limitRefreshPeriod: 1s        timeoutDuration: 500ms    instances:      notificationService:        baseConfig: default        limitForPeriod: 5
```
```
@Bulkhead
```
```
type = SEMAPHORE
```
```
@Servicepublic class ReportService {    private final ReportGenerator reportGenerator;    public ReportService(ReportGenerator reportGenerator) {        this.reportGenerator = reportGenerator;    }    @Bulkhead(name = "reportService", type = Bulkhead.Type.SEMAPHORE)    public Report generateReport(ReportRequest request) {        return reportGenerator.generate(request);    }}
```
```
@Servicepublic class ReportService {    private final ReportGenerator reportGenerator;    public ReportService(ReportGenerator reportGenerator) {        this.reportGenerator = reportGenerator;    }    @Bulkhead(name = "reportService", type = Bulkhead.Type.SEMAPHORE)    public Report generateReport(ReportRequest request) {        return reportGenerator.generate(request);    }}
```
```
type = THREADPOOL
```
```
@Servicepublic class AnalyticsService {    @Bulkhead(name = "analyticsService", type = Bulkhead.Type.THREADPOOL)    public CompletableFuture<AnalyticsResult> runAnalytics(            AnalyticsRequest request) {        return CompletableFuture.supplyAsync(() ->            analyticsEngine.analyze(request));    }}
```
```
@Servicepublic class AnalyticsService {    @Bulkhead(name = "analyticsService", type = Bulkhead.Type.THREADPOOL)    public CompletableFuture<AnalyticsResult> runAnalytics(            AnalyticsRequest request) {        return CompletableFuture.supplyAsync(() ->            analyticsEngine.analyze(request));    }}
```
```
application.yml
```
```
resilience4j:  bulkhead:    configs:      default:        maxConcurrentCalls: 10        maxWaitDuration: 100ms    instances:      reportService:        baseConfig: default        maxConcurrentCalls: 5  thread-pool-bulkhead:    instances:      analyticsService:        maxThreadPoolSize: 8
```
```
resilience4j:  bulkhead:    configs:      default:        maxConcurrentCalls: 10        maxWaitDuration: 100ms    instances:      reportService:        baseConfig: default        maxConcurrentCalls: 5  thread-pool-bulkhead:    instances:      analyticsService:        maxThreadPoolSize: 8
```
```
@TimeLimiter
```
```
@Servicepublic class SearchService {    @TimeLimiter(name = "searchService", fallbackMethod = "searchFallback")    public CompletableFuture<SearchResults> search(SearchQuery query) {        return CompletableFuture.supplyAsync(() ->            searchEngine.executeSearch(query));    }    private CompletableFuture<SearchResults> searchFallback(            SearchQuery query, Exception ex) {        return CompletableFuture.completedFuture(            SearchResults.empty("Search timed out"));    }}
```
```
@Servicepublic class SearchService {    @TimeLimiter(name = "searchService", fallbackMethod = "searchFallback")    public CompletableFuture<SearchResults> search(SearchQuery query) {        return CompletableFuture.supplyAsync(() ->            searchEngine.executeSearch(query));    }    private CompletableFuture<SearchResults> searchFallback(            SearchQuery query, Exception ex) {        return CompletableFuture.completedFuture(            SearchResults.empty("Search timed out"));    }}
```
```
application.yml
```
```
resilience4j:  timelimiter:    configs:      default:        timeoutDuration: 2s        cancelRunningFuture: true    instances:      searchService:        baseConfig: default        timeoutDuration: 3s
```
```
resilience4j:  timelimiter:    configs:      default:        timeoutDuration: 2s        cancelRunningFuture: true    instances:      searchService:        baseConfig: default        timeoutDuration: 3s
```
```
@Servicepublic class OrderService {    @CircuitBreaker(name = "orderService")    @Retry(name = "orderService")    @RateLimiter(name = "orderService")    @Bulkhead(name = "orderService")    public Order createOrder(OrderRequest request) {        return orderClient.createOrder(request);    }}
```
```
@Servicepublic class OrderService {    @CircuitBreaker(name = "orderService")    @Retry(name = "orderService")    @RateLimiter(name = "orderService")    @Bulkhead(name = "orderService")    public Order createOrder(OrderRequest request) {        return orderClient.createOrder(request);    }}
```
```
@RestControllerAdvice
```
```
@RestControllerAdvicepublic class ResilienceExceptionHandler {    @ExceptionHandler(CallNotPermittedException.class)    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)    public ErrorResponse handleCircuitOpen(CallNotPermittedException ex) {        return new ErrorResponse("SERVICE_UNAVAILABLE",            "Service currently unavailable");    }    @ExceptionHandler(RequestNotPermitted.class)    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)    public ErrorResponse handleRateLimited(RequestNotPermitted ex) {        return new ErrorResponse("TOO_MANY_REQUESTS",            "Rate limit exceeded");    }    @ExceptionHandler(BulkheadFullException.class)    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)    public ErrorResponse handleBulkheadFull(BulkheadFullException ex) {        return new ErrorResponse("CAPACITY_EXCEEDED",            "Service at capacity");    }}
```
```
@RestControllerAdvicepublic class ResilienceExceptionHandler {    @ExceptionHandler(CallNotPermittedException.class)    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)    public ErrorResponse handleCircuitOpen(CallNotPermittedException ex) {        return new ErrorResponse("SERVICE_UNAVAILABLE",            "Service currently unavailable");    }    @ExceptionHandler(RequestNotPermitted.class)    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)    public ErrorResponse handleRateLimited(RequestNotPermitted ex) {        return new ErrorResponse("TOO_MANY_REQUESTS",            "Rate limit exceeded");    }    @ExceptionHandler(BulkheadFullException.class)    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)    public ErrorResponse handleBulkheadFull(BulkheadFullException ex) {        return new ErrorResponse("CAPACITY_EXCEEDED",            "Service at capacity");    }}
```
```
application.yml
```
```
management:  endpoints:    web:      exposure:        include: health,metrics,circuitbreakers,retries,ratelimiters  endpoint:    health:      show-details: always  health:    circuitbreakers:      enabled: true    ratelimiters:      enabled: true
```
```
management:  endpoints:    web:      exposure:        include: health,metrics,circuitbreakers,retries,ratelimiters  endpoint:    health:      show-details: always  health:    circuitbreakers:      enabled: true    ratelimiters:      enabled: true
```
```
GET /actuator/health
```
```
GET /actuator/circuitbreakers
```
```
GET /actuator/metrics
```
```
exponentialBackoffMultiplier: 2
```
```
failureRateThreshold
```
```
registerHealthIndicator: true
```
```
references/testing-patterns.md
```
```
references/configuration-reference.md
```
In modern microservices architectures, ensuring application resilience and fault tolerance is paramount. This agent skill empowers developers to seamlessly integrate the powerful Resilience4j library into their Spring Boot projects. By applying patterns like circuit breakers, retries, and rate limiters, you can proactively safeguard your services against transient failures, external service unresponsiveness, and resource overloads. This not only enhances the stability and reliability of individual components but also prevents cascading failures across your entire distributed system, leading to a more robust and dependable user experience. Leverage this skill to build highly available and self-healing applications.

# When to Use This Skill
- •Protecting an API gateway from unresponsive downstream microservices to maintain user experience.
- •Implementing an exponential backoff retry mechanism for database connection failures or transient network errors.
- •Rate limiting calls to a third-party payment gateway to comply with their API usage policies and prevent overage charges.
- •Isolating business logic processing from a heavy reporting service to prevent thread pool exhaustion and maintain critical service availability.

# Pro Tips
- 💡Combine multiple Resilience4j patterns (e.g., Circuit Breaker + Retry + Time Limiter) for comprehensive fault tolerance on critical operations and external calls.
- 💡Leverage Spring Boot Actuator endpoints (e.g., `/actuator/resilience4j`) for real-time monitoring of Resilience4j metrics, allowing you to observe pattern states and performance.
- 💡Tune the configuration parameters for each pattern (e.g., `failureRateThreshold`, `waitDurationInOpenState` for Circuit Breaker) based on the specific characteristics and expected latency of the external dependency or operation.

