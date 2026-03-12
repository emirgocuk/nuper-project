# Alby Bitcoin Payments
Source: https://antigravity.codes/mcp/alby-bitcoin-payments

## AI Worker Instructions
When the user requests functionality related to Alby Bitcoin Payments, follow these guidelines and utilize this context.

## Scraped Content

# Alby Bitcoin Payments
Connect any bitcoin lightning wallet to your agent to send and receive instant payments globally with your agent.
The Alby Bitcoin Payments MCP (Multi-Modal Communication Protocol) server revolutionizes how AI agents interact with the global financial system by enabling seamless Bitcoin Lightning transactions. This server acts as a critical bridge, allowing any AI agent to send and receive instant, low-cost payments globally by connecting to a standard Bitcoin Lightning wallet. Developers can integrate this server to empower their AI applications with financial capabilities, moving beyond mere information processing to actual economic participation. Imagine agents that can pay for services, receive micropayments for tasks, or even manage their own operational budgets autonomously.
Key features for developers include a straightforward integration pathway for connecting various Bitcoin Lightning wallets, including Alby's own infrastructure, to their agent frameworks. This official Alby MCP server ensures robust and reliable interaction with the Lightning Network, known for its speed and efficiency, making it ideal for high-frequency or small-value transactions that are typical in agent-to-agent or agent-to-human interactions. It abstracts away the complexities of blockchain interaction, providing a clean API for agents to initiate and confirm payments, opening up a new paradigm for monetized AI.
The value proposition for developers is immense: unlock new business models for AI services, enable sophisticated autonomous agents that can navigate economic landscapes, and significantly reduce friction for micropayments in AI-driven applications. By leveraging Alby Bitcoin Payments, developers can build agents that are not just intelligent but also economically active, fostering innovation in areas like decentralized finance, automated marketplaces, and Web3 integration for AI.

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
Alby provides tools and infrastructure to easily connect applications and users to the Bitcoin Lightning Network, simplifying the use of Bitcoin for instant payments and microtransactions in the web environment.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# JavaScript ES6+ Modern Features Expert

# Strong Reasoner & Planner Agent (Official Google Template)

# 🔄 Refactoring Agent - Safe Code Improvement

# Next.js API Routes & Route Handlers Expert

# 🔄 Workflows

# Debug Webpack/Vite Build Issues

# Ultimate Next.js SEO Setup

# Setup Supabase Realtime

# Fix CORS Issues

