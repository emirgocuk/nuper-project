# aws-sdk-java-v2-dynamodb
Source: https://antigravity.codes/agent-skills/database/aws-sdk-java-v2-dynamodb

## AI Worker Instructions
When the user requests functionality related to aws-sdk-java-v2-dynamodb, follow these guidelines and utilize this context.

## Scraped Content

# aws-sdk-java-v2-dynamodb
```
pom.xml
```
```
<!-- Low-level DynamoDB client --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>dynamodb</artifactId></dependency><!-- Enhanced client (recommended) --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>dynamodb-enhanced</artifactId></dependency>
```
```
<!-- Low-level DynamoDB client --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>dynamodb</artifactId></dependency><!-- Enhanced client (recommended) --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>dynamodb-enhanced</artifactId></dependency>
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.dynamodb.DynamoDbClient;DynamoDbClient dynamoDb = DynamoDbClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.dynamodb.DynamoDbClient;DynamoDbClient dynamoDb = DynamoDbClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;DynamoDbEnhancedClient enhancedClient = DynamoDbEnhancedClient.builder()    .dynamoDbClient(dynamoDb)    .build();
```
```
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;DynamoDbEnhancedClient enhancedClient = DynamoDbEnhancedClient.builder()    .dynamoDbClient(dynamoDb)    .build();
```
```
@DynamoDbBean
```
```
@DynamoDbBeanpublic class Customer {    @DynamoDbPartitionKey    private String customerId;    @DynamoDbAttribute("customer_name")    private String name;    private String email;    @DynamoDbSortKey    private String orderId;    // Getters and setters}
```
```
@DynamoDbBeanpublic class Customer {    @DynamoDbPartitionKey    private String customerId;    @DynamoDbAttribute("customer_name")    private String name;    private String email;    @DynamoDbSortKey    private String orderId;    // Getters and setters}
```
```
// Create or update itemDynamoDbTable<Customer> table = enhancedClient.table("Customers", TableSchema.fromBean(Customer.class));table.putItem(customer);// Get itemCustomer result = table.getItem(Key.builder().partitionValue(customerId).build());// Update itemreturn table.updateItem(customer);// Delete itemtable.deleteItem(Key.builder().partitionValue(customerId).build());
```
```
// Create or update itemDynamoDbTable<Customer> table = enhancedClient.table("Customers", TableSchema.fromBean(Customer.class));table.putItem(customer);// Get itemCustomer result = table.getItem(Key.builder().partitionValue(customerId).build());// Update itemreturn table.updateItem(customer);// Delete itemtable.deleteItem(Key.builder().partitionValue(customerId).build());
```
```
// Get item with composite keyOrder order = table.getItem(Key.builder()    .partitionValue(customerId)    .sortValue(orderId)    .build());
```
```
// Get item with composite keyOrder order = table.getItem(Key.builder()    .partitionValue(customerId)    .sortValue(orderId)    .build());
```
```
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;QueryConditional queryConditional = QueryConditional    .keyEqualTo(Key.builder()        .partitionValue(customerId)        .build());List<Order> orders = table.query(queryConditional).items().stream()    .collect(Collectors.toList());
```
```
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;QueryConditional queryConditional = QueryConditional    .keyEqualTo(Key.builder()        .partitionValue(customerId)        .build());List<Order> orders = table.query(queryConditional).items().stream()    .collect(Collectors.toList());
```
```
import software.amazon.awssdk.enhanced.dynamodb.Expression;Expression filter = Expression.builder()    .expression("status = :pending")    .putExpressionValue(":pending", AttributeValue.builder().s("PENDING").build())    .build();List<Order> pendingOrders = table.query(r -> r    .queryConditional(queryConditional)    .filterExpression(filter))    .items().stream()    .collect(Collectors.toList());
```
```
import software.amazon.awssdk.enhanced.dynamodb.Expression;Expression filter = Expression.builder()    .expression("status = :pending")    .putExpressionValue(":pending", AttributeValue.builder().s("PENDING").build())    .build();List<Order> pendingOrders = table.query(r -> r    .queryConditional(queryConditional)    .filterExpression(filter))    .items().stream()    .collect(Collectors.toList());
```
```
// Scan all itemsList<Customer> allCustomers = table.scan().items().stream()    .collect(Collectors.toList());// Scan with filterExpression filter = Expression.builder()    .expression("points >= :minPoints")    .putExpressionValue(":minPoints", AttributeValue.builder().n("1000").build())    .build();List<Customer> vipCustomers = table.scan(r -> r.filterExpression(filter))    .items().stream()    .collect(Collectors.toList());
```
```
// Scan all itemsList<Customer> allCustomers = table.scan().items().stream()    .collect(Collectors.toList());// Scan with filterExpression filter = Expression.builder()    .expression("points >= :minPoints")    .putExpressionValue(":minPoints", AttributeValue.builder().n("1000").build())    .build();List<Customer> vipCustomers = table.scan(r -> r.filterExpression(filter))    .items().stream()    .collect(Collectors.toList());
```
```
import software.amazon.awssdk.enhanced.dynamodb.model.*;List<Key> keys = customerIds.stream()    .map(id -> Key.builder().partitionValue(id).build())    .collect(Collectors.toList());ReadBatch.Builder<Customer> batchBuilder = ReadBatch.builder(Customer.class)    .mappedTableResource(table);keys.forEach(batchBuilder::addGetItem);BatchGetResultPageIterable result = enhancedClient.batchGetItem(r ->    r.addReadBatch(batchBuilder.build()));List<Customer> customers = result.resultsForTable(table).stream()    .collect(Collectors.toList());
```
```
import software.amazon.awssdk.enhanced.dynamodb.model.*;List<Key> keys = customerIds.stream()    .map(id -> Key.builder().partitionValue(id).build())    .collect(Collectors.toList());ReadBatch.Builder<Customer> batchBuilder = ReadBatch.builder(Customer.class)    .mappedTableResource(table);keys.forEach(batchBuilder::addGetItem);BatchGetResultPageIterable result = enhancedClient.batchGetItem(r ->    r.addReadBatch(batchBuilder.build()));List<Customer> customers = result.resultsForTable(table).stream()    .collect(Collectors.toList());
```
```
WriteBatch.Builder<Customer> batchBuilder = WriteBatch.builder(Customer.class)    .mappedTableResource(table);customers.forEach(batchBuilder::addPutItem);enhancedClient.batchWriteItem(r -> r.addWriteBatch(batchBuilder.build()));
```
```
WriteBatch.Builder<Customer> batchBuilder = WriteBatch.builder(Customer.class)    .mappedTableResource(table);customers.forEach(batchBuilder::addPutItem);enhancedClient.batchWriteItem(r -> r.addWriteBatch(batchBuilder.build()));
```
```
enhancedClient.transactWriteItems(r -> r    .addPutItem(customerTable, customer)    .addPutItem(orderTable, order));
```
```
enhancedClient.transactWriteItems(r -> r    .addPutItem(customerTable, customer)    .addPutItem(orderTable, order));
```
```
TransactGetItemsEnhancedRequest request = TransactGetItemsEnhancedRequest.builder()    .addGetItem(customerTable, customerKey)    .addGetItem(orderTable, orderKey)    .build();List<Document> results = enhancedClient.transactGetItems(request);
```
```
TransactGetItemsEnhancedRequest request = TransactGetItemsEnhancedRequest.builder()    .addGetItem(customerTable, customerKey)    .addGetItem(orderTable, orderKey)    .build();List<Document> results = enhancedClient.transactGetItems(request);
```
```
@Configurationpublic class DynamoDbConfiguration {    @Bean    public DynamoDbClient dynamoDbClient() {        return DynamoDbClient.builder()            .region(Region.US_EAST_1)            .build();    }    @Bean    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {        return DynamoDbEnhancedClient.builder()            .dynamoDbClient(dynamoDbClient)            .build();    }}
```
```
@Configurationpublic class DynamoDbConfiguration {    @Bean    public DynamoDbClient dynamoDbClient() {        return DynamoDbClient.builder()            .region(Region.US_EAST_1)            .build();    }    @Bean    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {        return DynamoDbEnhancedClient.builder()            .dynamoDbClient(dynamoDbClient)            .build();    }}
```
```
@Repositorypublic class CustomerRepository {    private final DynamoDbTable<Customer> customerTable;    public CustomerRepository(DynamoDbEnhancedClient enhancedClient) {        this.customerTable = enhancedClient.table("Customers", TableSchema.fromBean(Customer.class));    }    public void save(Customer customer) {        customerTable.putItem(customer);    }    public Optional<Customer> findById(String customerId) {        Key key = Key.builder().partitionValue(customerId).build();        return Optional.ofNullable(customerTable.getItem(key));    }}
```
```
@Repositorypublic class CustomerRepository {    private final DynamoDbTable<Customer> customerTable;    public CustomerRepository(DynamoDbEnhancedClient enhancedClient) {        this.customerTable = enhancedClient.table("Customers", TableSchema.fromBean(Customer.class));    }    public void save(Customer customer) {        customerTable.putItem(customer);    }    public Optional<Customer> findById(String customerId) {        Key key = Key.builder().partitionValue(customerId).build();        return Optional.ofNullable(customerTable.getItem(key));    }}
```
```
@ExtendWith(MockitoExtension.class)class CustomerServiceTest {    @Mock    private DynamoDbClient dynamoDbClient;    @Mock    private DynamoDbEnhancedClient enhancedClient;    @Mock    private DynamoDbTable<Customer> customerTable;    @InjectMocks    private CustomerService customerService;    @Test    void saveCustomer_ShouldReturnSavedCustomer() {        // Arrange        when(enhancedClient.table(anyString(), any(TableSchema.class)))            .thenReturn(customerTable);        Customer customer = new Customer("123", "John Doe", "john@example.com");        // Act        Customer result = customerService.saveCustomer(customer);        // Assert        assertNotNull(result);        verify(customerTable).putItem(customer);    }}
```
```
@ExtendWith(MockitoExtension.class)class CustomerServiceTest {    @Mock    private DynamoDbClient dynamoDbClient;    @Mock    private DynamoDbEnhancedClient enhancedClient;    @Mock    private DynamoDbTable<Customer> customerTable;    @InjectMocks    private CustomerService customerService;    @Test    void saveCustomer_ShouldReturnSavedCustomer() {        // Arrange        when(enhancedClient.table(anyString(), any(TableSchema.class)))            .thenReturn(customerTable);        Customer customer = new Customer("123", "John Doe", "john@example.com");        // Act        Customer result = customerService.saveCustomer(customer);        // Assert        assertNotNull(result);        verify(customerTable).putItem(customer);    }}
```
```
@Testcontainers@SpringBootTestclass DynamoDbIntegrationTest {    @Container    static LocalStackContainer localstack = new LocalStackContainer(        DockerImageName.parse("localstack/localstack:3.0"))        .withServices(LocalStackContainer.Service.DYNAMODB);    @DynamicPropertySource    static void configureProperties(DynamicPropertyRegistry registry) {        registry.add("aws.endpoint",            () -> localstack.getEndpointOverride(LocalStackContainer.Service.DYNAMODB).toString());    }    @Autowired    private DynamoDbEnhancedClient enhancedClient;    @Test    void testCustomerCRUDOperations() {        // Test implementation    }}
```
```
@Testcontainers@SpringBootTestclass DynamoDbIntegrationTest {    @Container    static LocalStackContainer localstack = new LocalStackContainer(        DockerImageName.parse("localstack/localstack:3.0"))        .withServices(LocalStackContainer.Service.DYNAMODB);    @DynamicPropertySource    static void configureProperties(DynamicPropertyRegistry registry) {        registry.add("aws.endpoint",            () -> localstack.getEndpointOverride(LocalStackContainer.Service.DYNAMODB).toString());    }    @Autowired    private DynamoDbEnhancedClient enhancedClient;    @Test    void testCustomerCRUDOperations() {        // Test implementation    }}
```
```
ProvisionedThroughputExceeded
```
```
PutItemEnhancedRequest request = PutItemEnhancedRequest.builder(table)    .item(customer)    .conditionExpression("attribute_not_exists(customerId)")    .build();table.putItemWithRequestBuilder(request);
```
```
PutItemEnhancedRequest request = PutItemEnhancedRequest.builder(table)    .item(customer)    .conditionExpression("attribute_not_exists(customerId)")    .build();table.putItemWithRequestBuilder(request);
```
```
ScanEnhancedRequest request = ScanEnhancedRequest.builder()    .limit(100)    .build();PaginatedScanIterable<Customer> results = table.scan(request);results.stream().forEach(page -> {    // Process each page});
```
```
ScanEnhancedRequest request = ScanEnhancedRequest.builder()    .limit(100)    .build();PaginatedScanIterable<Customer> results = table.scan(request);results.stream().forEach(page -> {    // Process each page});
```
```
ReturnConsumedCapacity
```
```
aws-sdk-java-v2-core
```
```
spring-data-jpa
```
```
unit-test-service-layer
```
```
unit-test-wiremock-rest-api
```
This skill empowers developers to efficiently interact with Amazon DynamoDB using the AWS SDK for Java 2.x. It provides comprehensive guidance and patterns for managing your NoSQL data, from basic item operations to complex transactions and index management. By leveraging this skill, you can streamline the development of high-performance, scalable Java applications that seamlessly integrate with DynamoDB, ensuring robust data handling and optimized resource utilization. Unlock the full potential of serverless and cloud-native architectures with expert-level DynamoDB implementation strategies.

# When to Use This Skill
- •Developing new microservices or serverless applications requiring a scalable NoSQL database for data storage and retrieval.
- •Optimizing existing Java applications by implementing efficient batch operations or transactional write/read patterns for DynamoDB.
- •Migrating an application to leverage the DynamoDB Enhanced Client for more type-safe and streamlined object-to-item mapping.
- •Integrating DynamoDB with Spring Boot applications to provide persistent data storage for web services or backend processes.

# Pro Tips
- 💡Always prefer the DynamoDB Enhanced Client for type-safe operations, simplified POJO mapping, and reduced boilerplate code.
- 💡Utilize batch write and get operations for multiple item interactions to minimize network overhead and significantly improve application throughput.
- 💡Carefully design your primary key and secondary indexes to support common query patterns and avoid costly full table scans, especially for large datasets.

