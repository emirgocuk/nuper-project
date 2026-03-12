# aws-sdk-java-v2-lambda
Source: https://antigravity.codes/agent-skills/backend/aws-sdk-java-v2-lambda

## AI Worker Instructions
When the user requests functionality related to aws-sdk-java-v2-lambda, follow these guidelines and utilize this context.

## Scraped Content

# aws-sdk-java-v2-lambda
```
<dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>lambda</artifactId></dependency>
```
```
<dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>lambda</artifactId></dependency>
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.lambda.LambdaClient;LambdaClient lambdaClient = LambdaClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.lambda.LambdaClient;LambdaClient lambdaClient = LambdaClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.services.lambda.LambdaAsyncClient;LambdaAsyncClient asyncLambdaClient = LambdaAsyncClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.services.lambda.LambdaAsyncClient;LambdaAsyncClient asyncLambdaClient = LambdaAsyncClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.services.lambda.model.*;import software.amazon.awssdk.core.SdkBytes;public String invokeLambda(LambdaClient lambdaClient,                           String functionName,                           String payload) {    InvokeRequest request = InvokeRequest.builder()        .functionName(functionName)        .payload(SdkBytes.fromUtf8String(payload))        .build();    InvokeResponse response = lambdaClient.invoke(request);    return response.payload().asUtf8String();}
```
```
import software.amazon.awssdk.services.lambda.model.*;import software.amazon.awssdk.core.SdkBytes;public String invokeLambda(LambdaClient lambdaClient,                           String functionName,                           String payload) {    InvokeRequest request = InvokeRequest.builder()        .functionName(functionName)        .payload(SdkBytes.fromUtf8String(payload))        .build();    InvokeResponse response = lambdaClient.invoke(request);    return response.payload().asUtf8String();}
```
```
public void invokeLambdaAsync(LambdaClient lambdaClient,                              String functionName,                              String payload) {    InvokeRequest request = InvokeRequest.builder()        .functionName(functionName)        .invocationType(InvocationType.EVENT) // Asynchronous        .payload(SdkBytes.fromUtf8String(payload))        .build();    InvokeResponse response = lambdaClient.invoke(request);    System.out.println("Status: " + response.statusCode());}
```
```
public void invokeLambdaAsync(LambdaClient lambdaClient,                              String functionName,                              String payload) {    InvokeRequest request = InvokeRequest.builder()        .functionName(functionName)        .invocationType(InvocationType.EVENT) // Asynchronous        .payload(SdkBytes.fromUtf8String(payload))        .build();    InvokeResponse response = lambdaClient.invoke(request);    System.out.println("Status: " + response.statusCode());}
```
```
import com.fasterxml.jackson.databind.ObjectMapper;public <T> String invokeLambdaWithObject(LambdaClient lambdaClient,                                         String functionName,                                         T requestObject) throws Exception {    ObjectMapper mapper = new ObjectMapper();    String jsonPayload = mapper.writeValueAsString(requestObject);    InvokeRequest request = InvokeRequest.builder()        .functionName(functionName)        .payload(SdkBytes.fromUtf8String(jsonPayload))        .build();    InvokeResponse response = lambdaClient.invoke(request);    return response.payload().asUtf8String();}
```
```
import com.fasterxml.jackson.databind.ObjectMapper;public <T> String invokeLambdaWithObject(LambdaClient lambdaClient,                                         String functionName,                                         T requestObject) throws Exception {    ObjectMapper mapper = new ObjectMapper();    String jsonPayload = mapper.writeValueAsString(requestObject);    InvokeRequest request = InvokeRequest.builder()        .functionName(functionName)        .payload(SdkBytes.fromUtf8String(jsonPayload))        .build();    InvokeResponse response = lambdaClient.invoke(request);    return response.payload().asUtf8String();}
```
```
public <T> T invokeLambdaAndParse(LambdaClient lambdaClient,                                  String functionName,                                  Object request,                                  Class<T> responseType) throws Exception {    ObjectMapper mapper = new ObjectMapper();    String jsonPayload = mapper.writeValueAsString(request);    InvokeRequest invokeRequest = InvokeRequest.builder()        .functionName(functionName)        .payload(SdkBytes.fromUtf8String(jsonPayload))        .build();    InvokeResponse response = lambdaClient.invoke(invokeRequest);    String responseJson = response.payload().asUtf8String();    return mapper.readValue(responseJson, responseType);}
```
```
public <T> T invokeLambdaAndParse(LambdaClient lambdaClient,                                  String functionName,                                  Object request,                                  Class<T> responseType) throws Exception {    ObjectMapper mapper = new ObjectMapper();    String jsonPayload = mapper.writeValueAsString(request);    InvokeRequest invokeRequest = InvokeRequest.builder()        .functionName(functionName)        .payload(SdkBytes.fromUtf8String(jsonPayload))        .build();    InvokeResponse response = lambdaClient.invoke(invokeRequest);    String responseJson = response.payload().asUtf8String();    return mapper.readValue(responseJson, responseType);}
```
```
public List<FunctionConfiguration> listFunctions(LambdaClient lambdaClient) {    ListFunctionsResponse response = lambdaClient.listFunctions();    return response.functions();}
```
```
public List<FunctionConfiguration> listFunctions(LambdaClient lambdaClient) {    ListFunctionsResponse response = lambdaClient.listFunctions();    return response.functions();}
```
```
public FunctionConfiguration getFunctionConfig(LambdaClient lambdaClient,                                                String functionName) {    GetFunctionRequest request = GetFunctionRequest.builder()        .functionName(functionName)        .build();    GetFunctionResponse response = lambdaClient.getFunction(request);    return response.configuration();}
```
```
public FunctionConfiguration getFunctionConfig(LambdaClient lambdaClient,                                                String functionName) {    GetFunctionRequest request = GetFunctionRequest.builder()        .functionName(functionName)        .build();    GetFunctionResponse response = lambdaClient.getFunction(request);    return response.configuration();}
```
```
import java.nio.file.Files;import java.nio.file.Paths;public void updateFunctionCode(LambdaClient lambdaClient,                               String functionName,                               String zipFilePath) throws IOException {    byte[] zipBytes = Files.readAllBytes(Paths.get(zipFilePath));    UpdateFunctionCodeRequest request = UpdateFunctionCodeRequest.builder()        .functionName(functionName)        .zipFile(SdkBytes.fromByteArray(zipBytes))        .publish(true)        .build();    UpdateFunctionCodeResponse response = lambdaClient.updateFunctionCode(request);    System.out.println("Updated function version: " + response.version());}
```
```
import java.nio.file.Files;import java.nio.file.Paths;public void updateFunctionCode(LambdaClient lambdaClient,                               String functionName,                               String zipFilePath) throws IOException {    byte[] zipBytes = Files.readAllBytes(Paths.get(zipFilePath));    UpdateFunctionCodeRequest request = UpdateFunctionCodeRequest.builder()        .functionName(functionName)        .zipFile(SdkBytes.fromByteArray(zipBytes))        .publish(true)        .build();    UpdateFunctionCodeResponse response = lambdaClient.updateFunctionCode(request);    System.out.println("Updated function version: " + response.version());}
```
```
public void updateFunctionConfiguration(LambdaClient lambdaClient,                                        String functionName,                                        Map<String, String> environment) {    Environment env = Environment.builder()        .variables(environment)        .build();    UpdateFunctionConfigurationRequest request = UpdateFunctionConfigurationRequest.builder()        .functionName(functionName)        .environment(env)        .timeout(60)        .memorySize(512)        .build();    lambdaClient.updateFunctionConfiguration(request);}
```
```
public void updateFunctionConfiguration(LambdaClient lambdaClient,                                        String functionName,                                        Map<String, String> environment) {    Environment env = Environment.builder()        .variables(environment)        .build();    UpdateFunctionConfigurationRequest request = UpdateFunctionConfigurationRequest.builder()        .functionName(functionName)        .environment(env)        .timeout(60)        .memorySize(512)        .build();    lambdaClient.updateFunctionConfiguration(request);}
```
```
public void createFunction(LambdaClient lambdaClient,                          String functionName,                          String roleArn,                          String handler,                          String zipFilePath) throws IOException {    byte[] zipBytes = Files.readAllBytes(Paths.get(zipFilePath));    FunctionCode code = FunctionCode.builder()        .zipFile(SdkBytes.fromByteArray(zipBytes))        .build();    CreateFunctionRequest request = CreateFunctionRequest.builder()        .functionName(functionName)        .runtime(Runtime.JAVA17)        .role(roleArn)        .handler(handler)        .code(code)        .timeout(60)        .memorySize(512)        .build();    CreateFunctionResponse response = lambdaClient.createFunction(request);    System.out.println("Function ARN: " + response.functionArn());}
```
```
public void createFunction(LambdaClient lambdaClient,                          String functionName,                          String roleArn,                          String handler,                          String zipFilePath) throws IOException {    byte[] zipBytes = Files.readAllBytes(Paths.get(zipFilePath));    FunctionCode code = FunctionCode.builder()        .zipFile(SdkBytes.fromByteArray(zipBytes))        .build();    CreateFunctionRequest request = CreateFunctionRequest.builder()        .functionName(functionName)        .runtime(Runtime.JAVA17)        .role(roleArn)        .handler(handler)        .code(code)        .timeout(60)        .memorySize(512)        .build();    CreateFunctionResponse response = lambdaClient.createFunction(request);    System.out.println("Function ARN: " + response.functionArn());}
```
```
public void deleteFunction(LambdaClient lambdaClient, String functionName) {    DeleteFunctionRequest request = DeleteFunctionRequest.builder()        .functionName(functionName)        .build();    lambdaClient.deleteFunction(request);}
```
```
public void deleteFunction(LambdaClient lambdaClient, String functionName) {    DeleteFunctionRequest request = DeleteFunctionRequest.builder()        .functionName(functionName)        .build();    lambdaClient.deleteFunction(request);}
```
```
import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class LambdaConfiguration {    @Bean    public LambdaClient lambdaClient() {        return LambdaClient.builder()            .region(Region.US_EAST_1)            .build();    }}
```
```
import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class LambdaConfiguration {    @Bean    public LambdaClient lambdaClient() {        return LambdaClient.builder()            .region(Region.US_EAST_1)            .build();    }}
```
```
import org.springframework.stereotype.Service;import org.springframework.beans.factory.annotation.Autowired;@Servicepublic class LambdaInvokerService {    private final LambdaClient lambdaClient;    private final ObjectMapper objectMapper;    @Autowired    public LambdaInvokerService(LambdaClient lambdaClient, ObjectMapper objectMapper) {        this.lambdaClient = lambdaClient;        this.objectMapper = objectMapper;    }    public <T, R> R invoke(String functionName, T request, Class<R> responseType) {        try {            String jsonPayload = objectMapper.writeValueAsString(request);            InvokeRequest invokeRequest = InvokeRequest.builder()                .functionName(functionName)                .payload(SdkBytes.fromUtf8String(jsonPayload))                .build();            InvokeResponse response = lambdaClient.invoke(invokeRequest);            if (response.functionError() != null) {                throw new LambdaInvocationException(                    "Lambda function error: " + response.functionError());            }            String responseJson = response.payload().asUtf8String();            return objectMapper.readValue(responseJson, responseType);        } catch (Exception e) {            throw new RuntimeException("Failed to invoke Lambda function", e);        }    }    public void invokeAsync(String functionName, Object request) {        try {            String jsonPayload = objectMapper.writeValueAsString(request);            InvokeRequest invokeRequest = InvokeRequest.builder()                .functionName(functionName)                .invocationType(InvocationType.EVENT)                .payload(SdkBytes.fromUtf8String(jsonPayload))                .build();            lambdaClient.invoke(invokeRequest);        } catch (Exception e) {            throw new RuntimeException("Failed to invoke Lambda function async", e);        }    }}
```
```
import org.springframework.stereotype.Service;import org.springframework.beans.factory.annotation.Autowired;@Servicepublic class LambdaInvokerService {    private final LambdaClient lambdaClient;    private final ObjectMapper objectMapper;    @Autowired    public LambdaInvokerService(LambdaClient lambdaClient, ObjectMapper objectMapper) {        this.lambdaClient = lambdaClient;        this.objectMapper = objectMapper;    }    public <T, R> R invoke(String functionName, T request, Class<R> responseType) {        try {            String jsonPayload = objectMapper.writeValueAsString(request);            InvokeRequest invokeRequest = InvokeRequest.builder()                .functionName(functionName)                .payload(SdkBytes.fromUtf8String(jsonPayload))                .build();            InvokeResponse response = lambdaClient.invoke(invokeRequest);            if (response.functionError() != null) {                throw new LambdaInvocationException(                    "Lambda function error: " + response.functionError());            }            String responseJson = response.payload().asUtf8String();            return objectMapper.readValue(responseJson, responseType);        } catch (Exception e) {            throw new RuntimeException("Failed to invoke Lambda function", e);        }    }    public void invokeAsync(String functionName, Object request) {        try {            String jsonPayload = objectMapper.writeValueAsString(request);            InvokeRequest invokeRequest = InvokeRequest.builder()                .functionName(functionName)                .invocationType(InvocationType.EVENT)                .payload(SdkBytes.fromUtf8String(jsonPayload))                .build();            lambdaClient.invoke(invokeRequest);        } catch (Exception e) {            throw new RuntimeException("Failed to invoke Lambda function async", e);        }    }}
```
```
public interface OrderProcessor {    OrderResponse processOrder(OrderRequest request);}@Servicepublic class LambdaOrderProcessor implements OrderProcessor {    private final LambdaInvokerService lambdaInvoker;    @Value("${lambda.order-processor.function-name}")    private String functionName;    public LambdaOrderProcessor(LambdaInvokerService lambdaInvoker) {        this.lambdaInvoker = lambdaInvoker;    }    @Override    public OrderResponse processOrder(OrderRequest request) {        return lambdaInvoker.invoke(functionName, request, OrderResponse.class);    }}
```
```
public interface OrderProcessor {    OrderResponse processOrder(OrderRequest request);}@Servicepublic class LambdaOrderProcessor implements OrderProcessor {    private final LambdaInvokerService lambdaInvoker;    @Value("${lambda.order-processor.function-name}")    private String functionName;    public LambdaOrderProcessor(LambdaInvokerService lambdaInvoker) {        this.lambdaInvoker = lambdaInvoker;    }    @Override    public OrderResponse processOrder(OrderRequest request) {        return lambdaInvoker.invoke(functionName, request, OrderResponse.class);    }}
```
```
public String invokeLambdaSafe(LambdaClient lambdaClient,                               String functionName,                               String payload) {    try {        InvokeRequest request = InvokeRequest.builder()            .functionName(functionName)            .payload(SdkBytes.fromUtf8String(payload))            .build();        InvokeResponse response = lambdaClient.invoke(request);        // Check for function error        if (response.functionError() != null) {            String errorMessage = response.payload().asUtf8String();            throw new RuntimeException("Lambda error: " + errorMessage);        }        // Check status code        if (response.statusCode() != 200) {            throw new RuntimeException("Lambda invocation failed with status: " +                response.statusCode());        }        return response.payload().asUtf8String();    } catch (LambdaException e) {        System.err.println("Lambda error: " + e.awsErrorDetails().errorMessage());        throw e;    }}public class LambdaInvocationException extends RuntimeException {    public LambdaInvocationException(String message) {        super(message);    }    public LambdaInvocationException(String message, Throwable cause) {        super(message, cause);    }}
```
```
public String invokeLambdaSafe(LambdaClient lambdaClient,                               String functionName,                               String payload) {    try {        InvokeRequest request = InvokeRequest.builder()            .functionName(functionName)            .payload(SdkBytes.fromUtf8String(payload))            .build();        InvokeResponse response = lambdaClient.invoke(request);        // Check for function error        if (response.functionError() != null) {            String errorMessage = response.payload().asUtf8String();            throw new RuntimeException("Lambda error: " + errorMessage);        }        // Check status code        if (response.statusCode() != 200) {            throw new RuntimeException("Lambda invocation failed with status: " +                response.statusCode());        }        return response.payload().asUtf8String();    } catch (LambdaException e) {        System.err.println("Lambda error: " + e.awsErrorDetails().errorMessage());        throw e;    }}public class LambdaInvocationException extends RuntimeException {    public LambdaInvocationException(String message) {        super(message);    }    public LambdaInvocationException(String message, Throwable cause) {        super(message, cause);    }}
```
```
import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.InjectMocks;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;@ExtendWith(MockitoExtension.class)class LambdaInvokerServiceTest {    @Mock    private LambdaClient lambdaClient;    @Mock    private ObjectMapper objectMapper;    @InjectMocks    private LambdaInvokerService service;    @Test    void shouldInvokeLambdaSuccessfully() throws Exception {        // Test implementation    }}
```
```
import org.junit.jupiter.api.Test;import org.junit.jupiter.api.extension.ExtendWith;import org.mockito.InjectMocks;import org.mockito.Mock;import org.mockito.junit.jupiter.MockitoExtension;@ExtendWith(MockitoExtension.class)class LambdaInvokerServiceTest {    @Mock    private LambdaClient lambdaClient;    @Mock    private ObjectMapper objectMapper;    @InjectMocks    private LambdaInvokerService service;    @Test    void shouldInvokeLambdaSuccessfully() throws Exception {        // Test implementation    }}
```
Unlock the full potential of serverless computing in your Java applications with this specialized agent skill for AWS Lambda and the AWS SDK for Java 2.x. Designed for developers aiming to build scalable, cost-effective, and highly available services, this skill streamlines interactions with AWS Lambda. From deploying new functions to fine-tuning existing configurations and integrating with robust frameworks like Spring Boot, it provides comprehensive guidance and patterns. Leverage the power of the latest Java SDK to create responsive, event-driven architectures without the overhead of server management.

# When to Use This Skill
- •Programmatically invoking other Lambda functions or external services from within a Java application.
- •Automating the deployment, update, or configuration management of AWS Lambda functions via CI/CD pipelines.
- •Building serverless microservices or event-driven architectures using Java 2.x and AWS Lambda.
- •Integrating Spring Boot applications with AWS Lambda for serverless deployment and execution.

# Pro Tips
- 💡Utilize the `LambdaAsyncClient` for non-blocking operations to improve application responsiveness and resource efficiency, especially in high-throughput scenarios.
- 💡Implement comprehensive error handling and retry mechanisms using AWS SDK's built-in features to ensure robust and resilient Lambda invocations.
- 💡Leverage Lambda layers for common dependencies (e.g., shared utility libraries) to reduce deployment package size and improve function cold start times.

