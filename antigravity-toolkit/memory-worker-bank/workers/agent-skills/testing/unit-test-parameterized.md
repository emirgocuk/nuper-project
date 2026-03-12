# unit-test-parameterized
Source: https://antigravity.codes/agent-skills/testing/unit-test-parameterized

## AI Worker Instructions
When the user requests functionality related to unit-test-parameterized, follow these guidelines and utilize this context.

## Scraped Content

# unit-test-parameterized
```
<dependency>  <groupId>org.junit.jupiter</groupId>  <artifactId>junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.assertj</groupId>  <artifactId>assertj-core</artifactId>  <scope>test</scope></dependency>
```
```
<dependency>  <groupId>org.junit.jupiter</groupId>  <artifactId>junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.assertj</groupId>  <artifactId>assertj-core</artifactId>  <scope>test</scope></dependency>
```
```
dependencies {  testImplementation("org.junit.jupiter:junit-jupiter")  testImplementation("org.assertj:assertj-core")}
```
```
dependencies {  testImplementation("org.junit.jupiter:junit-jupiter")  testImplementation("org.assertj:assertj-core")}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.ValueSource;import static org.assertj.core.api.Assertions.*;class StringUtilsTest {  @ParameterizedTest  @ValueSource(strings = {"hello", "world", "test"})  void shouldCapitalizeAllStrings(String input) {    String result = StringUtils.capitalize(input);    assertThat(result).startsWith(input.substring(0, 1).toUpperCase());  }  @ParameterizedTest  @ValueSource(ints = {1, 2, 3, 4, 5})  void shouldBePositive(int number) {    assertThat(number).isPositive();  }  @ParameterizedTest  @ValueSource(booleans = {true, false})  void shouldHandleBothBooleanValues(boolean value) {    assertThat(value).isNotNull();  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.ValueSource;import static org.assertj.core.api.Assertions.*;class StringUtilsTest {  @ParameterizedTest  @ValueSource(strings = {"hello", "world", "test"})  void shouldCapitalizeAllStrings(String input) {    String result = StringUtils.capitalize(input);    assertThat(result).startsWith(input.substring(0, 1).toUpperCase());  }  @ParameterizedTest  @ValueSource(ints = {1, 2, 3, 4, 5})  void shouldBePositive(int number) {    assertThat(number).isPositive();  }  @ParameterizedTest  @ValueSource(booleans = {true, false})  void shouldHandleBothBooleanValues(boolean value) {    assertThat(value).isNotNull();  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.MethodSource;import java.util.stream.Stream;class CalculatorTest {  static Stream<org.junit.jupiter.params.provider.Arguments> additionTestCases() {    return Stream.of(      Arguments.of(1, 2, 3),      Arguments.of(0, 0, 0),      Arguments.of(-1, 1, 0),      Arguments.of(100, 200, 300),      Arguments.of(-5, -10, -15)    );  }  @ParameterizedTest  @MethodSource("additionTestCases")  void shouldAddNumbersCorrectly(int a, int b, int expected) {    int result = Calculator.add(a, b);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.MethodSource;import java.util.stream.Stream;class CalculatorTest {  static Stream<org.junit.jupiter.params.provider.Arguments> additionTestCases() {    return Stream.of(      Arguments.of(1, 2, 3),      Arguments.of(0, 0, 0),      Arguments.of(-1, 1, 0),      Arguments.of(100, 200, 300),      Arguments.of(-5, -10, -15)    );  }  @ParameterizedTest  @MethodSource("additionTestCases")  void shouldAddNumbersCorrectly(int a, int b, int expected) {    int result = Calculator.add(a, b);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.CsvSource;class UserValidationTest {  @ParameterizedTest  @CsvSource({    "alice@example.com, true",    "bob@gmail.com, true",    "invalid-email, false",    "user@, false",    "@example.com, false",    "user name@example.com, false"  })  void shouldValidateEmailAddresses(String email, boolean expected) {    boolean result = UserValidator.isValidEmail(email);    assertThat(result).isEqualTo(expected);  }  @ParameterizedTest  @CsvSource({    "123-456-7890, true",    "555-123-4567, true",    "1234567890, false",    "123-45-6789, false",    "abc-def-ghij, false"  })  void shouldValidatePhoneNumbers(String phone, boolean expected) {    boolean result = PhoneValidator.isValid(phone);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.CsvSource;class UserValidationTest {  @ParameterizedTest  @CsvSource({    "alice@example.com, true",    "bob@gmail.com, true",    "invalid-email, false",    "user@, false",    "@example.com, false",    "user name@example.com, false"  })  void shouldValidateEmailAddresses(String email, boolean expected) {    boolean result = UserValidator.isValidEmail(email);    assertThat(result).isEqualTo(expected);  }  @ParameterizedTest  @CsvSource({    "123-456-7890, true",    "555-123-4567, true",    "1234567890, false",    "123-45-6789, false",    "abc-def-ghij, false"  })  void shouldValidatePhoneNumbers(String phone, boolean expected) {    boolean result = PhoneValidator.isValid(phone);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.CsvFileSource;class PriceCalculationTest {  @ParameterizedTest  @CsvFileSource(resources = "/test-data/prices.csv", numLinesToSkip = 1)  void shouldCalculateTotalPrice(String product, double price, int quantity, double expected) {    double total = PriceCalculator.calculateTotal(price, quantity);    assertThat(total).isEqualTo(expected);  }}// test-data/prices.csv:// product,price,quantity,expected// Laptop,999.99,1,999.99// Mouse,29.99,3,89.97// Keyboard,79.99,2,159.98
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.CsvFileSource;class PriceCalculationTest {  @ParameterizedTest  @CsvFileSource(resources = "/test-data/prices.csv", numLinesToSkip = 1)  void shouldCalculateTotalPrice(String product, double price, int quantity, double expected) {    double total = PriceCalculator.calculateTotal(price, quantity);    assertThat(total).isEqualTo(expected);  }}// test-data/prices.csv:// product,price,quantity,expected// Laptop,999.99,1,999.99// Mouse,29.99,3,89.97// Keyboard,79.99,2,159.98
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.EnumSource;enum Status { ACTIVE, INACTIVE, PENDING, DELETED }class StatusHandlerTest {  @ParameterizedTest  @EnumSource(Status.class)  void shouldHandleAllStatuses(Status status) {    assertThat(status).isNotNull();  }  @ParameterizedTest  @EnumSource(value = Status.class, names = {"ACTIVE", "INACTIVE"})  void shouldHandleSpecificStatuses(Status status) {    assertThat(status).isIn(Status.ACTIVE, Status.INACTIVE);  }  @ParameterizedTest  @EnumSource(value = Status.class, mode = EnumSource.Mode.EXCLUDE, names = {"DELETED"})  void shouldHandleStatusesExcludingDeleted(Status status) {    assertThat(status).isNotEqualTo(Status.DELETED);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.EnumSource;enum Status { ACTIVE, INACTIVE, PENDING, DELETED }class StatusHandlerTest {  @ParameterizedTest  @EnumSource(Status.class)  void shouldHandleAllStatuses(Status status) {    assertThat(status).isNotNull();  }  @ParameterizedTest  @EnumSource(value = Status.class, names = {"ACTIVE", "INACTIVE"})  void shouldHandleSpecificStatuses(Status status) {    assertThat(status).isIn(Status.ACTIVE, Status.INACTIVE);  }  @ParameterizedTest  @EnumSource(value = Status.class, mode = EnumSource.Mode.EXCLUDE, names = {"DELETED"})  void shouldHandleStatusesExcludingDeleted(Status status) {    assertThat(status).isNotEqualTo(Status.DELETED);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.ValueSource;class DiscountCalculationTest {  @ParameterizedTest(name = "Discount of {0}% should be calculated correctly")  @ValueSource(ints = {5, 10, 15, 20})  void shouldApplyDiscount(int discountPercent) {    double originalPrice = 100.0;    double discounted = DiscountCalculator.apply(originalPrice, discountPercent);    double expected = originalPrice * (1 - discountPercent / 100.0);        assertThat(discounted).isEqualTo(expected);  }  @ParameterizedTest(name = "User role {0} should have {1} permissions")  @CsvSource({    "ADMIN, 100",    "MANAGER, 50",    "USER, 10"  })  void shouldHaveCorrectPermissions(String role, int expectedPermissions) {    User user = new User(role);    assertThat(user.getPermissionCount()).isEqualTo(expectedPermissions);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.ValueSource;class DiscountCalculationTest {  @ParameterizedTest(name = "Discount of {0}% should be calculated correctly")  @ValueSource(ints = {5, 10, 15, 20})  void shouldApplyDiscount(int discountPercent) {    double originalPrice = 100.0;    double discounted = DiscountCalculator.apply(originalPrice, discountPercent);    double expected = originalPrice * (1 - discountPercent / 100.0);        assertThat(discounted).isEqualTo(expected);  }  @ParameterizedTest(name = "User role {0} should have {1} permissions")  @CsvSource({    "ADMIN, 100",    "MANAGER, 50",    "USER, 10"  })  void shouldHaveCorrectPermissions(String role, int expectedPermissions) {    User user = new User(role);    assertThat(user.getPermissionCount()).isEqualTo(expectedPermissions);  }}
```
```
import org.junit.jupiter.api.extension.ExtensionContext;import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.Arguments;import org.junit.jupiter.params.provider.ArgumentsProvider;import org.junit.jupiter.params.provider.ArgumentsSource;import java.util.stream.Stream;class RangeValidatorArgumentProvider implements ArgumentsProvider {  @Override  public Stream<? extends Arguments> provideArguments(ExtensionContext context) {    return Stream.of(      Arguments.of(0, 0, 100, true),      // Min boundary      Arguments.of(100, 0, 100, true),    // Max boundary      Arguments.of(50, 0, 100, true),     // Middle value      Arguments.of(-1, 0, 100, false),    // Below range      Arguments.of(101, 0, 100, false)    // Above range    );  }}class RangeValidatorTest {  @ParameterizedTest  @ArgumentsSource(RangeValidatorArgumentProvider.class)  void shouldValidateRangeCorrectly(int value, int min, int max, boolean expected) {    boolean result = RangeValidator.isInRange(value, min, max);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.api.extension.ExtensionContext;import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.Arguments;import org.junit.jupiter.params.provider.ArgumentsProvider;import org.junit.jupiter.params.provider.ArgumentsSource;import java.util.stream.Stream;class RangeValidatorArgumentProvider implements ArgumentsProvider {  @Override  public Stream<? extends Arguments> provideArguments(ExtensionContext context) {    return Stream.of(      Arguments.of(0, 0, 100, true),      // Min boundary      Arguments.of(100, 0, 100, true),    // Max boundary      Arguments.of(50, 0, 100, true),     // Middle value      Arguments.of(-1, 0, 100, false),    // Below range      Arguments.of(101, 0, 100, false)    // Above range    );  }}class RangeValidatorTest {  @ParameterizedTest  @ArgumentsSource(RangeValidatorArgumentProvider.class)  void shouldValidateRangeCorrectly(int value, int min, int max, boolean expected) {    boolean result = RangeValidator.isInRange(value, min, max);    assertThat(result).isEqualTo(expected);  }}
```
```
class BoundaryValueTest {  @ParameterizedTest  @ValueSource(ints = {    Integer.MIN_VALUE,    // Absolute minimum    Integer.MIN_VALUE + 1, // Just above minimum    -1,                    // Negative boundary    0,                     // Zero boundary    1,                     // Just above zero    Integer.MAX_VALUE - 1, // Just below maximum    Integer.MAX_VALUE      // Absolute maximum  })  void shouldHandleAllBoundaryValues(int value) {    int incremented = MathUtils.increment(value);    assertThat(incremented).isNotLessThan(value);  }  @ParameterizedTest  @CsvSource({    ",                    false", // null    "'',                   false", // empty    "'   ',                false", // whitespace only    "a,                    true",  // single character    "abc,                  true"   // normal  })  void shouldValidateStrings(String input, boolean expected) {    boolean result = StringValidator.isValid(input);    assertThat(result).isEqualTo(expected);  }}
```
```
class BoundaryValueTest {  @ParameterizedTest  @ValueSource(ints = {    Integer.MIN_VALUE,    // Absolute minimum    Integer.MIN_VALUE + 1, // Just above minimum    -1,                    // Negative boundary    0,                     // Zero boundary    1,                     // Just above zero    Integer.MAX_VALUE - 1, // Just below maximum    Integer.MAX_VALUE      // Absolute maximum  })  void shouldHandleAllBoundaryValues(int value) {    int incremented = MathUtils.increment(value);    assertThat(incremented).isNotLessThan(value);  }  @ParameterizedTest  @CsvSource({    ",                    false", // null    "'',                   false", // empty    "'   ',                false", // whitespace only    "a,                    true",  // single character    "abc,                  true"   // normal  })  void shouldValidateStrings(String input, boolean expected) {    boolean result = StringValidator.isValid(input);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.api.RepeatedTest;class ConcurrencyTest {  @RepeatedTest(100)  void shouldHandleConcurrentAccess() {    // Test that might reveal race conditions if run multiple times    AtomicInteger counter = new AtomicInteger(0);    counter.incrementAndGet();    assertThat(counter.get()).isEqualTo(1);  }}
```
```
import org.junit.jupiter.api.RepeatedTest;class ConcurrencyTest {  @RepeatedTest(100)  void shouldHandleConcurrentAccess() {    // Test that might reveal race conditions if run multiple times    AtomicInteger counter = new AtomicInteger(0);    counter.incrementAndGet();    assertThat(counter.get()).isEqualTo(1);  }}
```
```
(name = "...")
```
```
@ParameterizedTest@ValueSource(strings = {"", " ", null})void shouldThrowExceptionForInvalidInput(String input) {  assertThatThrownBy(() -> Parser.parse(input))    .isInstanceOf(IllegalArgumentException.class);}
```
```
@ParameterizedTest@ValueSource(strings = {"", " ", null})void shouldThrowExceptionForInvalidInput(String input) {  assertThatThrownBy(() -> Parser.parse(input))    .isInstanceOf(IllegalArgumentException.class);}
```
```
@ParameterizedTest@ValueSource(ints = {1, 2, 3, 5, 8, 13})void shouldBeInFibonacciSequence(int number) {  assertThat(FibonacciChecker.isFibonacci(number)).isTrue();}
```
```
@ParameterizedTest@ValueSource(ints = {1, 2, 3, 5, 8, 13})void shouldBeInFibonacciSequence(int number) {  assertThat(FibonacciChecker.isFibonacci(number)).isTrue();}
```
```
name = "..."
```
Unlock the power of efficient and robust testing with the Parameterized Unit Test Agent Skill. This advanced capability empowers your AI assistant to generate and refactor tests that handle diverse input scenarios with elegance. By leveraging JUnit 5's `@ParameterizedTest` annotations, you can drastically reduce boilerplate code, making your test suites more maintainable and comprehensive. Ideal for validating complex logic across multiple data points, this skill ensures higher code quality and faster development cycles. Embrace data-driven testing to systematically explore edge cases and general conditions, securing the reliability of your applications.

# When to Use This Skill
- •Testing API endpoints with various valid and invalid request payloads.
- •Validating utility methods or functions across a spectrum of numerical or string inputs.
- •Systematically checking boundary conditions for data processing algorithms.
- •Ensuring robust error handling by feeding multiple malformed inputs to a system.

# Pro Tips
- 💡Combine `@ParameterizedTest` with custom `ArgumentsProvider` for complex data structures or external data sources, enhancing flexibility beyond simple `ValueSource` or `CsvSource`.
- 💡Always provide a descriptive name for your parameterized tests using the `name` attribute (e.g., `{index}: {0} should be {1}`) to make test reports more readable and actionable.
- 💡When testing a large number of scenarios, consider grouping related test data into separate parameterized test methods to maintain clarity and focus for each specific behavior.

