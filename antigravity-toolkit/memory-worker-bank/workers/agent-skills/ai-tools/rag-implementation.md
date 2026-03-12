# rag-implementation
Source: https://antigravity.codes/agent-skills/ai-tools/rag

## AI Worker Instructions
When the user requests functionality related to rag-implementation, follow these guidelines and utilize this context.

## Scraped Content

# rag-implementation
```
// Load documents from file systemList<Document> documents = FileSystemDocumentLoader.loadDocuments("/path/to/docs");// Create embedding storeInMemoryEmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();// Ingest documents into the storeEmbeddingStoreIngestor.ingest(documents, embeddingStore);// Create AI service with RAG capabilityAssistant assistant = AiServices.builder(Assistant.class)    .chatModel(chatModel)    .chatMemory(MessageWindowChatMemory.withMaxMessages(10))    .contentRetriever(EmbeddingStoreContentRetriever.from(embeddingStore))    .build();
```
```
// Load documents from file systemList<Document> documents = FileSystemDocumentLoader.loadDocuments("/path/to/docs");// Create embedding storeInMemoryEmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();// Ingest documents into the storeEmbeddingStoreIngestor.ingest(documents, embeddingStore);// Create AI service with RAG capabilityAssistant assistant = AiServices.builder(Assistant.class)    .chatModel(chatModel)    .chatMemory(MessageWindowChatMemory.withMaxMessages(10))    .contentRetriever(EmbeddingStoreContentRetriever.from(embeddingStore))    .build();
```
```
// Split documents into chunksDocumentSplitter splitter = new RecursiveCharacterTextSplitter(    500,  // chunk size    100   // overlap);// Create embedding modelEmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()    .apiKey("your-api-key")    .build();// Create embedding storeEmbeddingStore<TextSegment> embeddingStore = PgVectorEmbeddingStore.builder()    .host("localhost")    .database("postgres")    .user("postgres")    .password("password")    .table("embeddings")    .dimension(1536)    .build();// Process and store documentsfor (Document document : documents) {    List<TextSegment> segments = splitter.split(document);    for (TextSegment segment : segments) {        Embedding embedding = embeddingModel.embed(segment).content();        embeddingStore.add(embedding, segment);    }}
```
```
// Split documents into chunksDocumentSplitter splitter = new RecursiveCharacterTextSplitter(    500,  // chunk size    100   // overlap);// Create embedding modelEmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()    .apiKey("your-api-key")    .build();// Create embedding storeEmbeddingStore<TextSegment> embeddingStore = PgVectorEmbeddingStore.builder()    .host("localhost")    .database("postgres")    .user("postgres")    .password("password")    .table("embeddings")    .dimension(1536)    .build();// Process and store documentsfor (Document document : documents) {    List<TextSegment> segments = splitter.split(document);    for (TextSegment segment : segments) {        Embedding embedding = embeddingModel.embed(segment).content();        embeddingStore.add(embedding, segment);    }}
```
```
public interface DocumentAssistant {    String answer(String question);}DocumentAssistant assistant = AiServices.builder(DocumentAssistant.class)    .chatModel(chatModel)    .contentRetriever(retriever)    .build();
```
```
public interface DocumentAssistant {    String answer(String question);}DocumentAssistant assistant = AiServices.builder(DocumentAssistant.class)    .chatModel(chatModel)    .contentRetriever(retriever)    .build();
```
```
// Add metadata during document loadingDocument document = Document.builder()    .text("Content here")    .metadata("source", "technical-manual.pdf")    .metadata("category", "technical")    .metadata("date", "2024-01-15")    .build();// Filter during retrievalEmbeddingStoreContentRetriever retriever = EmbeddingStoreContentRetriever.builder()    .embeddingStore(embeddingStore)    .embeddingModel(embeddingModel)    .maxResults(5)    .minScore(0.7)    .filter(metadataKey("category").isEqualTo("technical"))    .build();
```
```
// Add metadata during document loadingDocument document = Document.builder()    .text("Content here")    .metadata("source", "technical-manual.pdf")    .metadata("category", "technical")    .metadata("date", "2024-01-15")    .build();// Filter during retrievalEmbeddingStoreContentRetriever retriever = EmbeddingStoreContentRetriever.builder()    .embeddingStore(embeddingStore)    .embeddingModel(embeddingModel)    .maxResults(5)    .minScore(0.7)    .filter(metadataKey("category").isEqualTo("technical"))    .build();
```
```
ContentRetriever webRetriever = EmbeddingStoreContentRetriever.from(webStore);ContentRetriever documentRetriever = EmbeddingStoreContentRetriever.from(documentStore);ContentRetriever databaseRetriever = EmbeddingStoreContentRetriever.from(databaseStore);// Combine resultsList<Content> allResults = new ArrayList<>();allResults.addAll(webRetriever.retrieve(query));allResults.addAll(documentRetriever.retrieve(query));allResults.addAll(databaseRetriever.retrieve(query));// Rerank combined resultsList<Content> rerankedResults = reranker.reorder(query, allResults);
```
```
ContentRetriever webRetriever = EmbeddingStoreContentRetriever.from(webStore);ContentRetriever documentRetriever = EmbeddingStoreContentRetriever.from(documentStore);ContentRetriever databaseRetriever = EmbeddingStoreContentRetriever.from(databaseStore);// Combine resultsList<Content> allResults = new ArrayList<>();allResults.addAll(webRetriever.retrieve(query));allResults.addAll(documentRetriever.retrieve(query));allResults.addAll(databaseRetriever.retrieve(query));// Rerank combined resultsList<Content> rerankedResults = reranker.reorder(query, allResults);
```
```
assets/vector-store-config.yaml
```
```
assets/retriever-pipeline.java
```
```
assets/evaluation-metrics.java
```
Unlock the true potential of AI with this RAG Implementation skill. Moving beyond generic responses, you can empower AI agents to access, synthesize, and cite information from vast external knowledge bases. This capability is crucial for delivering accurate, up-to-date, and contextually relevant answers, significantly mitigating the common challenge of AI 'hallucinations.' By leveraging Retrieval-Augmented Generation, your AI applications will not only understand queries but also retrieve precise information to formulate highly credible and verifiable responses, transforming them into reliable knowledge partners rather than just conversational interfaces.

# When to Use This Skill
- •Developing AI-powered Q&A systems over a company's internal documentation or proprietary datasets.
- •Building advanced chatbots that provide current, factual information by integrating with real-time data sources.
- •Creating documentation assistants that can instantly pull relevant snippets and generate summaries from extensive manuals.
- •Implementing research tools that offer source citations for every piece of generated information, enhancing credibility.

# Pro Tips
- 💡Optimize your chunking strategy: Experiment with different text chunk sizes and overlap to balance retrieval relevance and context window limitations for your specific knowledge base.
- 💡Prioritize embedding model selection: The quality of your embeddings directly impacts retrieval performance. Choose an embedding model that is well-suited to the domain and nature of your data.
- 💡Implement hybrid search: Combine semantic search with keyword-based search (e.g., BM25) to leverage the strengths of both, improving recall and precision, especially for specific entity lookups.

