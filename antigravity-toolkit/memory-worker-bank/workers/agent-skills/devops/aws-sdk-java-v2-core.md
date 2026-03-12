# aws-sdk-java-v2-core
Source: https://antigravity.codes/agent-skills/devops/aws-sdk-java-v2-core

## AI Worker Instructions
When the user requests functionality related to aws-sdk-java-v2-core, follow these guidelines and utilize this context.

## Scraped Content

# aws-sdk-java-v2-core
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.s3.S3Client;// Basic client with regionS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .build();// Always close clients when donetry (S3Client s3 = S3Client.builder().region(Region.US_EAST_1).build()) {    // Use client} // Auto-closed
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.s3.S3Client;// Basic client with regionS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .build();// Always close clients when donetry (S3Client s3 = S3Client.builder().region(Region.US_EAST_1).build()) {    // Use client} // Auto-closed
```
```
// Uses default credential provider chainS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .build(); // Automatically detects credentials
```
```
// Uses default credential provider chainS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .build(); // Automatically detects credentials
```
```
import software.amazon.awssdk.core.client.config.ClientOverrideConfiguration;import software.amazon.awssdk.http.apache.ApacheHttpClient;import software.amazon.awssdk.http.apache.ProxyConfiguration;import software.amazon.awssdk.metrics.publishers.cloudwatch.CloudWatchMetricPublisher;import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;import java.time.Duration;import java.net.URI;// Advanced client configurationS3Client s3Client = S3Client.builder()    .region(Region.EU_SOUTH_2)    .credentialsProvider(EnvironmentVariableCredentialsProvider.create())    .overrideConfiguration(b -> b        .apiCallTimeout(Duration.ofSeconds(30))        .apiCallAttemptTimeout(Duration.ofSeconds(10))        .addMetricPublisher(CloudWatchMetricPublisher.create()))    .httpClientBuilder(ApacheHttpClient.builder()        .maxConnections(100)        .connectionTimeout(Duration.ofSeconds(5))        .proxyConfiguration(ProxyConfiguration.builder()            .endpoint(URI.create("http://proxy:8080"))            .build()))    .build();
```
```
import software.amazon.awssdk.core.client.config.ClientOverrideConfiguration;import software.amazon.awssdk.http.apache.ApacheHttpClient;import software.amazon.awssdk.http.apache.ProxyConfiguration;import software.amazon.awssdk.metrics.publishers.cloudwatch.CloudWatchMetricPublisher;import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;import java.time.Duration;import java.net.URI;// Advanced client configurationS3Client s3Client = S3Client.builder()    .region(Region.EU_SOUTH_2)    .credentialsProvider(EnvironmentVariableCredentialsProvider.create())    .overrideConfiguration(b -> b        .apiCallTimeout(Duration.ofSeconds(30))        .apiCallAttemptTimeout(Duration.ofSeconds(10))        .addMetricPublisher(CloudWatchMetricPublisher.create()))    .httpClientBuilder(ApacheHttpClient.builder()        .maxConnections(100)        .connectionTimeout(Duration.ofSeconds(5))        .proxyConfiguration(ProxyConfiguration.builder()            .endpoint(URI.create("http://proxy:8080"))            .build()))    .build();
```
```
ClientOverrideConfiguration clientConfig = ClientOverrideConfiguration.builder()    .apiCallTimeout(Duration.ofSeconds(30))    .apiCallAttemptTimeout(Duration.ofSeconds(10))    .addMetricPublisher(CloudWatchMetricPublisher.create())    .build();ApacheHttpClient httpClient = ApacheHttpClient.builder()    .maxConnections(100)    .connectionTimeout(Duration.ofSeconds(5))    .build();S3Client s3Client = S3Client.builder()    .region(Region.EU_SOUTH_2)    .credentialsProvider(EnvironmentVariableCredentialsProvider.create())    .overrideConfiguration(clientConfig)    .httpClient(httpClient)    .build();
```
```
ClientOverrideConfiguration clientConfig = ClientOverrideConfiguration.builder()    .apiCallTimeout(Duration.ofSeconds(30))    .apiCallAttemptTimeout(Duration.ofSeconds(10))    .addMetricPublisher(CloudWatchMetricPublisher.create())    .build();ApacheHttpClient httpClient = ApacheHttpClient.builder()    .maxConnections(100)    .connectionTimeout(Duration.ofSeconds(5))    .build();S3Client s3Client = S3Client.builder()    .region(Region.EU_SOUTH_2)    .credentialsProvider(EnvironmentVariableCredentialsProvider.create())    .overrideConfiguration(clientConfig)    .httpClient(httpClient)    .build();
```
```
// SDK automatically uses default credential provider chain:// 1. Java system properties (aws.accessKeyId and aws.secretAccessKey)// 2. Environment variables (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)// 3. Web identity token from AWS_WEB_IDENTITY_TOKEN_FILE// 4. Shared credentials and config files (~/.aws/credentials and ~/.aws/config)// 5. Amazon ECS container credentials// 6. Amazon EC2 instance profile credentialsS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .build(); // Uses default credential provider chain
```
```
// SDK automatically uses default credential provider chain:// 1. Java system properties (aws.accessKeyId and aws.secretAccessKey)// 2. Environment variables (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)// 3. Web identity token from AWS_WEB_IDENTITY_TOKEN_FILE// 4. Shared credentials and config files (~/.aws/credentials and ~/.aws/config)// 5. Amazon ECS container credentials// 6. Amazon EC2 instance profile credentialsS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .build(); // Uses default credential provider chain
```
```
import software.amazon.awssdk.auth.credentials.*;// Environment variablesCredentialsProvider envCredentials = EnvironmentVariableCredentialsProvider.create();// Profile from ~/.aws/credentialsCredentialsProvider profileCredentials = ProfileCredentialsProvider.create("myprofile");// Static credentials (NOT recommended for production)CredentialsProvider staticCredentials = StaticCredentialsProvider.create(    AwsBasicCredentials.create("accessKeyId", "secretAccessKey"));// Instance profile (for EC2)CredentialsProvider instanceProfileCredentials = InstanceProfileCredentialsProvider.create();// Use with clientS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .credentialsProvider(profileCredentials)    .build();
```
```
import software.amazon.awssdk.auth.credentials.*;// Environment variablesCredentialsProvider envCredentials = EnvironmentVariableCredentialsProvider.create();// Profile from ~/.aws/credentialsCredentialsProvider profileCredentials = ProfileCredentialsProvider.create("myprofile");// Static credentials (NOT recommended for production)CredentialsProvider staticCredentials = StaticCredentialsProvider.create(    AwsBasicCredentials.create("accessKeyId", "secretAccessKey"));// Instance profile (for EC2)CredentialsProvider instanceProfileCredentials = InstanceProfileCredentialsProvider.create();// Use with clientS3Client s3Client = S3Client.builder()    .region(Region.US_EAST_1)    .credentialsProvider(profileCredentials)    .build();
```
```
# ~/.aws/config[default]sso_session = my-ssosso_account_id = 111122223333sso_role_name = SampleRoleregion = us-east-1output = json[sso-session my-sso]sso_region = us-east-1sso_start_url = https://provided-domain.awsapps.com/startsso_registration_scopes = sso:account:access
```
```
# ~/.aws/config[default]sso_session = my-ssosso_account_id = 111122223333sso_role_name = SampleRoleregion = us-east-1output = json[sso-session my-sso]sso_region = us-east-1sso_start_url = https://provided-domain.awsapps.com/startsso_registration_scopes = sso:account:access
```
```
# Login before running applicationaws sso login# Verify active sessionaws sts get-caller-identity
```
```
# Login before running applicationaws sso login# Verify active sessionaws sts get-caller-identity
```
```
import software.amazon.awssdk.http.apache.ApacheHttpClient;ApacheHttpClient httpClient = ApacheHttpClient.builder()    .maxConnections(100)    .connectionTimeout(Duration.ofSeconds(5))    .socketTimeout(Duration.ofSeconds(30))    .connectionTimeToLive(Duration.ofMinutes(5))    .expectContinueEnabled(true)    .build();S3Client s3Client = S3Client.builder()    .httpClient(httpClient)    .build();
```
```
import software.amazon.awssdk.http.apache.ApacheHttpClient;ApacheHttpClient httpClient = ApacheHttpClient.builder()    .maxConnections(100)    .connectionTimeout(Duration.ofSeconds(5))    .socketTimeout(Duration.ofSeconds(30))    .connectionTimeToLive(Duration.ofMinutes(5))    .expectContinueEnabled(true)    .build();S3Client s3Client = S3Client.builder()    .httpClient(httpClient)    .build();
```
```
import software.amazon.awssdk.http.nio.netty.NettyNioAsyncHttpClient;import software.amazon.awssdk.http.nio.netty.SslProvider;NettyNioAsyncHttpClient httpClient = NettyNioAsyncHttpClient.builder()    .maxConcurrency(100)    .connectionTimeout(Duration.ofSeconds(5))    .readTimeout(Duration.ofSeconds(30))    .writeTimeout(Duration.ofSeconds(30))    .sslProvider(SslProvider.OPENSSL) // Better performance than JDK    .build();S3AsyncClient s3AsyncClient = S3AsyncClient.builder()    .httpClient(httpClient)    .build();
```
```
import software.amazon.awssdk.http.nio.netty.NettyNioAsyncHttpClient;import software.amazon.awssdk.http.nio.netty.SslProvider;NettyNioAsyncHttpClient httpClient = NettyNioAsyncHttpClient.builder()    .maxConcurrency(100)    .connectionTimeout(Duration.ofSeconds(5))    .readTimeout(Duration.ofSeconds(30))    .writeTimeout(Duration.ofSeconds(30))    .sslProvider(SslProvider.OPENSSL) // Better performance than JDK    .build();S3AsyncClient s3AsyncClient = S3AsyncClient.builder()    .httpClient(httpClient)    .build();
```
```
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;UrlConnectionHttpClient httpClient = UrlConnectionHttpClient.builder()    .socketTimeout(Duration.ofSeconds(30))    .build();
```
```
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;UrlConnectionHttpClient httpClient = UrlConnectionHttpClient.builder()    .socketTimeout(Duration.ofSeconds(30))    .build();
```
```
@Servicepublic class S3Service {    private final S3Client s3Client;    public S3Service() {        this.s3Client = S3Client.builder()            .region(Region.US_EAST_1)            .build();    }    // Reuse s3Client for all operations}
```
```
@Servicepublic class S3Service {    private final S3Client s3Client;    public S3Service() {        this.s3Client = S3Client.builder()            .region(Region.US_EAST_1)            .build();    }    // Reuse s3Client for all operations}
```
```
public void uploadFile(String bucket, String key) {    // Creates new client each time - wastes resources!    S3Client s3 = S3Client.builder().build();    s3.putObject(...);    s3.close();}
```
```
public void uploadFile(String bucket, String key) {    // Creates new client each time - wastes resources!    S3Client s3 = S3Client.builder().build();    s3.putObject(...);    s3.close();}
```
```
S3Client s3Client = S3Client.builder()    .overrideConfiguration(b -> b        .apiCallTimeout(Duration.ofSeconds(30))        .apiCallAttemptTimeout(Duration.ofMillis(5000)))    .build();
```
```
S3Client s3Client = S3Client.builder()    .overrideConfiguration(b -> b        .apiCallTimeout(Duration.ofSeconds(30))        .apiCallAttemptTimeout(Duration.ofMillis(5000)))    .build();
```
```
// Try-with-resourcestry (S3Client s3 = S3Client.builder().build()) {    s3.listBuckets();}// Explicit closeS3Client s3Client = S3Client.builder().build();try {    s3Client.listBuckets();} finally {    s3Client.close();}
```
```
// Try-with-resourcestry (S3Client s3 = S3Client.builder().build()) {    s3.listBuckets();}// Explicit closeS3Client s3Client = S3Client.builder().build();try {    s3Client.listBuckets();} finally {    s3Client.close();}
```
```
try (ResponseInputStream<GetObjectResponse> s3Object =        s3Client.getObject(GetObjectRequest.builder()            .bucket(bucket)            .key(key)            .build())) {    // Read and process stream immediately    byte[] data = s3Object.readAllBytes();} // Stream auto-closed, connection returned to pool
```
```
try (ResponseInputStream<GetObjectResponse> s3Object =        s3Client.getObject(GetObjectRequest.builder()            .bucket(bucket)            .key(key)            .build())) {    // Read and process stream immediately    byte[] data = s3Object.readAllBytes();} // Stream auto-closed, connection returned to pool
```
```
<dependency>    <groupId>io.netty</groupId>    <artifactId>netty-tcnative-boringssl-static</artifactId>    <version>2.0.61.Final</version>    <scope>runtime</scope></dependency>
```
```
<dependency>    <groupId>io.netty</groupId>    <artifactId>netty-tcnative-boringssl-static</artifactId>    <version>2.0.61.Final</version>    <scope>runtime</scope></dependency>
```
```
NettyNioAsyncHttpClient httpClient = NettyNioAsyncHttpClient.builder()    .sslProvider(SslProvider.OPENSSL)    .build();S3AsyncClient s3AsyncClient = S3AsyncClient.builder()    .httpClient(httpClient)    .build();
```
```
NettyNioAsyncHttpClient httpClient = NettyNioAsyncHttpClient.builder()    .sslProvider(SslProvider.OPENSSL)    .build();S3AsyncClient s3AsyncClient = S3AsyncClient.builder()    .httpClient(httpClient)    .build();
```
```
@ConfigurationProperties(prefix = "aws")public record AwsProperties(    String region,    String accessKeyId,    String secretAccessKey,    S3Properties s3,    DynamoDbProperties dynamoDb) {    public record S3Properties(        Integer maxConnections,        Integer connectionTimeoutSeconds,        Integer apiCallTimeoutSeconds    ) {}    public record DynamoDbProperties(        Integer maxConnections,        Integer readTimeoutSeconds    ) {}}
```
```
@ConfigurationProperties(prefix = "aws")public record AwsProperties(    String region,    String accessKeyId,    String secretAccessKey,    S3Properties s3,    DynamoDbProperties dynamoDb) {    public record S3Properties(        Integer maxConnections,        Integer connectionTimeoutSeconds,        Integer apiCallTimeoutSeconds    ) {}    public record DynamoDbProperties(        Integer maxConnections,        Integer readTimeoutSeconds    ) {}}
```
```
@Configuration@EnableConfigurationProperties(AwsProperties.class)public class AwsClientConfiguration {    private final AwsProperties awsProperties;    public AwsClientConfiguration(AwsProperties awsProperties) {        this.awsProperties = awsProperties;    }    @Bean    public S3Client s3Client() {        return S3Client.builder()            .region(Region.of(awsProperties.region()))            .credentialsProvider(credentialsProvider())            .overrideConfiguration(clientOverrideConfiguration(                awsProperties.s3().apiCallTimeoutSeconds()))            .httpClient(apacheHttpClient(                awsProperties.s3().maxConnections(),                awsProperties.s3().connectionTimeoutSeconds()))            .build();    }    private CredentialsProvider credentialsProvider() {        if (awsProperties.accessKeyId() != null &&            awsProperties.secretAccessKey() != null) {            return StaticCredentialsProvider.create(                AwsBasicCredentials.create(                    awsProperties.accessKeyId(),                    awsProperties.secretAccessKey()));        }        return DefaultCredentialsProvider.create();    }    private ClientOverrideConfiguration clientOverrideConfiguration(            Integer apiCallTimeoutSeconds) {        return ClientOverrideConfiguration.builder()            .apiCallTimeout(Duration.ofSeconds(                apiCallTimeoutSeconds != null ? apiCallTimeoutSeconds : 30))            .apiCallAttemptTimeout(Duration.ofSeconds(10))            .build();    }    private ApacheHttpClient apacheHttpClient(            Integer maxConnections,            Integer connectionTimeoutSeconds) {        return ApacheHttpClient.builder()            .maxConnections(maxConnections != null ? maxConnections : 50)            .connectionTimeout(Duration.ofSeconds(                connectionTimeoutSeconds != null ? connectionTimeoutSeconds : 5))            .socketTimeout(Duration.ofSeconds(30))            .build();    }}
```
```
@Configuration@EnableConfigurationProperties(AwsProperties.class)public class AwsClientConfiguration {    private final AwsProperties awsProperties;    public AwsClientConfiguration(AwsProperties awsProperties) {        this.awsProperties = awsProperties;    }    @Bean    public S3Client s3Client() {        return S3Client.builder()            .region(Region.of(awsProperties.region()))            .credentialsProvider(credentialsProvider())            .overrideConfiguration(clientOverrideConfiguration(                awsProperties.s3().apiCallTimeoutSeconds()))            .httpClient(apacheHttpClient(                awsProperties.s3().maxConnections(),                awsProperties.s3().connectionTimeoutSeconds()))            .build();    }    private CredentialsProvider credentialsProvider() {        if (awsProperties.accessKeyId() != null &&            awsProperties.secretAccessKey() != null) {            return StaticCredentialsProvider.create(                AwsBasicCredentials.create(                    awsProperties.accessKeyId(),                    awsProperties.secretAccessKey()));        }        return DefaultCredentialsProvider.create();    }    private ClientOverrideConfiguration clientOverrideConfiguration(            Integer apiCallTimeoutSeconds) {        return ClientOverrideConfiguration.builder()            .apiCallTimeout(Duration.ofSeconds(                apiCallTimeoutSeconds != null ? apiCallTimeoutSeconds : 30))            .apiCallAttemptTimeout(Duration.ofSeconds(10))            .build();    }    private ApacheHttpClient apacheHttpClient(            Integer maxConnections,            Integer connectionTimeoutSeconds) {        return ApacheHttpClient.builder()            .maxConnections(maxConnections != null ? maxConnections : 50)            .connectionTimeout(Duration.ofSeconds(                connectionTimeoutSeconds != null ? connectionTimeoutSeconds : 5))            .socketTimeout(Duration.ofSeconds(30))            .build();    }}
```
```
aws:  region: us-east-1  s3:    max-connections: 100    connection-timeout-seconds: 5    api-call-timeout-seconds: 30  dynamo-db:    max-connections: 50    read-timeout-seconds: 30
```
```
aws:  region: us-east-1  s3:    max-connections: 100    connection-timeout-seconds: 5    api-call-timeout-seconds: 30  dynamo-db:    max-connections: 50    read-timeout-seconds: 30
```
```
import software.amazon.awssdk.services.s3.model.S3Exception;import software.amazon.awssdk.core.exception.SdkClientException;import software.amazon.awssdk.core.exception.SdkServiceException;try {    s3Client.getObject(request);} catch (S3Exception e) {    // Service-specific exception    System.err.println("S3 Error: " + e.awsErrorDetails().errorMessage());    System.err.println("Error Code: " + e.awsErrorDetails().errorCode());    System.err.println("Status Code: " + e.statusCode());    System.err.println("Request ID: " + e.requestId());} catch (SdkServiceException e) {    // Generic service exception    System.err.println("AWS Service Error: " + e.getMessage());} catch (SdkClientException e) {    // Client-side error (network, timeout, etc.)    System.err.println("Client Error: " + e.getMessage());}
```
```
import software.amazon.awssdk.services.s3.model.S3Exception;import software.amazon.awssdk.core.exception.SdkClientException;import software.amazon.awssdk.core.exception.SdkServiceException;try {    s3Client.getObject(request);} catch (S3Exception e) {    // Service-specific exception    System.err.println("S3 Error: " + e.awsErrorDetails().errorMessage());    System.err.println("Error Code: " + e.awsErrorDetails().errorCode());    System.err.println("Status Code: " + e.statusCode());    System.err.println("Request ID: " + e.requestId());} catch (SdkServiceException e) {    // Generic service exception    System.err.println("AWS Service Error: " + e.getMessage());} catch (SdkClientException e) {    // Client-side error (network, timeout, etc.)    System.err.println("Client Error: " + e.getMessage());}
```
```
@TestConfigurationpublic class LocalStackAwsConfig {    @Bean    public S3Client s3Client() {        return S3Client.builder()            .region(Region.US_EAST_1)            .endpointOverride(URI.create("http://localhost:4566"))            .credentialsProvider(StaticCredentialsProvider.create(                AwsBasicCredentials.create("test", "test")))            .build();    }}
```
```
@TestConfigurationpublic class LocalStackAwsConfig {    @Bean    public S3Client s3Client() {        return S3Client.builder()            .region(Region.US_EAST_1)            .endpointOverride(URI.create("http://localhost:4566"))            .credentialsProvider(StaticCredentialsProvider.create(                AwsBasicCredentials.create("test", "test")))            .build();    }}
```
```
@Testcontainers@SpringBootTestclass S3IntegrationTest {    @Container    static LocalStackContainer localstack = new LocalStackContainer(        DockerImageName.parse("localstack/localstack:3.0"))        .withServices(LocalStackContainer.Service.S3);    @DynamicPropertySource    static void overrideProperties(DynamicPropertyRegistry registry) {        registry.add("aws.s3.endpoint",            () -> localstack.getEndpointOverride(LocalStackContainer.Service.S3));        registry.add("aws.region", () -> localstack.getRegion());        registry.add("aws.access-key-id", localstack::getAccessKey);        registry.add("aws.secret-access-key", localstack::getSecretKey);    }}
```
```
@Testcontainers@SpringBootTestclass S3IntegrationTest {    @Container    static LocalStackContainer localstack = new LocalStackContainer(        DockerImageName.parse("localstack/localstack:3.0"))        .withServices(LocalStackContainer.Service.S3);    @DynamicPropertySource    static void overrideProperties(DynamicPropertyRegistry registry) {        registry.add("aws.s3.endpoint",            () -> localstack.getEndpointOverride(LocalStackContainer.Service.S3));        registry.add("aws.region", () -> localstack.getRegion());        registry.add("aws.access-key-id", localstack::getAccessKey);        registry.add("aws.secret-access-key", localstack::getSecretKey);    }}
```
```
<dependencyManagement>    <dependencies>        <dependency>            <groupId>software.amazon.awssdk</groupId>            <artifactId>bom</artifactId>            <version>2.25.0</version> // Use latest stable version            <type>pom</type>            <scope>import</scope>        </dependency>    </dependencies></dependencyManagement><dependencies>    <!-- Core SDK -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>sdk-core</artifactId>    </dependency>    <!-- Apache HTTP Client (recommended for sync) -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>apache-client</artifactId>    </dependency>    <!-- Netty HTTP Client (for async) -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>netty-nio-client</artifactId>    </dependency>    <!-- URL Connection HTTP Client (lightweight) -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>url-connection-client</artifactId>    </dependency>    <!-- CloudWatch Metrics -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>cloudwatch-metric-publisher</artifactId>    </dependency>    <!-- OpenSSL for better performance -->    <dependency>        <groupId>io.netty</groupId>        <artifactId>netty-tcnative-boringssl-static</artifactId>        <version>2.0.61.Final</version>        <scope>runtime</scope>    </dependency></dependencies>
```
```
<dependencyManagement>    <dependencies>        <dependency>            <groupId>software.amazon.awssdk</groupId>            <artifactId>bom</artifactId>            <version>2.25.0</version> // Use latest stable version            <type>pom</type>            <scope>import</scope>        </dependency>    </dependencies></dependencyManagement><dependencies>    <!-- Core SDK -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>sdk-core</artifactId>    </dependency>    <!-- Apache HTTP Client (recommended for sync) -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>apache-client</artifactId>    </dependency>    <!-- Netty HTTP Client (for async) -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>netty-nio-client</artifactId>    </dependency>    <!-- URL Connection HTTP Client (lightweight) -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>url-connection-client</artifactId>    </dependency>    <!-- CloudWatch Metrics -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>cloudwatch-metric-publisher</artifactId>    </dependency>    <!-- OpenSSL for better performance -->    <dependency>        <groupId>io.netty</groupId>        <artifactId>netty-tcnative-boringssl-static</artifactId>        <version>2.0.61.Final</version>        <scope>runtime</scope>    </dependency></dependencies>
```
```
dependencies {    implementation platform('software.amazon.awssdk:bom:2.25.0')    implementation 'software.amazon.awssdk:sdk-core'    implementation 'software.amazon.awssdk:apache-client'    implementation 'software.amazon.awssdk:netty-nio-client'    implementation 'software.amazon.awssdk:cloudwatch-metric-publisher'    runtimeOnly 'io.netty:netty-tcnative-boringssl-static:2.0.61.Final'}
```
```
dependencies {    implementation platform('software.amazon.awssdk:bom:2.25.0')    implementation 'software.amazon.awssdk:sdk-core'    implementation 'software.amazon.awssdk:apache-client'    implementation 'software.amazon.awssdk:netty-nio-client'    implementation 'software.amazon.awssdk:cloudwatch-metric-publisher'    runtimeOnly 'io.netty:netty-tcnative-boringssl-static:2.0.61.Final'}
```
```
import software.amazon.awssdk.core.sync.RequestBody;import software.amazon.awssdk.services.s3.model.PutObjectRequest;try (S3Client s3 = S3Client.builder().region(Region.US_EAST_1).build()) {    PutObjectRequest request = PutObjectRequest.builder()        .bucket("my-bucket")        .key("uploads/file.txt")        .build();    s3.putObject(request, RequestBody.fromString("Hello, World!"));}
```
```
import software.amazon.awssdk.core.sync.RequestBody;import software.amazon.awssdk.services.s3.model.PutObjectRequest;try (S3Client s3 = S3Client.builder().region(Region.US_EAST_1).build()) {    PutObjectRequest request = PutObjectRequest.builder()        .bucket("my-bucket")        .key("uploads/file.txt")        .build();    s3.putObject(request, RequestBody.fromString("Hello, World!"));}
```
```
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;try (S3Client s3 = S3Client.builder().region(Region.US_EAST_1).build()) {    ListObjectsV2Request request = ListObjectsV2Request.builder()        .bucket("my-bucket")        .build();    ListObjectsV2Response response = s3.listObjectsV2(request);    response.contents().forEach(object -> {        System.out.println("Object key: " + object.key());    });}
```
```
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;try (S3Client s3 = S3Client.builder().region(Region.US_EAST_1).build()) {    ListObjectsV2Request request = ListObjectsV2Request.builder()        .bucket("my-bucket")        .build();    ListObjectsV2Response response = s3.listObjectsV2(request);    response.contents().forEach(object -> {        System.out.println("Object key: " + object.key());    });}
```
```
import software.amazon.awssdk.core.async.AsyncRequestBody;import software.amazon.awssdk.services.s3.model.PutObjectRequest;S3AsyncClient s3AsyncClient = S3AsyncClient.builder().build();PutObjectRequest request = PutObjectRequest.builder()    .bucket("my-bucket")    .key("async-upload.txt")    .build();CompletableFuture<PutObjectResponse> future = s3AsyncClient.putObject(    request, Async.fromString("Hello, Async World!"));future.thenAccept(response -> {    System.out.println("Upload completed: " + response.eTag());}).exceptionally(error -> {    System.err.println("Upload failed: " + error.getMessage());    return null;});
```
```
import software.amazon.awssdk.core.async.AsyncRequestBody;import software.amazon.awssdk.services.s3.model.PutObjectRequest;S3AsyncClient s3AsyncClient = S3AsyncClient.builder().build();PutObjectRequest request = PutObjectRequest.builder()    .bucket("my-bucket")    .key("async-upload.txt")    .build();CompletableFuture<PutObjectResponse> future = s3AsyncClient.putObject(    request, Async.fromString("Hello, Async World!"));future.thenAccept(response -> {    System.out.println("Upload completed: " + response.eTag());}).exceptionally(error -> {    System.err.println("Upload failed: " + error.getMessage());    return null;});
```
```
apiCallTimeout
```
```
apiCallAttemptTimeout
```
```
aws-sdk-java-v2-s3
```
```
aws-sdk-java-v2-dynamodb
```
```
aws-sdk-java-v2-lambda
```
Unlock the full potential of your Java applications when interacting with Amazon Web Services. This agent skill provides comprehensive guidance on configuring the AWS SDK for Java 2.x, covering foundational elements from client initialization and secure credential management to performance optimization and robust error handling. Whether you're building a new cloud-native application or enhancing an existing one, mastering these core patterns is crucial for developing scalable, secure, and efficient integrations with the vast ecosystem of AWS services. Leverage expert insights to streamline your development workflow and ensure your applications adhere to industry best practices.

# When to Use This Skill
- •Setting up and configuring AWS service clients for optimal performance and security.
- •Implementing various authentication and credential management strategies for AWS access.
- •Optimizing HTTP client configurations and connection pooling for efficient API calls.
- •Integrating AWS SDK for Java 2.x with Spring Boot applications and testing with LocalStack.

# Pro Tips
- 💡Always utilize the try-with-resources statement or explicitly close your AWS service clients to prevent resource leaks, especially in high-throughput applications.
- 💡Prioritize using AWS IAM roles over hardcoded credentials for enhanced security, especially in EC2, ECS, or Lambda environments.
- 💡Implement comprehensive retry and error handling strategies, leveraging the SDK's built-in capabilities, to build more resilient applications against transient network issues and service limits.

