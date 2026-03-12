# AgentOps
Source: https://antigravity.codes/mcp/agentops

## AI Worker Instructions
When the user requests functionality related to AgentOps, follow these guidelines and utilize this context.

## Scraped Content

# AgentOps
Provide observability and tracing for debugging AI agents with [AgentOps](https://www.agentops.ai/) API.
The AgentOps MCP Server provides a critical bridge for developers working with AI agents, connecting their creations directly to the powerful AgentOps observability and tracing platform. This server allows for seamless integration, enabling developers to monitor, debug, and understand the intricate behaviors of their AI agents in real-time. By channeling agent execution data through this MCP, you gain unparalleled visibility into every step, decision, and interaction your AI agent undertakes.
For developers, the value proposition is immense. AI agents, with their non-deterministic nature and multi-step reasoning, are notoriously difficult to debug. This integration simplifies that complexity by providing detailed traces of agent runs, including tool usage, prompt inputs, LLM outputs, and final outcomes. This deep insight is essential for identifying bottlenecks, pinpointing errors, optimizing agent performance, and ensuring the reliability and trustworthiness of your AI applications.
Leveraging the AgentOps MCP means accelerating your AI agent development lifecycle. Instead of relying on anecdotal evidence or laborious log parsing, you get structured, actionable data that helps you iterate faster, improve agent robustness, and confidently deploy intelligent systems into production. It's an indispensable tool for anyone serious about building, monitoring, and scaling production-grade AI agents.

# What You Can Do

# Quick Install
```
npx -y @smithery/cli install @AgentOps-AI/agentops-mcp --client claude
```

# MCP Configuration
```
{
  "mcpServers": {
    "agentops-mcp": {
      "command": "npx",
      "args": [
        "agentops-mcp"
      ],
      "env": {
        "AGENTOPS_API_KEY": ""
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "agentops-mcp": {
      "command": "npx",
      "args": [
        "agentops-mcp"
      ],
      "env": {
        "AGENTOPS_API_KEY": ""
      }
    }
  }
}
```

# Available Tools
```
api_key
```
```
auth
```

# Requirements
- AgentOps API key (passed as parameter to tools)

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
AgentOps AI provides an observability platform specifically designed for AI agents and LLM applications, offering tools for monitoring, debugging, and tracing to help developers build and deploy reliable AI solutions.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Next.js SEO & Metadata Expert

# JavaScript ES6+ Modern Features Expert

# Python Backend Development with FastAPI

# React Hooks Best Practices

# 🔄 Workflows

# Fix 'Too Many Re-renders' Error

# E2E Testing Setup (Playwright)

# React Performance Profiling

# Implement Dark Mode

