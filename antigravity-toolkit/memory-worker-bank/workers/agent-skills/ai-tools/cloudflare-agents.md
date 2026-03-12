# cloudflare-agents
Source: https://antigravity.codes/agent-skills/ai-tools/cloudflare-agents

## AI Worker Instructions
When the user requests functionality related to cloudflare-agents, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-agents
```
import { context }
```
```
export class ChatAgent extends AIChatAgent<Env> {  async onChatMessage(onFinish) {    return streamText({      model: openai('gpt-4o-mini'),      messages: this.messages,      onFinish    }).toTextStreamResponse();    // ✅ Stream automatically resumable    // - Client disconnects? Stream preserved    // - Page refresh? Stream continues    // - Multiple tabs? All stay in sync  }}
```
```
export class ChatAgent extends AIChatAgent<Env> {  async onChatMessage(onFinish) {    return streamText({      model: openai('gpt-4o-mini'),      messages: this.messages,      onFinish    }).toTextStreamResponse();    // ✅ Stream automatically resumable    // - Client disconnects? Stream preserved    // - Page refresh? Stream continues    // - Multiple tabs? All stay in sync  }}
```
```
// worker.ts - Simple chat with AI SDK onlyimport { streamText } from 'ai';import { openai } from '@ai-sdk/openai';export default {  async fetch(request: Request, env: Env) {    const { messages } = await request.json();    const result = streamText({      model: openai('gpt-4o-mini'),      messages    });    return result.toTextStreamResponse(); // Automatic SSE streaming  }}// client.tsx - React with built-in hooksimport { useChat } from 'ai/react';function ChatPage() {  const { messages, input, handleSubmit } = useChat({ api: '/api/chat' });  // Done. No Agents SDK needed.}
```
```
// worker.ts - Simple chat with AI SDK onlyimport { streamText } from 'ai';import { openai } from '@ai-sdk/openai';export default {  async fetch(request: Request, env: Env) {    const { messages } = await request.json();    const result = streamText({      model: openai('gpt-4o-mini'),      messages    });    return result.toTextStreamResponse(); // Automatic SSE streaming  }}// client.tsx - React with built-in hooksimport { useChat } from 'ai/react';function ChatPage() {  const { messages, input, handleSubmit } = useChat({ api: '/api/chat' });  // Done. No Agents SDK needed.}
```
```
Building an AI application?│├─ Need WebSocket bidirectional communication? ───────┐│  (Client sends while server streams, agent-initiated messages)│├─ Need Durable Objects stateful instances? ──────────┤│  (Globally unique agents with persistent memory)│├─ Need multi-agent coordination? ────────────────────┤│  (Agents calling/messaging other agents)│├─ Need scheduled tasks or cron jobs? ────────────────┤│  (Delayed execution, recurring tasks)│├─ Need human-in-the-loop workflows? ─────────────────┤│  (Approval gates, review processes)│└─ If ALL above are NO ─────────────────────────────→ Use AI SDK directly                                                       (Much simpler approach)   If ANY above are YES ────────────────────────────→ Use Agents SDK + AI SDK                                                       (More infrastructure, more power)
```
```
Building an AI application?│├─ Need WebSocket bidirectional communication? ───────┐│  (Client sends while server streams, agent-initiated messages)│├─ Need Durable Objects stateful instances? ──────────┤│  (Globally unique agents with persistent memory)│├─ Need multi-agent coordination? ────────────────────┤│  (Agents calling/messaging other agents)│├─ Need scheduled tasks or cron jobs? ────────────────┤│  (Delayed execution, recurring tasks)│├─ Need human-in-the-loop workflows? ─────────────────┤│  (Approval gates, review processes)│└─ If ALL above are NO ─────────────────────────────→ Use AI SDK directly                                                       (Much simpler approach)   If ANY above are YES ────────────────────────────→ Use Agents SDK + AI SDK                                                       (More infrastructure, more power)
```
```
npm create cloudflare@latest my-agent -- \  --template=cloudflare/agents-starter \  --ts \  --git \  --deploy false
```
```
npm create cloudflare@latest my-agent -- \  --template=cloudflare/agents-starter \  --ts \  --git \  --deploy false
```
```
cd my-existing-workernpm install agents
```
```
cd my-existing-workernpm install agents
```
```
// src/index.tsimport { Agent, AgentNamespace } from "agents";export class MyAgent extends Agent {  async onRequest(request: Request): Promise<Response> {    return new Response("Hello from Agent!");  }}export default MyAgent;
```
```
// src/index.tsimport { Agent, AgentNamespace } from "agents";export class MyAgent extends Agent {  async onRequest(request: Request): Promise<Response> {    return new Response("Hello from Agent!");  }}export default MyAgent;
```
```
wrangler.jsonc
```
```
{  "$schema": "node_modules/wrangler/config-schema.json",  "name": "my-agent",  "main": "src/index.ts",  "compatibility_date": "2025-10-21",  "compatibility_flags": ["nodejs_compat"],  "durable_objects": {    "bindings": [      {        "name": "MyAgent",        // MUST match class name        "class_name": "MyAgent"   // MUST match exported class      }    ]  },  "migrations": [    {      "tag": "v1",      "new_sqlite_classes": ["MyAgent"]  // CRITICAL: Enables SQLite storage    }  ]}
```
```
{  "$schema": "node_modules/wrangler/config-schema.json",  "name": "my-agent",  "main": "src/index.ts",  "compatibility_date": "2025-10-21",  "compatibility_flags": ["nodejs_compat"],  "durable_objects": {    "bindings": [      {        "name": "MyAgent",        // MUST match class name        "class_name": "MyAgent"   // MUST match exported class      }    ]  },  "migrations": [    {      "tag": "v1",      "new_sqlite_classes": ["MyAgent"]  // CRITICAL: Enables SQLite storage    }  ]}
```
```
name
```
```
class_name
```
```
new_sqlite_classes
```
```
npx wrangler@latest deploy
```
```
npx wrangler@latest deploy
```
```
https://my-agent.<subdomain>.workers.dev
```
```
┌─────────────────────────────────────────────────────────┐│                    Your Application                      ││                                                          ││  ┌────────────────┐         ┌──────────────────────┐   ││  │  Agents SDK    │         │   AI Inference       │   ││  │  (Infra Layer) │   +     │   (Brain Layer)      │   ││  │                │         │                      │   ││  │ • WebSockets   │         │  Choose ONE:         │   ││  │ • Durable Objs │         │  • Vercel AI SDK ✅   │   ││  │ • State (SQL)  │         │  • Workers AI ⚠️      │   ││  │ • Scheduling   │         │  • OpenAI Direct     │   ││  │ • Multi-agent  │         │  • Anthropic Direct  │   ││  └────────────────┘         └──────────────────────┘   ││         ↓                             ↓                ││  Manages connections          Generates responses      ││  and state                    and handles streaming    │└─────────────────────────────────────────────────────────┘                          ↓              Cloudflare Workers + Durable Objects
```
```
┌─────────────────────────────────────────────────────────┐│                    Your Application                      ││                                                          ││  ┌────────────────┐         ┌──────────────────────┐   ││  │  Agents SDK    │         │   AI Inference       │   ││  │  (Infra Layer) │   +     │   (Brain Layer)      │   ││  │                │         │                      │   ││  │ • WebSockets   │         │  Choose ONE:         │   ││  │ • Durable Objs │         │  • Vercel AI SDK ✅   │   ││  │ • State (SQL)  │         │  • Workers AI ⚠️      │   ││  │ • Scheduling   │         │  • OpenAI Direct     │   ││  │ • Multi-agent  │         │  • Anthropic Direct  │   ││  └────────────────┘         └──────────────────────┘   ││         ↓                             ↓                ││  Manages connections          Generates responses      ││  and state                    and handles streaming    │└─────────────────────────────────────────────────────────┘                          ↓              Cloudflare Workers + Durable Objects
```
```
onStart
```
```
onConnect
```
```
onMessage
```
```
onClose
```
```
this.schedule()
```
```
routeAgentRequest()
```
```
useAgent
```
```
AgentClient
```
```
agentFetch
```
```
useChat
```
```
useCompletion
```
```
useAssistant
```
```
import { streamText } from 'ai';import { openai } from '@ai-sdk/openai';const result = streamText({  model: openai('gpt-4o-mini'),  messages: [...]});// Returns SSE stream - no manual parsing neededreturn result.toTextStreamResponse();
```
```
import { streamText } from 'ai';import { openai } from '@ai-sdk/openai';const result = streamText({  model: openai('gpt-4o-mini'),  messages: [...]});// Returns SSE stream - no manual parsing neededreturn result.toTextStreamResponse();
```
```
import { AIChatAgent } from "agents/ai-chat-agent";import { streamText } from "ai";export class MyAgent extends AIChatAgent<Env> {  async onChatMessage(onFinish) {    // Agents SDK provides: WebSocket, state, this.messages    // AI SDK provides: Automatic streaming, provider abstraction    return streamText({      model: openai('gpt-4o-mini'),      messages: this.messages  // Managed by Agents SDK    }).toTextStreamResponse();  }}
```
```
import { AIChatAgent } from "agents/ai-chat-agent";import { streamText } from "ai";export class MyAgent extends AIChatAgent<Env> {  async onChatMessage(onFinish) {    // Agents SDK provides: WebSocket, state, this.messages    // AI SDK provides: Automatic streaming, provider abstraction    return streamText({      model: openai('gpt-4o-mini'),      messages: this.messages  // Managed by Agents SDK    }).toTextStreamResponse();  }}
```
```
const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {  messages: [...],  stream: true});// Returns raw SSE format - YOU must parsefor await (const chunk of response) {  const text = new TextDecoder().decode(chunk);  // Uint8Array → string  if (text.startsWith('data: ')) {              // Check SSE format    const data = JSON.parse(text.slice(6));     // Parse JSON    if (data.response) {                        // Extract .response field      fullResponse += data.response;    }  }}
```
```
const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {  messages: [...],  stream: true});// Returns raw SSE format - YOU must parsefor await (const chunk of response) {  const text = new TextDecoder().decode(chunk);  // Uint8Array → string  if (text.startsWith('data: ')) {              // Check SSE format    const data = JSON.parse(text.slice(6));     // Parse JSON    if (data.response) {                        // Extract .response field      fullResponse += data.response;    }  }}
```
```
import { AIChatAgent } from "agents/ai-chat-agent";import { streamText } from "ai";import { openai } from "@ai-sdk/openai";export class ChatAgent extends AIChatAgent<Env> {  async onChatMessage(onFinish) {    return streamText({      model: openai('gpt-4o-mini'),      messages: this.messages,  // Agents SDK manages history      onFinish    }).toTextStreamResponse();  }}
```
```
import { AIChatAgent } from "agents/ai-chat-agent";import { streamText } from "ai";import { openai } from "@ai-sdk/openai";export class ChatAgent extends AIChatAgent<Env> {  async onChatMessage(onFinish) {    return streamText({      model: openai('gpt-4o-mini'),      messages: this.messages,  // Agents SDK manages history      onFinish    }).toTextStreamResponse();  }}
```
```
import { Agent } from "agents";export class BudgetAgent extends Agent<Env> {  async onMessage(connection, message) {    const response = await this.env.AI.run('@cf/meta/llama-3-8b-instruct', {      messages: [...],      stream: true    });    // Manual SSE parsing required (see Workers AI section above)    for await (const chunk of response) {      // ... manual parsing ...    }  }}
```
```
import { Agent } from "agents";export class BudgetAgent extends Agent<Env> {  async onMessage(connection, message) {    const response = await this.env.AI.run('@cf/meta/llama-3-8b-instruct', {      messages: [...],      stream: true    });    // Manual SSE parsing required (see Workers AI section above)    for await (const chunk of response) {      // ... manual parsing ...    }  }}
```
```
// worker.ts - Simple Workers routeexport default {  async fetch(request: Request, env: Env) {    const { messages } = await request.json();    const result = streamText({      model: openai('gpt-4o-mini'),      messages    });    return result.toTextStreamResponse();  }}// client.tsx - Built-in React hooksimport { useChat } from 'ai/react';function Chat() {  const { messages, input, handleSubmit } = useChat({ api: '/api/chat' });  return <form onSubmit={handleSubmit}>...</form>;}
```
```
// worker.ts - Simple Workers routeexport default {  async fetch(request: Request, env: Env) {    const { messages } = await request.json();    const result = streamText({      model: openai('gpt-4o-mini'),      messages    });    return result.toTextStreamResponse();  }}// client.tsx - Built-in React hooksimport { useChat } from 'ai/react';function Chat() {  const { messages, input, handleSubmit } = useChat({ api: '/api/chat' });  return <form onSubmit={handleSubmit}>...</form>;}
```
```
ai-sdk-core
```
```
cloudflare-workers-ai
```
```
{  "durable_objects": {    "bindings": [{ "name": "MyAgent", "class_name": "MyAgent" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["MyAgent"] }  // MUST be in first migration  ]}
```
```
{  "durable_objects": {    "bindings": [{ "name": "MyAgent", "class_name": "MyAgent" }]  },  "migrations": [    { "tag": "v1", "new_sqlite_classes": ["MyAgent"] }  // MUST be in first migration  ]}
```
```
ai
```
```
vectorize
```
```
browser
```
```
workflows
```
```
d1_databases
```
```
r2_buckets
```
```
new_sqlite_classes
```
```
name
```
```
class_name
```
```
Agent<Env, State>
```
```
onStart()
```
```
onRequest()
```
```
onConnect/onMessage/onClose()
```
```
onStateUpdate()
```
```
this.env
```
```
this.state
```
```
this.setState()
```
```
this.sql
```
```
this.name
```
```
this.schedule()
```
```
export class ChatAgent extends Agent<Env, State> {  async onConnect(connection: Connection, ctx: ConnectionContext) {    // Auth check, add to participants, send welcome  }  async onMessage(connection: Connection, message: WSMessage) {    // Process message, update state, broadcast response  }}
```
```
export class ChatAgent extends Agent<Env, State> {  async onConnect(connection: Connection, ctx: ConnectionContext) {    // Auth check, add to participants, send welcome  }  async onMessage(connection: Connection, message: WSMessage) {    // Process message, update state, broadcast response  }}
```
```
this.setState(newState)
```
```
this.sql
```
```
await this.sqlCREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT)await this.sqlINSERT INTO users (email) VALUES (${userEmail})  // ← Prepared statementconst users = await this.sqlSELECT * FROM users WHERE email = ${email}  // ← Returns array
```
```
await this.sqlCREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT)await this.sqlINSERT INTO users (email) VALUES (${userEmail})  // ← Prepared statementconst users = await this.sqlSELECT * FROM users WHERE email = ${email}  // ← Returns array
```
```
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT)
```
```
INSERT INTO users (email) VALUES (${userEmail})
```
```
SELECT * FROM users WHERE email = ${email}
```
```
interface MyState {  count: number;  name: string;}export class MyAgent extends Agent<Env, MyState> {  initialState = { count: 0, name: "default" };  async increment() {    // TypeScript allows this, but runtime may differ    const currentState = this.state; // Type is MyState    // If state was corrupted/modified externally:    // { count: "invalid", otherField: 123 }    // TypeScript still shows it as MyState    // count field doesn't match (string vs number)    // otherField is dropped silently  }}
```
```
interface MyState {  count: number;  name: string;}export class MyAgent extends Agent<Env, MyState> {  initialState = { count: 0, name: "default" };  async increment() {    // TypeScript allows this, but runtime may differ    const currentState = this.state; // Type is MyState    // If state was corrupted/modified externally:    // { count: "invalid", otherField: 123 }    // TypeScript still shows it as MyState    // count field doesn't match (string vs number)    // otherField is dropped silently  }}
```
```
// Validate state shape at runtimefunction validateState(state: unknown): state is MyState {  return (    typeof state === 'object' &&    state !== null &&    'count' in state &&    typeof (state as MyState).count === 'number' &&    'name' in state &&    typeof (state as MyState).name === 'string'  );}async increment() {  if (!validateState(this.state)) {    console.error('State validation failed', this.state);    // Reset to valid state    await this.setState(this.initialState);    return;  }  // Safe to use  const newCount = this.state.count + 1;  await this.setState({ ...this.state, count: newCount });}
```
```
// Validate state shape at runtimefunction validateState(state: unknown): state is MyState {  return (    typeof state === 'object' &&    state !== null &&    'count' in state &&    typeof (state as MyState).count === 'number' &&    'name' in state &&    typeof (state as MyState).name === 'string'  );}async increment() {  if (!validateState(this.state)) {    console.error('State validation failed', this.state);    // Reset to valid state    await this.setState(this.initialState);    return;  }  // Safe to use  const newCount = this.state.count + 1;  await this.setState({ ...this.state, count: newCount });}
```
```
this.schedule()
```
```
export class MyAgent extends Agent {  async onRequest(request: Request): Promise<Response> {    // Schedule task to run in 60 seconds    const { id } = await this.schedule(60, "checkStatus", { requestId: "123" });    return Response.json({ scheduledTaskId: id });  }  // This method will be called in 60 seconds  async checkStatus(data: { requestId: string }) {    console.log('Checking status for request:', data.requestId);    // Perform check, update state, send notification, etc.  }}
```
```
export class MyAgent extends Agent {  async onRequest(request: Request): Promise<Response> {    // Schedule task to run in 60 seconds    const { id } = await this.schedule(60, "checkStatus", { requestId: "123" });    return Response.json({ scheduledTaskId: id });  }  // This method will be called in 60 seconds  async checkStatus(data: { requestId: string }) {    console.log('Checking status for request:', data.requestId);    // Perform check, update state, send notification, etc.  }}
```
```
export class MyAgent extends Agent {  async scheduleReminder(reminderDate: string) {    const date = new Date(reminderDate);    const { id } = await this.schedule(date, "sendReminder", {      message: "Time for your appointment!"    });    return id;  }  async sendReminder(data: { message: string }) {    console.log('Sending reminder:', data.message);    // Send email, push notification, etc.  }}
```
```
export class MyAgent extends Agent {  async scheduleReminder(reminderDate: string) {    const date = new Date(reminderDate);    const { id } = await this.schedule(date, "sendReminder", {      message: "Time for your appointment!"    });    return id;  }  async sendReminder(data: { message: string }) {    console.log('Sending reminder:', data.message);    // Send email, push notification, etc.  }}
```
```
export class MyAgent extends Agent {  async setupRecurringTasks() {    // Every 10 minutes    await this.schedule("*/10 * * * *", "checkUpdates", {});    // Every day at 8 AM    await this.schedule("0 8 * * *", "dailyReport", {});    // Every Monday at 9 AM    await this.schedule("0 9 * * 1", "weeklyReport", {});    // Every hour on the hour    await this.schedule("0 * * * *", "hourlyCheck", {});  }  async checkUpdates(data: any) {    console.log('Checking for updates...');  }  async dailyReport(data: any) {    console.log('Generating daily report...');  }  async weeklyReport(data: any) {    console.log('Generating weekly report...');  }  async hourlyCheck(data: any) {    console.log('Running hourly check...');  }}
```
```
export class MyAgent extends Agent {  async setupRecurringTasks() {    // Every 10 minutes    await this.schedule("*/10 * * * *", "checkUpdates", {});    // Every day at 8 AM    await this.schedule("0 8 * * *", "dailyReport", {});    // Every Monday at 9 AM    await this.schedule("0 9 * * 1", "weeklyReport", {});    // Every hour on the hour    await this.schedule("0 * * * *", "hourlyCheck", {});  }  async checkUpdates(data: any) {    console.log('Checking for updates...');  }  async dailyReport(data: any) {    console.log('Generating daily report...');  }  async weeklyReport(data: any) {    console.log('Generating weekly report...');  }  async hourlyCheck(data: any) {    console.log('Running hourly check...');  }}
```
```
export class MyAgent extends Agent {  async manageSchedules() {    // Get all scheduled tasks    const allTasks = this.getSchedules();    console.log('Total tasks:', allTasks.length);    // Get specific task by ID    const taskId = "some-task-id";    const task = await this.getSchedule(taskId);    if (task) {      console.log('Task:', task.callback, 'at', new Date(task.time));      console.log('Payload:', task.payload);      console.log('Type:', task.type);  // "scheduled" | "delayed" | "cron"      // Cancel the task      const cancelled = await this.cancelSchedule(taskId);      console.log('Cancelled:', cancelled);    }    // Get tasks in time range    const upcomingTasks = this.getSchedules({      timeRange: {        start: new Date(),        end: new Date(Date.now() + 24 * 60 * 60 * 1000)  // Next 24 hours      }    });    console.log('Upcoming tasks:', upcomingTasks.length);    // Filter by type    const cronTasks = this.getSchedules({ type: "cron" });    const delayedTasks = this.getSchedules({ type: "delayed" });  }}
```
```
export class MyAgent extends Agent {  async manageSchedules() {    // Get all scheduled tasks    const allTasks = this.getSchedules();    console.log('Total tasks:', allTasks.length);    // Get specific task by ID    const taskId = "some-task-id";    const task = await this.getSchedule(taskId);    if (task) {      console.log('Task:', task.callback, 'at', new Date(task.time));      console.log('Payload:', task.payload);      console.log('Type:', task.type);  // "scheduled" | "delayed" | "cron"      // Cancel the task      const cancelled = await this.cancelSchedule(taskId);      console.log('Cancelled:', cancelled);    }    // Get tasks in time range    const upcomingTasks = this.getSchedules({      timeRange: {        start: new Date(),        end: new Date(Date.now() + 24 * 60 * 60 * 1000)  // Next 24 hours      }    });    console.log('Upcoming tasks:', upcomingTasks.length);    // Filter by type    const cronTasks = this.getSchedules({ type: "cron" });    const delayedTasks = this.getSchedules({ type: "delayed" });  }}
```
```
(task_size * count) + other_state < 1GB
```
```
// ❌ BAD: Method doesn't existawait this.schedule(60, "nonExistentMethod", {});// ✅ GOOD: Method existsawait this.schedule(60, "existingMethod", {});async existingMethod(data: any) {  // Implementation}
```
```
// ❌ BAD: Method doesn't existawait this.schedule(60, "nonExistentMethod", {});// ✅ GOOD: Method existsawait this.schedule(60, "existingMethod", {});async existingMethod(data: any) {  // Implementation}
```
```
wrangler.jsonc
```
```
{  "workflows": [    {      "name": "MY_WORKFLOW",      "class_name": "MyWorkflow"    }  ]}
```
```
{  "workflows": [    {      "name": "MY_WORKFLOW",      "class_name": "MyWorkflow"    }  ]}
```
```
{  "workflows": [    {      "name": "EMAIL_WORKFLOW",      "class_name": "EmailWorkflow",      "script_name": "email-workflows"  // Different project    }  ]}
```
```
{  "workflows": [    {      "name": "EMAIL_WORKFLOW",      "class_name": "EmailWorkflow",      "script_name": "email-workflows"  // Different project    }  ]}
```
```
import { Agent } from "agents";import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";interface Env {  MY_WORKFLOW: Workflow;  MyAgent: AgentNamespace<MyAgent>;}export class MyAgent extends Agent<Env> {  async onRequest(request: Request): Promise<Response> {    const userId = new URL(request.url).searchParams.get('userId');    // Trigger a workflow immediately    const instance = await this.env.MY_WORKFLOW.create({      id: user-${userId},      params: { userId, action: "process" }    });    // Or schedule a delayed workflow trigger    await this.schedule(300, "runWorkflow", { userId });    return Response.json({ workflowId: instance.id });  }  async runWorkflow(data: { userId: string }) {    const instance = await this.env.MY_WORKFLOW.create({      id: delayed-${data.userId},      params: data    });    // Monitor workflow status periodically    await this.schedule("*/5 * * * *", "checkWorkflowStatus", { id: instance.id });  }  async checkWorkflowStatus(data: { id: string }) {    // Check workflow status (see Workflows docs for details)    console.log('Checking workflow:', data.id);  }}// Workflow definition (can be in same or different file/project)export class MyWorkflow extends WorkflowEntrypoint<Env> {  async run(event: WorkflowEvent<{ userId: string }>, step: WorkflowStep) {    // Workflow implementation    const result = await step.do('process-data', async () => {      return { processed: true };    });    return result;  }}
```
```
import { Agent } from "agents";import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";interface Env {  MY_WORKFLOW: Workflow;  MyAgent: AgentNamespace<MyAgent>;}export class MyAgent extends Agent<Env> {  async onRequest(request: Request): Promise<Response> {    const userId = new URL(request.url).searchParams.get('userId');    // Trigger a workflow immediately    const instance = await this.env.MY_WORKFLOW.create({      id: user-${userId},      params: { userId, action: "process" }    });    // Or schedule a delayed workflow trigger    await this.schedule(300, "runWorkflow", { userId });    return Response.json({ workflowId: instance.id });  }  async runWorkflow(data: { userId: string }) {    const instance = await this.env.MY_WORKFLOW.create({      id: delayed-${data.userId},      params: data    });    // Monitor workflow status periodically    await this.schedule("*/5 * * * *", "checkWorkflowStatus", { id: instance.id });  }  async checkWorkflowStatus(data: { id: string }) {    // Check workflow status (see Workflows docs for details)    console.log('Checking workflow:', data.id);  }}// Workflow definition (can be in same or different file/project)export class MyWorkflow extends WorkflowEntrypoint<Env> {  async run(event: WorkflowEvent<{ userId: string }>, step: WorkflowStep) {    // Workflow implementation    const result = await step.do('process-data', async () => {      return { processed: true };    });    return result;  }}
```
```
user-${userId}
```
```
delayed-${data.userId}
```
```
"browser": { "binding": "BROWSER" }
```
```
@cloudflare/puppeteer
```
```
cloudflare-browser-rendering
```
```
"ai": { "binding": "AI" }
```
```
"vectorize": { "bindings": [{ "binding": "VECTORIZE", "index_name": "my-vectors" }] }
```
```
@cf/baai/bge-base-en-v1.5
```
```
this.env.VECTORIZE.upsert(vectors)
```
```
this.env.VECTORIZE.query(queryVector, { topK: 5 })
```
```
cloudflare-vectorize
```
```
ai-sdk-core
```
```
cloudflare-workers-ai
```
```
routeAgentRequest(request, env)
```
```
/agents/:agent/:name
```
```
/agents/my-agent/user-123
```
```
getAgentByName<Env, T>(env.AgentBinding, instanceName)
```
```
const agent = getAgentByName(env.MyAgent, 'user-${userId}')
```
```
export class AgentA extends Agent<Env> {  async processData(data: any) {    const agentB = getAgentByName<Env, AgentB>(this.env.AgentB, 'processor-1');    return await (await agentB).analyze(data);  }}
```
```
export class AgentA extends Agent<Env> {  async processData(data: any) {    const agentB = getAgentByName<Env, AgentB>(this.env.AgentB, 'processor-1');    return await (await agentB).analyze(data);  }}
```
```
AgentClient
```
```
agents/client
```
```
agentFetch
```
```
agents/client
```
```
useAgent
```
```
agents/react
```
```
useAgentChat
```
```
agents/ai-react
```
```
npm install @modelcontextprotocol/sdk agents
```
```
npm install @modelcontextprotocol/sdk agents
```
```
import { McpAgent } from "agents/mcp";import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";import { z } from "zod";export class MyMCP extends McpAgent {  server = new McpServer({ name: "Demo", version: "1.0.0" });  async init() {    // Define a tool    this.server.tool(      "add",      "Add two numbers together",      {        a: z.number().describe("First number"),        b: z.number().describe("Second number")      },      async ({ a, b }) => ({        content: [{ type: "text", text: String(a + b) }]      })    );  }}
```
```
import { McpAgent } from "agents/mcp";import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";import { z } from "zod";export class MyMCP extends McpAgent {  server = new McpServer({ name: "Demo", version: "1.0.0" });  async init() {    // Define a tool    this.server.tool(      "add",      "Add two numbers together",      {        a: z.number().describe("First number"),        b: z.number().describe("Second number")      },      async ({ a, b }) => ({        content: [{ type: "text", text: String(a + b) }]      })    );  }}
```
```
type State = { counter: number };export class StatefulMCP extends McpAgent<Env, State> {  server = new McpServer({ name: "Counter", version: "1.0.0" });  initialState: State = { counter: 0 };  async init() {    // Resource    this.server.resource(      "counter",      "mcp://resource/counter",      (uri) => ({        contents: [{ uri: uri.href, text: String(this.state.counter) }]      })    );    // Tool    this.server.tool(      "increment",      "Increment the counter",      { amount: z.number() },      async ({ amount }) => {        this.setState({          ...this.state,          counter: this.state.counter + amount        });        return {          content: [{            type: "text",            text: Counter is now ${this.state.counter}          }]        };      }    );  }}
```
```
type State = { counter: number };export class StatefulMCP extends McpAgent<Env, State> {  server = new McpServer({ name: "Counter", version: "1.0.0" });  initialState: State = { counter: 0 };  async init() {    // Resource    this.server.resource(      "counter",      "mcp://resource/counter",      (uri) => ({        contents: [{ uri: uri.href, text: String(this.state.counter) }]      })    );    // Tool    this.server.tool(      "increment",      "Increment the counter",      { amount: z.number() },      async ({ amount }) => {        this.setState({          ...this.state,          counter: this.state.counter + amount        });        return {          content: [{            type: "text",            text: Counter is now ${this.state.counter}          }]        };      }    );  }}
```
```
Counter is now ${this.state.counter}
```
```
import { Hono } from 'hono';const app = new Hono();// Modern streamable HTTP transport (recommended)app.mount('/mcp', MyMCP.serve('/mcp').fetch, { replaceRequest: false });// Legacy SSE transport (deprecated)app.mount('/sse', MyMCP.serveSSE('/sse').fetch, { replaceRequest: false });export default app;
```
```
import { Hono } from 'hono';const app = new Hono();// Modern streamable HTTP transport (recommended)app.mount('/mcp', MyMCP.serve('/mcp').fetch, { replaceRequest: false });// Legacy SSE transport (deprecated)app.mount('/sse', MyMCP.serveSSE('/sse').fetch, { replaceRequest: false });export default app;
```
```
2024-11-05
```
```
2025-11-25
```
```
Error: Unsupported MCP protocol version: 2025-11-25
```
```
import { OAuthProvider } from '@cloudflare/workers-oauth-provider';export default new OAuthProvider({  apiHandlers: {    '/sse': MyMCP.serveSSE('/sse'),    '/mcp': MyMCP.serve('/mcp')  },  // OAuth configuration  clientId: 'your-client-id',  clientSecret: 'your-client-secret',  // ... other OAuth settings});
```
```
import { OAuthProvider } from '@cloudflare/workers-oauth-provider';export default new OAuthProvider({  apiHandlers: {    '/sse': MyMCP.serveSSE('/sse'),    '/mcp': MyMCP.serve('/mcp')  },  // OAuth configuration  clientId: 'your-client-id',  clientSecret: 'your-client-secret',  // ... other OAuth settings});
```
```
# Run MCP inspectornpx @modelcontextprotocol/inspector@latest# Connect to: http://localhost:8788/mcp
```
```
# Run MCP inspectornpx @modelcontextprotocol/inspector@latest# Connect to: http://localhost:8788/mcp
```
```
npx wrangler versions deploy
```
```
new_sqlite_classes
```
```
export class MyAgent extends Agent
```
```
name
```
```
class_name
```
```
blockConcurrencyWhile
```
```
blockConcurrencyWhile
```
```
// ✅ Fixed in 0.2.x - schedule callbacks can now run for their full durationexport class MyAgent extends Agent<Env> {  async onRequest(request: Request) {    await this.schedule(60, "processAIRequest", { query: "..." });  }  async processAIRequest(data: { query: string }) {    // This can now take > 30s without timeout    const result = await streamText({      model: openai('gpt-4o'),      messages: [{ role: 'user', content: data.query }]    });  }}
```
```
// ✅ Fixed in 0.2.x - schedule callbacks can now run for their full durationexport class MyAgent extends Agent<Env> {  async onRequest(request: Request) {    await this.schedule(60, "processAIRequest", { query: "..." });  }  async processAIRequest(data: { query: string }) {    // This can now take > 30s without timeout    const result = await streamText({      model: openai('gpt-4o'),      messages: [{ role: 'user', content: data.query }]    });  }}
```
```
"browser": { "binding": "BROWSER" }
```
```
wrangler vectorize create
```
```
/mcp
```
```
MyMCP.serve('/mcp')
```
```
/sse
```
```
user-${userId}
```
```
Uint8Array
```
```
TextDecoder
```
```
const response = await env.AI.run(model, { stream: true });for await (const chunk of response) {  console.log(chunk.response);  // ❌ undefined - chunk is Uint8Array, not object}
```
```
const response = await env.AI.run(model, { stream: true });for await (const chunk of response) {  console.log(chunk.response);  // ❌ undefined - chunk is Uint8Array, not object}
```
```
const response = await env.AI.run(model, { stream: true });for await (const chunk of response) {  const text = new TextDecoder().decode(chunk);  // Step 1: Uint8Array → string  if (text.startsWith('data: ')) {              // Step 2: Check SSE format    const jsonStr = text.slice(6).trim();       // Step 3: Extract JSON from "data: {...}"    if (jsonStr === '[DONE]') break;            // Step 4: Handle termination    const data = JSON.parse(jsonStr);           // Step 5: Parse JSON    if (data.response) {                        // Step 6: Extract .response field      fullResponse += data.response;    }  }}
```
```
const response = await env.AI.run(model, { stream: true });for await (const chunk of response) {  const text = new TextDecoder().decode(chunk);  // Step 1: Uint8Array → string  if (text.startsWith('data: ')) {              // Step 2: Check SSE format    const jsonStr = text.slice(6).trim();       // Step 3: Extract JSON from "data: {...}"    if (jsonStr === '[DONE]') break;            // Step 4: Handle termination    const data = JSON.parse(jsonStr);           // Step 5: Parse JSON    if (data.response) {                        // Step 6: Extract .response field      fullResponse += data.response;    }  }}
```
```
import { streamText } from 'ai';import { createCloudflare } from '@ai-sdk/cloudflare';const cloudflare = createCloudflare();const result = streamText({  model: cloudflare('@cf/meta/llama-3-8b-instruct', { binding: env.AI }),  messages});// No manual parsing needed ✅
```
```
import { streamText } from 'ai';import { createCloudflare } from '@ai-sdk/cloudflare';const cloudflare = createCloudflare();const result = streamText({  model: cloudflare('@cf/meta/llama-3-8b-instruct', { binding: env.AI }),  messages});// No manual parsing needed ✅
```
```
Error: internal error; reference = [reference ID]
```
```
// Workaround: Prune old messages client-sidefunction pruneMessages(messages: Message[]): Message[] {  let totalSize = 0;  const pruned = [];  // Keep recent messages until we hit size limit  for (let i = messages.length - 1; i >= 0; i--) {    const msgSize = JSON.stringify(messages[i]).length;    if (totalSize + msgSize > 950_000) break; // 950KB limit    pruned.unshift(messages[i]);    totalSize += msgSize;  }  return pruned;}// Use before sending to agentconst prunedMessages = pruneMessages(allMessages);
```
```
// Workaround: Prune old messages client-sidefunction pruneMessages(messages: Message[]): Message[] {  let totalSize = 0;  const pruned = [];  // Keep recent messages until we hit size limit  for (let i = messages.length - 1; i >= 0; i--) {    const msgSize = JSON.stringify(messages[i]).length;    if (totalSize + msgSize > 950_000) break; // 950KB limit    pruned.unshift(messages[i]);    totalSize += msgSize;  }  return pruned;}// Use before sending to agentconst prunedMessages = pruneMessages(allMessages);
```
```
toolCallId
```
```
input-available
```
```
needsApproval: true
```
```
input-available
```
```
approval-responded
```
```
// Current behavior (agents@0.3.3)export class MyAgent extends AIChatAgent<Env> {  tools = {    sensitiveAction: tool({      needsApproval: true,  // ⚠️ Causes duplicate messages      execute: async (args) => {        return { result: "action completed" };      }    })  };}// Result: Two messages persist// 1. Server message: ID "assistant_1768917665170_4mub00d32", state "input-available"// 2. Client message: ID "oFwQwEpvLd8f1Gwd", state "approval-responded"
```
```
// Current behavior (agents@0.3.3)export class MyAgent extends AIChatAgent<Env> {  tools = {    sensitiveAction: tool({      needsApproval: true,  // ⚠️ Causes duplicate messages      execute: async (args) => {        return { result: "action completed" };      }    })  };}// Result: Two messages persist// 1. Server message: ID "assistant_1768917665170_4mub00d32", state "input-available"// 2. Client message: ID "oFwQwEpvLd8f1Gwd", state "approval-responded"
```
```
needsApproval
```
```
Duplicate item found with id rs_xxx
```
```
useAgentChat
```
```
providerMetadata.openai.itemId
```
```
// ✅ Fixed in 0.2.31+ - no changes needed// Just ensure you're on agents@0.2.31 or later
```
```
// ✅ Fixed in 0.2.31+ - no changes needed// Just ensure you're on agents@0.2.31 or later
```
```
401 Unauthorized
```
```
cacheTtl
```
```
useAgent
```
```
cacheKey
```
```
useMemo
```
```
// Force cache invalidation by including token version in queryDepsconst [tokenVersion, setTokenVersion] = useState(0);const { state } = useAgent({  query: async () => ({ token: await getJWT() }),  queryDeps: [tokenVersion], // ✅ Force new cache key  cacheTtl: 60_000,});// Manually refresh token before expiryuseEffect(() => {  const interval = setInterval(() => {    setTokenVersion(v => v + 1);  }, 50_000); // Refresh every 50s  return () => clearInterval(interval);}, []);
```
```
// Force cache invalidation by including token version in queryDepsconst [tokenVersion, setTokenVersion] = useState(0);const { state } = useAgent({  query: async () => ({ token: await getJWT() }),  queryDeps: [tokenVersion], // ✅ Force new cache key  cacheTtl: 60_000,});// Manually refresh token before expiryuseEffect(() => {  const interval = setInterval(() => {    setTokenVersion(v => v + 1);  }, 50_000); // Refresh every 50s  return () => clearInterval(interval);}, []);
```
```
TypeError: validator.getValidator is not a function
```
```
JSON.stringify()
```
```
CfWorkerJsonSchemaValidator
```
```
JSON.parse()
```
```
// ❌ Before fix - manual validator caused errorsimport { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/cloudflare-worker';const mcpAgent = new McpAgent({  client: {    jsonSchemaValidator: new CfWorkerJsonSchemaValidator(), // Got serialized to {}  }});
```
```
// ❌ Before fix - manual validator caused errorsimport { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/cloudflare-worker';const mcpAgent = new McpAgent({  client: {    jsonSchemaValidator: new CfWorkerJsonSchemaValidator(), // Got serialized to {}  }});
```
```
// ✅ Now automatic - no manual validator neededconst mcpAgent = new McpAgent({  // SDK handles validator internally});
```
```
// ✅ Now automatic - no manual validator neededconst mcpAgent = new McpAgent({  // SDK handles validator internally});
```
```
Error: Client does not support form elicitation
```
```
WorkerTransport
```
```
TransportState
```
```
sessionId
```
```
initialized
```
```
clientCapabilities
```
```
// Client advertised elicitation capability during handshake,// but after hibernation, capability info was lostawait server.elicitInput({ /* form */ }); // ❌ Error: capabilities lost
```
```
// Client advertised elicitation capability during handshake,// but after hibernation, capability info was lostawait server.elicitInput({ /* form */ }); // ❌ Error: capabilities lost
```
```
// TransportState now includes clientCapabilitiesinterface TransportState {  sessionId: string;  initialized: boolean;  clientCapabilities?: ClientCapabilities; // ✅ Now persisted}
```
```
// TransportState now includes clientCapabilitiesinterface TransportState {  sessionId: string;  initialized: boolean;  clientCapabilities?: ClientCapabilities; // ✅ Now persisted}
```
```
newUniqueId()
```
```
idFromName()
```
```
idFromName()
```
```
newUniqueId()
```
```
// ❌ WRONG: Creates new agent every time (state never persists)export default {  async fetch(request: Request, env: Env) {    const id = env.MyAgent.newUniqueId(); // New ID = new instance    const agent = env.MyAgent.get(id);    // State never persists - different instance each time    return agent.fetch(request);  }}// ✅ CORRECT: Same user = same agent = persistent stateexport default {  async fetch(request: Request, env: Env) {    const userId = getUserId(request);    const id = env.MyAgent.idFromName(userId); // Same ID for same user    const agent = env.MyAgent.get(id);    // State persists across requests for this user    return agent.fetch(request);  }}
```
```
// ❌ WRONG: Creates new agent every time (state never persists)export default {  async fetch(request: Request, env: Env) {    const id = env.MyAgent.newUniqueId(); // New ID = new instance    const agent = env.MyAgent.get(id);    // State never persists - different instance each time    return agent.fetch(request);  }}// ✅ CORRECT: Same user = same agent = persistent stateexport default {  async fetch(request: Request, env: Env) {    const userId = getUserId(request);    const id = env.MyAgent.idFromName(userId); // Same ID for same user    const agent = env.MyAgent.get(id);    // State persists across requests for this user    return agent.fetch(request);  }}
```
```
newUniqueId()
```
```
idFromName(string)
```
```
idFromName()
```
```
newUniqueId()
```
```
agents
```
```
@modelcontextprotocol/sdk
```
```
@cloudflare/puppeteer
```
```
ai
```
```
@ai-sdk/openai
```
```
@ai-sdk/anthropic
```
```
wrangler-agents-config.jsonc
```
```
basic-agent.ts
```
```
websocket-agent.ts
```
```
state-sync-agent.ts
```
```
scheduled-agent.ts
```
```
workflow-agent.ts
```
```
browser-agent.ts
```
```
rag-agent.ts
```
```
chat-agent-streaming.ts
```
```
calling-agents-worker.ts
```
```
react-useagent-client.tsx
```
```
mcp-server-basic.ts
```
```
hitl-agent.ts
```
```
agent-class-api.md
```
```
client-api-reference.md
```
```
state-management-guide.md
```
```
websockets-sse.md
```
```
scheduling-api.md
```
```
workflows-integration.md
```
```
browser-rendering.md
```
```
rag-patterns.md
```
```
mcp-server-guide.md
```
```
mcp-tools-reference.md
```
```
hitl-patterns.md
```
```
best-practices.md
```
```
chat-bot-complete.md
```
```
multi-agent-workflow.md
```
```
scheduled-reports.md
```
```
browser-scraper-agent.md
```
```
rag-knowledge-base.md
```
```
mcp-remote-server.md
```
```
/* Most apps just need AI SDK directly */// Simple chat = AI SDK// Stateful multi-turn = Cloudflare Agents/* Use Agents when you need: */// - Persistent state across sessions// - WebSocket real-time chat// - Scheduled tasks from AI// - Complex multi-step workflows
```
```
/* Most apps just need AI SDK directly */// Simple chat = AI SDK// Stateful multi-turn = Cloudflare Agents/* Use Agents when you need: */// - Persistent state across sessions// - WebSocket real-time chat// - Scheduled tasks from AI// - Complex multi-step workflows
```
```
/* ❌ Cannot add SQLite later */migrations: [  { tag: 'v1' },  { tag: 'v2', new_sqlite_classes: ['MyAgent'] } // Too late!]/* ✅ Must be in v1 */migrations: [  { tag: 'v1', new_sqlite_classes: ['MyAgent'] }]
```
```
/* ❌ Cannot add SQLite later */migrations: [  { tag: 'v1' },  { tag: 'v2', new_sqlite_classes: ['MyAgent'] } // Too late!]/* ✅ Must be in v1 */migrations: [  { tag: 'v1', new_sqlite_classes: ['MyAgent'] }]
```
```
/* ❌ "Binding not found" */class MyAgent extends Agent { }/* ✅ Export the class */export class MyAgent extends Agent { }
```
```
/* ❌ "Binding not found" */class MyAgent extends Agent { }/* ✅ Export the class */export class MyAgent extends Agent { }
```
```
/* ❌ Auth inside agent (too late) */class MyAgent extends Agent {  async onConnect() {    if (!authenticated) throw new Error('Unauthorized')  }}/* ✅ Auth in Worker before creating agent */export default {  async fetch(request, env) {    const user = await authenticate(request)    if (!user) return new Response('Unauthorized', { status: 401 })    // Now create agent with authenticated user    return env.AGENT.get(env.AGENT.idFromName(user.id)).fetch(request)  }}
```
```
/* ❌ Auth inside agent (too late) */class MyAgent extends Agent {  async onConnect() {    if (!authenticated) throw new Error('Unauthorized')  }}/* ✅ Auth in Worker before creating agent */export default {  async fetch(request, env) {    const user = await authenticate(request)    if (!user) return new Response('Unauthorized', { status: 401 })    // Now create agent with authenticated user    return env.AGENT.get(env.AGENT.idFromName(user.id)).fetch(request)  }}
```
```
/* ❌ Expecting automatic parsing */const stream = await env.AI.run('@cf/meta/llama-3-8b', { stream: true })/* ✅ Manual SSE parsing required */const reader = stream.getReader()const decoder = new TextDecoder()while (true) {  const { done, value } = await reader.read()  if (done) break  const text = decoder.decode(value)  // Parse SSE format: data: {...}\n\n  for (const line of text.split('\n')) {    if (line.startsWith('data: ')) {      const json = JSON.parse(line.slice(6))      // Process json.response    }  }}
```
```
/* ❌ Expecting automatic parsing */const stream = await env.AI.run('@cf/meta/llama-3-8b', { stream: true })/* ✅ Manual SSE parsing required */const reader = stream.getReader()const decoder = new TextDecoder()while (true) {  const { done, value } = await reader.read()  if (done) break  const text = decoder.decode(value)  // Parse SSE format: data: {...}\n\n  for (const line of text.split('\n')) {    if (line.startsWith('data: ')) {      const json = JSON.parse(line.slice(6))      // Process json.response    }  }}
```
```
/* ⚠️ Same name = same agent globally */const id = env.AGENT.idFromName('user-123')// Anyone with 'user-123' accesses same agent!/* ✅ Use unique, unpredictable names */const id = env.AGENT.idFromName(user:${userId}:${sessionId})
```
```
/* ⚠️ Same name = same agent globally */const id = env.AGENT.idFromName('user-123')// Anyone with 'user-123' accesses same agent!/* ✅ Use unique, unpredictable names */const id = env.AGENT.idFromName(user:${userId}:${sessionId})
```
```
user:${userId}:${sessionId}
```
```
v1
```
```
idFromName
```
Unlock the next generation of AI agent capabilities with the Cloudflare Agents SDK. Designed for seamless integration within the Cloudflare ecosystem, this skill empowers developers to build sophisticated, stateful AI agents. It goes beyond basic interactions, offering advanced features like resumable streaming, which ensures persistent conversational flow even across network interruptions or device changes. Leverage this powerful SDK to create intelligent, responsive AI applications that benefit from Cloudflare's robust edge network, enhancing performance, reliability, and scalability for your AI solutions.

# When to Use This Skill
- •Developing AI chatbots that maintain context and continue conversations seamlessly across multiple sessions or devices, thanks to resumable streaming.
- •Implementing long-running AI data processing tasks that require persistent connections and can resume from any point after network interruptions.
- •Building AI agents that automate email responses, summarize threads, or manage inboxes, leveraging the integrated email capabilities.
- •Creating intelligent backend services on Cloudflare Workers that use task queues for asynchronous AI operations and integrations with external systems.

# Pro Tips
- 💡Always pair the Agents SDK with `cloudflare-worker-base` for robust, scalable Cloudflare Worker deployments, ensuring optimal performance and resource management.
- 💡Design your AI agents to fully leverage resumable streaming, particularly for interactive or long-form content generation, to provide a superior, uninterrupted user experience.
- 💡Keep an eye on updates to the @modelcontextprotocol/sdk to ensure your agents are always compatible with the latest AI models and communication standards.

