# openai-responses
Source: https://antigravity.codes/agent-skills/ai-tools/openai-responses

## AI Worker Instructions
When the user requests functionality related to openai-responses, follow these guidelines and utilize this context.

## Scraped Content

# openai-responses
```
npm install openai@6.16.0
```
```
npm install openai@6.16.0
```
```
import OpenAI from 'openai';const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });const response = await openai.responses.create({  model: 'gpt-5',  input: 'What are the 5 Ds of dodgeball?',});console.log(response.output_text);
```
```
import OpenAI from 'openai';const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });const response = await openai.responses.create({  model: 'gpt-5',  input: 'What are the 5 Ds of dodgeball?',});console.log(response.output_text);
```
```
/v1/responses
```
```
/v1/chat/completions
```
```
input
```
```
messages
```
```
developer
```
```
system
```
```
response.output_text
```
```
choices[0].message.content
```
```
// Create conversationconst conv = await openai.conversations.create({  metadata: { user_id: 'user_123' },});// First turnconst response1 = await openai.responses.create({  model: 'gpt-5',  conversation: conv.id,  input: 'What are the 5 Ds of dodgeball?',});// Second turn - model remembers context + reasoningconst response2 = await openai.responses.create({  model: 'gpt-5',  conversation: conv.id,  input: 'Tell me more about the first one',});
```
```
// Create conversationconst conv = await openai.conversations.create({  metadata: { user_id: 'user_123' },});// First turnconst response1 = await openai.responses.create({  model: 'gpt-5',  conversation: conv.id,  input: 'What are the 5 Ds of dodgeball?',});// Second turn - model remembers context + reasoningconst response2 = await openai.responses.create({  model: 'gpt-5',  conversation: conv.id,  input: 'Tell me more about the first one',});
```
```
code_interpreter
```
```
background: true
```
```
file_search
```
```
web_search
```
```
image_generation
```
```
mcp
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Calculate mean of: 10, 20, 30, 40, 50',  tools: [{ type: 'code_interpreter' }],});
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Calculate mean of: 10, 20, 30, 40, 50',  tools: [{ type: 'code_interpreter' }],});
```
```
web_search
```
```
external_web_access
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Search for recent news',  tools: [{    type: 'web_search',    external_web_access: true,  } as any],  // ✅ Type assertion to suppress error});
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Search for recent news',  tools: [{    type: 'web_search',    external_web_access: true,  } as any],  // ✅ Type assertion to suppress error});
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Get my Stripe balance',  tools: [{    type: 'mcp',    server_label: 'stripe',    server_url: 'https://mcp.stripe.com',    authorization: process.env.STRIPE_TOKEN,  }],});if (response.status === 'requires_approval') {  // Show user: "This action requires sharing data with Stripe. Approve?"  // After user approves, retry with approval token}
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Get my Stripe balance',  tools: [{    type: 'mcp',    server_label: 'stripe',    server_url: 'https://mcp.stripe.com',    authorization: process.env.STRIPE_TOKEN,  }],});if (response.status === 'requires_approval') {  // Show user: "This action requires sharing data with Stripe. Approve?"  // After user approves, retry with approval token}
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Roll 2d6 dice',  tools: [{    type: 'mcp',    server_label: 'dice',    server_url: 'https://example.com/mcp',    authorization: process.env.TOKEN, // ⚠️ NOT stored, required each request  }],});
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Roll 2d6 dice',  tools: [{    type: 'mcp',    server_label: 'dice',    server_url: 'https://example.com/mcp',    authorization: process.env.TOKEN, // ⚠️ NOT stored, required each request  }],});
```
```
mcp_list_tools
```
```
mcp_call
```
```
message
```
```
response.output.forEach(item => {  if (item.type === 'reasoning') console.log(item.summary[0].text);  if (item.type === 'message') console.log(item.content[0].text);});
```
```
response.output.forEach(item => {  if (item.type === 'reasoning') console.log(item.summary[0].text);  if (item.type === 'message') console.log(item.content[0].text);});
```
```
background: true
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Analyze 500-page document',  background: true,  tools: [{ type: 'file_search', file_ids: [fileId] }],});// Poll for completion (check every 5s)const result = await openai.responses.retrieve(response.id);if (result.status === 'completed') console.log(result.output_text);
```
```
const response = await openai.responses.create({  model: 'gpt-5',  input: 'Analyze 500-page document',  background: true,  tools: [{ type: 'file_search', file_ids: [fileId] }],});// Poll for completion (check every 5s)const result = await openai.responses.retrieve(response.id);if (result.status === 'completed') console.log(result.output_text);
```
```
store: true
```
```
store: false
```
```
store: true
```
```
// Disable storage (no retention)const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello!',  store: false,  // ✅ No retention});// ZDR organizations: store always treated as falseconst response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello!',  store: true,  // ⚠️ Ignored by OpenAI for ZDR orgs, treated as false});
```
```
// Disable storage (no retention)const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello!',  store: false,  // ✅ No retention});// ZDR organizations: store always treated as falseconst response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello!',  store: true,  // ⚠️ Ignored by OpenAI for ZDR orgs, treated as false});
```
```
store: false
```
```
message
```
```
reasoning
```
```
code_interpreter_call
```
```
mcp_call
```
```
mcp_list_tools
```
```
file_search_call
```
```
web_search_call
```
```
image_generation_call
```
```
response.output.forEach(item => {  if (item.type === 'reasoning') console.log(item.summary[0].text);  if (item.type === 'web_search_call') console.log(item.results);  if (item.type === 'message') console.log(item.content[0].text);});// Or use helper for text-onlyconsole.log(response.output_text);
```
```
response.output.forEach(item => {  if (item.type === 'reasoning') console.log(item.summary[0].text);  if (item.type === 'web_search_call') console.log(item.results);  if (item.type === 'message') console.log(item.content[0].text);});// Or use helper for text-onlyconsole.log(response.output_text);
```
```
/v1/chat/completions
```
```
/v1/responses
```
```
messages
```
```
input
```
```
system
```
```
developer
```
```
choices[0].message.content
```
```
output_text
```
```
data: {"choices":[...]}
```
```
// Beforeconst response = await openai.chat.completions.create({  model: 'gpt-5',  messages: [    { role: 'system', content: 'You are a helpful assistant.' },    { role: 'user', content: 'Hello!' },  ],});console.log(response.choices[0].message.content);// Afterconst response = await openai.responses.create({  model: 'gpt-5',  input: [    { role: 'developer', content: 'You are a helpful assistant.' },    { role: 'user', content: 'Hello!' },  ],});console.log(response.output_text);
```
```
// Beforeconst response = await openai.chat.completions.create({  model: 'gpt-5',  messages: [    { role: 'system', content: 'You are a helpful assistant.' },    { role: 'user', content: 'Hello!' },  ],});console.log(response.choices[0].message.content);// Afterconst response = await openai.responses.create({  model: 'gpt-5',  input: [    { role: 'developer', content: 'You are a helpful assistant.' },    { role: 'user', content: 'Hello!' },  ],});console.log(response.output_text);
```
```
// Before (Assistants API - deprecated)const assistant = await openai.beta.assistants.create({  model: 'gpt-4',  instructions: 'You are helpful.',});const thread = await openai.beta.threads.create();const run = await openai.beta.threads.runs.create(thread.id, {  assistant_id: assistant.id,});// After (Responses API - current)const conversation = await openai.conversations.create({  metadata: { purpose: 'customer_support' },});const response = await openai.responses.create({  model: 'gpt-5',  conversation: conversation.id,  input: [    { role: 'developer', content: 'You are helpful.' },    { role: 'user', content: 'Hello!' },  ],});
```
```
// Before (Assistants API - deprecated)const assistant = await openai.beta.assistants.create({  model: 'gpt-4',  instructions: 'You are helpful.',});const thread = await openai.beta.threads.create();const run = await openai.beta.threads.runs.create(thread.id, {  assistant_id: assistant.id,});// After (Responses API - current)const conversation = await openai.conversations.create({  metadata: { purpose: 'customer_support' },});const response = await openai.responses.create({  model: 'gpt-5',  conversation: conversation.id,  input: [    { role: 'developer', content: 'You are helpful.' },    { role: 'user', content: 'Hello!' },  ],});
```
```
const conv = await openai.conversations.create()
```
```
conv.id
```
```
mcp_connection_error
```
```
fetch()
```
```
code_interpreter_timeout
```
```
background: true
```
```
rate_limit_error
```
```
chunk.score > 0.7
```
```
store: false
```
```
response.usage.tool_tokens
```
```
invalid_request_error
```
```
openai.conversations.list()
```
```
response.output_text
```
```
response.output.forEach(item => ...)
```
```
item.type
```
```
Invalid schema for response_format 'name': schema must be a JSON Schema of 'type: "object"', got 'type: "string"'.
```
```
zod-to-json-schema
```
```
ZodFirstPartyTypeKind
```
```
"zod": "^3.23.8"
```
```
zodTextFormat
```
```
z.toJSONSchema({ target: "draft-7" })
```
```
// Workaround: Pin to Zod v3 (recommended){  "dependencies": {    "openai": "^6.16.0",    "zod": "^3.23.8"  // DO NOT upgrade to v4 yet  }}
```
```
// Workaround: Pin to Zod v3 (recommended){  "dependencies": {    "openai": "^6.16.0",    "zod": "^3.23.8"  // DO NOT upgrade to v4 yet  }}
```
```
web_search_call
```
```
background: true
```
```
web_search
```
```
background: false
```
```
// ✅ Sources available in sync modeconst response = await openai.responses.create({  model: 'gpt-5',  input: 'Latest AI news?',  background: false,  // Required for sources  tools: [{ type: 'web_search' }],});
```
```
// ✅ Sources available in sync modeconst response = await openai.responses.create({  model: 'gpt-5',  input: 'Latest AI news?',  background: false,  // Required for sources  tools: [{ type: 'web_search' }],});
```
```
finalResponse().output_text
```
```
undefined
```
```
stream.finalResponse()
```
```
output_text
```
```
output_text.done
```
```
output
```
```
// Workaround: Listen for eventconst stream = openai.responses.stream({ model: 'gpt-5', input: 'Hello!' });let outputText = '';for await (const event of stream) {  if (event.type === 'output_text.done') {    outputText = event.output_text;  // ✅ Available in event  }}
```
```
// Workaround: Listen for eventconst stream = openai.responses.stream({ model: 'gpt-5', input: 'Hello!' });let outputText = '';for await (const event of stream) {  if (event.type === 'output_text.done') {    outputText = event.output_text;  // ✅ Available in event  }}
```
```
background: true
```
```
authorization
```
```
response.usage.total_tokens
```
```
response.output_text
```
```
rate_limit_error
```
```
mcp_connection_error
```
```
templates/
```
```
references/responses-vs-chat-completions.md
```
```
references/mcp-integration-guide.md
```
```
references/built-in-tools-guide.md
```
```
references/migration-guide.md
```
```
references/top-errors.md
```
```
/* ❌ Chat Completions pattern */const response = await openai.chat.completions.create({  model: 'gpt-5',  messages: [{ role: 'system', content: '...' }, { role: 'user', content: '...' }],})const text = response.choices[0].message.content/* ✅ Responses API pattern */const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',  instructions: '...', // replaces system message})const text = response.output_text // helper property
```
```
/* ❌ Chat Completions pattern */const response = await openai.chat.completions.create({  model: 'gpt-5',  messages: [{ role: 'system', content: '...' }, { role: 'user', content: '...' }],})const text = response.choices[0].message.content/* ✅ Responses API pattern */const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',  instructions: '...', // replaces system message})const text = response.output_text // helper property
```
```
/* ❌ Chat Completions system role */messages: [{ role: 'system', content: 'You are helpful' }]/* ✅ Responses API uses 'developer' or instructions */instructions: 'You are helpful'// OR in input array:input: [{ role: 'developer', content: 'You are helpful' }]
```
```
/* ❌ Chat Completions system role */messages: [{ role: 'system', content: 'You are helpful' }]/* ✅ Responses API uses 'developer' or instructions */instructions: 'You are helpful'// OR in input array:input: [{ role: 'developer', content: 'You are helpful' }]
```
```
/* ❌ Managing history manually */const messages = [...history, newMessage]/* ✅ Use conversation_id for automatic state */// First messageconst response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',})const conversationId = response.conversation_id// Subsequent messages - history managed automaticallyconst response2 = await openai.responses.create({  model: 'gpt-5',  input: 'Follow up question',  conversation_id: conversationId, // Preserves context})
```
```
/* ❌ Managing history manually */const messages = [...history, newMessage]/* ✅ Use conversation_id for automatic state */// First messageconst response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',})const conversationId = response.conversation_id// Subsequent messages - history managed automaticallyconst response2 = await openai.responses.create({  model: 'gpt-5',  input: 'Follow up question',  conversation_id: conversationId, // Preserves context})
```
```
/* ⚠️ Conversations expire after 90 days */// Verify conversation exists before usingtry {  const response = await openai.responses.create({    model: 'gpt-5',    input: 'Hello',    conversation_id: oldConversationId,  })} catch (error) {  // Conversation expired - start new one  const response = await openai.responses.create({    model: 'gpt-5',    input: 'Hello',  })}
```
```
/* ⚠️ Conversations expire after 90 days */// Verify conversation exists before usingtry {  const response = await openai.responses.create({    model: 'gpt-5',    input: 'Hello',    conversation_id: oldConversationId,  })} catch (error) {  // Conversation expired - start new one  const response = await openai.responses.create({    model: 'gpt-5',    input: 'Hello',  })}
```
```
/* ⚠️ Responses API has additional costs */// Cost = input + output + tools + stored conversations/* Disable storage if not needed */const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',  store: false, // Don't persist conversation})
```
```
/* ⚠️ Responses API has additional costs */// Cost = input + output + tools + stored conversations/* Disable storage if not needed */const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',  store: false, // Don't persist conversation})
```
```
/v1/chat/completions
```
```
/v1/responses
```
```
messages
```
```
input
```
```
role: 'system'
```
```
role: 'developer'
```
```
instructions
```
```
choices[0].message.content
```
```
output_text
```
```
conversation_id
```
This skill introduces the cutting-edge OpenAI Responses API, a game-changer for developing truly intelligent, stateful AI agents. Unlike traditional chat completions, this API maintains a continuous "reasoning notebook" across conversational turns, leading to significantly improved performance and coherence in complex interactions. Developers can now build applications that remember context, leverage server-side tools, and utilize caching far more effectively. Dive into this skill to unlock a new paradigm for AI-powered coding assistants like Claude Code, enabling them to tackle multi-step problems with unprecedented precision and efficiency.

# When to Use This Skill
- •Developing advanced coding assistants that remember conversational context and prior code modifications across multiple turns.
- •Building customer service AI agents that maintain complex issue resolution workflows without losing track of previous steps or user queries.
- •Creating interactive learning platforms where the AI tutor preserves student progress and adapts lessons based on past interactions and reasoning.
- •Implementing AI-driven design tools where the agent remembers design decisions and user preferences over an extended creative session.

# Pro Tips
- 💡Leverage the preserved reasoning state to break down complex tasks into smaller, sequential steps, allowing the agent to 'think' through problems more effectively over multiple turns.
- 💡Design your agent to explicitly manage conversation IDs for seamless continuation, especially when integrating with external services or user interfaces.
- 💡Experiment with the polymorphic output types to create richer, more interactive agent responses beyond simple text, enhancing user experience and clarity.

