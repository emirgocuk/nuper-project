# snowflake-platform
Source: https://antigravity.codes/agent-skills/backend/snowflake-platform

## AI Worker Instructions
When the user requests functionality related to snowflake-platform, follow these guidelines and utilize this context.

## Scraped Content

# snowflake-platform
```
pip install snowflake-clisnow --version  # Should show 3.14.0+
```
```
pip install snowflake-clisnow --version  # Should show 3.14.0+
```
```
# Interactive setupsnow connection add# Or create ~/.snowflake/config.toml manually
```
```
# Interactive setupsnow connection add# Or create ~/.snowflake/config.toml manually
```
```
[connections.default]account = "orgname-accountname"user = "USERNAME"authenticator = "SNOWFLAKE_JWT"private_key_path = "~/.snowflake/rsa_key.p8"
```
```
[connections.default]account = "orgname-accountname"user = "USERNAME"authenticator = "SNOWFLAKE_JWT"private_key_path = "~/.snowflake/rsa_key.p8"
```
```
snow connection test -c defaultsnow sql -q "SELECT CURRENT_USER(), CURRENT_ACCOUNT()"
```
```
snow connection test -c defaultsnow sql -q "SELECT CURRENT_USER(), CURRENT_ACCOUNT()"
```
```
streamlit-snowflake
```
```
SNOWFLAKE.CORTEX
```
```
COMPLETE
```
```
AI_COMPLETE
```
```
SUMMARIZE
```
```
AI_SUMMARIZE
```
```
TRANSLATE
```
```
AI_TRANSLATE
```
```
SENTIMENT
```
```
AI_SENTIMENT
```
```
AI_FILTER
```
```
AI_CLASSIFY
```
```
AI_AGG
```
```
-- Simple promptSELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    'Explain quantum computing in one sentence') AS response;-- With conversation historySELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    [        {'role': 'system', 'content': 'You are a helpful assistant'},        {'role': 'user', 'content': 'What is Snowflake?'}    ]) AS response;-- With optionsSELECT SNOWFLAKE.CORTEX.COMPLETE(    'mistral-large2',    'Summarize this document',    {'temperature': 0.3, 'max_tokens': 500}) AS response;
```
```
-- Simple promptSELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    'Explain quantum computing in one sentence') AS response;-- With conversation historySELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    [        {'role': 'system', 'content': 'You are a helpful assistant'},        {'role': 'user', 'content': 'What is Snowflake?'}    ]) AS response;-- With optionsSELECT SNOWFLAKE.CORTEX.COMPLETE(    'mistral-large2',    'Summarize this document',    {'temperature': 0.3, 'max_tokens': 500}) AS response;
```
```
llama3.1-70b
```
```
llama3.1-8b
```
```
llama3.2-3b
```
```
mistral-large2
```
```
mistral-7b
```
```
snowflake-arctic
```
```
gemma-7b
```
```
claude-3-5-sonnet
```
```
Input exceeds context window limit
```
```
-- Single textSELECT SNOWFLAKE.CORTEX.SUMMARIZE(article_text) AS summaryFROM articlesLIMIT 10;-- Aggregate across rows (no context window limit)SELECT AI_SUMMARIZE_AGG(review_text) AS all_reviews_summaryFROM product_reviewsWHERE product_id = 123;
```
```
-- Single textSELECT SNOWFLAKE.CORTEX.SUMMARIZE(article_text) AS summaryFROM articlesLIMIT 10;-- Aggregate across rows (no context window limit)SELECT AI_SUMMARIZE_AGG(review_text) AS all_reviews_summaryFROM product_reviewsWHERE product_id = 123;
```
```
-- Translate to English (auto-detect source)SELECT SNOWFLAKE.CORTEX.TRANSLATE(    review_text,    '',      -- Empty = auto-detect source language    'en'     -- Target language) AS translatedFROM international_reviews;-- Explicit source languageSELECT AI_TRANSLATE(    description,    'es',    -- Source: Spanish    'en'     -- Target: English) AS translatedFROM spanish_products;
```
```
-- Translate to English (auto-detect source)SELECT SNOWFLAKE.CORTEX.TRANSLATE(    review_text,    '',      -- Empty = auto-detect source language    'en'     -- Target language) AS translatedFROM international_reviews;-- Explicit source languageSELECT AI_TRANSLATE(    description,    'es',    -- Source: Spanish    'en'     -- Target: English) AS translatedFROM spanish_products;
```
```
-- Filter with plain EnglishSELECT * FROM customer_feedbackWHERE AI_FILTER(    feedback_text,    'mentions shipping problems or delivery delays');-- Combine with SQL predicates for maximum optimization-- Query planner applies standard filters FIRST, then AI on smaller datasetSELECT * FROM support_ticketsWHERE created_date > '2025-01-01'  -- Standard filter applied first  AND AI_FILTER(description, 'customer is angry or frustrated');
```
```
-- Filter with plain EnglishSELECT * FROM customer_feedbackWHERE AI_FILTER(    feedback_text,    'mentions shipping problems or delivery delays');-- Combine with SQL predicates for maximum optimization-- Query planner applies standard filters FIRST, then AI on smaller datasetSELECT * FROM support_ticketsWHERE created_date > '2025-01-01'  -- Standard filter applied first  AND AI_FILTER(description, 'customer is angry or frustrated');
```
```
-- Categorize support ticketsSELECT    ticket_id,    AI_CLASSIFY(        description,        ['billing', 'technical', 'shipping', 'other']    ) AS categoryFROM support_tickets;
```
```
-- Categorize support ticketsSELECT    ticket_id,    AI_CLASSIFY(        description,        ['billing', 'technical', 'shipping', 'other']    ) AS categoryFROM support_tickets;
```
```
-- This seemingly simple query can be expensive at scaleSELECT    product_id,    AI_COMPLETE('mistral-large2', 'Summarize: ' || review_text) as summaryFROM product_reviews  -- 1 billion rowsWHERE created_date > '2024-01-01';-- Cost = (input tokens + output tokens) × row count × model rate-- At scale, this adds up fast
```
```
-- This seemingly simple query can be expensive at scaleSELECT    product_id,    AI_COMPLETE('mistral-large2', 'Summarize: ' || review_text) as summaryFROM product_reviews  -- 1 billion rowsWHERE created_date > '2024-01-01';-- Cost = (input tokens + output tokens) × row count × model rate-- At scale, this adds up fast
```
```
irjoewf-wq46213
```
```
NZ90655
```
```
iss
```
```
sub
```
```
SELECT CURRENT_ACCOUNT();  -- Returns: NZ90655
```
```
SELECT CURRENT_ACCOUNT();  -- Returns: NZ90655
```
```
# Generate private key (PKCS#8 format required)openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out ~/.snowflake/rsa_key.p8 -nocrypt# Generate public keyopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -out ~/.snowflake/rsa_key.pub# Get fingerprint for JWT claimsopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -outform DER | \  openssl dgst -sha256 -binary | openssl enc -base64
```
```
# Generate private key (PKCS#8 format required)openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out ~/.snowflake/rsa_key.p8 -nocrypt# Generate public keyopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -out ~/.snowflake/rsa_key.pub# Get fingerprint for JWT claimsopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -outform DER | \  openssl dgst -sha256 -binary | openssl enc -base64
```
```
-- In Snowflake worksheet (requires ACCOUNTADMIN or SECURITYADMIN)ALTER USER my_user SET RSA_PUBLIC_KEY='MIIBIjANBgkq...';
```
```
-- In Snowflake worksheet (requires ACCOUNTADMIN or SECURITYADMIN)ALTER USER my_user SET RSA_PUBLIC_KEY='MIIBIjANBgkq...';
```
```
iss: ACCOUNT_LOCATOR.USERNAME.SHA256:fingerprintsub: ACCOUNT_LOCATOR.USERNAME
```
```
iss: ACCOUNT_LOCATOR.USERNAME.SHA256:fingerprintsub: ACCOUNT_LOCATOR.USERNAME
```
```
iss: NZ90655.JEZWEB.SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=sub: NZ90655.JEZWEB
```
```
iss: NZ90655.JEZWEB.SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=sub: NZ90655.JEZWEB
```
```
# No special configuration needed inside SPCS containersimport snowflake.connector# Auto-detects SPCS_TOKEN environment variableconn = snowflake.connector.connect()
```
```
# No special configuration needed inside SPCS containersimport snowflake.connector# Auto-detects SPCS_TOKEN environment variableconn = snowflake.connector.connect()
```
```
# Initialize projectsnow init# Execute SQLsnow sql -q "SELECT 1"snow sql -f query.sql# View logssnow logs
```
```
# Initialize projectsnow init# Execute SQLsnow sql -q "SELECT 1"snow sql -f query.sql# View logssnow logs
```
```
# Developmentsnow app run              # Deploy and run locallysnow app deploy           # Upload to stage onlysnow app teardown         # Remove app# Versioningsnow app version create V1_0snow app version listsnow app version drop V1_0# Publishingsnow app publish --version V1_0 --patch 0# Release Channelssnow app release-channel listsnow app release-channel add-version --channel ALPHA --version V1_0snow app release-directive set default --version V1_0 --patch 0 --channel DEFAULT
```
```
# Developmentsnow app run              # Deploy and run locallysnow app deploy           # Upload to stage onlysnow app teardown         # Remove app# Versioningsnow app version create V1_0snow app version listsnow app version drop V1_0# Publishingsnow app publish --version V1_0 --patch 0# Release Channelssnow app release-channel listsnow app release-channel add-version --channel ALPHA --version V1_0snow app release-directive set default --version V1_0 --patch 0 --channel DEFAULT
```
```
snow streamlit deploy --replacesnow streamlit deploy --replace --open
```
```
snow streamlit deploy --replacesnow streamlit deploy --replace --open
```
```
snow stage listsnow stage copy @my_stage/file.txt ./local/
```
```
snow stage listsnow stage copy @my_stage/file.txt ./local/
```
```
my_native_app/├── snowflake.yml           # Project config├── manifest.yml            # App manifest├── setup_script.sql        # Installation script├── app/│   └── streamlit/│       ├── environment.yml│       └── streamlit_app.py└── scripts/    └── setup.sql
```
```
my_native_app/├── snowflake.yml           # Project config├── manifest.yml            # App manifest├── setup_script.sql        # Installation script├── app/│   └── streamlit/│       ├── environment.yml│       └── streamlit_app.py└── scripts/    └── setup.sql
```
```
definition_version: 2native_app:  name: my_app  package:    name: my_app_pkg    distribution: external    # For marketplace  application:    name: my_app  source_stage: stage/dev  artifacts:    - src: manifest.yml      dest: manifest.yml    - src: setup_script.sql      dest: setup_script.sql    - src: app/streamlit/environment.yml      dest: streamlit/environment.yml    - src: app/streamlit/streamlit_app.py      dest: streamlit/streamlit_app.py  enable_release_channels: true  # For ALPHA/BETA channels
```
```
definition_version: 2native_app:  name: my_app  package:    name: my_app_pkg    distribution: external    # For marketplace  application:    name: my_app  source_stage: stage/dev  artifacts:    - src: manifest.yml      dest: manifest.yml    - src: setup_script.sql      dest: setup_script.sql    - src: app/streamlit/environment.yml      dest: streamlit/environment.yml    - src: app/streamlit/streamlit_app.py      dest: streamlit/streamlit_app.py  enable_release_channels: true  # For ALPHA/BETA channels
```
```
manifest_version: 1artifacts:  setup_script: setup_script.sql  default_streamlit: streamlit/streamlit_app.py# Note: Do NOT include privileges section - Native Apps can't declare privileges
```
```
manifest_version: 1artifacts:  setup_script: setup_script.sql  default_streamlit: streamlit/streamlit_app.py# Note: Do NOT include privileges section - Native Apps can't declare privileges
```
```
-- 1. Create network rule (in a real database, NOT app package)CREATE DATABASE IF NOT EXISTS MY_APP_UTILS;CREATE OR REPLACE NETWORK RULE MY_APP_UTILS.PUBLIC.api_rule  MODE = EGRESS  TYPE = HOST_PORT  VALUE_LIST = ('api.example.com:443');-- 2. Create integrationCREATE OR REPLACE EXTERNAL ACCESS INTEGRATION my_app_integration  ALLOWED_NETWORK_RULES = (MY_APP_UTILS.PUBLIC.api_rule)  ENABLED = TRUE;-- 3. Grant to appGRANT USAGE ON INTEGRATION my_app_integration  TO APPLICATION MY_APP;-- 4. CRITICAL: Attach to Streamlit (must repeat after EVERY deploy!)ALTER STREAMLIT MY_APP.config_schema.my_streamlit  SET EXTERNAL_ACCESS_INTEGRATIONS = (my_app_integration);
```
```
-- 1. Create network rule (in a real database, NOT app package)CREATE DATABASE IF NOT EXISTS MY_APP_UTILS;CREATE OR REPLACE NETWORK RULE MY_APP_UTILS.PUBLIC.api_rule  MODE = EGRESS  TYPE = HOST_PORT  VALUE_LIST = ('api.example.com:443');-- 2. Create integrationCREATE OR REPLACE EXTERNAL ACCESS INTEGRATION my_app_integration  ALLOWED_NETWORK_RULES = (MY_APP_UTILS.PUBLIC.api_rule)  ENABLED = TRUE;-- 3. Grant to appGRANT USAGE ON INTEGRATION my_app_integration  TO APPLICATION MY_APP;-- 4. CRITICAL: Attach to Streamlit (must repeat after EVERY deploy!)ALTER STREAMLIT MY_APP.config_schema.my_streamlit  SET EXTERNAL_ACCESS_INTEGRATIONS = (my_app_integration);
```
```
snow app run
```
```
-- 1. Create shared_data schema in app packageCREATE SCHEMA IF NOT EXISTS MY_APP_PKG.SHARED_DATA;-- 2. Create views referencing external databaseCREATE OR REPLACE VIEW MY_APP_PKG.SHARED_DATA.MY_VIEW ASSELECT * FROM EXTERNAL_DB.SCHEMA.TABLE;-- 3. Grant REFERENCE_USAGE (CRITICAL!)GRANT REFERENCE_USAGE ON DATABASE EXTERNAL_DB  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;-- 4. Grant access to shareGRANT USAGE ON SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;GRANT SELECT ON ALL VIEWS IN SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;
```
```
-- 1. Create shared_data schema in app packageCREATE SCHEMA IF NOT EXISTS MY_APP_PKG.SHARED_DATA;-- 2. Create views referencing external databaseCREATE OR REPLACE VIEW MY_APP_PKG.SHARED_DATA.MY_VIEW ASSELECT * FROM EXTERNAL_DB.SCHEMA.TABLE;-- 3. Grant REFERENCE_USAGE (CRITICAL!)GRANT REFERENCE_USAGE ON DATABASE EXTERNAL_DB  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;-- 4. Grant access to shareGRANT USAGE ON SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;GRANT SELECT ON ALL VIEWS IN SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;
```
```
setup_script.sql
```
```
shared_data.view_name
```
```
# 1. Deploy appsnow app run# 2. Create versionsnow app version create V1_0# 3. Check security review statussnow app version list# Wait for review_status = APPROVED# 4. Set release directivesnow app release-directive set default --version V1_0 --patch 0 --channel DEFAULT# 5. Create listing in Snowsight Provider Studio (UI only)
```
```
# 1. Deploy appsnow app run# 2. Create versionsnow app version create V1_0# 3. Check security review statussnow app version list# Wait for review_status = APPROVED# 4. Set release directivesnow app release-directive set default --version V1_0 --patch 0 --channel DEFAULT# 5. Create listing in Snowsight Provider Studio (UI only)
```
```
NOT_REVIEWED
```
```
IN_PROGRESS
```
```
APPROVED
```
```
REJECTED
```
```
MANUAL_REVIEW
```
```
from snowflake.snowpark import Sessionconnection_params = {    "account": "orgname-accountname",    "user": "USERNAME",    "password": "PASSWORD",  # Or use private_key_path    "warehouse": "COMPUTE_WH",    "database": "MY_DB",    "schema": "PUBLIC"}session = Session.builder.configs(connection_params).create()
```
```
from snowflake.snowpark import Sessionconnection_params = {    "account": "orgname-accountname",    "user": "USERNAME",    "password": "PASSWORD",  # Or use private_key_path    "warehouse": "COMPUTE_WH",    "database": "MY_DB",    "schema": "PUBLIC"}session = Session.builder.configs(connection_params).create()
```
```
# Read tabledf = session.table("MY_TABLE")# Filter and selectresult = df.filter(df["STATUS"] == "ACTIVE") \           .select("ID", "NAME", "CREATED_AT") \           .sort("CREATED_AT", ascending=False)# Executeresult.show()# Collect to Pythonrows = result.collect()
```
```
# Read tabledf = session.table("MY_TABLE")# Filter and selectresult = df.filter(df["STATUS"] == "ACTIVE") \           .select("ID", "NAME", "CREATED_AT") \           .sort("CREATED_AT", ascending=False)# Executeresult.show()# Collect to Pythonrows = result.collect()
```
```
# WRONG - dict() doesn't work on Snowpark Rowconfig = dict(result[0])# CORRECT - Access columns explicitlyrow = result[0]config = {    'COLUMN_A': row['COLUMN_A'],    'COLUMN_B': row['COLUMN_B'],}
```
```
# WRONG - dict() doesn't work on Snowpark Rowconfig = dict(result[0])# CORRECT - Access columns explicitlyrow = result[0]config = {    'COLUMN_A': row['COLUMN_A'],    'COLUMN_B': row['COLUMN_B'],}
```
```
SnowflakeCursor.stats
```
```
rowcount
```
```
# Before v4.2.0 - rowcount returns -1 for CTAScursor.execute("CREATE TABLE new_table AS SELECT * FROM source WHERE active = true")print(cursor.rowcount)  # Returns -1 (not helpful!)# After v4.2.0 - stats property shows actual row countscursor.execute("CREATE TABLE new_table AS SELECT * FROM source WHERE active = true")print(cursor.stats)  # Returns {'rows_inserted': 1234, 'duplicates': 0, ...}
```
```
# Before v4.2.0 - rowcount returns -1 for CTAScursor.execute("CREATE TABLE new_table AS SELECT * FROM source WHERE active = true")print(cursor.rowcount)  # Returns -1 (not helpful!)# After v4.2.0 - stats property shows actual row countscursor.execute("CREATE TABLE new_table AS SELECT * FROM source WHERE active = true")print(cursor.stats)  # Returns {'rows_inserted': 1234, 'duplicates': 0, ...}
```
```
from snowflake.snowpark.functions import udf, sproc# Register UDF@udf(name="my_udf", replace=True)def my_udf(x: int) -> int:    return x * 2# Register Stored Procedure@sproc(name="my_sproc", replace=True)def my_sproc(session: Session, table_name: str) -> str:    df = session.table(table_name)    count = df.count()    return f"Row count: {count}"
```
```
from snowflake.snowpark.functions import udf, sproc# Register UDF@udf(name="my_udf", replace=True)def my_udf(x: int) -> int:    return x * 2# Register Stored Procedure@sproc(name="my_sproc", replace=True)def my_sproc(session: Session, table_name: str) -> str:    df = session.table(table_name)    count = df.count()    return f"Row count: {count}"
```
```
https://{org-account}.snowflakecomputing.com/api/v2/statements
```
```
https://{org-account}.snowflakecomputing.com/api/v2/statements
```
```
Accept
```
```
const headers = {  'Authorization': Bearer ${jwt},  'Content-Type': 'application/json',  'Accept': 'application/json',  // REQUIRED - "null" error if missing  'User-Agent': 'MyApp/1.0',};
```
```
const headers = {  'Authorization': Bearer ${jwt},  'Content-Type': 'application/json',  'Accept': 'application/json',  // REQUIRED - "null" error if missing  'User-Agent': 'MyApp/1.0',};
```
```
Bearer ${jwt}
```
```
// Submit returns statementHandle, not resultsconst submit = await fetch(url, { method: 'POST', headers, body });const { statementHandle } = await submit.json();// Poll until completewhile (true) {  const status = await fetch(${url}/${statementHandle}, { headers });  if (status.status === 200) break;  // Complete  if (status.status === 202) {    await sleep(2000);  // Still running    continue;  }}
```
```
// Submit returns statementHandle, not resultsconst submit = await fetch(url, { method: 'POST', headers, body });const { statementHandle } = await submit.json();// Poll until completewhile (true) {  const status = await fetch(${url}/${statementHandle}, { headers });  if (status.status === 200) break;  // Complete  if (status.status === 202) {    await sleep(2000);  // Still running    continue;  }}
```
```
${url}/${statementHandle}
```
```
fetch()
```
```
const response = await fetch(url, {  signal: AbortSignal.timeout(30000),  // 30 seconds  headers,});
```
```
const response = await fetch(url, {  signal: AbortSignal.timeout(30000),  // 30 seconds  headers,});
```
```
POST /api/v2/statements/{statementHandle}/cancel
```
```
POST /api/v2/statements/{statementHandle}/cancel
```
```
templates/snowflake-rest-client.ts
```
```
SELECT CURRENT_ACCOUNT()
```
```
snow app run
```
```
ALTER STREAMLIT ... SET EXTERNAL_ACCESS_INTEGRATIONS
```
```
ALTER APPLICATION PACKAGE ... SET DEFAULT RELEASE DIRECTIVE
```
```
snow app release-directive set default --version V1_0 --patch 0 --channel DEFAULT
```
```
streamlit/streamlit/
```
```
streamlit/
```
```
GRANT REFERENCE_USAGE ON DATABASE
```
```
snow app run
```
```
Accept: application/json
```
```
fetch()
```
```
AbortSignal.timeout(30000)
```
```
090001
```
```
POST /api/v2/warehouses/{wh}:resume
```
```
SessionManager
```
```
defaultdict
```
```
SnowflakeRestful.fetch()
```
```
# AVOID - creates new connection each iterationfor i in range(1000):    conn = snowflake.connector.connect(...)    cursor = conn.cursor()    cursor.execute("SELECT 1")    cursor.close()    conn.close()# BETTER - reuse connectionconn = snowflake.connector.connect(...)cursor = conn.cursor()for i in range(1000):    cursor.execute("SELECT 1")cursor.close()conn.close()
```
```
# AVOID - creates new connection each iterationfor i in range(1000):    conn = snowflake.connector.connect(...)    cursor = conn.cursor()    cursor.execute("SELECT 1")    cursor.close()    conn.close()# BETTER - reuse connectionconn = snowflake.connector.connect(...)cursor = conn.cursor()for i in range(1000):    cursor.execute("SELECT 1")cursor.close()conn.close()
```
```
import timeimport snowflake.connectordef execute_with_retry(cursor, query, max_retries=3):    for attempt in range(max_retries):        try:            return cursor.execute(query).fetchall()        except snowflake.connector.errors.DatabaseError as e:            if "throttled" in str(e).lower() and attempt < max_retries - 1:                wait_time = 2 ** attempt  # Exponential backoff                time.sleep(wait_time)            else:                raise
```
```
import timeimport snowflake.connectordef execute_with_retry(cursor, query, max_retries=3):    for attempt in range(max_retries):        try:            return cursor.execute(query).fetchall()        except snowflake.connector.errors.DatabaseError as e:            if "throttled" in str(e).lower() and attempt < max_retries - 1:                wait_time = 2 ** attempt  # Exponential backoff                time.sleep(wait_time)            else:                raise
```
```
streamlit-snowflake
```
```
irjoewf-wq46213
```
```
NZ90655
```
```
iss
```
```
sub
```
```
SNOWFLAKE_ACCOUNT
```
```
SNOWFLAKE_ACCOUNT_URL
```
```
SNOWFLAKE_ACCOUNT_LOCATOR
```
```
irjoewf-wq46213
```
```
NZ90655
```
```
SELECT CURRENT_ACCOUNT()
```
```
SELECT CURRENT_ACCOUNT();  -- Returns account locator (e.g., NZ90655)
```
```
SELECT CURRENT_ACCOUNT();  -- Returns account locator (e.g., NZ90655)
```
```
snow sql -q "SELECT CURRENT_USER(), CURRENT_ACCOUNT(), CURRENT_REGION()" -c your_connection
```
```
snow sql -q "SELECT CURRENT_USER(), CURRENT_ACCOUNT(), CURRENT_REGION()" -c your_connection
```
```
iss: ACCOUNT_LOCATOR.USERNAME.SHA256:fingerprintsub: ACCOUNT_LOCATOR.USERNAME
```
```
iss: ACCOUNT_LOCATOR.USERNAME.SHA256:fingerprintsub: ACCOUNT_LOCATOR.USERNAME
```
```
iss: NZ90655.JEZWEB.SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=sub: NZ90655.JEZWEB
```
```
iss: NZ90655.JEZWEB.SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=sub: NZ90655.JEZWEB
```
```
https://irjoewf-wq46213.snowflakecomputing.com/api/v2/statements
```
```
https://irjoewf-wq46213.snowflakecomputing.com/api/v2/statements
```
```
# Generate key pair (PKCS#8 format required)openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out ~/.snowflake/rsa_key.p8 -nocryptopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -out ~/.snowflake/rsa_key.pub# Get fingerprintopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -outform DER | openssl dgst -sha256 -binary | openssl enc -base64# Register with Snowflake userALTER USER my_user SET RSA_PUBLIC_KEY='MIIBIj...';
```
```
# Generate key pair (PKCS#8 format required)openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out ~/.snowflake/rsa_key.p8 -nocryptopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -out ~/.snowflake/rsa_key.pub# Get fingerprintopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -outform DER | openssl dgst -sha256 -binary | openssl enc -base64# Register with Snowflake userALTER USER my_user SET RSA_PUBLIC_KEY='MIIBIj...';
```
```
SELECT CURRENT_ACCOUNT()
```
```
SNOWFLAKE.CORTEX
```
```
CORTEX.COMPLETE(...)
```
```
SNOWFLAKE.CORTEX.COMPLETE(...)
```
```
COMPLETE(...)
```
```
SNOWFLAKE.CORTEX.COMPLETE(...)
```
```
SNOWFLAKE.CORTEX.COMPLETE
```
```
AI_COMPLETE
```
```
SNOWFLAKE.CORTEX.SUMMARIZE
```
```
AI_SUMMARIZE
```
```
SNOWFLAKE.CORTEX.TRANSLATE
```
```
AI_TRANSLATE
```
```
SNOWFLAKE.CORTEX.SENTIMENT
```
```
AI_SENTIMENT
```
```
gpt-4
```
```
claude-3
```
```
llama3.1-70b
```
```
mistral-large2
```
```
snowflake-arctic
```
```
llama3.1-70b
```
```
llama3.1-8b
```
```
llama3.2-3b
```
```
mistral-large2
```
```
mistral-7b
```
```
snowflake-arctic
```
```
gemma-7b
```
```
-- Simple prompt (string)SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3.1-70b', 'Your prompt here');-- With conversation history (array of objects)SELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    [        {'role': 'system', 'content': 'You are helpful'},        {'role': 'user', 'content': 'Hello'}    ]);-- With options (temperature, max_tokens)SELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    'Prompt',    {'temperature': 0.3, 'max_tokens': 500});
```
```
-- Simple prompt (string)SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3.1-70b', 'Your prompt here');-- With conversation history (array of objects)SELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    [        {'role': 'system', 'content': 'You are helpful'},        {'role': 'user', 'content': 'Hello'}    ]);-- With options (temperature, max_tokens)SELECT SNOWFLAKE.CORTEX.COMPLETE(    'llama3.1-70b',    'Prompt',    {'temperature': 0.3, 'max_tokens': 500});
```
```
''
```
```
-- Auto-detect source languageSELECT SNOWFLAKE.CORTEX.TRANSLATE(text, '', 'en');-- Explicit source languageSELECT AI_TRANSLATE(text, 'es', 'en');
```
```
-- Auto-detect source languageSELECT SNOWFLAKE.CORTEX.TRANSLATE(text, '', 'en');-- Explicit source languageSELECT AI_TRANSLATE(text, 'es', 'en');
```
```
-- CORRECTSELECT * FROM table WHERE AI_FILTER(text_col, 'mentions shipping problems');-- Can combine with SQL predicatesSELECT * FROM tableWHERE created_date > '2025-01-01'  AND AI_FILTER(description, 'customer is frustrated');
```
```
-- CORRECTSELECT * FROM table WHERE AI_FILTER(text_col, 'mentions shipping problems');-- Can combine with SQL predicatesSELECT * FROM tableWHERE created_date > '2025-01-01'  AND AI_FILTER(description, 'customer is frustrated');
```
```
irjoewf-wq46213
```
```
NZ90655
```
```
iss
```
```
sub
```
```
SELECT CURRENT_ACCOUNT();  -- Returns: NZ90655
```
```
SELECT CURRENT_ACCOUNT();  -- Returns: NZ90655
```
```
snow sql -q "SELECT CURRENT_ACCOUNT()" -c your_connection
```
```
snow sql -q "SELECT CURRENT_ACCOUNT()" -c your_connection
```
```
SNOWFLAKE_ACCOUNT
```
```
SNOWFLAKE_ACCOUNT_URL
```
```
SNOWFLAKE_ACCOUNT_LOCATOR
```
```
irjoewf-wq46213
```
```
NZ90655
```
```
SELECT CURRENT_ACCOUNT()
```
```
iss: ACCOUNT_LOCATOR.USERNAME.SHA256:fingerprintsub: ACCOUNT_LOCATOR.USERNAME
```
```
iss: ACCOUNT_LOCATOR.USERNAME.SHA256:fingerprintsub: ACCOUNT_LOCATOR.USERNAME
```
```
iss: NZ90655.JEZWEB.SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=sub: NZ90655.JEZWEB
```
```
iss: NZ90655.JEZWEB.SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=sub: NZ90655.JEZWEB
```
```
https://irjoewf-wq46213.snowflakecomputing.com/api/v2/statements
```
```
https://irjoewf-wq46213.snowflakecomputing.com/api/v2/statements
```
```
// In wrangler.jsonc vars"SNOWFLAKE_ACCOUNT_URL": "irjoewf-wq46213",      // For REST URLs"SNOWFLAKE_ACCOUNT_LOCATOR": "NZ90655",          // For JWT claims"SNOWFLAKE_USER": "JEZWEB","SNOWFLAKE_PUBLIC_KEY_FP": "SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=",// In generateSnowflakeJWT()const issuer = ${accountLocator}.${user}.${fingerprint};// In executeSnowflakeSQL()const url = https://${accountUrl}.snowflakecomputing.com/api/v2/statements;
```
```
// In wrangler.jsonc vars"SNOWFLAKE_ACCOUNT_URL": "irjoewf-wq46213",      // For REST URLs"SNOWFLAKE_ACCOUNT_LOCATOR": "NZ90655",          // For JWT claims"SNOWFLAKE_USER": "JEZWEB","SNOWFLAKE_PUBLIC_KEY_FP": "SHA256:jpZO6LvU2SpKd8tE61OGfas5ZXpfHloiJd7XHLPDEEA=",// In generateSnowflakeJWT()const issuer = ${accountLocator}.${user}.${fingerprint};// In executeSnowflakeSQL()const url = https://${accountUrl}.snowflakecomputing.com/api/v2/statements;
```
```
${accountLocator}.${user}.${fingerprint}
```
```
https://${accountUrl}.snowflakecomputing.com/api/v2/statements
```
```
# Generate key pair (PKCS#8 format required)openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out ~/.snowflake/rsa_key.p8 -nocryptopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -out ~/.snowflake/rsa_key.pub# Get fingerprint for JWT claimsopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -outform DER | openssl dgst -sha256 -binary | openssl enc -base64# Add public key to Snowflake user (in Snowflake worksheet)ALTER USER JEZWEB SET RSA_PUBLIC_KEY='MIIBIj...';
```
```
# Generate key pair (PKCS#8 format required)openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out ~/.snowflake/rsa_key.p8 -nocryptopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -out ~/.snowflake/rsa_key.pub# Get fingerprint for JWT claimsopenssl rsa -in ~/.snowflake/rsa_key.p8 -pubout -outform DER | openssl dgst -sha256 -binary | openssl enc -base64# Add public key to Snowflake user (in Snowflake worksheet)ALTER USER JEZWEB SET RSA_PUBLIC_KEY='MIIBIj...';
```
```
snow
```
```
# Test connectionsnow connection test -c your_connection# Discover actual account valuessnow sql -q "SELECT CURRENT_USER(), CURRENT_ACCOUNT(), CURRENT_REGION()" -c your_connection
```
```
# Test connectionsnow connection test -c your_connection# Discover actual account valuessnow sql -q "SELECT CURRENT_USER(), CURRENT_ACCOUNT(), CURRENT_REGION()" -c your_connection
```
```
SELECT CURRENT_ACCOUNT()
```
```
docs/PROVIDER_STUDIO.md
```
```
DESCRIBE TABLE my_schema.my_table;SELECT * FROM my_schema.my_table LIMIT 5;
```
```
DESCRIBE TABLE my_schema.my_table;SELECT * FROM my_schema.my_table LIMIT 5;
```
```
<h2>Overview</h2><p>{{OVERVIEW_PARAGRAPH}}</p><h2>What's Included</h2><p><strong>{{TABLE_1_NAME}} ({{COUNT}} records)</strong></p><ul>  <li>{{BULLET_1}}</li>  <li>{{BULLET_2}}</li>  <li>{{BULLET_3}}</li></ul><h2>Key Features</h2><ul>  <li><strong>{{FEATURE_1}}</strong> - {{DESC}}</li>  <li><strong>{{FEATURE_2}}</strong> - {{DESC}}</li>  <li><strong>{{FEATURE_3}}</strong> - {{DESC}}</li></ul><h2>Use Cases</h2><ol>  <li><strong>{{USE_CASE_1}}</strong> - {{DESC}}</li>  <li><strong>{{USE_CASE_2}}</strong> - {{DESC}}</li>  <li><strong>{{USE_CASE_3}}</strong> - {{DESC}}</li></ol><h2>Data Source</h2><p>{{DATA_SOURCE_PARAGRAPH}}</p>
```
```
<h2>Overview</h2><p>{{OVERVIEW_PARAGRAPH}}</p><h2>What's Included</h2><p><strong>{{TABLE_1_NAME}} ({{COUNT}} records)</strong></p><ul>  <li>{{BULLET_1}}</li>  <li>{{BULLET_2}}</li>  <li>{{BULLET_3}}</li></ul><h2>Key Features</h2><ul>  <li><strong>{{FEATURE_1}}</strong> - {{DESC}}</li>  <li><strong>{{FEATURE_2}}</strong> - {{DESC}}</li>  <li><strong>{{FEATURE_3}}</strong> - {{DESC}}</li></ul><h2>Use Cases</h2><ol>  <li><strong>{{USE_CASE_1}}</strong> - {{DESC}}</li>  <li><strong>{{USE_CASE_2}}</strong> - {{DESC}}</li>  <li><strong>{{USE_CASE_3}}</strong> - {{DESC}}</li></ol><h2>Data Source</h2><p>{{DATA_SOURCE_PARAGRAPH}}</p>
```
```
{{EXAMPLE_TITLE}}
```
```
{{EXAMPLE_TITLE}}
```
```
{{EXAMPLE_DESCRIPTION}}
```
```
{{EXAMPLE_DESCRIPTION}}
```
```
{{EXAMPLE_SQL}}
```
```
{{EXAMPLE_SQL}}
```
```
SELECT CURRENT_ROLE();
```
```
snow
```
```
snow app run
```
```
snow app version create V1_0
```
```
snow app version list
```
```
review_status
```
```
APPROVED
```
```
snow app publish --version V1_0 --patch 0
```
```
DEFAULT
```
```
ALPHA
```
```
native_app:  name: my_app  package:    name: my_app_pkg  application:    name: my_app  enable_release_channels: true  # Required for release channels
```
```
native_app:  name: my_app  package:    name: my_app_pkg  application:    name: my_app  enable_release_channels: true  # Required for release channels
```
```
# List channelssnow app release-channel list# Add version to channelsnow app release-channel add-version --channel ALPHA --version V1_0# Publish with specific directivesnow app publish --version V1_0 --patch 0 --channel ALPHA --directive early_access
```
```
# List channelssnow app release-channel list# Add version to channelsnow app release-channel add-version --channel ALPHA --version V1_0# Publish with specific directivesnow app publish --version V1_0 --patch 0 --channel ALPHA --directive early_access
```
```
ALTER APPLICATION PACKAGE pkg SET DISTRIBUTION = 'EXTERNAL';
```
```
ALTER APPLICATION PACKAGE pkg ADD VERSION V1_0 USING '@pkg.stage/v1';
```
```
SHOW VERSIONS IN APPLICATION PACKAGE pkg;
```
```
ALTER APPLICATION PACKAGE pkg MODIFY RELEASE CHANNEL DEFAULT ADD VERSION V1_0;
```
```
NOT_REVIEWED
```
```
IN_PROGRESS
```
```
APPROVED
```
```
REJECTED
```
```
MANUAL_REVIEW
```
```
-- 1. Network ruleCREATE OR REPLACE NETWORK RULE app_network_rule  MODE = EGRESS  TYPE = HOST_PORT  VALUE_LIST = ('api.example.com:443');-- 2. IntegrationCREATE OR REPLACE EXTERNAL ACCESS INTEGRATION app_integration  ALLOWED_NETWORK_RULES = (app_network_rule)  ENABLED = TRUE;-- 3. Grant to appGRANT USAGE ON INTEGRATION app_integration  TO APPLICATION MY_APP;-- 4. CRITICAL: Attach to Streamlit objectALTER STREAMLIT MY_APP.schema.streamlit_name  SET EXTERNAL_ACCESS_INTEGRATIONS = (app_integration);
```
```
-- 1. Network ruleCREATE OR REPLACE NETWORK RULE app_network_rule  MODE = EGRESS  TYPE = HOST_PORT  VALUE_LIST = ('api.example.com:443');-- 2. IntegrationCREATE OR REPLACE EXTERNAL ACCESS INTEGRATION app_integration  ALLOWED_NETWORK_RULES = (app_network_rule)  ENABLED = TRUE;-- 3. Grant to appGRANT USAGE ON INTEGRATION app_integration  TO APPLICATION MY_APP;-- 4. CRITICAL: Attach to Streamlit objectALTER STREAMLIT MY_APP.schema.streamlit_name  SET EXTERNAL_ACCESS_INTEGRATIONS = (app_integration);
```
```
GRANT ON FUTURE TABLES TO APPLICATION
```
```
MANUAL_REVIEW
```
```
snow app run
```
```
snow app version create V1_0
```
```
snow app version list
```
```
snow app version drop V1_0
```
```
snow app publish --version V1_0
```
```
snow app teardown
```
```
snow app run
```
```
ALTER STREAMLIT [APP_NAME].config_schema.[streamlit_name]  SET EXTERNAL_ACCESS_INTEGRATIONS = (integration_name)
```
```
ALTER STREAMLIT [APP_NAME].config_schema.[streamlit_name]  SET EXTERNAL_ACCESS_INTEGRATIONS = (integration_name)
```
```
src: app/streamlit/
```
```
dest: streamlit/
```
```
streamlit/streamlit/
```
```
dict(result[0])
```
```
row['COLUMN_NAME']
```
```
-- 1. Create database for rules (if needed)CREATE DATABASE IF NOT EXISTS [APP]_UTILS;-- 2. Create network rule (fully qualified)CREATE OR REPLACE NETWORK RULE [DB].PUBLIC.[rule_name]  MODE = EGRESS  TYPE = HOST_PORT  VALUE_LIST = ('[hostname]:443');-- 3. Create integration referencing the ruleCREATE OR REPLACE EXTERNAL ACCESS INTEGRATION [integration_name]  ALLOWED_NETWORK_RULES = ([DB].PUBLIC.[rule_name])  ENABLED = TRUE;-- 4. Grant to appGRANT USAGE ON INTEGRATION [integration_name]  TO APPLICATION [APP_NAME];-- 5. Attach to Streamlit (must repeat after each deploy!)ALTER STREAMLIT [APP_NAME].config_schema.[streamlit]  SET EXTERNAL_ACCESS_INTEGRATIONS = ([integration_name]);
```
```
-- 1. Create database for rules (if needed)CREATE DATABASE IF NOT EXISTS [APP]_UTILS;-- 2. Create network rule (fully qualified)CREATE OR REPLACE NETWORK RULE [DB].PUBLIC.[rule_name]  MODE = EGRESS  TYPE = HOST_PORT  VALUE_LIST = ('[hostname]:443');-- 3. Create integration referencing the ruleCREATE OR REPLACE EXTERNAL ACCESS INTEGRATION [integration_name]  ALLOWED_NETWORK_RULES = ([DB].PUBLIC.[rule_name])  ENABLED = TRUE;-- 4. Grant to appGRANT USAGE ON INTEGRATION [integration_name]  TO APPLICATION [APP_NAME];-- 5. Attach to Streamlit (must repeat after each deploy!)ALTER STREAMLIT [APP_NAME].config_schema.[streamlit]  SET EXTERNAL_ACCESS_INTEGRATIONS = ([integration_name]);
```
```
# WRONG - creates streamlit/streamlit/artifacts:  - src: app/streamlit/    dest: streamlit/# CORRECT - flat structureartifacts:  - src: app/streamlit/environment.yml    dest: streamlit/environment.yml  - src: app/streamlit/streamlit_app.py    dest: streamlit/streamlit_app.py  - src: app/streamlit/pages/01_sync.py    dest: streamlit/pages/01_sync.py
```
```
# WRONG - creates streamlit/streamlit/artifacts:  - src: app/streamlit/    dest: streamlit/# CORRECT - flat structureartifacts:  - src: app/streamlit/environment.yml    dest: streamlit/environment.yml  - src: app/streamlit/streamlit_app.py    dest: streamlit/streamlit_app.py  - src: app/streamlit/pages/01_sync.py    dest: streamlit/pages/01_sync.py
```
```
# WRONGconfig = dict(result[0])  # Doesn't work as expected# CORRECTrow = result[0]config = {    'COLUMN_A': row['COLUMN_A'],    'COLUMN_B': row['COLUMN_B'],}
```
```
# WRONGconfig = dict(result[0])  # Doesn't work as expected# CORRECTrow = result[0]config = {    'COLUMN_A': row['COLUMN_A'],    'COLUMN_B': row['COLUMN_B'],}
```
```
ALTER APPLICATION PACKAGE ... SET DEFAULT RELEASE DIRECTIVE VERSION = V1_0 PATCH = 0
```
```
snow app release-directive set default --version V1_0 --patch 0 --channel DEFAULT
```
```
snow app release-channel list
```
```
GRANT REFERENCE_USAGE ON DATABASE ... TO SHARE
```
```
GRANT REFERENCE_USAGE ON DATABASE ... TO SHARE IN APPLICATION PACKAGE pkg_name
```
```
snow app run
```
```
ALTER STREAMLIT [APP_NAME].config_schema.[streamlit_name]  SET EXTERNAL_ACCESS_INTEGRATIONS = (integration_name);
```
```
ALTER STREAMLIT [APP_NAME].config_schema.[streamlit_name]  SET EXTERNAL_ACCESS_INTEGRATIONS = (integration_name);
```
```
src: app/streamlit/
```
```
dest: streamlit/
```
```
# WRONG - creates streamlit/streamlit/artifacts:  - src: app/streamlit/    dest: streamlit/# CORRECT - flat structureartifacts:  - src: app/streamlit/environment.yml    dest: streamlit/environment.yml  - src: app/streamlit/streamlit_app.py    dest: streamlit/streamlit_app.py
```
```
# WRONG - creates streamlit/streamlit/artifacts:  - src: app/streamlit/    dest: streamlit/# CORRECT - flat structureartifacts:  - src: app/streamlit/environment.yml    dest: streamlit/environment.yml  - src: app/streamlit/streamlit_app.py    dest: streamlit/streamlit_app.py
```
```
dict(result[0])
```
```
row['COLUMN_NAME']
```
```
# WRONGconfig = dict(result[0])# CORRECTrow = result[0]config = {'COLUMN_A': row['COLUMN_A'], 'COLUMN_B': row['COLUMN_B']}
```
```
# WRONGconfig = dict(result[0])# CORRECTrow = result[0]config = {'COLUMN_A': row['COLUMN_A'], 'COLUMN_B': row['COLUMN_B']}
```
```
NOT_REVIEWED
```
```
IN_PROGRESS
```
```
APPROVED
```
```
REJECTED
```
```
MANUAL_REVIEW
```
```
snow app deploy
```
```
snow app run
```
```
snow app version create v1_0 --skip-git-check --force
```
```
ALTER APPLICATION PACKAGE pkg_name SET DISTRIBUTION = 'EXTERNAL'
```
```
review_status
```
```
SHOW VERSIONS IN APPLICATION PACKAGE pkg_name
```
```
snow app release-directive set default --version V1_0 --patch 0 --channel DEFAULT
```
```
-- 1. Create shared_data schema in app packageCREATE SCHEMA IF NOT EXISTS MY_APP_PKG.SHARED_DATA;-- 2. Create views that reference external databaseCREATE OR REPLACE VIEW MY_APP_PKG.SHARED_DATA.MY_VIEW ASSELECT * FROM EXTERNAL_DB.SCHEMA.TABLE;-- 3. Grant REFERENCE_USAGE on the source database (CRITICAL!)GRANT REFERENCE_USAGE ON DATABASE EXTERNAL_DB  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;-- 4. Grant access to shareGRANT USAGE ON SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;GRANT SELECT ON ALL VIEWS IN SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;
```
```
-- 1. Create shared_data schema in app packageCREATE SCHEMA IF NOT EXISTS MY_APP_PKG.SHARED_DATA;-- 2. Create views that reference external databaseCREATE OR REPLACE VIEW MY_APP_PKG.SHARED_DATA.MY_VIEW ASSELECT * FROM EXTERNAL_DB.SCHEMA.TABLE;-- 3. Grant REFERENCE_USAGE on the source database (CRITICAL!)GRANT REFERENCE_USAGE ON DATABASE EXTERNAL_DB  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;-- 4. Grant access to shareGRANT USAGE ON SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;GRANT SELECT ON ALL VIEWS IN SCHEMA MY_APP_PKG.SHARED_DATA  TO SHARE IN APPLICATION PACKAGE MY_APP_PKG;
```
```
shared_data.view_name
```
```
snow app run
```
```
st.map()
```
```
st.map(df)
```
```
st.pydeck_chart(pdk.Deck(...))
```
```
pydeck
```
```
environment.yml
```
```
import pydeck as pdk
```
```
map_style=None
```
```
import pydeck as pdkst.pydeck_chart(    pdk.Deck(        map_style=None,  # Uses Streamlit theme        initial_view_state=pdk.ViewState(            latitude=-25.0,            longitude=134.0,            zoom=3,        ),        layers=[            pdk.Layer(                "ScatterplotLayer",                data=df,                get_position="[lon, lat]",                get_color="[30, 136, 229, 180]",                get_radius=15000,                pickable=True,            ),        ],        tooltip={"text": "{name}"}    ))
```
```
import pydeck as pdkst.pydeck_chart(    pdk.Deck(        map_style=None,  # Uses Streamlit theme        initial_view_state=pdk.ViewState(            latitude=-25.0,            longitude=134.0,            zoom=3,        ),        layers=[            pdk.Layer(                "ScatterplotLayer",                data=df,                get_position="[lon, lat]",                get_color="[30, 136, 229, 180]",                get_radius=15000,                pickable=True,            ),        ],        tooltip={"text": "{name}"}    ))
```
```
-- Create Git repository referenceCREATE OR REPLACE GIT REPOSITORY my_repo  API_INTEGRATION = github_api_int  ORIGIN = 'https://github.com/org/repo.git';-- Create Streamlit from GitCREATE OR REPLACE STREAMLIT my_app  ROOT_LOCATION = '@my_repo/branches/main/streamlit'  MAIN_FILE = 'app.py'  QUERY_WAREHOUSE = 'MY_WH';-- Sync latest changesALTER GIT REPOSITORY my_repo FETCH;
```
```
-- Create Git repository referenceCREATE OR REPLACE GIT REPOSITORY my_repo  API_INTEGRATION = github_api_int  ORIGIN = 'https://github.com/org/repo.git';-- Create Streamlit from GitCREATE OR REPLACE STREAMLIT my_app  ROOT_LOCATION = '@my_repo/branches/main/streamlit'  MAIN_FILE = 'app.py'  QUERY_WAREHOUSE = 'MY_WH';-- Sync latest changesALTER GIT REPOSITORY my_repo FETCH;
```
```
LATITUDE
```
```
lat
```
```
LONGITUDE
```
```
lon
```
```
get_position="[LONGITUDE, LATITUDE]"
```
```
count_query = data_query.replace("SELECT cols", "SELECT COUNT(*)")
```
```
data_query = "SELECT col1, col2 FROM table WHERE 1=1"data_query += filter_clausecount_query = data_query.replace("SELECT col1", "SELECT COUNT(*) as CNT")  # Leaves col2!
```
```
data_query = "SELECT col1, col2 FROM table WHERE 1=1"data_query += filter_clausecount_query = data_query.replace("SELECT col1", "SELECT COUNT(*) as CNT")  # Leaves col2!
```
```
filter_clause = ""if search_term:    filter_clause += f" AND UPPER(NAME) LIKE '%{search_term.upper()}%'"if selected_state != "All":    filter_clause += f" AND STATE = '{selected_state}'"# Separate queries using same filtercount_query = f"SELECT COUNT(*) as CNT FROM table WHERE 1=1 {filter_clause}"data_query = f"SELECT col1, col2 FROM table WHERE 1=1 {filter_clause} ORDER BY col1 LIMIT 500"
```
```
filter_clause = ""if search_term:    filter_clause += f" AND UPPER(NAME) LIKE '%{search_term.upper()}%'"if selected_state != "All":    filter_clause += f" AND STATE = '{selected_state}'"# Separate queries using same filtercount_query = f"SELECT COUNT(*) as CNT FROM table WHERE 1=1 {filter_clause}"data_query = f"SELECT col1, col2 FROM table WHERE 1=1 {filter_clause} ORDER BY col1 LIMIT 500"
```
This skill empowers developers to seamlessly interact with the Snowflake AI Data Cloud, streamlining the creation and deployment of robust applications. It provides comprehensive guidance for leveraging core Snowflake technologies such as Cortex AI for intelligent functions, Snowpark for advanced data processing, and Native Apps for marketplace solutions. From CLI setup to authentication, this agent skill acts as your expert guide, accelerating development cycles and ensuring best practices when building sophisticated data-driven applications directly within the Snowflake environment. Master the tools to unlock the full potential of your data initiatives.

# When to Use This Skill
- •Developing new applications that leverage Snowflake's AI Data Cloud features.
- •Integrating Cortex AI functions directly into SQL queries for intelligent data processing.
- •Creating and deploying Native Apps for distribution on the Snowflake Marketplace.
- •Configuring and managing secure JWT key-pair authentication for Snowflake connections.

# Pro Tips
- 💡Always use `snow connection add` for interactive setup or manage `config.toml` manually for programmatic consistency across environments.
- 💡Prioritize JWT key-pair authentication for secure, scriptable access, especially in CI/CD pipelines.
- 💡Familiarize yourself with Cortex AI function syntax early to embed powerful LLM capabilities directly into your data workflows.

