# Antom
Source: https://antigravity.codes/mcp/antom

## AI Worker Instructions
When the user requests functionality related to Antom, follow these guidelines and utilize this context.

## Scraped Content

# Antom
Connect your AI Agents to Antom Checkout Payment.
The Antom MCP server provides a robust and secure bridge for your AI agents to interact directly with the Antom Checkout Payment ecosystem. It exposes a set of powerful tools that allow autonomous systems to manage the entire payment lifecycle programmatically. By integrating this server, developers can empower their AI applications to create payment sessions, generate secure checkout links, inquire about transaction statuses, and even process refunds without manual intervention.
This server is designed for developers building next-generation e-commerce platforms, automated financial assistants, or any application where AI needs to handle monetary transactions. It abstracts the complexity of payment processing into a simple, agent-friendly interface, enabling rapid development and deployment of AI-powered financial solutions. Leverage the official Antom server to build reliable, scalable, and intelligent payment workflows into your AI agents, unlocking new possibilities for automated commerce and billing.

# What You Can Do

# MCP Configuration
```
{
  "mcpServers": {
    "antom-mcp-server": {
      "command": "uvx",
      "args": [
        "ant-intl-antom-mcp"
      ],
      "env": {
        "GATEWAY_URL": "https://open-sea-global.alipay.com",
        "CLIENT_ID": "your_client_id_here",
        "MERCHANT_PRIVATE_KEY": "your_merchant_private_key_here",
        "ALIPAY_PUBLIC_KEY": "your_alipay_public_key_here",
        "PAYMENT_REDIRECT_URL": "/",
        "PAYMENT_NOTIFY_URL": "https://your-domain.com/payment/notify"
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "antom-mcp-server": {
      "command": "uvx",
      "args": [
        "ant-intl-antom-mcp"
      ],
      "env": {
        "GATEWAY_URL": "https://open-sea-global.alipay.com",
        "CLIENT_ID": "your_client_id_here",
        "MERCHANT_PRIVATE_KEY": "your_merchant_private_key_here",
        "ALIPAY_PUBLIC_KEY": "your_alipay_public_key_here",
        "PAYMENT_REDIRECT_URL": "/",
        "PAYMENT_NOTIFY_URL": "https://your-domain.com/payment/notify"
      }
    }
  }
}
```

# Required Environment Variables
```
GATEWAY_URL
```
```
MERCHANT_PRIVATE_KEY
```
```
ALIPAY_PUBLIC_KEY
```
```
PAYMENT_REDIRECT_URL
```
```
PAYMENT_NOTIFY_URL
```

# Requirements
- **Python 3.11 or higher**
- **uv** (recommended package manager) or **pip**
- **Valid Antom Merchant Account** with:

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
Antom is a leading global payment partner that provides businesses with a comprehensive suite of payment solutions and services to accelerate their global expansion.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Python Async Programming Expert

# Infrastructure as Code (Terraform, Pulumi)

# Python Backend Development with FastAPI

# Kubernetes & Container Orchestration

# 🔄 Workflows

# Setup Service Worker for Offline

# Handle File Uploads (S3)

# Debugging Infinite Re-renders

# Setup VS Code Multi-Root Workspace

