# Alkemi
Source: https://antigravity.codes/mcp/alkemi

## AI Worker Instructions
When the user requests functionality related to Alkemi, follow these guidelines and utilize this context.

## Scraped Content

# Alkemi
Query Snowflake, Google BigQuery, DataBricks Data Products through Alkemi.ai.
The Alkemi MCP server acts as a critical bridge, enabling AI models to seamlessly query and interact with your most valuable cloud data products. Designed specifically for developers integrating AI into data-rich environments, it provides direct, programmatic access to leading platforms such as Snowflake, Google BigQuery, and Databricks. This server eliminates the complexity of fragmented data access, offering a unified gateway that empowers AI agents to retrieve, analyze, and act upon enterprise-grade data without manual intervention or specialized data connector development.
Developers can leverage Alkemi to build sophisticated AI applications that require real-time, governed access to operational and analytical data. By transforming raw data product access into an AI-consumable format, Alkemi streamlines the creation of intelligent systems capable of performing complex data retrieval, advanced analytics, and automated reporting. This accelerates the development cycle for AI-driven insights, allowing models to directly tap into your organization's data lakes, warehouses, and product catalogs.
Its core value proposition lies in simplifying the integration of diverse cloud data sources for AI. Alkemi reduces development complexity, fosters faster AI iteration, and ensures reliable data interaction for your AI applications. Whether you're building a conversational AI that provides instant business insights, an automated anomaly detection system, or an intelligent agent for data governance, Alkemi provides the foundational connectivity to unlock the full potential of your data with artificial intelligence.

# What You Can Do

# MCP Configuration
```
{
  "mcpServers": {
    "alkemi": {
      "command": "npx",
      "args": [
        "@alkemiai/alkemi-mcp"
      ],
      "env": {
        "BEARER_TOKEN": "sk-12345"
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "alkemi": {
      "command": "npx",
      "args": [
        "@alkemiai/alkemi-mcp"
      ],
      "env": {
        "BEARER_TOKEN": "sk-12345"
      }
    }
  }
}
```

# Required Environment Variables
```
BEARER_TOKEN
```

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
Alkemi specializes in developing secure and efficient tools that connect AI models with enterprise data products and services, fostering intelligent automation and data-driven AI applications.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# ⚡ Performance Optimization Agent - Speed Expert

# Modern CSS & Responsive Design Expert

# Progressive Web App (PWA) Expert

# Rust Async Programming with Tokio

# 🔄 Workflows

# Setup Service Worker for Offline

# Database Migration Rollback

# Automatic commit message generator

# Prune Docker System

