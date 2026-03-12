# unit-test-controller-layer
Source: https://antigravity.codes/agent-skills/testing/unit-test-controller-layer

## AI Worker Instructions
When the user requests functionality related to unit-test-controller-layer, follow these guidelines and utilize this context.

## Scraped Content

# unit-test-controller-layer
```
<dependency>  <groupId>org.springframework.boot</groupId>  <artifactId>spring-boot-starter-test</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.mockito</groupId>  <artifactId>mockito-core</artifactId>  <scope>test</scope></dependency>
```
```
<dependency>  <groupId>org.springframework.boot</groupId>  <artifactId>spring-boot-starter-test</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.mockito</groupId>  <artifactId>mockito-core</artifactId>  <scope>test</scope></dependency>
```
```
dependencies {  testImplementation("org.springframework.boot:spring-boot-starter-test")  testImplementation("org.mockito:mockito-core")}
```
```
dependencies {  testImplementation("org.springframework.boot:spring-boot-starter-test")  testImplementation("org.mockito:mockito-core")}
```
```
import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.InjectMocks;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;import org.springframework.test.web.servlet.MockMvc;import org.springframework.test.web.servlet.setup.MockMvcBuilders;import static org.mockito.Mockito.*;import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;@ExtendWith(MockitoExtension.class)class UserControllerTest {  @Mock  private UserService userService;  @InjectMocks  private UserController userController;  private MockMvc mockMvc;  void setUp() {    mockMvc = MockMvcBuilders.standaloneSetup(userController).build();  }  @Test  void shouldReturnAllUsers() throws Exception {    List<UserDto> users = List.of(      new UserDto(1L, "Alice"),      new UserDto(2L, "Bob")    );    when(userService.getAllUsers()).thenReturn(users);    mockMvc.perform(get("/api/users"))      .andExpect(status().isOk())      .andExpect(jsonPath("$").isArray())      .andExpect(jsonPath("$[0].id").value(1))      .andExpect(jsonPath("$[0].name").value("Alice"))      .andExpect(jsonPath("$[1].id").value(2));    verify(userService, times(1)).getAllUsers();  }  @Test  void shouldReturnUserById() throws Exception {    UserDto user = new UserDto(1L, "Alice");    when(userService.getUserById(1L)).thenReturn(user);    mockMvc.perform(get("/api/users/1"))      .andExpect(status().isOk())      .andExpect(jsonPath("$.id").value(1))      .andExpect(jsonPath("$.name").value("Alice"));    verify(userService).getUserById(1L);  }}
```
```
import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.InjectMocks;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;import org.springframework.test.web.servlet.MockMvc;import org.springframework.test.web.servlet.setup.MockMvcBuilders;import static org.mockito.Mockito.*;import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;@ExtendWith(MockitoExtension.class)class UserControllerTest {  @Mock  private UserService userService;  @InjectMocks  private UserController userController;  private MockMvc mockMvc;  void setUp() {    mockMvc = MockMvcBuilders.standaloneSetup(userController).build();  }  @Test  void shouldReturnAllUsers() throws Exception {    List<UserDto> users = List.of(      new UserDto(1L, "Alice"),      new UserDto(2L, "Bob")    );    when(userService.getAllUsers()).thenReturn(users);    mockMvc.perform(get("/api/users"))      .andExpect(status().isOk())      .andExpect(jsonPath("$").isArray())      .andExpect(jsonPath("$[0].id").value(1))      .andExpect(jsonPath("$[0].name").value("Alice"))      .andExpect(jsonPath("$[1].id").value(2));    verify(userService, times(1)).getAllUsers();  }  @Test  void shouldReturnUserById() throws Exception {    UserDto user = new UserDto(1L, "Alice");    when(userService.getUserById(1L)).thenReturn(user);    mockMvc.perform(get("/api/users/1"))      .andExpect(status().isOk())      .andExpect(jsonPath("$.id").value(1))      .andExpect(jsonPath("$.name").value("Alice"));    verify(userService).getUserById(1L);  }}
```
```
@Testvoid shouldCreateUserAndReturn201() throws Exception {  UserCreateRequest request = new UserCreateRequest("Alice", "alice@example.com");  UserDto createdUser = new UserDto(1L, "Alice", "alice@example.com");    when(userService.createUser(any(UserCreateRequest.class)))    .thenReturn(createdUser);  mockMvc.perform(post("/api/users")      .contentType("application/json")      .content("{\"name\":\"Alice\",\"email\":\"alice@example.com\"}"))    .andExpect(status().isCreated())    .andExpect(jsonPath("$.id").value(1))    .andExpect(jsonPath("$.name").value("Alice"))    .andExpect(jsonPath("$.email").value("alice@example.com"));  verify(userService).createUser(any(UserCreateRequest.class));}
```
```
@Testvoid shouldCreateUserAndReturn201() throws Exception {  UserCreateRequest request = new UserCreateRequest("Alice", "alice@example.com");  UserDto createdUser = new UserDto(1L, "Alice", "alice@example.com");    when(userService.createUser(any(UserCreateRequest.class)))    .thenReturn(createdUser);  mockMvc.perform(post("/api/users")      .contentType("application/json")      .content("{\"name\":\"Alice\",\"email\":\"alice@example.com\"}"))    .andExpect(status().isCreated())    .andExpect(jsonPath("$.id").value(1))    .andExpect(jsonPath("$.name").value("Alice"))    .andExpect(jsonPath("$.email").value("alice@example.com"));  verify(userService).createUser(any(UserCreateRequest.class));}
```
```
@Testvoid shouldReturn404WhenUserNotFound() throws Exception {  when(userService.getUserById(999L))    .thenThrow(new UserNotFoundException("User not found"));  mockMvc.perform(get("/api/users/999"))    .andExpect(status().isNotFound())    .andExpect(jsonPath("$.error").value("User not found"));  verify(userService).getUserById(999L);}
```
```
@Testvoid shouldReturn404WhenUserNotFound() throws Exception {  when(userService.getUserById(999L))    .thenThrow(new UserNotFoundException("User not found"));  mockMvc.perform(get("/api/users/999"))    .andExpect(status().isNotFound())    .andExpect(jsonPath("$.error").value("User not found"));  verify(userService).getUserById(999L);}
```
```
@Testvoid shouldReturn400WhenRequestBodyInvalid() throws Exception {  mockMvc.perform(post("/api/users")      .contentType("application/json")      .content("{\"name\":\"\"}")) // Empty name    .andExpect(status().isBadRequest())    .andExpect(jsonPath("$.errors").isArray());}
```
```
@Testvoid shouldReturn400WhenRequestBodyInvalid() throws Exception {  mockMvc.perform(post("/api/users")      .contentType("application/json")      .content("{\"name\":\"\"}")) // Empty name    .andExpect(status().isBadRequest())    .andExpect(jsonPath("$.errors").isArray());}
```
```
@Testvoid shouldUpdateUserAndReturn200() throws Exception {  UserUpdateRequest request = new UserUpdateRequest("Alice Updated");  UserDto updatedUser = new UserDto(1L, "Alice Updated");    when(userService.updateUser(eq(1L), any(UserUpdateRequest.class)))    .thenReturn(updatedUser);  mockMvc.perform(put("/api/users/1")      .contentType("application/json")      .content("{\"name\":\"Alice Updated\"}"))    .andExpect(status().isOk())    .andExpect(jsonPath("$.id").value(1))    .andExpect(jsonPath("$.name").value("Alice Updated"));  verify(userService).updateUser(eq(1L), any(UserUpdateRequest.class));}
```
```
@Testvoid shouldUpdateUserAndReturn200() throws Exception {  UserUpdateRequest request = new UserUpdateRequest("Alice Updated");  UserDto updatedUser = new UserDto(1L, "Alice Updated");    when(userService.updateUser(eq(1L), any(UserUpdateRequest.class)))    .thenReturn(updatedUser);  mockMvc.perform(put("/api/users/1")      .contentType("application/json")      .content("{\"name\":\"Alice Updated\"}"))    .andExpect(status().isOk())    .andExpect(jsonPath("$.id").value(1))    .andExpect(jsonPath("$.name").value("Alice Updated"));  verify(userService).updateUser(eq(1L), any(UserUpdateRequest.class));}
```
```
@Testvoid shouldDeleteUserAndReturn204() throws Exception {  doNothing().when(userService).deleteUser(1L);  mockMvc.perform(delete("/api/users/1"))    .andExpect(status().isNoContent());  verify(userService).deleteUser(1L);}@Testvoid shouldReturn404WhenDeletingNonExistentUser() throws Exception {  doThrow(new UserNotFoundException("User not found"))    .when(userService).deleteUser(999L);  mockMvc.perform(delete("/api/users/999"))    .andExpect(status().isNotFound());}
```
```
@Testvoid shouldDeleteUserAndReturn204() throws Exception {  doNothing().when(userService).deleteUser(1L);  mockMvc.perform(delete("/api/users/1"))    .andExpect(status().isNoContent());  verify(userService).deleteUser(1L);}@Testvoid shouldReturn404WhenDeletingNonExistentUser() throws Exception {  doThrow(new UserNotFoundException("User not found"))    .when(userService).deleteUser(999L);  mockMvc.perform(delete("/api/users/999"))    .andExpect(status().isNotFound());}
```
```
@Testvoid shouldFilterUsersByName() throws Exception {  List<UserDto> users = List.of(new UserDto(1L, "Alice"));  when(userService.searchUsers("Alice")).thenReturn(users);  mockMvc.perform(get("/api/users/search?name=Alice"))    .andExpect(status().isOk())    .andExpect(jsonPath("$").isArray())    .andExpect(jsonPath("$[0].name").value("Alice"));  verify(userService).searchUsers("Alice");}
```
```
@Testvoid shouldFilterUsersByName() throws Exception {  List<UserDto> users = List.of(new UserDto(1L, "Alice"));  when(userService.searchUsers("Alice")).thenReturn(users);  mockMvc.perform(get("/api/users/search?name=Alice"))    .andExpect(status().isOk())    .andExpect(jsonPath("$").isArray())    .andExpect(jsonPath("$[0].name").value("Alice"));  verify(userService).searchUsers("Alice");}
```
```
@Testvoid shouldGetUserByIdFromPath() throws Exception {  UserDto user = new UserDto(123L, "Alice");  when(userService.getUserById(123L)).thenReturn(user);  mockMvc.perform(get("/api/users/{id}", 123L))    .andExpect(status().isOk())    .andExpect(jsonPath("$.id").value(123));}
```
```
@Testvoid shouldGetUserByIdFromPath() throws Exception {  UserDto user = new UserDto(123L, "Alice");  when(userService.getUserById(123L)).thenReturn(user);  mockMvc.perform(get("/api/users/{id}", 123L))    .andExpect(status().isOk())    .andExpect(jsonPath("$.id").value(123));}
```
```
@Testvoid shouldReturnCustomHeaders() throws Exception {  when(userService.getAllUsers()).thenReturn(List.of());  mockMvc.perform(get("/api/users"))    .andExpect(status().isOk())    .andExpect(header().exists("X-Total-Count"))    .andExpect(header().string("X-Total-Count", "0"))    .andExpect(header().string("Content-Type", containsString("application/json")));}
```
```
@Testvoid shouldReturnCustomHeaders() throws Exception {  when(userService.getAllUsers()).thenReturn(List.of());  mockMvc.perform(get("/api/users"))    .andExpect(status().isOk())    .andExpect(header().exists("X-Total-Count"))    .andExpect(header().string("X-Total-Count", "0"))    .andExpect(header().string("Content-Type", containsString("application/json")));}
```
```
@Testvoid shouldRequireAuthorizationHeader() throws Exception {  mockMvc.perform(get("/api/users"))    .andExpect(status().isUnauthorized());  mockMvc.perform(get("/api/users")      .header("Authorization", "Bearer token123"))    .andExpect(status().isOk());}
```
```
@Testvoid shouldRequireAuthorizationHeader() throws Exception {  mockMvc.perform(get("/api/users"))    .andExpect(status().isUnauthorized());  mockMvc.perform(get("/api/users")      .header("Authorization", "Bearer token123"))    .andExpect(status().isOk());}
```
```
@Testvoid shouldReturnJsonWhenAcceptHeaderIsJson() throws Exception {  UserDto user = new UserDto(1L, "Alice");  when(userService.getUserById(1L)).thenReturn(user);  mockMvc.perform(get("/api/users/1")      .accept("application/json"))    .andExpect(status().isOk())    .andExpect(content().contentType("application/json"));}
```
```
@Testvoid shouldReturnJsonWhenAcceptHeaderIsJson() throws Exception {  UserDto user = new UserDto(1L, "Alice");  when(userService.getUserById(1L)).thenReturn(user);  mockMvc.perform(get("/api/users/1")      .accept("application/json"))    .andExpect(status().isOk())    .andExpect(content().contentType("application/json"));}
```
```
@Testvoid shouldReturnDifferentStatusCodesForDifferentScenarios() throws Exception {  // Successful response  when(userService.getUserById(1L)).thenReturn(new UserDto(1L, "Alice"));  mockMvc.perform(get("/api/users/1"))    .andExpect(status().isOk());  // Not found  when(userService.getUserById(999L))    .thenThrow(new UserNotFoundException("Not found"));  mockMvc.perform(get("/api/users/999"))    .andExpect(status().isNotFound());  // Unauthorized  mockMvc.perform(get("/api/admin/users"))    .andExpect(status().isUnauthorized());}
```
```
@Testvoid shouldReturnDifferentStatusCodesForDifferentScenarios() throws Exception {  // Successful response  when(userService.getUserById(1L)).thenReturn(new UserDto(1L, "Alice"));  mockMvc.perform(get("/api/users/1"))    .andExpect(status().isOk());  // Not found  when(userService.getUserById(999L))    .thenThrow(new UserNotFoundException("Not found"));  mockMvc.perform(get("/api/users/999"))    .andExpect(status().isNotFound());  // Unauthorized  mockMvc.perform(get("/api/admin/users"))    .andExpect(status().isUnauthorized());}
```
```
MockMvcBuilders.standaloneSetup()
```
```
contentType()
```
```
@PostMapping(consumes=...)
```
```
mockMvc.perform(...).andDo(print())
```
```
@RequestMapping
```
```
@PostMapping
```
Ensuring the reliability of your API's entry points is crucial. This skill provides a focused approach to unit testing Spring Boot REST controllers using MockMvc. It simulates HTTP requests and responses, allowing you to verify controller behavior in isolation without the overhead of a full application context. By effectively mocking underlying service dependencies, you can precisely test request mapping, parameter binding, data validation, and the correct formation of HTTP responses, including status codes and serialized data. This leads to faster feedback cycles and more stable web applications.

# When to Use This Skill
- •Verifying correct HTTP status codes for various operations (e.g., 200 OK, 201 Created, 400 Bad Request, 404 Not Found).
- •Testing input validation rules applied to DTOs or request parameters within the controller.
- •Ensuring proper JSON/XML serialization and deserialization of request and response bodies.
- •Validating custom exception handling mechanisms implemented within the controller layer.

# Pro Tips
- 💡Leverage `@WebMvcTest` to load only web-related components of the Spring context, ensuring fast and isolated controller tests.
- 💡Always mock service layer dependencies using `@MockBean` or Mockito to prevent integration with business logic and focus solely on the controller's behavior.
- 💡Utilize `MockMvcResultMatchers` extensively for comprehensive assertions on HTTP status, response content (JSONPath, String), headers, and cookies.

