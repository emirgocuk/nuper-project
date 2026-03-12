# Agentset
Source: https://antigravity.codes/mcp/agentset

## AI Worker Instructions
When the user requests functionality related to Agentset, follow these guidelines and utilize this context.

## Scraped Content

# Agentset
RAG for your knowledge base connected to [Agentset](https://agentset.ai).
The Agentset MCP Server empowers developers to seamlessly integrate their proprietary knowledge bases with AI agents, leveraging advanced Retrieval Augmented Generation (RAG) capabilities. This server acts as a crucial bridge, allowing AI agents to access, understand, and utilize context-specific information from your internal documentation, databases, and other data sources. By grounding agent responses in factual, up-to-date data, it significantly reduces the likelihood of hallucinations and improves the accuracy and relevance of AI-driven interactions.
Designed to connect directly with the Agentset platform, this MCP server extends the intelligence of your Agentset AI applications. Developers can configure the server to ingest and index data from various formats, making it retrievable by agents in real-time. This means your AI agents are no longer limited to their pre-trained knowledge but can consult your organization's specific expertise, policies, and historical data to provide more insightful and precise outputs.
For developers, the Agentset MCP Server offers a robust solution for building sophisticated, enterprise-ready AI applications. It simplifies the complex task of connecting disparate knowledge repositories to intelligent agents, providing a standardized and efficient mechanism to enhance AI performance and reliability. Utilize this server to unlock the full potential of your AI agents, allowing them to make informed decisions and deliver highly relevant information based on your unique data landscape.

# What You Can Do

# MCP Configuration
```
{
  "mcpServers": {
    "agentset": {
      "command": "npx",
      "args": [
        "-y",
        "@agentset/mcp@latest"
      ],
      "env": {
        "AGENTSET_API_KEY": "agentset_xxx",
        "AGENTSET_NAMESPACE_ID": "ns_xxx"
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "agentset": {
      "command": "npx",
      "args": [
        "-y",
        "@agentset/mcp@latest"
      ],
      "env": {
        "AGENTSET_API_KEY": "agentset_xxx",
        "AGENTSET_NAMESPACE_ID": "ns_xxx"
      }
    }
  }
}
```

# Required Environment Variables
```
AGENTSET_API_KEY
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
Agentset AI is building the core infrastructure for the AI agent economy, empowering developers to build, deploy, and manage production-grade AI agents that automate complex workflows and interact with the real world.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Monitoring & Observability (Prometheus, Grafana)

# JavaScript ES6+ Modern Features Expert

# TypeScript Strict Mode & Safety

# Mastering TypeScript Generics

# 🔄 Workflows

# Setup VS Code Multi-Root Workspace

# NextAuth.js (Auth.js) v5 Setup

# Implement Dark Mode

# Undo a "Bad" Public Push

