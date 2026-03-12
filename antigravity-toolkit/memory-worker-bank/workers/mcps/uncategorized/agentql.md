# AgentQL
Source: https://antigravity.codes/mcp/agentql

## AI Worker Instructions
When the user requests functionality related to AgentQL, follow these guidelines and utilize this context.

## Scraped Content

# AgentQL
Enable AI agents to get structured data from unstructured web with [AgentQL](https://www.agentql.com/).
The AgentQL MCP server empowers developers to infuse their AI agents with the ability to precisely extract structured data from the vast, unstructured web. This server acts as a crucial bridge, allowing Large Language Models (LLMs) and other AI systems to programmatically interact with websites and retrieve specific information in a clean, usable format like JSON or CSV. Instead of relying on brittle web scraping scripts or manual data collection, AgentQL provides a robust and intelligent layer that understands web page structure and dynamic content, ensuring reliable data acquisition even as websites evolve.
Designed with AI agents in mind, AgentQL simplifies the complex task of web data extraction. Developers can define exactly what data points they need, and the server intelligently navigates, parses, and extracts that information, delivering it directly to their AI models. This capability is vital for building agents that require real-time market intelligence, competitive analysis, lead generation, content aggregation, or any application demanding accurate, up-to-date information from the internet.
By integrating the AgentQL MCP server, developers can significantly accelerate the development of sophisticated AI agents. It frees them from the intricacies of web interaction and parsing, allowing them to focus on the core logic and decision-making capabilities of their AI. This ultimately leads to more powerful, data-driven AI applications that can autonomously gather the specific information needed to perform their tasks with greater accuracy and efficiency.

# What You Can Do

# Quick Install
```
npm install -g agentql-mcp
```

# MCP Configuration
```
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "apiKey",
        "description": "AgentQL API Key",
        "password": true
      }
    ],
    "servers": {
      "agentql": {
        "command": "npx",
        "args": [
          "-y",
          "agentql-mcp"
        ],
        "env": {
          "AGENTQL_API_KEY": "${input:apiKey}"
        }
      }
    }
  }
}
```
```
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "apiKey",
        "description": "AgentQL API Key",
        "password": true
      }
    ],
    "servers": {
      "agentql": {
        "command": "npx",
        "args": [
          "-y",
          "agentql-mcp"
        ],
        "env": {
          "AGENTQL_API_KEY": "${input:apiKey}"
        }
      }
    }
  }
}
```

# Required Environment Variables
```
AGENTQL_API_KEY
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
Tinyfish, Inc. develops AgentQL, a specialized web scraping API designed to provide AI agents and Large Language Models with structured data extracted from the web, enabling them to interact with and understand the internet more effectively.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Next.js Testing Strategies Expert

# Modern CSS & Responsive Design Expert

# Semantic HTML & Accessibility Expert

# Python Backend Development with FastAPI

# 🔄 Workflows

# Simulate Slow Network

# Deploy to Vercel Preview

# Migrate Redux to Zustand

# Check SSL Certificates

