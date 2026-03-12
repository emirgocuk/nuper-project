# langchain4j-vector-stores-configuration
Source: https://antigravity.codes/agent-skills/ai-tools/langchain4j-vector-stores-configuration

## AI Worker Instructions
When the user requests functionality related to langchain4j-vector-stores-configuration, follow these guidelines and utilize this context.

## Scraped Content

# langchain4j-vector-stores-configuration
```
@Beanpublic EmbeddingStore<TextSegment> embeddingStore() {    return PgVectorEmbeddingStore.builder()        .host("localhost")        .port(5432)        .database("vectordb")        .user("username")        .password("password")        .table("embeddings")        .dimension(1536) // OpenAI embedding dimension        .createTable(true)        .useIndex(true)        .build();}
```
```
@Beanpublic EmbeddingStore<TextSegment> embeddingStore() {    return PgVectorEmbeddingStore.builder()        .host("localhost")        .port(5432)        .database("vectordb")        .user("username")        .password("password")        .table("embeddings")        .dimension(1536) // OpenAI embedding dimension        .createTable(true)        .useIndex(true)        .build();}
```
```
@Configurationpublic class MultiVectorStoreConfiguration {    @Bean    @Qualifier("documentsStore")    public EmbeddingStore<TextSegment> documentsEmbeddingStore() {        return PgVectorEmbeddingStore.builder()            .table("document_embeddings")            .dimension(1536)            .build();    }    @Bean    @Qualifier("chatHistoryStore")    public EmbeddingStore<TextSegment> chatHistoryEmbeddingStore() {        return MongoDbEmbeddingStore.builder()            .collectionName("chat_embeddings")            .build();    }}
```
```
@Configurationpublic class MultiVectorStoreConfiguration {    @Bean    @Qualifier("documentsStore")    public EmbeddingStore<TextSegment> documentsEmbeddingStore() {        return PgVectorEmbeddingStore.builder()            .table("document_embeddings")            .dimension(1536)            .build();    }    @Bean    @Qualifier("chatHistoryStore")    public EmbeddingStore<TextSegment> chatHistoryEmbeddingStore() {        return MongoDbEmbeddingStore.builder()            .collectionName("chat_embeddings")            .build();    }}
```
```
@Beanpublic EmbeddingStoreIngestor embeddingStoreIngestor(        EmbeddingStore<TextSegment> embeddingStore,        EmbeddingModel embeddingModel) {    return EmbeddingStoreIngestor.builder()        .documentSplitter(DocumentSplitters.recursive(            300,  // maxSegmentSizeInTokens            20,   // maxOverlapSizeInTokens            new OpenAiTokenizer(GPT_3_5_TURBO)        ))        .embeddingModel(embeddingModel)        .embeddingStore(embeddingStore)        .build();}
```
```
@Beanpublic EmbeddingStoreIngestor embeddingStoreIngestor(        EmbeddingStore<TextSegment> embeddingStore,        EmbeddingModel embeddingModel) {    return EmbeddingStoreIngestor.builder()        .documentSplitter(DocumentSplitters.recursive(            300,  // maxSegmentSizeInTokens            20,   // maxOverlapSizeInTokens            new OpenAiTokenizer(GPT_3_5_TURBO)        ))        .embeddingModel(embeddingModel)        .embeddingStore(embeddingStore)        .build();}
```
```
// MongoDB with metadata field mappingIndexMapping indexMapping = IndexMapping.builder()    .dimension(1536)    .metadataFieldNames(Set.of("category", "source", "created_date", "author"))    .build();// Search with metadata filtersEmbeddingSearchRequest request = EmbeddingSearchRequest.builder()    .queryEmbedding(queryEmbedding)    .maxResults(10)    .filter(and(        metadataKey("category").isEqualTo("technical_docs"),        metadataKey("created_date").isGreaterThan(LocalDate.now().minusMonths(6))    ))    .build();
```
```
// MongoDB with metadata field mappingIndexMapping indexMapping = IndexMapping.builder()    .dimension(1536)    .metadataFieldNames(Set.of("category", "source", "created_date", "author"))    .build();// Search with metadata filtersEmbeddingSearchRequest request = EmbeddingSearchRequest.builder()    .queryEmbedding(queryEmbedding)    .maxResults(10)    .filter(and(        metadataKey("category").isEqualTo("technical_docs"),        metadataKey("created_date").isGreaterThan(LocalDate.now().minusMonths(6))    ))    .build();
```
```
@Beanpublic EmbeddingStore<TextSegment> optimizedPgVectorStore() {    HikariConfig hikariConfig = new HikariConfig();    hikariConfig.setJdbcUrl("jdbc:postgresql://localhost:5432/vectordb");    hikariConfig.setUsername("username");    hikariConfig.setPassword("password");    hikariConfig.setMaximumPoolSize(20);    hikariConfig.setMinimumIdle(5);    hikariConfig.setConnectionTimeout(30000);    DataSource dataSource = new HikariDataSource(hikariConfig);    return PgVectorEmbeddingStore.builder()        .dataSource(dataSource)        .table("embeddings")        .dimension(1536)        .useIndex(true)        .build();}
```
```
@Beanpublic EmbeddingStore<TextSegment> optimizedPgVectorStore() {    HikariConfig hikariConfig = new HikariConfig();    hikariConfig.setJdbcUrl("jdbc:postgresql://localhost:5432/vectordb");    hikariConfig.setUsername("username");    hikariConfig.setPassword("password");    hikariConfig.setMaximumPoolSize(20);    hikariConfig.setMinimumIdle(5);    hikariConfig.setConnectionTimeout(30000);    DataSource dataSource = new HikariDataSource(hikariConfig);    return PgVectorEmbeddingStore.builder()        .dataSource(dataSource)        .table("embeddings")        .dimension(1536)        .useIndex(true)        .build();}
```
```
@Componentpublic class VectorStoreHealthIndicator implements HealthIndicator {    private final EmbeddingStore<TextSegment> embeddingStore;    @Override    public Health health() {        try {            embeddingStore.search(EmbeddingSearchRequest.builder()                .queryEmbedding(new Embedding(Collections.nCopies(1536, 0.0f)))                .maxResults(1)                .build());            return Health.up()                .withDetail("store", embeddingStore.getClass().getSimpleName())                .build();        } catch (Exception e) {            return Health.down()                .withDetail("error", e.getMessage())                .build();        }    }}
```
```
@Componentpublic class VectorStoreHealthIndicator implements HealthIndicator {    private final EmbeddingStore<TextSegment> embeddingStore;    @Override    public Health health() {        try {            embeddingStore.search(EmbeddingSearchRequest.builder()                .queryEmbedding(new Embedding(Collections.nCopies(1536, 0.0f)))                .maxResults(1)                .build());            return Health.up()                .withDetail("store", embeddingStore.getClass().getSimpleName())                .build();        } catch (Exception e) {            return Health.down()                .withDetail("error", e.getMessage())                .build();        }    }}
```
```
@Configurationpublic class SimpleRagConfig {    @Bean    public EmbeddingStore<TextSegment> embeddingStore() {        return PgVectorEmbeddingStore.builder()            .host("localhost")            .database("rag_db")            .table("documents")            .dimension(1536)            .build();    }    @Bean    public ChatLanguageModel chatModel() {        return OpenAiChatModel.withApiKey(System.getenv("OPENAI_API_KEY"));    }}
```
```
@Configurationpublic class SimpleRagConfig {    @Bean    public EmbeddingStore<TextSegment> embeddingStore() {        return PgVectorEmbeddingStore.builder()            .host("localhost")            .database("rag_db")            .table("documents")            .dimension(1536)            .build();    }    @Bean    public ChatLanguageModel chatModel() {        return OpenAiChatModel.withApiKey(System.getenv("OPENAI_API_KEY"));    }}
```
```
@Servicepublic class SemanticSearchService {    private final EmbeddingStore<TextSegment> store;    private final EmbeddingModel embeddingModel;    public List<String> search(String query, int maxResults) {        Embedding queryEmbedding = embeddingModel.embed(query).content();        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()            .queryEmbedding(queryEmbedding)            .maxResults(maxResults)            .minScore(0.75)            .build();        return store.search(request).matches().stream()            .map(match -> match.embedded().text())            .toList();    }}
```
```
@Servicepublic class SemanticSearchService {    private final EmbeddingStore<TextSegment> store;    private final EmbeddingModel embeddingModel;    public List<String> search(String query, int maxResults) {        Embedding queryEmbedding = embeddingModel.embed(query).content();        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()            .queryEmbedding(queryEmbedding)            .maxResults(maxResults)            .minScore(0.75)            .build();        return store.search(request).matches().stream()            .map(match -> match.embedded().text())            .toList();    }}
```
```
@Configurationpublic class ProductionVectorStoreConfig {    @Bean    public EmbeddingStore<TextSegment> vectorStore(            @Value("${vector.store.host}") String host,            MeterRegistry meterRegistry) {        EmbeddingStore<TextSegment> store = PgVectorEmbeddingStore.builder()            .host(host)            .database("production_vectors")            .useIndex(true)            .indexListSize(200)            .build();        return new MonitoredEmbeddingStore<>(store, meterRegistry);    }}
```
```
@Configurationpublic class ProductionVectorStoreConfig {    @Bean    public EmbeddingStore<TextSegment> vectorStore(            @Value("${vector.store.host}") String host,            MeterRegistry meterRegistry) {        EmbeddingStore<TextSegment> store = PgVectorEmbeddingStore.builder()            .host(host)            .database("production_vectors")            .useIndex(true)            .indexListSize(200)            .build();        return new MonitoredEmbeddingStore<>(store, meterRegistry);    }}
```
```
InMemoryEmbeddingStore
```
```
// For high recall requirements.indexType(IndexType.FLAT)  // Exact search, slower but accurate// For balanced performance.indexType(IndexType.IVF_FLAT)  // Good balance of speed and accuracy// For high-speed approximate search.indexType(IndexType.HNSW)  // Fastest, slightly less accurate
```
```
// For high recall requirements.indexType(IndexType.FLAT)  // Exact search, slower but accurate// For balanced performance.indexType(IndexType.IVF_FLAT)  // Good balance of speed and accuracy// For high-speed approximate search.indexType(IndexType.HNSW)  // Fastest, slightly less accurate
```
```
// OpenAI text-embedding-3-small.dimension(1536)// OpenAI text-embedding-3-large.dimension(3072)// Sentence Transformers.dimension(384)  // all-MiniLM-L6-v2.dimension(768)  // all-mpnet-base-v2
```
```
// OpenAI text-embedding-3-small.dimension(1536)// OpenAI text-embedding-3-large.dimension(3072)// Sentence Transformers.dimension(384)  // all-MiniLM-L6-v2.dimension(768)  // all-mpnet-base-v2
```
```
@Servicepublic class BatchEmbeddingService {    private static final int BATCH_SIZE = 100;    public void addDocumentsBatch(List<Document> documents) {        for (List<Document> batch : Lists.partition(documents, BATCH_SIZE)) {            List<TextSegment> segments = batch.stream()                .map(doc -> TextSegment.from(doc.text(), doc.metadata()))                .collect(Collectors.toList());            List<Embedding> embeddings = embeddingModel.embedAll(segments)                .content();            embeddingStore.addAll(embeddings, segments);        }    }}
```
```
@Servicepublic class BatchEmbeddingService {    private static final int BATCH_SIZE = 100;    public void addDocumentsBatch(List<Document> documents) {        for (List<Document> batch : Lists.partition(documents, BATCH_SIZE)) {            List<TextSegment> segments = batch.stream()                .map(doc -> TextSegment.from(doc.text(), doc.metadata()))                .collect(Collectors.toList());            List<Embedding> embeddings = embeddingModel.embedAll(segments)                .content();            embeddingStore.addAll(embeddings, segments);        }    }}
```
```
// Use environment variables@Value("${vector.store.api.key:#{null}}")private String apiKey;// Validate configuration@PostConstructpublic void validateConfiguration() {    if (StringUtils.isBlank(apiKey)) {        throw new IllegalStateException("Vector store API key must be configured");    }}
```
```
// Use environment variables@Value("${vector.store.api.key:#{null}}")private String apiKey;// Validate configuration@PostConstructpublic void validateConfiguration() {    if (StringUtils.isBlank(apiKey)) {        throw new IllegalStateException("Vector store API key must be configured");    }}
```
Unlock the power of Retrieval-Augmented Generation (RAG) with this expert Agent Skill for LangChain4J vector store configuration. Designed for developers building sophisticated AI applications, it streamlines the process of integrating and managing embedding stores. Whether you're setting up a new semantic search engine, connecting to diverse vector databases like Pinecone or PgVector, or optimizing existing RAG workflows, this skill provides precise, actionable guidance. It’s an essential tool for enhancing your coding assistant's ability to create context-rich, data-driven AI solutions, ensuring efficient and scalable information retrieval for your projects.

# When to Use This Skill
- •Developing a RAG-powered chatbot that retrieves context from a custom knowledge base stored in a vector database.
- •Implementing a Java application requiring advanced semantic search capabilities to find relevant documents or data points.
- •Integrating various vector database providers (e.g., PostgreSQL/pgvector, Pinecone, MongoDB Atlas) into a unified AI application.
- •Optimizing the performance and scalability of embedding storage and retrieval systems for high-traffic production AI applications.

# Pro Tips
- 💡Always align your chosen vector store's capabilities with your application's data volume, query patterns, and latency requirements for optimal performance.
- 💡Implement robust indexing strategies and monitor query execution plans within your vector database to identify and resolve performance bottlenecks early.
- 💡Utilize LangChain4J's flexible builder patterns to abstract vector store configurations, allowing for easy swapping between providers and environments without significant code changes.

