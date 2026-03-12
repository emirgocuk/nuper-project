# qdrant-vector-database-integration
Source: https://antigravity.codes/agent-skills/ai-tools/qdrant

## AI Worker Instructions
When the user requests functionality related to qdrant-vector-database-integration, follow these guidelines and utilize this context.

## Scraped Content

# qdrant-vector-database-integration
```
# Pull the latest Qdrant imagedocker pull qdrant/qdrant# Run the Qdrant containerdocker run -p 6333:6333 -p 6334:6334 \    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \    qdrant/qdrant
```
```
# Pull the latest Qdrant imagedocker pull qdrant/qdrant# Run the Qdrant containerdocker run -p 6333:6333 -p 6334:6334 \    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \    qdrant/qdrant
```
```
http://localhost:6333
```
```
http://localhost:6334
```
```
<dependency>    <groupId>io.qdrant</groupId>    <artifactId>client</artifactId>    <version>1.15.0</version></dependency>
```
```
<dependency>    <groupId>io.qdrant</groupId>    <artifactId>client</artifactId>    <version>1.15.0</version></dependency>
```
```
implementation 'io.qdrant:client:1.15.0'
```
```
implementation 'io.qdrant:client:1.15.0'
```
```
import io.qdrant.client.QdrantClient;import io.qdrant.client.QdrantGrpcClient;// Basic local connectionQdrantClient client = new QdrantClient(    QdrantGrpcClient.newBuilder("localhost").build());// Secure connection with API keyQdrantClient secureClient = new QdrantClient(    QdrantGrpcClient.newBuilder("localhost", 6334, false)        .withApiKey("YOUR_API_KEY")        .build());// Managed connection with TLSQdrantClient tlsClient = new QdrantClient(    QdrantGrpcClient.newBuilder(channel)        .withApiKey("YOUR_API_KEY")        .build());
```
```
import io.qdrant.client.QdrantClient;import io.qdrant.client.QdrantGrpcClient;// Basic local connectionQdrantClient client = new QdrantClient(    QdrantGrpcClient.newBuilder("localhost").build());// Secure connection with API keyQdrantClient secureClient = new QdrantClient(    QdrantGrpcClient.newBuilder("localhost", 6334, false)        .withApiKey("YOUR_API_KEY")        .build());// Managed connection with TLSQdrantClient tlsClient = new QdrantClient(    QdrantGrpcClient.newBuilder(channel)        .withApiKey("YOUR_API_KEY")        .build());
```
```
import io.qdrant.client.grpc.Collections.Distance;import io.qdrant.client.grpc.Collections.VectorParams;import java.util.concurrent.ExecutionException;// Create a collection with cosine distanceclient.createCollectionAsync("search-collection",    VectorParams.newBuilder()        .setDistance(Distance.Cosine)        .setSize(384)        .build()).get();// Create collection with configurationclient.createCollectionAsync("recommendation-engine",    VectorParams.newBuilder()        .setDistance(Distance.Euclidean)        .setSize(512)        .build()).get();
```
```
import io.qdrant.client.grpc.Collections.Distance;import io.qdrant.client.grpc.Collections.VectorParams;import java.util.concurrent.ExecutionException;// Create a collection with cosine distanceclient.createCollectionAsync("search-collection",    VectorParams.newBuilder()        .setDistance(Distance.Cosine)        .setSize(384)        .build()).get();// Create collection with configurationclient.createCollectionAsync("recommendation-engine",    VectorParams.newBuilder()        .setDistance(Distance.Euclidean)        .setSize(512)        .build()).get();
```
```
import io.qdrant.client.grpc.Points.PointStruct;import java.util.List;import java.util.Map;import static io.qdrant.client.PointIdFactory.id;import static io.qdrant.client.ValueFactory.value;import static io.qdrant.client.VectorsFactory.vectors;// Batch upsert vector pointsList<PointStruct> points = List.of(    PointStruct.newBuilder()        .setId(id(1))        .setVectors(vectors(0.05f, 0.61f, 0.76f, 0.74f))        .putAllPayload(Map.of(            "title", value("Spring Boot Documentation"),            "content", value("Spring Boot framework documentation")        ))        .build(),    PointStruct.newBuilder()        .setId(id(2))        .setVectors(vectors(0.19f, 0.81f, 0.75f, 0.11f))        .putAllPayload(Map.of(            "title", value("Qdrant Vector Database"),            "content", value("Vector database for AI applications")        ))        .build());client.upsertAsync("search-collection", points).get();
```
```
import io.qdrant.client.grpc.Points.PointStruct;import java.util.List;import java.util.Map;import static io.qdrant.client.PointIdFactory.id;import static io.qdrant.client.ValueFactory.value;import static io.qdrant.client.VectorsFactory.vectors;// Batch upsert vector pointsList<PointStruct> points = List.of(    PointStruct.newBuilder()        .setId(id(1))        .setVectors(vectors(0.05f, 0.61f, 0.76f, 0.74f))        .putAllPayload(Map.of(            "title", value("Spring Boot Documentation"),            "content", value("Spring Boot framework documentation")        ))        .build(),    PointStruct.newBuilder()        .setId(id(2))        .setVectors(vectors(0.19f, 0.81f, 0.75f, 0.11f))        .putAllPayload(Map.of(            "title", value("Qdrant Vector Database"),            "content", value("Vector database for AI applications")        ))        .build());client.upsertAsync("search-collection", points).get();
```
```
import io.qdrant.client.grpc.Points.QueryPoints;import io.qdrant.client.grpc.Points.ScoredPoint;import static io.qdrant.client.QueryFactory.nearest;import java.util.List;// Basic similarity searchList<ScoredPoint> results = client.queryAsync(    QueryPoints.newBuilder()        .setCollectionName("search-collection")        .setLimit(5)        .setQuery(nearest(0.2f, 0.1f, 0.9f, 0.7f))        .build()).get();// Search with filtersList<ScoredPoint> filteredResults = client.searchAsync(    SearchPoints.newBuilder()        .setCollectionName("search-collection")        .addAllVector(List.of(0.6235f, 0.123f, 0.532f, 0.123f))        .setFilter(Filter.newBuilder()            .addMust(range("rand_number",                Range.newBuilder().setGte(3).build()))            .build())        .setLimit(5)        .build()).get();
```
```
import io.qdrant.client.grpc.Points.QueryPoints;import io.qdrant.client.grpc.Points.ScoredPoint;import static io.qdrant.client.QueryFactory.nearest;import java.util.List;// Basic similarity searchList<ScoredPoint> results = client.queryAsync(    QueryPoints.newBuilder()        .setCollectionName("search-collection")        .setLimit(5)        .setQuery(nearest(0.2f, 0.1f, 0.9f, 0.7f))        .build()).get();// Search with filtersList<ScoredPoint> filteredResults = client.searchAsync(    SearchPoints.newBuilder()        .setCollectionName("search-collection")        .addAllVector(List.of(0.6235f, 0.123f, 0.532f, 0.123f))        .setFilter(Filter.newBuilder()            .addMust(range("rand_number",                Range.newBuilder().setGte(3).build()))            .build())        .setLimit(5)        .build()).get();
```
```
import io.qdrant.client.QdrantClient;import io.qdrant.client.QdrantGrpcClient;import org.springframework.beans.factory.annotation.Value;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class QdrantConfig {    @Value("${qdrant.host:localhost}")    private String host;    @Value("${qdrant.port:6334}")    private int port;    @Value("${qdrant.api-key:}")    private String apiKey;    @Bean    public QdrantClient qdrantClient() {        QdrantGrpcClient grpcClient = QdrantGrpcClient.newBuilder(host, port, false)            .withApiKey(apiKey)            .build();        return new QdrantClient(grpcClient);    }}
```
```
import io.qdrant.client.QdrantClient;import io.qdrant.client.QdrantGrpcClient;import org.springframework.beans.factory.annotation.Value;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class QdrantConfig {    @Value("${qdrant.host:localhost}")    private String host;    @Value("${qdrant.port:6334}")    private int port;    @Value("${qdrant.api-key:}")    private String apiKey;    @Bean    public QdrantClient qdrantClient() {        QdrantGrpcClient grpcClient = QdrantGrpcClient.newBuilder(host, port, false)            .withApiKey(apiKey)            .build();        return new QdrantClient(grpcClient);    }}
```
```
import org.springframework.stereotype.Service;import java.util.List;import java.util.concurrent.ExecutionException;@Servicepublic class VectorSearchService {    private final QdrantClient qdrantClient;    public VectorSearchService(QdrantClient qdrantClient) {        this.qdrantClient = qdrantClient;    }    public List<ScoredPoint> search(String collectionName, List<Float> queryVector) {        try {            return qdrantClient.queryAsync(                QueryPoints.newBuilder()                    .setCollectionName(collectionName)                    .setLimit(5)                    .setQuery(nearest(queryVector))                    .build()            ).get();        } catch (InterruptedException | ExecutionException e) {            throw new RuntimeException("Qdrant search failed", e);        }    }    public void upsertPoints(String collectionName, List<PointStruct> points) {        try {            qdrantClient.upsertAsync(collectionName, points).get();        } catch (InterruptedException | ExecutionException e) {            throw new RuntimeException("Qdrant upsert failed", e);        }    }}
```
```
import org.springframework.stereotype.Service;import java.util.List;import java.util.concurrent.ExecutionException;@Servicepublic class VectorSearchService {    private final QdrantClient qdrantClient;    public VectorSearchService(QdrantClient qdrantClient) {        this.qdrantClient = qdrantClient;    }    public List<ScoredPoint> search(String collectionName, List<Float> queryVector) {        try {            return qdrantClient.queryAsync(                QueryPoints.newBuilder()                    .setCollectionName(collectionName)                    .setLimit(5)                    .setQuery(nearest(queryVector))                    .build()            ).get();        } catch (InterruptedException | ExecutionException e) {            throw new RuntimeException("Qdrant search failed", e);        }    }    public void upsertPoints(String collectionName, List<PointStruct> points) {        try {            qdrantClient.upsertAsync(collectionName, points).get();        } catch (InterruptedException | ExecutionException e) {            throw new RuntimeException("Qdrant upsert failed", e);        }    }}
```
```
<dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-qdrant</artifactId>    <version>1.7.0</version></dependency>
```
```
<dependency>    <groupId>dev.langchain4j</groupId>    <artifactId>langchain4j-qdrant</artifactId>    <version>1.7.0</version></dependency>
```
```
import dev.langchain4j.data.segment.TextSegment;import dev.langchain4j.embedding.EmbeddingModel;import dev.langchain4j.embedding.allminilml6v2.AllMiniLmL6V2EmbeddingModel;import dev.langchain4j.store.embedding.EmbeddingStore;import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class Langchain4jConfig {    @Bean    public EmbeddingStore<TextSegment> embeddingStore() {        return QdrantEmbeddingStore.builder()            .collectionName("rag-collection")            .host("localhost")            .port(6334)            .apiKey("YOUR_API_KEY")            .build();    }    @Bean    public EmbeddingModel embeddingModel() {        return new AllMiniLmL6V2EmbeddingModel();    }    @Bean    public EmbeddingStoreIngestor embeddingStoreIngestor(            EmbeddingStore<TextSegment> embeddingStore,            EmbeddingModel embeddingModel) {        return EmbeddingStoreIngestor.builder()            .embeddingStore(embeddingStore)            .embeddingModel(embeddingModel)            .build();    }}
```
```
import dev.langchain4j.data.segment.TextSegment;import dev.langchain4j.embedding.EmbeddingModel;import dev.langchain4j.embedding.allminilml6v2.AllMiniLmL6V2EmbeddingModel;import dev.langchain4j.store.embedding.EmbeddingStore;import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class Langchain4jConfig {    @Bean    public EmbeddingStore<TextSegment> embeddingStore() {        return QdrantEmbeddingStore.builder()            .collectionName("rag-collection")            .host("localhost")            .port(6334)            .apiKey("YOUR_API_KEY")            .build();    }    @Bean    public EmbeddingModel embeddingModel() {        return new AllMiniLmL6V2EmbeddingModel();    }    @Bean    public EmbeddingStoreIngestor embeddingStoreIngestor(            EmbeddingStore<TextSegment> embeddingStore,            EmbeddingModel embeddingModel) {        return EmbeddingStoreIngestor.builder()            .embeddingStore(embeddingStore)            .embeddingModel(embeddingModel)            .build();    }}
```
```
import dev.langchain4j.data.segment.TextSegment;import dev.langchain4j.embedding.EmbeddingModel;import dev.langchain4j.store.embedding.EmbeddingStore;import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;import org.springframework.stereotype.Service;import java.util.List;@Servicepublic class RagService {    private final EmbeddingStoreIngestor ingestor;    public RagService(EmbeddingStoreIngestor ingestor) {        this.ingestor = ingestor;    }    public void ingestDocument(String text) {        TextSegment segment = TextSegment.from(text);        ingestor.ingest(segment);    }    public List<TextSegment> findRelevant(String query) {        EmbeddingStore<TextSegment> embeddingStore = ingestor.getEmbeddingStore();        return embeddingStore.findRelevant(            ingestor.getEmbeddingModel().embed(query).content(),            5,            0.7        ).stream()            .map(match -> match.embedded())            .toList();    }}
```
```
import dev.langchain4j.data.segment.TextSegment;import dev.langchain4j.embedding.EmbeddingModel;import dev.langchain4j.store.embedding.EmbeddingStore;import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;import org.springframework.stereotype.Service;import java.util.List;@Servicepublic class RagService {    private final EmbeddingStoreIngestor ingestor;    public RagService(EmbeddingStoreIngestor ingestor) {        this.ingestor = ingestor;    }    public void ingestDocument(String text) {        TextSegment segment = TextSegment.from(text);        ingestor.ingest(segment);    }    public List<TextSegment> findRelevant(String query) {        EmbeddingStore<TextSegment> embeddingStore = ingestor.getEmbeddingStore();        return embeddingStore.findRelevant(            ingestor.getEmbeddingModel().embed(query).content(),            5,            0.7        ).stream()            .map(match -> match.embedded())            .toList();    }}
```
```
// Create simple search endpoint@RestController@RequestMapping("/api/search")public class SearchController {    private final VectorSearchService searchService;    public SearchController(VectorSearchService searchService) {        this.searchService = searchService;    }    @GetMapping    public List<ScoredPoint> search(@RequestParam String query) {        // Convert query to embedding (requires embedding model)        List<Float> queryVector = embeddingModel.embed(query).content().vectorAsList();        return searchService.search("documents", queryVector);    }}
```
```
// Create simple search endpoint@RestController@RequestMapping("/api/search")public class SearchController {    private final VectorSearchService searchService;    public SearchController(VectorSearchService searchService) {        this.searchService = searchService;    }    @GetMapping    public List<ScoredPoint> search(@RequestParam String query) {        // Convert query to embedding (requires embedding model)        List<Float> queryVector = embeddingModel.embed(query).content().vectorAsList();        return searchService.search("documents", queryVector);    }}
```
```
// Implement collection-based multi-tenancypublic class MultiTenantVectorService {    private final QdrantClient client;    public void upsertForTenant(String tenantId, List<PointStruct> points) {        String collectionName = "tenant_" + tenantId + "_documents";        client.upsertAsync(collectionName, points).get();    }}
```
```
// Implement collection-based multi-tenancypublic class MultiTenantVectorService {    private final QdrantClient client;    public void upsertForTenant(String tenantId, List<PointStruct> points) {        String collectionName = "tenant_" + tenantId + "_documents";        client.upsertAsync(collectionName, points).get();    }}
```
```
// Combine vector similarity with metadata filteringpublic List<ScoredPoint> hybridSearch(String collectionName, List<Float> queryVector,                                     String category, Date dateRange) {    Filter filter = Filter.newBuilder()        .addMust(range("created_at",            Range.newBuilder().setGte(dateRange.getTime()).build()))        .addMust(exactMatch("category", category))        .build();    return client.searchAsync(        SearchPoints.newBuilder()            .setCollectionName(collectionName)            .addAllVector(queryVector)            .setFilter(filter)            .build()    ).get();}
```
```
// Combine vector similarity with metadata filteringpublic List<ScoredPoint> hybridSearch(String collectionName, List<Float> queryVector,                                     String category, Date dateRange) {    Filter filter = Filter.newBuilder()        .addMust(range("created_at",            Range.newBuilder().setGte(dateRange.getTime()).build()))        .addMust(exactMatch("category", category))        .build();    return client.searchAsync(        SearchPoints.newBuilder()            .setCollectionName(collectionName)            .addAllVector(queryVector)            .setFilter(filter)            .build()    ).get();}
```
Vector databases are foundational for modern AI applications, enabling efficient similarity searches across vast datasets of embeddings. Qdrant stands out as an AI-native solution, designed from the ground up to handle high-performance vector operations. This skill provides a comprehensive guide to integrating Qdrant within your Java and Spring Boot projects, leveraging the power of LangChain4j. Developers can rapidly build sophisticated RAG systems, enhance search functionalities, and deploy intelligent recommendation engines, ensuring your applications can effectively understand and respond to semantic queries.

# When to Use This Skill
- •Building Retrieval-Augmented Generation (RAG) pipelines in Java for context-aware AI.
- •Developing semantic search functionalities for large document corpora or product catalogs.
- •Implementing personalized recommendation systems based on user preferences and item similarity.
- •Storing and managing high-dimensional embeddings generated by various AI models.
- •Creating high-performance similarity search endpoints with advanced filtering capabilities.

# Pro Tips
- 💡Optimize your Qdrant collection's indexing strategy (e.g., HNSW) and distance metric (e.g., Cosine, Dot product) based on your embedding model and query patterns for peak performance.
- 💡Leverage Qdrant's filtering capabilities to combine vector similarity search with structured metadata queries, enabling highly precise and relevant results.
- 💡For production deployments, consider Qdrant's distributed and high-availability features, using clustering and replication to ensure robustness and scalability.

