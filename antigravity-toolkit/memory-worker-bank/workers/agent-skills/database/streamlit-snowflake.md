# streamlit-snowflake
Source: https://antigravity.codes/agent-skills/database/streamlit-snowflake

## AI Worker Instructions
When the user requests functionality related to streamlit-snowflake, follow these guidelines and utilize this context.

## Scraped Content

# streamlit-snowflake
```
# Create project directorymkdir my-streamlit-app && cd my-streamlit-app# Copy templates (Claude will provide these)
```
```
# Create project directorymkdir my-streamlit-app && cd my-streamlit-app# Copy templates (Claude will provide these)
```
```
snowflake.yml
```
```
definition_version: 2entities:  my_app:    type: streamlit    identifier: my_streamlit_app        # ← Your app name    stage: my_app_stage                 # ← Your stage name    query_warehouse: my_warehouse       # ← Your warehouse    main_file: streamlit_app.py    pages_dir: pages/    artifacts:      - common/      - environment.yml
```
```
definition_version: 2entities:  my_app:    type: streamlit    identifier: my_streamlit_app        # ← Your app name    stage: my_app_stage                 # ← Your stage name    query_warehouse: my_warehouse       # ← Your warehouse    main_file: streamlit_app.py    pages_dir: pages/    artifacts:      - common/      - environment.yml
```
```
# Deploy to Snowflakesnow streamlit deploy --replace# Open in browsersnow streamlit deploy --replace --open
```
```
# Deploy to Snowflakesnow streamlit deploy --replace# Open in browsersnow streamlit deploy --replace --open
```
```
environment.yml
```
```
requirements.txt
```
```
pyproject.toml
```
```
CREATE STREAMLIT my_app  FROM '@my_stage/app_folder'  MAIN_FILE = 'streamlit_app.py'  RUNTIME_NAME = 'SYSTEM$ST_CONTAINER_RUNTIME_PY3_11'  COMPUTE_POOL = my_compute_pool  QUERY_WAREHOUSE = my_warehouse;
```
```
CREATE STREAMLIT my_app  FROM '@my_stage/app_folder'  MAIN_FILE = 'streamlit_app.py'  RUNTIME_NAME = 'SYSTEM$ST_CONTAINER_RUNTIME_PY3_11'  COMPUTE_POOL = my_compute_pool  QUERY_WAREHOUSE = my_warehouse;
```
```
my-streamlit-app/├── snowflake.yml           # Project definition (required)├── environment.yml         # Package dependencies (required)├── streamlit_app.py        # Main entry point├── pages/                  # Multi-page apps│   └── data_explorer.py├── common/                 # Shared utilities│   └── utils.py└── .gitignore
```
```
my-streamlit-app/├── snowflake.yml           # Project definition (required)├── environment.yml         # Package dependencies (required)├── streamlit_app.py        # Main entry point├── pages/                  # Multi-page apps│   └── data_explorer.py├── common/                 # Shared utilities│   └── utils.py└── .gitignore
```
```
import streamlit as st# Get Snowpark session (native SiS connection)conn = st.connection("snowflake")session = conn.session()# Query datadf = session.sql("SELECT * FROM my_table LIMIT 100").to_pandas()st.dataframe(df)
```
```
import streamlit as st# Get Snowpark session (native SiS connection)conn = st.connection("snowflake")session = conn.session()# Query datadf = session.sql("SELECT * FROM my_table LIMIT 100").to_pandas()st.dataframe(df)
```
```
import streamlit as st# Use caller's rights for data isolationconn = st.connection("snowflake", type="callers_rights")# Each viewer sees only data they have permission to accessdf = conn.query("SELECT * FROM sensitive_customer_data")st.dataframe(df)
```
```
import streamlit as st# Use caller's rights for data isolationconn = st.connection("snowflake", type="callers_rights")# Each viewer sees only data they have permission to accessdf = conn.query("SELECT * FROM sensitive_customer_data")st.dataframe(df)
```
```
type="snowflake"
```
```
type="callers_rights"
```
```
@st.cache_data(ttl=600)  # Cache for 10 minutesdef load_data(query: str):    conn = st.connection("snowflake")    return conn.session().sql(query).to_pandas()# Use cached functiondf = load_data("SELECT * FROM large_table")
```
```
@st.cache_data(ttl=600)  # Cache for 10 minutesdef load_data(query: str):    conn = st.connection("snowflake")    return conn.session().sql(query).to_pandas()# Use cached functiondf = load_data("SELECT * FROM large_table")
```
```
params
```
```
ttl=0
```
```
# ❌ Fetches all 50 columns even though chart only needs 2df = session.table("wide_table")  # 50 columnsst.line_chart(df, x="date", y="value")# ✅ Fetch only needed columns for better performancedf = session.table("wide_table").select("date", "value")st.line_chart(df, x="date", y="value")# 5-10x faster for wide tables
```
```
# ❌ Fetches all 50 columns even though chart only needs 2df = session.table("wide_table")  # 50 columnsst.line_chart(df, x="date", y="value")# ✅ Fetch only needed columns for better performancedf = session.table("wide_table").select("date", "value")st.line_chart(df, x="date", y="value")# 5-10x faster for wide tables
```
```
st.dataframe()
```
```
df.to_pandas()
```
```
name: sf_envchannels:  - snowflake          # REQUIRED - only supported channeldependencies:  - streamlit=1.35.0   # Explicit version (default is old 1.22.0)  - pandas  - plotly  - altair=4.0         # Version 4.0 supported in SiS  - snowflake-snowpark-python
```
```
name: sf_envchannels:  - snowflake          # REQUIRED - only supported channeldependencies:  - streamlit=1.35.0   # Explicit version (default is old 1.22.0)  - pandas  - plotly  - altair=4.0         # Version 4.0 supported in SiS  - snowflake-snowpark-python
```
```
PackageNotFoundError
```
```
channels: - snowflake
```
```
streamlit=1.35.0
```
```
ROOT_LOCATION deprecated
```
```
FROM source_location
```
```
page_title not supported
```
```
page_title
```
```
page_icon
```
```
menu_items
```
```
st.set_page_config()
```
```
_snowflake module not found
```
```
from snowflake.snowpark.context import get_active_session
```
```
from _snowflake import get_active_session
```
```
params
```
```
ttl=0
```
```
Invalid connection_name 'default'
```
```
.streamlit/secrets.toml
```
```
[connections.snowflake]
```
```
streamlit=1.35.0
```
```
pathlib
```
```
Path(__file__).parent / "assets/logo.png"
```
```
st.dataframe()
```
```
df.select("col1", "col2")
```
```
# Deploy and replace existingsnow streamlit deploy --replace# Deploy and open in browsersnow streamlit deploy --replace --open# Deploy specific entity (if multiple in snowflake.yml)snow streamlit deploy my_app --replace
```
```
# Deploy and replace existingsnow streamlit deploy --replace# Deploy and open in browsersnow streamlit deploy --replace --open# Deploy specific entity (if multiple in snowflake.yml)snow streamlit deploy my_app --replace
```
```
references/ci-cd.md
```
```
templates-native-app/
```
```
templates-native-app/README.md
```
```
my-native-app/├── manifest.yml            # Native App manifest├── setup.sql               # Installation script├── streamlit/│   ├── environment.yml│   ├── streamlit_app.py│   └── pages/└── README.md
```
```
my-native-app/├── manifest.yml            # Native App manifest├── setup.sql               # Installation script├── streamlit/│   ├── environment.yml│   ├── streamlit_app.py│   └── pages/└── README.md
```
```
-- Query available packagesSELECT * FROM information_schema.packagesWHERE language = 'python'ORDER BY package_name;-- Search for specific packageSELECT * FROM information_schema.packagesWHERE language = 'python'AND package_name ILIKE '%plotly%';
```
```
-- Query available packagesSELECT * FROM information_schema.packagesWHERE language = 'python'ORDER BY package_name;-- Search for specific packageSELECT * FROM information_schema.packagesWHERE language = 'python'AND package_name ILIKE '%plotly%';
```
```
st.dataframe
```
```
st.file_uploader
```
```
.so
```
```
st.set_page_config
```
```
page_title
```
```
page_icon
```
```
menu_items
```
```
st.bokeh_chart
```
```
eval()
```
```
st.cache_data
```
```
st.cache_resource
```
```
references/authentication.md
```
This powerful AI Agent Skill empowers developers to seamlessly integrate Streamlit's intuitive data app framework directly within the Snowflake Data Cloud. By leveraging the native capabilities of Streamlit in Snowflake, users can build, deploy, and manage interactive data applications that benefit from Snowflake's robust performance, security, and scalability. It facilitates streamlined development workflows, from initial project setup to continuous deployment, making it ideal for creating powerful analytical tools and publishing to the Snowflake Marketplace.

# When to Use This Skill
- •Building interactive data applications that run natively within the Snowflake environment.
- •Developing data apps requiring direct Snowpark integration for efficient data access and processing.
- •Preparing and publishing custom Streamlit applications to the Snowflake Marketplace as Native Apps.
- •Setting up robust CI/CD pipelines for automated deployment and updates of Streamlit apps to Snowflake.

# Pro Tips
- 💡Optimize your `environment.yml` file to include only essential Python packages to minimize deployment time and improve app performance.
- 💡Leverage Snowflake's native role-based access control (RBAC) to manage permissions for your Streamlit app and underlying data securely.
- 💡Utilize the `snow streamlit logs` command for efficient debugging and monitoring of your deployed Streamlit in Snowflake application.

