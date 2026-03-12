# claude-api
Source: https://antigravity.codes/agent-skills/ai-tools/claude-api

## AI Worker Instructions
When the user requests functionality related to claude-api, follow these guidelines and utilize this context.

## Scraped Content

# claude-api
```
output_format
```
```
import Anthropic from '@anthropic-ai/sdk';const anthropic = new Anthropic({  apiKey: process.env.ANTHROPIC_API_KEY,});const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Extract contact info: John Doe, john@example.com, 555-1234' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: {      name: 'Contact',      strict: true,      schema: {        type: 'object',        properties: {          name: { type: 'string' },          email: { type: 'string' },          phone: { type: 'string' }        },        required: ['name', 'email', 'phone'],        additionalProperties: false      }    }  }});// Guaranteed valid JSON matching schemaconst contact = JSON.parse(message.content[0].text);console.log(contact.name); // "John Doe"
```
```
import Anthropic from '@anthropic-ai/sdk';const anthropic = new Anthropic({  apiKey: process.env.ANTHROPIC_API_KEY,});const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Extract contact info: John Doe, john@example.com, 555-1234' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: {      name: 'Contact',      strict: true,      schema: {        type: 'object',        properties: {          name: { type: 'string' },          email: { type: 'string' },          phone: { type: 'string' }        },        required: ['name', 'email', 'phone'],        additionalProperties: false      }    }  }});// Guaranteed valid JSON matching schemaconst contact = JSON.parse(message.content[0].text);console.log(contact.name); // "John Doe"
```
```
strict: true
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Get weather for San Francisco' }],  betas: ['structured-outputs-2025-11-13'],  tools: [{    name: 'get_weather',    description: 'Get current weather',    input_schema: {      type: 'object',      properties: {        location: { type: 'string' },        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }      },      required: ['location'],      additionalProperties: false    },    strict: true  // ← Guarantees schema compliance  }]});
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Get weather for San Francisco' }],  betas: ['structured-outputs-2025-11-13'],  tools: [{    name: 'get_weather',    description: 'Get current weather',    input_schema: {      type: 'object',      properties: {        location: { type: 'string' },        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }      },      required: ['location'],      additionalProperties: false    },    strict: true  // ← Guarantees schema compliance  }]});
```
```
structured-outputs-2025-11-13
```
```
betas
```
```
minimum
```
```
maximum
```
```
// Pre-compile schemas during server startupconst warmupMessage = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 10,  messages: [{ role: 'user', content: 'warmup' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: YOUR_CRITICAL_SCHEMA  }});// Later requests use cached grammar
```
```
// Pre-compile schemas during server startupconst warmupMessage = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 10,  messages: [{ role: 'user', content: 'warmup' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: YOUR_CRITICAL_SCHEMA  }});// Later requests use cached grammar
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [{ role: 'user', content: 'Extract contact: John Doe' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: contactSchema  }});const contact = JSON.parse(message.content[0].text);// ✅ Format is guaranteed valid// ❌ Content may be hallucinated// ALWAYS validate semantic correctnessif (!isValidEmail(contact.email)) {  throw new Error('Hallucinated email detected');}if (contact.age < 0 || contact.age > 120) {  throw new Error('Implausible age value');}
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [{ role: 'user', content: 'Extract contact: John Doe' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: contactSchema  }});const contact = JSON.parse(message.content[0].text);// ✅ Format is guaranteed valid// ❌ Content may be hallucinated// ALWAYS validate semantic correctnessif (!isValidEmail(contact.email)) {  throw new Error('Hallucinated email detected');}if (contact.age < 0 || contact.age > 120) {  throw new Error('Implausible age value');}
```
```
.parsed
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 4096,  messages: [{ role: 'user', content: 'Solve complex problem' }],  betas: ['clear_thinking_20251015']});// Thinking blocks automatically managed
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 4096,  messages: [{ role: 'user', content: 'Solve complex problem' }],  betas: ['clear_thinking_20251015']});// Thinking blocks automatically managed
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Analyze this spreadsheet' }],  betas: ['skills-2025-10-02'],  // Requires code execution tool enabled});
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Analyze this spreadsheet' }],  betas: ['skills-2025-10-02'],  // Requires code execution tool enabled});
```
```
const stream = anthropic.messages.stream({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Hello' }],});stream  .on('error', (error) => {    // Error can occur AFTER stream starts    console.error('Stream error:', error);    // Implement fallback or retry logic  })  .on('abort', (error) => {    console.warn('Stream aborted:', error);  });
```
```
const stream = anthropic.messages.stream({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Hello' }],});stream  .on('error', (error) => {    // Error can occur AFTER stream starts    console.error('Stream error:', error);    // Implement fallback or retry logic  })  .on('abort', (error) => {    console.warn('Stream aborted:', error);  });
```
```
cache_control
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  system: [    {      type: 'text',      text: 'System instructions...',    },    {      type: 'text',      text: LARGE_CODEBASE, // 50k tokens      cache_control: { type: 'ephemeral' }, // ← MUST be on LAST block    },  ],  messages: [{ role: 'user', content: 'Explain auth module' }],});// Monitor cache usageconsole.log('Cache reads:', message.usage.cache_read_input_tokens);console.log('Cache writes:', message.usage.cache_creation_input_tokens);
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  system: [    {      type: 'text',      text: 'System instructions...',    },    {      type: 'text',      text: LARGE_CODEBASE, // 50k tokens      cache_control: { type: 'ephemeral' }, // ← MUST be on LAST block    },  ],  messages: [{ role: 'user', content: 'Explain auth module' }],});// Monitor cache usageconsole.log('Cache reads:', message.usage.cache_read_input_tokens);console.log('Cache writes:', message.usage.cache_creation_input_tokens);
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  betas: ['structured-outputs-2025-11-13'],  tools: [{    name: 'get_weather',    description: 'Get weather data',    input_schema: {      type: 'object',      properties: {        location: { type: 'string' },        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }      },      required: ['location'],      additionalProperties: false    },    strict: true  // ← Guarantees schema compliance  }],  messages: [{ role: 'user', content: 'Weather in NYC?' }]});
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  betas: ['structured-outputs-2025-11-13'],  tools: [{    name: 'get_weather',    description: 'Get weather data',    input_schema: {      type: 'object',      properties: {        location: { type: 'string' },        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }      },      required: ['location'],      additionalProperties: false    },    strict: true  // ← Guarantees schema compliance  }],  messages: [{ role: 'user', content: 'Weather in NYC?' }]});
```
```
tool_use_id
```
```
const toolResults = [];for (const block of response.content) {  if (block.type === 'tool_use') {    const result = await executeToolFunction(block.name, block.input);    toolResults.push({      type: 'tool_result',      tool_use_id: block.id,  // ← MUST match tool_use block id      content: JSON.stringify(result),    });  }}messages.push({  role: 'user',  content: toolResults,});
```
```
const toolResults = [];for (const block of response.content) {  if (block.type === 'tool_use') {    const result = await executeToolFunction(block.name, block.input);    toolResults.push({      type: 'tool_result',      tool_use_id: block.id,  // ← MUST match tool_use block id      content: JSON.stringify(result),    });  }}messages.push({  role: 'user',  content: toolResults,});
```
```
try {  const result = await executeToolFunction(block.name, block.input);  toolResults.push({    type: 'tool_result',    tool_use_id: block.id,    content: JSON.stringify(result),  });} catch (error) {  // Return error to Claude for handling  toolResults.push({    type: 'tool_result',    tool_use_id: block.id,    is_error: true,    content: Tool execution failed: ${error.message},  });}
```
```
try {  const result = await executeToolFunction(block.name, block.input);  toolResults.push({    type: 'tool_result',    tool_use_id: block.id,    content: JSON.stringify(result),  });} catch (error) {  // Return error to Claude for handling  toolResults.push({    type: 'tool_result',    tool_use_id: block.id,    is_error: true,    content: Tool execution failed: ${error.message},  });}
```
```
Tool execution failed: ${error.message}
```
```
// U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) cause JSON parse failuresfunction sanitizeToolResult(content: string): string {  return content    .replace(/\u2028/g, '\n') // LINE SEPARATOR → newline    .replace(/\u2029/g, '\n'); // PARAGRAPH SEPARATOR → newline}const toolResult = {  type: 'tool_result',  tool_use_id: block.id,  content: sanitizeToolResult(result) // Sanitize before sending};
```
```
// U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) cause JSON parse failuresfunction sanitizeToolResult(content: string): string {  return content    .replace(/\u2028/g, '\n') // LINE SEPARATOR → newline    .replace(/\u2029/g, '\n'); // PARAGRAPH SEPARATOR → newline}const toolResult = {  type: 'tool_result',  tool_use_id: block.id,  content: sanitizeToolResult(result) // Sanitize before sending};
```
```
const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];if (!validFormats.includes(mimeType)) {  throw new Error(Unsupported format: ${mimeType});}
```
```
const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];if (!validFormats.includes(mimeType)) {  throw new Error(Unsupported format: ${mimeType});}
```
```
Unsupported format: ${mimeType}
```
```
max_tokens
```
```
retry-after
```
```
async function makeRequestWithRetry(  requestFn: () => Promise<any>,  maxRetries = 3,  baseDelay = 1000): Promise<any> {  for (let attempt = 0; attempt < maxRetries; attempt++) {    try {      return await requestFn();    } catch (error) {      if (error.status === 429) {        // CRITICAL: Use retry-after header if present        const retryAfter = error.response?.headers?.['retry-after'];        const delay = retryAfter          ? parseInt(retryAfter) * 1000          : baseDelay * Math.pow(2, attempt);        console.warn(Rate limited. Retrying in ${delay}ms...);        await new Promise(resolve => setTimeout(resolve, delay));      } else {        throw error;      }    }  }  throw new Error('Max retries exceeded');}
```
```
async function makeRequestWithRetry(  requestFn: () => Promise<any>,  maxRetries = 3,  baseDelay = 1000): Promise<any> {  for (let attempt = 0; attempt < maxRetries; attempt++) {    try {      return await requestFn();    } catch (error) {      if (error.status === 429) {        // CRITICAL: Use retry-after header if present        const retryAfter = error.response?.headers?.['retry-after'];        const delay = retryAfter          ? parseInt(retryAfter) * 1000          : baseDelay * Math.pow(2, attempt);        console.warn(Rate limited. Retrying in ${delay}ms...);        await new Promise(resolve => setTimeout(resolve, delay));      } else {        throw error;      }    }  }  throw new Error('Max retries exceeded');}
```
```
Rate limited. Retrying in ${delay}ms...
```
```
anthropic-ratelimit-requests-limit
```
```
anthropic-ratelimit-requests-remaining
```
```
anthropic-ratelimit-requests-reset
```
```
retry-after
```
```
429 Too Many Requests: Number of request tokens has exceeded your per-minute rate limit
```
```
retry-after
```
```
cache_control
```
```
cache_control
```
```
invalid_request_error: tools[0].input_schema is invalid
```
```
invalid_request_error: image source must be base64 or url
```
```
invalid_request_error: messages: too many tokens
```
```
invalid_request_error: unknown parameter: batches
```
```
anthropic-beta
```
```
anthropic-beta: message-batches-2024-09-24
```
```
messages.stream().withResponse()
```
```
try {  const stream = await anthropic.messages.stream({    model: 'claude-sonnet-4-5-20250929',    max_tokens: 1024,    messages: [{ role: 'user', content: 'Hello' }]  }).withResponse();} catch (error) {  // Now properly catchable in v0.71.2+  console.error('Stream error:', error);}
```
```
try {  const stream = await anthropic.messages.stream({    model: 'claude-sonnet-4-5-20250929',    max_tokens: 1024,    messages: [{ role: 'user', content: 'Hello' }]  }).withResponse();} catch (error) {  // Now properly catchable in v0.71.2+  console.error('Stream error:', error);}
```
```
const stream = anthropic.messages.stream({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Hello' }]});stream.on('error', (error) => {  console.error('Stream error:', error);});
```
```
const stream = anthropic.messages.stream({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Hello' }]});stream.on('error', (error) => {  console.error('Stream error:', error);});
```
```
Connection error
```
```
499 Client disconnected
```
```
// Don't use MCP for long requestsconst message = await anthropic.beta.messages.toolRunner({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 4096,  messages: [{ role: 'user', content: 'Long task >2 min' }],  tools: [customTools] // Direct tool definitions, not MCP});
```
```
// Don't use MCP for long requestsconst message = await anthropic.beta.messages.toolRunner({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 4096,  messages: [{ role: 'user', content: 'Long task >2 min' }],  tools: [customTools] // Direct tool definitions, not MCP});
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [{ role: 'user', content: 'Extract contact: John Doe' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: contactSchema  }});const contact = JSON.parse(message.content[0].text);// ✅ Format is guaranteed valid// ❌ Content may be hallucinated// CRITICAL: Validate semantic correctnessif (!isValidEmail(contact.email)) {  throw new Error('Hallucinated email detected');}if (contact.age < 0 || contact.age > 120) {  throw new Error('Implausible age value');}
```
```
const message = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [{ role: 'user', content: 'Extract contact: John Doe' }],  betas: ['structured-outputs-2025-11-13'],  output_format: {    type: 'json_schema',    json_schema: contactSchema  }});const contact = JSON.parse(message.content[0].text);// ✅ Format is guaranteed valid// ❌ Content may be hallucinated// CRITICAL: Validate semantic correctnessif (!isValidEmail(contact.email)) {  throw new Error('Hallucinated email detected');}if (contact.age < 0 || contact.age > 120) {  throw new Error('Implausible age value');}
```
```
function sanitizeToolResult(content: string): string {  return content    .replace(/\u2028/g, '\n') // LINE SEPARATOR → newline    .replace(/\u2029/g, '\n'); // PARAGRAPH SEPARATOR → newline}const toolResult = {  type: 'tool_result',  tool_use_id: block.id,  content: sanitizeToolResult(result)};
```
```
function sanitizeToolResult(content: string): string {  return content    .replace(/\u2028/g, '\n') // LINE SEPARATOR → newline    .replace(/\u2029/g, '\n'); // PARAGRAPH SEPARATOR → newline}const toolResult = {  type: 'tool_result',  tool_use_id: block.id,  content: sanitizeToolResult(result)};
```
```
{  "dependencies": {    "@anthropic-ai/sdk": "^0.71.2"  },  "devDependencies": {    "@types/node": "^20.0.0",    "typescript": "^5.3.0",    "zod": "^3.23.0"  }}
```
```
{  "dependencies": {    "@anthropic-ai/sdk": "^0.71.2"  },  "devDependencies": {    "@types/node": "^20.0.0",    "typescript": "^5.3.0",    "zod": "^3.23.0"  }}
```
```
/* ❌ DEPRECATED - Claude 3.x models */'claude-3.5-sonnet'          // All versions deprecated'claude-3-sonnet-20240229'   // Deprecated'claude-3.7-sonnet'          // Deprecated Oct 28, 2025'claude-3-5-haiku-20241022'  // Use claude-haiku-4-5 instead/* ✅ Active models - Claude 4.x */'claude-opus-4-5-20251101'   // Flagship - best reasoning, coding, agents ($5/$25 MTok)'claude-sonnet-4-5-20250929' // Balanced performance ($3/$15 MTok)'claude-opus-4-20250514'     // High capability ($15/$75 MTok)'claude-haiku-4-5-20250929'  // Fast, near-frontier ($1/$5 MTok)
```
```
/* ❌ DEPRECATED - Claude 3.x models */'claude-3.5-sonnet'          // All versions deprecated'claude-3-sonnet-20240229'   // Deprecated'claude-3.7-sonnet'          // Deprecated Oct 28, 2025'claude-3-5-haiku-20241022'  // Use claude-haiku-4-5 instead/* ✅ Active models - Claude 4.x */'claude-opus-4-5-20251101'   // Flagship - best reasoning, coding, agents ($5/$25 MTok)'claude-sonnet-4-5-20250929' // Balanced performance ($3/$15 MTok)'claude-opus-4-20250514'     // High capability ($15/$75 MTok)'claude-haiku-4-5-20250929'  // Fast, near-frontier ($1/$5 MTok)
```
```
/* ❌ cache_control not on last block (silently fails) */const response = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [    {      role: 'user',      content: [        { type: 'text', text: longDocument, cache_control: { type: 'ephemeral' } }, // Wrong position!        { type: 'text', text: 'Summarize this' },      ],    },  ],})/* ✅ cache_control MUST be on LAST content block */const response = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [    {      role: 'user',      content: [        { type: 'text', text: longDocument },        { type: 'text', text: 'Summarize this', cache_control: { type: 'ephemeral' } }, // Correct!      ],    },  ],})
```
```
/* ❌ cache_control not on last block (silently fails) */const response = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [    {      role: 'user',      content: [        { type: 'text', text: longDocument, cache_control: { type: 'ephemeral' } }, // Wrong position!        { type: 'text', text: 'Summarize this' },      ],    },  ],})/* ✅ cache_control MUST be on LAST content block */const response = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  messages: [    {      role: 'user',      content: [        { type: 'text', text: longDocument },        { type: 'text', text: 'Summarize this', cache_control: { type: 'ephemeral' } }, // Correct!      ],    },  ],})
```
```
/* ❌ Only checking initial response */const stream = await anthropic.messages.stream({...})// No error handling.../* ✅ Errors happen AFTER initial 200 response */const stream = await anthropic.messages.stream({...})stream.on('error', (error) => {  console.error('Stream error:', error)})for await (const event of stream) {  // Process events...}
```
```
/* ❌ Only checking initial response */const stream = await anthropic.messages.stream({...})// No error handling.../* ✅ Errors happen AFTER initial 200 response */const stream = await anthropic.messages.stream({...})stream.on('error', (error) => {  console.error('Stream error:', error)})for await (const event of stream) {  // Process events...}
```
```
/* ✅ New structured outputs feature */const response = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Extract data' }],  response_format: {    type: 'json_schema',    json_schema: {      name: 'extraction',      schema: { /* JSON Schema */ },    },  },}, {  headers: { 'anthropic-beta': 'structured-outputs-2025-11-13' },})
```
```
/* ✅ New structured outputs feature */const response = await anthropic.messages.create({  model: 'claude-sonnet-4-5-20250929',  max_tokens: 1024,  messages: [{ role: 'user', content: 'Extract data' }],  response_format: {    type: 'json_schema',    json_schema: {      name: 'extraction',      schema: { /* JSON Schema */ },    },  },}, {  headers: { 'anthropic-beta': 'structured-outputs-2025-11-13' },})
```
```
claude-3.5-sonnet
```
```
claude-opus-4-5-20251101
```
```
claude-sonnet-4-5-20250929
```
```
claude-3.7-sonnet
```
```
claude-opus-4-5-20251101
```
```
claude-sonnet-4-5-20250929
```
```
claude-3-5-haiku
```
```
claude-haiku-4-5-20250929
```
```
stream.on('error', ...)
```
This essential agent skill serves as a comprehensive guide for developers working with the Claude API, particularly highlighting the significant advancements in structured outputs and error prevention. It’s designed to empower users to leverage Claude's capabilities for generating reliable, schema-conformant JSON responses, mitigating common issues like hallucinations. By detailing critical updates and best practices, this skill ensures your AI integrations are both efficient and accurate, making it indispensable for crafting robust, production-ready AI applications that require precise data extraction and formatting.

# When to Use This Skill
- •Extracting structured data (e.g., contact info, product details) into guaranteed JSON formats.
- •Ensuring AI-generated content strictly adheres to a predefined JSON schema for downstream processing.
- •Implementing robust error handling and prevention strategies in AI-powered applications.
- •Adapting existing applications to leverage the latest Claude API features for enhanced reliability and format control.

# Pro Tips
- 💡Always perform semantic validation on Claude's structured outputs, as format conformance doesn't guarantee accuracy.
- 💡Stay updated on Anthropic's breaking changes and retirement schedules (e.g., model retirements in Oct/Nov 2025) to prevent service disruptions.
- 💡Leverage the `output_format` with `json_schema` for any application where data integrity and consistent structure are paramount.

