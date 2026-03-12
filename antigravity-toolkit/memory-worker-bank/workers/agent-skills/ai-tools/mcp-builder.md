# mcp-builder
Source: https://antigravity.codes/agent-skills/ai-tools/mcp-builder

## AI Worker Instructions
When the user requests functionality related to mcp-builder, follow these guidelines and utilize this context.

## Scraped Content

# mcp-builder
```
github_create_issue
```
```
github_list_repos
```
```
https://modelcontextprotocol.io/sitemap.xml
```
```
.md
```
```
https://modelcontextprotocol.io/specification/draft.md
```
```
https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md
```
```
https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md
```
```
outputSchema
```
```
structuredContent
```
```
readOnlyHint
```
```
destructiveHint
```
```
idempotentHint
```
```
openWorldHint
```
```
npm run build
```
```
npx @modelcontextprotocol/inspector
```
```
python -m py_compile your_server.py
```
```
<evaluation>  <qa_pair>    <question>Find discussions about AI model launches with animal codenames. One model needed a specific safety designation that uses the format ASL-X. What number X was being determined for the model named after a spotted wild cat?</question>    <answer>3</answer>  </qa_pair><!-- More qa_pairs... --></evaluation>
```
```
<evaluation>  <qa_pair>    <question>Find discussions about AI model launches with animal codenames. One model needed a specific safety designation that uses the format ASL-X. What number X was being determined for the model named after a spotted wild cat?</question>    <answer>3</answer>  </qa_pair><!-- More qa_pairs... --></evaluation>
```
```
https://modelcontextprotocol.io/sitemap.xml
```
```
.md
```
```
https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md
```
```
https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md
```
```
@mcp.tool
```
```
server.registerTool
```
The `mcp-builder` skill empowers developers to architect robust Model Context Protocol (MCP) servers, crucial for extending the capabilities of large language models. By creating well-defined tools, you enable LLMs to seamlessly interact with a myriad of external APIs and services, transforming theoretical AI potential into practical, task-accomplishing agents. This guide is your blueprint for crafting discoverable, efficient, and high-quality MCP servers, ensuring your AI agents can navigate and operate in the real world with unparalleled precision and adaptability.

# When to Use This Skill
- •Building a custom MCP server to allow an LLM agent to manage project tasks via a third-party project management API (e.g., Jira, Asana).
- •Developing an MCP server that provides an LLM with financial data access and transaction capabilities through a banking API.
- •Creating an MCP interface for an LLM to control IoT devices or smart home systems.
- •Integrating internal company services (e.g., HR systems, CRM) with LLMs via a secure MCP server for automated workflows.

# Pro Tips
- 💡Prioritize comprehensive API coverage over overly specialized workflow tools when starting, as this gives agents maximum flexibility to compose operations.
- 💡Adopt consistent, action-oriented tool naming conventions (e.g., `service_action_object`) to enhance discoverability and reduce agent confusion.
- 💡Craft concise yet informative tool descriptions and parameter schemas to optimize context management for the LLM.

