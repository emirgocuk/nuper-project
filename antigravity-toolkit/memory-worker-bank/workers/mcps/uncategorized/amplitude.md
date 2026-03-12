# Amplitude
Source: https://antigravity.codes/mcp/amplitude

## AI Worker Instructions
When the user requests functionality related to Amplitude, follow these guidelines and utilize this context.

## Scraped Content

# Amplitude
The Amplitude MCP server enables seamless integration between AI assistants and your product data, allowing you to search, analyze, and query charts, dashboards, experiments, feature flags, and metrics directly from your AI interface.
The Amplitude MCP server provides a powerful bridge between your AI assistant and your product analytics data, enabling you to make data-driven decisions faster. It allows you to use natural language within your AI interface to directly interact with your Amplitude instance, eliminating the need to manually navigate dashboards and build reports. This seamless integration empowers both technical and non-technical users to access critical business insights on demand, transforming how you engage with your product data.
Key features include the ability to search for and retrieve detailed information about specific Amplitude assets such as charts, dashboards, cohorts, experiments, and feature flags. By exposing your product data through a secure and structured API for AI assistants, you can ask complex questions like "What was our user retention last month?" or "Show me the results of the latest checkout page experiment." This server significantly boosts productivity by bringing your most important metrics directly into your conversational workflow, making data more accessible and actionable for the entire team.

# What You Can Do

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
Amplitude is a leading product analytics platform that helps businesses unlock the power of their products by providing deep insights into user behavior, engagement, and retention.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Remix Framework Expert

# Cross-Platform Development Strategies

# MySQL/MariaDB Expert

# NestJS TypeScript Backend Expert

# 🔄 Workflows

# Setup Husky Git Hooks

# Setup Supabase Realtime

# Implement Blue-Green Deployment

# Setup Local Database (Postgres)

