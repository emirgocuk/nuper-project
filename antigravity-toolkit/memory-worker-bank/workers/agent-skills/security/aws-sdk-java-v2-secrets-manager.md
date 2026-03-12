# aws-sdk-java-v2-secrets-manager
Source: https://antigravity.codes/agent-skills/security/aws-sdk-java-v2-secrets-manager

## AI Worker Instructions
When the user requests functionality related to aws-sdk-java-v2-secrets-manager, follow these guidelines and utilize this context.

## Scraped Content

# aws-sdk-java-v2-secrets-manager
```
<dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>secretsmanager</artifactId></dependency><!-- For secret caching (recommended for production) --><dependency>    <groupId>com.amazonaws.secretsmanager</groupId>    <artifactId>aws-secretsmanager-caching-java</artifactId>    <version>2.0.0</version> // Use the sdk v2 compatible version</dependency>
```
```
<dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>secretsmanager</artifactId></dependency><!-- For secret caching (recommended for production) --><dependency>    <groupId>com.amazonaws.secretsmanager</groupId>    <artifactId>aws-secretsmanager-caching-java</artifactId>    <version>2.0.0</version> // Use the sdk v2 compatible version</dependency>
```
```
implementation 'software.amazon.awssdk:secretsmanager'implementation 'com.amazonaws.secretsmanager:aws-secretsmanager-caching-java:2.0.0
```
```
implementation 'software.amazon.awssdk:secretsmanager'implementation 'com.amazonaws.secretsmanager:aws-secretsmanager-caching-java:2.0.0
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;SecretsManagerClient secretsClient = SecretsManagerClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;SecretsManagerClient secretsClient = SecretsManagerClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.services.secretsmanager.model.*;public String createSecret(String secretName, String secretValue) {    CreateSecretRequest request = CreateSecretRequest.builder()        .name(secretName)        .secretString(secretValue)        .build();    CreateSecretResponse response = secretsClient.createSecret(request);    return response.arn();}
```
```
import software.amazon.awssdk.services.secretsmanager.model.*;public String createSecret(String secretName, String secretValue) {    CreateSecretRequest request = CreateSecretRequest.builder()        .name(secretName)        .secretString(secretValue)        .build();    CreateSecretResponse response = secretsClient.createSecret(request);    return response.arn();}
```
```
public String getSecretValue(String secretName) {    GetSecretValueRequest request = GetSecretValueRequest.builder()        .secretId(secretName)        .build();    GetSecretValueResponse response = secretsClient.getSecretValue(request);    return response.secretString();}
```
```
public String getSecretValue(String secretName) {    GetSecretValueRequest request = GetSecretValueRequest.builder()        .secretId(secretName)        .build();    GetSecretValueResponse response = secretsClient.getSecretValue(request);    return response.secretString();}
```
```
createSecret()
```
```
getSecretValue()
```
```
updateSecret()
```
```
deleteSecret()
```
```
listSecrets()
```
```
restoreSecret()
```
```
versionId
```
```
rotateSecret()
```
```
import com.amazonaws.secretsmanager.caching.SecretCache;public class CachedSecrets {    private final SecretCache cache;    public CachedSecrets(SecretsManagerClient secretsClient) {        this.cache = new SecretCache(secretsClient);    }    public String getCachedSecret(String secretName) {        return cache.getSecretString(secretName);    }}
```
```
import com.amazonaws.secretsmanager.caching.SecretCache;public class CachedSecrets {    private final SecretCache cache;    public CachedSecrets(SecretsManagerClient secretsClient) {        this.cache = new SecretCache(secretsClient);    }    public String getCachedSecret(String secretName) {        return cache.getSecretString(secretName);    }}
```
```
import com.amazonaws.secretsmanager.caching.SecretCacheConfiguration;SecretCacheConfiguration config = SecretCacheConfiguration.builder()    .maxCacheSize(1000)    .cacheItemTTL(3600000) // 1 hour    .build();
```
```
import com.amazonaws.secretsmanager.caching.SecretCacheConfiguration;SecretCacheConfiguration config = SecretCacheConfiguration.builder()    .maxCacheSize(1000)    .cacheItemTTL(3600000) // 1 hour    .build();
```
```
@Configurationpublic class SecretsManagerConfiguration {    @Bean    public SecretsManagerClient secretsManagerClient() {        return SecretsManagerClient.builder()            .region(Region.of(region))            .build();    }    @Bean    public SecretCache secretCache(SecretsManagerClient secretsClient) {        return new SecretCache(secretsClient);    }}
```
```
@Configurationpublic class SecretsManagerConfiguration {    @Bean    public SecretsManagerClient secretsManagerClient() {        return SecretsManagerClient.builder()            .region(Region.of(region))            .build();    }    @Bean    public SecretCache secretCache(SecretsManagerClient secretsClient) {        return new SecretCache(secretsClient);    }}
```
```
@Servicepublic class SecretsService {    private final SecretCache cache;    public SecretsService(SecretCache cache) {        this.cache = cache;    }    public <T> T getSecretAsObject(String secretName, Class<T> type) {        String secretJson = cache.getSecretString(secretName);        return objectMapper.readValue(secretJson, type);    }}
```
```
@Servicepublic class SecretsService {    private final SecretCache cache;    public SecretsService(SecretCache cache) {        this.cache = cache;    }    public <T> T getSecretAsObject(String secretName, Class<T> type) {        String secretJson = cache.getSecretString(secretName);        return objectMapper.readValue(secretJson, type);    }}
```
```
@Configurationpublic class DatabaseConfiguration {    @Bean    public DataSource dataSource(SecretsService secretsService) {        Map<String, String> credentials = secretsService.getSecretAsMap(            "prod/database/credentials");        HikariConfig config = new HikariConfig();        config.setJdbcUrl(credentials.get("url"));        config.setUsername(credentials.get("username"));        config.setPassword(credentials.get("password"));        return new HikariDataSource(config);    }}
```
```
@Configurationpublic class DatabaseConfiguration {    @Bean    public DataSource dataSource(SecretsService secretsService) {        Map<String, String> credentials = secretsService.getSecretAsMap(            "prod/database/credentials");        HikariConfig config = new HikariConfig();        config.setJdbcUrl(credentials.get("url"));        config.setUsername(credentials.get("username"));        config.setPassword(credentials.get("password"));        return new HikariDataSource(config);    }}
```
```
{  "engine": "postgres",  "host": "mydb.us-east-1.rds.amazonaws.com",  "port": 5432,  "username": "admin",  "password": "MySecurePassword123!",  "dbname": "mydatabase",  "url": "jdbc:postgresql://mydb.us-east-1.rds.amazonaws.com:5432/mydatabase"}
```
```
{  "engine": "postgres",  "host": "mydb.us-east-1.rds.amazonaws.com",  "port": 5432,  "username": "admin",  "password": "MySecurePassword123!",  "dbname": "mydatabase",  "url": "jdbc:postgresql://mydb.us-east-1.rds.amazonaws.com:5432/mydatabase"}
```
```
{  "api_key": "abcd1234-5678-90ef-ghij-klmnopqrstuv",  "api_secret": "MySecretKey123!",  "api_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```
```
{  "api_key": "abcd1234-5678-90ef-ghij-klmnopqrstuv",  "api_secret": "MySecretKey123!",  "api_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```
```
try {    String secret = secretsClient.getSecretValue(request).secretString();} catch (SecretsManagerException e) {    if (e.awsErrorDetails().errorCode().equals("ResourceNotFoundException")) {        // Handle missing secret    }    throw e;}
```
```
try {    String secret = secretsClient.getSecretValue(request).secretString();} catch (SecretsManagerException e) {    if (e.awsErrorDetails().errorCode().equals("ResourceNotFoundException")) {        // Handle missing secret    }    throw e;}
```
```
List<String> secretNames = List.of("secret1", "secret2", "secret3");Map<String, String> secrets = secretNames.stream()    .collect(Collectors.toMap(        Function.identity(),        name -> cache.getSecretString(name)    ));
```
```
List<String> secretNames = List.of("secret1", "secret2", "secret3");Map<String, String> secrets = secretNames.stream()    .collect(Collectors.toMap(        Function.identity(),        name -> cache.getSecretString(name)    ));
```
```
@Value
```
```
@ExtendWith(MockitoExtension.class)class SecretsServiceTest {    @Mock    private SecretCache cache;    @InjectMocks    private SecretsService secretsService;    @Test    void shouldGetSecret() {        when(cache.getSecretString("test-secret")).thenReturn("secret-value");        String result = secretsService.getSecret("test-secret");        assertEquals("secret-value", result);    }}
```
```
@ExtendWith(MockitoExtension.class)class SecretsServiceTest {    @Mock    private SecretCache cache;    @InjectMocks    private SecretsService secretsService;    @Test    void shouldGetSecret() {        when(cache.getSecretString("test-secret")).thenReturn("secret-value");        String result = secretsService.getSecret("test-secret");        assertEquals("secret-value", result);    }}
```
```
@SpringBootTest(classes = TestSecretsConfiguration.class)class SecretsManagerIntegrationTest {    @Autowired    private SecretsService secretsService;    @Test    void shouldRetrieveSecret() {        String secret = secretsService.getSecret("test-secret");        assertNotNull(secret);    }}
```
```
@SpringBootTest(classes = TestSecretsConfiguration.class)class SecretsManagerIntegrationTest {    @Autowired    private SecretsService secretsService;    @Test    void shouldRetrieveSecret() {        String secret = secretsService.getSecret("test-secret");        assertNotNull(secret);    }}
```
```
# Check secret existsaws secretsmanager describe-secret --secret-id my-secret# List all secretsaws secretsmanager list-secrets# Get secret value (CLI)aws secretsmanager get-secret-value --secret-id my-secret
```
```
# Check secret existsaws secretsmanager describe-secret --secret-id my-secret# List all secretsaws secretsmanager list-secrets# Get secret value (CLI)aws secretsmanager get-secret-value --secret-id my-secret
```
```
aws-sdk-java-v2-core
```
```
aws-sdk-java-v2-kms
```
```
spring-boot-dependency-injection
```
In today's complex application landscape, the secure management of sensitive information like API keys, database passwords, and other credentials is paramount. This specialized agent skill empowers developers working with AWS SDK for Java 2.x to implement robust secret management practices using AWS Secrets Manager. It streamlines tasks from programmatically storing and retrieving confidential data to automating secret rotation, ensuring your applications maintain high security standards. Leverage this skill to integrate sophisticated secret handling into your Java projects, safeguarding critical access tokens and minimizing exposure risks effectively, especially within Spring Boot environments.

# When to Use This Skill
- •Securely retrieving API keys and tokens for microservices or third-party integrations.
- •Automating the rotation of database credentials for enhanced security compliance.
- •Centralizing configuration management for Spring Boot applications by fetching sensitive settings from Secrets Manager.
- •Implementing a caching layer for frequently accessed secrets to reduce latency and AWS API calls.

# Pro Tips
- 💡Always implement secret caching in production environments to minimize latency and AWS API call costs, utilizing the recommended caching library.
- 💡Adhere strictly to the principle of least privilege when defining IAM policies for secret access, ensuring applications or users can only access the specific secrets they require.
- 💡Combine AWS Secrets Manager with AWS Lambda for seamless, automated secret rotation, significantly improving your security posture without manual intervention.

