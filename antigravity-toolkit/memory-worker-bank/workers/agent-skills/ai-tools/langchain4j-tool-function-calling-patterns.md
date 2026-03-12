# langchain4j-tool-function-calling-patterns
Source: https://antigravity.codes/agent-skills/ai-tools/langchain4j-tool-function-calling-patterns

## AI Worker Instructions
When the user requests functionality related to langchain4j-tool-function-calling-patterns, follow these guidelines and utilize this context.

## Scraped Content

# langchain4j-tool-function-calling-patterns
```
// Define tools using @Tool annotationpublic class CalculatorTools {    @Tool("Add two numbers")    public double add(double a, double b) {        return a + b;    }}// Register with AiServices builderinterface MathAssistant {    String ask(String question);}MathAssistant assistant = AiServices.builder(MathAssistant.class)    .chatModel(chatModel)    .tools(new CalculatorTools())    .build();
```
```
// Define tools using @Tool annotationpublic class CalculatorTools {    @Tool("Add two numbers")    public double add(double a, double b) {        return a + b;    }}// Register with AiServices builderinterface MathAssistant {    String ask(String question);}MathAssistant assistant = AiServices.builder(MathAssistant.class)    .chatModel(chatModel)    .tools(new CalculatorTools())    .build();
```
```
AiServices.builder(AssistantInterface.class)    // Static tool registration    .tools(new Calculator(), new WeatherService())    // Dynamic tool provider    .toolProvider(new DynamicToolProvider())    // Concurrent execution    .executeToolsConcurrently()    // Error handling    .toolExecutionErrorHandler((request, exception) -> {        return "Error: " + exception.getMessage();    })    // Memory for context    .chatMemoryProvider(userId -> MessageWindowChatMemory.withMaxMessages(20))    .build();
```
```
AiServices.builder(AssistantInterface.class)    // Static tool registration    .tools(new Calculator(), new WeatherService())    // Dynamic tool provider    .toolProvider(new DynamicToolProvider())    // Concurrent execution    .executeToolsConcurrently()    // Error handling    .toolExecutionErrorHandler((request, exception) -> {        return "Error: " + exception.getMessage();    })    // Memory for context    .chatMemoryProvider(userId -> MessageWindowChatMemory.withMaxMessages(20))    .build();
```
```
@Tool
```
```
public class BasicTools {    @Tool("Add two numbers")    public int add(@P("first number") int a, @P("second number") int b) {        return a + b;    }    @Tool("Get greeting")    public String greet(@P("name to greet") String name) {        return "Hello, " + name + "!";    }}
```
```
public class BasicTools {    @Tool("Add two numbers")    public int add(@P("first number") int a, @P("second number") int b) {        return a + b;    }    @Tool("Get greeting")    public String greet(@P("name to greet") String name) {        return "Hello, " + name + "!";    }}
```
```
@P
```
```
public class WeatherService {    @Tool("Get current weather conditions")    public String getCurrentWeather(        @P("City name or coordinates") String location,        @P("Temperature unit (celsius, fahrenheit)", required = false) String unit) {        // Implementation with validation        if (location == null || location.trim().isEmpty()) {            return "Location is required";        }        return weatherClient.getCurrentWeather(location, unit);    }}
```
```
public class WeatherService {    @Tool("Get current weather conditions")    public String getCurrentWeather(        @P("City name or coordinates") String location,        @P("Temperature unit (celsius, fahrenheit)", required = false) String unit) {        // Implementation with validation        if (location == null || location.trim().isEmpty()) {            return "Location is required";        }        return weatherClient.getCurrentWeather(location, unit);    }}
```
```
public class OrderService {    @Description("Customer order information")    public record OrderRequest(        @Description("Customer ID") String customerId,        @Description("List of items") List<OrderItem> items,        @JsonProperty(required = false) @Description("Delivery instructions") String instructions    ) {}    @Tool("Create customer order")    public String createOrder(OrderRequest order) {        return orderService.processOrder(order);    }}
```
```
public class OrderService {    @Description("Customer order information")    public record OrderRequest(        @Description("Customer ID") String customerId,        @Description("List of items") List<OrderItem> items,        @JsonProperty(required = false) @Description("Delivery instructions") String instructions    ) {}    @Tool("Create customer order")    public String createOrder(OrderRequest order) {        return orderService.processOrder(order);    }}
```
```
@ToolMemoryId
```
```
public class PersonalizedTools {    @Tool("Get user preferences")    public String getPreferences(        @ToolMemoryId String userId,        @P("Preference category") String category) {        return preferenceService.getPreferences(userId, category);    }}
```
```
public class PersonalizedTools {    @Tool("Get user preferences")    public String getPreferences(        @ToolMemoryId String userId,        @P("Preference category") String category) {        return preferenceService.getPreferences(userId, category);    }}
```
```
public class ContextAwareToolProvider implements ToolProvider {    @Override    public ToolProviderResult provideTools(ToolProviderRequest request) {        String message = request.userMessage().singleText().toLowerCase();        var builder = ToolProviderResult.builder();        if (message.contains("weather")) {            builder.add(weatherToolSpec, weatherExecutor);        }        if (message.contains("calculate")) {            builder.add(calcToolSpec, calcExecutor);        }        return builder.build();    }}
```
```
public class ContextAwareToolProvider implements ToolProvider {    @Override    public ToolProviderResult provideTools(ToolProviderRequest request) {        String message = request.userMessage().singleText().toLowerCase();        var builder = ToolProviderResult.builder();        if (message.contains("weather")) {            builder.add(weatherToolSpec, weatherExecutor);        }        if (message.contains("calculate")) {            builder.add(calcToolSpec, calcExecutor);        }        return builder.build();    }}
```
```
public class QuickTools {    @Tool(value = "Get current time", returnBehavior = ReturnBehavior.IMMEDIATE)    public String getCurrentTime() {        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);    }}
```
```
public class QuickTools {    @Tool(value = "Get current time", returnBehavior = ReturnBehavior.IMMEDIATE)    public String getCurrentTime() {        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);    }}
```
```
AiServices.builder(Assistant.class)    .chatModel(chatModel)    .tools(new ExternalServiceTools())    .toolExecutionErrorHandler((request, exception) -> {        if (exception instanceof ApiException) {            return "Service temporarily unavailable: " + exception.getMessage();        }        return "An error occurred while processing your request";    })    .build();
```
```
AiServices.builder(Assistant.class)    .chatModel(chatModel)    .tools(new ExternalServiceTools())    .toolExecutionErrorHandler((request, exception) -> {        if (exception instanceof ApiException) {            return "Service temporarily unavailable: " + exception.getMessage();        }        return "An error occurred while processing your request";    })    .build();
```
```
public class ResilientService {    private final CircuitBreaker circuitBreaker = CircuitBreaker.ofDefaults("external-api");    @Tool("Get external data")    public String getExternalData(@P("Data identifier") String id) {        return circuitBreaker.executeSupplier(() -> {            return externalApi.getData(id);        });    }}
```
```
public class ResilientService {    private final CircuitBreaker circuitBreaker = CircuitBreaker.ofDefaults("external-api");    @Tool("Get external data")    public String getExternalData(@P("Data identifier") String id) {        return circuitBreaker.executeSupplier(() -> {            return externalApi.getData(id);        });    }}
```
```
@Servicepublic class MultiDomainToolService {    public String processRequest(String userId, String request, String domain) {        String contextualRequest = String.format("[Domain: %s] %s", domain, request);        Result<String> result = assistant.chat(userId, contextualRequest);        // Log tool usage        result.toolExecutions().forEach(execution ->            analyticsService.recordToolUsage(userId, domain, execution.request().name()));        return result.content();    }}
```
```
@Servicepublic class MultiDomainToolService {    public String processRequest(String userId, String request, String domain) {        String contextualRequest = String.format("[Domain: %s] %s", domain, request);        Result<String> result = assistant.chat(userId, contextualRequest);        // Log tool usage        result.toolExecutions().forEach(execution ->            analyticsService.recordToolUsage(userId, domain, execution.request().name()));        return result.content();    }}
```
```
interface StreamingAssistant {    TokenStream chat(String message);}StreamingAssistant assistant = AiServices.builder(StreamingAssistant.class)    .streamingChatModel(streamingChatModel)    .tools(new Tools())    .build();TokenStream stream = assistant.chat("What's the weather and calculate 15*8?");stream    .onToolExecuted(execution ->        System.out.println("Executed: " + execution.request().name()))    .onPartialResponse(System.out::print)    .onComplete(response -> System.out.println("Complete!"))    .start();
```
```
interface StreamingAssistant {    TokenStream chat(String message);}StreamingAssistant assistant = AiServices.builder(StreamingAssistant.class)    .streamingChatModel(streamingChatModel)    .tools(new Tools())    .build();TokenStream stream = assistant.chat("What's the weather and calculate 15*8?");stream    .onToolExecuted(execution ->        System.out.println("Executed: " + execution.request().name()))    .onPartialResponse(System.out::print)    .onComplete(response -> System.out.println("Complete!"))    .start();
```
```
executeToolsConcurrently()
```
```
.hallucinatedToolNameStrategy(request -> {    return ToolExecutionResultMessage.from(request,        "Error: Tool '" + request.name() + "' does not exist");})
```
```
.hallucinatedToolNameStrategy(request -> {    return ToolExecutionResultMessage.from(request,        "Error: Tool '" + request.name() + "' does not exist");})
```
```
.toolArgumentsErrorHandler((error, context) -> {    return ToolErrorHandlerResult.text("Invalid arguments: " + error.getMessage());})
```
```
.toolArgumentsErrorHandler((error, context) -> {    return ToolErrorHandlerResult.text("Invalid arguments: " + error.getMessage());})
```
```
.executeToolsConcurrently(Executors.newFixedThreadPool(5)).toolExecutionTimeout(Duration.ofSeconds(30))
```
```
.executeToolsConcurrently(Executors.newFixedThreadPool(5)).toolExecutionTimeout(Duration.ofSeconds(30))
```
```
langchain4j-ai-services-patterns
```
```
langchain4j-rag-implementation-patterns
```
```
langchain4j-spring-boot-integration
```
Unlocking the full potential of AI agents often requires them to do more than just generate text; they need to interact with the real world. This skill illuminates how LangChain4j empowers your AI applications to seamlessly connect with external tools, APIs, and services. By defining clear function calling patterns, you enable agents to perform actions, fetch real-time data, and integrate with existing business logic. This capability transforms static LLMs into dynamic, problem-solving entities, greatly expanding the scope and utility of your AI solutions. It’s a cornerstone for building truly intelligent and interactive agentic systems.

# When to Use This Skill
- •Building an AI assistant that can book appointments by interacting with a calendar API.
- •Creating an AI application capable of querying and updating a database based on user commands.
- •Implementing an AI agent that can retrieve real-time stock prices or weather forecasts.
- •Developing multi-agent systems where specialized agents utilize distinct tools to achieve complex goals.

# Pro Tips
- 💡Design tools with clear, concise descriptions and parameters. This greatly improves the LLM's ability to understand when and how to invoke them correctly, reducing hallucination.
- 💡Implement robust error handling within your tool functions. Agents will inevitably encounter API failures or unexpected responses, and graceful degradation is crucial for production systems.
- 💡Consider security implications when exposing tools to an AI agent. Ensure tools have the minimum necessary permissions and validate all inputs rigorously before execution to prevent malicious actions.

