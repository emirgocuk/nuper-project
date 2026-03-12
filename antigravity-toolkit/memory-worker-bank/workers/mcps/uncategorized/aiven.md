# Aiven
Source: https://antigravity.codes/mcp/aiven

## AI Worker Instructions
When the user requests functionality related to Aiven, follow these guidelines and utilize this context.

## Scraped Content

# Aiven
Navigate your [Aiven projects](https://go.aiven.io/mcp-server) and interact with the PostgreSQL®, Apache Kafka®, ClickHouse® and OpenSearch® services
The Aiven MCP server provides a powerful interface for developers to manage and interact with their Aiven cloud data infrastructure directly within their development environment. This server eliminates the need to navigate multiple dashboards or command-line tools, centralizing access to essential services like PostgreSQL®, Apache Kafka®, ClickHouse®, and OpenSearch®. Users can effortlessly manage projects, query databases, monitor data streams, and perform analytical tasks, all through a unified and efficient workflow.
This tool is invaluable for developers working with Aiven's managed open-source data technologies. It streamlines operations by offering direct access to critical services, enhancing productivity and reducing context switching. Whether you're debugging a PostgreSQL query, monitoring Kafka topics, analyzing data with ClickHouse, or managing OpenSearch indexes, the Aiven MCP server simplifies complex cloud data interactions, allowing you to focus more on development and less on infrastructure management. Its official categorization ensures reliability and direct support from Aiven.

# What You Can Do

# MCP Configuration
```
{
  "mcpServers": {
    "mcp-aiven": {
      "command": "uv",
      "args": [
        "--directory",
        "$REPOSITORY_DIRECTORY",
        "run",
        "--with-editable",
        "$REPOSITORY_DIRECTORY",
        "--python",
        "3.13",
        "mcp-aiven"
      ],
      "env": {
        "AIVEN_BASE_URL": "https://api.aiven.io",
        "AIVEN_TOKEN": "$AIVEN_TOKEN"
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "mcp-aiven": {
      "command": "uv",
      "args": [
        "--directory",
        "$REPOSITORY_DIRECTORY",
        "run",
        "--with-editable",
        "$REPOSITORY_DIRECTORY",
        "--python",
        "3.13",
        "mcp-aiven"
      ],
      "env": {
        "AIVEN_BASE_URL": "https://api.aiven.io",
        "AIVEN_TOKEN": "$AIVEN_TOKEN"
      }
    }
  }
}
```

# Required Environment Variables
```
AIVEN_BASE_URL
```
```
AIVEN_TOKEN
```

# Available Tools
```
list_projects
```
```
list_services
```
```
get_service_details
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
Aiven is a software company that provides managed open-source data technologies on all major clouds. They offer a comprehensive platform for services like PostgreSQL, Apache Kafka, ClickHouse, and OpenSearch, designed to help developers build and run data-intensive applications efficiently.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Monitoring & Observability (Prometheus, Grafana)

# Graph Databases (Neo4j)

# Python Automation & Scripting Expert

# Google Cloud Platform Expert

# 🔄 Workflows

# Check SSL Certificates

# Handle File Uploads (S3)

# React Performance Profiling

# Implement Rate Limiting

