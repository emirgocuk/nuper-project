# claude-agent-sdk
Source: https://antigravity.codes/agent-skills/ai-tools/claude-agent-sdk

## AI Worker Instructions
When the user requests functionality related to claude-agent-sdk, follow these guidelines and utilize this context.

## Scraped Content

# claude-agent-sdk
```
outputFormat
```
```
message.structured_output
```
```
structured-outputs-2025-11-13
```
```
import { query } from "@anthropic-ai/claude-agent-sdk";import { z } from "zod";import { zodToJsonSchema } from "zod-to-json-schema";const schema = z.object({  summary: z.string(),  sentiment: z.enum(['positive', 'neutral', 'negative']),  confidence: z.number().min(0).max(1)});const response = query({  prompt: "Analyze this code review feedback",  options: {    model: "claude-sonnet-4-5",    outputFormat: {      type: "json_schema",      json_schema: {        name: "AnalysisResult",        strict: true,        schema: zodToJsonSchema(schema)      }    }  }});for await (const message of response) {  if (message.type === 'result' && message.structured_output) {    // Guaranteed to match schema    const validated = schema.parse(message.structured_output);    console.log(Sentiment: ${validated.sentiment});  }}
```
```
import { query } from "@anthropic-ai/claude-agent-sdk";import { z } from "zod";import { zodToJsonSchema } from "zod-to-json-schema";const schema = z.object({  summary: z.string(),  sentiment: z.enum(['positive', 'neutral', 'negative']),  confidence: z.number().min(0).max(1)});const response = query({  prompt: "Analyze this code review feedback",  options: {    model: "claude-sonnet-4-5",    outputFormat: {      type: "json_schema",      json_schema: {        name: "AnalysisResult",        strict: true,        schema: zodToJsonSchema(schema)      }    }  }});for await (const message of response) {  if (message.type === 'result' && message.structured_output) {    // Guaranteed to match schema    const validated = schema.parse(message.structured_output);    console.log(Sentiment: ${validated.sentiment});  }}
```
```
Sentiment: ${validated.sentiment}
```
```
import { z } from "zod"
```
```
plugins
```
```
PreToolUse
```
```
PostToolUse
```
```
Notification
```
```
UserPromptSubmit
```
```
SubagentStart
```
```
SubagentStop
```
```
PreCompact
```
```
PermissionRequest
```
```
Stop
```
```
SessionStart
```
```
SessionEnd
```
```
Error
```
```
const response = query({  prompt: "...",  options: {    hooks: {      PreToolUse: async (input) => {        console.log(Tool: ${input.toolName});        return { allow: true };  // or { allow: false, message: "..." }      },      PostToolUse: async (input) => {        await logToolUsage(input.toolName, input.result);      }    }  }});
```
```
const response = query({  prompt: "...",  options: {    hooks: {      PreToolUse: async (input) => {        console.log(Tool: ${input.toolName});        return { allow: true };  // or { allow: false, message: "..." }      },      PostToolUse: async (input) => {        await logToolUsage(input.toolName, input.result);      }    }  }});
```
```
Tool: ${input.toolName}
```
```
fallbackModel
```
```
maxThinkingTokens
```
```
strictMcpConfig
```
```
continue
```
```
resume
```
```
permissionMode: 'plan'
```
```
query(prompt: string | AsyncIterable<SDKUserMessage>, options?: Options)  -> AsyncGenerator<SDKMessage>
```
```
query(prompt: string | AsyncIterable<SDKUserMessage>, options?: Options)  -> AsyncGenerator<SDKMessage>
```
```
outputFormat
```
```
settingSources
```
```
canUseTool
```
```
agents
```
```
mcpServers
```
```
permissionMode
```
```
betas
```
```
sandbox
```
```
enableFileCheckpointing
```
```
systemPrompt
```
```
const response = query({  prompt: "Analyze this large codebase",  options: {    betas: ['context-1m-2025-08-07'],  // Enable 1M context    model: "claude-sonnet-4-5"  }});
```
```
const response = query({  prompt: "Analyze this large codebase",  options: {    betas: ['context-1m-2025-08-07'],  // Enable 1M context    model: "claude-sonnet-4-5"  }});
```
```
// 1. Simple stringsystemPrompt: "You are a helpful coding assistant."// 2. Preset with optional append (preserves Claude Code defaults)systemPrompt: {  type: 'preset',  preset: 'claude_code',  append: "\n\nAdditional context: Focus on security."}
```
```
// 1. Simple stringsystemPrompt: "You are a helpful coding assistant."// 2. Preset with optional append (preserves Claude Code defaults)systemPrompt: {  type: 'preset',  preset: 'claude_code',  append: "\n\nAdditional context: Focus on security."}
```
```
allowedTools
```
```
disallowedTools
```
```
canUseTool
```
```
const response = query({  prompt: "Review and refactor the codebase",  options: {    allowedTools: ["Read", "Write", "Edit", "AskUserQuestion"]  }});// Agent can now ask clarifying questions// Questions appear in message stream as tool_call with name "AskUserQuestion"
```
```
const response = query({  prompt: "Review and refactor the codebase",  options: {    allowedTools: ["Read", "Write", "Edit", "AskUserQuestion"]  }});// Agent can now ask clarifying questions// Questions appear in message stream as tool_call with name "AskUserQuestion"
```
```
// 1. Exact allowlist (string array)tools: ["Read", "Write", "Grep"]// 2. Disable all tools (empty array)tools: []// 3. Preset with defaults (object form)tools: { type: 'preset', preset: 'claude_code' }
```
```
// 1. Exact allowlist (string array)tools: ["Read", "Write", "Grep"]// 2. Disable all tools (empty array)tools: []// 3. Preset with defaults (object form)tools: { type: 'preset', preset: 'claude_code' }
```
```
allowedTools
```
```
disallowedTools
```
```
tools
```
```
createSdkMcpServer()
```
```
tool()
```
```
tool(name: string, description: string, zodSchema, handler)
```
```
tool(name: string, description: string, zodSchema, handler)
```
```
{ content: [{ type: "text", text: "..." }], isError?: boolean }
```
```
{ content: [{ type: "text", text: "..." }], isError?: boolean }
```
```
const response = query({  prompt: "List files and analyze Git history",  options: {    mcpServers: {      // Filesystem server      "filesystem": {        command: "npx",        args: ["@modelcontextprotocol/server-filesystem"],        env: {          ALLOWED_PATHS: "/Users/developer/projects:/tmp"        }      },      // Git operations server      "git": {        command: "npx",        args: ["@modelcontextprotocol/server-git"],        env: {          GIT_REPO_PATH: "/Users/developer/projects/my-repo"        }      }    },    allowedTools: [      "mcp__filesystem__list_files",      "mcp__filesystem__read_file",      "mcp__git__log",      "mcp__git__diff"    ]  }});
```
```
const response = query({  prompt: "List files and analyze Git history",  options: {    mcpServers: {      // Filesystem server      "filesystem": {        command: "npx",        args: ["@modelcontextprotocol/server-filesystem"],        env: {          ALLOWED_PATHS: "/Users/developer/projects:/tmp"        }      },      // Git operations server      "git": {        command: "npx",        args: ["@modelcontextprotocol/server-git"],        env: {          GIT_REPO_PATH: "/Users/developer/projects/my-repo"        }      }    },    allowedTools: [      "mcp__filesystem__list_files",      "mcp__filesystem__read_file",      "mcp__git__log",      "mcp__git__diff"    ]  }});
```
```
const response = query({  prompt: "Analyze data from remote service",  options: {    mcpServers: {      "remote-service": {        url: "https://api.example.com/mcp",        headers: {          "Authorization": "Bearer your-token-here",          "Content-Type": "application/json"        }      }    },    allowedTools: ["mcp__remote-service__analyze"]  }});
```
```
const response = query({  prompt: "Analyze data from remote service",  options: {    mcpServers: {      "remote-service": {        url: "https://api.example.com/mcp",        headers: {          "Authorization": "Bearer your-token-here",          "Content-Type": "application/json"        }      }    },    allowedTools: ["mcp__remote-service__analyze"]  }});
```
```
mcp__<server-name>__<tool-name>
```
```
__
```
```
allowedTools
```
```
mcp__weather-service__get_weather
```
```
mcp__filesystem__read_file
```
```
type AgentDefinition = {  description: string;        // When to use this agent  prompt: string;             // System prompt for agent  tools?: string[];           // Allowed tools (optional)  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';  // Model (optional)  skills?: string[];          // Skills to load (v0.2.10+)  maxTurns?: number;          // Maximum turns before stopping (v0.2.10+)}
```
```
type AgentDefinition = {  description: string;        // When to use this agent  prompt: string;             // System prompt for agent  tools?: string[];           // Allowed tools (optional)  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';  // Model (optional)  skills?: string[];          // Skills to load (v0.2.10+)  maxTurns?: number;          // Maximum turns before stopping (v0.2.10+)}
```
```
haiku
```
```
sonnet
```
```
opus
```
```
inherit
```
```
agents: {  "security-checker": {    description: "Security audits and vulnerability scanning",    prompt: "You check security. Scan for secrets, verify OWASP compliance.",    tools: ["Read", "Grep", "Bash"],    model: "sonnet",    skills: ["security-best-practices"],  // Load specific skills    maxTurns: 10  // Limit to 10 turns  }}
```
```
agents: {  "security-checker": {    description: "Security audits and vulnerability scanning",    prompt: "You check security. Scan for secrets, verify OWASP compliance.",    tools: ["Read", "Grep", "Bash"],    model: "sonnet",    skills: ["security-best-practices"],  // Load specific skills    maxTurns: 10  // Limit to 10 turns  }}
```
```
const response = query({  prompt: "Deploy to production",  options: {    agents: {      "deployer": {        description: "Handle deployments",        prompt: "Deploy the application",        tools: ["Bash"]      }    },    hooks: {      Stop: async (input) => {        // Manual cleanup of spawned processes        console.log("Parent stopped - cleaning up subagents");        // Implement process tracking and termination      }    }  }});
```
```
const response = query({  prompt: "Deploy to production",  options: {    agents: {      "deployer": {        description: "Handle deployments",        prompt: "Deploy the application",        tools: ["Bash"]      }    },    hooks: {      Stop: async (input) => {        // Manual cleanup of spawned processes        console.log("Parent stopped - cleaning up subagents");        // Implement process tracking and termination      }    }  }});
```
```
resume: sessionId
```
```
forkSession: true
```
```
continue: prompt
```
```
resume
```
```
// Explore alternative without modifying originalconst forked = query({  prompt: "Try GraphQL instead of REST",  options: {    resume: sessionId,    forkSession: true  // Creates new branch, original session unchanged  }});
```
```
// Explore alternative without modifying originalconst forked = query({  prompt: "Try GraphQL instead of REST",  options: {    resume: sessionId,    forkSession: true  // Creates new branch, original session unchanged  }});
```
```
for await (const message of response) {  if (message.type === 'system' && message.subtype === 'init') {    sessionId = message.session_id;  // Save for later resume/fork  }}
```
```
for await (const message of response) {  if (message.type === 'system' && message.subtype === 'init') {    sessionId = message.session_id;  // Save for later resume/fork  }}
```
```
import {  unstable_v2_createSession,  unstable_v2_resumeSession,  unstable_v2_prompt} from "@anthropic-ai/claude-agent-sdk";// Create a new sessionconst session = await unstable_v2_createSession({  model: "claude-sonnet-4-5",  workingDirectory: process.cwd(),  allowedTools: ["Read", "Grep", "Glob"]});// Send prompts and stream responsesconst stream = unstable_v2_prompt(session, "Analyze the codebase structure");for await (const message of stream) {  console.log(message);}// Continue conversation in same sessionconst stream2 = unstable_v2_prompt(session, "Now suggest improvements");for await (const message of stream2) {  console.log(message);}// Resume a previous sessionconst resumedSession = await unstable_v2_resumeSession(session.sessionId);
```
```
import {  unstable_v2_createSession,  unstable_v2_resumeSession,  unstable_v2_prompt} from "@anthropic-ai/claude-agent-sdk";// Create a new sessionconst session = await unstable_v2_createSession({  model: "claude-sonnet-4-5",  workingDirectory: process.cwd(),  allowedTools: ["Read", "Grep", "Glob"]});// Send prompts and stream responsesconst stream = unstable_v2_prompt(session, "Analyze the codebase structure");for await (const message of stream) {  console.log(message);}// Continue conversation in same sessionconst stream2 = unstable_v2_prompt(session, "Now suggest improvements");for await (const message of stream2) {  console.log(message);}// Resume a previous sessionconst resumedSession = await unstable_v2_resumeSession(session.sessionId);
```
```
unstable_
```
```
.receive()
```
```
.stream()
```
```
type PermissionMode = "default" | "acceptEdits" | "bypassPermissions" | "plan";
```
```
type PermissionMode = "default" | "acceptEdits" | "bypassPermissions" | "plan";
```
```
default
```
```
acceptEdits
```
```
bypassPermissions
```
```
plan
```
```
const response = query({  prompt: "Deploy application to production",  options: {    permissionMode: "default",    canUseTool: async (toolName, input) => {      // Allow read-only operations      if (['Read', 'Grep', 'Glob'].includes(toolName)) {        return { behavior: "allow" };      }      // Deny destructive bash commands      if (toolName === 'Bash') {        const dangerous = ['rm -rf', 'dd if=', 'mkfs', '> /dev/'];        if (dangerous.some(pattern => input.command.includes(pattern))) {          return {            behavior: "deny",            message: "Destructive command blocked for safety"          };        }      }      // Require confirmation for deployments      if (input.command?.includes('deploy') || input.command?.includes('kubectl apply')) {        return {          behavior: "ask",          message: "Confirm deployment to production?"        };      }      // Allow by default      return { behavior: "allow" };    }  }});
```
```
const response = query({  prompt: "Deploy application to production",  options: {    permissionMode: "default",    canUseTool: async (toolName, input) => {      // Allow read-only operations      if (['Read', 'Grep', 'Glob'].includes(toolName)) {        return { behavior: "allow" };      }      // Deny destructive bash commands      if (toolName === 'Bash') {        const dangerous = ['rm -rf', 'dd if=', 'mkfs', '> /dev/'];        if (dangerous.some(pattern => input.command.includes(pattern))) {          return {            behavior: "deny",            message: "Destructive command blocked for safety"          };        }      }      // Require confirmation for deployments      if (input.command?.includes('deploy') || input.command?.includes('kubectl apply')) {        return {          behavior: "ask",          message: "Confirm deployment to production?"        };      }      // Allow by default      return { behavior: "allow" };    }  }});
```
```
type CanUseToolCallback = (  toolName: string,  input: any) => Promise<PermissionDecision>;type PermissionDecision =  | { behavior: "allow" }  | { behavior: "deny"; message?: string }  | { behavior: "ask"; message?: string };
```
```
type CanUseToolCallback = (  toolName: string,  input: any) => Promise<PermissionDecision>;type PermissionDecision =  | { behavior: "allow" }  | { behavior: "deny"; message?: string }  | { behavior: "ask"; message?: string };
```
```
// Block all file writescanUseTool: async (toolName, input) => {  if (toolName === 'Write' || toolName === 'Edit') {    return { behavior: "deny", message: "No file modifications allowed" };  }  return { behavior: "allow" };}// Require confirmation for specific filescanUseTool: async (toolName, input) => {  const sensitivePaths = ['/etc/', '/root/', '.env', 'credentials.json'];  if ((toolName === 'Write' || toolName === 'Edit') &&      sensitivePaths.some(path => input.file_path?.includes(path))) {    return {      behavior: "ask",      message: Modify sensitive file ${input.file_path}?    };  }  return { behavior: "allow" };}// Log all tool usagecanUseTool: async (toolName, input) => {  console.log(Tool requested: ${toolName}, input);  await logToDatabase(toolName, input);  return { behavior: "allow" };}
```
```
// Block all file writescanUseTool: async (toolName, input) => {  if (toolName === 'Write' || toolName === 'Edit') {    return { behavior: "deny", message: "No file modifications allowed" };  }  return { behavior: "allow" };}// Require confirmation for specific filescanUseTool: async (toolName, input) => {  const sensitivePaths = ['/etc/', '/root/', '.env', 'credentials.json'];  if ((toolName === 'Write' || toolName === 'Edit') &&      sensitivePaths.some(path => input.file_path?.includes(path))) {    return {      behavior: "ask",      message: Modify sensitive file ${input.file_path}?    };  }  return { behavior: "allow" };}// Log all tool usagecanUseTool: async (toolName, input) => {  console.log(Tool requested: ${toolName}, input);  await logToDatabase(toolName, input);  return { behavior: "allow" };}
```
```
Modify sensitive file ${input.file_path}?
```
```
Tool requested: ${toolName}
```
```
const response = query({  prompt: "Run system diagnostics",  options: {    sandbox: {      enabled: true,      autoAllowBashIfSandboxed: true,  // Auto-approve bash in sandbox      excludedCommands: ["rm", "dd", "mkfs"],  // Never auto-approve these      allowUnsandboxedCommands: false  // Deny unsandboxable commands    }  }});
```
```
const response = query({  prompt: "Run system diagnostics",  options: {    sandbox: {      enabled: true,      autoAllowBashIfSandboxed: true,  // Auto-approve bash in sandbox      excludedCommands: ["rm", "dd", "mkfs"],  // Never auto-approve these      allowUnsandboxedCommands: false  // Deny unsandboxable commands    }  }});
```
```
type SandboxSettings = {  enabled: boolean;  autoAllowBashIfSandboxed?: boolean;  // Default: false  excludedCommands?: string[];  allowUnsandboxedCommands?: boolean;  // Default: false  network?: NetworkSandboxSettings;  ignoreViolations?: SandboxIgnoreViolations;};type NetworkSandboxSettings = {  enabled: boolean;  proxyUrl?: string;  // HTTP proxy for network requests};
```
```
type SandboxSettings = {  enabled: boolean;  autoAllowBashIfSandboxed?: boolean;  // Default: false  excludedCommands?: string[];  allowUnsandboxedCommands?: boolean;  // Default: false  network?: NetworkSandboxSettings;  ignoreViolations?: SandboxIgnoreViolations;};type NetworkSandboxSettings = {  enabled: boolean;  proxyUrl?: string;  // HTTP proxy for network requests};
```
```
enabled
```
```
autoAllowBashIfSandboxed
```
```
excludedCommands
```
```
allowUnsandboxedCommands
```
```
network.proxyUrl
```
```
const response = query({  prompt: "Refactor the authentication module",  options: {    enableFileCheckpointing: true  // Enable file snapshots  }});// Later: rewind file changes to a specific pointfor await (const message of response) {  if (message.type === 'user' && message.uuid) {    // Can rewind to this point later    const userMessageUuid = message.uuid;    // To rewind (call on Query object)    await response.rewindFiles(userMessageUuid);  }}
```
```
const response = query({  prompt: "Refactor the authentication module",  options: {    enableFileCheckpointing: true  // Enable file snapshots  }});// Later: rewind file changes to a specific pointfor await (const message of response) {  if (message.type === 'user' && message.uuid) {    // Can rewind to this point later    const userMessageUuid = message.uuid;    // To rewind (call on Query object)    await response.rewindFiles(userMessageUuid);  }}
```
```
type SettingSource = 'user' | 'project' | 'local';
```
```
type SettingSource = 'user' | 'project' | 'local';
```
```
user
```
```
~/.claude/settings.json
```
```
project
```
```
.claude/settings.json
```
```
local
```
```
.claude/settings.local.json
```
```
settingSources: []
```
```
query()
```
```
.claude/settings.local.json
```
```
.claude/settings.json
```
```
~/.claude/settings.json
```
```
// .claude/settings.json{  "allowedTools": ["Read", "Write", "Edit"]}// .claude/settings.local.json{  "allowedTools": ["Read"]  // Overrides project settings}// Programmaticconst response = query({  options: {    settingSources: ["project", "local"],    allowedTools: ["Read", "Grep"]  // ← This wins  }});// Actual allowedTools: ["Read", "Grep"]
```
```
// .claude/settings.json{  "allowedTools": ["Read", "Write", "Edit"]}// .claude/settings.local.json{  "allowedTools": ["Read"]  // Overrides project settings}// Programmaticconst response = query({  options: {    settingSources: ["project", "local"],    allowedTools: ["Read", "Grep"]  // ← This wins  }});// Actual allowedTools: ["Read", "Grep"]
```
```
settingSources: ["project"]
```
```
query()
```
```
Query
```
```
const q = query({ prompt: "..." });// Async iteration (primary usage)for await (const message of q) { ... }// Runtime model controlawait q.setModel("claude-opus-4-5");           // Change model mid-sessionawait q.setMaxThinkingTokens(4096);            // Set thinking budget// Introspectionconst models = await q.supportedModels();     // List available modelsconst commands = await q.supportedCommands(); // List available commandsconst account = await q.accountInfo();        // Get account details// MCP statusconst status = await q.mcpServerStatus();     // Check MCP server status// Returns: { [serverName]: { status: 'connected' | 'failed', error?: string } }// File operations (requires enableFileCheckpointing)await q.rewindFiles(userMessageUuid);         // Rewind to checkpoint
```
```
const q = query({ prompt: "..." });// Async iteration (primary usage)for await (const message of q) { ... }// Runtime model controlawait q.setModel("claude-opus-4-5");           // Change model mid-sessionawait q.setMaxThinkingTokens(4096);            // Set thinking budget// Introspectionconst models = await q.supportedModels();     // List available modelsconst commands = await q.supportedCommands(); // List available commandsconst account = await q.accountInfo();        // Get account details// MCP statusconst status = await q.mcpServerStatus();     // Check MCP server status// Returns: { [serverName]: { status: 'connected' | 'failed', error?: string } }// File operations (requires enableFileCheckpointing)await q.rewindFiles(userMessageUuid);         // Rewind to checkpoint
```
```
system
```
```
session_id
```
```
assistant
```
```
tool_call
```
```
tool_result
```
```
error
```
```
result
```
```
structured_output
```
```
for await (const message of response) {  if (message.type === 'system' && message.subtype === 'init') {    sessionId = message.session_id;  // Capture for resume/fork  }  if (message.type === 'result' && message.structured_output) {    // Structured output available (v0.1.45+)    const validated = schema.parse(message.structured_output);  }}
```
```
for await (const message of response) {  if (message.type === 'system' && message.subtype === 'init') {    sessionId = message.session_id;  // Capture for resume/fork  }  if (message.type === 'result' && message.structured_output) {    // Structured output available (v0.1.45+)    const validated = schema.parse(message.structured_output);  }}
```
```
CLI_NOT_FOUND
```
```
npm install -g @anthropic-ai/claude-code
```
```
AUTHENTICATION_FAILED
```
```
RATE_LIMIT_EXCEEDED
```
```
CONTEXT_LENGTH_EXCEEDED
```
```
PERMISSION_DENIED
```
```
TOOL_EXECUTION_FAILED
```
```
SESSION_NOT_FOUND
```
```
MCP_SERVER_FAILED
```
```
"Claude Code CLI not installed"
```
```
npm install -g @anthropic-ai/claude-code
```
```
"Invalid API key"
```
```
export ANTHROPIC_API_KEY="sk-ant-..."
```
```
permissionMode
```
```
allowedTools
```
```
canUseTool
```
```
"Prompt too long"
```
```
/compact
```
```
// 1. Proactive session forking (create checkpoints before hitting limit)const checkpoint = query({  prompt: "Checkpoint current state",  options: {    resume: sessionId,    forkSession: true  // Create branch before hitting limit  }});// 2. Monitor time and rotate sessions proactivelyconst MAX_SESSION_TIME = 80 * 60 * 1000;  // 80 minutes (before 90-min crash)let sessionStartTime = Date.now();function shouldRotateSession() {  return Date.now() - sessionStartTime > MAX_SESSION_TIME;}// 3. Start new sessions before hitting context limitsif (shouldRotateSession()) {  const summary = await getSummary(currentSession);  const newSession = query({    prompt: Continue with context: ${summary}  });  sessionStartTime = Date.now();}
```
```
// 1. Proactive session forking (create checkpoints before hitting limit)const checkpoint = query({  prompt: "Checkpoint current state",  options: {    resume: sessionId,    forkSession: true  // Create branch before hitting limit  }});// 2. Monitor time and rotate sessions proactivelyconst MAX_SESSION_TIME = 80 * 60 * 1000;  // 80 minutes (before 90-min crash)let sessionStartTime = Date.now();function shouldRotateSession() {  return Date.now() - sessionStartTime > MAX_SESSION_TIME;}// 3. Start new sessions before hitting context limitsif (shouldRotateSession()) {  const summary = await getSummary(currentSession);  const newSession = query({    prompt: Continue with context: ${summary}  });  sessionStartTime = Date.now();}
```
```
Continue with context: ${summary}
```
```
"Invalid session ID"
```
```
session_id
```
```
system
```
```
description
```
```
prompt
```
```
description
```
```
prompt
```
```
"Cannot read settings"
```
```
settingSources
```
```
.describe()
```
```
workingDirectory
```
```
workingDirectory
```
```
type
```
```
"Claude Code process exited with code 1"
```
```
type: "http"
```
```
type: "sse"
```
```
// ❌ Wrong - missing type field (causes cryptic exit code 1)mcpServers: {  "my-server": {    url: "https://api.example.com/mcp"  }}// ✅ Correct - type field required for URL-based serversmcpServers: {  "my-server": {    url: "https://api.example.com/mcp",    type: "http"  // or "sse" for Server-Sent Events  }}
```
```
// ❌ Wrong - missing type field (causes cryptic exit code 1)mcpServers: {  "my-server": {    url: "https://api.example.com/mcp"  }}// ✅ Correct - type field required for URL-based serversmcpServers: {  "my-server": {    url: "https://api.example.com/mcp",    type: "http"  // or "sse" for Server-Sent Events  }}
```
```
type
```
```
// MCP tool handler - sanitize external datatool("fetch_content", "Fetch text content", {}, async (args) => {  const content = await fetchExternalData();  // ✅ Sanitize Unicode line/paragraph separators  const sanitized = content    .replace(/\u2028/g, '\\u2028')    .replace(/\u2029/g, '\\u2029');  return {    content: [{ type: "text", text: sanitized }]  };});
```
```
// MCP tool handler - sanitize external datatool("fetch_content", "Fetch text content", {}, async (args) => {  const content = await fetchExternalData();  // ✅ Sanitize Unicode line/paragraph separators  const sanitized = content    .replace(/\u2028/g, '\\u2028')    .replace(/\u2029/g, '\\u2029');  return {    content: [{ type: "text", text: sanitized }]  };});
```
```
/* ❌ Wrong naming */const tool = 'mcp_server_tool'/* ✅ Double underscores required */const tool = 'mcp__server-name__tool-name'// Format: mcp__<server-name>__<tool-name>
```
```
/* ❌ Wrong naming */const tool = 'mcp_server_tool'/* ✅ Double underscores required */const tool = 'mcp__server-name__tool-name'// Format: mcp__<server-name>__<tool-name>
```
```
/* ❌ Assuming default instructions */const agent = new Agent({  model: 'claude-sonnet-4-5-20250929',  // No system prompt...})/* ✅ Always provide custom system instruction */const agent = new Agent({  model: 'claude-sonnet-4-5-20250929',  system: 'You are a helpful assistant that...',})
```
```
/* ❌ Assuming default instructions */const agent = new Agent({  model: 'claude-sonnet-4-5-20250929',  // No system prompt...})/* ✅ Always provide custom system instruction */const agent = new Agent({  model: 'claude-sonnet-4-5-20250929',  system: 'You are a helpful assistant that...',})
```
```
/* ✅ Implement canUseTool for security */const agent = new Agent({  model: 'claude-sonnet-4-5-20250929',  canUseTool: async (tool) => {    if (tool.name.startsWith('dangerous_')) return 'deny'    if (tool.name === 'file_write') return 'ask'    return 'allow'  },})// Permission modes:// 'default' - Normal permissions// 'acceptEdits' - Auto-accept file edits// 'bypassPermissions' - CI/CD only!// 'plan' - Planning mode
```
```
/* ✅ Implement canUseTool for security */const agent = new Agent({  model: 'claude-sonnet-4-5-20250929',  canUseTool: async (tool) => {    if (tool.name.startsWith('dangerous_')) return 'deny'    if (tool.name === 'file_write') return 'ask'    return 'allow'  },})// Permission modes:// 'default' - Normal permissions// 'acceptEdits' - Auto-accept file edits// 'bypassPermissions' - CI/CD only!// 'plan' - Planning mode
```
```
/* ✅ Create branch without modifying original */const forkedSession = await session.fork()// Original session unchanged// Forked session can diverge
```
```
/* ✅ Create branch without modifying original */const forkedSession = await session.fork()// Original session unchanged// Forked session can diverge
```
```
/* ❌ Missing required fields */const subagent = { prompt: 'Do task' }/* ✅ Include description and prompt */const subagent = {  description: 'Handles data processing tasks',  prompt: 'Process the provided data and return results',}
```
```
/* ❌ Missing required fields */const subagent = { prompt: 'Do task' }/* ✅ Include description and prompt */const subagent = {  description: 'Handles data processing tasks',  prompt: 'Process the provided data and return results',}
```
```
Highest → Lowest:1. Programmatic (code)2. Local (.claude/settings.local.json)3. Project (.claude/settings.json)4. User (~/.claude/settings.json)
```
```
Highest → Lowest:1. Programmatic (code)2. Local (.claude/settings.local.json)3. Project (.claude/settings.json)4. User (~/.claude/settings.json)
```
```
mcp_server_tool
```
```
mcp__server__tool
```
```
system
```
```
description
```
```
prompt
```
This skill leverages the powerful Claude Agent SDK to empower developers building sophisticated AI agents. It provides critical capabilities for ensuring predictable and reliable agent behavior, particularly through its support for structured outputs. By integrating JSON schema validation and Zod, developers can define exact response formats, significantly reducing parsing errors and enhancing the robustness of their AI-powered applications. This skill is essential for anyone looking to build professional-grade AI solutions with Claude.

# When to Use This Skill
- •Reliably extract specific entities (e.g., names, sentiment, key facts) from unstructured text into a validated JSON format for further automated processing.
- •Ensure AI agent responses conform to strict API specifications (e.g., for creating tickets, updating databases) before execution, preventing malformed requests.
- •Generate structured content like product descriptions, email summaries, or code snippets that adhere to a predefined JSON schema, ensuring consistency and usability.
- •Integrate AI outputs directly into TypeScript applications with confidence, knowing the data structure is validated and type-inferred through Zod schemas.

# Pro Tips
- 💡For TypeScript projects, prioritize Zod schemas directly with `outputFormat` to gain compile-time type inference and robust runtime validation, streamlining data handling.
- 💡Start with a minimal JSON schema for essential fields and progressively add more complex validations (e.g., `min`, `max`, `enum`, `pattern`) as your requirements evolve.
- 💡Implement comprehensive error handling for scenarios where Claude fails to produce an output matching the specified schema, allowing for graceful retries or user notification.

