# langchain4j-ai-services-patterns
Source: https://antigravity.codes/agent-skills/ai-tools/langchain4j-ai-services-patterns

## AI Worker Instructions
When the user requests functionality related to langchain4j-ai-services-patterns, follow these guidelines and utilize this context.

## Scraped Content

# langchain4j-ai-services-patterns
```
interface Assistant {    String chat(String userMessage);}// Create instance - LangChain4j generates implementationAssistant assistant = AiServices.create(Assistant.class, chatModel);// Use the serviceString response = assistant.chat("Hello, how are you?");
```
```
interface Assistant {    String chat(String userMessage);}// Create instance - LangChain4j generates implementationAssistant assistant = AiServices.create(Assistant.class, chatModel);// Use the serviceString response = assistant.chat("Hello, how are you?");
```
```
interface CustomerSupportBot {    @SystemMessage("You are a helpful customer support agent for TechCorp")    String handleInquiry(String customerMessage);    @UserMessage("Analyze sentiment: {{it}}")    String analyzeSentiment(String feedback);}CustomerSupportBot bot = AiServices.create(CustomerSupportBot.class, chatModel);
```
```
interface CustomerSupportBot {    @SystemMessage("You are a helpful customer support agent for TechCorp")    String handleInquiry(String customerMessage);    @UserMessage("Analyze sentiment: {{it}}")    String analyzeSentiment(String feedback);}CustomerSupportBot bot = AiServices.create(CustomerSupportBot.class, chatModel);
```
```
interface MultiUserAssistant {    String chat(@MemoryId String userId, String userMessage);}Assistant assistant = AiServices.builder(MultiUserAssistant.class)    .chatModel(model)    .chatMemoryProvider(userId -> MessageWindowChatMemory.withMaxMessages(10))    .build();
```
```
interface MultiUserAssistant {    String chat(@MemoryId String userId, String userMessage);}Assistant assistant = AiServices.builder(MultiUserAssistant.class)    .chatModel(model)    .chatMemoryProvider(userId -> MessageWindowChatMemory.withMaxMessages(10))    .build();
```
```
class Calculator {    @Tool("Add two numbers") double add(double a, double b) { return a + b; }}interface MathGenius {    String ask(String question);}MathGenius mathGenius = AiServices.builder(MathGenius.class)    .chatModel(model)    .tools(new Calculator())    .build();
```
```
class Calculator {    @Tool("Add two numbers") double add(double a, double b) { return a + b; }}interface MathGenius {    String ask(String question);}MathGenius mathGenius = AiServices.builder(MathGenius.class)    .chatModel(model)    .tools(new Calculator())    .build();
```
```
<!-- Maven --><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j</artifactId>    <version>1.8.0</version></dependency><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-open-ai</artifactId>    <version>1.8.0</version></dependency>
```
```
<!-- Maven --><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j</artifactId>    <version>1.8.0</version></dependency><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-open-ai</artifactId>    <version>1.8.0</version></dependency>
```
```
// Gradleimplementation 'dev.langchain4j:langchain4j:1.8.0'implementation 'dev.langchain4j:langchain4j-open-ai:1.8.0'
```
```
// Gradleimplementation 'dev.langchain4j:langchain4j:1.8.0'implementation 'dev.langchain4j:langchain4j-open-ai:1.8.0'
```
Leverage the power of LangChain4j to transform complex AI integrations into elegant, maintainable Java codebases. This skill unpacks best practices for constructing AI services that are not only robust and scalable but also deeply integrated with modern application architectures. By adopting these declarative patterns, developers can significantly reduce boilerplate, enhance type safety, and accelerate the development of sophisticated AI-powered features, making it an indispensable resource for crafting next-generation intelligent applications. Unlock seamless interaction between your Java services and large language models.

# When to Use This Skill
- •Developing type-safe, declarative AI services in Java with minimal boilerplate.
- •Implementing advanced conversational AI systems including memory management.
- •Integrating external tools and functions into AI agents for enhanced capabilities.
- •Constructing RAG (Retrieval-Augmented Generation) applications that declaratively leverage external knowledge.

# Pro Tips
- 💡Design your AI service interfaces to be granular and focused on single responsibilities for better modularity and testability.
- 💡Prioritize robust error handling within your AI services, leveraging LangChain4j's capabilities to manage LLM interaction failures gracefully.
- 💡When integrating tools, ensure your tool definitions are precise and cover all necessary input parameters for reliable function calling.

