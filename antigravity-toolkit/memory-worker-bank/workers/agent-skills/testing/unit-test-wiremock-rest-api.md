# unit-test-wiremock-rest-api
Source: https://antigravity.codes/agent-skills/testing/unit-test-wiremock-rest-api

## AI Worker Instructions
When the user requests functionality related to unit-test-wiremock-rest-api, follow these guidelines and utilize this context.

## Scraped Content

# unit-test-wiremock-rest-api
```
<dependency>  <groupId>org.wiremock</groupId>  <artifactId>wiremock</artifactId>  <version>3.4.1</version>  <scope>test</scope></dependency><dependency>  <groupId>org.junit.jupiter</groupId>  <artifactId>junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.assertj</groupId>  <artifactId>assertj-core</artifactId>  <scope>test</scope></dependency>
```
```
<dependency>  <groupId>org.wiremock</groupId>  <artifactId>wiremock</artifactId>  <version>3.4.1</version>  <scope>test</scope></dependency><dependency>  <groupId>org.junit.jupiter</groupId>  <artifactId>junit-jupiter</artifactId>  <scope>test</scope></dependency><dependency>  <groupId>org.assertj</groupId>  <artifactId>assertj-core</artifactId>  <scope>test</scope></dependency>
```
```
dependencies {  testImplementation("org.wiremock:wiremock:3.4.1")  testImplementation("org.junit.jupiter:junit-jupiter")  testImplementation("org.assertj:assertj-core")}
```
```
dependencies {  testImplementation("org.wiremock:wiremock:3.4.1")  testImplementation("org.junit.jupiter:junit-jupiter")  testImplementation("org.assertj:assertj-core")}
```
```
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.RegisterExtension;import static com.github.tomakehurst.wiremock.client.WireMock.*;import static org.assertj.core.api.Assertions.assertThat;class ExternalWeatherServiceTest {  @RegisterExtension  static WireMockExtension wireMock = WireMockExtension.newInstance()    .options(wireMockConfig().dynamicPort())    .build();  @Test  void shouldFetchWeatherDataFromExternalApi() {    wireMock.stubFor(get(urlEqualTo("/weather?city=London"))      .withHeader("Accept", containing("application/json"))      .willReturn(aResponse()        .withStatus(200)        .withHeader("Content-Type", "application/json")        .withBody("{\"city\":\"London\",\"temperature\":15,\"condition\":\"Cloudy\"}")));    String baseUrl = wireMock.getRuntimeInfo().getHttpBaseUrl();    WeatherApiClient client = new WeatherApiClient(baseUrl);    WeatherData weather = client.getWeather("London");    assertThat(weather.getCity()).isEqualTo("London");    assertThat(weather.getTemperature()).isEqualTo(15);    wireMock.verify(getRequestedFor(urlEqualTo("/weather?city=London"))      .withHeader("Accept", containing("application/json")));  }}
```
```
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.RegisterExtension;import static com.github.tomakehurst.wiremock.client.WireMock.*;import static org.assertj.core.api.Assertions.assertThat;class ExternalWeatherServiceTest {  @RegisterExtension  static WireMockExtension wireMock = WireMockExtension.newInstance()    .options(wireMockConfig().dynamicPort())    .build();  @Test  void shouldFetchWeatherDataFromExternalApi() {    wireMock.stubFor(get(urlEqualTo("/weather?city=London"))      .withHeader("Accept", containing("application/json"))      .willReturn(aResponse()        .withStatus(200)        .withHeader("Content-Type", "application/json")        .withBody("{\"city\":\"London\",\"temperature\":15,\"condition\":\"Cloudy\"}")));    String baseUrl = wireMock.getRuntimeInfo().getHttpBaseUrl();    WeatherApiClient client = new WeatherApiClient(baseUrl);    WeatherData weather = client.getWeather("London");    assertThat(weather.getCity()).isEqualTo("London");    assertThat(weather.getTemperature()).isEqualTo(15);    wireMock.verify(getRequestedFor(urlEqualTo("/weather?city=London"))      .withHeader("Accept", containing("application/json")));  }}
```
```
@Testvoid shouldHandleNotFoundError() {  wireMock.stubFor(get(urlEqualTo("/api/users/999"))    .willReturn(aResponse()      .withStatus(404)      .withBody("{\"error\":\"User not found\"}")));  WeatherApiClient client = new WeatherApiClient(wireMock.getRuntimeInfo().getHttpBaseUrl());    assertThatThrownBy(() -> client.getUser(999))    .isInstanceOf(UserNotFoundException.class)    .hasMessageContaining("User not found");}@Testvoid shouldRetryOnServerError() {  wireMock.stubFor(get(urlEqualTo("/api/data"))    .willReturn(aResponse()      .withStatus(500)      .withBody("{\"error\":\"Internal server error\"}")));  ApiClient client = new ApiClient(wireMock.getRuntimeInfo().getHttpBaseUrl());    assertThatThrownBy(() -> client.fetchData())    .isInstanceOf(ServerErrorException.class);}
```
```
@Testvoid shouldHandleNotFoundError() {  wireMock.stubFor(get(urlEqualTo("/api/users/999"))    .willReturn(aResponse()      .withStatus(404)      .withBody("{\"error\":\"User not found\"}")));  WeatherApiClient client = new WeatherApiClient(wireMock.getRuntimeInfo().getHttpBaseUrl());    assertThatThrownBy(() -> client.getUser(999))    .isInstanceOf(UserNotFoundException.class)    .hasMessageContaining("User not found");}@Testvoid shouldRetryOnServerError() {  wireMock.stubFor(get(urlEqualTo("/api/data"))    .willReturn(aResponse()      .withStatus(500)      .withBody("{\"error\":\"Internal server error\"}")));  ApiClient client = new ApiClient(wireMock.getRuntimeInfo().getHttpBaseUrl());    assertThatThrownBy(() -> client.fetchData())    .isInstanceOf(ServerErrorException.class);}
```
```
@Testvoid shouldVerifyRequestBody() {  wireMock.stubFor(post(urlEqualTo("/api/users"))    .willReturn(aResponse()      .withStatus(201)      .withBody("{\"id\":123,\"name\":\"Alice\"}")));  ApiClient client = new ApiClient(wireMock.getRuntimeInfo().getHttpBaseUrl());  UserResponse response = client.createUser("Alice");  assertThat(response.getId()).isEqualTo(123);    wireMock.verify(postRequestedFor(urlEqualTo("/api/users"))    .withRequestBody(matchingJsonPath("$.name", equalTo("Alice")))    .withHeader("Content-Type", containing("application/json")));}
```
```
@Testvoid shouldVerifyRequestBody() {  wireMock.stubFor(post(urlEqualTo("/api/users"))    .willReturn(aResponse()      .withStatus(201)      .withBody("{\"id\":123,\"name\":\"Alice\"}")));  ApiClient client = new ApiClient(wireMock.getRuntimeInfo().getHttpBaseUrl());  UserResponse response = client.createUser("Alice");  assertThat(response.getId()).isEqualTo(123);    wireMock.verify(postRequestedFor(urlEqualTo("/api/users"))    .withRequestBody(matchingJsonPath("$.name", equalTo("Alice")))    .withHeader("Content-Type", containing("application/json")));}
```
```
@RegisterExtension
```
```
wireMock.getRuntimeInfo().getHttpBaseUrl()
```
```
wireMockConfig().dynamicPort()
```
Integrating with external RESTful services often introduces fragility and slows down testing. This specialized agent skill empowers developers to confidently build and test these integrations using WireMock. By meticulously simulating external API behaviors—including diverse success and failure scenarios—you can create isolated, fast, and reliable unit tests. This ensures your service clients handle various responses gracefully, all without touching a real network endpoint. Accelerate your development and CI/CD workflows by eliminating external dependencies and network flakiness in your API integration tests.

# When to Use This Skill
- •Testing custom API clients that consume third-party services like payment gateways or weather APIs.
- •Validating error handling logic for various HTTP response codes (e.g., 404, 500, timeouts) from external systems.
- •Verifying the exact structure and content of outgoing requests (headers, query parameters, JSON body) to an external API.
- •Building isolated and fast unit tests for microservices that communicate with each other via REST.

# Pro Tips
- 💡Organize complex WireMock stubs into separate JSON files or helper methods for better readability and reusability, especially for multi-scenario tests.
- 💡Leverage WireMock's advanced matching capabilities (e.g., regex for URLs, JSONPath for request bodies) to create highly specific and robust stub definitions.
- 💡Integrate WireMock into your build process to ensure all API client logic is thoroughly tested without requiring a running backend service during development or CI/CD.

