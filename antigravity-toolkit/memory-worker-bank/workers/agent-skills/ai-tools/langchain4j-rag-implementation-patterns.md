# langchain4j-rag-implementation-patterns
Source: https://antigravity.codes/agent-skills/ai-tools/langchain4j-rag-implementation-patterns

## AI Worker Instructions
When the user requests functionality related to langchain4j-rag-implementation-patterns, follow these guidelines and utilize this context.

## Scraped Content

# langchain4j-rag-implementation-patterns
```
<dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-spring-boot-starter</artifactId>    <version>1.8.0</version></dependency><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-open-ai</artifactId>    <version>1.8.0</version></dependency>
```
```
<dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-spring-boot-starter</artifactId>    <version>1.8.0</version></dependency><dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-open-ai</artifactId>    <version>1.8.0</version></dependency>
```
```
@Configurationpublic class RAGConfiguration {    @Bean    public EmbeddingModel embeddingModel() {        return OpenAiEmbeddingModel.builder()            .apiKey(System.getenv("OPENAI_API_KEY"))            .modelName("text-embedding-3-small")            .build();    }    @Bean    public EmbeddingStore<TextSegment> embeddingStore() {        return new InMemoryEmbeddingStore<>();    }}
```
```
@Configurationpublic class RAGConfiguration {    @Bean    public EmbeddingModel embeddingModel() {        return OpenAiEmbeddingModel.builder()            .apiKey(System.getenv("OPENAI_API_KEY"))            .modelName("text-embedding-3-small")            .build();    }    @Bean    public EmbeddingStore<TextSegment> embeddingStore() {        return new InMemoryEmbeddingStore<>();    }}
```
```
@Service@RequiredArgsConstructorpublic class DocumentIngestionService {    private final EmbeddingModel embeddingModel;    private final EmbeddingStore<TextSegment> embeddingStore;    public void ingestDocument(String filePath, Map<String, Object> metadata) {        Document document = FileSystemDocumentLoader.loadDocument(filePath);        document.metadata().putAll(metadata);        DocumentSplitter splitter = DocumentSplitters.recursive(            500, 50, new OpenAiTokenCountEstimator("text-embedding-3-small")        );        List<TextSegment> segments = splitter.split(document);        List<Embedding> embeddings = embeddingModel.embedAll(segments).content();        embeddingStore.addAll(embeddings, segments);    }}
```
```
@Service@RequiredArgsConstructorpublic class DocumentIngestionService {    private final EmbeddingModel embeddingModel;    private final EmbeddingStore<TextSegment> embeddingStore;    public void ingestDocument(String filePath, Map<String, Object> metadata) {        Document document = FileSystemDocumentLoader.loadDocument(filePath);        document.metadata().putAll(metadata);        DocumentSplitter splitter = DocumentSplitters.recursive(            500, 50, new OpenAiTokenCountEstimator("text-embedding-3-small")        );        List<TextSegment> segments = splitter.split(document);        List<Embedding> embeddings = embeddingModel.embedAll(segments).content();        embeddingStore.addAll(embeddings, segments);    }}
```
```
@Configurationpublic class ContentRetrieverConfiguration {    @Bean    public ContentRetriever contentRetriever(            EmbeddingStore<TextSegment> embeddingStore,            EmbeddingModel embeddingModel) {        return EmbeddingStoreContentRetriever.builder()            .embeddingStore(embeddingStore)            .embeddingModel(embeddingModel)            .maxResults(5)            .minScore(0.7)            .build();    }}
```
```
@Configurationpublic class ContentRetrieverConfiguration {    @Bean    public ContentRetriever contentRetriever(            EmbeddingStore<TextSegment> embeddingStore,            EmbeddingModel embeddingModel) {        return EmbeddingStoreContentRetriever.builder()            .embeddingStore(embeddingStore)            .embeddingModel(embeddingModel)            .maxResults(5)            .minScore(0.7)            .build();    }}
```
```
interface KnowledgeAssistant {    @SystemMessage("""        You are a knowledgeable assistant with access to a comprehensive knowledge base.        When answering questions:        1. Use the provided context from the knowledge base        2. If information is not in the context, clearly state this        3. Provide accurate, helpful responses        4. When possible, reference specific sources        5. If the context is insufficient, ask for clarification        """)    String answerQuestion(String question);}@Service@RequiredArgsConstructorpublic class KnowledgeService {    private final KnowledgeAssistant assistant;    public KnowledgeService(ChatModel chatModel, ContentRetriever contentRetriever) {        this.assistant = AiServices.builder(KnowledgeAssistant.class)            .chatModel(chatModel)            .contentRetriever(contentRetriever)            .build();    }    public String answerQuestion(String question) {        return assistant.answerQuestion(question);    }}
```
```
interface KnowledgeAssistant {    @SystemMessage("""        You are a knowledgeable assistant with access to a comprehensive knowledge base.        When answering questions:        1. Use the provided context from the knowledge base        2. If information is not in the context, clearly state this        3. Provide accurate, helpful responses        4. When possible, reference specific sources        5. If the context is insufficient, ask for clarification        """)    String answerQuestion(String question);}@Service@RequiredArgsConstructorpublic class KnowledgeService {    private final KnowledgeAssistant assistant;    public KnowledgeService(ChatModel chatModel, ContentRetriever contentRetriever) {        this.assistant = AiServices.builder(KnowledgeAssistant.class)            .chatModel(chatModel)            .contentRetriever(contentRetriever)            .build();    }    public String answerQuestion(String question) {        return assistant.answerQuestion(question);    }}
```
```
public class BasicRAGExample {    public static void main(String[] args) {        var embeddingStore = new InMemoryEmbeddingStore<TextSegment>();        var embeddingModel = OpenAiEmbeddingModel.builder()            .apiKey(System.getenv("OPENAI_API_KEY"))            .modelName("text-embedding-3-small")            .build();        var ingestor = EmbeddingStoreIngestor.builder()            .embeddingModel(embeddingModel)            .embeddingStore(embeddingStore)            .build();        ingestor.ingest(Document.from("Spring Boot is a framework for building Java applications with minimal configuration."));        var retriever = EmbeddingStoreContentRetriever.builder()            .embeddingStore(embeddingStore)            .embeddingModel(embeddingModel)            .build();    }}
```
```
public class BasicRAGExample {    public static void main(String[] args) {        var embeddingStore = new InMemoryEmbeddingStore<TextSegment>();        var embeddingModel = OpenAiEmbeddingModel.builder()            .apiKey(System.getenv("OPENAI_API_KEY"))            .modelName("text-embedding-3-small")            .build();        var ingestor = EmbeddingStoreIngestor.builder()            .embeddingModel(embeddingModel)            .embeddingStore(embeddingStore)            .build();        ingestor.ingest(Document.from("Spring Boot is a framework for building Java applications with minimal configuration."));        var retriever = EmbeddingStoreContentRetriever.builder()            .embeddingStore(embeddingStore)            .embeddingModel(embeddingModel)            .build();    }}
```
```
interface MultiDomainAssistant {    @SystemMessage("""        You are an expert assistant with access to multiple knowledge domains:        - Technical documentation        - Company policies        - Product information        - Customer support guides        Tailor your response based on the type of question and available context.        Always indicate which domain the information comes from.        """)    String answerQuestion(@MemoryId String userId, String question);}
```
```
interface MultiDomainAssistant {    @SystemMessage("""        You are an expert assistant with access to multiple knowledge domains:        - Technical documentation        - Company policies        - Product information        - Customer support guides        Tailor your response based on the type of question and available context.        Always indicate which domain the information comes from.        """)    String answerQuestion(@MemoryId String userId, String question);}
```
```
@Service@RequiredArgsConstructorpublic class HierarchicalRAGService {    private final EmbeddingStore<TextSegment> chunkStore;    private final EmbeddingStore<TextSegment> summaryStore;    private final EmbeddingModel embeddingModel;    public String performHierarchicalRetrieval(String query) {        List<EmbeddingMatch<TextSegment>> summaryMatches = searchSummaries(query);        List<TextSegment> relevantChunks = new ArrayList<>();        for (EmbeddingMatch<TextSegment> summaryMatch : summaryMatches) {            String documentId = summaryMatch.embedded().metadata().getString("documentId");            List<EmbeddingMatch<TextSegment>> chunkMatches = searchChunksInDocument(query, documentId);            chunkMatches.stream()                .map(EmbeddingMatch::embedded)                .forEach(relevantChunks::add);        }        return generateResponseWithChunks(query, relevantChunks);    }}
```
```
@Service@RequiredArgsConstructorpublic class HierarchicalRAGService {    private final EmbeddingStore<TextSegment> chunkStore;    private final EmbeddingStore<TextSegment> summaryStore;    private final EmbeddingModel embeddingModel;    public String performHierarchicalRetrieval(String query) {        List<EmbeddingMatch<TextSegment>> summaryMatches = searchSummaries(query);        List<TextSegment> relevantChunks = new ArrayList<>();        for (EmbeddingMatch<TextSegment> summaryMatch : summaryMatches) {            String documentId = summaryMatch.embedded().metadata().getString("documentId");            List<EmbeddingMatch<TextSegment>> chunkMatches = searchChunksInDocument(query, documentId);            chunkMatches.stream()                .map(EmbeddingMatch::embedded)                .forEach(relevantChunks::add);        }        return generateResponseWithChunks(query, relevantChunks);    }}
```
```
@RequiredArgsConstructor@Servicepublic class SimpleRAGPipeline {    private final EmbeddingModel embeddingModel;    private final EmbeddingStore<TextSegment> embeddingStore;    private final ChatModel chatModel;    public String answerQuestion(String question) {        Embedding queryEmbedding = embeddingModel.embed(question).content();        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()            .queryEmbedding(queryEmbedding)            .maxResults(3)            .build();        List<TextSegment> segments = embeddingStore.search(request).matches().stream()            .map(EmbeddingMatch::embedded)            .collect(Collectors.toList());        String context = segments.stream()            .map(TextSegment::text)            .collect(Collectors.joining("\n\n"));        return chatModel.generate(context + "\n\nQuestion: " + question + "\nAnswer:");    }}
```
```
@RequiredArgsConstructor@Servicepublic class SimpleRAGPipeline {    private final EmbeddingModel embeddingModel;    private final EmbeddingStore<TextSegment> embeddingStore;    private final ChatModel chatModel;    public String answerQuestion(String question) {        Embedding queryEmbedding = embeddingModel.embed(question).content();        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()            .queryEmbedding(queryEmbedding)            .maxResults(3)            .build();        List<TextSegment> segments = embeddingStore.search(request).matches().stream()            .map(EmbeddingMatch::embedded)            .collect(Collectors.toList());        String context = segments.stream()            .map(TextSegment::text)            .collect(Collectors.joining("\n\n"));        return chatModel.generate(context + "\n\nQuestion: " + question + "\nAnswer:");    }}
```
```
@Service@RequiredArgsConstructorpublic class HybridSearchService {    private final EmbeddingStore<TextSegment> vectorStore;    private final FullTextSearchEngine keywordEngine;    private final EmbeddingModel embeddingModel;    public List<Content> hybridSearch(String query, int maxResults) {        // Vector search        List<Content> vectorResults = performVectorSearch(query, maxResults);        // Keyword search        List<Content> keywordResults = performKeywordSearch(query, maxResults);        // Combine and re-rank using RRF algorithm        return combineResults(vectorResults, keywordResults, maxResults);    }}
```
```
@Service@RequiredArgsConstructorpublic class HybridSearchService {    private final EmbeddingStore<TextSegment> vectorStore;    private final FullTextSearchEngine keywordEngine;    private final EmbeddingModel embeddingModel;    public List<Content> hybridSearch(String query, int maxResults) {        // Vector search        List<Content> vectorResults = performVectorSearch(query, maxResults);        // Keyword search        List<Content> keywordResults = performKeywordSearch(query, maxResults);        // Combine and re-rank using RRF algorithm        return combineResults(vectorResults, keywordResults, maxResults);    }}
```
This LangChain4j RAG Agent Skill empowers developers to build sophisticated AI applications that move beyond static knowledge. By integrating external data sources, your AI agents can access, understand, and synthesize real-time or domain-specific information, significantly reducing hallucinations and enhancing response accuracy. It provides the architectural blueprints and practical steps necessary to construct robust RAG systems, ensuring your AI can answer complex queries by retrieving relevant context. Leverage this skill to transform your AI projects into intelligent systems capable of dynamic information retrieval and generation, making them invaluable for critical business operations and advanced user interactions.

# When to Use This Skill
- •Building knowledge-based AI applications requiring external document access.
- •Implementing question-answering systems over large document collections.
- •Creating AI assistants with access to company knowledge bases.
- •Building semantic search capabilities for document repositories.

# Pro Tips
- 💡Optimize chunking strategies based on document structure and query patterns to maximize retrieval relevance for RAG.
- 💡Combine vector search with keyword search (hybrid search) for improved recall, especially with specific entity lookups.
- 💡Regularly evaluate your RAG system's performance using metrics like faithfulness and groundedness to fine-tune retrieval and generation components.

