# ai-sdk-ui
Source: https://antigravity.codes/agent-skills/ai-tools/ai-sdk-ui

## AI Worker Instructions
When the user requests functionality related to ai-sdk-ui, follow these guidelines and utilize this context.

## Scraped Content

# ai-sdk-ui
```
.parts
```
```
.content
```
```
// ❌ v5 (OLD){messages.map(m => (  <div key={m.id}>{m.content}</div>))}// ✅ v6 (NEW){messages.map(m => (  <div key={m.id}>    {m.parts.map((part, i) => {      if (part.type === 'text') return <span key={i}>{part.text}</span>;      if (part.type === 'tool-invocation') return <ToolCall key={i} tool={part} />;      if (part.type === 'file') return <FilePreview key={i} file={part} />;      return null;    })}  </div>))}
```
```
// ❌ v5 (OLD){messages.map(m => (  <div key={m.id}>{m.content}</div>))}// ✅ v6 (NEW){messages.map(m => (  <div key={m.id}>    {m.parts.map((part, i) => {      if (part.type === 'text') return <span key={i}>{part.text}</span>;      if (part.type === 'tool-invocation') return <ToolCall key={i} tool={part} />;      if (part.type === 'file') return <FilePreview key={i} file={part} />;      return null;    })}  </div>))}
```
```
text
```
```
.text
```
```
tool-invocation
```
```
.toolName
```
```
.args
```
```
.result
```
```
file
```
```
.mimeType
```
```
.data
```
```
reasoning
```
```
source
```
```
InferAgentUIMessage<typeof agent>
```
```
import { useChat } from '@ai-sdk/react';import type { InferAgentUIMessage } from 'ai';import { myAgent } from './agent';export default function AgentChat() {  const { messages, sendMessage } = useChat<InferAgentUIMessage<typeof myAgent>>({    api: '/api/chat',  });  // messages are now type-checked against agent schema}
```
```
import { useChat } from '@ai-sdk/react';import type { InferAgentUIMessage } from 'ai';import { myAgent } from './agent';export default function AgentChat() {  const { messages, sendMessage } = useChat<InferAgentUIMessage<typeof myAgent>>({    api: '/api/chat',  });  // messages are now type-checked against agent schema}
```
```
import { useChat } from '@ai-sdk/react';import { useState } from 'react';export default function ChatWithApproval() {  const { messages, sendMessage, addToolApprovalResponse } = useChat({    api: '/api/chat',  });  const handleApprove = (toolCallId: string) => {    addToolApprovalResponse({      toolCallId,      approved: true,  // or false to deny    });  };  return (    <div>      {messages.map(message => (        <div key={message.id}>          {message.toolInvocations?.map(tool => (            tool.state === 'awaiting-approval' && (              <div key={tool.toolCallId}>                <p>Approve tool call: {tool.toolName}?</p>                <button onClick={() => handleApprove(tool.toolCallId)}>                  Approve                </button>                <button onClick={() => addToolApprovalResponse({                  toolCallId: tool.toolCallId,                  approved: false                })}>                  Deny                </button>              </div>            )          ))}        </div>      ))}    </div>  );}
```
```
import { useChat } from '@ai-sdk/react';import { useState } from 'react';export default function ChatWithApproval() {  const { messages, sendMessage, addToolApprovalResponse } = useChat({    api: '/api/chat',  });  const handleApprove = (toolCallId: string) => {    addToolApprovalResponse({      toolCallId,      approved: true,  // or false to deny    });  };  return (    <div>      {messages.map(message => (        <div key={message.id}>          {message.toolInvocations?.map(tool => (            tool.state === 'awaiting-approval' && (              <div key={tool.toolCallId}>                <p>Approve tool call: {tool.toolName}?</p>                <button onClick={() => handleApprove(tool.toolCallId)}>                  Approve                </button>                <button onClick={() => addToolApprovalResponse({                  toolCallId: tool.toolCallId,                  approved: false                })}>                  Deny                </button>              </div>            )          ))}        </div>      ))}    </div>  );}
```
```
import { useChat, lastAssistantMessageIsCompleteWithApprovalResponses } from '@ai-sdk/react';export default function AutoSubmitChat() {  const { messages, sendMessage } = useChat({    api: '/api/chat',    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,    // Automatically resubmit after all approval responses provided  });}
```
```
import { useChat, lastAssistantMessageIsCompleteWithApprovalResponses } from '@ai-sdk/react';export default function AutoSubmitChat() {  const { messages, sendMessage } = useChat({    api: '/api/chat',    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,    // Automatically resubmit after all approval responses provided  });}
```
```
useObject
```
```
import { useChat } from '@ai-sdk/react';import { z } from 'zod';const schema = z.object({  summary: z.string(),  sentiment: z.enum(['positive', 'neutral', 'negative']),});export default function StructuredChat() {  const { messages, sendMessage } = useChat({    api: '/api/chat',    // Server can now stream structured output with chat messages  });}
```
```
import { useChat } from '@ai-sdk/react';import { z } from 'zod';const schema = z.object({  summary: z.string(),  sentiment: z.enum(['positive', 'neutral', 'negative']),});export default function StructuredChat() {  const { messages, sendMessage } = useChat({    api: '/api/chat',    // Server can now stream structured output with chat messages  });}
```
```
const { messages, input, handleInputChange, handleSubmit, append } = useChat();<form onSubmit={handleSubmit}>  <input value={input} onChange={handleInputChange} /></form>
```
```
const { messages, input, handleInputChange, handleSubmit, append } = useChat();<form onSubmit={handleSubmit}>  <input value={input} onChange={handleInputChange} /></form>
```
```
const { messages, sendMessage } = useChat();const [input, setInput] = useState('');<form onSubmit={(e) => {  e.preventDefault();  sendMessage({ content: input });  setInput('');}}>  <input value={input} onChange={(e) => setInput(e.target.value)} /></form>
```
```
const { messages, sendMessage } = useChat();const [input, setInput] = useState('');<form onSubmit={(e) => {  e.preventDefault();  sendMessage({ content: input });  setInput('');}}>  <input value={input} onChange={(e) => setInput(e.target.value)} /></form>
```
```
input
```
```
handleInputChange
```
```
handleSubmit
```
```
append()
```
```
sendMessage()
```
```
onResponse
```
```
onFinish
```
```
initialMessages
```
```
messages
```
```
maxSteps
```
```
references/use-chat-migration.md
```
```
useAssistant
```
```
useChat
```
```
import { useAssistant } from '@ai-sdk/react';
```
```
import { useAssistant } from '@ai-sdk/react';
```
```
'use client';import { useAssistant } from '@ai-sdk/react';import { useState, FormEvent } from 'react';export default function AssistantChat() {  const { messages, sendMessage, isLoading, error } = useAssistant({    api: '/api/assistant',  });  const [input, setInput] = useState('');  const handleSubmit = (e: FormEvent) => {    e.preventDefault();    sendMessage({ content: input });    setInput('');  };  return (    <div>      {messages.map(m => (        <div key={m.id}>          <strong>{m.role}:</strong> {m.content}        </div>      ))}      <form onSubmit={handleSubmit}>        <input          value={input}          onChange={(e) => setInput(e.target.value)}          disabled={isLoading}        />      </form>      {error && <div>{error.message}</div>}    </div>  );}
```
```
'use client';import { useAssistant } from '@ai-sdk/react';import { useState, FormEvent } from 'react';export default function AssistantChat() {  const { messages, sendMessage, isLoading, error } = useAssistant({    api: '/api/assistant',  });  const [input, setInput] = useState('');  const handleSubmit = (e: FormEvent) => {    e.preventDefault();    sendMessage({ content: input });    setInput('');  };  return (    <div>      {messages.map(m => (        <div key={m.id}>          <strong>{m.role}:</strong> {m.content}        </div>      ))}      <form onSubmit={handleSubmit}>        <input          value={input}          onChange={(e) => setInput(e.target.value)}          disabled={isLoading}        />      </form>      {error && <div>{error.message}</div>}    </div>  );}
```
```
references/top-ui-errors.md
```
```
SyntaxError: Unexpected token in JSON at position X
```
```
// ✅ CORRECTreturn result.toDataStreamResponse();// ❌ WRONGreturn new Response(result.textStream);
```
```
// ✅ CORRECTreturn result.toDataStreamResponse();// ❌ WRONGreturn new Response(result.textStream);
```
```
// App Router - use toDataStreamResponse()export async function POST(req: Request) {  const result = streamText({ /* ... */ });  return result.toDataStreamResponse(); // ✅}// Pages Router - use pipeDataStreamToResponse()export default async function handler(req, res) {  const result = streamText({ /* ... */ });  return result.pipeDataStreamToResponse(res); // ✅}
```
```
// App Router - use toDataStreamResponse()export async function POST(req: Request) {  const result = streamText({ /* ... */ });  return result.toDataStreamResponse(); // ✅}// Pages Router - use pipeDataStreamToResponse()export default async function handler(req, res) {  const result = streamText({ /* ... */ });  return result.pipeDataStreamToResponse(res); // ✅}
```
```
body
```
```
// ❌ WRONG - body captured onceconst { userId } = useUser();const { messages } = useChat({  body: { userId },  // Stale!});// ✅ CORRECT - use controlled modeconst { userId } = useUser();const { messages, sendMessage } = useChat();sendMessage({  content: input,  data: { userId },  // Fresh on each send});
```
```
// ❌ WRONG - body captured onceconst { userId } = useUser();const { messages } = useChat({  body: { userId },  // Stale!});// ✅ CORRECT - use controlled modeconst { userId } = useUser();const { messages, sendMessage } = useChat();sendMessage({  content: input,  data: { userId },  // Fresh on each send});
```
```
// ❌ WRONGuseEffect(() => {  saveMessages(messages);}, [messages, saveMessages]); // saveMessages triggers re-render!// ✅ CORRECTuseEffect(() => {  saveMessages(messages);}, [messages]); // Only depend on messages
```
```
// ❌ WRONGuseEffect(() => {  saveMessages(messages);}, [messages, saveMessages]); // saveMessages triggers re-render!// ✅ CORRECTuseEffect(() => {  saveMessages(messages);}, [messages]); // Only depend on messages
```
```
references/top-ui-errors.md
```
```
// ✅ GOOD - Streaming (shows tokens as they arrive)const { messages } = useChat({ api: '/api/chat' });// ❌ BAD - Non-streaming (user waits for full response)const response = await fetch('/api/chat', { method: 'POST' });
```
```
// ✅ GOOD - Streaming (shows tokens as they arrive)const { messages } = useChat({ api: '/api/chat' });// ❌ BAD - Non-streaming (user waits for full response)const response = await fetch('/api/chat', { method: 'POST' });
```
```
{isLoading && <div>AI is typing...</div>}
```
```
{isLoading && <div>AI is typing...</div>}
```
```
{isLoading && <button onClick={stop}>Stop</button>}
```
```
{isLoading && <button onClick={stop}>Stop</button>}
```
```
useEffect(() => {  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });}, [messages]);
```
```
useEffect(() => {  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });}, [messages]);
```
```
<input disabled={isLoading} />
```
```
<input disabled={isLoading} />
```
```
references/streaming-patterns.md
```
```
useChat
```
```
useCompletion
```
```
'use client';import { useChat } from '@ai-sdk/react';import { useEffect } from 'react';export default function Chat() {  const { messages, sendMessage, resumeStream } = useChat({    api: '/api/chat',    resume: true,  });  useEffect(() => {    // ❌ Triggers twice in strict mode → two concurrent streams    sendMessage({ content: 'Hello' });    // or    resumeStream();  }, []);}
```
```
'use client';import { useChat } from '@ai-sdk/react';import { useEffect } from 'react';export default function Chat() {  const { messages, sendMessage, resumeStream } = useChat({    api: '/api/chat',    resume: true,  });  useEffect(() => {    // ❌ Triggers twice in strict mode → two concurrent streams    sendMessage({ content: 'Hello' });    // or    resumeStream();  }, []);}
```
```
// ✅ Use ref to track executionimport { useRef } from 'react';const hasSentRef = useRef(false);useEffect(() => {  if (hasSentRef.current) return;  hasSentRef.current = true;  sendMessage({ content: 'Hello' });}, []);// For resumeStream specifically:const hasResumedRef = useRef(false);useEffect(() => {  if (!autoResume || hasResumedRef.current || status === 'streaming') return;  hasResumedRef.current = true;  resumeStream();}, [autoResume, resumeStream, status]);
```
```
// ✅ Use ref to track executionimport { useRef } from 'react';const hasSentRef = useRef(false);useEffect(() => {  if (hasSentRef.current) return;  hasSentRef.current = true;  sendMessage({ content: 'Hello' });}, []);// For resumeStream specifically:const hasResumedRef = useRef(false);useEffect(() => {  if (!autoResume || hasResumedRef.current || status === 'streaming') return;  hasResumedRef.current = true;  resumeStream();}, [autoResume, resumeStream, status]);
```
```
{  "dependencies": {    "ai": "^6.0.8",    "@ai-sdk/react": "^3.0.6",    "@ai-sdk/openai": "^3.0.2",    "react": "^18.3.0",    "zod": "^3.24.2"  }}
```
```
{  "dependencies": {    "ai": "^6.0.8",    "@ai-sdk/react": "^3.0.6",    "@ai-sdk/openai": "^3.0.2",    "react": "^18.3.0",    "zod": "^3.24.2"  }}
```
```
{  "dependencies": {    "ai": "^5.0.99",    "@ai-sdk/react": "^1.0.0",    "@ai-sdk/openai": "^2.0.68"  }}
```
```
{  "dependencies": {    "ai": "^5.0.99",    "@ai-sdk/react": "^1.0.0",    "@ai-sdk/openai": "^2.0.68"  }}
```
```
templates/
```
```
references/
```
```
/* ❌ v4 imports */import { useChat, useCompletion } from 'ai/react'import { useActions, useUIState } from 'ai/rsc'/* ✅ v5 imports */import { useChat, useCompletion } from '@ai-sdk/react'import { useActions, useUIState } from '@ai-sdk/rsc'
```
```
/* ❌ v4 imports */import { useChat, useCompletion } from 'ai/react'import { useActions, useUIState } from 'ai/rsc'/* ✅ v5 imports */import { useChat, useCompletion } from '@ai-sdk/react'import { useActions, useUIState } from '@ai-sdk/rsc'
```
```
/* ❌ v4 options */const { messages, input, handleSubmit } = useChat({  api: '/api/chat',  initialMessages: [],  body: { model: 'gpt-4' },})/* ✅ v5 options */const { messages, input, handleSubmit } = useChat({  api: '/api/chat',  initialMessages: [],  body: { model: 'gpt-5' },  maxSteps: 5, // v5: multi-step by default})
```
```
/* ❌ v4 options */const { messages, input, handleSubmit } = useChat({  api: '/api/chat',  initialMessages: [],  body: { model: 'gpt-4' },})/* ✅ v5 options */const { messages, input, handleSubmit } = useChat({  api: '/api/chat',  initialMessages: [],  body: { model: 'gpt-5' },  maxSteps: 5, // v5: multi-step by default})
```
```
/* ❌ v4 message type */import type { Message } from 'ai'const msgs: Message[] = []/* ✅ v5 message type */import type { UIMessage } from '@ai-sdk/react'const msgs: UIMessage[] = []
```
```
/* ❌ v4 message type */import type { Message } from 'ai'const msgs: Message[] = []/* ✅ v5 message type */import type { UIMessage } from '@ai-sdk/react'const msgs: UIMessage[] = []
```
```
/* ❌ v4 streaming */import { StreamingTextResponse } from 'ai'return new StreamingTextResponse(stream)/* ✅ v5 streaming */import { pipeTextStreamToResponse } from 'ai'return pipeTextStreamToResponse(result.toTextStream(), response)// Or use result.toDataStreamResponse() for Next.jsreturn result.toDataStreamResponse()
```
```
/* ❌ v4 streaming */import { StreamingTextResponse } from 'ai'return new StreamingTextResponse(stream)/* ✅ v5 streaming */import { pipeTextStreamToResponse } from 'ai'return pipeTextStreamToResponse(result.toTextStream(), response)// Or use result.toDataStreamResponse() for Next.jsreturn result.toDataStreamResponse()
```
```
/* ❌ v4 tool results */{messages.map((m) => (  m.toolInvocations?.map((t) => (    <ToolResult key={t.toolCallId} result={t.result} />  ))))}/* ✅ v5 tool results (check state) */{messages.map((m) => (  m.toolInvocations?.map((t) => (    t.state === 'result' && (      <ToolResult key={t.toolCallId} result={t.result} />    )  ))))}
```
```
/* ❌ v4 tool results */{messages.map((m) => (  m.toolInvocations?.map((t) => (    <ToolResult key={t.toolCallId} result={t.result} />  ))))}/* ✅ v5 tool results (check state) */{messages.map((m) => (  m.toolInvocations?.map((t) => (    t.state === 'result' && (      <ToolResult key={t.toolCallId} result={t.result} />    )  ))))}
```
```
from 'ai/react'
```
```
from '@ai-sdk/react'
```
```
from 'ai/rsc'
```
```
from '@ai-sdk/rsc'
```
```
Message
```
```
UIMessage
```
```
StreamingTextResponse
```
```
toDataStreamResponse()
```
```
pipeTextStreamToResponse()
```
```
useChat
```
```
maxSteps
```
```
t.state === 'result'
```
This specialized agent skill empowers developers to seamlessly integrate advanced AI capabilities into their frontend React applications. Designed for use with Vercel AI SDK v6, it offers a robust set of React hooks that streamline the creation of dynamic, AI-powered user interfaces. By abstracting complex interactions like message parsing, tool invocation, and file attachments, this skill accelerates development, allowing you to focus on crafting intuitive and engaging conversational experiences. It's an indispensable tool for anyone building next-generation AI assistants and interactive platforms with React and Next.js.

# When to Use This Skill
- •Building interactive AI chatbots and conversational interfaces.
- •Developing AI assistants that can invoke tools and display rich results.
- •Creating generative AI applications that handle file uploads and previews within messages.
- •Integrating real-time AI responses and complex message structures into modern web applications.

# Pro Tips
- 💡Always iterate through the `m.parts` array when rendering messages to ensure all content types (text, tool-invocation, file) are properly displayed.
- 💡Design specific UI components for `tool-invocation` parts to provide clear visual feedback when the AI calls external functions.
- 💡Regularly check the Vercel AI SDK documentation for updates on message structure and new part types to keep your UI current.

