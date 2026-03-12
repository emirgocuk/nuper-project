# 2slides
Source: https://antigravity.codes/mcp/2slides

## AI Worker Instructions
When the user requests functionality related to 2slides, follow these guidelines and utilize this context.

## Scraped Content

# 2slides
An MCP server that provides tools to convert content into slides/PPT/presentation or generate slides/PPT/presentation with user intention.
The 2slides MCP server empowers developers to programmatically generate and convert content into professional-grade presentations, including PowerPoint (PPT) and other slide formats. This server acts as a powerful backend for transforming raw data, textual content, or even complex user intentions into visually structured slide decks. Its core utility lies in abstracting the intricate details of presentation design and layout, allowing developers to focus on content delivery and integration within their applications.
Leveraging advanced capabilities, 2slides can either directly convert existing content—such as reports, articles, or data summaries—into a sequence of slides, or it can intelligently generate entirely new presentations based on a user's high-level intent or prompt. This "intention-driven" generation capability hints at underlying AI or machine learning models that understand context, structure information logically, and suggest appropriate visual layouts. This dramatically reduces the manual effort and time typically required to create presentations from scratch or to adapt existing content for presentation purposes.
For developers, 2slides offers a significant value proposition: automate tedious presentation tasks, integrate dynamic slide generation into data analytics platforms, build tools for content repurposing, or enable non-technical users to create presentations effortlessly through an API. By exposing its functionalities via the MCP, 2slides becomes a flexible component in any developer's toolkit, enabling efficient content visualization and communication at scale.

# What You Can Do

# MCP Configuration
```
{
  "mcpServers": {
    "2slides": {
      "command": "npx",
      "args": [
        "2slides-mcp"
      ],
      "env": {
        "API_KEY": "YOUR_2SLIDES_API_KEY"
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "2slides": {
      "command": "npx",
      "args": [
        "2slides-mcp"
      ],
      "env": {
        "API_KEY": "YOUR_2SLIDES_API_KEY"
      }
    }
  }
}
```

# Available Tools
```
slides_generate
```
```
jobs_get
```
```
themes_search
```
```
slides_create_like_this
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
A community-driven project focused on automating presentation creation and content-to-slide conversion, available as an MCP server.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Flutter & Dart Development

# NestJS TypeScript Backend Expert

# TypeScript Node.js Backend Expert

# Next.js Testing Strategies Expert

# 🔄 Workflows

# Security Hardening Checklist

# Reduce Bundle Size

# Setup Database Seeding

# Deploy to Vercel Preview

