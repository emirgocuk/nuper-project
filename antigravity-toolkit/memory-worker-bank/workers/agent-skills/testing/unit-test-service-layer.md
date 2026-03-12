# unit-test-service-layer
Source: https://antigravity.codes/agent-skills/testing/unit-test-service-layer

## AI Worker Instructions
When the user requests functionality related to unit-test-service-layer, follow these guidelines and utilize this context.

## Scraped Content

# unit-test-service-layer
```
<dependency>  <groupId>org.junit.jupiter</groupId>  <artifactId>junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.mockito</groupId>  <artifactId>mockito-core</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.mockito</groupId>  <artifactId>mockito-junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.assertj</groupId>  <artifactId>assertj-core</artifactId>  <scope>test</scope></dependency>
```
```
<dependency>  <groupId>org.junit.jupiter</groupId>  <artifactId>junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.mockito</groupId>  <artifactId>mockito-core</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.mockito</groupId>  <artifactId>mockito-junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.assertj</groupId>  <artifactId>assertj-core</artifactId>  <scope>test</scope></dependency>
```
```
dependencies {  testImplementation("org.junit.jupiter:junit-jupiter")  testImplementation("org.mockito:mockito-core")  testImplementation("org.mockito:mockito-junit-jupiter")  testImplementation("org.assertj:assertj-core")}
```
```
dependencies {  testImplementation("org.junit.jupiter:junit-jupiter")  testImplementation("org.mockito:mockito-core")  testImplementation("org.mockito:mockito-junit-jupiter")  testImplementation("org.assertj:assertj-core")}
```
```
import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.InjectMocks;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;import static org.mockito.Mockito.*;import static org.assertj.core.api.Assertions.*;@ExtendWith(MockitoExtension.class)class UserServiceTest {  @Mock  private UserRepository userRepository;  @InjectMocks  private UserService userService;  @Test  void shouldReturnAllUsers() {    // Arrange    List<User> expectedUsers = List.of(      new User(1L, "Alice"),      new User(2L, "Bob")    );    when(userRepository.findAll()).thenReturn(expectedUsers);    // Act    List<User> result = userService.getAllUsers();    // Assert    assertThat(result).hasSize(2);    assertThat(result).containsExactly(      new User(1L, "Alice"),      new User(2L, "Bob")    );    verify(userRepository, times(1)).findAll();  }}
```
```
import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.InjectMocks;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;import static org.mockito.Mockito.*;import static org.assertj.core.api.Assertions.*;@ExtendWith(MockitoExtension.class)class UserServiceTest {  @Mock  private UserRepository userRepository;  @InjectMocks  private UserService userService;  @Test  void shouldReturnAllUsers() {    // Arrange    List<User> expectedUsers = List.of(      new User(1L, "Alice"),      new User(2L, "Bob")    );    when(userRepository.findAll()).thenReturn(expectedUsers);    // Act    List<User> result = userService.getAllUsers();    // Assert    assertThat(result).hasSize(2);    assertThat(result).containsExactly(      new User(1L, "Alice"),      new User(2L, "Bob")    );    verify(userRepository, times(1)).findAll();  }}
```
```
@ExtendWith(MockitoExtension.class)class UserEnrichmentServiceTest {  @Mock  private UserRepository userRepository;  @Mock  private EmailService emailService;  @Mock  private AnalyticsClient analyticsClient;  @InjectMocks  private UserEnrichmentService enrichmentService;  @Test  void shouldCreateUserAndSendWelcomeEmail() {    User newUser = new User(1L, "Alice", "alice@example.com");    when(userRepository.save(any(User.class))).thenReturn(newUser);    doNothing().when(emailService).sendWelcomeEmail(newUser.getEmail());    User result = enrichmentService.registerNewUser("Alice", "alice@example.com");    assertThat(result.getId()).isEqualTo(1L);    assertThat(result.getName()).isEqualTo("Alice");        verify(userRepository).save(any(User.class));    verify(emailService).sendWelcomeEmail("alice@example.com");    verify(analyticsClient, never()).trackUserRegistration(any());  }}
```
```
@ExtendWith(MockitoExtension.class)class UserEnrichmentServiceTest {  @Mock  private UserRepository userRepository;  @Mock  private EmailService emailService;  @Mock  private AnalyticsClient analyticsClient;  @InjectMocks  private UserEnrichmentService enrichmentService;  @Test  void shouldCreateUserAndSendWelcomeEmail() {    User newUser = new User(1L, "Alice", "alice@example.com");    when(userRepository.save(any(User.class))).thenReturn(newUser);    doNothing().when(emailService).sendWelcomeEmail(newUser.getEmail());    User result = enrichmentService.registerNewUser("Alice", "alice@example.com");    assertThat(result.getId()).isEqualTo(1L);    assertThat(result.getName()).isEqualTo("Alice");        verify(userRepository).save(any(User.class));    verify(emailService).sendWelcomeEmail("alice@example.com");    verify(analyticsClient, never()).trackUserRegistration(any());  }}
```
```
@Testvoid shouldThrowExceptionWhenUserNotFound() {  when(userRepository.findById(999L))    .thenThrow(new UserNotFoundException("User not found"));  assertThatThrownBy(() -> userService.getUserDetails(999L))    .isInstanceOf(UserNotFoundException.class)    .hasMessageContaining("User not found");  verify(userRepository).findById(999L);}@Testvoid shouldRethrowRepositoryException() {  when(userRepository.findAll())    .thenThrow(new DataAccessException("Database connection failed"));  assertThatThrownBy(() -> userService.getAllUsers())    .isInstanceOf(DataAccessException.class)    .hasMessageContaining("Database connection failed");}
```
```
@Testvoid shouldThrowExceptionWhenUserNotFound() {  when(userRepository.findById(999L))    .thenThrow(new UserNotFoundException("User not found"));  assertThatThrownBy(() -> userService.getUserDetails(999L))    .isInstanceOf(UserNotFoundException.class)    .hasMessageContaining("User not found");  verify(userRepository).findById(999L);}@Testvoid shouldRethrowRepositoryException() {  when(userRepository.findAll())    .thenThrow(new DataAccessException("Database connection failed"));  assertThatThrownBy(() -> userService.getAllUsers())    .isInstanceOf(DataAccessException.class)    .hasMessageContaining("Database connection failed");}
```
```
@Testvoid shouldTransferMoneyBetweenAccounts() {  Account fromAccount = new Account(1L, 1000.0);  Account toAccount = new Account(2L, 500.0);  when(accountRepository.findById(1L)).thenReturn(Optional.of(fromAccount));  when(accountRepository.findById(2L)).thenReturn(Optional.of(toAccount));  when(accountRepository.save(any(Account.class)))    .thenAnswer(invocation -> invocation.getArgument(0));  moneyTransferService.transfer(1L, 2L, 200.0);  // Verify both accounts were updated  verify(accountRepository, times(2)).save(any(Account.class));  assertThat(fromAccount.getBalance()).isEqualTo(800.0);  assertThat(toAccount.getBalance()).isEqualTo(700.0);}
```
```
@Testvoid shouldTransferMoneyBetweenAccounts() {  Account fromAccount = new Account(1L, 1000.0);  Account toAccount = new Account(2L, 500.0);  when(accountRepository.findById(1L)).thenReturn(Optional.of(fromAccount));  when(accountRepository.findById(2L)).thenReturn(Optional.of(toAccount));  when(accountRepository.save(any(Account.class)))    .thenAnswer(invocation -> invocation.getArgument(0));  moneyTransferService.transfer(1L, 2L, 200.0);  // Verify both accounts were updated  verify(accountRepository, times(2)).save(any(Account.class));  assertThat(fromAccount.getBalance()).isEqualTo(800.0);  assertThat(toAccount.getBalance()).isEqualTo(700.0);}
```
```
import org.mockito.ArgumentCaptor;@Testvoid shouldCaptureUserDataWhenSaving() {  ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);  when(userRepository.save(any(User.class)))    .thenAnswer(invocation -> invocation.getArgument(0));  userService.createUser("Alice", "alice@example.com");  verify(userRepository).save(userCaptor.capture());  User capturedUser = userCaptor.getValue();    assertThat(capturedUser.getName()).isEqualTo("Alice");  assertThat(capturedUser.getEmail()).isEqualTo("alice@example.com");}@Testvoid shouldCaptureMultipleArgumentsAcrossMultipleCalls() {  ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);  userService.createUser("Alice", "alice@example.com");  userService.createUser("Bob", "bob@example.com");  verify(userRepository, times(2)).save(userCaptor.capture());    List<User> capturedUsers = userCaptor.getAllValues();  assertThat(capturedUsers).hasSize(2);  assertThat(capturedUsers.get(0).getName()).isEqualTo("Alice");  assertThat(capturedUsers.get(1).getName()).isEqualTo("Bob");}
```
```
import org.mockito.ArgumentCaptor;@Testvoid shouldCaptureUserDataWhenSaving() {  ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);  when(userRepository.save(any(User.class)))    .thenAnswer(invocation -> invocation.getArgument(0));  userService.createUser("Alice", "alice@example.com");  verify(userRepository).save(userCaptor.capture());  User capturedUser = userCaptor.getValue();    assertThat(capturedUser.getName()).isEqualTo("Alice");  assertThat(capturedUser.getEmail()).isEqualTo("alice@example.com");}@Testvoid shouldCaptureMultipleArgumentsAcrossMultipleCalls() {  ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);  userService.createUser("Alice", "alice@example.com");  userService.createUser("Bob", "bob@example.com");  verify(userRepository, times(2)).save(userCaptor.capture());    List<User> capturedUsers = userCaptor.getAllValues();  assertThat(capturedUsers).hasSize(2);  assertThat(capturedUsers.get(0).getName()).isEqualTo("Alice");  assertThat(capturedUsers.get(1).getName()).isEqualTo("Bob");}
```
```
import org.mockito.InOrder;@Testvoid shouldCallMethodsInCorrectOrder() {  InOrder inOrder = inOrder(userRepository, emailService);  userService.registerNewUser("Alice", "alice@example.com");  inOrder.verify(userRepository).save(any(User.class));  inOrder.verify(emailService).sendWelcomeEmail(any());}@Testvoid shouldCallMethodExactlyOnce() {  userService.getUserDetails(1L);  verify(userRepository, times(1)).findById(1L);  verify(userRepository, never()).findAll();}
```
```
import org.mockito.InOrder;@Testvoid shouldCallMethodsInCorrectOrder() {  InOrder inOrder = inOrder(userRepository, emailService);  userService.registerNewUser("Alice", "alice@example.com");  inOrder.verify(userRepository).save(any(User.class));  inOrder.verify(emailService).sendWelcomeEmail(any());}@Testvoid shouldCallMethodExactlyOnce() {  userService.getUserDetails(1L);  verify(userRepository, times(1)).findById(1L);  verify(userRepository, never()).findAll();}
```
```
@Testvoid shouldReturnCompletableFutureWhenFetchingAsyncData() {  List<User> users = List.of(new User(1L, "Alice"));  when(userRepository.findAllAsync())    .thenReturn(CompletableFuture.completedFuture(users));  CompletableFuture<List<User>> result = userService.getAllUsersAsync();  assertThat(result).isCompletedWithValue(users);}
```
```
@Testvoid shouldReturnCompletableFutureWhenFetchingAsyncData() {  List<User> users = List.of(new User(1L, "Alice"));  when(userRepository.findAllAsync())    .thenReturn(CompletableFuture.completedFuture(users));  CompletableFuture<List<User>> result = userService.getAllUsersAsync();  assertThat(result).isCompletedWithValue(users);}
```
```
expectedUser
```
```
actualUser
```
```
captor
```
```
@Spy@InjectMocksprivate UserService userService; // Real instance, but can stub some methods@Testvoid shouldUseRealMethodButMockDependency() {  when(userRepository.findById(any())).thenReturn(Optional.of(new User()));  // Calls real userService methods but userRepository is mocked}
```
```
@Spy@InjectMocksprivate UserService userService; // Real instance, but can stub some methods@Testvoid shouldUseRealMethodButMockDependency() {  when(userRepository.findById(any())).thenReturn(Optional.of(new User()));  // Calls real userService methods but userRepository is mocked}
```
```
// In your service (production code)public class UserService {  private final UserRepository userRepository;    public UserService(UserRepository userRepository) {    this.repository = userRepository;  }}// In your test - can inject mocks directly@Testvoid test() {  UserRepository mockRepo = mock(UserRepository.class);  UserService service = new UserService(mockRepo);}
```
```
// In your service (production code)public class UserService {  private final UserRepository userRepository;    public UserService(UserRepository userRepository) {    this.repository = userRepository;  }}// In your test - can inject mocks directly@Testvoid test() {  UserRepository mockRepo = mock(UserRepository.class);  UserService service = new UserService(mockRepo);}
```
```
when()
```
```
thenReturn()
```
```
thenThrow()
```
```
thenAnswer()
```
```
@ExtendWith(MockitoExtension.class)
```
```
MockitoExtension.LENIENT
```
```
@InjectMocks
```
For developers aiming to build resilient and maintainable Java applications, mastering service layer unit testing is crucial. This Agent Skill provides a comprehensive guide to crafting effective unit tests using Mockito, enabling you to scrutinize business logic in perfect isolation. By expertly mocking external dependencies like repositories and client APIs, you ensure that your core service functionality is validated without the overhead or unpredictability of external systems. It's an indispensable approach for achieving rapid feedback cycles and high code quality in your backend development.

# When to Use This Skill
- •Validating core business logic within Spring @Service components.
- •Simulating external API responses and database interactions for service methods.
- •Ensuring correct flow and decision-making in complex service orchestrations.
- •Testing error handling and edge cases without deploying the full application stack.

# Pro Tips
- 💡Always verify interactions with mocked dependencies to ensure your service calls the right methods with the correct arguments.
- 💡Use ArgumentCaptor for complex argument matching in verify calls, especially when capturing values generated within the service.
- 💡Focus your unit tests on the 'what' (behavior) rather than the 'how' (implementation details) to make them more robust to refactoring.

