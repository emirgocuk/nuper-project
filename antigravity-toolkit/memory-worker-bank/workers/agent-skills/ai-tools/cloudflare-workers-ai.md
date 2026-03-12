# cloudflare-workers-ai
Source: https://antigravity.codes/agent-skills/ai-tools/cloudflare-workers-ai

## AI Worker Instructions
When the user requests functionality related to cloudflare-workers-ai, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-workers-ai
```
// 1. Add AI binding to wrangler.jsonc{ "ai": { "binding": "AI" } }// 2. Run model with streaming (recommended)export default {  async fetch(request: Request, env: Env): Promise<Response> {    const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {      messages: [{ role: 'user', content: 'Tell me a story' }],      stream: true, // Always stream for text generation!    });    return new Response(stream, {      headers: { 'content-type': 'text/event-stream' },    });  },};
```
```
// 1. Add AI binding to wrangler.jsonc{ "ai": { "binding": "AI" } }// 2. Run model with streaming (recommended)export default {  async fetch(request: Request, env: Env): Promise<Response> {    const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {      messages: [{ role: 'user', content: 'Tell me a story' }],      stream: true, // Always stream for text generation!    });    return new Response(stream, {      headers: { 'content-type': 'text/event-stream' },    });  },};
```
```
"Exceeded character limit"
```
```
import { encode } from 'gpt-tokenizer'; // or model-specific tokenizerconst tokens = encode(prompt);const contextWindow = 32768; // Model's max tokens (check docs)const maxResponseTokens = 2048;if (tokens.length + maxResponseTokens > contextWindow) {  throw new Error(Prompt exceeds context window: ${tokens.length} tokens);}const response = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.2', {  messages: [{ role: 'user', content: prompt }],  max_tokens: maxResponseTokens,});
```
```
import { encode } from 'gpt-tokenizer'; // or model-specific tokenizerconst tokens = encode(prompt);const contextWindow = 32768; // Model's max tokens (check docs)const maxResponseTokens = 2048;if (tokens.length + maxResponseTokens > contextWindow) {  throw new Error(Prompt exceeds context window: ${tokens.length} tokens);}const response = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.2', {  messages: [{ role: 'user', content: prompt }],  max_tokens: maxResponseTokens,});
```
```
Prompt exceeds context window: ${tokens.length} tokens
```
```
// Use AI Gateway for detailed request loggingconst response = await env.AI.run(  '@cf/meta/llama-3.1-8b-instruct',  { messages: [{ role: 'user', content: query }] },  { gateway: { id: 'my-gateway' } });// Monitor dashboard at: https://dash.cloudflare.com → AI → Workers AI// Compare neuron usage with token counts// File support ticket with details if discrepancy persists
```
```
// Use AI Gateway for detailed request loggingconst response = await env.AI.run(  '@cf/meta/llama-3.1-8b-instruct',  { messages: [{ role: 'user', content: query }] },  { gateway: { id: 'my-gateway' } });// Monitor dashboard at: https://dash.cloudflare.com → AI → Workers AI// Compare neuron usage with token counts// File support ticket with details if discrepancy persists
```
```
"MiniflareCoreError: wrapped binding module can't be resolved (internal modules only)"
```
```
unstable_getMiniflareWorkerOptions
```
```
// wrangler.jsonc - Option 1: Use remote AI binding in local dev{  "ai": { "binding": "AI" },  "dev": {    "remote": true // Use production AI binding locally  }}
```
```
// wrangler.jsonc - Option 1: Use remote AI binding in local dev{  "ai": { "binding": "AI" },  "dev": {    "remote": true // Use production AI binding locally  }}
```
```
# Option 2: Update to latest toolingnpm install -D @cloudflare/vite-plugin@latest# Option 3: Use wrangler dev instead of custom Miniflarenpm run dev
```
```
# Option 2: Update to latest toolingnpm install -D @cloudflare/vite-plugin@latest# Option 3: Use wrangler dev instead of custom Miniflarenpm run dev
```
```
"AiError: Input prompt contains NSFW content (code 3030)"
```
```
@cf/black-forest-labs/flux-1-schnell
```
```
// ❌ May trigger error 3030const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'hamburger', // Single word triggers filter});// ✅ Add context to avoid false positivesconst response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'A photo of a delicious large hamburger on a plate with lettuce and tomato',  num_steps: 4,});
```
```
// ❌ May trigger error 3030const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'hamburger', // Single word triggers filter});// ✅ Add context to avoid false positivesconst response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'A photo of a delicious large hamburger on a plate with lettuce and tomato',  num_steps: 4,});
```
```
"Error: unexpected type 'int32' with value 'undefined' (code 1000)"
```
```
num_steps
```
```
num_steps: 4
```
```
// ✅ Always include num_steps for image generationconst image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'A beautiful sunset over mountains',  num_steps: 4, // Required - typically 4 for Flux Schnell});// Note: FLUX.2 [klein] 4B has fixed steps=4 (cannot be adjusted)
```
```
// ✅ Always include num_steps for image generationconst image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'A beautiful sunset over mountains',  num_steps: 4, // Required - typically 4 for Flux Schnell});// Note: FLUX.2 [klein] 4B has fixed steps=4 (cannot be adjusted)
```
```
zod-to-json-schema
```
```
# Install Zod v3 specificallynpm install zod@3# Or pin in package.json{  "dependencies": {    "zod": "~3.23.8" // Pin to v3 for compatibility  }}
```
```
# Install Zod v3 specificallynpm install zod@3# Or pin in package.json{  "dependencies": {    "zod": "~3.23.8" // Pin to v3 for compatibility  }}
```
```
env.AI.run(  model: string,  inputs: ModelInputs,  options?: { gateway?: { id: string; skipCache?: boolean } }): Promise<ModelOutput | ReadableStream>
```
```
env.AI.run(  model: string,  inputs: ModelInputs,  options?: { gateway?: { id: string; skipCache?: boolean } }): Promise<ModelOutput | ReadableStream>
```
```
@cf/meta/llama-4-scout-17b-16e-instruct
```
```
@cf/openai/gpt-oss-120b
```
```
@cf/openai/gpt-oss-20b
```
```
@cf/google/gemma-3-12b-it
```
```
@cf/mistralai/mistral-small-3.1-24b-instruct
```
```
@cf/qwen/qwq-32b
```
```
@cf/qwen/qwen2.5-coder-32b-instruct
```
```
@cf/qwen/qwen3-30b-a3b-fp8
```
```
@cf/ibm-granite/granite-4.0-h-micro
```
```
@cf/meta/llama-3.3-70b-instruct-fp8-fast
```
```
@cf/meta/llama-3.1-8b-instruct-fp8-fast
```
```
@cf/meta/llama-3.1-8b-instruct
```
```
@cf/meta/llama-3.2-1b-instruct
```
```
@cf/deepseek-ai/deepseek-r1-distill-qwen-32b
```
```
@cf/google/embeddinggemma-300m
```
```
@cf/baai/bge-base-en-v1.5
```
```
@cf/baai/bge-large-en-v1.5
```
```
@cf/baai/bge-small-en-v1.5
```
```
@cf/qwen/qwen3-embedding-0.6b
```
```
pooling: "cls"
```
```
pooling: "mean"
```
```
@cf/black-forest-labs/flux-1-schnell
```
```
@cf/leonardo/lucid-origin
```
```
@cf/leonardo/phoenix-1.0
```
```
@cf/stabilityai/stable-diffusion-xl-base-1.0
```
```
num_steps: 4
```
```
// ✅ Correct pattern for image generationconst image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'A photo of a delicious hamburger on a plate with fresh vegetables',  num_steps: 4, // Required to avoid error 1000});// Descriptive context helps avoid NSFW false positives (error 3030)
```
```
// ✅ Correct pattern for image generationconst image = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {  prompt: 'A photo of a delicious hamburger on a plate with fresh vegetables',  num_steps: 4, // Required to avoid error 1000});// Descriptive context helps avoid NSFW false positives (error 3030)
```
```
@cf/meta/llama-3.2-11b-vision-instruct
```
```
@cf/google/gemma-3-12b-it
```
```
@cf/deepgram/aura-2-en
```
```
@cf/deepgram/aura-2-es
```
```
@cf/deepgram/nova-3
```
```
@cf/openai/whisper-large-v3-turbo
```
```
// 1. Generate embeddingsconst embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [userQuery] });// 2. Search Vectorizeconst matches = await env.VECTORIZE.query(embeddings.data[0], { topK: 3 });const context = matches.matches.map((m) => m.metadata.text).join('\n\n');// 3. Generate with contextconst response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  messages: [    { role: 'system', content: Answer using this context:\n${context} },    { role: 'user', content: userQuery },  ],  stream: true,});
```
```
// 1. Generate embeddingsconst embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [userQuery] });// 2. Search Vectorizeconst matches = await env.VECTORIZE.query(embeddings.data[0], { topK: 3 });const context = matches.matches.map((m) => m.metadata.text).join('\n\n');// 3. Generate with contextconst response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  messages: [    { role: 'system', content: Answer using this context:\n${context} },    { role: 'user', content: userQuery },  ],  stream: true,});
```
```
Answer using this context:\n${context}
```
```
import { z } from 'zod';const Schema = z.object({ name: z.string(), items: z.array(z.string()) });const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  messages: [{    role: 'user',    content: Generate JSON matching: ${JSON.stringify(Schema.shape)}  }],});const validated = Schema.parse(JSON.parse(response.response));
```
```
import { z } from 'zod';const Schema = z.object({ name: z.string(), items: z.array(z.string()) });const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  messages: [{    role: 'user',    content: Generate JSON matching: ${JSON.stringify(Schema.shape)}  }],});const validated = Schema.parse(JSON.parse(response.response));
```
```
Generate JSON matching: ${JSON.stringify(Schema.shape)}
```
```
const response = await env.AI.run(  '@cf/meta/llama-3.1-8b-instruct',  { prompt: 'Hello' },  { gateway: { id: 'my-gateway', skipCache: false } });// Access logs and send feedbackconst gateway = env.AI.gateway('my-gateway');await gateway.patchLog(env.AI.aiGatewayLogId, {  feedback: { rating: 1, comment: 'Great response' },});
```
```
const response = await env.AI.run(  '@cf/meta/llama-3.1-8b-instruct',  { prompt: 'Hello' },  { gateway: { id: 'my-gateway', skipCache: false } });// Access logs and send feedbackconst gateway = env.AI.gateway('my-gateway');await gateway.patchLog(env.AI.aiGatewayLogId, {  feedback: { rating: 1, comment: 'Great response' },});
```
```
// Custom cache TTL (1 hour for expensive queries)const response = await fetch(  https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/workers-ai/@cf/meta/llama-3.1-8b-instruct,  {    method: 'POST',    headers: {      'Authorization': Bearer ${env.CLOUDFLARE_API_KEY},      'Content-Type': 'application/json',      'cf-aig-cache-ttl': '3600', // 1 hour in seconds (min: 60, max: 2592000)    },    body: JSON.stringify({      messages: [{ role: 'user', content: prompt }],    }),  });// Skip cache for real-time dataconst response = await fetch(gatewayUrl, {  headers: {    'cf-aig-skip-cache': 'true', // Bypass cache entirely  },  // ...});// Check if response was cachedconst cacheStatus = response.headers.get('cf-aig-cache-status'); // "HIT" or "MISS"
```
```
// Custom cache TTL (1 hour for expensive queries)const response = await fetch(  https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/workers-ai/@cf/meta/llama-3.1-8b-instruct,  {    method: 'POST',    headers: {      'Authorization': Bearer ${env.CLOUDFLARE_API_KEY},      'Content-Type': 'application/json',      'cf-aig-cache-ttl': '3600', // 1 hour in seconds (min: 60, max: 2592000)    },    body: JSON.stringify({      messages: [{ role: 'user', content: prompt }],    }),  });// Skip cache for real-time dataconst response = await fetch(gatewayUrl, {  headers: {    'cf-aig-skip-cache': 'true', // Bypass cache entirely  },  // ...});// Check if response was cachedconst cacheStatus = response.headers.get('cf-aig-cache-status'); // "HIT" or "MISS"
```
```
https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/workers-ai/@cf/meta/llama-3.1-8b-instruct
```
```
Bearer ${env.CLOUDFLARE_API_KEY}
```
```
cf-aig-cache-ttl
```
```
cf-aig-skip-cache
```
```
'true'
```
```
cf-aig-cache-key
```
```
cf-aig-cache-status
```
```
"HIT"
```
```
"MISS"
```
```
async function runAIWithRetry(  env: Env,  model: string,  inputs: any,  maxRetries = 3): Promise<any> {  let lastError: Error;  for (let i = 0; i < maxRetries; i++) {    try {      return await env.AI.run(model, inputs);    } catch (error) {      lastError = error as Error;      // Rate limit - retry with exponential backoff      if (lastError.message.toLowerCase().includes('rate limit')) {        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));        continue;      }      throw error; // Other errors - fail immediately    }  }  throw lastError!;}
```
```
async function runAIWithRetry(  env: Env,  model: string,  inputs: any,  maxRetries = 3): Promise<any> {  let lastError: Error;  for (let i = 0; i < maxRetries; i++) {    try {      return await env.AI.run(model, inputs);    } catch (error) {      lastError = error as Error;      // Rate limit - retry with exponential backoff      if (lastError.message.toLowerCase().includes('rate limit')) {        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));        continue;      }      throw error; // Other errors - fail immediately    }  }  throw lastError!;}
```
```
import OpenAI from 'openai';const openai = new OpenAI({  apiKey: env.CLOUDFLARE_API_KEY,  baseURL: https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/ai/v1,});// Chat completionsawait openai.chat.completions.create({  model: '@cf/meta/llama-3.1-8b-instruct',  messages: [{ role: 'user', content: 'Hello!' }],});
```
```
import OpenAI from 'openai';const openai = new OpenAI({  apiKey: env.CLOUDFLARE_API_KEY,  baseURL: https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/ai/v1,});// Chat completionsawait openai.chat.completions.create({  model: '@cf/meta/llama-3.1-8b-instruct',  messages: [{ role: 'user', content: 'Hello!' }],});
```
```
https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/ai/v1
```
```
/v1/chat/completions
```
```
/v1/embeddings
```
```
import { createWorkersAI } from 'workers-ai-provider'; // v3.0.2 with AI SDK v5import { generateText, streamText } from 'ai';const workersai = createWorkersAI({ binding: env.AI });// Generate or streamawait generateText({  model: workersai('@cf/meta/llama-3.1-8b-instruct'),  prompt: 'Write a poem',});
```
```
import { createWorkersAI } from 'workers-ai-provider'; // v3.0.2 with AI SDK v5import { generateText, streamText } from 'ai';const workersai = createWorkersAI({ binding: env.AI });// Generate or streamawait generateText({  model: workersai('@cf/meta/llama-3.1-8b-instruct'),  prompt: 'Write a poem',});
```
```
import { Hono } from 'hono';type Bindings = { AI: Ai };const app = new Hono<{ Bindings: Bindings }>();app.post('/chat', async (c) => {  const { prompt } = await c.req.json();  const stream = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {    messages: [{ role: 'user', content: prompt }],    stream: true,  });  // Return stream directly (not c.stream())  return new Response(stream, {    headers: {      'content-type': 'text/event-stream',      'cache-control': 'no-cache',      'connection': 'keep-alive',    },  });});
```
```
import { Hono } from 'hono';type Bindings = { AI: Ai };const app = new Hono<{ Bindings: Bindings }>();app.post('/chat', async (c) => {  const { prompt } = await c.req.json();  const stream = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {    messages: [{ role: 'user', content: prompt }],    stream: true,  });  // Return stream directly (not c.stream())  return new Response(stream, {    headers: {      'content-type': 'text/event-stream',      'cache-control': 'no-cache',      'connection': 'keep-alive',    },  });});
```
```
# 1. Check wrangler versionnpx wrangler --version# 2. Clear wrangler cacherm -rf ~/.wrangler# 3. Update to latest stablenpm install -D wrangler@latest# 4. Check local network/firewall settings# Some corporate firewalls block Workers AI endpoints
```
```
# 1. Check wrangler versionnpx wrangler --version# 2. Clear wrangler cacherm -rf ~/.wrangler# 3. Update to latest stablenpm install -D wrangler@latest# 4. Check local network/firewall settings# Some corporate firewalls block Workers AI endpoints
```
```
mcp__cloudflare-docs__search_cloudflare_documentation
```
```
env.AI.run()
```
```
@cf/
```
```
@cf/meta/llama-4-scout-17b-16e-instruct
```
```
@hf/
```
```
@hf/nousresearch/hermes-2-pro-mistral-7b
```
```
@cf/
```
```
env.AI.run()
```
```
@cf/
```
```
@hf/
```
```
env.AI.run()
```
```
@hf/
```
```
model.startsWith('@cf/')
```
```
model.startsWith('@cf/') \|\| model.startsWith('@hf/')
```
```
// In parseModelId()if (modelId.startsWith('@cf/') || modelId.startsWith('@hf/')) {  return { provider: 'cloudflare', model: modelId };}// In chat() - route through native bindingif ((model.startsWith('@cf/') || model.startsWith('@hf/')) && env.AI) {  const response = await env.AI.run(model, { messages, tools });  // ...}// When detecting OpenRouter models (exclude Workers AI)const isOpenRouterModel = options.model.includes('/') &&  !options.model.startsWith('@cf/') &&  !options.model.startsWith('@hf/');
```
```
// In parseModelId()if (modelId.startsWith('@cf/') || modelId.startsWith('@hf/')) {  return { provider: 'cloudflare', model: modelId };}// In chat() - route through native bindingif ((model.startsWith('@cf/') || model.startsWith('@hf/')) && env.AI) {  const response = await env.AI.run(model, { messages, tools });  // ...}// When detecting OpenRouter models (exclude Workers AI)const isOpenRouterModel = options.model.includes('/') &&  !options.model.startsWith('@cf/') &&  !options.model.startsWith('@hf/');
```
```
@hf/
```
```
/* ⚠️ max_tokens now correctly defaults to 256 */// Before April 2025: max_tokens was ignored// After: Actually enforced, default 256/* ✅ Always set max_tokens explicitly */const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  prompt: 'Write a story',  max_tokens: 1024, // Set explicitly!})
```
```
/* ⚠️ max_tokens now correctly defaults to 256 */// Before April 2025: max_tokens was ignored// After: Actually enforced, default 256/* ✅ Always set max_tokens explicitly */const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  prompt: 'Write a story',  max_tokens: 1024, // Set explicitly!})
```
```
/* ❌ mean pooling not backwards compatible */const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', {  text: 'Hello',  pooling: 'mean', // Changed behavior!})/* ✅ Use cls pooling */const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', {  text: 'Hello',  pooling: 'cls', // Recommended})
```
```
/* ❌ mean pooling not backwards compatible */const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', {  text: 'Hello',  pooling: 'mean', // Changed behavior!})/* ✅ Use cls pooling */const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', {  text: 'Hello',  pooling: 'cls', // Recommended})
```
```
/* ❌ Buffering issues with large responses */const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  prompt: 'Write a long story',})/* ✅ Use streaming to prevent buffering */const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  prompt: 'Write a long story',  stream: true,})return new Response(stream, {  headers: { 'Content-Type': 'text/event-stream' },})
```
```
/* ❌ Buffering issues with large responses */const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  prompt: 'Write a long story',})/* ✅ Use streaming to prevent buffering */const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {  prompt: 'Write a long story',  stream: true,})return new Response(stream, {  headers: { 'Content-Type': 'text/event-stream' },})
```
```
/* ✅ Parse SSE format manually */const stream = await env.AI.run(model, { prompt, stream: true })const reader = stream.getReader()const decoder = new TextDecoder()while (true) {  const { done, value } = await reader.read()  if (done) break  const chunk = decoder.decode(value)  // Format: data: {"response":"text"}\n\n  for (const line of chunk.split('\n')) {    if (line.startsWith('data: ') && line !== 'data: [DONE]') {      const { response } = JSON.parse(line.slice(6))      // Use response text    }  }}
```
```
/* ✅ Parse SSE format manually */const stream = await env.AI.run(model, { prompt, stream: true })const reader = stream.getReader()const decoder = new TextDecoder()while (true) {  const { done, value } = await reader.read()  if (done) break  const chunk = decoder.decode(value)  // Format: data: {"response":"text"}\n\n  for (const line of chunk.split('\n')) {    if (line.startsWith('data: ') && line !== 'data: [DONE]') {      const { response } = JSON.parse(line.slice(6))      // Use response text    }  }}
```
```
/* ❌ Older models deprecated */'@cf/meta/llama-2-7b-chat'  // Deprecated/* ✅ Use current models */'@cf/meta/llama-3.1-8b-instruct'   // Text'@cf/meta/llama-3.2-11b-vision'    // Vision'@cf/baai/bge-base-en-v1.5'        // Embeddings
```
```
/* ❌ Older models deprecated */'@cf/meta/llama-2-7b-chat'  // Deprecated/* ✅ Use current models */'@cf/meta/llama-3.1-8b-instruct'   // Text'@cf/meta/llama-3.2-11b-vision'    // Vision'@cf/baai/bge-base-en-v1.5'        // Embeddings
```
```
max_tokens
```
```
pooling: 'mean'
```
```
pooling: 'cls'
```
```
stream: true
```
This agent skill empowers developers to integrate Cloudflare Workers AI seamlessly into their projects, transforming how AI models are deployed and utilized. By harnessing the global network of Cloudflare Workers, you can run powerful machine learning inference—from large language models to advanced embeddings—closer to your users. This capability drastically reduces latency and improves application responsiveness, making it ideal for real-time AI-powered features. Discover how to effortlessly build and deploy intelligent applications at the edge, leveraging the latest advancements in AI with a robust serverless architecture.

# When to Use This Skill
- •Building real-time AI chat applications and chatbots on the edge, powered by LLMs like Llama or Mistral.
- •Implementing intelligent content moderation or sentiment analysis by generating embeddings and performing classifications at scale.
- •Creating dynamic image generation services or speech-to-text transcriptions directly within serverless functions.
- •Developing personalized recommendation engines or search functionalities by leveraging fast, low-latency AI inference.
- •Integrating AI-powered data processing and transformation pipelines directly into Cloudflare Workers for edge-based analytics.

# Pro Tips
- 💡Optimize your AI calls by understanding the specific model capabilities and rate limits. Cloudflare Workers AI supports various models; choose the most efficient one for your task to manage costs and performance.
- 💡Utilize the `workers-ai-provider` SDK for simplified integration. It abstracts away much of the complexity, allowing you to focus on your application logic rather than API nuances.
- 💡Combine Workers AI with Cloudflare KV or Durable Objects for stateful AI applications, allowing you to persist user sessions, model fine-tuning data, or long-running AI processes across requests.

