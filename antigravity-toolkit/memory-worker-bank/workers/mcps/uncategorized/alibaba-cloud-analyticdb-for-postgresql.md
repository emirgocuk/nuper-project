# Alibaba Cloud AnalyticDB for PostgreSQL
Source: https://antigravity.codes/mcp/alibaba-cloud-analyticdb-for-postgresql

## AI Worker Instructions
When the user requests functionality related to Alibaba Cloud AnalyticDB for PostgreSQL, follow these guidelines and utilize this context.

## Scraped Content

# Alibaba Cloud AnalyticDB for PostgreSQL
An MCP server to connect to [AnalyticDB for PostgreSQL](https://github.com/aliyun/alibabacloud-adbpg-mcp-server) instances, query and analyze data.
The Alibaba Cloud AnalyticDB for PostgreSQL MCP Server provides a critical bridge between advanced AI agents and the powerful, scalable data warehousing capabilities of Alibaba Cloud AnalyticDB for PostgreSQL. This server implements the Model-Connect-Predict (MCP) protocol, allowing AI systems to seamlessly connect, query, and analyze massive datasets stored in ADBPG instances. Developers can leverage this integration to build sophisticated AI applications that require direct, intelligent interaction with analytical data, transforming raw information into actionable insights.
At its core, this MCP server unlocks the full potential of your AnalyticDB for PostgreSQL deployments for AI-driven initiatives. It enables AI agents to execute complex SQL queries, perform intricate data analysis, and retrieve specific data points without manual intervention. This significantly reduces the overhead associated with data access and analysis for AI models, making it ideal for scenarios requiring dynamic data retrieval, real-time reporting, and intelligent decision-making. By abstracting the complexities of database interaction, the server empowers developers to focus on the AI's logic and business value rather than low-level data management.
Developers will find immense value in using this MCP server to infuse their AI applications with robust data intelligence. It streamlines the creation of systems that can autonomously generate reports, respond to data-centric queries in natural language, or power predictive models using historical data from ADBPG. The server's official backing by Alibaba Cloud ensures reliability, compatibility, and ongoing support, providing a trusted pathway for integrating cutting-edge AI with a production-grade, distributed analytical database.

# What You Can Do

# Quick Install
```
pip install adbpg-mcp-server
```

# Required Environment Variables
```
ADBPG_PASSWORD
```
```
API_KEY
```
```
BASE_URL
```

# Available Tools
```
execute_select_sql
```
```
execute_dml_sql
```
```
execute_ddl_sql
```
```
analyze_table
```
```
explain_query
```
```
adbpg_graphrag_upload
```
```
adbpg_graphrag_query
```
```
adbpg_llm_memory_add
```

# Requirements

# Setup Guide

# How to Connect in Antigravity
To connect to a custom MCP server in Antigravity:
```
mcp_config.json
```
Here is an example configuration compatible with MCP-enabled editors like Antigravity, Windsurf, Claude Desktop, and Cursor:
```
{
  "mcpServers": {
    "supabase-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "add-token-here"
      ],
      "env": {}
    },
    "github-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "add-your-token-here"
      }
    }
  }
}
```
This configuration defines two servers: one running via npx (Supabase) and another via docker (GitHub). Make sure to replace the placeholder tokens with your actual API keys.
```
npx
```
```
docker
```
For a detailed step-by-step walkthrough, check out our MCP Tutorial or explore more in our Top 10 Essential MCP Servers guide.

# How to Connect in Cursor
To add this MCP server to Cursor:
For more details, refer to the official Cursor MCP documentation.

# Maintained By
Alibaba Cloud is the data intelligence backbone of Alibaba Group, offering a comprehensive suite of cloud computing services to businesses worldwide, including elastic compute, database, storage, network virtualization, security, and big data analytics.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Solid.js Reactive Development

# Test-Driven Development (TDD)

# Test Automation Frameworks

# E2E Testing (Playwright, Cypress)

# 🔄 Workflows

# Ultimate Next.js SEO Setup

# VS Code Settings Sync

# Nuke & Reinstall

# NextAuth.js (Auth.js) v5 Setup

