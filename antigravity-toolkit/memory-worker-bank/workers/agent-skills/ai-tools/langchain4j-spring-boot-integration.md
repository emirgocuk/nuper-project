# langchain4j-spring-boot-integration
Source: https://antigravity.codes/agent-skills/ai-tools/langchain4j-spring-boot-integration

## AI Worker Instructions
When the user requests functionality related to langchain4j-spring-boot-integration, follow these guidelines and utilize this context.

## Scraped Content

# langchain4j-spring-boot-integration
```
<!-- Core LangChain4j --><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-spring-boot-starter</artifactId>    <version>1.8.0</version> // Use latest version</dependency><!-- OpenAI Integration --><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>    <version>1.8.0</version></dependency>
```
```
<!-- Core LangChain4j --><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-spring-boot-starter</artifactId>    <version>1.8.0</version> // Use latest version</dependency><!-- OpenAI Integration --><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>    <version>1.8.0</version></dependency>
```
```
# application.propertieslangchain4j.open-ai.chat-model.api-key=${OPENAI_API_KEY}langchain4j.open-ai.chat-model.model-name=gpt-4o-minilangchain4j.open-ai.chat-model.temperature=0.7
```
```
# application.propertieslangchain4j.open-ai.chat-model.api-key=${OPENAI_API_KEY}langchain4j.open-ai.chat-model.model-name=gpt-4o-minilangchain4j.open-ai.chat-model.temperature=0.7
```
```
@AiServiceinterface CustomerSupportAssistant {    @SystemMessage("You are a helpful customer support agent for TechCorp.")    String handleInquiry(String customerMessage);}
```
```
@AiServiceinterface CustomerSupportAssistant {    @SystemMessage("You are a helpful customer support agent for TechCorp.")    String handleInquiry(String customerMessage);}
```
This skill provides a comprehensive guide for integrating LangChain4j into Spring Boot applications, streamlining the development of AI-powered microservices. It covers essential patterns from auto-configuration and dependency injection to building declarative AI services and robust RAG systems. Developers can leverage the familiarity of Spring Boot combined with LangChain4j’s capabilities to create scalable and observable AI components. This guide is tailored for those looking to embed advanced AI functionalities seamlessly within their existing Java ecosystems, ensuring efficient setup and production-readiness for intelligent applications.

# When to Use This Skill
- •Integrating LangChain4j into existing Spring Boot applications for adding AI functionalities.
- •Building new AI-powered microservices that leverage Spring Boot's robust architecture.
- •Setting up declarative AI Services and auto-configuring various AI models (e.g., OpenAI, Ollama) within a Spring environment.
- •Implementing Retrieval-Augmented Generation (RAG) systems with Spring Boot for enhanced data grounding.

# Pro Tips
- 💡Leverage Spring's `@ConfigurationProperties` to centralize and externalize all LangChain4j related configurations, including API keys and model specifics, for easier management and environment adaptation.
- 💡Combine declarative AI services with Spring AOP for cross-cutting concerns like logging, performance monitoring, and error handling specific to AI interactions, ensuring robust observability.
- 💡Utilize Spring's extensive testing framework to create integration tests for your AI services, mocking external LLM calls or using test doubles to ensure reliability and efficient development cycles.

