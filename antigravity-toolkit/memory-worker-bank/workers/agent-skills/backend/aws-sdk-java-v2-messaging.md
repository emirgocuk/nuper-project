# aws-sdk-java-v2-messaging
Source: https://antigravity.codes/agent-skills/backend/aws-sdk-java-v2-messaging

## AI Worker Instructions
When the user requests functionality related to aws-sdk-java-v2-messaging, follow these guidelines and utilize this context.

## Scraped Content

# aws-sdk-java-v2-messaging
```
<!-- SQS --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>sqs</artifactId></dependency><!-- SNS --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>sns</artifactId></dependency>
```
```
<!-- SQS --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>sqs</artifactId></dependency><!-- SNS --><dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>sns</artifactId></dependency>
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.sqs.SqsClient;import software.amazon.awssdk.services.sns.SnsClient;SqsClient sqsClient = SqsClient.builder()    .region(Region.US_EAST_1)    .build();SnsClient snsClient = SnsClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.sqs.SqsClient;import software.amazon.awssdk.services.sns.SnsClient;SqsClient sqsClient = SqsClient.builder()    .region(Region.US_EAST_1)    .build();SnsClient snsClient = SnsClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.sqs.SqsClient;import software.amazon.awssdk.services.sqs.model.*;// Setup SQS clientSqsClient sqsClient = SqsClient.builder()    .region(Region.US_EAST_1)    .build();// Create queueString queueUrl = sqsClient.createQueue(CreateQueueRequest.builder()    .queueName("my-queue")    .build()).queueUrl();// Send messageString messageId = sqsClient.sendMessage(SendMessageRequest.builder()    .queueUrl(queueUrl)    .messageBody("Hello, SQS!")    .build()).messageId();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.sqs.SqsClient;import software.amazon.awssdk.services.sqs.model.*;// Setup SQS clientSqsClient sqsClient = SqsClient.builder()    .region(Region.US_EAST_1)    .build();// Create queueString queueUrl = sqsClient.createQueue(CreateQueueRequest.builder()    .queueName("my-queue")    .build()).queueUrl();// Send messageString messageId = sqsClient.sendMessage(SendMessageRequest.builder()    .queueUrl(queueUrl)    .messageBody("Hello, SQS!")    .build()).messageId();
```
```
// Receive messages with long pollingReceiveMessageResponse response = sqsClient.receiveMessage(ReceiveMessageRequest.builder()    .queueUrl(queueUrl)    .maxNumberOfMessages(10)    .waitTimeSeconds(20)    .build());// Process and delete messagesresponse.messages().forEach(message -> {    System.out.println("Received: " + message.body());    sqsClient.deleteMessage(DeleteMessageRequest.builder()        .queueUrl(queueUrl)        .receiptHandle(message.receiptHandle())        .build());});
```
```
// Receive messages with long pollingReceiveMessageResponse response = sqsClient.receiveMessage(ReceiveMessageRequest.builder()    .queueUrl(queueUrl)    .maxNumberOfMessages(10)    .waitTimeSeconds(20)    .build());// Process and delete messagesresponse.messages().forEach(message -> {    System.out.println("Received: " + message.body());    sqsClient.deleteMessage(DeleteMessageRequest.builder()        .queueUrl(queueUrl)        .receiptHandle(message.receiptHandle())        .build());});
```
```
import software.amazon.awssdk.services.sns.SnsClient;import software.amazon.awssdk.services.sns.model.*;// Setup SNS clientSnsClient snsClient = SnsClient.builder()    .region(Region.US_EAST_1)    .build();// Create topicString topicArn = snsClient.createTopic(CreateTopicRequest.builder()    .name("my-topic")    .build()).topicArn();// Publish messageString messageId = snsClient.publish(PublishRequest.builder()    .topicArn(topicArn)    .subject("Test Notification")    .message("Hello, SNS!")    .build()).messageId();
```
```
import software.amazon.awssdk.services.sns.SnsClient;import software.amazon.awssdk.services.sns.model.*;// Setup SNS clientSnsClient snsClient = SnsClient.builder()    .region(Region.US_EAST_1)    .build();// Create topicString topicArn = snsClient.createTopic(CreateTopicRequest.builder()    .name("my-topic")    .build()).topicArn();// Publish messageString messageId = snsClient.publish(PublishRequest.builder()    .topicArn(topicArn)    .subject("Test Notification")    .message("Hello, SNS!")    .build()).messageId();
```
```
// Create FIFO queueMap<QueueAttributeName, String> attributes = Map.of(    QueueAttributeName.FIFO_QUEUE, "true",    QueueAttributeName.CONTENT_BASED_DEDUPLICATION, "true");String fifoQueueUrl = sqsClient.createQueue(CreateQueueRequest.builder()    .queueName("my-queue.fifo")    .attributes(attributes)    .build()).queueUrl();// Send FIFO message with group IDString fifoMessageId = sqsClient.sendMessage(SendMessageRequest.builder()    .queueUrl(fifoQueueUrl)    .messageBody("Order #12345")    .messageGroupId("orders")    .messageDeduplicationId(UUID.randomUUID().toString())    .build()).messageId();
```
```
// Create FIFO queueMap<QueueAttributeName, String> attributes = Map.of(    QueueAttributeName.FIFO_QUEUE, "true",    QueueAttributeName.CONTENT_BASED_DEDUPLICATION, "true");String fifoQueueUrl = sqsClient.createQueue(CreateQueueRequest.builder()    .queueName("my-queue.fifo")    .attributes(attributes)    .build()).queueUrl();// Send FIFO message with group IDString fifoMessageId = sqsClient.sendMessage(SendMessageRequest.builder()    .queueUrl(fifoQueueUrl)    .messageBody("Order #12345")    .messageGroupId("orders")    .messageDeduplicationId(UUID.randomUUID().toString())    .build()).messageId();
```
```
// Create SQS queue for subscriptionString subscriptionQueueUrl = sqsClient.createQueue(CreateQueueRequest.builder()    .queueName("notification-subscriber")    .build()).queueUrl();// Get queue ARNString queueArn = sqsClient.getQueueAttributes(GetQueueAttributesRequest.builder()    .queueUrl(subscriptionQueueUrl)    .attributeNames(QueueAttributeName.QUEUE_ARN)    .build()).attributes().get(QueueAttributeName.QUEUE_ARN);// Subscribe SQS to SNSString subscriptionArn = snsClient.subscribe(SubscribeRequest.builder()    .protocol("sqs")    .endpoint(queueArn)    .topicArn(topicArn)    .build()).subscriptionArn();
```
```
// Create SQS queue for subscriptionString subscriptionQueueUrl = sqsClient.createQueue(CreateQueueRequest.builder()    .queueName("notification-subscriber")    .build()).queueUrl();// Get queue ARNString queueArn = sqsClient.getQueueAttributes(GetQueueAttributesRequest.builder()    .queueUrl(subscriptionQueueUrl)    .attributeNames(QueueAttributeName.QUEUE_ARN)    .build()).attributes().get(QueueAttributeName.QUEUE_ARN);// Subscribe SQS to SNSString subscriptionArn = snsClient.subscribe(SubscribeRequest.builder()    .protocol("sqs")    .endpoint(queueArn)    .topicArn(topicArn)    .build()).subscriptionArn();
```
```
@Service@RequiredArgsConstructorpublic class OrderNotificationService {    private final SnsClient snsClient;    private final ObjectMapper objectMapper;    @Value("${aws.sns.order-topic-arn}")    private String orderTopicArn;    public void sendOrderNotification(Order order) {        try {            String jsonMessage = objectMapper.writeValueAsString(order);            snsClient.publish(PublishRequest.builder()                .topicArn(orderTopicArn)                .subject("New Order Received")                .message(jsonMessage)                .messageAttributes(Map.of(                    "orderType", MessageAttributeValue.builder()                        .dataType("String")                        .stringValue(order.getType())                        .build()))                .build());        } catch (Exception e) {            throw new RuntimeException("Failed to send order notification", e);        }    }}
```
```
@Service@RequiredArgsConstructorpublic class OrderNotificationService {    private final SnsClient snsClient;    private final ObjectMapper objectMapper;    @Value("${aws.sns.order-topic-arn}")    private String orderTopicArn;    public void sendOrderNotification(Order order) {        try {            String jsonMessage = objectMapper.writeValueAsString(order);            snsClient.publish(PublishRequest.builder()                .topicArn(orderTopicArn)                .subject("New Order Received")                .message(jsonMessage)                .messageAttributes(Map.of(                    "orderType", MessageAttributeValue.builder()                        .dataType("String")                        .stringValue(order.getType())                        .build()))                .build());        } catch (Exception e) {            throw new RuntimeException("Failed to send order notification", e);        }    }}
```
```
waitTimeSeconds
```
```
sendMessageBatch
```
```
export AWS_ACCESS_KEY_ID=your-access-keyexport AWS_SECRET_ACCESS_KEY=your-secret-keyexport AWS_REGION=us-east-1
```
```
export AWS_ACCESS_KEY_ID=your-access-keyexport AWS_SECRET_ACCESS_KEY=your-secret-keyexport AWS_REGION=us-east-1
```
```
// Basic client configurationSqsClient sqsClient = SqsClient.builder()    .region(Region.US_EAST_1)    .build();// Advanced client with custom configurationSnsClient snsClient = SnsClient.builder()    .region(Region.US_EAST_1)    .credentialsProvider(DefaultCredentialsProvider.create())    .httpClient(UrlConnectionHttpClient.create())    .build();
```
```
// Basic client configurationSqsClient sqsClient = SqsClient.builder()    .region(Region.US_EAST_1)    .build();// Advanced client with custom configurationSnsClient snsClient = SnsClient.builder()    .region(Region.US_EAST_1)    .credentialsProvider(DefaultCredentialsProvider.create())    .httpClient(UrlConnectionHttpClient.create())    .build();
```
```
SqsClient
```
```
SnsClient
```
```
@Configuration
```
```
@Value
```
```
@Retryable
```
Unlock the full potential of AWS messaging services directly within your coding environment with this expert agent skill. Designed for developers working with Java 2.x, it streamlines the implementation of Amazon SQS and SNS, enabling you to build highly resilient and scalable distributed systems. Whether you're managing message queues, publishing events to topics, or orchestrating complex pub/sub architectures, this skill provides instant access to best practices and code examples. It's an indispensable tool for accelerating development and ensuring robust communication within your cloud-native applications, empowering you to focus on business logic rather than boilerplate.

# When to Use This Skill
- •Building an event-driven microservices architecture using SNS for event distribution and notifications.
- •Implementing a reliable task processing queue with SQS, including dead-letter queueing for failed messages.
- •Integrating existing systems or external applications with AWS using SNS for email, SMS, or SQS-based notifications.
- •Developing Spring Boot applications that interact seamlessly with AWS SQS/SNS for cloud-native messaging patterns.

# Pro Tips
- 💡Always implement idempotent message processing for SQS consumers to prevent duplicate message side effects, especially during retries or scaling events.
- 💡Utilize LocalStack or Testcontainers extensively for robust local development and testing of SQS/SNS integrations, minimizing cloud costs and accelerating feedback cycles.
- 💡For high-throughput or cost-sensitive scenarios, leverage batching operations when sending or receiving messages from SQS/SNS to optimize API calls and reduce latency.

