# ActionKit by Paragon
Source: https://antigravity.codes/mcp/actionkit-by-paragon

## AI Worker Instructions
When the user requests functionality related to ActionKit by Paragon, follow these guidelines and utilize this context.

## Scraped Content

# ActionKit by Paragon
Connect to 130+ SaaS integrations (e.g. Slack, Salesforce, Gmail) with Paragon’s [ActionKit](https://www.useparagon.com/actionkit) API.
The ActionKit by Paragon MCP server provides developers with an unparalleled gateway to over 130 popular SaaS applications, including essential platforms like Slack, Salesforce, and Gmail. Leveraging Paragon’s robust ActionKit API, this server dramatically simplifies the complexities of integrating disparate cloud services. Instead of grappling with unique APIs, authentication protocols, and data models for each platform, developers can now interact with a vast ecosystem of tools through a single, unified interface directly from their MCP environment.
This powerful integration capability empowers developers to build sophisticated, cross-application workflows with unprecedented ease and speed. ActionKit by Paragon abstracts away the common hurdles of third-party integrations, allowing you to focus on core application logic and delivering business value. Whether it's synchronizing customer data across your CRM and marketing platforms, automating internal notifications, or orchestrating multi-step operational processes, this server drastically reduces development time and maintenance overhead.
By integrating ActionKit by Paragon into your MCP, you transform your development environment into a central hub for business automation and data orchestration. It enables your applications to dynamically trigger actions, retrieve critical information, and maintain consistency across your entire SaaS stack, fostering greater efficiency and unlocking new possibilities for intelligent automation within your enterprise.

# What You Can Do

# MCP Configuration
```
{
  "mcpServers": {
    "mcp-actionkit-dev": {
      "url": "http://localhost:3001/sse?user=[user-id]"
    }
  }
}
```
```
{
  "mcpServers": {
    "mcp-actionkit-dev": {
      "url": "http://localhost:3001/sse?user=[user-id]"
    }
  }
}
```

# Required Environment Variables
```
SIGNING_KEY
```
```
MCP_SERVER_URL
```
```
CONNECT_SDK_CDN_URL
```
```
ACTIONKIT_BASE_URL
```
```
ZEUS_BASE_URL
```
```
PROXY_BASE_URL
```

# Requirements
- npm package manager
- Docker

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
Paragon is an integration platform designed to help developers build native product integrations faster and more efficiently. Its ActionKit API is a cornerstone, providing a unified interface to connect over 130 diverse SaaS applications for seamless data flow and workflow automation.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Web Animation & Motion Design Expert

# LLM Integration & Prompt Engineering

# AWS Cloud Architecture Expert

# Python DevOps & Infrastructure Automation

# 🔄 Workflows

# Analyze Bundle Size

# Supabase Row Level Security (RLS)

# Secure API from CSRF

# Update All Dependencies

