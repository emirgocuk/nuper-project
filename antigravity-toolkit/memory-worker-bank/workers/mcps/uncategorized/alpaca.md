# Alpaca
Source: https://antigravity.codes/mcp/alpaca

## AI Worker Instructions
When the user requests functionality related to Alpaca, follow these guidelines and utilize this context.

## Scraped Content

# Alpaca
Alpaca's MCP server lets you trade stocks and options, analyze market data, and build strategies through [Alpaca's Trading API](https://alpaca.markets/)
The Alpaca MCP Server provides a direct gateway for developers to interact with Alpaca's robust Trading API. This server enables programmatic access to a comprehensive suite of financial services, including trading stocks and options, accessing real-time and historical market data, and executing complex trading strategies. It acts as a crucial bridge, allowing developers to seamlessly integrate Alpaca's powerful financial infrastructure into their applications, bots, and analytical tools without needing to manage the underlying API calls directly.
Developers can leverage this server to build sophisticated financial applications, automate their trading workflows, and conduct in-depth market analysis. Whether you're looking to create custom dashboards for monitoring your portfolio, develop algorithmic trading bots that respond to market events, or backtest new investment strategies against extensive historical data, the Alpaca MCP Server streamlines these processes. It provides a standardized and efficient interface for interacting with a world-class brokerage platform, empowering developers to focus on their logic and innovation rather than connectivity.
This official MCP server from Alpaca is designed for reliability and ease of use, ensuring that developers have a smooth experience in accessing financial markets. It offers a powerful foundation for anyone looking to innovate in the fintech space, build personal finance tools, or create advanced quantitative trading systems. By simplifying access to trading capabilities and market intelligence, the Alpaca MCP Server significantly reduces the barrier to entry for developing cutting-edge financial technology.

# What You Can Do

# Quick Install
```
docker run --rm -p 8000:8000 \
```

# MCP Configuration
```
{
  "mcpServers": {
    "alpaca": {
      "command": "uvx",
      "args": [
        "alpaca-mcp-server",
        "serve"
      ],
      "env": {
        "ALPACA_API_KEY": "your_alpaca_api_key",
        "ALPACA_SECRET_KEY": "your_alpaca_secret_key"
      }
    }
  }
}
```
```
{
  "mcpServers": {
    "alpaca": {
      "command": "uvx",
      "args": [
        "alpaca-mcp-server",
        "serve"
      ],
      "env": {
        "ALPACA_API_KEY": "your_alpaca_api_key",
        "ALPACA_SECRET_KEY": "your_alpaca_secret_key"
      }
    }
  }
}
```

# Required Environment Variables
```
ALPACA_API_KEY
```
```
ALPACA_SECRET_KEY
```
```
TRADE_API_URL
```
```
DATA_API_URL
```
```
ALPACA_BASE_URL
```

# Requirements
- **Terminal** (macOS/Linux) | **Command Prompt or PowerShell** (Windows)
- **Python 3.10+** (Check the [official installation guide](https://www.python.org/downloads/) and confirm the version by typing the following command: `python3 --version` in Terminal)
- **uv** (Install using the [official guide](https://docs.astral.sh/uv/getting-started/installation/))\
- **Alpaca Trading API keys** (free paper trading account available)
- **MCP client** (Claude Desktop, Cursor, VS Code, etc.)

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
Alpaca is a commission-free stock and options trading platform that provides APIs for developers to build trading applications, bots, and services. They offer brokerage services, market data, and advanced trading tools tailored for the developer community.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# GraphQL with TypeScript Expert

# Go CLI Development

# Kubernetes & Container Orchestration

# Strong Reasoner & Planner Agent (Official Google Template)

# 🔄 Workflows

# Ultimate Next.js SEO Setup

# Debug WebSocket Connection Issues

# Fix Next.js Hydration Errors

# Migrate Redux to Zustand

