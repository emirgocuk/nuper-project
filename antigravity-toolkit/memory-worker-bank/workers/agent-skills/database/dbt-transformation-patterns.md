# dbt-transformation-patterns
Source: https://antigravity.codes/agent-skills/database/dbt-transformation-patterns

## AI Worker Instructions
When the user requests functionality related to dbt-transformation-patterns, follow these guidelines and utilize this context.

## Scraped Content

# dbt-transformation-patterns
```
sources/          Raw data definitions    ↓staging/          1:1 with source, light cleaning    ↓intermediate/     Business logic, joins, aggregations    ↓marts/            Final analytics tables
```
```
sources/          Raw data definitions    ↓staging/          1:1 with source, light cleaning    ↓intermediate/     Business logic, joins, aggregations    ↓marts/            Final analytics tables
```
```
stg_
```
```
stg_stripe__payments
```
```
int_
```
```
int_payments_pivoted
```
```
dim_
```
```
fct_
```
```
dim_customers
```
```
fct_orders
```
```
# dbt_project.ymlname: "analytics"version: "1.0.0"profile: "analytics"model-paths: ["models"]analysis-paths: ["analyses"]test-paths: ["tests"]seed-paths: ["seeds"]macro-paths: ["macros"]vars:  start_date: "2020-01-01"models:  analytics:    staging:      +materialized: view      +schema: staging    intermediate:      +materialized: ephemeral    marts:      +materialized: table      +schema: analytics
```
```
# dbt_project.ymlname: "analytics"version: "1.0.0"profile: "analytics"model-paths: ["models"]analysis-paths: ["analyses"]test-paths: ["tests"]seed-paths: ["seeds"]macro-paths: ["macros"]vars:  start_date: "2020-01-01"models:  analytics:    staging:      +materialized: view      +schema: staging    intermediate:      +materialized: ephemeral    marts:      +materialized: table      +schema: analytics
```
```
# Project structuremodels/├── staging/│   ├── stripe/│   │   ├── _stripe__sources.yml│   │   ├── _stripe__models.yml│   │   ├── stg_stripe__customers.sql│   │   └── stg_stripe__payments.sql│   └── shopify/│       ├── _shopify__sources.yml│       └── stg_shopify__orders.sql├── intermediate/│   └── finance/│       └── int_payments_pivoted.sql└── marts/    ├── core/    │   ├── _core__models.yml    │   ├── dim_customers.sql    │   └── fct_orders.sql    └── finance/        └── fct_revenue.sql
```
```
# Project structuremodels/├── staging/│   ├── stripe/│   │   ├── _stripe__sources.yml│   │   ├── _stripe__models.yml│   │   ├── stg_stripe__customers.sql│   │   └── stg_stripe__payments.sql│   └── shopify/│       ├── _shopify__sources.yml│       └── stg_shopify__orders.sql├── intermediate/│   └── finance/│       └── int_payments_pivoted.sql└── marts/    ├── core/    │   ├── _core__models.yml    │   ├── dim_customers.sql    │   └── fct_orders.sql    └── finance/        └── fct_revenue.sql
```
```
# models/staging/stripe/_stripe__sources.ymlversion: 2sources:  - name: stripe    description: Raw Stripe data loaded via Fivetran    database: raw    schema: stripe    loader: fivetran    loaded_at_field: _fivetran_synced    freshness:      warn_after: { count: 12, period: hour }      error_after: { count: 24, period: hour }    tables:      - name: customers        description: Stripe customer records        columns:          - name: id            description: Primary key            tests:              - unique              - not_null          - name: email            description: Customer email          - name: created            description: Account creation timestamp      - name: payments        description: Stripe payment transactions        columns:          - name: id            tests:              - unique              - not_null          - name: customer_id            tests:              - not_null              - relationships:                  to: source('stripe', 'customers')                  field: id
```
```
# models/staging/stripe/_stripe__sources.ymlversion: 2sources:  - name: stripe    description: Raw Stripe data loaded via Fivetran    database: raw    schema: stripe    loader: fivetran    loaded_at_field: _fivetran_synced    freshness:      warn_after: { count: 12, period: hour }      error_after: { count: 24, period: hour }    tables:      - name: customers        description: Stripe customer records        columns:          - name: id            description: Primary key            tests:              - unique              - not_null          - name: email            description: Customer email          - name: created            description: Account creation timestamp      - name: payments        description: Stripe payment transactions        columns:          - name: id            tests:              - unique              - not_null          - name: customer_id            tests:              - not_null              - relationships:                  to: source('stripe', 'customers')                  field: id
```
```
-- models/staging/stripe/stg_stripe__customers.sqlwith source as (    select * from {{ source('stripe', 'customers') }}),renamed as (    select        -- ids        id as customer_id,        -- strings        lower(email) as email,        name as customer_name,        -- timestamps        created as created_at,        -- metadata        _fivetran_synced as _loaded_at    from source)select * from renamed
```
```
-- models/staging/stripe/stg_stripe__customers.sqlwith source as (    select * from {{ source('stripe', 'customers') }}),renamed as (    select        -- ids        id as customer_id,        -- strings        lower(email) as email,        name as customer_name,        -- timestamps        created as created_at,        -- metadata        _fivetran_synced as _loaded_at    from source)select * from renamed
```
```
-- models/staging/stripe/stg_stripe__payments.sql{{    config(        materialized='incremental',        unique_key='payment_id',        on_schema_change='append_new_columns'    )}}with source as (    select * from {{ source('stripe', 'payments') }}    {% if is_incremental() %}    where _fivetran_synced > (select max(_loaded_at) from {{ this }})    {% endif %}),renamed as (    select        -- ids        id as payment_id,        customer_id,        invoice_id,        -- amounts (convert cents to dollars)        amount / 100.0 as amount,        amount_refunded / 100.0 as amount_refunded,        -- status        status as payment_status,        -- timestamps        created as created_at,        -- metadata        _fivetran_synced as _loaded_at    from source)select * from renamed
```
```
-- models/staging/stripe/stg_stripe__payments.sql{{    config(        materialized='incremental',        unique_key='payment_id',        on_schema_change='append_new_columns'    )}}with source as (    select * from {{ source('stripe', 'payments') }}    {% if is_incremental() %}    where _fivetran_synced > (select max(_loaded_at) from {{ this }})    {% endif %}),renamed as (    select        -- ids        id as payment_id,        customer_id,        invoice_id,        -- amounts (convert cents to dollars)        amount / 100.0 as amount,        amount_refunded / 100.0 as amount_refunded,        -- status        status as payment_status,        -- timestamps        created as created_at,        -- metadata        _fivetran_synced as _loaded_at    from source)select * from renamed
```
```
-- models/intermediate/finance/int_payments_pivoted_to_customer.sqlwith payments as (    select * from {{ ref('stg_stripe__payments') }}),customers as (    select * from {{ ref('stg_stripe__customers') }}),payment_summary as (    select        customer_id,        count(*) as total_payments,        count(case when payment_status = 'succeeded' then 1 end) as successful_payments,        sum(case when payment_status = 'succeeded' then amount else 0 end) as total_amount_paid,        min(created_at) as first_payment_at,        max(created_at) as last_payment_at    from payments    group by customer_id)select    customers.customer_id,    customers.email,    customers.created_at as customer_created_at,    coalesce(payment_summary.total_payments, 0) as total_payments,    coalesce(payment_summary.successful_payments, 0) as successful_payments,    coalesce(payment_summary.total_amount_paid, 0) as lifetime_value,    payment_summary.first_payment_at,    payment_summary.last_payment_atfrom customersleft join payment_summary using (customer_id)
```
```
-- models/intermediate/finance/int_payments_pivoted_to_customer.sqlwith payments as (    select * from {{ ref('stg_stripe__payments') }}),customers as (    select * from {{ ref('stg_stripe__customers') }}),payment_summary as (    select        customer_id,        count(*) as total_payments,        count(case when payment_status = 'succeeded' then 1 end) as successful_payments,        sum(case when payment_status = 'succeeded' then amount else 0 end) as total_amount_paid,        min(created_at) as first_payment_at,        max(created_at) as last_payment_at    from payments    group by customer_id)select    customers.customer_id,    customers.email,    customers.created_at as customer_created_at,    coalesce(payment_summary.total_payments, 0) as total_payments,    coalesce(payment_summary.successful_payments, 0) as successful_payments,    coalesce(payment_summary.total_amount_paid, 0) as lifetime_value,    payment_summary.first_payment_at,    payment_summary.last_payment_atfrom customersleft join payment_summary using (customer_id)
```
```
-- models/marts/core/dim_customers.sql{{    config(        materialized='table',        unique_key='customer_id'    )}}with customers as (    select * from {{ ref('int_payments_pivoted_to_customer') }}),orders as (    select * from {{ ref('stg_shopify__orders') }}),order_summary as (    select        customer_id,        count(*) as total_orders,        sum(total_price) as total_order_value,        min(created_at) as first_order_at,        max(created_at) as last_order_at    from orders    group by customer_id),final as (    select        -- surrogate key        {{ dbt_utils.generate_surrogate_key(['customers.customer_id']) }} as customer_key,        -- natural key        customers.customer_id,        -- attributes        customers.email,        customers.customer_created_at,        -- payment metrics        customers.total_payments,        customers.successful_payments,        customers.lifetime_value,        customers.first_payment_at,        customers.last_payment_at,        -- order metrics        coalesce(order_summary.total_orders, 0) as total_orders,        coalesce(order_summary.total_order_value, 0) as total_order_value,        order_summary.first_order_at,        order_summary.last_order_at,        -- calculated fields        case            when customers.lifetime_value >= 1000 then 'high'            when customers.lifetime_value >= 100 then 'medium'            else 'low'        end as customer_tier,        -- timestamps        current_timestamp as _loaded_at    from customers    left join order_summary using (customer_id))select * from final
```
```
-- models/marts/core/dim_customers.sql{{    config(        materialized='table',        unique_key='customer_id'    )}}with customers as (    select * from {{ ref('int_payments_pivoted_to_customer') }}),orders as (    select * from {{ ref('stg_shopify__orders') }}),order_summary as (    select        customer_id,        count(*) as total_orders,        sum(total_price) as total_order_value,        min(created_at) as first_order_at,        max(created_at) as last_order_at    from orders    group by customer_id),final as (    select        -- surrogate key        {{ dbt_utils.generate_surrogate_key(['customers.customer_id']) }} as customer_key,        -- natural key        customers.customer_id,        -- attributes        customers.email,        customers.customer_created_at,        -- payment metrics        customers.total_payments,        customers.successful_payments,        customers.lifetime_value,        customers.first_payment_at,        customers.last_payment_at,        -- order metrics        coalesce(order_summary.total_orders, 0) as total_orders,        coalesce(order_summary.total_order_value, 0) as total_order_value,        order_summary.first_order_at,        order_summary.last_order_at,        -- calculated fields        case            when customers.lifetime_value >= 1000 then 'high'            when customers.lifetime_value >= 100 then 'medium'            else 'low'        end as customer_tier,        -- timestamps        current_timestamp as _loaded_at    from customers    left join order_summary using (customer_id))select * from final
```
```
-- models/marts/core/fct_orders.sql{{    config(        materialized='incremental',        unique_key='order_id',        incremental_strategy='merge'    )}}with orders as (    select * from {{ ref('stg_shopify__orders') }}    {% if is_incremental() %}    where updated_at > (select max(updated_at) from {{ this }})    {% endif %}),customers as (    select * from {{ ref('dim_customers') }}),final as (    select        -- keys        orders.order_id,        customers.customer_key,        orders.customer_id,        -- dimensions        orders.order_status,        orders.fulfillment_status,        orders.payment_status,        -- measures        orders.subtotal,        orders.tax,        orders.shipping,        orders.total_price,        orders.total_discount,        orders.item_count,        -- timestamps        orders.created_at,        orders.updated_at,        orders.fulfilled_at,        -- metadata        current_timestamp as _loaded_at    from orders    left join customers on orders.customer_id = customers.customer_id)select * from final
```
```
-- models/marts/core/fct_orders.sql{{    config(        materialized='incremental',        unique_key='order_id',        incremental_strategy='merge'    )}}with orders as (    select * from {{ ref('stg_shopify__orders') }}    {% if is_incremental() %}    where updated_at > (select max(updated_at) from {{ this }})    {% endif %}),customers as (    select * from {{ ref('dim_customers') }}),final as (    select        -- keys        orders.order_id,        customers.customer_key,        orders.customer_id,        -- dimensions        orders.order_status,        orders.fulfillment_status,        orders.payment_status,        -- measures        orders.subtotal,        orders.tax,        orders.shipping,        orders.total_price,        orders.total_discount,        orders.item_count,        -- timestamps        orders.created_at,        orders.updated_at,        orders.fulfilled_at,        -- metadata        current_timestamp as _loaded_at    from orders    left join customers on orders.customer_id = customers.customer_id)select * from final
```
```
# models/marts/core/_core__models.ymlversion: 2models:  - name: dim_customers    description: Customer dimension with payment and order metrics    columns:      - name: customer_key        description: Surrogate key for the customer dimension        tests:          - unique          - not_null      - name: customer_id        description: Natural key from source system        tests:          - unique          - not_null      - name: email        description: Customer email address        tests:          - not_null      - name: customer_tier        description: Customer value tier based on lifetime value        tests:          - accepted_values:              values: ["high", "medium", "low"]      - name: lifetime_value        description: Total amount paid by customer        tests:          - dbt_utils.expression_is_true:              expression: ">= 0"  - name: fct_orders    description: Order fact table with all order transactions    tests:      - dbt_utils.recency:          datepart: day          field: created_at          interval: 1    columns:      - name: order_id        tests:          - unique          - not_null      - name: customer_key        tests:          - not_null          - relationships:              to: ref('dim_customers')              field: customer_key
```
```
# models/marts/core/_core__models.ymlversion: 2models:  - name: dim_customers    description: Customer dimension with payment and order metrics    columns:      - name: customer_key        description: Surrogate key for the customer dimension        tests:          - unique          - not_null      - name: customer_id        description: Natural key from source system        tests:          - unique          - not_null      - name: email        description: Customer email address        tests:          - not_null      - name: customer_tier        description: Customer value tier based on lifetime value        tests:          - accepted_values:              values: ["high", "medium", "low"]      - name: lifetime_value        description: Total amount paid by customer        tests:          - dbt_utils.expression_is_true:              expression: ">= 0"  - name: fct_orders    description: Order fact table with all order transactions    tests:      - dbt_utils.recency:          datepart: day          field: created_at          interval: 1    columns:      - name: order_id        tests:          - unique          - not_null      - name: customer_key        tests:          - not_null          - relationships:              to: ref('dim_customers')              field: customer_key
```
```
-- macros/cents_to_dollars.sql{% macro cents_to_dollars(column_name, precision=2) %}    round({{ column_name }} / 100.0, {{ precision }}){% endmacro %}-- macros/generate_schema_name.sql{% macro generate_schema_name(custom_schema_name, node) %}    {%- set default_schema = target.schema -%}    {%- if custom_schema_name is none -%}        {{ default_schema }}    {%- else -%}        {{ default_schema }}_{{ custom_schema_name }}    {%- endif -%}{% endmacro %}-- macros/limit_data_in_dev.sql{% macro limit_data_in_dev(column_name, days=3) %}    {% if target.name == 'dev' %}        where {{ column_name }} >= dateadd(day, -{{ days }}, current_date)    {% endif %}{% endmacro %}-- Usage in modelselect * from {{ ref('stg_orders') }}{{ limit_data_in_dev('created_at') }}
```
```
-- macros/cents_to_dollars.sql{% macro cents_to_dollars(column_name, precision=2) %}    round({{ column_name }} / 100.0, {{ precision }}){% endmacro %}-- macros/generate_schema_name.sql{% macro generate_schema_name(custom_schema_name, node) %}    {%- set default_schema = target.schema -%}    {%- if custom_schema_name is none -%}        {{ default_schema }}    {%- else -%}        {{ default_schema }}_{{ custom_schema_name }}    {%- endif -%}{% endmacro %}-- macros/limit_data_in_dev.sql{% macro limit_data_in_dev(column_name, days=3) %}    {% if target.name == 'dev' %}        where {{ column_name }} >= dateadd(day, -{{ days }}, current_date)    {% endif %}{% endmacro %}-- Usage in modelselect * from {{ ref('stg_orders') }}{{ limit_data_in_dev('created_at') }}
```
```
-- Delete+Insert (default for most warehouses){{    config(        materialized='incremental',        unique_key='id',        incremental_strategy='delete+insert'    )}}-- Merge (best for late-arriving data){{    config(        materialized='incremental',        unique_key='id',        incremental_strategy='merge',        merge_update_columns=['status', 'amount', 'updated_at']    )}}-- Insert Overwrite (partition-based){{    config(        materialized='incremental',        incremental_strategy='insert_overwrite',        partition_by={            "field": "created_date",            "data_type": "date",            "granularity": "day"        }    )}}select    *,    date(created_at) as created_datefrom {{ ref('stg_events') }}{% if is_incremental() %}where created_date >= dateadd(day, -3, current_date){% endif %}
```
```
-- Delete+Insert (default for most warehouses){{    config(        materialized='incremental',        unique_key='id',        incremental_strategy='delete+insert'    )}}-- Merge (best for late-arriving data){{    config(        materialized='incremental',        unique_key='id',        incremental_strategy='merge',        merge_update_columns=['status', 'amount', 'updated_at']    )}}-- Insert Overwrite (partition-based){{    config(        materialized='incremental',        incremental_strategy='insert_overwrite',        partition_by={            "field": "created_date",            "data_type": "date",            "granularity": "day"        }    )}}select    *,    date(created_at) as created_datefrom {{ ref('stg_events') }}{% if is_incremental() %}where created_date >= dateadd(day, -3, current_date){% endif %}
```
```
# Developmentdbt run                          # Run all modelsdbt run --select staging         # Run staging models onlydbt run --select +fct_orders     # Run fct_orders and its upstreamdbt run --select fct_orders+     # Run fct_orders and its downstreamdbt run --full-refresh           # Rebuild incremental models# Testingdbt test                         # Run all testsdbt test --select stg_stripe     # Test specific modelsdbt build                        # Run + test in DAG order# Documentationdbt docs generate                # Generate docsdbt docs serve                   # Serve docs locally# Debuggingdbt compile                      # Compile SQL without runningdbt debug                        # Test connectiondbt ls --select tag:critical     # List models by tag
```
```
# Developmentdbt run                          # Run all modelsdbt run --select staging         # Run staging models onlydbt run --select +fct_orders     # Run fct_orders and its upstreamdbt run --select fct_orders+     # Run fct_orders and its downstreamdbt run --full-refresh           # Rebuild incremental models# Testingdbt test                         # Run all testsdbt test --select stg_stripe     # Test specific modelsdbt build                        # Run + test in DAG order# Documentationdbt docs generate                # Generate docsdbt docs serve                   # Serve docs locally# Debuggingdbt compile                      # Compile SQL without runningdbt debug                        # Test connectiondbt ls --select tag:critical     # List models by tag
```
```
{{ var('start_date') }}
```
Unlock the full potential of your data initiatives with the dbt Transformation Patterns skill. This advanced AI agent is engineered to guide you through building robust, scalable, and maintainable data models using dbt (data build tool). From establishing clear model layers and naming conventions to implementing rigorous testing and efficient incremental strategies, it provides production-ready guidance. Elevate your analytics engineering practices, streamline your data workflows, and ensure high-quality, trustworthy data assets across your organization, making your data accessible and reliable for crucial business insights.

# When to Use This Skill
- •Designing a robust dbt project structure for new or existing data warehouses.
- •Implementing the Medallion Architecture (staging, intermediate, marts) for clear data lineage.
- •Ensuring data quality and integrity through comprehensive dbt testing strategies.
- •Optimizing data model performance for large datasets using incremental build patterns.

# Pro Tips
- 💡Integrate CI/CD pipelines with dbt Cloud or custom runners to automate testing and deployment of your data models.
- 💡Leverage dbt exposures to explicitly define downstream consumers and data products, improving data governance.
- 💡Regularly refactor intermediate models to maintain clarity, reduce complexity, and enhance reusability across your project.

