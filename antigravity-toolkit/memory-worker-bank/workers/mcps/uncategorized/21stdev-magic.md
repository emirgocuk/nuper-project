# 21st.dev Magic
Source: https://antigravity.codes/mcp/21st-dev-magic

## AI Worker Instructions
When the user requests functionality related to 21st.dev Magic, follow these guidelines and utilize this context.

## Scraped Content

# 21st.dev Magic
Create crafted UI components inspired by the best 21st.dev design engineers.
The 21st.dev Magic MCP server is an innovative tool designed to significantly accelerate and enhance the creation of user interface components within developer workflows. Leveraging the sophisticated design principles and expertise of 21st.dev's leading design engineers, this server provides AI-powered assistance for generating high-quality, aesthetically pleasing, and functionally robust UI elements. It acts as a bridge between cutting-edge design and efficient development, allowing developers to craft intricate UIs without getting bogged down in repetitive styling or complex design system adherence.
Developers can integrate 21st.dev Magic directly into their preferred MCP-compatible environments, enabling them to quickly prototype, iterate, and implement UI components that meet rigorous design standards. By offloading the burden of meticulous UI design and boilerplate code generation, the server frees up developers to focus on core application logic and feature development. This not only boosts productivity but also ensures design consistency across projects, making it an invaluable asset for teams aiming for both speed and visual excellence in their applications.

# What You Can Do

# Quick Install
```
npx @21st-dev/cli@latest install <client> --api-key <key>
```

# MCP Configuration
```
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": [
        "-y",
        "@21st-dev/magic@latest",
        "API_KEY=\"your-api-key\""
      ]
    }
  }
}
```
```
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": [
        "-y",
        "@21st-dev/magic@latest",
        "API_KEY=\"your-api-key\""
      ]
    }
  }
}
```

# Required Environment Variables
```
API_KEY
```

# Requirements
- Node.js (Latest LTS version recommended)
- One of the supported IDEs:

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
21st.dev is a pioneering organization at the intersection of advanced design engineering and innovative developer tools. They specialize in creating solutions that streamline the development process, foster design excellence, and empower engineers to build high-quality applications with efficiency and precision.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# App Store Optimization & Deployment

# PyTorch Deep Learning Expert

# Modern JavaScript ES6+ Best Practices

# Monitoring & Observability (Prometheus, Grafana)

# 🔄 Workflows

# E2E Testing Setup (Playwright)

# Automatic commit message generator

# Fix Next.js Hydration Errors

# Kill Port 3000

