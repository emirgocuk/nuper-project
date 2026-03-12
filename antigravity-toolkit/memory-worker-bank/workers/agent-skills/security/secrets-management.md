# secrets-management
Source: https://antigravity.codes/agent-skills/security/secrets-management

## AI Worker Instructions
When the user requests functionality related to secrets-management, follow these guidelines and utilize this context.

## Scraped Content

# secrets-management
```
# Start Vault dev servervault server -dev# Set environmentexport VAULT_ADDR='http://127.0.0.1:8200'export VAULT_TOKEN='root'# Enable secrets enginevault secrets enable -path=secret kv-v2# Store secretvault kv put secret/database/config username=admin password=secret
```
```
# Start Vault dev servervault server -dev# Set environmentexport VAULT_ADDR='http://127.0.0.1:8200'export VAULT_TOKEN='root'# Enable secrets enginevault secrets enable -path=secret kv-v2# Store secretvault kv put secret/database/config username=admin password=secret
```
```
name: Deploy with Vault Secretson: [push]jobs:  deploy:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Import Secrets from Vault        uses: hashicorp/vault-action@v2        with:          url: https://vault.example.com:8200          token: ${{ secrets.VAULT_TOKEN }}          secrets: |            secret/data/database username | DB_USERNAME ;            secret/data/database password | DB_PASSWORD ;            secret/data/api key | API_KEY      - name: Use secrets        run: |          echo "Connecting to database as $DB_USERNAME"          # Use $DB_PASSWORD, $API_KEY
```
```
name: Deploy with Vault Secretson: [push]jobs:  deploy:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Import Secrets from Vault        uses: hashicorp/vault-action@v2        with:          url: https://vault.example.com:8200          token: ${{ secrets.VAULT_TOKEN }}          secrets: |            secret/data/database username | DB_USERNAME ;            secret/data/database password | DB_PASSWORD ;            secret/data/api key | API_KEY      - name: Use secrets        run: |          echo "Connecting to database as $DB_USERNAME"          # Use $DB_PASSWORD, $API_KEY
```
```
deploy:  image: vault:latest  before_script:    - export VAULT_ADDR=https://vault.example.com:8200    - export VAULT_TOKEN=$VAULT_TOKEN    - apk add curl jq  script:    - |      DB_PASSWORD=$(vault kv get -field=password secret/database/config)      API_KEY=$(vault kv get -field=key secret/api/credentials)      echo "Deploying with secrets..."      # Use $DB_PASSWORD, $API_KEY
```
```
deploy:  image: vault:latest  before_script:    - export VAULT_ADDR=https://vault.example.com:8200    - export VAULT_TOKEN=$VAULT_TOKEN    - apk add curl jq  script:    - |      DB_PASSWORD=$(vault kv get -field=password secret/database/config)      API_KEY=$(vault kv get -field=key secret/api/credentials)      echo "Deploying with secrets..."      # Use $DB_PASSWORD, $API_KEY
```
```
references/vault-setup.md
```
```
aws secretsmanager create-secret \  --name production/database/password \  --secret-string "super-secret-password"
```
```
aws secretsmanager create-secret \  --name production/database/password \  --secret-string "super-secret-password"
```
```
- name: Configure AWS credentials  uses: aws-actions/configure-aws-credentials@v4  with:    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}    aws-region: us-west-2- name: Get secret from AWS  run: |    SECRET=$(aws secretsmanager get-secret-value \      --secret-id production/database/password \      --query SecretString \      --output text)    echo "::add-mask::$SECRET"    echo "DB_PASSWORD=$SECRET" >> $GITHUB_ENV- name: Use secret  run: |    # Use $DB_PASSWORD    ./deploy.sh
```
```
- name: Configure AWS credentials  uses: aws-actions/configure-aws-credentials@v4  with:    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}    aws-region: us-west-2- name: Get secret from AWS  run: |    SECRET=$(aws secretsmanager get-secret-value \      --secret-id production/database/password \      --query SecretString \      --output text)    echo "::add-mask::$SECRET"    echo "DB_PASSWORD=$SECRET" >> $GITHUB_ENV- name: Use secret  run: |    # Use $DB_PASSWORD    ./deploy.sh
```
```
data "aws_secretsmanager_secret_version" "db_password" {  secret_id = "production/database/password"}resource "aws_db_instance" "main" {  allocated_storage    = 100  engine              = "postgres"  instance_class      = "db.t3.large"  username            = "admin"  password            = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["password"]}
```
```
data "aws_secretsmanager_secret_version" "db_password" {  secret_id = "production/database/password"}resource "aws_db_instance" "main" {  allocated_storage    = 100  engine              = "postgres"  instance_class      = "db.t3.large"  username            = "admin"  password            = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["password"]}
```
```
- name: Use GitHub secret  run: |    echo "API Key: ${{ secrets.API_KEY }}"    echo "Database URL: ${{ secrets.DATABASE_URL }}"
```
```
- name: Use GitHub secret  run: |    echo "API Key: ${{ secrets.API_KEY }}"    echo "Database URL: ${{ secrets.DATABASE_URL }}"
```
```
deploy:  runs-on: ubuntu-latest  environment: production  steps:    - name: Deploy      run: |        echo "Deploying with ${{ secrets.PROD_API_KEY }}"
```
```
deploy:  runs-on: ubuntu-latest  environment: production  steps:    - name: Deploy      run: |        echo "Deploying with ${{ secrets.PROD_API_KEY }}"
```
```
references/github-secrets.md
```
```
deploy:  script:    - echo "Deploying with $API_KEY"    - echo "Database: $DATABASE_URL"
```
```
deploy:  script:    - echo "Deploying with $API_KEY"    - echo "Database: $DATABASE_URL"
```
```
import boto3import jsondef lambda_handler(event, context):    client = boto3.client('secretsmanager')    # Get current secret    response = client.get_secret_value(SecretId='my-secret')    current_secret = json.loads(response['SecretString'])    # Generate new password    new_password = generate_strong_password()    # Update database password    update_database_password(new_password)    # Update secret    client.put_secret_value(        SecretId='my-secret',        SecretString=json.dumps({            'username': current_secret['username'],            'password': new_password        })    )    return {'statusCode': 200}
```
```
import boto3import jsondef lambda_handler(event, context):    client = boto3.client('secretsmanager')    # Get current secret    response = client.get_secret_value(SecretId='my-secret')    current_secret = json.loads(response['SecretString'])    # Generate new password    new_password = generate_strong_password()    # Update database password    update_database_password(new_password)    # Update secret    client.put_secret_value(        SecretId='my-secret',        SecretString=json.dumps({            'username': current_secret['username'],            'password': new_password        })    )    return {'statusCode': 200}
```
```
apiVersion: external-secrets.io/v1beta1kind: SecretStoremetadata:  name: vault-backend  namespace: productionspec:  provider:    vault:      server: "https://vault.example.com:8200"      path: "secret"      version: "v2"      auth:        kubernetes:          mountPath: "kubernetes"          role: "production"---apiVersion: external-secrets.io/v1beta1kind: ExternalSecretmetadata:  name: database-credentials  namespace: productionspec:  refreshInterval: 1h  secretStoreRef:    name: vault-backend    kind: SecretStore  target:    name: database-credentials    creationPolicy: Owner  data:    - secretKey: username      remoteRef:        key: database/config        property: username    - secretKey: password      remoteRef:        key: database/config        property: password
```
```
apiVersion: external-secrets.io/v1beta1kind: SecretStoremetadata:  name: vault-backend  namespace: productionspec:  provider:    vault:      server: "https://vault.example.com:8200"      path: "secret"      version: "v2"      auth:        kubernetes:          mountPath: "kubernetes"          role: "production"---apiVersion: external-secrets.io/v1beta1kind: ExternalSecretmetadata:  name: database-credentials  namespace: productionspec:  refreshInterval: 1h  secretStoreRef:    name: vault-backend    kind: SecretStore  target:    name: database-credentials    creationPolicy: Owner  data:    - secretKey: username      remoteRef:        key: database/config        property: username    - secretKey: password      remoteRef:        key: database/config        property: password
```
```
#!/bin/bash# .git/hooks/pre-commit# Check for secrets with TruffleHogdocker run --rm -v "$(pwd):/repo" \  trufflesecurity/trufflehog:latest \  filesystem --directory=/repoif [ $? -ne 0 ]; then  echo "❌ Secret detected! Commit blocked."  exit 1fi
```
```
#!/bin/bash# .git/hooks/pre-commit# Check for secrets with TruffleHogdocker run --rm -v "$(pwd):/repo" \  trufflesecurity/trufflehog:latest \  filesystem --directory=/repoif [ $? -ne 0 ]; then  echo "❌ Secret detected! Commit blocked."  exit 1fi
```
```
secret-scan:  stage: security  image: trufflesecurity/trufflehog:latest  script:    - trufflehog filesystem .  allow_failure: false
```
```
secret-scan:  stage: security  image: trufflesecurity/trufflehog:latest  script:    - trufflehog filesystem .  allow_failure: false
```
```
references/vault-setup.md
```
```
references/github-secrets.md
```
```
github-actions-templates
```
```
gitlab-ci-patterns
```
```
deployment-pipeline-design
```
In today's complex development landscape, safeguarding sensitive information is paramount. The 'Secrets Management' agent skill empowers your AI assistant to architect robust solutions for handling credentials, API keys, and certificates across your CI/CD pipelines. It provides expert guidance on integrating industry-leading tools like HashiCorp Vault, AWS Secrets Manager, and other cloud-native solutions, ensuring that no sensitive data is ever hardcoded. Leverage this skill to implement dynamic secret generation, automated rotation, and least-privilege access, significantly enhancing your application's security posture and compliance with best practices. Build with confidence, knowing your secrets are protected.

# When to Use This Skill
- •Storing and retrieving API keys, database credentials, and other sensitive configurations securely within CI/CD pipelines.
- •Automating the rotation of secrets (e.g., database passwords, API tokens) to minimize exposure risks and maintain compliance.
- •Securing CI/CD environments by preventing hardcoded sensitive information in source code or configuration files.
- •Implementing fine-grained access control and audit logging for sensitive resources across development stages.

# Pro Tips
- 💡Always integrate your secrets management solution with your existing IAM/RBAC systems to enforce the principle of least-privilege access for all secrets.
- 💡Automate secret rotation as frequently as possible, even for less critical secrets, to significantly reduce the window of vulnerability.
- 💡Regularly audit secret access logs and usage patterns to detect unusual activity or potential breaches and ensure compliance with security policies.

