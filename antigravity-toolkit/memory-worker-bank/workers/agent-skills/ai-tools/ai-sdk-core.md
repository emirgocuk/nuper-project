# ai-sdk-core
Source: https://antigravity.codes/agent-skills/ai-tools/ai-sdk-core

## AI Worker Instructions
When the user requests functionality related to ai-sdk-core, follow these guidelines and utilize this context.

## Scraped Content

# ai-sdk-core
```
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google zod
```
```
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google zod
```
```
generateObject()
```
```
streamObject()
```
```
// ❌ DEPRECATED - will be removedimport { generateObject } from 'ai';const result = await generateObject({  model: openai('gpt-5'),  schema: z.object({ name: z.string(), age: z.number() }),  prompt: 'Generate a person',});
```
```
// ❌ DEPRECATED - will be removedimport { generateObject } from 'ai';const result = await generateObject({  model: openai('gpt-5'),  schema: z.object({ name: z.string(), age: z.number() }),  prompt: 'Generate a person',});
```
```
// ✅ NEW OUTPUT APIimport { generateText, Output } from 'ai';const result = await generateText({  model: openai('gpt-5'),  output: Output.object({ schema: z.object({ name: z.string(), age: z.number() }) }),  prompt: 'Generate a person',});// Access the typed objectconsole.log(result.object); // { name: "Alice", age: 30 }
```
```
// ✅ NEW OUTPUT APIimport { generateText, Output } from 'ai';const result = await generateText({  model: openai('gpt-5'),  output: Output.object({ schema: z.object({ name: z.string(), age: z.number() }) }),  prompt: 'Generate a person',});// Access the typed objectconsole.log(result.object); // { name: "Alice", age: 30 }
```
```
import { generateText, Output } from 'ai';// Object with Zod schemaoutput: Output.object({ schema: myZodSchema })// Array of typed objectsoutput: Output.array({ schema: personSchema })// Enum/choice from optionsoutput: Output.choice({ choices: ['positive', 'negative', 'neutral'] })// Plain text (explicit)output: Output.text()// Unstructured JSON (no schema validation)output: Output.json()
```
```
import { generateText, Output } from 'ai';// Object with Zod schemaoutput: Output.object({ schema: myZodSchema })// Array of typed objectsoutput: Output.array({ schema: personSchema })// Enum/choice from optionsoutput: Output.choice({ choices: ['positive', 'negative', 'neutral'] })// Plain text (explicit)output: Output.text()// Unstructured JSON (no schema validation)output: Output.json()
```
```
import { streamText, Output } from 'ai';const result = streamText({  model: openai('gpt-5'),  output: Output.object({ schema: personSchema }),  prompt: 'Generate a person',});// Stream partial objectsfor await (const partialObject of result.objectStream) {  console.log(partialObject); // { name: "Ali..." } -> { name: "Alice", age: ... }}// Get final objectconst finalObject = await result.object;
```
```
import { streamText, Output } from 'ai';const result = streamText({  model: openai('gpt-5'),  output: Output.object({ schema: personSchema }),  prompt: 'Generate a person',});// Stream partial objectsfor await (const partialObject of result.objectStream) {  console.log(partialObject); // { name: "Ali..." } -> { name: "Alice", age: ... }}// Get final objectconst finalObject = await result.object;
```
```
ToolLoopAgent
```
```
tools: {  payment: tool({    // Dynamic approval based on input    needsApproval: async ({ amount }) => amount > 1000,    inputSchema: z.object({ amount: z.number() }),    execute: async ({ amount }) => { /* process payment */ },  }),  readFile: tool({    needsApproval: false, // Safe operations don't need approval    inputSchema: z.object({ path: z.string() }),    execute: async ({ path }) => fs.readFile(path),  }),  deleteFile: tool({    needsApproval: true, // Destructive operations always need approval    inputSchema: z.object({ path: z.string() }),    execute: async ({ path }) => fs.unlink(path),  }),}
```
```
tools: {  payment: tool({    // Dynamic approval based on input    needsApproval: async ({ amount }) => amount > 1000,    inputSchema: z.object({ amount: z.number() }),    execute: async ({ amount }) => { /* process payment */ },  }),  readFile: tool({    needsApproval: false, // Safe operations don't need approval    inputSchema: z.object({ path: z.string() }),    execute: async ({ path }) => fs.readFile(path),  }),  deleteFile: tool({    needsApproval: true, // Destructive operations always need approval    inputSchema: z.object({ path: z.string() }),    execute: async ({ path }) => fs.unlink(path),  }),}
```
```
import { rerank } from 'ai';const result = await rerank({  model: cohere.reranker('rerank-v3.5'),  query: 'user question',  documents: searchResults,  topK: 5,});
```
```
import { rerank } from 'ai';const result = await rerank({  model: cohere.reranker('rerank-v3.5'),  query: 'user question',  documents: searchResults,  topK: 5,});
```
```
import { experimental_createMCPClient } from 'ai';const mcpClient = await experimental_createMCPClient({  transport: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem'] },});const tools = await mcpClient.tools();const result = await generateText({  model: openai('gpt-5'),  tools,  prompt: 'List files in the current directory',});
```
```
import { experimental_createMCPClient } from 'ai';const mcpClient = await experimental_createMCPClient({  transport: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem'] },});const tools = await mcpClient.tools();const result = await generateText({  model: openai('gpt-5'),  tools,  prompt: 'List files in the current directory',});
```
```
generateText()
```
```
streamText()
```
```
// ❌ RISKY: Dynamic tools change without your controlconst mcpClient = await experimental_createMCPClient({ /* ... */ });const tools = await mcpClient.tools(); // Can change anytime!// ✅ SAFE: Generate static, versioned tool definitions// Step 1: Install mcp-to-ai-sdknpm install -g mcp-to-ai-sdk// Step 2: Generate static tools (one-time, version controlled)npx mcp-to-ai-sdk generate stdio 'npx -y @modelcontextprotocol/server-filesystem'// Step 3: Import static toolsimport { tools } from './generated-mcp-tools';const result = await generateText({  model: openai('gpt-5'),  tools, // Static, reviewed, versioned  prompt: 'Use tools',});
```
```
// ❌ RISKY: Dynamic tools change without your controlconst mcpClient = await experimental_createMCPClient({ /* ... */ });const tools = await mcpClient.tools(); // Can change anytime!// ✅ SAFE: Generate static, versioned tool definitions// Step 1: Install mcp-to-ai-sdknpm install -g mcp-to-ai-sdk// Step 2: Generate static tools (one-time, version controlled)npx mcp-to-ai-sdk generate stdio 'npx -y @modelcontextprotocol/server-filesystem'// Step 3: Import static toolsimport { tools } from './generated-mcp-tools';const result = await generateText({  model: openai('gpt-5'),  tools, // Static, reviewed, versioned  prompt: 'Use tools',});
```
```
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';const wrappedModel = wrapLanguageModel({  model: anthropic('claude-sonnet-4-5-20250929'),  middleware: extractReasoningMiddleware({ tagName: 'think' }),});// Reasoning extracted automatically from <think>...</think> tags
```
```
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';const wrappedModel = wrapLanguageModel({  model: anthropic('claude-sonnet-4-5-20250929'),  middleware: extractReasoningMiddleware({ tagName: 'think' }),});// Reasoning extracted automatically from <think>...</think> tags
```
```
const result = await generateText({  model: openai('gpt-5'),  prompt: 'Hello',  experimental_telemetry: {    isEnabled: true,    functionId: 'my-chat-function',    metadata: { userId: '123' },    recordInputs: true,    recordOutputs: true,  },});
```
```
const result = await generateText({  model: openai('gpt-5'),  prompt: 'Hello',  experimental_telemetry: {    isEnabled: true,    functionId: 'my-chat-function',    metadata: { userId: '123' },    recordInputs: true,    recordOutputs: true,  },});
```
```
import { openai } from '@ai-sdk/openai';const gpt52 = openai('gpt-5.2');const gpt51 = openai('gpt-5.1');const gpt5 = openai('gpt-5');const o3 = openai('o3');const o3mini = openai('o3-mini');
```
```
import { openai } from '@ai-sdk/openai';const gpt52 = openai('gpt-5.2');const gpt51 = openai('gpt-5.1');const gpt5 = openai('gpt-5');const o3 = openai('o3');const o3mini = openai('o3-mini');
```
```
import { anthropic } from '@ai-sdk/anthropic';const sonnet45 = anthropic('claude-sonnet-4-5-20250929');  // Latestconst opus41 = anthropic('claude-opus-4-1-20250805');const haiku45 = anthropic('claude-haiku-4-5-20251015');
```
```
import { anthropic } from '@ai-sdk/anthropic';const sonnet45 = anthropic('claude-sonnet-4-5-20250929');  // Latestconst opus41 = anthropic('claude-opus-4-1-20250805');const haiku45 = anthropic('claude-haiku-4-5-20251015');
```
```
import { google } from '@ai-sdk/google';const pro = google('gemini-2.5-pro');const flash = google('gemini-2.5-flash');const lite = google('gemini-2.5-flash-lite');
```
```
import { google } from '@ai-sdk/google';const pro = google('gemini-2.5-pro');const flash = google('gemini-2.5-flash');const lite = google('gemini-2.5-flash-lite');
```
```
import { experimental_generateSpeech as generateSpeech } from 'ai';import { openai } from '@ai-sdk/openai';const result = await generateSpeech({  model: openai.speech('tts-1-hd'),  voice: 'alloy',  text: 'Hello, how can I help you today?',});// result.audio is an ArrayBuffer containing the audioconst audioBuffer = result.audio;
```
```
import { experimental_generateSpeech as generateSpeech } from 'ai';import { openai } from '@ai-sdk/openai';const result = await generateSpeech({  model: openai.speech('tts-1-hd'),  voice: 'alloy',  text: 'Hello, how can I help you today?',});// result.audio is an ArrayBuffer containing the audioconst audioBuffer = result.audio;
```
```
import { experimental_transcribe as transcribe } from 'ai';import { openai } from '@ai-sdk/openai';const result = await transcribe({  model: openai.transcription('whisper-1'),  audio: audioFile, // File, Blob, ArrayBuffer, or URL});console.log(result.text); // Transcribed textconsole.log(result.segments); // Timestamped segments
```
```
import { experimental_transcribe as transcribe } from 'ai';import { openai } from '@ai-sdk/openai';const result = await transcribe({  model: openai.transcription('whisper-1'),  audio: audioFile, // File, Blob, ArrayBuffer, or URL});console.log(result.text); // Transcribed textconsole.log(result.segments); // Timestamped segments
```
```
import { generateImage } from 'ai';import { openai } from '@ai-sdk/openai';const result = await generateImage({  model: openai.image('dall-e-3'),  prompt: 'A futuristic city at sunset',  size: '1024x1024',  n: 1,});// result.images is an array of generated imagesconst imageUrl = result.images[0].url;const imageBase64 = result.images[0].base64;
```
```
import { generateImage } from 'ai';import { openai } from '@ai-sdk/openai';const result = await generateImage({  model: openai.image('dall-e-3'),  prompt: 'A futuristic city at sunset',  size: '1024x1024',  n: 1,});// result.images is an array of generated imagesconst imageUrl = result.images[0].url;const imageBase64 = result.images[0].base64;
```
```
import { embed, embedMany, cosineSimilarity } from 'ai';import { openai } from '@ai-sdk/openai';// Single embeddingconst result = await embed({  model: openai.embedding('text-embedding-3-small'),  value: 'Hello world',});console.log(result.embedding); // number[]// Multiple embeddings (parallel processing)const results = await embedMany({  model: openai.embedding('text-embedding-3-small'),  values: ['Hello', 'World', 'AI'],  maxParallelCalls: 5, // Parallel processing});// Compare similarityconst similarity = cosineSimilarity(  results.embeddings[0],  results.embeddings[1]);console.log(Similarity: ${similarity}); // 0.0 to 1.0
```
```
import { embed, embedMany, cosineSimilarity } from 'ai';import { openai } from '@ai-sdk/openai';// Single embeddingconst result = await embed({  model: openai.embedding('text-embedding-3-small'),  value: 'Hello world',});console.log(result.embedding); // number[]// Multiple embeddings (parallel processing)const results = await embedMany({  model: openai.embedding('text-embedding-3-small'),  values: ['Hello', 'World', 'AI'],  maxParallelCalls: 5, // Parallel processing});// Compare similarityconst similarity = cosineSimilarity(  results.embeddings[0],  results.embeddings[1]);console.log(Similarity: ${similarity}); // 0.0 to 1.0
```
```
Similarity: ${similarity}
```
```
import { generateText } from 'ai';import { google } from '@ai-sdk/google';const result = await generateText({  model: google('gemini-2.5-pro'),  messages: [{    role: 'user',    content: [      { type: 'text', text: 'Summarize this document' },      { type: 'file', data: pdfBuffer, mimeType: 'application/pdf' },    ],  }],});// Or with imagesconst result = await generateText({  model: openai('gpt-5'),  messages: [{    role: 'user',    content: [      { type: 'text', text: 'What is in this image?' },      { type: 'image', image: imageBuffer },    ],  }],});
```
```
import { generateText } from 'ai';import { google } from '@ai-sdk/google';const result = await generateText({  model: google('gemini-2.5-pro'),  messages: [{    role: 'user',    content: [      { type: 'text', text: 'Summarize this document' },      { type: 'file', data: pdfBuffer, mimeType: 'application/pdf' },    ],  }],});// Or with imagesconst result = await generateText({  model: openai('gpt-5'),  messages: [{    role: 'user',    content: [      { type: 'text', text: 'What is in this image?' },      { type: 'image', image: imageBuffer },    ],  }],});
```
```
toTextStreamResponse()
```
```
toUIMessageStreamResponse()
```
```
toUIMessageStreamResponse()
```
```
const result = streamText({  model: workersai('@cf/qwen/qwen3-30b-a3b-fp8'),  messages,  system: 'You are helpful.',});// ✅ For chat UIs - returns SSE with JSON eventsreturn result.toUIMessageStreamResponse({  headers: { 'Access-Control-Allow-Origin': '*' },});// ❌ For simple text - returns plain text chunks onlyreturn result.toTextStreamResponse();
```
```
const result = streamText({  model: workersai('@cf/qwen/qwen3-30b-a3b-fp8'),  messages,  system: 'You are helpful.',});// ✅ For chat UIs - returns SSE with JSON eventsreturn result.toUIMessageStreamResponse({  headers: { 'Access-Control-Allow-Origin': '*' },});// ❌ For simple text - returns plain text chunks onlyreturn result.toTextStreamResponse();
```
```
toDataStreamResponse()
```
```
workers-ai-provider@2.x
```
```
# ✅ Correct - AI SDK v5 with workers-ai-provider v2npm install ai@^5.0.0 workers-ai-provider@^2.0.0 zod@^3.25.0# ❌ Wrong - AI SDK v4 causes errornpm install ai@^4.0.0 workers-ai-provider@^2.0.0# Error: "AI SDK 4 only supports models that implement specification version v1"
```
```
# ✅ Correct - AI SDK v5 with workers-ai-provider v2npm install ai@^5.0.0 workers-ai-provider@^2.0.0 zod@^3.25.0# ❌ Wrong - AI SDK v4 causes errornpm install ai@^4.0.0 workers-ai-provider@^2.0.0# Error: "AI SDK 4 only supports models that implement specification version v1"
```
```
zod@^3.25.0
```
```
zod/v3
```
```
zod/v4
```
```
// ❌ BAD: Top-level imports cause startup overheadimport { createWorkersAI } from 'workers-ai-provider';const workersai = createWorkersAI({ binding: env.AI });// ✅ GOOD: Lazy initialization inside handlerapp.post('/chat', async (c) => {  const { createWorkersAI } = await import('workers-ai-provider');  const workersai = createWorkersAI({ binding: c.env.AI });  // ...});
```
```
// ❌ BAD: Top-level imports cause startup overheadimport { createWorkersAI } from 'workers-ai-provider';const workersai = createWorkersAI({ binding: env.AI });// ✅ GOOD: Lazy initialization inside handlerapp.post('/chat', async (c) => {  const { createWorkersAI } = await import('workers-ai-provider');  const workersai = createWorkersAI({ binding: c.env.AI });  // ...});
```
```
parameters
```
```
inputSchema
```
```
args
```
```
input
```
```
result
```
```
output
```
```
ToolExecutionError
```
```
tool-error
```
```
maxSteps
```
```
stopWhen(stepCountIs(n))
```
```
maxTokens
```
```
maxOutputTokens
```
```
providerMetadata
```
```
providerOptions
```
```
parameters
```
```
inputSchema
```
```
args
```
```
input
```
```
result
```
```
output
```
```
CoreMessage
```
```
ModelMessage
```
```
Message
```
```
UIMessage
```
```
convertToCoreMessages
```
```
convertToModelMessages
```
```
ToolExecutionError
```
```
tool-error
```
```
maxSteps
```
```
stopWhen
```
```
stepCountIs()
```
```
hasToolCall()
```
```
content
```
```
parts
```
```
toolCallStreaming
```
```
ai/rsc
```
```
@ai-sdk/rsc
```
```
ai/react
```
```
@ai-sdk/react
```
```
LangChainAdapter
```
```
@ai-sdk/langchain
```
```
import { generateText } from 'ai';const result = await generateText({  model: openai.chat('gpt-4-turbo'),  maxTokens: 500,  providerMetadata: { openai: { user: 'user-123' } },  tools: {    weather: {      description: 'Get weather',      parameters: z.object({ location: z.string() }),      execute: async (args) => { /* args.location */ },    },  },  maxSteps: 5,});
```
```
import { generateText } from 'ai';const result = await generateText({  model: openai.chat('gpt-4-turbo'),  maxTokens: 500,  providerMetadata: { openai: { user: 'user-123' } },  tools: {    weather: {      description: 'Get weather',      parameters: z.object({ location: z.string() }),      execute: async (args) => { /* args.location */ },    },  },  maxSteps: 5,});
```
```
import { generateText, tool, stopWhen, stepCountIs } from 'ai';const result = await generateText({  model: openai('gpt-4-turbo'),  maxOutputTokens: 500,  providerOptions: { openai: { user: 'user-123' } },  tools: {    weather: tool({      description: 'Get weather',      inputSchema: z.object({ location: z.string() }),      execute: async ({ location }) => { /* input.location */ },    }),  },  stopWhen: stepCountIs(5),});
```
```
import { generateText, tool, stopWhen, stepCountIs } from 'ai';const result = await generateText({  model: openai('gpt-4-turbo'),  maxOutputTokens: 500,  providerOptions: { openai: { user: 'user-123' } },  tools: {    weather: tool({      description: 'Get weather',      inputSchema: z.object({ location: z.string() }),      execute: async ({ location }) => { /* input.location */ },    }),  },  stopWhen: stepCountIs(5),});
```
```
maxTokens
```
```
maxOutputTokens
```
```
providerMetadata
```
```
providerOptions
```
```
parameters
```
```
inputSchema
```
```
args
```
```
input
```
```
maxSteps
```
```
stopWhen(stepCountIs(n))
```
```
CoreMessage
```
```
ModelMessage
```
```
ToolExecutionError
```
```
ai/rsc
```
```
@ai-sdk/rsc
```
```
npx ai migrate
```
```
npx ai migrate
```
```
import { AI_APICallError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',  });} catch (error) {  if (error instanceof AI_APICallError) {    console.error('API call failed:', error.message);    console.error('Status code:', error.statusCode);    console.error('Response:', error.responseBody);    // Check common causes    if (error.statusCode === 401) {      // Invalid API key    } else if (error.statusCode === 429) {      // Rate limit - implement backoff    } else if (error.statusCode >= 500) {      // Provider issue - retry    }  }}
```
```
import { AI_APICallError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',  });} catch (error) {  if (error instanceof AI_APICallError) {    console.error('API call failed:', error.message);    console.error('Status code:', error.statusCode);    console.error('Response:', error.responseBody);    // Check common causes    if (error.statusCode === 401) {      // Invalid API key    } else if (error.statusCode === 429) {      // Rate limit - implement backoff    } else if (error.statusCode >= 500) {      // Provider issue - retry    }  }}
```
```
import { AI_NoObjectGeneratedError } from 'ai';try {  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: z.object({ /* complex schema */ }),    prompt: 'Generate data',  });} catch (error) {  if (error instanceof AI_NoObjectGeneratedError) {    console.error('No valid object generated');    // Solutions:    // 1. Simplify schema    // 2. Add more context to prompt    // 3. Provide examples in prompt    // 4. Try different model (gpt-5 or claude-sonnet-4-5 for complex objects)  }}
```
```
import { AI_NoObjectGeneratedError } from 'ai';try {  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: z.object({ /* complex schema */ }),    prompt: 'Generate data',  });} catch (error) {  if (error instanceof AI_NoObjectGeneratedError) {    console.error('No valid object generated');    // Solutions:    // 1. Simplify schema    // 2. Add more context to prompt    // 3. Provide examples in prompt    // 4. Try different model (gpt-5 or claude-sonnet-4-5 for complex objects)  }}
```
```
// BAD: Top-level imports cause startup overheadimport { createWorkersAI } from 'workers-ai-provider';import { complexSchema } from './schemas';const workersai = createWorkersAI({ binding: env.AI });// GOOD: Lazy initialization inside handlerexport default {  async fetch(request, env) {    const { createWorkersAI } = await import('workers-ai-provider');    const workersai = createWorkersAI({ binding: env.AI });    // Use workersai here  }}
```
```
// BAD: Top-level imports cause startup overheadimport { createWorkersAI } from 'workers-ai-provider';import { complexSchema } from './schemas';const workersai = createWorkersAI({ binding: env.AI });// GOOD: Lazy initialization inside handlerexport default {  async fetch(request, env) {    const { createWorkersAI } = await import('workers-ai-provider');    const workersai = createWorkersAI({ binding: env.AI });    // Use workersai here  }}
```
```
createDataStreamResponse
```
```
// Use the onError callback (added in v4.1.22)const stream = streamText({  model: openai('gpt-4-turbo'),  prompt: 'Hello',  onError({ error }) {    console.error('Stream error:', error);    // Custom error logging and handling  },});// Stream safelyfor await (const chunk of stream.textStream) {  process.stdout.write(chunk);}
```
```
// Use the onError callback (added in v4.1.22)const stream = streamText({  model: openai('gpt-4-turbo'),  prompt: 'Hello',  onError({ error }) {    console.error('Stream error:', error);    // Custom error logging and handling  },});// Stream safelyfor await (const chunk of stream.textStream) {  process.stdout.write(chunk);}
```
```
// Fallback if not using onError callbacktry {  const stream = streamText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',  });  for await (const chunk of stream.textStream) {    process.stdout.write(chunk);  }} catch (error) {  console.error('Stream error:', error);}
```
```
// Fallback if not using onError callbacktry {  const stream = streamText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',  });  for await (const chunk of stream.textStream) {    process.stdout.write(chunk);  }} catch (error) {  console.error('Stream error:', error);}
```
```
onError
```
```
import { AI_LoadAPIKeyError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',  });} catch (error) {  if (error instanceof AI_LoadAPIKeyError) {    console.error('API key error:', error.message);    // Check:    // 1. .env file exists and loaded    // 2. Correct env variable name (OPENAI_API_KEY)    // 3. Key format is valid (starts with sk-)  }}
```
```
import { AI_LoadAPIKeyError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',  });} catch (error) {  if (error instanceof AI_LoadAPIKeyError) {    console.error('API key error:', error.message);    // Check:    // 1. .env file exists and loaded    // 2. Correct env variable name (OPENAI_API_KEY)    // 3. Key format is valid (starts with sk-)  }}
```
```
import { AI_InvalidArgumentError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    maxOutputTokens: -1,  // Invalid!    prompt: 'Hello',  });} catch (error) {  if (error instanceof AI_InvalidArgumentError) {    console.error('Invalid argument:', error.message);    // Check parameter types and values  }}
```
```
import { AI_InvalidArgumentError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    maxOutputTokens: -1,  // Invalid!    prompt: 'Hello',  });} catch (error) {  if (error instanceof AI_InvalidArgumentError) {    console.error('Invalid argument:', error.message);    // Check parameter types and values  }}
```
```
import { AI_NoContentGeneratedError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Some prompt',  });} catch (error) {  if (error instanceof AI_NoContentGeneratedError) {    console.error('No content generated');    // Possible causes:    // 1. Safety filters blocked output    // 2. Prompt triggered content policy    // 3. Model configuration issue    // Handle gracefully:    return { text: 'Unable to generate response. Please try different input.' };  }}
```
```
import { AI_NoContentGeneratedError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Some prompt',  });} catch (error) {  if (error instanceof AI_NoContentGeneratedError) {    console.error('No content generated');    // Possible causes:    // 1. Safety filters blocked output    // 2. Prompt triggered content policy    // 3. Model configuration issue    // Handle gracefully:    return { text: 'Unable to generate response. Please try different input.' };  }}
```
```
import { AI_TypeValidationError } from 'ai';try {  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: z.object({      age: z.number().min(0).max(120),  // Strict validation    }),    prompt: 'Generate person',  });} catch (error) {  if (error instanceof AI_TypeValidationError) {    console.error('Validation failed:', error.message);    // Solutions:    // 1. Relax schema constraints    // 2. Add more guidance in prompt    // 3. Use .optional() for unreliable fields  }}
```
```
import { AI_TypeValidationError } from 'ai';try {  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: z.object({      age: z.number().min(0).max(120),  // Strict validation    }),    prompt: 'Generate person',  });} catch (error) {  if (error instanceof AI_TypeValidationError) {    console.error('Validation failed:', error.message);    // Solutions:    // 1. Relax schema constraints    // 2. Add more guidance in prompt    // 3. Use .optional() for unreliable fields  }}
```
```
.optional()
```
```
import { AI_RetryError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',    maxRetries: 3,  // Default is 2  });} catch (error) {  if (error instanceof AI_RetryError) {    console.error('All retries failed');    console.error('Last error:', error.lastError);    // Check root cause:    // - Persistent network issue    // - Provider outage    // - Invalid configuration  }}
```
```
import { AI_RetryError } from 'ai';try {  const result = await generateText({    model: openai('gpt-4-turbo'),    prompt: 'Hello',    maxRetries: 3,  // Default is 2  });} catch (error) {  if (error instanceof AI_RetryError) {    console.error('All retries failed');    console.error('Last error:', error.lastError);    // Check root cause:    // - Persistent network issue    // - Provider outage    // - Invalid configuration  }}
```
```
// Implement exponential backoffasync function generateWithBackoff(prompt: string, retries = 3) {  for (let i = 0; i < retries; i++) {    try {      return await generateText({        model: openai('gpt-4-turbo'),        prompt,      });    } catch (error) {      if (error instanceof AI_APICallError && error.statusCode === 429) {        const delay = Math.pow(2, i) * 1000;  // Exponential backoff        console.log(Rate limited, waiting ${delay}ms);        await new Promise(resolve => setTimeout(resolve, delay));      } else {        throw error;      }    }  }  throw new Error('Rate limit retries exhausted');}
```
```
// Implement exponential backoffasync function generateWithBackoff(prompt: string, retries = 3) {  for (let i = 0; i < retries; i++) {    try {      return await generateText({        model: openai('gpt-4-turbo'),        prompt,      });    } catch (error) {      if (error instanceof AI_APICallError && error.statusCode === 429) {        const delay = Math.pow(2, i) * 1000;  // Exponential backoff        console.log(Rate limited, waiting ${delay}ms);        await new Promise(resolve => setTimeout(resolve, delay));      } else {        throw error;      }    }  }  throw new Error('Rate limit retries exhausted');}
```
```
Rate limited, waiting ${delay}ms
```
```
// Instead of deeply nested schemas at top level:// const complexSchema = z.object({ /* 100+ fields */ });// Define inside functions or use type assertions:function generateData() {  const schema = z.object({ /* complex schema */ });  return generateObject({ model: openai('gpt-4-turbo'), schema, prompt: '...' });}// Or use z.lazy() for recursive schemas:type Category = { name: string; subcategories?: Category[] };const CategorySchema: z.ZodType<Category> = z.lazy(() =>  z.object({    name: z.string(),    subcategories: z.array(CategorySchema).optional(),  }));
```
```
// Instead of deeply nested schemas at top level:// const complexSchema = z.object({ /* 100+ fields */ });// Define inside functions or use type assertions:function generateData() {  const schema = z.object({ /* complex schema */ });  return generateObject({ model: openai('gpt-4-turbo'), schema, prompt: '...' });}// Or use z.lazy() for recursive schemas:type Category = { name: string; subcategories?: Category[] };const CategorySchema: z.ZodType<Category> = z.lazy(() =>  z.object({    name: z.string(),    subcategories: z.array(CategorySchema).optional(),  }));
```
```
z.lazy()
```
```
// Use built-in retry and mode selectionconst result = await generateObject({  model: openai('gpt-4-turbo'),  schema: mySchema,  prompt: 'Generate data',  mode: 'json',  // Force JSON mode (supported by GPT-4)  maxRetries: 3,  // Retry on invalid JSON});// Or catch and retry manually:try {  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: mySchema,    prompt: 'Generate data',  });} catch (error) {  // Retry with different model  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: mySchema,    prompt: 'Generate data',  });}
```
```
// Use built-in retry and mode selectionconst result = await generateObject({  model: openai('gpt-4-turbo'),  schema: mySchema,  prompt: 'Generate data',  mode: 'json',  // Force JSON mode (supported by GPT-4)  maxRetries: 3,  // Retry on invalid JSON});// Or catch and retry manually:try {  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: mySchema,    prompt: 'Generate data',  });} catch (error) {  // Retry with different model  const result = await generateObject({    model: openai('gpt-4-turbo'),    schema: mySchema,    prompt: 'Generate data',  });}
```
```
mode: 'json'
```
```
// Conditionally add tools only when neededconst needsTools = await analyzePrompt(userInput);const result = await generateText({  model: google('gemini-3-flash'),  tools: needsTools ? { weather: weatherTool } : undefined,  prompt: userInput,});
```
```
// Conditionally add tools only when neededconst needsTools = await analyzePrompt(userInput);const result = await generateText({  model: google('gemini-3-flash'),  tools: needsTools ? { weather: weatherTool } : undefined,  prompt: userInput,});
```
```
SyntaxError: "[object Object]" is not valid JSON
```
```
try {  const result = await generateText({    model: anthropic('claude-sonnet-4-5-20250929'),    tools: { web_fetch: { type: 'anthropic_defined', name: 'web_fetch' } },    prompt: userPrompt,  });} catch (error) {  if (error.message.includes('is not valid JSON')) {    // Tool returned error result, handle gracefully    console.error('Tool execution failed - likely blocked URL or permission issue');    // Retry without tool or use custom tool  }  throw error;}
```
```
try {  const result = await generateText({    model: anthropic('claude-sonnet-4-5-20250929'),    tools: { web_fetch: { type: 'anthropic_defined', name: 'web_fetch' } },    prompt: userPrompt,  });} catch (error) {  if (error.message.includes('is not valid JSON')) {    // Tool returned error result, handle gracefully    console.error('Tool execution failed - likely blocked URL or permission issue');    // Retry without tool or use custom tool  }  throw error;}
```
```
tool-result
```
```
tool-result
```
```
execute
```
```
tool-result
```
```
// Workaround: Filter messages before sendingconst filteredMessages = messages.map(msg => {  if (msg.role === 'assistant') {    return {      ...msg,      content: msg.content.filter(part => part.type !== 'tool-result'),    };  }  return msg;});const result = await generateText({  model: anthropic('claude-sonnet-4-5-20250929'),  tools: { database: databaseTool },  messages: filteredMessages,  prompt: 'Get user data',});
```
```
// Workaround: Filter messages before sendingconst filteredMessages = messages.map(msg => {  if (msg.role === 'assistant') {    return {      ...msg,      content: msg.content.filter(part => part.type !== 'tool-result'),    };  }  return msg;});const result = await generateText({  model: anthropic('claude-sonnet-4-5-20250929'),  tools: { database: databaseTool },  messages: filteredMessages,  prompt: 'Get user data',});
```
```
useChat
```
```
onData
```
```
onFinish
```
```
const [count, setCount] = useState(0);const chatOptions = useMemo(() => ({  onFinish: (message) => {    console.log('Count:', count); // ALWAYS 0, never updates!  },}), []); // Empty deps = stale closureconst { messages, append } = useChat(chatOptions);
```
```
const [count, setCount] = useState(0);const chatOptions = useMemo(() => ({  onFinish: (message) => {    console.log('Count:', count); // ALWAYS 0, never updates!  },}), []); // Empty deps = stale closureconst { messages, append } = useChat(chatOptions);
```
```
const { messages, append } = useChat({  onFinish: (message) => {    console.log('Count:', count); // Now sees current count  },});
```
```
const { messages, append } = useChat({  onFinish: (message) => {    console.log('Count:', count); // Now sees current count  },});
```
```
const countRef = useRef(count);useEffect(() => { countRef.current = count; }, [count]);const chatOptions = useMemo(() => ({  onFinish: (message) => {    console.log('Count:', countRef.current); // Always current  },}), []);
```
```
const countRef = useRef(count);useEffect(() => { countRef.current = count; }, [count]);const chatOptions = useMemo(() => ({  onFinish: (message) => {    console.log('Count:', countRef.current); // Always current  },}), []);
```
```
const { messages, append, reload } = useChat({  api: '/api/chat',  onError: (error) => {    if (error.message.includes('stream') || error.message.includes('aborted')) {      // Attempt to reload last message      reload();    }  },});
```
```
const { messages, append, reload } = useChat({  api: '/api/chat',  onError: (error) => {    if (error.message.includes('stream') || error.message.includes('aborted')) {      // Attempt to reload last message      reload();    }  },});
```
```
useEffect(() => {  const handleVisibilityChange = () => {    if (document.visibilityState === 'visible') {      // Check if stream was interrupted      const lastMessage = messages[messages.length - 1];      if (lastMessage?.role === 'assistant' && !lastMessage.content) {        reload();      }    }  };  document.addEventListener('visibilitychange', handleVisibilityChange);  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);}, [messages, reload]);
```
```
useEffect(() => {  const handleVisibilityChange = () => {    if (document.visibilityState === 'visible') {      // Check if stream was interrupted      const lastMessage = messages[messages.length - 1];      if (lastMessage?.role === 'assistant' && !lastMessage.content) {        reload();      }    }  };  document.addEventListener('visibilitychange', handleVisibilityChange);  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);}, [messages, reload]);
```
```
npm view ai versionnpm view ai dist-tags
```
```
npm view ai versionnpm view ai dist-tags
```
```
/* ❌ v4 (Claude may suggest this) */maxTokens: 500providerMetadata: { openai: { user: 'user-123' } }/* ✅ v5 (use this) */maxOutputTokens: 500providerOptions: { openai: { user: 'user-123' } }
```
```
/* ❌ v4 (Claude may suggest this) */maxTokens: 500providerMetadata: { openai: { user: 'user-123' } }/* ✅ v5 (use this) */maxOutputTokens: 500providerOptions: { openai: { user: 'user-123' } }
```
```
/* ❌ v4 */tools: {  weather: {    parameters: z.object({ location: z.string() }),    execute: async (args) => { /* args.location */ },  },}/* ✅ v5 */import { tool } from 'ai'tools: {  weather: tool({    inputSchema: z.object({ location: z.string() }),    execute: async ({ location }) => { /* input.location */ },  }),}
```
```
/* ❌ v4 */tools: {  weather: {    parameters: z.object({ location: z.string() }),    execute: async (args) => { /* args.location */ },  },}/* ✅ v5 */import { tool } from 'ai'tools: {  weather: tool({    inputSchema: z.object({ location: z.string() }),    execute: async ({ location }) => { /* input.location */ },  }),}
```
```
/* ❌ v4 */maxSteps: 5/* ✅ v5 */import { stopWhen, stepCountIs } from 'ai'stopWhen: stepCountIs(5)
```
```
/* ❌ v4 */maxSteps: 5/* ✅ v5 */import { stopWhen, stepCountIs } from 'ai'stopWhen: stepCountIs(5)
```
```
/* ❌ v4 */import { CoreMessage } from 'ai'convertToCoreMessages(messages)/* ✅ v5 */import { ModelMessage } from 'ai'convertToModelMessages(messages)
```
```
/* ❌ v4 */import { CoreMessage } from 'ai'convertToCoreMessages(messages)/* ✅ v5 */import { ModelMessage } from 'ai'convertToModelMessages(messages)
```
```
/* ❌ v4 */import { ... } from 'ai/rsc'import { ... } from 'ai/react'/* ✅ v5 */import { ... } from '@ai-sdk/rsc'import { ... } from '@ai-sdk/react'
```
```
/* ❌ v4 */import { ... } from 'ai/rsc'import { ... } from 'ai/react'/* ✅ v5 */import { ... } from '@ai-sdk/rsc'import { ... } from '@ai-sdk/react'
```
```
/* ❌ Causes >270ms startup (exceeds 400ms limit) */import { createWorkersAI } from 'workers-ai-provider'const workersai = createWorkersAI({ binding: env.AI })/* ✅ Lazy initialization inside handler */app.post('/chat', async (c) => {  const { createWorkersAI } = await import('workers-ai-provider')  const workersai = createWorkersAI({ binding: c.env.AI })})
```
```
/* ❌ Causes >270ms startup (exceeds 400ms limit) */import { createWorkersAI } from 'workers-ai-provider'const workersai = createWorkersAI({ binding: env.AI })/* ✅ Lazy initialization inside handler */app.post('/chat', async (c) => {  const { createWorkersAI } = await import('workers-ai-provider')  const workersai = createWorkersAI({ binding: c.env.AI })})
```
```
/* OpenAI */openai('gpt-5')         // Latestopenai('gpt-5.1')       // Improved/* Anthropic */anthropic('claude-sonnet-4-5-20250929')  // Latest Sonnetanthropic('claude-opus-4-5-20251101')    // Latest Opus/* Google */google('gemini-2.5-pro')google('gemini-2.5-flash')
```
```
/* OpenAI */openai('gpt-5')         // Latestopenai('gpt-5.1')       // Improved/* Anthropic */anthropic('claude-sonnet-4-5-20250929')  // Latest Sonnetanthropic('claude-opus-4-5-20251101')    // Latest Opus/* Google */google('gemini-2.5-pro')google('gemini-2.5-flash')
```
```
maxTokens
```
```
maxOutputTokens
```
```
providerMetadata
```
```
providerOptions
```
```
parameters
```
```
inputSchema
```
```
args
```
```
{ location }
```
```
maxSteps: 5
```
```
stopWhen: stepCountIs(5)
```
```
CoreMessage
```
```
ModelMessage
```
```
from 'ai/rsc'
```
```
from '@ai-sdk/rsc'
```
```
ToolExecutionError
```
```
tool-error
```
This agent skill provides a comprehensive guide to integrating and utilizing the Vercel AI SDK Core for powerful backend AI functionalities. Developers can quickly grasp the stable AI SDK 6, understanding critical updates like the Output API and its superior alternative to deprecated `generateObject` and `streamObject` methods. It equips you with the knowledge to build robust, type-safe AI applications, leveraging advanced features for structured outputs and seamless model interactions. Ideal for enhancing your AI assistant's ability to generate precise, schema-validated responses for diverse use cases.

# When to Use This Skill
- •Building backend APIs that interact with large language models (LLMs) for dynamic content generation.
- •Developing AI applications that require structured JSON outputs from LLMs for integration with databases or frontend.
- •Migrating existing Vercel AI SDK v5 projects to the stable v6 release to leverage new features and best practices.
- •Creating type-safe AI responses with Zod schemas for predictable and error-resistant application development.

# Pro Tips
- 💡Always prioritize the new `Output` API (e.g., `Output.object`) for type safety, improved performance, and future compatibility, as `generateObject` is deprecated.
- 💡Leverage `zod` schemas extensively to ensure your AI outputs are strictly validated and predictable, preventing runtime errors and enhancing data reliability.
- 💡Stay updated with Vercel AI SDK release notes; critical updates like v6 introduce breaking changes and new features essential for optimal implementation.

