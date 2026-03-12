# langchain4j-testing-strategies
Source: https://antigravity.codes/agent-skills/testing/langchain4j-testing-strategies

## AI Worker Instructions
When the user requests functionality related to langchain4j-testing-strategies, follow these guidelines and utilize this context.

## Scraped Content

# langchain4j-testing-strategies
```
references/unit-testing.md
```
```
// Example: Mock ChatModel for unit testsChatModel mockModel = mock(ChatModel.class);when(mockModel.generate(any(String.class)))    .thenReturn(Response.from(AiMessage.from("Mocked response")));var service = AiServices.builder(AiService.class)        .chatModel(mockModel)        .build();
```
```
// Example: Mock ChatModel for unit testsChatModel mockModel = mock(ChatModel.class);when(mockModel.generate(any(String.class)))    .thenReturn(Response.from(AiMessage.from("Mocked response")));var service = AiServices.builder(AiService.class)        .chatModel(mockModel)        .build();
```
```
references/testing-dependencies.md
```
```
langchain4j-test
```
```
testcontainers
```
```
mockito
```
```
assertj
```
```
references/integration-testing.md
```
```
@Testcontainersclass OllamaIntegrationTest {    @Container    static GenericContainer<?> ollama = new GenericContainer<>(        DockerImageName.parse("ollama/ollama:latest")    ).withExposedPorts(11434);    @Test    void shouldGenerateResponse() {        ChatModel model = OllamaChatModel.builder()                .baseUrl(ollama.getEndpoint())                .build();        String response = model.generate("Test query");        assertNotNull(response);    }}
```
```
@Testcontainersclass OllamaIntegrationTest {    @Container    static GenericContainer<?> ollama = new GenericContainer<>(        DockerImageName.parse("ollama/ollama:latest")    ).withExposedPorts(11434);    @Test    void shouldGenerateResponse() {        ChatModel model = OllamaChatModel.builder()                .baseUrl(ollama.getEndpoint())                .build();        String response = model.generate("Test query");        assertNotNull(response);    }}
```
```
references/advanced-testing.md
```
```
references/workflow-patterns.md
```
```
@Testvoid shouldProcessQueryWithMock() {    ChatModel mockModel = mock(ChatModel.class);    when(mockModel.generate(any(String.class)))        .thenReturn(Response.from(AiMessage.from("Test response")));    var service = AiServices.builder(AiService.class)            .chatModel(mockModel)            .build();    String result = service.chat("What is Java?");    assertEquals("Test response", result);}
```
```
@Testvoid shouldProcessQueryWithMock() {    ChatModel mockModel = mock(ChatModel.class);    when(mockModel.generate(any(String.class)))        .thenReturn(Response.from(AiMessage.from("Test response")));    var service = AiServices.builder(AiService.class)            .chatModel(mockModel)            .build();    String result = service.chat("What is Java?");    assertEquals("Test response", result);}
```
```
@Testcontainersclass RAGIntegrationTest {    @Container    static GenericContainer<?> ollama = new GenericContainer<>(        DockerImageName.parse("ollama/ollama:latest")    );    @Test    void shouldCompleteRAGWorkflow() {        // Setup models and stores        var chatModel = OllamaChatModel.builder()                .baseUrl(ollama.getEndpoint())                .build();        var embeddingModel = OllamaEmbeddingModel.builder()                .baseUrl(ollama.getEndpoint())                .build();        var store = new InMemoryEmbeddingStore<>();        var retriever = EmbeddingStoreContentRetriever.builder()                .chatModel(chatModel)                .embeddingStore(store)                .embeddingModel(embeddingModel)                .build();        // Test complete workflow        var assistant = AiServices.builder(RagAssistant.class)                .chatLanguageModel(chatModel)                .contentRetriever(retriever)                .build();        String response = assistant.chat("What is Spring Boot?");        assertNotNull(response);        assertTrue(response.contains("Spring"));    }}
```
```
@Testcontainersclass RAGIntegrationTest {    @Container    static GenericContainer<?> ollama = new GenericContainer<>(        DockerImageName.parse("ollama/ollama:latest")    );    @Test    void shouldCompleteRAGWorkflow() {        // Setup models and stores        var chatModel = OllamaChatModel.builder()                .baseUrl(ollama.getEndpoint())                .build();        var embeddingModel = OllamaEmbeddingModel.builder()                .baseUrl(ollama.getEndpoint())                .build();        var store = new InMemoryEmbeddingStore<>();        var retriever = EmbeddingStoreContentRetriever.builder()                .chatModel(chatModel)                .embeddingStore(store)                .embeddingModel(embeddingModel)                .build();        // Test complete workflow        var assistant = AiServices.builder(RagAssistant.class)                .chatLanguageModel(chatModel)                .contentRetriever(retriever)                .build();        String response = assistant.chat("What is Spring Boot?");        assertNotNull(response);        assertTrue(response.contains("Spring"));    }}
```
```
@BeforeEach
```
```
@AfterEach
```
```
// For fast unit testsChatModel mockModel = mock(ChatModel.class);when(mockModel.generate(anyString())).thenReturn(Response.from(AiMessage.from("Mocked")));// For specific responseswhen(mockModel.generate(eq("Hello"))).thenReturn(Response.from(AiMessage.from("Hi")));when(mockModel.generate(contains("Java"))).thenReturn(Response.from(AiMessage.from("Java response")));
```
```
// For fast unit testsChatModel mockModel = mock(ChatModel.class);when(mockModel.generate(anyString())).thenReturn(Response.from(AiMessage.from("Mocked")));// For specific responseswhen(mockModel.generate(eq("Hello"))).thenReturn(Response.from(AiMessage.from("Hi")));when(mockModel.generate(contains("Java"))).thenReturn(Response.from(AiMessage.from("Java response")));
```
```
// Use test-specific profiles@TestPropertySource(properties = {    "langchain4j.ollama.base-url=http://localhost:11434"})class TestConfig {    // Test with isolated configuration}
```
```
// Use test-specific profiles@TestPropertySource(properties = {    "langchain4j.ollama.base-url=http://localhost:11434"})class TestConfig {    // Test with isolated configuration}
```
```
// Custom assertions for AI responsesassertThat(response).isNotNull().isNotEmpty();assertThat(response).containsAll(expectedKeywords);assertThat(response).doesNotContain("error");
```
```
// Custom assertions for AI responsesassertThat(response).isNotNull().isNotEmpty();assertThat(response).containsAll(expectedKeywords);assertThat(response).doesNotContain("error");
```
```
@Timeout
```
```
70% Unit Tests  ├─ Business logic validation  ├─ Guardrail testing  ├─ Mock tool execution  └─ Edge case handling20% Integration Tests  ├─ Testcontainers with Ollama  ├─ Vector store testing  ├─ RAG workflow validation  └─ Performance benchmarking10% End-to-End Tests  ├─ Complete user journeys  ├─ Real model interactions  └─ Performance under load
```
```
70% Unit Tests  ├─ Business logic validation  ├─ Guardrail testing  ├─ Mock tool execution  └─ Edge case handling20% Integration Tests  ├─ Testcontainers with Ollama  ├─ Vector store testing  ├─ RAG workflow validation  └─ Performance benchmarking10% End-to-End Tests  ├─ Complete user journeys  ├─ Real model interactions  └─ Performance under load
```
```
spring-boot-test-patterns
```
```
unit-test-service-layer
```
```
unit-test-boundary-conditions
```
Developing robust AI applications requires rigorous testing, a challenge amplified by the probabilistic nature of Large Language Models. This agent skill demystifies the process, offering comprehensive strategies for testing LangChain4J-powered systems. From mocking LLM responses for swift unit tests to orchestrating complex integration tests with real models and Testcontainers, it equips developers with the blueprints to build dependable AI features. Ensure your guardrails are effective, RAG systems retrieve accurately, and function calls execute flawlessly, establishing a foundation of trust in your AI deployments. This guide is essential for any developer committed to quality in the AI era.

# When to Use This Skill
- •Writing unit tests for AI services and guardrails in LangChain4J applications.
- •Setting up integration tests with real LLM models to validate end-to-end AI workflows.
- •Testing Retrieval-Augmented Generation (RAG) systems for accuracy and relevance.
- •Validating tool execution, function calling, and streaming responses in AI agents.

# Pro Tips
- 💡Combine mock models for rapid unit testing of business logic with Testcontainers for realistic, isolated integration testing of your full AI stack.
- 💡Prioritize testing guardrails and critical tool execution paths, as these are often where subtle failures can lead to significant issues.
- 💡Implement snapshot testing for LLM outputs in key flows to detect unexpected changes or regressions after model updates or prompt modifications.

