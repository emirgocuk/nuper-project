# Adfin
Source: https://antigravity.codes/mcp/adfin

## AI Worker Instructions
When the user requests functionality related to Adfin, follow these guidelines and utilize this context.

## Scraped Content

# Adfin
The only platform you need to get paid - all payments in one place, invoicing and accounting reconciliations with [Adfin](https://www.adfin.com/).
The Adfin MCP Server provides developers with programmatic access to Adfin's comprehensive financial platform, designed to centralize and streamline all payment, invoicing, and accounting reconciliation processes. This server acts as a direct bridge, allowing your applications to seamlessly interact with Adfin's robust backend services. It eliminates the complexities often associated with managing disparate financial tools, offering a unified API for critical business operations.
Developers can leverage the Adfin MCP Server to build custom integrations that automate a wide array of financial tasks. This includes managing incoming and outgoing payments, generating and tracking invoices, and performing intricate accounting reconciliations with precision and efficiency. The server empowers businesses to gain greater control over their financial workflows, ensuring accuracy and reducing manual effort across the entire financial cycle.
By integrating with Adfin, developers can significantly accelerate the development of financial applications, create custom dashboards for real-time financial insights, or embed Adfin's capabilities directly into existing enterprise systems. This leads to increased operational productivity, better data integrity, and the ability to innovate faster in areas like payment processing, client billing, and financial reporting, ultimately helping businesses get paid and reconcile accounts effortlessly.

# What You Can Do

# MCP Configuration
```
{
  "mcpServers": {
    "Adfin": {
      "command": "<home_path>/.local/bin/uv",
      "args": [
        "--directory",
        "<absolute_path_to_adfin_mcp_folder>",
        "run",
        "main_adfin_mcp.py"
      ],
      "env": {
        "ADFIN_EMAIL": "<email>",
        "ADFIN_PASSWORD": "<password>"
      }
    },
    "filesystem": {
      "command": "<home_path>/.local/bin/uv",
      "args": [
        "--directory",
        "<absolute_path_to_adfin_mcp_folder>",
        "run",
        "filesystem.py"
      ]
    }
  }
}
```
```
{
  "mcpServers": {
    "Adfin": {
      "command": "<home_path>/.local/bin/uv",
      "args": [
        "--directory",
        "<absolute_path_to_adfin_mcp_folder>",
        "run",
        "main_adfin_mcp.py"
      ],
      "env": {
        "ADFIN_EMAIL": "<email>",
        "ADFIN_PASSWORD": "<password>"
      }
    },
    "filesystem": {
      "command": "<home_path>/.local/bin/uv",
      "args": [
        "--directory",
        "<absolute_path_to_adfin_mcp_folder>",
        "run",
        "filesystem.py"
      ]
    }
  }
}
```

# Requirements

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
Adfin provides a comprehensive platform that centralizes payment processing, invoicing, and accounting reconciliation, streamlining financial operations for businesses worldwide.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# Graph Databases (Neo4j)

# Python CLI Development Expert

# Python Data Engineering Expert

# Rust WebAssembly (WASM) Development

# 🔄 Workflows

# Automatic commit message generator

# Prune Docker System

# Supabase Row Level Security (RLS)

# Check SSL Certificates

