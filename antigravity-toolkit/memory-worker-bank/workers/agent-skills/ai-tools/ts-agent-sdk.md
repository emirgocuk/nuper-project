# ts-agent-sdk
Source: https://antigravity.codes/agent-skills/ai-tools/ts-agent-sdk

## AI Worker Instructions
When the user requests functionality related to ts-agent-sdk, follow these guidelines and utilize this context.

## Scraped Content

# ts-agent-sdk
```
templates/
```
```
scripts/sdk/
```
```
cp -r ~/.claude/skills/ts-agent-sdk/templates/* ./scripts/sdk/
```
```
cp -r ~/.claude/skills/ts-agent-sdk/templates/* ./scripts/sdk/
```
```
src/server/modules/mcp*/server.ts
```
```
src/server/modules/mcp*/server.ts
```
```
server.tool(  'tool_name',  'Tool description',  zodInputSchema,  async (params) => { ... })
```
```
server.tool(  'tool_name',  'Tool description',  zodInputSchema,  async (params) => { ... })
```
```
// From: z.object({ name: z.string(), email: z.string().email() })// To:export interface CreateEnquiryInput {  name: string;  email: string;}
```
```
// From: z.object({ name: z.string(), email: z.string().email() })// To:export interface CreateEnquiryInput {  name: string;  email: string;}
```
```
// scripts/sdk/docs/client.tsimport { MCPClient, defaultClient } from '../client';import type { CreateDocumentInput, CreateDocumentOutput } from './types';const ENDPOINT = '/api/mcp-docs/message';export class DocsClient {  private mcp: MCPClient;  constructor(client?: MCPClient) {    this.mcp = client || defaultClient;  }  async createDocument(input: CreateDocumentInput): Promise<CreateDocumentOutput> {    return this.mcp.callTool(ENDPOINT, 'create_document', input);  }  async listDocuments(input: ListDocumentsInput): Promise<ListDocumentsOutput> {    return this.mcp.callTool(ENDPOINT, 'list_documents', input);  }  // ... one method per tool}export const docs = new DocsClient();
```
```
// scripts/sdk/docs/client.tsimport { MCPClient, defaultClient } from '../client';import type { CreateDocumentInput, CreateDocumentOutput } from './types';const ENDPOINT = '/api/mcp-docs/message';export class DocsClient {  private mcp: MCPClient;  constructor(client?: MCPClient) {    this.mcp = client || defaultClient;  }  async createDocument(input: CreateDocumentInput): Promise<CreateDocumentOutput> {    return this.mcp.callTool(ENDPOINT, 'create_document', input);  }  async listDocuments(input: ListDocumentsInput): Promise<ListDocumentsOutput> {    return this.mcp.callTool(ENDPOINT, 'list_documents', input);  }  // ... one method per tool}export const docs = new DocsClient();
```
```
scripts/sdk/examples/
```
```
#!/usr/bin/env npx tsx// scripts/sdk/examples/create-doc.tsimport { docs } from '../';async function main() {  const result = await docs.createDocument({    spaceId: 'wiki',    title: 'Getting Started',    content: '# Welcome\n\nThis is the intro.',  });  console.log(Created document: ${result.document.id});}main().catch(console.error);
```
```
#!/usr/bin/env npx tsx// scripts/sdk/examples/create-doc.tsimport { docs } from '../';async function main() {  const result = await docs.createDocument({    spaceId: 'wiki',    title: 'Getting Started',    content: '# Welcome\n\nThis is the intro.',  });  console.log(Created document: ${result.document.id});}main().catch(console.error);
```
```
Created document: ${result.document.id}
```
```
scripts/sdk/index.ts
```
```
export { docs } from './docs';export { enquiries } from './enquiries';
```
```
export { docs } from './docs';export { enquiries } from './enquiries';
```
```
project/└── scripts/sdk/    ├── index.ts           # Main exports    ├── config.ts          # Environment config    ├── errors.ts          # Error classes    ├── client.ts          # MCP client    │    ├── docs/              # Generated module    │   ├── types.ts       # TypeScript interfaces    │   ├── client.ts      # Typed methods    │   └── index.ts       # Module exports    │    ├── enquiries/         # Another module    │   ├── types.ts    │   ├── client.ts    │   └── index.ts    │    └── examples/          # Runnable scripts        ├── create-doc.ts        ├── list-spaces.ts        └── create-enquiry.ts
```
```
project/└── scripts/sdk/    ├── index.ts           # Main exports    ├── config.ts          # Environment config    ├── errors.ts          # Error classes    ├── client.ts          # MCP client    │    ├── docs/              # Generated module    │   ├── types.ts       # TypeScript interfaces    │   ├── client.ts      # Typed methods    │   └── index.ts       # Module exports    │    ├── enquiries/         # Another module    │   ├── types.ts    │   ├── client.ts    │   └── index.ts    │    └── examples/          # Runnable scripts        ├── create-doc.ts        ├── list-spaces.ts        └── create-enquiry.ts
```
```
SDK_MODE
```
```
SDK_BASE_URL
```
```
SDK_API_TOKEN
```
```
SDK_API_TOKEN="your-token" SDK_BASE_URL="https://app.workers.dev" npx tsx scripts/sdk/examples/create-doc.ts
```
```
SDK_API_TOKEN="your-token" SDK_BASE_URL="https://app.workers.dev" npx tsx scripts/sdk/examples/create-doc.ts
```
```
AuthError
```
```
ValidationError
```
```
NotFoundError
```
```
RateLimitError
```
```
MCPError
```
```
NetworkError
```
```
src/server/modules/mcp*/server.ts
```
This powerful skill empowers AI agents, particularly Claude Code, to overcome the complexities of direct API interaction. By intelligently analyzing your project's MCP server definitions, it automatically constructs a robust, type-safe TypeScript SDK. This transformation replaces manual, error-prone JSON-RPC curl commands with intuitive, well-defined function calls, significantly enhancing developer productivity and agent reliability. It bridges the gap between AI automation and sophisticated web application backends, making integration smoother and more efficient for complex tasks requiring programmatic interaction with your services.

# When to Use This Skill
- •Automating AI agent interactions with complex web application backends.
- •Rapidly generating type-safe API clients for internal microservices.
- •Streamlining the development of new AI features that require MCP server communication.
- •Refactoring existing AI agent code from raw API calls to SDK-based interactions.

# Pro Tips
- 💡Ensure your MCP server definitions use Zod consistently for reliable schema extraction and TypeScript generation.
- 💡Integrate the generated SDK into your agent's tool definitions to provide structured access to backend functions.
- 💡Utilize the skill to re-generate SDKs regularly as your MCP server's API evolves, keeping your agent's interactions up-to-date.

