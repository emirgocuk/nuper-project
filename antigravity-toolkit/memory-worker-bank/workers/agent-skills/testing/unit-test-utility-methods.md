# unit-test-utility-methods
Source: https://antigravity.codes/agent-skills/testing/unit-test-utility-methods

## AI Worker Instructions
When the user requests functionality related to unit-test-utility-methods, follow these guidelines and utilize this context.

## Scraped Content

# unit-test-utility-methods
```
import org.junit.jupiter.api.Test;import static org.assertj.core.api.Assertions.*;class StringUtilsTest {  @Test  void shouldCapitalizeFirstLetter() {    String result = StringUtils.capitalize("hello");    assertThat(result).isEqualTo("Hello");  }  @Test  void shouldHandleEmptyString() {    String result = StringUtils.capitalize("");    assertThat(result).isEmpty();  }  @Test  void shouldHandleNullInput() {    String result = StringUtils.capitalize(null);    assertThat(result).isNull();  }  @Test  void shouldHandleSingleCharacter() {    String result = StringUtils.capitalize("a");    assertThat(result).isEqualTo("A");  }  @Test  void shouldNotChangePascalCase() {    String result = StringUtils.capitalize("Hello");    assertThat(result).isEqualTo("Hello");  }}
```
```
import org.junit.jupiter.api.Test;import static org.assertj.core.api.Assertions.*;class StringUtilsTest {  @Test  void shouldCapitalizeFirstLetter() {    String result = StringUtils.capitalize("hello");    assertThat(result).isEqualTo("Hello");  }  @Test  void shouldHandleEmptyString() {    String result = StringUtils.capitalize("");    assertThat(result).isEmpty();  }  @Test  void shouldHandleNullInput() {    String result = StringUtils.capitalize(null);    assertThat(result).isNull();  }  @Test  void shouldHandleSingleCharacter() {    String result = StringUtils.capitalize("a");    assertThat(result).isEqualTo("A");  }  @Test  void shouldNotChangePascalCase() {    String result = StringUtils.capitalize("Hello");    assertThat(result).isEqualTo("Hello");  }}
```
```
class NullSafeUtilsTest {  @Test  void shouldReturnDefaultValueWhenNull() {    Object result = NullSafeUtils.getOrDefault(null, "default");    assertThat(result).isEqualTo("default");  }  @Test  void shouldReturnValueWhenNotNull() {    Object result = NullSafeUtils.getOrDefault("value", "default");    assertThat(result).isEqualTo("value");  }  @Test  void shouldReturnFalseWhenStringIsNull() {    boolean result = NullSafeUtils.isNotBlank(null);    assertThat(result).isFalse();  }  @Test  void shouldReturnTrueWhenStringHasContent() {    boolean result = NullSafeUtils.isNotBlank("   text   ");    assertThat(result).isTrue();  }}
```
```
class NullSafeUtilsTest {  @Test  void shouldReturnDefaultValueWhenNull() {    Object result = NullSafeUtils.getOrDefault(null, "default");    assertThat(result).isEqualTo("default");  }  @Test  void shouldReturnValueWhenNotNull() {    Object result = NullSafeUtils.getOrDefault("value", "default");    assertThat(result).isEqualTo("value");  }  @Test  void shouldReturnFalseWhenStringIsNull() {    boolean result = NullSafeUtils.isNotBlank(null);    assertThat(result).isFalse();  }  @Test  void shouldReturnTrueWhenStringHasContent() {    boolean result = NullSafeUtils.isNotBlank("   text   ");    assertThat(result).isTrue();  }}
```
```
class MathUtilsTest {  @Test  void shouldCalculatePercentage() {    double result = MathUtils.percentage(25, 100);    assertThat(result).isEqualTo(25.0);  }  @Test  void shouldHandleZeroDivisor() {    double result = MathUtils.percentage(50, 0);    assertThat(result).isZero();  }  @Test  void shouldRoundToTwoDecimalPlaces() {    double result = MathUtils.round(3.14159, 2);    assertThat(result).isEqualTo(3.14);  }  @Test  void shouldHandleNegativeNumbers() {    int result = MathUtils.absoluteValue(-42);    assertThat(result).isEqualTo(42);  }}
```
```
class MathUtilsTest {  @Test  void shouldCalculatePercentage() {    double result = MathUtils.percentage(25, 100);    assertThat(result).isEqualTo(25.0);  }  @Test  void shouldHandleZeroDivisor() {    double result = MathUtils.percentage(50, 0);    assertThat(result).isZero();  }  @Test  void shouldRoundToTwoDecimalPlaces() {    double result = MathUtils.round(3.14159, 2);    assertThat(result).isEqualTo(3.14);  }  @Test  void shouldHandleNegativeNumbers() {    int result = MathUtils.absoluteValue(-42);    assertThat(result).isEqualTo(42);  }}
```
```
class CollectionUtilsTest {  @Test  void shouldFilterList() {    List<Integer> numbers = List.of(1, 2, 3, 4, 5);    List<Integer> evenNumbers = CollectionUtils.filter(numbers, n -> n % 2 == 0);    assertThat(evenNumbers).containsExactly(2, 4);  }  @Test  void shouldReturnEmptyListWhenNoMatches() {    List<Integer> numbers = List.of(1, 3, 5);    List<Integer> evenNumbers = CollectionUtils.filter(numbers, n -> n % 2 == 0);    assertThat(evenNumbers).isEmpty();  }  @Test  void shouldHandleNullList() {    List<Integer> result = CollectionUtils.filter(null, n -> true);    assertThat(result).isEmpty();  }  @Test  void shouldJoinStringsWithSeparator() {    String result = CollectionUtils.join(List.of("a", "b", "c"), "-");    assertThat(result).isEqualTo("a-b-c");  }  @Test  void shouldHandleEmptyList() {    String result = CollectionUtils.join(List.of(), "-");    assertThat(result).isEmpty();  }  @Test  void shouldDeduplicateList() {    List<String> input = List.of("apple", "banana", "apple", "cherry", "banana");    Set<String> unique = CollectionUtils.deduplicate(input);    assertThat(unique).containsExactlyInAnyOrder("apple", "banana", "cherry");  }}
```
```
class CollectionUtilsTest {  @Test  void shouldFilterList() {    List<Integer> numbers = List.of(1, 2, 3, 4, 5);    List<Integer> evenNumbers = CollectionUtils.filter(numbers, n -> n % 2 == 0);    assertThat(evenNumbers).containsExactly(2, 4);  }  @Test  void shouldReturnEmptyListWhenNoMatches() {    List<Integer> numbers = List.of(1, 3, 5);    List<Integer> evenNumbers = CollectionUtils.filter(numbers, n -> n % 2 == 0);    assertThat(evenNumbers).isEmpty();  }  @Test  void shouldHandleNullList() {    List<Integer> result = CollectionUtils.filter(null, n -> true);    assertThat(result).isEmpty();  }  @Test  void shouldJoinStringsWithSeparator() {    String result = CollectionUtils.join(List.of("a", "b", "c"), "-");    assertThat(result).isEqualTo("a-b-c");  }  @Test  void shouldHandleEmptyList() {    String result = CollectionUtils.join(List.of(), "-");    assertThat(result).isEmpty();  }  @Test  void shouldDeduplicateList() {    List<String> input = List.of("apple", "banana", "apple", "cherry", "banana");    Set<String> unique = CollectionUtils.deduplicate(input);    assertThat(unique).containsExactlyInAnyOrder("apple", "banana", "cherry");  }}
```
```
class FormatUtilsTest {  @Test  void shouldFormatCurrencyWithSymbol() {    String result = FormatUtils.formatCurrency(1234.56);    assertThat(result).isEqualTo("$1,234.56");  }  @Test  void shouldHandleNegativeCurrency() {    String result = FormatUtils.formatCurrency(-100.00);    assertThat(result).isEqualTo("-$100.00");  }  @Test  void shouldParsePhoneNumber() {    String result = FormatUtils.parsePhoneNumber("5551234567");    assertThat(result).isEqualTo("(555) 123-4567");  }  @Test  void shouldFormatDate() {    LocalDate date = LocalDate.of(2024, 1, 15);    String result = FormatUtils.formatDate(date, "yyyy-MM-dd");    assertThat(result).isEqualTo("2024-01-15");  }  @Test  void shouldSluggifyString() {    String result = FormatUtils.sluggify("Hello World! 123");    assertThat(result).isEqualTo("hello-world-123");  }}
```
```
class FormatUtilsTest {  @Test  void shouldFormatCurrencyWithSymbol() {    String result = FormatUtils.formatCurrency(1234.56);    assertThat(result).isEqualTo("$1,234.56");  }  @Test  void shouldHandleNegativeCurrency() {    String result = FormatUtils.formatCurrency(-100.00);    assertThat(result).isEqualTo("-$100.00");  }  @Test  void shouldParsePhoneNumber() {    String result = FormatUtils.parsePhoneNumber("5551234567");    assertThat(result).isEqualTo("(555) 123-4567");  }  @Test  void shouldFormatDate() {    LocalDate date = LocalDate.of(2024, 1, 15);    String result = FormatUtils.formatDate(date, "yyyy-MM-dd");    assertThat(result).isEqualTo("2024-01-15");  }  @Test  void shouldSluggifyString() {    String result = FormatUtils.sluggify("Hello World! 123");    assertThat(result).isEqualTo("hello-world-123");  }}
```
```
class ValidatorUtilsTest {  @Test  void shouldValidateEmailFormat() {    boolean valid = ValidatorUtils.isValidEmail("user@example.com");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidEmail("invalid-email");    assertThat(invalid).isFalse();  }  @Test  void shouldValidatePhoneNumber() {    boolean valid = ValidatorUtils.isValidPhone("555-123-4567");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidPhone("12345");    assertThat(invalid).isFalse();  }  @Test  void shouldValidateUrlFormat() {    boolean valid = ValidatorUtils.isValidUrl("https://example.com");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidUrl("not a url");    assertThat(invalid).isFalse();  }  @Test  void shouldValidateCreditCardNumber() {    boolean valid = ValidatorUtils.isValidCreditCard("4532015112830366");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidCreditCard("1234567890123456");    assertThat(invalid).isFalse();  }}
```
```
class ValidatorUtilsTest {  @Test  void shouldValidateEmailFormat() {    boolean valid = ValidatorUtils.isValidEmail("user@example.com");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidEmail("invalid-email");    assertThat(invalid).isFalse();  }  @Test  void shouldValidatePhoneNumber() {    boolean valid = ValidatorUtils.isValidPhone("555-123-4567");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidPhone("12345");    assertThat(invalid).isFalse();  }  @Test  void shouldValidateUrlFormat() {    boolean valid = ValidatorUtils.isValidUrl("https://example.com");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidUrl("not a url");    assertThat(invalid).isFalse();  }  @Test  void shouldValidateCreditCardNumber() {    boolean valid = ValidatorUtils.isValidCreditCard("4532015112830366");    assertThat(valid).isTrue();    boolean invalid = ValidatorUtils.isValidCreditCard("1234567890123456");    assertThat(invalid).isFalse();  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.ValueSource;import org.junit.jupiter.params.provider.CsvSource;class StringUtilsParametrizedTest {  @ParameterizedTest  @ValueSource(strings = {"", " ", "null", "undefined"})  void shouldConsiderFalsyValuesAsEmpty(String input) {    boolean result = StringUtils.isEmpty(input);    assertThat(result).isTrue();  }  @ParameterizedTest  @CsvSource({    "hello,HELLO",    "world,WORLD",    "javaScript,JAVASCRIPT",    "123ABC,123ABC"  })  void shouldConvertToUpperCase(String input, String expected) {    String result = StringUtils.toUpperCase(input);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.ValueSource;import org.junit.jupiter.params.provider.CsvSource;class StringUtilsParametrizedTest {  @ParameterizedTest  @ValueSource(strings = {"", " ", "null", "undefined"})  void shouldConsiderFalsyValuesAsEmpty(String input) {    boolean result = StringUtils.isEmpty(input);    assertThat(result).isTrue();  }  @ParameterizedTest  @CsvSource({    "hello,HELLO",    "world,WORLD",    "javaScript,JAVASCRIPT",    "123ABC,123ABC"  })  void shouldConvertToUpperCase(String input, String expected) {    String result = StringUtils.toUpperCase(input);    assertThat(result).isEqualTo(expected);  }}
```
```
import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;import static org.mockito.Mockito.when;@ExtendWith(MockitoExtension.class)class DateUtilsTest {  @Mock  private Clock clock;  @Test  void shouldGetCurrentDateFromClock() {    Instant fixedTime = Instant.parse("2024-01-15T10:30:00Z");    when(clock.instant()).thenReturn(fixedTime);    LocalDate result = DateUtils.today(clock);        assertThat(result).isEqualTo(LocalDate.of(2024, 1, 15));  }}
```
```
import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;import static org.mockito.Mockito.when;@ExtendWith(MockitoExtension.class)class DateUtilsTest {  @Mock  private Clock clock;  @Test  void shouldGetCurrentDateFromClock() {    Instant fixedTime = Instant.parse("2024-01-15T10:30:00Z");    when(clock.instant()).thenReturn(fixedTime);    LocalDate result = DateUtils.today(clock);        assertThat(result).isEqualTo(LocalDate.of(2024, 1, 15));  }}
```
```
class MathUtilsEdgeCaseTest {  @Test  void shouldHandleMaxIntegerValue() {    int result = MathUtils.increment(Integer.MAX_VALUE);    assertThat(result).isEqualTo(Integer.MAX_VALUE);  }  @Test  void shouldHandleMinIntegerValue() {    int result = MathUtils.decrement(Integer.MIN_VALUE);    assertThat(result).isEqualTo(Integer.MIN_VALUE);  }  @Test  void shouldHandleVeryLargeNumbers() {    BigDecimal result = MathUtils.add(      new BigDecimal("999999999999.99"),      new BigDecimal("0.01")    );    assertThat(result).isEqualTo(new BigDecimal("1000000000000.00"));  }  @Test  void shouldHandleFloatingPointPrecision() {    double result = MathUtils.multiply(0.1, 0.2);    assertThat(result).isCloseTo(0.02, within(0.0001));  }}
```
```
class MathUtilsEdgeCaseTest {  @Test  void shouldHandleMaxIntegerValue() {    int result = MathUtils.increment(Integer.MAX_VALUE);    assertThat(result).isEqualTo(Integer.MAX_VALUE);  }  @Test  void shouldHandleMinIntegerValue() {    int result = MathUtils.decrement(Integer.MIN_VALUE);    assertThat(result).isEqualTo(Integer.MIN_VALUE);  }  @Test  void shouldHandleVeryLargeNumbers() {    BigDecimal result = MathUtils.add(      new BigDecimal("999999999999.99"),      new BigDecimal("0.01")    );    assertThat(result).isEqualTo(new BigDecimal("1000000000000.00"));  }  @Test  void shouldHandleFloatingPointPrecision() {    double result = MathUtils.multiply(0.1, 0.2);    assertThat(result).isCloseTo(0.02, within(0.0001));  }}
```
```
isCloseTo()
```
Unlock the full potential of your Java development with this specialized Agent Skill for unit testing utility classes. Designed for rigorous validation, it guides you through crafting precise tests for static methods, pure functions, and helper logic. Ensure every corner of your utility code, from string manipulation to complex calculations, performs flawlessly and predictably. This skill helps you build a foundation of high-quality, maintainable code, reducing bugs and improving overall system reliability. Leverage its expertise to streamline your testing workflow and achieve unparalleled code confidence.

# When to Use This Skill
- •Writing unit tests for a new Java utility class containing static helper methods.
- •Refactoring existing pure functions and needing to validate their behavior comprehensively.
- •Developing a library of common data transformation or validation routines and requiring robust test coverage.
- •Ensuring edge cases and boundary conditions are properly handled in string manipulation or mathematical calculation utilities.

# Pro Tips
- 💡Always aim for 100% test coverage on utility classes, as their pure nature makes them ideal candidates for thorough testing without complex mocks.
- 💡Prioritize testing null inputs, empty strings, zero/negative numbers, and maximum/minimum values to cover common edge cases effectively.
- 💡Combine JUnit 5 with AssertJ for highly readable and expressive assertions, making your tests clear and easy to understand.

