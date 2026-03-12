# Algolia
Source: https://antigravity.codes/mcp/algolia

## AI Worker Instructions
When the user requests functionality related to Algolia, follow these guidelines and utilize this context.

## Scraped Content

# Algolia
Use AI agents to provision, configure, and query your [Algolia](https://algolia.com) search indices.
The Algolia MCP Server empowers developers to seamlessly integrate AI agents with their Algolia search indices. This server acts as a powerful bridge, allowing AI agents to perform a range of operations from provisioning new indices to complex configuration adjustments and sophisticated data querying. It eliminates much of the manual effort traditionally associated with managing search infrastructure, enabling more dynamic and intelligent control over search experiences.
Key features include the ability for AI agents to create and update search indices, modify ranking strategies, manage synonyms, and retrieve data using natural language or automated workflows. This dramatically simplifies the developer experience by abstracting away API complexities and allowing developers to focus on higher-level search functionality and user experience. It's an official tool, ensuring robust and reliable interaction with Algolia's powerful search API.
Developers will find immense value in automating routine index management tasks, implementing AI-driven search optimizations, and gaining deeper insights into their search data through intelligent querying. This server opens up new possibilities for building self-optimizing search applications and empowers teams to manage their Algolia setup with unprecedented efficiency and intelligence.

# What You Can Do

# Quick Install
```
npx @modelcontextprotocol/inspector ./mcp
```

# MCP Configuration
```
"mcpServers": {
      "algolia": {
         "command": "/path/to/the/repo/cmd/mcp/mcp",
         "env": {
            "ALGOLIA_APP_ID": "<APP_ID>",
            "ALGOLIA_INDEX_NAME": "<INDEX_NAME>",
            "ALGOLIA_API_KEY": "<API_KEY>",
            "ALGOLIA_WRITE_API_KEY": "<ADMIN_API_KEY>",  /* if you want to allow write operations, use your ADMIN key here */
            "MCP_ENABLED_TOOLS": "",  /* optional: specify which tools to enable (e.g., "search,collections") */
            "MCP_SERVER_TYPE": "stdio",  /* optional: server type, either "stdio" (default) or "sse". If not set, defaults to "stdio" */
            "MCP_SSE_PORT": "8080"  /* optional: port for SSE server, default is 8080 (only used when MCP_SERVER_TYPE is "sse") */
         }
```
```
"mcpServers": {
      "algolia": {
         "command": "/path/to/the/repo/cmd/mcp/mcp",
         "env": {
            "ALGOLIA_APP_ID": "<APP_ID>",
            "ALGOLIA_INDEX_NAME": "<INDEX_NAME>",
            "ALGOLIA_API_KEY": "<API_KEY>",
            "ALGOLIA_WRITE_API_KEY": "<ADMIN_API_KEY>",  /* if you want to allow write operations, use your ADMIN key here */
            "MCP_ENABLED_TOOLS": "",  /* optional: specify which tools to enable (e.g., "search,collections") */
            "MCP_SERVER_TYPE": "stdio",  /* optional: server type, either "stdio" (default) or "sse". If not set, defaults to "stdio" */
            "MCP_SSE_PORT": "8080"  /* optional: port for SSE server, default is 8080 (only used when MCP_SERVER_TYPE is "sse") */
         }
```

# Required Environment Variables
```
ALGOLIA_API_KEY
```
```
ALGOLIA_WRITE_API_KEY
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
Algolia provides a blazing-fast and highly relevant search-as-a-service API for websites and mobile apps. Developers use Algolia to build powerful, customizable search experiences that drive engagement and conversions.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Python Data Science Expert

# REST API Design Patterns Expert

# Monitoring & Observability (Prometheus, Grafana)

# React Native Expert

# 🔄 Workflows

# Setup Internationalization (i18n)

# Setup VS Code Multi-Root Workspace

# Debug API Issues with Network Tab

# Optimize Images for Web

