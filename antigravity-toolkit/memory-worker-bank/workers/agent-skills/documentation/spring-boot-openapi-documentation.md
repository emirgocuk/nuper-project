# spring-boot-openapi-documentation
Source: https://antigravity.codes/agent-skills/documentation/spring-boot-openapi-documentation

## AI Worker Instructions
When the user requests functionality related to spring-boot-openapi-documentation, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-openapi-documentation
```
<!-- Standard WebMVC support --><dependency>    <groupId>org.springdoc</groupId>    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>    <version>2.8.13</version> // Use latest stable version</dependency><!-- Optional: therapi-runtime-javadoc for JavaDoc support --><dependency>    <groupId>com.github.therapi</groupId>    <artifactId>therapi-runtime-javadoc</artifactId>    <version>0.15.0</version> // Use latest stable version    <scope>provided</scope></dependency><!-- WebFlux support --><dependency>    <groupId>org.springdoc</groupId>    <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>    <version>2.8.13</version> // Use latest stable version</dependency>
```
```
<!-- Standard WebMVC support --><dependency>    <groupId>org.springdoc</groupId>    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>    <version>2.8.13</version> // Use latest stable version</dependency><!-- Optional: therapi-runtime-javadoc for JavaDoc support --><dependency>    <groupId>com.github.therapi</groupId>    <artifactId>therapi-runtime-javadoc</artifactId>    <version>0.15.0</version> // Use latest stable version    <scope>provided</scope></dependency><!-- WebFlux support --><dependency>    <groupId>org.springdoc</groupId>    <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>    <version>2.8.13</version> // Use latest stable version</dependency>
```
```
// Standard WebMVC supportimplementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.13'// Optional: therapi-runtime-javadoc for JavaDoc supportimplementation 'com.github.therapi:therapi-runtime-javadoc:0.15.0'// WebFlux supportimplementation 'org.springdoc:springdoc-openapi-starter-webflux-ui:2.8.13'
```
```
// Standard WebMVC supportimplementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.13'// Optional: therapi-runtime-javadoc for JavaDoc supportimplementation 'com.github.therapi:therapi-runtime-javadoc:0.15.0'// WebFlux supportimplementation 'org.springdoc:springdoc-openapi-starter-webflux-ui:2.8.13'
```
```
# application.propertiesspringdoc.api-docs.path=/api-docsspringdoc.swagger-ui.path=/swagger-ui-custom.htmlspringdoc.swagger-ui.operationsSorter=methodspringdoc.swagger-ui.tagsSorter=alphaspringdoc.swagger-ui.enabled=truespringdoc.api-docs.enabled=truespringdoc.packages-to-scan=com.example.controllerspringdoc.paths-to-match=/api/**
```
```
# application.propertiesspringdoc.api-docs.path=/api-docsspringdoc.swagger-ui.path=/swagger-ui-custom.htmlspringdoc.swagger-ui.operationsSorter=methodspringdoc.swagger-ui.tagsSorter=alphaspringdoc.swagger-ui.enabled=truespringdoc.api-docs.enabled=truespringdoc.packages-to-scan=com.example.controllerspringdoc.paths-to-match=/api/**
```
```
# application.ymlspringdoc:  api-docs:    path: /api-docs    enabled: true  swagger-ui:    path: /swagger-ui.html    enabled: true    operationsSorter: method    tagsSorter: alpha    tryItOutEnabled: true  packages-to-scan: com.example.controller  paths-to-match: /api/**
```
```
# application.ymlspringdoc:  api-docs:    path: /api-docs    enabled: true  swagger-ui:    path: /swagger-ui.html    enabled: true    operationsSorter: method    tagsSorter: alpha    tryItOutEnabled: true  packages-to-scan: com.example.controller  paths-to-match: /api/**
```
```
http://localhost:8080/v3/api-docs
```
```
http://localhost:8080/v3/api-docs.yaml
```
```
http://localhost:8080/swagger-ui/index.html
```
```
import io.swagger.v3.oas.annotations.Operation;import io.swagger.v3.oas.annotations.Parameter;import io.swagger.v3.oas.annotations.responses.ApiResponse;import io.swagger.v3.oas.annotations.responses.ApiResponses;import io.swagger.v3.oas.annotations.tags.Tag;import org.springframework.web.bind.annotation.*;@RestController@RequestMapping("/api/books")@Tag(name = "Book", description = "Book management APIs")public class BookController {    @Operation(        summary = "Retrieve a book by ID",        description = "Get a Book object by specifying its ID. The response includes id, title, author and description."    )    @ApiResponses(value = {        @ApiResponse(            responseCode = "200",            description = "Successfully retrieved book",            content = @Content(schema = @Schema(implementation = Book.class))        ),        @ApiResponse(            responseCode = "404",            description = "Book not found"        )    })    @GetMapping("/{id}")    public Book findById(        @Parameter(description = "ID of book to retrieve", required = true)        @PathVariable Long id    ) {        return repository.findById(id)            .orElseThrow(() -> new BookNotFoundException());    }}
```
```
import io.swagger.v3.oas.annotations.Operation;import io.swagger.v3.oas.annotations.Parameter;import io.swagger.v3.oas.annotations.responses.ApiResponse;import io.swagger.v3.oas.annotations.responses.ApiResponses;import io.swagger.v3.oas.annotations.tags.Tag;import org.springframework.web.bind.annotation.*;@RestController@RequestMapping("/api/books")@Tag(name = "Book", description = "Book management APIs")public class BookController {    @Operation(        summary = "Retrieve a book by ID",        description = "Get a Book object by specifying its ID. The response includes id, title, author and description."    )    @ApiResponses(value = {        @ApiResponse(            responseCode = "200",            description = "Successfully retrieved book",            content = @Content(schema = @Schema(implementation = Book.class))        ),        @ApiResponse(            responseCode = "404",            description = "Book not found"        )    })    @GetMapping("/{id}")    public Book findById(        @Parameter(description = "ID of book to retrieve", required = true)        @PathVariable Long id    ) {        return repository.findById(id)            .orElseThrow(() -> new BookNotFoundException());    }}
```
```
import io.swagger.v3.oas.annotations.parameters.RequestBody;import io.swagger.v3.oas.annotations.media.ExampleObject;@Operation(summary = "Create a new book")@PostMapping@ResponseStatus(HttpStatus.CREATED)public Book createBook(    @RequestBody(        description = "Book to create",        required = true,        content = @Content(            schema = @Schema(implementation = Book.class),            examples = @ExampleObject(                value = """                {                    "title": "Clean Code",                    "author": "Robert C. Martin",                    "isbn": "978-0132350884",                    "description": "A handbook of agile software craftsmanship"                }                """            )        )    )    Book book) {    return repository.save(book);}
```
```
import io.swagger.v3.oas.annotations.parameters.RequestBody;import io.swagger.v3.oas.annotations.media.ExampleObject;@Operation(summary = "Create a new book")@PostMapping@ResponseStatus(HttpStatus.CREATED)public Book createBook(    @RequestBody(        description = "Book to create",        required = true,        content = @Content(            schema = @Schema(implementation = Book.class),            examples = @ExampleObject(                value = """                {                    "title": "Clean Code",                    "author": "Robert C. Martin",                    "isbn": "978-0132350884",                    "description": "A handbook of agile software craftsmanship"                }                """            )        )    )    Book book) {    return repository.save(book);}
```
```
import io.swagger.v3.oas.annotations.media.Schema;import jakarta.validation.constraints.*;@Entity@Schema(description = "Book entity representing a published book")public class Book {    @Id    @GeneratedValue(strategy = GenerationType.IDENTITY)    @Schema(description = "Unique identifier", example = "1", accessMode = Schema.AccessMode.READ_ONLY)    private Long id;    @NotBlank(message = "Title is required")    @Size(min = 1, max = 200)    @Schema(description = "Book title", example = "Clean Code", required = true, maxLength = 200)    private String title;    @Pattern(regexp = "^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$")    @Schema(description = "ISBN number", example = "978-0132350884")    private String isbn;    // Additional fields, constructors, getters, setters}
```
```
import io.swagger.v3.oas.annotations.media.Schema;import jakarta.validation.constraints.*;@Entity@Schema(description = "Book entity representing a published book")public class Book {    @Id    @GeneratedValue(strategy = GenerationType.IDENTITY)    @Schema(description = "Unique identifier", example = "1", accessMode = Schema.AccessMode.READ_ONLY)    private Long id;    @NotBlank(message = "Title is required")    @Size(min = 1, max = 200)    @Schema(description = "Book title", example = "Clean Code", required = true, maxLength = 200)    private String title;    @Pattern(regexp = "^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$")    @Schema(description = "ISBN number", example = "978-0132350884")    private String isbn;    // Additional fields, constructors, getters, setters}
```
```
@Schema(hidden = true)private String internalField;@JsonIgnore@Schema(accessMode = Schema.AccessMode.READ_ONLY)private LocalDateTime createdAt;
```
```
@Schema(hidden = true)private String internalField;@JsonIgnore@Schema(accessMode = Schema.AccessMode.READ_ONLY)private LocalDateTime createdAt;
```
```
import io.swagger.v3.oas.annotations.security.SecurityRequirement;import io.swagger.v3.oas.models.Components;import io.swagger.v3.oas.models.security.SecurityScheme;@Configurationpublic class OpenAPISecurityConfig {    @Bean    public OpenAPI customOpenAPI() {        return new OpenAPI()            .components(new Components()                .addSecuritySchemes("bearer-jwt", new SecurityScheme()                    .type(SecurityScheme.Type.HTTP)                    .scheme("bearer")                    .bearerFormat("JWT")                    .description("JWT authentication")                )            );    }}// Apply security requirement@RestController@RequestMapping("/api/books")@SecurityRequirement(name = "bearer-jwt")public class BookController {    // All endpoints require JWT authentication}
```
```
import io.swagger.v3.oas.annotations.security.SecurityRequirement;import io.swagger.v3.oas.models.Components;import io.swagger.v3.oas.models.security.SecurityScheme;@Configurationpublic class OpenAPISecurityConfig {    @Bean    public OpenAPI customOpenAPI() {        return new OpenAPI()            .components(new Components()                .addSecuritySchemes("bearer-jwt", new SecurityScheme()                    .type(SecurityScheme.Type.HTTP)                    .scheme("bearer")                    .bearerFormat("JWT")                    .description("JWT authentication")                )            );    }}// Apply security requirement@RestController@RequestMapping("/api/books")@SecurityRequirement(name = "bearer-jwt")public class BookController {    // All endpoints require JWT authentication}
```
```
import io.swagger.v3.oas.models.security.OAuthFlow;import io.swagger.v3.oas.models.security.OAuthFlows;import io.swagger.v3.oas.models.security.Scopes;@Beanpublic OpenAPI customOpenAPI() {    return new OpenAPI()        .components(new Components()            .addSecuritySchemes("oauth2", new SecurityScheme()                .type(SecurityScheme.Type.OAUTH2)                .flows(new OAuthFlows()                    .authorizationCode(new OAuthFlow()                        .authorizationUrl("https://auth.example.com/oauth/authorize")                        .tokenUrl("https://auth.example.com/oauth/token")                        .scopes(new Scopes()                            .addString("read", "Read access")                            .addString("write", "Write access")                        )                    )                )            )        );}
```
```
import io.swagger.v3.oas.models.security.OAuthFlow;import io.swagger.v3.oas.models.security.OAuthFlows;import io.swagger.v3.oas.models.security.Scopes;@Beanpublic OpenAPI customOpenAPI() {    return new OpenAPI()        .components(new Components()            .addSecuritySchemes("oauth2", new SecurityScheme()                .type(SecurityScheme.Type.OAUTH2)                .flows(new OAuthFlows()                    .authorizationCode(new OAuthFlow()                        .authorizationUrl("https://auth.example.com/oauth/authorize")                        .tokenUrl("https://auth.example.com/oauth/token")                        .scopes(new Scopes()                            .addString("read", "Read access")                            .addString("write", "Write access")                        )                    )                )            )        );}
```
```
import org.springdoc.core.annotations.ParameterObject;import org.springframework.data.domain.Page;import org.springframework.data.domain.Pageable;@Operation(summary = "Get paginated list of books")@GetMapping("/paginated")public Page<Book> findAllPaginated(    @ParameterObject Pageable pageable) {    return repository.findAll(pageable);}
```
```
import org.springdoc.core.annotations.ParameterObject;import org.springframework.data.domain.Page;import org.springframework.data.domain.Pageable;@Operation(summary = "Get paginated list of books")@GetMapping("/paginated")public Page<Book> findAllPaginated(    @ParameterObject Pageable pageable) {    return repository.findAll(pageable);}
```
```
import org.springdoc.core.models.GroupedOpenApi;@Beanpublic GroupedOpenApi publicApi() {    return GroupedOpenApi.builder()        .group("public")        .pathsToMatch("/api/public/**")        .build();}@Beanpublic GroupedOpenApi adminApi() {    return GroupedOpenApi.builder()        .group("admin")        .pathsToMatch("/api/admin/**")        .build();}
```
```
import org.springdoc.core.models.GroupedOpenApi;@Beanpublic GroupedOpenApi publicApi() {    return GroupedOpenApi.builder()        .group("public")        .pathsToMatch("/api/public/**")        .build();}@Beanpublic GroupedOpenApi adminApi() {    return GroupedOpenApi.builder()        .group("admin")        .pathsToMatch("/api/admin/**")        .build();}
```
```
import org.springdoc.core.customizers.OperationCustomizer;@Beanpublic OperationCustomizer customizeOperation() {    return (operation, handlerMethod) -> {        operation.addExtension("x-custom-field", "custom-value");        return operation;    };}
```
```
import org.springdoc.core.customizers.OperationCustomizer;@Beanpublic OperationCustomizer customizeOperation() {    return (operation, handlerMethod) -> {        operation.addExtension("x-custom-field", "custom-value");        return operation;    };}
```
```
@Operation(hidden = true)@GetMapping("/internal")public String internalEndpoint() {    return "Hidden from docs";}// Hide entire controller@Hidden@RestControllerpublic class InternalController {    // All endpoints hidden}
```
```
@Operation(hidden = true)@GetMapping("/internal")public String internalEndpoint() {    return "Hidden from docs";}// Hide entire controller@Hidden@RestControllerpublic class InternalController {    // All endpoints hidden}
```
```
import org.springframework.web.bind.annotation.ExceptionHandler;import org.springframework.web.bind.annotation.ResponseStatus;import org.springframework.web.bind.annotation.RestControllerAdvice;@RestControllerAdvicepublic class GlobalExceptionHandler {    @ExceptionHandler(BookNotFoundException.class)    @ResponseStatus(HttpStatus.NOT_FOUND)    @Operation(hidden = true)    public ErrorResponse handleBookNotFound(BookNotFoundException ex) {        return new ErrorResponse("BOOK_NOT_FOUND", ex.getMessage());    }    @ExceptionHandler(ValidationException.class)    @ResponseStatus(HttpStatus.BAD_REQUEST)    @Operation(hidden = true)    public ErrorResponse handleValidation(ValidationException ex) {        return new ErrorResponse("VALIDATION_ERROR", ex.getMessage());    }}@Schema(description = "Error response")public record ErrorResponse(    @Schema(description = "Error code", example = "BOOK_NOT_FOUND")    String code,    @Schema(description = "Error message", example = "Book with ID 123 not found")    String message,    @Schema(description = "Timestamp", example = "2024-01-15T10:30:00Z")    LocalDateTime timestamp) {}
```
```
import org.springframework.web.bind.annotation.ExceptionHandler;import org.springframework.web.bind.annotation.ResponseStatus;import org.springframework.web.bind.annotation.RestControllerAdvice;@RestControllerAdvicepublic class GlobalExceptionHandler {    @ExceptionHandler(BookNotFoundException.class)    @ResponseStatus(HttpStatus.NOT_FOUND)    @Operation(hidden = true)    public ErrorResponse handleBookNotFound(BookNotFoundException ex) {        return new ErrorResponse("BOOK_NOT_FOUND", ex.getMessage());    }    @ExceptionHandler(ValidationException.class)    @ResponseStatus(HttpStatus.BAD_REQUEST)    @Operation(hidden = true)    public ErrorResponse handleValidation(ValidationException ex) {        return new ErrorResponse("VALIDATION_ERROR", ex.getMessage());    }}@Schema(description = "Error response")public record ErrorResponse(    @Schema(description = "Error code", example = "BOOK_NOT_FOUND")    String code,    @Schema(description = "Error message", example = "Book with ID 123 not found")    String message,    @Schema(description = "Timestamp", example = "2024-01-15T10:30:00Z")    LocalDateTime timestamp) {}
```
```
<plugin>    <groupId>org.springdoc</groupId>    <artifactId>springdoc-openapi-maven-plugin</artifactId>    <version>1.4</version>    <executions>        <execution>            <phase>integration-test</phase>            <goals>                <goal>generate</goal>            </goals>        </execution>    </executions>    <configuration>        <apiDocsUrl>http://localhost:8080/v3/api-docs</apiDocsUrl>        <outputFileName>openapi.json</outputFileName>        <outputDir>${project.build.directory}</outputDir>    </configuration></plugin>
```
```
<plugin>    <groupId>org.springdoc</groupId>    <artifactId>springdoc-openapi-maven-plugin</artifactId>    <version>1.4</version>    <executions>        <execution>            <phase>integration-test</phase>            <goals>                <goal>generate</goal>            </goals>        </execution>    </executions>    <configuration>        <apiDocsUrl>http://localhost:8080/v3/api-docs</apiDocsUrl>        <outputFileName>openapi.json</outputFileName>        <outputDir>${project.build.directory}</outputDir>    </configuration></plugin>
```
```
plugins {    id 'org.springdoc.openapi-gradle-plugin' version '1.9.0'}openApi {    apiDocsUrl = "http://localhost:8080/v3/api-docs"    outputDir = file("$buildDir/docs")    outputFileName = "openapi.json"}
```
```
plugins {    id 'org.springdoc.openapi-gradle-plugin' version '1.9.0'}openApi {    apiDocsUrl = "http://localhost:8080/v3/api-docs"    outputDir = file("$buildDir/docs")    outputFileName = "openapi.json"}
```
```
import io.swagger.v3.oas.annotations.Operation;import io.swagger.v3.oas.annotations.Parameter;import io.swagger.v3.oas.annotations.media.Content;import io.swagger.v3.oas.annotations.media.Schema;import io.swagger.v3.oas.annotations.responses.ApiResponse;import io.swagger.v3.oas.annotations.responses.ApiResponses;import io.swagger.v3.oas.annotations.tags.Tag;import io.swagger.v3.oas.annotations.security.SecurityRequirement;import org.springframework.data.domain.Page;import org.springframework.data.domain.Pageable;import org.springdoc.core.annotations.ParameterObject;import org.springframework.web.bind.annotation.*;import jakarta.validation.Valid;@RestController@RequestMapping("/api/books")@Tag(name = "Book", description = "Book management APIs")@SecurityRequirement(name = "bearer-jwt")public class BookController {    private final BookService bookService;    public BookController(BookService bookService) {        this.bookService = bookService;    }    @Operation(summary = "Get all books")    @ApiResponses(value = {        @ApiResponse(            responseCode = "200",            description = "Found all books",            content = @Content(                mediaType = "application/json",                array = @ArraySchema(schema = @Schema(implementation = Book.class))            )        )    })    @GetMapping    public List<Book> getAllBooks() {        return bookService.getAllBooks();    }    @Operation(summary = "Get paginated books")    @GetMapping("/paginated")    public Page<Book> getBooksPaginated(@ParameterObject Pageable pageable) {        return bookService.getBooksPaginated(pageable);    }    @Operation(summary = "Get book by ID")    @ApiResponses(value = {        @ApiResponse(responseCode = "200", description = "Book found"),        @ApiResponse(responseCode = "404", description = "Book not found")    })    @GetMapping("/{id}")    public Book getBookById(@PathVariable Long id) {        return bookService.getBookById(id);    }    @Operation(summary = "Create new book")    @ApiResponses(value = {        @ApiResponse(responseCode = "201", description = "Book created successfully"),        @ApiResponse(responseCode = "400", description = "Invalid input")    })    @PostMapping    @ResponseStatus(HttpStatus.CREATED)    public Book createBook(@Valid @RequestBody Book book) {        return bookService.createBook(book);    }    @Operation(summary = "Update book")    @ApiResponses(value = {        @ApiResponse(responseCode = "200", description = "Book updated"),        @ApiResponse(responseCode = "404", description = "Book not found")    })    @PutMapping("/{id}")    public Book updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {        return bookService.updateBook(id, book);    }    @Operation(summary = "Delete book")    @ApiResponses(value = {        @ApiResponse(responseCode = "204", description = "Book deleted"),        @ApiResponse(responseCode = "404", description = "Book not found")    })    @DeleteMapping("/{id}")    @ResponseStatus(HttpStatus.NO_CONTENT)    public void deleteBook(@PathVariable Long id) {        bookService.deleteBook(id);    }}
```
```
import io.swagger.v3.oas.annotations.Operation;import io.swagger.v3.oas.annotations.Parameter;import io.swagger.v3.oas.annotations.media.Content;import io.swagger.v3.oas.annotations.media.Schema;import io.swagger.v3.oas.annotations.responses.ApiResponse;import io.swagger.v3.oas.annotations.responses.ApiResponses;import io.swagger.v3.oas.annotations.tags.Tag;import io.swagger.v3.oas.annotations.security.SecurityRequirement;import org.springframework.data.domain.Page;import org.springframework.data.domain.Pageable;import org.springdoc.core.annotations.ParameterObject;import org.springframework.web.bind.annotation.*;import jakarta.validation.Valid;@RestController@RequestMapping("/api/books")@Tag(name = "Book", description = "Book management APIs")@SecurityRequirement(name = "bearer-jwt")public class BookController {    private final BookService bookService;    public BookController(BookService bookService) {        this.bookService = bookService;    }    @Operation(summary = "Get all books")    @ApiResponses(value = {        @ApiResponse(            responseCode = "200",            description = "Found all books",            content = @Content(                mediaType = "application/json",                array = @ArraySchema(schema = @Schema(implementation = Book.class))            )        )    })    @GetMapping    public List<Book> getAllBooks() {        return bookService.getAllBooks();    }    @Operation(summary = "Get paginated books")    @GetMapping("/paginated")    public Page<Book> getBooksPaginated(@ParameterObject Pageable pageable) {        return bookService.getBooksPaginated(pageable);    }    @Operation(summary = "Get book by ID")    @ApiResponses(value = {        @ApiResponse(responseCode = "200", description = "Book found"),        @ApiResponse(responseCode = "404", description = "Book not found")    })    @GetMapping("/{id}")    public Book getBookById(@PathVariable Long id) {        return bookService.getBookById(id);    }    @Operation(summary = "Create new book")    @ApiResponses(value = {        @ApiResponse(responseCode = "201", description = "Book created successfully"),        @ApiResponse(responseCode = "400", description = "Invalid input")    })    @PostMapping    @ResponseStatus(HttpStatus.CREATED)    public Book createBook(@Valid @RequestBody Book book) {        return bookService.createBook(book);    }    @Operation(summary = "Update book")    @ApiResponses(value = {        @ApiResponse(responseCode = "200", description = "Book updated"),        @ApiResponse(responseCode = "404", description = "Book not found")    })    @PutMapping("/{id}")    public Book updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {        return bookService.updateBook(id, book);    }    @Operation(summary = "Delete book")    @ApiResponses(value = {        @ApiResponse(responseCode = "204", description = "Book deleted"),        @ApiResponse(responseCode = "404", description = "Book not found")    })    @DeleteMapping("/{id}")    @ResponseStatus(HttpStatus.NO_CONTENT)    public void deleteBook(@PathVariable Long id) {        bookService.deleteBook(id);    }}
```
```
@ExampleObject
```
```
@ParameterObject
```
```
@SecurityRequirement
```
```
@Hidden
```
```
@Tag
```
```
@Operation
```
```
@ApiResponse
```
```
@ApiResponses
```
```
@Parameter
```
```
@RequestBody
```
```
@Schema
```
```
@SecurityRequirement
```
```
@Hidden
```
```
@ParameterObject
```
```
@NotNull
```
```
@NotBlank
```
```
@NotEmpty
```
```
@Size(min, max)
```
```
@Min
```
```
@Max
```
```
@Pattern
```
```
@Email
```
```
@DecimalMin
```
```
@DecimalMax
```
```
@Positive
```
```
@PositiveOrZero
```
```
@Negative
```
```
@NegativeOrZero
```
```
spring-boot-rest-api-standards
```
```
spring-boot-dependency-injection
```
```
unit-test-controller-layer
```
```
spring-boot-actuator
```
In today's fast-paced development landscape, clear and accessible API documentation is paramount for efficient team collaboration and external integration. This AI agent skill empowers developers to effortlessly generate robust REST API documentation within Spring Boot 3.x applications using SpringDoc OpenAPI 3.0 and Swagger UI. By automating setup and providing guidelines for comprehensive annotation, it ensures your API's capabilities, data models, and security mechanisms are meticulously cataloged. This streamlines onboarding for new team members and fosters seamless communication with API consumers, ultimately accelerating project delivery and reducing integration hurdles.

# When to Use This Skill
- •Setting up brand new API documentation for a Spring Boot 3.x REST service from scratch.
- •Adding detailed descriptions, examples, and schema definitions to existing REST endpoints for clarity.
- •Implementing security documentation for JWT, OAuth2, or Basic Authentication within your OpenAPI specification.
- •Customizing the appearance and functionality of the Swagger UI to match branding or enhance developer experience.

# Pro Tips
- 💡**Consistency is Key**: Always strive for consistent use of OpenAPI annotations across all endpoints. Leverage `@Schema` for data models and `@ApiResponse` for various response codes (200, 400, 401, 500) to provide a complete and accurate picture.
- 💡**Automate Security Documentation**: Integrate Spring Security seamlessly to allow SpringDoc to automatically pick up security schemes (like JWT Bearer tokens) from your configuration, leading to a more robust and less error-prone security documentation setup.
- 💡**Leverage Programmatic Customization**: For complex scenarios, highly dynamic APIs, or specific integration requirements, use SpringDoc's `OpenApiCustomizer` beans. This allows you to programmatically modify the generated OpenAPI definition, offering maximum flexibility beyond what annotations alone can achieve.

