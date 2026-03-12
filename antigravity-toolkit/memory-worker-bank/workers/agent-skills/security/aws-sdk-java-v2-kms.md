# aws-sdk-java-v2-kms
Source: https://antigravity.codes/agent-skills/security/aws-sdk-java-v2-kms

## AI Worker Instructions
When the user requests functionality related to aws-sdk-java-v2-kms, follow these guidelines and utilize this context.

## Scraped Content

# aws-sdk-java-v2-kms
```
<dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>kms</artifactId></dependency>
```
```
<dependency>    <groupId>software.amazon.awssdk</groupId>    <artifactId>kms</artifactId></dependency>
```
```
implementation 'software.amazon.awssdk:kms:2.x.x'
```
```
implementation 'software.amazon.awssdk:kms:2.x.x'
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.kms.KmsClient;KmsClient kmsClient = KmsClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.kms.KmsClient;KmsClient kmsClient = KmsClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.services.kms.KmsAsyncClient;KmsAsyncClient kmsAsyncClient = KmsAsyncClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
import software.amazon.awssdk.services.kms.KmsAsyncClient;KmsAsyncClient kmsAsyncClient = KmsAsyncClient.builder()    .region(Region.US_EAST_1)    .build();
```
```
KmsClient kmsClient = KmsClient.builder()    .region(Region.of(System.getenv("AWS_REGION")))    .credentialsProvider(DefaultCredentialsProvider.create())    .overrideConfiguration(c -> c.retryPolicy(RetryPolicy.builder()        .numRetries(3)        .build()))    .build();
```
```
KmsClient kmsClient = KmsClient.builder()    .region(Region.of(System.getenv("AWS_REGION")))    .credentialsProvider(DefaultCredentialsProvider.create())    .overrideConfiguration(c -> c.retryPolicy(RetryPolicy.builder()        .numRetries(3)        .build()))    .build();
```
```
public String createEncryptionKey(KmsClient kmsClient, String description) {    CreateKeyRequest request = CreateKeyRequest.builder()        .description(description)        .keyUsage(KeyUsageType.ENCRYPT_DECRYPT)        .build();    CreateKeyResponse response = kmsClient.createKey(request);    return response.keyMetadata().keyId();}
```
```
public String createEncryptionKey(KmsClient kmsClient, String description) {    CreateKeyRequest request = CreateKeyRequest.builder()        .description(description)        .keyUsage(KeyUsageType.ENCRYPT_DECRYPT)        .build();    CreateKeyResponse response = kmsClient.createKey(request);    return response.keyMetadata().keyId();}
```
```
public KeyMetadata getKeyMetadata(KmsClient kmsClient, String keyId) {    DescribeKeyRequest request = DescribeKeyRequest.builder()        .keyId(keyId)        .build();    return kmsClient.describeKey(request).keyMetadata();}
```
```
public KeyMetadata getKeyMetadata(KmsClient kmsClient, String keyId) {    DescribeKeyRequest request = DescribeKeyRequest.builder()        .keyId(keyId)        .build();    return kmsClient.describeKey(request).keyMetadata();}
```
```
public void toggleKeyState(KmsClient kmsClient, String keyId, boolean enable) {    if (enable) {        kmsClient.enableKey(EnableKeyRequest.builder().keyId(keyId).build());    } else {        kmsClient.disableKey(DisableKeyRequest.builder().keyId(keyId).build());    }}
```
```
public void toggleKeyState(KmsClient kmsClient, String keyId, boolean enable) {    if (enable) {        kmsClient.enableKey(EnableKeyRequest.builder().keyId(keyId).build());    } else {        kmsClient.disableKey(DisableKeyRequest.builder().keyId(keyId).build());    }}
```
```
public String encryptData(KmsClient kmsClient, String keyId, String plaintext) {    SdkBytes plaintextBytes = SdkBytes.fromString(plaintext, StandardCharsets.UTF_8);    EncryptRequest request = EncryptRequest.builder()        .keyId(keyId)        .plaintext(plaintextBytes)        .build();    EncryptResponse response = kmsClient.encrypt(request);    return Base64.getEncoder().encodeToString(        response.ciphertextBlob().asByteArray());}
```
```
public String encryptData(KmsClient kmsClient, String keyId, String plaintext) {    SdkBytes plaintextBytes = SdkBytes.fromString(plaintext, StandardCharsets.UTF_8);    EncryptRequest request = EncryptRequest.builder()        .keyId(keyId)        .plaintext(plaintextBytes)        .build();    EncryptResponse response = kmsClient.encrypt(request);    return Base64.getEncoder().encodeToString(        response.ciphertextBlob().asByteArray());}
```
```
public String decryptData(KmsClient kmsClient, String ciphertextBase64) {    byte[] ciphertext = Base64.getDecoder().decode(ciphertextBase64);    SdkBytes ciphertextBytes = SdkBytes.fromByteArray(ciphertext);    DecryptRequest request = DecryptRequest.builder()        .ciphertextBlob(ciphertextBytes)        .build();    DecryptResponse response = kmsClient.decrypt(request);    return response.plaintext().asString(StandardCharsets.UTF_8);}
```
```
public String decryptData(KmsClient kmsClient, String ciphertextBase64) {    byte[] ciphertext = Base64.getDecoder().decode(ciphertextBase64);    SdkBytes ciphertextBytes = SdkBytes.fromByteArray(ciphertext);    DecryptRequest request = DecryptRequest.builder()        .ciphertextBlob(ciphertextBytes)        .build();    DecryptResponse response = kmsClient.decrypt(request);    return response.plaintext().asString(StandardCharsets.UTF_8);}
```
```
public DataKeyResult encryptWithEnvelope(KmsClient kmsClient, String masterKeyId, byte[] data) {    // Generate data key    GenerateDataKeyRequest keyRequest = GenerateDataKeyRequest.builder()        .keyId(masterKeyId)        .keySpec(DataKeySpec.AES_256)        .build();    GenerateDataKeyResponse keyResponse = kmsClient.generateDataKey(keyRequest);    // Encrypt data with data key    byte[] encryptedData = encryptWithAES(data,        keyResponse.plaintext().asByteArray());    // Clear plaintext key from memory    Arrays.fill(keyResponse.plaintext().asByteArray(), (byte) 0);    return new DataKeyResult(        encryptedData,        keyResponse.ciphertextBlob().asByteArray());}public byte[] decryptWithEnvelope(KmsClient kmsClient,                                  DataKeyResult encryptedEnvelope) {    // Decrypt data key    DecryptRequest keyDecryptRequest = DecryptRequest.builder()        .ciphertextBlob(SdkBytes.fromByteArray(            encryptedEnvelope.encryptedKey()))        .build();    DecryptResponse keyDecryptResponse = kmsClient.decrypt(keyDecryptRequest);    // Decrypt data with decrypted key    byte[] decryptedData = decryptWithAES(        encryptedEnvelope.encryptedData(),        keyDecryptResponse.plaintext().asByteArray());    // Clear plaintext key from memory    Arrays.fill(keyDecryptResponse.plaintext().asByteArray(), (byte) 0);    return decryptedData;}
```
```
public DataKeyResult encryptWithEnvelope(KmsClient kmsClient, String masterKeyId, byte[] data) {    // Generate data key    GenerateDataKeyRequest keyRequest = GenerateDataKeyRequest.builder()        .keyId(masterKeyId)        .keySpec(DataKeySpec.AES_256)        .build();    GenerateDataKeyResponse keyResponse = kmsClient.generateDataKey(keyRequest);    // Encrypt data with data key    byte[] encryptedData = encryptWithAES(data,        keyResponse.plaintext().asByteArray());    // Clear plaintext key from memory    Arrays.fill(keyResponse.plaintext().asByteArray(), (byte) 0);    return new DataKeyResult(        encryptedData,        keyResponse.ciphertextBlob().asByteArray());}public byte[] decryptWithEnvelope(KmsClient kmsClient,                                  DataKeyResult encryptedEnvelope) {    // Decrypt data key    DecryptRequest keyDecryptRequest = DecryptRequest.builder()        .ciphertextBlob(SdkBytes.fromByteArray(            encryptedEnvelope.encryptedKey()))        .build();    DecryptResponse keyDecryptResponse = kmsClient.decrypt(keyDecryptRequest);    // Decrypt data with decrypted key    byte[] decryptedData = decryptWithAES(        encryptedEnvelope.encryptedData(),        keyDecryptResponse.plaintext().asByteArray());    // Clear plaintext key from memory    Arrays.fill(keyDecryptResponse.plaintext().asByteArray(), (byte) 0);    return decryptedData;}
```
```
public String createAndSignData(KmsClient kmsClient, String description, String message) {    // Create signing key    CreateKeyRequest keyRequest = CreateKeyRequest.builder()        .description(description)        .keySpec(KeySpec.RSA_2048)        .keyUsage(KeyUsageType.SIGN_VERIFY)        .build();    CreateKeyResponse keyResponse = kmsClient.createKey(keyRequest);    String keyId = keyResponse.keyMetadata().keyId();    // Sign data    SignRequest signRequest = SignRequest.builder()        .keyId(keyId)        .message(SdkBytes.fromString(message, StandardCharsets.UTF_8))        .signingAlgorithm(SigningAlgorithmSpec.RSASSA_PSS_SHA_256)        .build();    SignResponse signResponse = kmsClient.sign(signRequest);    return Base64.getEncoder().encodeToString(        signResponse.signature().asByteArray());}
```
```
public String createAndSignData(KmsClient kmsClient, String description, String message) {    // Create signing key    CreateKeyRequest keyRequest = CreateKeyRequest.builder()        .description(description)        .keySpec(KeySpec.RSA_2048)        .keyUsage(KeyUsageType.SIGN_VERIFY)        .build();    CreateKeyResponse keyResponse = kmsClient.createKey(keyRequest);    String keyId = keyResponse.keyMetadata().keyId();    // Sign data    SignRequest signRequest = SignRequest.builder()        .keyId(keyId)        .message(SdkBytes.fromString(message, StandardCharsets.UTF_8))        .signingAlgorithm(SigningAlgorithmSpec.RSASSA_PSS_SHA_256)        .build();    SignResponse signResponse = kmsClient.sign(signRequest);    return Base64.getEncoder().encodeToString(        signResponse.signature().asByteArray());}
```
```
public boolean verifySignature(KmsClient kmsClient,                             String keyId,                             String message,                             String signatureBase64) {    byte[] signature = Base64.getDecoder().decode(signatureBase64);    VerifyRequest verifyRequest = VerifyRequest.builder()        .keyId(keyId)        .message(SdkBytes.fromString(message, StandardCharsets.UTF_8))        .signature(SdkBytes.fromByteArray(signature))        .signingAlgorithm(SigningAlgorithmSpec.RSASSA_PSS_SHA_256)        .build();    VerifyResponse verifyResponse = kmsClient.verify(verifyRequest);    return verifyResponse.signatureValid();}
```
```
public boolean verifySignature(KmsClient kmsClient,                             String keyId,                             String message,                             String signatureBase64) {    byte[] signature = Base64.getDecoder().decode(signatureBase64);    VerifyRequest verifyRequest = VerifyRequest.builder()        .keyId(keyId)        .message(SdkBytes.fromString(message, StandardCharsets.UTF_8))        .signature(SdkBytes.fromByteArray(signature))        .signingAlgorithm(SigningAlgorithmSpec.RSASSA_PSS_SHA_256)        .build();    VerifyResponse verifyResponse = kmsClient.verify(verifyRequest);    return verifyResponse.signatureValid();}
```
```
@Configurationpublic class KmsConfiguration {    @Bean    public KmsClient kmsClient() {        return KmsClient.builder()            .region(Region.US_EAST_1)            .build();    }    @Bean    public KmsAsyncClient kmsAsyncClient() {        return KmsAsyncClient.builder()            .region(Region.US_EAST_1)            .build();    }}
```
```
@Configurationpublic class KmsConfiguration {    @Bean    public KmsClient kmsClient() {        return KmsClient.builder()            .region(Region.US_EAST_1)            .build();    }    @Bean    public KmsAsyncClient kmsAsyncClient() {        return KmsAsyncClient.builder()            .region(Region.US_EAST_1)            .build();    }}
```
```
@Service@RequiredArgsConstructorpublic class KmsEncryptionService {    private final KmsClient kmsClient;    @Value("${kms.encryption-key-id}")    private String keyId;    public String encrypt(String plaintext) {        try {            EncryptRequest request = EncryptRequest.builder()                .keyId(keyId)                .plaintext(SdkBytes.fromString(plaintext, StandardCharsets.UTF_8))                .build();            EncryptResponse response = kmsClient.encrypt(request);            return Base64.getEncoder().encodeToString(                response.ciphertextBlob().asByteArray());        } catch (KmsException e) {            throw new RuntimeException("Encryption failed", e);        }    }    public String decrypt(String ciphertextBase64) {        try {            byte[] ciphertext = Base64.getDecoder().decode(ciphertextBase64);            DecryptRequest request = DecryptRequest.builder()                .ciphertextBlob(SdkBytes.fromByteArray(ciphertext))                .build();            DecryptResponse response = kmsClient.decrypt(request);            return response.plaintext().asString(StandardCharsets.UTF_8);        } catch (KmsException e) {            throw new RuntimeException("Decryption failed", e);        }    }}
```
```
@Service@RequiredArgsConstructorpublic class KmsEncryptionService {    private final KmsClient kmsClient;    @Value("${kms.encryption-key-id}")    private String keyId;    public String encrypt(String plaintext) {        try {            EncryptRequest request = EncryptRequest.builder()                .keyId(keyId)                .plaintext(SdkBytes.fromString(plaintext, StandardCharsets.UTF_8))                .build();            EncryptResponse response = kmsClient.encrypt(request);            return Base64.getEncoder().encodeToString(                response.ciphertextBlob().asByteArray());        } catch (KmsException e) {            throw new RuntimeException("Encryption failed", e);        }    }    public String decrypt(String ciphertextBase64) {        try {            byte[] ciphertext = Base64.getDecoder().decode(ciphertextBase64);            DecryptRequest request = DecryptRequest.builder()                .ciphertextBlob(SdkBytes.fromByteArray(ciphertext))                .build();            DecryptResponse response = kmsClient.decrypt(request);            return response.plaintext().asString(StandardCharsets.UTF_8);        } catch (KmsException e) {            throw new RuntimeException("Decryption failed", e);        }    }}
```
```
public class BasicEncryptionExample {    public static void main(String[] args) {        KmsClient kmsClient = KmsClient.builder()            .region(Region.US_EAST_1)            .build();        // Create key        String keyId = createEncryptionKey(kmsClient, "Example encryption key");        System.out.println("Created key: " + keyId);        // Encrypt and decrypt        String plaintext = "Hello, World!";        String encrypted = encryptData(kmsClient, keyId, plaintext);        String decrypted = decryptData(kmsClient, encrypted);        System.out.println("Original: " + plaintext);        System.out.println("Decrypted: " + decrypted);    }}
```
```
public class BasicEncryptionExample {    public static void main(String[] args) {        KmsClient kmsClient = KmsClient.builder()            .region(Region.US_EAST_1)            .build();        // Create key        String keyId = createEncryptionKey(kmsClient, "Example encryption key");        System.out.println("Created key: " + keyId);        // Encrypt and decrypt        String plaintext = "Hello, World!";        String encrypted = encryptData(kmsClient, keyId, plaintext);        String decrypted = decryptData(kmsClient, encrypted);        System.out.println("Original: " + plaintext);        System.out.println("Decrypted: " + decrypted);    }}
```
```
public class EnvelopeEncryptionExample {    public static void main(String[] args) {        KmsClient kmsClient = KmsClient.builder()            .region(Region.US_EAST_1)            .build();        String masterKeyId = "alias/your-master-key";        String largeData = "This is a large amount of data that needs encryption...";        byte[] data = largeData.getBytes(StandardCharsets.UTF_8);        // Encrypt using envelope pattern        DataKeyResult encryptedEnvelope = encryptWithEnvelope(            kmsClient, masterKeyId, data);        // Decrypt        byte[] decryptedData = decryptWithEnvelope(            kmsClient, encryptedEnvelope);        String result = new String(decryptedData, StandardCharsets.UTF_8);        System.out.println("Decrypted: " + result);    }}
```
```
public class EnvelopeEncryptionExample {    public static void main(String[] args) {        KmsClient kmsClient = KmsClient.builder()            .region(Region.US_EAST_1)            .build();        String masterKeyId = "alias/your-master-key";        String largeData = "This is a large amount of data that needs encryption...";        byte[] data = largeData.getBytes(StandardCharsets.UTF_8);        // Encrypt using envelope pattern        DataKeyResult encryptedEnvelope = encryptWithEnvelope(            kmsClient, masterKeyId, data);        // Decrypt        byte[] decryptedData = decryptWithEnvelope(            kmsClient, encryptedEnvelope);        String result = new String(decryptedData, StandardCharsets.UTF_8);        System.out.println("Decrypted: " + result);    }}
```
This specialized agent skill empowers developers to implement robust cryptographic solutions using AWS Key Management Service (KMS) with the latest Java SDK 2.x. It transcends basic API calls, guiding users through advanced patterns for secure key lifecycle management, envelope encryption, and seamless integration into modern Java applications, including Spring Boot. Leveraging this skill ensures your data protection strategies meet industry standards, providing both confidentiality and integrity for sensitive information. Explore best practices for generating data keys, managing access policies, and setting up automated key rotation, solidifying your application's security posture.

# When to Use This Skill
- •Designing and implementing a secure data encryption strategy for a cloud-native Java application.
- •Migrating existing data to AWS S3 with client-side encryption managed by KMS keys.
- •Developing microservices that require digital signatures for transaction verification or data integrity checks.
- •Integrating advanced encryption features into Spring Boot services, such as data at rest encryption for database fields or message queues.

# Pro Tips
- 💡Always follow the principle of least privilege when defining KMS key policies, ensuring only necessary entities have access to cryptographic operations.
- 💡Utilize envelope encryption for large datasets by generating data keys from KMS and encrypting data locally, reducing KMS API costs and latency while maintaining central key management.
- 💡Implement robust error handling and retry mechanisms for KMS API calls, especially when dealing with key availability or throttling limits.

