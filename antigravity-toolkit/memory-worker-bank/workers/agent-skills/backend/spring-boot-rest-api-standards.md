# spring-boot-rest-api-standards
Source: https://antigravity.codes/agent-skills/backend/spring-boot-rest-api-standards

## AI Worker Instructions
When the user requests functionality related to spring-boot-rest-api-standards, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-rest-api-standards
```
@Data
```
```
@Value
```
```
@Valid
```
```
@RequestBody
```
```
@NotBlank
```
```
@Email
```
```
@Size
```
```
MethodArgumentNotValidException
```
```
@RestControllerAdvice
```
```
ResponseStatusException
```
```
@RestController@RequestMapping("/v1/users")@RequiredArgsConstructor@Slf4jpublic class UserController {    private final UserService userService;    @GetMapping    public ResponseEntity<Page<UserResponse>> getAllUsers(            @RequestParam(defaultValue = "0") int page,            @RequestParam(defaultValue = "10") int pageSize) {        log.debug("Fetching users page {} size {}", page, pageSize);        Page<UserResponse> users = userService.getAll(page, pageSize);        return ResponseEntity.ok(users);    }    @GetMapping("/{id}")    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {        return ResponseEntity.ok(userService.getById(id));    }    @PostMapping    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {        UserResponse created = userService.create(request);        return ResponseEntity.status(HttpStatus.CREATED).body(created);    }    @PutMapping("/{id}")    public ResponseEntity<UserResponse> updateUser(            @PathVariable Long id,            @Valid @RequestBody UpdateUserRequest request) {        return ResponseEntity.ok(userService.update(id, request));    }    @DeleteMapping("/{id}")    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {        userService.delete(id);        return ResponseEntity.noContent().build();    }}
```
```
@RestController@RequestMapping("/v1/users")@RequiredArgsConstructor@Slf4jpublic class UserController {    private final UserService userService;    @GetMapping    public ResponseEntity<Page<UserResponse>> getAllUsers(            @RequestParam(defaultValue = "0") int page,            @RequestParam(defaultValue = "10") int pageSize) {        log.debug("Fetching users page {} size {}", page, pageSize);        Page<UserResponse> users = userService.getAll(page, pageSize);        return ResponseEntity.ok(users);    }    @GetMapping("/{id}")    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {        return ResponseEntity.ok(userService.getById(id));    }    @PostMapping    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {        UserResponse created = userService.create(request);        return ResponseEntity.status(HttpStatus.CREATED).body(created);    }    @PutMapping("/{id}")    public ResponseEntity<UserResponse> updateUser(            @PathVariable Long id,            @Valid @RequestBody UpdateUserRequest request) {        return ResponseEntity.ok(userService.update(id, request));    }    @DeleteMapping("/{id}")    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {        userService.delete(id);        return ResponseEntity.noContent().build();    }}
```
```
// Request DTO@Data@NoArgsConstructor@AllArgsConstructorpublic class CreateUserRequest {    @NotBlank(message = "User name cannot be blank")    private String name;    @Email(message = "Valid email required")    private String email;}// Response DTO@Data@NoArgsConstructor@AllArgsConstructorpublic class UserResponse {    private Long id;    private String name;    private String email;    private LocalDateTime createdAt;}
```
```
// Request DTO@Data@NoArgsConstructor@AllArgsConstructorpublic class CreateUserRequest {    @NotBlank(message = "User name cannot be blank")    private String name;    @Email(message = "Valid email required")    private String email;}// Response DTO@Data@NoArgsConstructor@AllArgsConstructorpublic class UserResponse {    private Long id;    private String name;    private String email;    private LocalDateTime createdAt;}
```
```
@RestControllerAdvice@Slf4jpublic class GlobalExceptionHandler {    @ExceptionHandler(MethodArgumentNotValidException.class)    public ResponseEntity<ErrorResponse> handleValidationException(            MethodArgumentNotValidException ex, WebRequest request) {        String errors = ex.getBindingResult().getFieldErrors().stream()                .map(f -> f.getField() + ": " + f.getDefaultMessage())                .collect(Collectors.joining(", "));        ErrorResponse errorResponse = new ErrorResponse(                HttpStatus.BAD_REQUEST.value(),                "Validation Error",                "Validation failed: " + errors,                request.getDescription(false).replaceFirst("uri=", "")        );        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);    }    @ExceptionHandler(ResponseStatusException.class)    public ResponseEntity<ErrorResponse> handleResponseStatusException(            ResponseStatusException ex, WebRequest request) {        ErrorResponse error = new ErrorResponse(            ex.getStatusCode().value(),            ex.getStatusCode().toString(),            ex.getReason(),            request.getDescription(false).replaceFirst("uri=", "")        );        return new ResponseEntity<>(error, ex.getStatusCode());    }}
```
```
@RestControllerAdvice@Slf4jpublic class GlobalExceptionHandler {    @ExceptionHandler(MethodArgumentNotValidException.class)    public ResponseEntity<ErrorResponse> handleValidationException(            MethodArgumentNotValidException ex, WebRequest request) {        String errors = ex.getBindingResult().getFieldErrors().stream()                .map(f -> f.getField() + ": " + f.getDefaultMessage())                .collect(Collectors.joining(", "));        ErrorResponse errorResponse = new ErrorResponse(                HttpStatus.BAD_REQUEST.value(),                "Validation Error",                "Validation failed: " + errors,                request.getDescription(false).replaceFirst("uri=", "")        );        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);    }    @ExceptionHandler(ResponseStatusException.class)    public ResponseEntity<ErrorResponse> handleResponseStatusException(            ResponseStatusException ex, WebRequest request) {        ErrorResponse error = new ErrorResponse(            ex.getStatusCode().value(),            ex.getStatusCode().toString(),            ex.getReason(),            request.getDescription(false).replaceFirst("uri=", "")        );        return new ResponseEntity<>(error, ex.getStatusCode());    }}
```
```
@Service@RequiredArgsConstructorpublic class UserService {    private final UserRepository userRepository;    private final EmailService emailService;    // Dependencies are explicit and testable}
```
```
@Service@RequiredArgsConstructorpublic class UserService {    private final UserRepository userRepository;    private final EmailService emailService;    // Dependencies are explicit and testable}
```
```
// Java records (JDK 16+)public record UserResponse(Long id, String name, String email, LocalDateTime createdAt) {}// Lombok @Value for immutability@Valuepublic class UserResponse {    Long id;    String name;    String email;    LocalDateTime createdAt;}
```
```
// Java records (JDK 16+)public record UserResponse(Long id, String name, String email, LocalDateTime createdAt) {}// Lombok @Value for immutability@Valuepublic class UserResponse {    Long id;    String name;    String email;    LocalDateTime createdAt;}
```
```
@PostMappingpublic ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {    // Validation happens automatically before method execution    return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));}
```
```
@PostMappingpublic ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {    // Validation happens automatically before method execution    return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));}
```
```
return ResponseEntity.status(HttpStatus.CREATED)    .header("Location", "/api/users/" + created.getId())    .header("X-Total-Count", String.valueOf(userService.count()))    .body(created);
```
```
return ResponseEntity.status(HttpStatus.CREATED)    .header("Location", "/api/users/" + created.getId())    .header("X-Total-Count", String.valueOf(userService.count()))    .body(created);
```
```
@Service@Transactionalpublic class UserService {    @Transactional(readOnly = true)    public Optional<User> findById(Long id) {        return userRepository.findById(id);    }    @Transactional    public User create(User user) {        return userRepository.save(user);    }}
```
```
@Service@Transactionalpublic class UserService {    @Transactional(readOnly = true)    public Optional<User> findById(Long id) {        return userRepository.findById(id);    }    @Transactional    public User create(User user) {        return userRepository.save(user);    }}
```
```
@Slf4j@Servicepublic class UserService {    public User create(User user) {        log.info("Creating user with email: {}", user.getEmail());        return userRepository.save(user);    }}
```
```
@Slf4j@Servicepublic class UserService {    public User create(User user) {        log.info("Creating user with email: {}", user.getEmail());        return userRepository.save(user);    }}
```
```
/** * Retrieves a user by id. * * @param id the user id * @return ResponseEntity containing a UserResponse * @throws ResponseStatusException with 404 if user not found */@GetMapping("/{id}")public ResponseEntity<UserResponse> getUserById(@PathVariable Long id)
```
```
/** * Retrieves a user by id. * * @param id the user id * @return ResponseEntity containing a UserResponse * @throws ResponseStatusException with 404 if user not found */@GetMapping("/{id}")public ResponseEntity<UserResponse> getUserById(@PathVariable Long id)
```
```
@Autowired
```
```
references/
```
```
agents/spring-boot-code-review-specialist.md
```
```
spring-boot-dependency-injection/SKILL.md
```
```
junit-test-patterns/SKILL.md
```
Crafting a well-designed REST API is crucial for the success and maintainability of any modern application. This agent skill empowers developers to build exceptional Spring Boot RESTful services by adhering to industry-leading standards. Go beyond basic implementation and leverage a comprehensive toolkit for consistency across endpoints, robust error management, secure data exposure, and optimal performance. Elevate your API development workflow, ensuring every service is production-ready, scalable, and easy for consumers to integrate, ultimately boosting project quality and developer efficiency in Spring Boot environments.

# When to Use This Skill
- •Developing a new Spring Boot microservice requiring a robust and standardized API interface.
- •Refactoring existing Spring Boot REST endpoints to improve consistency, error handling, and security.
- •Designing API contracts (DTOs) and implementing data validation across multiple Spring Boot services.
- •Conducting an architectural review of a Spring Boot application's API layer to ensure adherence to best practices.

# Pro Tips
- 💡Always generate a dedicated API documentation (e.g., OpenAPI/Swagger) alongside the code guided by this skill to ensure external consumers understand the standardized contracts.
- 💡Integrate automated API testing frameworks (like Postman, Rest-Assured) to validate adherence to the standards defined by this skill immediately after generation or modification.
- 💡Consider applying this skill iteratively, focusing on critical areas like error handling and DTO consistency first, then expanding to pagination and HATEOAS.

