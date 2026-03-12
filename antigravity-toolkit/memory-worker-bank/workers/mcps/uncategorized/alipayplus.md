# AlipayPlus
Source: https://antigravity.codes/mcp/alipayplus

## AI Worker Instructions
When the user requests functionality related to AlipayPlus, follow these guidelines and utilize this context.

## Scraped Content

# AlipayPlus
Connect your AI Agents to AlipayPlus Checkout Payment.
The AlipayPlus MCP (Model Controller Protocol) server provides a crucial bridge for developers looking to integrate robust payment capabilities directly into their AI agents and applications. This official server simplifies the complex process of connecting AI-driven services to the AlipayPlus global checkout system, allowing AI agents to initiate and complete transactions programmatically. It serves as an essential component for monetizing AI products, enabling seamless in-app purchases, subscriptions, or one-time payments facilitated by intelligent automation.
Key features include streamlined API access to AlipayPlus payment functionalities, support for various global payment methods available through the AlipayPlus network, and secure transaction handling. Developers can leverage this server to empower their AI agents with the ability to manage financial transactions, process refunds, and offer dynamic pricing, all while abstracting away the underlying payment infrastructure complexities. This empowers AI agents to become fully transactional, opening up new business models and user experiences for AI-powered platforms.
For developers, the value proposition is significant: accelerate time-to-market for AI applications requiring payment features, tap into AlipayPlus's extensive global user base, and ensure compliance with payment processing standards. By using the official AlipayPlus MCP server, developers can focus on enhancing their AI's core intelligence and user interaction, confident that the payment gateway is reliable, secure, and officially supported, making AI monetization both accessible and efficient.

# What You Can Do

# Quick Install
```
pip install ant-intl-alipayplus-mcp
```

# MCP Configuration
```
{
  "mcpServers": {
    "alipayplus-mcp": {
      "command": "uvx",
      "args": [
        "ant-intl-alipayplus-mcp"
      ],
      "env": {
        "GATEWAY_URL": "https://open-sea-global.alipay.com",
        "CLIENT_ID": "your_client_id_here",
        "MERCHANT_PRIVATE_KEY": "your_merchant_private_key_here",
        "ALIPAY_PUBLIC_KEY": "your_alipay_public_key_here",
        "PAYMENT_NOTIFY_URL": "https://your-domain.com/payment/notify",
        "SETTLEMENT_CURRENCY": "USD",
        "MERCHANT_NAME": "Your Merchant Name",
        "MERCHANT_ID": "Your Merchant ID",
        "MERCHANT_MCC": "5411",
        "MERCHANT_REGION": "US"
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "alipayplus-mcp": {
      "command": "uvx",
      "args": [
        "ant-intl-alipayplus-mcp"
      ],
      "env": {
        "GATEWAY_URL": "https://open-sea-global.alipay.com",
        "CLIENT_ID": "your_client_id_here",
        "MERCHANT_PRIVATE_KEY": "your_merchant_private_key_here",
        "ALIPAY_PUBLIC_KEY": "your_alipay_public_key_here",
        "PAYMENT_NOTIFY_URL": "https://your-domain.com/payment/notify",
        "SETTLEMENT_CURRENCY": "USD",
        "MERCHANT_NAME": "Your Merchant Name",
        "MERCHANT_ID": "Your Merchant ID",
        "MERCHANT_MCC": "5411",
        "MERCHANT_REGION": "US"
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
- **Valid AlipayPlus Merchant Account** with:

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
Alipay is a leading global digital payment and lifestyle platform, part of Ant Group, offering secure and convenient payment services to millions of users and businesses worldwide, including cross-border payment solutions via AlipayPlus.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Svelte & SvelteKit Development

# Unit Test Generator Workflow

# 🔌 API Design Agent - RESTful & GraphQL Expert

# Lit Web Components

# 🔄 Workflows

# Scaffold New Component

# Setup Environment Variables Per Branch

# Setup Database Seeding

# Setup Semantic Versioning

