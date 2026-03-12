# AltTester®
Source: https://antigravity.codes/mcp/alttester

## AI Worker Instructions
When the user requests functionality related to AltTester®, follow these guidelines and utilize this context.

## Scraped Content

# AltTester®
Use AltTester® capabilities to connect and test your Unity or Unreal game. Write game test automation faster and smarter, using [AltTester](https://alttester.com) and the AltTester® MCP server.
The AltTester MCP server acts as a bridge, connecting large language models directly to your running Unity or Unreal Engine game. This integration allows you to leverage AltTester's powerful game testing framework using natural language. Instead of writing complex test scripts in C# or Python, you can simply describe the actions you want to perform, such as finding objects, tapping buttons, or verifying on-screen text. This AI-driven approach significantly accelerates the test creation process, making it more intuitive and accessible to the entire development team, from QA engineers to game designers.
The primary value of the AltTester server is its ability to dramatically boost productivity and lower the barrier to entry for game test automation. It enables rapid, exploratory testing and allows for the quick generation of robust end-to-end test scenarios. By interacting with your game's objects directly through simple commands, you can debug issues faster, automate repetitive checks, and ensure a higher quality standard for your game builds. This makes the AltTester MCP server an essential tool for any modern game development team looking to implement smarter and more efficient testing workflows.

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
Altom specializes in software testing services and the development of innovative test automation tools like AltTester, designed to improve the quality of software products.

# Tags

# Related Servers

# Explore More Resources

# ⚡ Rules

# 🤖 AI Prompt Engineer Agent - LLM Expert

# Express.js Advanced Patterns

# Infrastructure as Code (Terraform, Pulumi)

# Python Async Programming Expert

# 🔄 Workflows

# Implement Rate Limiting

# Automatic commit message generator

# Debugging Infinite Re-renders

# Update All Dependencies

