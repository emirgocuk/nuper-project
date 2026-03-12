# aws-sdk-java-v2-rds
Source: https://antigravity.codes/agent-skills/database/aws-sdk-java-v2-rds

## AI Worker Instructions
When the user requests functionality related to aws-sdk-java-v2-rds, follow these guidelines and utilize this context.

## Scraped Content

# aws-sdk-java-v2-rds
```
RdsClient
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.rds.RdsClient;RdsClient rdsClient = RdsClient.builder()    .region(Region.US_EAST_1)    .build();// Use clientdescribeInstances(rdsClient);// Always close the clientrdsClient.close();
```
```
import software.amazon.awssdk.regions.Region;import software.amazon.awssdk.services.rds.RdsClient;RdsClient rdsClient = RdsClient.builder()    .region(Region.US_EAST_1)    .build();// Use clientdescribeInstances(rdsClient);// Always close the clientrdsClient.close();
```
```
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;import software.amazon.awssdk.http.apache.ApacheHttpClient;RdsClient rdsClient = RdsClient.builder()    .region(Region.US_WEST_2)    .credentialsProvider(ProfileCredentialsProvider.create("myprofile"))    .httpClient(ApacheHttpClient.builder()        .connectionTimeout(Duration.ofSeconds(30))        .socketTimeout(Duration.ofSeconds(60))        .build())    .build();
```
```
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;import software.amazon.awssdk.http.apache.ApacheHttpClient;RdsClient rdsClient = RdsClient.builder()    .region(Region.US_WEST_2)    .credentialsProvider(ProfileCredentialsProvider.create("myprofile"))    .httpClient(ApacheHttpClient.builder()        .connectionTimeout(Duration.ofSeconds(30))        .socketTimeout(Duration.ofSeconds(60))        .build())    .build();
```
```
public static void describeInstances(RdsClient rdsClient) {    try {        DescribeDbInstancesResponse response = rdsClient.describeDBInstances();        List<DBInstance> instanceList = response.dbInstances();        for (DBInstance instance : instanceList) {            System.out.println("Instance ARN: " + instance.dbInstanceArn());            System.out.println("Engine: " + instance.engine());            System.out.println("Status: " + instance.dbInstanceStatus());            System.out.println("Endpoint: " + instance.endpoint().address());            System.out.println("Port: " + instance.endpoint().port());            System.out.println("---");        }    } catch (RdsException e) {        System.err.println(e.getMessage());        System.exit(1);    }}
```
```
public static void describeInstances(RdsClient rdsClient) {    try {        DescribeDbInstancesResponse response = rdsClient.describeDBInstances();        List<DBInstance> instanceList = response.dbInstances();        for (DBInstance instance : instanceList) {            System.out.println("Instance ARN: " + instance.dbInstanceArn());            System.out.println("Engine: " + instance.engine());            System.out.println("Status: " + instance.dbInstanceStatus());            System.out.println("Endpoint: " + instance.endpoint().address());            System.out.println("Port: " + instance.endpoint().port());            System.out.println("---");        }    } catch (RdsException e) {        System.err.println(e.getMessage());        System.exit(1);    }}
```
```
public static String createDBInstance(RdsClient rdsClient,                                     String dbInstanceIdentifier,                                     String dbName,                                     String masterUsername,                                     String masterPassword) {    try {        CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .dbName(dbName)            .engine("postgres")            .engineVersion("14.7")            .dbInstanceClass("db.t3.micro")            .allocatedStorage(20)            .masterUsername(masterUsername)            .masterUserPassword(masterPassword)            .publiclyAccessible(false)            .build();        CreateDbInstanceResponse response = rdsClient.createDBInstance(request);        System.out.println("Creating DB instance: " + response.dbInstance().dbInstanceArn());        return response.dbInstance().dbInstanceArn();    } catch (RdsException e) {        System.err.println("Error creating instance: " + e.getMessage());        throw e;    }}
```
```
public static String createDBInstance(RdsClient rdsClient,                                     String dbInstanceIdentifier,                                     String dbName,                                     String masterUsername,                                     String masterPassword) {    try {        CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .dbName(dbName)            .engine("postgres")            .engineVersion("14.7")            .dbInstanceClass("db.t3.micro")            .allocatedStorage(20)            .masterUsername(masterUsername)            .masterUserPassword(masterPassword)            .publiclyAccessible(false)            .build();        CreateDbInstanceResponse response = rdsClient.createDBInstance(request);        System.out.println("Creating DB instance: " + response.dbInstance().dbInstanceArn());        return response.dbInstance().dbInstanceArn();    } catch (RdsException e) {        System.err.println("Error creating instance: " + e.getMessage());        throw e;    }}
```
```
public static void createDBParameterGroup(RdsClient rdsClient,                                         String groupName,                                         String description) {    try {        CreateDbParameterGroupRequest request = CreateDbParameterGroupRequest.builder()            .dbParameterGroupName(groupName)            .dbParameterGroupFamily("postgres15")            .description(description)            .build();        CreateDbParameterGroupResponse response = rdsClient.createDBParameterGroup(request);        System.out.println("Created parameter group: " + response.dbParameterGroup().dbParameterGroupName());    } catch (RdsException e) {        System.err.println("Error creating parameter group: " + e.getMessage());        throw e;    }}
```
```
public static void createDBParameterGroup(RdsClient rdsClient,                                         String groupName,                                         String description) {    try {        CreateDbParameterGroupRequest request = CreateDbParameterGroupRequest.builder()            .dbParameterGroupName(groupName)            .dbParameterGroupFamily("postgres15")            .description(description)            .build();        CreateDbParameterGroupResponse response = rdsClient.createDBParameterGroup(request);        System.out.println("Created parameter group: " + response.dbParameterGroup().dbParameterGroupName());    } catch (RdsException e) {        System.err.println("Error creating parameter group: " + e.getMessage());        throw e;    }}
```
```
public static String createDBSnapshot(RdsClient rdsClient,                                     String dbInstanceIdentifier,                                     String snapshotIdentifier) {    try {        CreateDbSnapshotRequest request = CreateDbSnapshotRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .dbSnapshotIdentifier(snapshotIdentifier)            .build();        CreateDbSnapshotResponse response = rdsClient.createDBSnapshot(request);        System.out.println("Creating snapshot: " + response.dbSnapshot().dbSnapshotIdentifier());        return response.dbSnapshot().dbSnapshotArn();    } catch (RdsException e) {        System.err.println("Error creating snapshot: " + e.getMessage());        throw e;    }}
```
```
public static String createDBSnapshot(RdsClient rdsClient,                                     String dbInstanceIdentifier,                                     String snapshotIdentifier) {    try {        CreateDbSnapshotRequest request = CreateDbSnapshotRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .dbSnapshotIdentifier(snapshotIdentifier)            .build();        CreateDbSnapshotResponse response = rdsClient.createDBSnapshot(request);        System.out.println("Creating snapshot: " + response.dbSnapshot().dbSnapshotIdentifier());        return response.dbSnapshot().dbSnapshotArn();    } catch (RdsException e) {        System.err.println("Error creating snapshot: " + e.getMessage());        throw e;    }}
```
```
public static void modifyDBInstance(RdsClient rdsClient,                                   String dbInstanceIdentifier,                                   String newInstanceClass) {    try {        ModifyDbInstanceRequest request = ModifyDbInstanceRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .dbInstanceClass(newInstanceClass)            .applyImmediately(false) // Apply during maintenance window            .build();        ModifyDbInstanceResponse response = rdsClient.modifyDBInstance(request);        System.out.println("Modified instance: " + response.dbInstance().dbInstanceIdentifier());        System.out.println("New class: " + response.dbInstance().dbInstanceClass());    } catch (RdsException e) {        System.err.println("Error modifying instance: " + e.getMessage());        throw e;    }}
```
```
public static void modifyDBInstance(RdsClient rdsClient,                                   String dbInstanceIdentifier,                                   String newInstanceClass) {    try {        ModifyDbInstanceRequest request = ModifyDbInstanceRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .dbInstanceClass(newInstanceClass)            .applyImmediately(false) // Apply during maintenance window            .build();        ModifyDbInstanceResponse response = rdsClient.modifyDBInstance(request);        System.out.println("Modified instance: " + response.dbInstance().dbInstanceIdentifier());        System.out.println("New class: " + response.dbInstance().dbInstanceClass());    } catch (RdsException e) {        System.err.println("Error modifying instance: " + e.getMessage());        throw e;    }}
```
```
public static void deleteDBInstanceWithSnapshot(RdsClient rdsClient,                                               String dbInstanceIdentifier,                                               String finalSnapshotIdentifier) {    try {        DeleteDbInstanceRequest request = DeleteDbInstanceRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .skipFinalSnapshot(false)            .finalDBSnapshotIdentifier(finalSnapshotIdentifier)            .build();        DeleteDbInstanceResponse response = rdsClient.deleteDBInstance(request);        System.out.println("Deleting instance: " + response.dbInstance().dbInstanceIdentifier());    } catch (RdsException e) {        System.err.println("Error deleting instance: " + e.getMessage());        throw e;    }}
```
```
public static void deleteDBInstanceWithSnapshot(RdsClient rdsClient,                                               String dbInstanceIdentifier,                                               String finalSnapshotIdentifier) {    try {        DeleteDbInstanceRequest request = DeleteDbInstanceRequest.builder()            .dbInstanceIdentifier(dbInstanceIdentifier)            .skipFinalSnapshot(false)            .finalDBSnapshotIdentifier(finalSnapshotIdentifier)            .build();        DeleteDbInstanceResponse response = rdsClient.deleteDBInstance(request);        System.out.println("Deleting instance: " + response.dbInstance().dbInstanceIdentifier());    } catch (RdsException e) {        System.err.println("Error deleting instance: " + e.getMessage());        throw e;    }}
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .storageEncrypted(true)    .kmsKeyId("arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012")    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .storageEncrypted(true)    .kmsKeyId("arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012")    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .vpcSecurityGroupIds("sg-12345678")    .publiclyAccessible(false)    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .vpcSecurityGroupIds("sg-12345678")    .publiclyAccessible(false)    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .multiAZ(true)    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .multiAZ(true)    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .backupRetentionPeriod(7)    .preferredBackupWindow("03:00-04:00")    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .backupRetentionPeriod(7)    .preferredBackupWindow("03:00-04:00")    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .enableCloudwatchLogsExports("postgresql", "upgrade")    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .enableCloudwatchLogsExports("postgresql", "upgrade")    .build();
```
```
// Development.dbInstanceClass("db.t3.micro")// Production.dbInstanceClass("db.r5.large")
```
```
// Development.dbInstanceClass("db.t3.micro")// Production.dbInstanceClass("db.r5.large")
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .deletionProtection(true)    .build();
```
```
CreateDbInstanceRequest request = CreateDbInstanceRequest.builder()    .deletionProtection(true)    .build();
```
```
try (RdsClient rdsClient = RdsClient.builder()    .region(Region.US_EAST_1)    .build()) {    // Use client} // Automatically closed
```
```
try (RdsClient rdsClient = RdsClient.builder()    .region(Region.US_EAST_1)    .build()) {    // Use client} // Automatically closed
```
```
<dependencies>    <!-- AWS SDK for RDS -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>rds</artifactId>        <version>2.20.0</version> // Use the latest version available    </dependency>    <!-- PostgreSQL Driver -->    <dependency>        <groupId>org.postgresql</groupId>        <artifactId>postgresql</artifactId>        <version>42.6.0</version> // Use the correct version available    </dependency>    <!-- MySQL Driver -->    <dependency>        <groupId>mysql</groupId>        <artifactId>mysql-connector-java</artifactId>        <version>8.0.33</version>    </dependency></dependencies>
```
```
<dependencies>    <!-- AWS SDK for RDS -->    <dependency>        <groupId>software.amazon.awssdk</groupId>        <artifactId>rds</artifactId>        <version>2.20.0</version> // Use the latest version available    </dependency>    <!-- PostgreSQL Driver -->    <dependency>        <groupId>org.postgresql</groupId>        <artifactId>postgresql</artifactId>        <version>42.6.0</version> // Use the correct version available    </dependency>    <!-- MySQL Driver -->    <dependency>        <groupId>mysql</groupId>        <artifactId>mysql-connector-java</artifactId>        <version>8.0.33</version>    </dependency></dependencies>
```
```
dependencies {    // AWS SDK for RDS    implementation 'software.amazon.awssdk:rds:2.20.0'    // PostgreSQL Driver    implementation 'org.postgresql:postgresql:42.6.0'    // MySQL Driver    implementation 'mysql:mysql-connector-java:8.0.33'}
```
```
dependencies {    // AWS SDK for RDS    implementation 'software.amazon.awssdk:rds:2.20.0'    // PostgreSQL Driver    implementation 'org.postgresql:postgresql:42.6.0'    // MySQL Driver    implementation 'mysql:mysql-connector-java:8.0.33'}
```
Elevate your cloud database management capabilities with this essential agent skill, tailored for developers utilizing the AWS SDK for Java 2.x. This skill empowers you to seamlessly interact with Amazon RDS, providing robust solutions for provisioning, maintaining, and monitoring relational database instances. From initial setup of PostgreSQL or MySQL to advanced operations like snapshot management and parameter group configuration, this skill streamlines your development workflow. It’s an invaluable asset for anyone building scalable and reliable applications on AWS, ensuring efficient and error-free database operations right from your coding assistant.

# When to Use This Skill
- •Creating new PostgreSQL, MySQL, or Aurora RDS instances programmatically for new application deployments.
- •Automating database snapshot creation and restoration procedures for disaster recovery or testing environments.
- •Configuring and updating RDS DB parameter groups for performance tuning or security compliance.
- •Integrating serverless functions (like AWS Lambda) with existing RDS databases securely using IAM authentication.
- •Monitoring RDS instance metrics and status to proactively manage database health and performance.

# Pro Tips
- 💡Always close `RdsClient` instances when they are no longer needed to prevent resource leaks and ensure efficient connection management within your application.
- 💡Leverage AWS IAM roles for authenticating your applications or services with RDS instances instead of hardcoding credentials, enhancing security and manageability.
- 💡Implement robust error handling and retry mechanisms, especially for asynchronous RDS operations like instance creation or modification, which can take time and encounter transient issues.
- 💡Utilize AWS CloudWatch for comprehensive monitoring of RDS instances to track performance metrics and set up alerts for critical events.

