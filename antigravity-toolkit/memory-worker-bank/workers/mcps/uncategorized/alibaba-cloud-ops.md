# Alibaba Cloud OPS
Source: https://antigravity.codes/mcp/alibaba-cloud-ops

## AI Worker Instructions
When the user requests functionality related to Alibaba Cloud OPS, follow these guidelines and utilize this context.

## Scraped Content

# Alibaba Cloud OPS
Manage the lifecycle of your Alibaba Cloud resources with [CloudOps Orchestration Service](https://www.alibabacloud.com/en/product/oos) and Alibaba Cloud OpenAPI.
The Alibaba Cloud OPS MCP Server empowers developers to programmatically manage the full lifecycle of their Alibaba Cloud resources directly through a unified Model-Controller-Provider (MCP) interface. By integrating seamlessly with Alibaba Cloud's CloudOps Orchestration Service (OOS) and Alibaba Cloud OpenAPI, this server transforms complex operational tasks into intuitive commands, allowing for the automation of provisioning, configuration, scaling, and decommissioning of various cloud services such as ECS instances, RDS databases, VPC networks, and more. It acts as a powerful bridge, bringing the robust capabilities of Alibaba Cloud's automation and management tools into your preferred development environment.
This server is designed for developers and DevOps engineers seeking to enhance their cloud operational efficiency and implement infrastructure-as-code principles within the Alibaba Cloud ecosystem. Key features include the ability to execute OOS templates, invoke OpenAPI actions, and monitor resource states, all from a central control point. It abstracts away the intricacies of direct API calls and console operations, providing a consistent and repeatable way to interact with your cloud infrastructure.
Leveraging the Alibaba Cloud OPS MCP Server means achieving greater agility and reliability in your cloud deployments. Developers can automate routine maintenance, ensure consistent environment setups, orchestrate complex multi-service applications, and respond rapidly to operational events, ultimately leading to faster development cycles, reduced manual errors, and a more robust cloud infrastructure. It's an essential tool for anyone looking to optimize their Alibaba Cloud operations through programmatic control and intelligent automation.

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
Alibaba Cloud is the data intelligence backbone of Alibaba Group, a global leader in cloud computing and artificial intelligence. They offer a comprehensive suite of cloud services including computing, database, networking, storage, security, and enterprise solutions to businesses worldwide.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# 📝 Code Review Agent - Thorough & Constructive Reviewer

# Mobile UI/UX Best Practices

# Go Cloud Native Development

# Progressive Web App (PWA) Expert

# 🔄 Workflows

# Debugging Infinite Re-renders

# Nuke & Reinstall

# Setup Prettier & ESLint from Scratch

# Setup Semantic Versioning

