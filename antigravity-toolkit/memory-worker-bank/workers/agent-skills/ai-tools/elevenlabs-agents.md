# elevenlabs-agents
Source: https://antigravity.codes/agent-skills/ai-tools/elevenlabs-agents

## AI Worker Instructions
When the user requests functionality related to elevenlabs-agents, follow these guidelines and utilize this context.

## Scraped Content

# elevenlabs-agents
```
npm install @elevenlabs/react@0.12.3           # React SDK (Dec 2025: localization, Scribe fixes)npm install @elevenlabs/client@0.12.2          # JavaScript SDK (Dec 2025: localization)npm install @elevenlabs/react-native@0.5.7     # React Native SDK (Dec 2025: mic fixes, speed param)npm install @elevenlabs/elevenlabs-js@2.30.0   # Base SDK (Jan 2026: latest)npm install -g @elevenlabs/agents-cli@0.6.1    # CLI
```
```
npm install @elevenlabs/react@0.12.3           # React SDK (Dec 2025: localization, Scribe fixes)npm install @elevenlabs/client@0.12.2          # JavaScript SDK (Dec 2025: localization)npm install @elevenlabs/react-native@0.5.7     # React Native SDK (Dec 2025: mic fixes, speed param)npm install @elevenlabs/elevenlabs-js@2.30.0   # Base SDK (Jan 2026: latest)npm install -g @elevenlabs/agents-cli@0.6.1    # CLI
```
```
@11labs/react
```
```
@11labs/client
```
```
chat_mode: true
```
```
end_call
```
```
@elevenlabs/elevenlabs-js
```
```
@elevenlabs/client
```
```
@elevenlabs/react
```
```
@elevenlabs/react-native
```
```
child_process
```
```
Module not found: Can't resolve 'child_process'
```
```
elevenlabs-js
```
```
npm install @elevenlabs/react zod
```
```
npm install @elevenlabs/react zod
```
```
import { useConversation } from '@elevenlabs/react';const { startConversation, stopConversation, status } = useConversation({  agentId: 'your-agent-id',  signedUrl: '/api/elevenlabs/auth', // Recommended (secure)  // OR apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,  clientTools: { /* browser-side tools */ },  onEvent: (event) => { /* transcript, agent_response, tool_call */ },  serverLocation: 'us' // 'eu-residency' | 'in-residency' | 'global'});
```
```
import { useConversation } from '@elevenlabs/react';const { startConversation, stopConversation, status } = useConversation({  agentId: 'your-agent-id',  signedUrl: '/api/elevenlabs/auth', // Recommended (secure)  // OR apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,  clientTools: { /* browser-side tools */ },  onEvent: (event) => { /* transcript, agent_response, tool_call */ },  serverLocation: 'us' // 'eu-residency' | 'in-residency' | 'global'});
```
```
npm install -g @elevenlabs/agents-clielevenlabs auth loginelevenlabs agents init                              # Creates agents.json, tools.json, tests.jsonelevenlabs agents add "Bot" --template customer-serviceelevenlabs agents push --env dev                    # Deployelevenlabs agents test "Bot"                        # Test
```
```
npm install -g @elevenlabs/agents-clielevenlabs auth loginelevenlabs agents init                              # Creates agents.json, tools.json, tests.jsonelevenlabs agents add "Bot" --template customer-serviceelevenlabs agents push --env dev                    # Deployelevenlabs agents test "Bot"                        # Test
```
```
import { ElevenLabsClient } from 'elevenlabs';const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });const agent = await client.agents.create({  name: 'Support Bot',  conversation_config: {    agent: { prompt: { prompt: "...", llm: "gpt-4o" }, language: "en" },    tts: { model_id: "eleven_turbo_v2_5", voice_id: "your-voice-id" }  }});
```
```
import { ElevenLabsClient } from 'elevenlabs';const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });const agent = await client.agents.create({  name: 'Support Bot',  conversation_config: {    agent: { prompt: { prompt: "...", llm: "gpt-4o" }, language: "en" },    tts: { model_id: "eleven_turbo_v2_5", voice_id: "your-voice-id" }  }});
```
```
model_id
```
```
modelId
```
```
voice_id
```
```
voiceId
```
```
output_format
```
```
outputFormat
```
```
voice_settings
```
```
voiceSettings
```
```
// ❌ WRONG - parameter ignored (snake_case):const stream = await elevenlabs.textToSpeech.convert(voiceId, {  model_id: "eleven_v3",  // Silently ignored!  text: "Hello"});// ✅ CORRECT - use camelCase:const stream = await elevenlabs.textToSpeech.convert(voiceId, {  modelId: "eleven_v3",   // Works!  text: "Hello"});
```
```
// ❌ WRONG - parameter ignored (snake_case):const stream = await elevenlabs.textToSpeech.convert(voiceId, {  model_id: "eleven_v3",  // Silently ignored!  text: "Hello"});// ✅ CORRECT - use camelCase:const stream = await elevenlabs.textToSpeech.convert(voiceId, {  modelId: "eleven_v3",   // Works!  text: "Hello"});
```
```
{  "agent": {    "prompt": {      "prompt": "Personality:\n[Agent identity and role]\n\nEnvironment:\n[Communication context]\n\nTone:\n[Speech style]\n\nGoal:\n[Primary objectives]\n\nGuardrails:\n[Boundaries and constraints]\n\nTools:\n[Available tools and usage]",      "llm": "gpt-4o", // gpt-5.1, claude-sonnet-4-5, gemini-3-pro-preview      "temperature": 0.7    }  }}
```
```
{  "agent": {    "prompt": {      "prompt": "Personality:\n[Agent identity and role]\n\nEnvironment:\n[Communication context]\n\nTone:\n[Speech style]\n\nGoal:\n[Primary objectives]\n\nGuardrails:\n[Boundaries and constraints]\n\nTools:\n[Available tools and usage]",      "llm": "gpt-4o", // gpt-5.1, claude-sonnet-4-5, gemini-3-pro-preview      "temperature": 0.7    }  }}
```
```
gpt-5.1
```
```
gpt-5.1-2025-11-13
```
```
claude-sonnet-4-5
```
```
claude-sonnet-4-5@20250929
```
```
gemini-3-pro-preview
```
```
gemini-2.5-flash-preview-09-2025
```
```
{ "conversation_config": { "turn": { "mode": "patient" } } }
```
```
{ "conversation_config": { "turn": { "mode": "patient" } } }
```
```
edge_order
```
```
{  "workflow": {    "nodes": [      { "id": "node_1", "type": "subagent", "config": { "system_prompt": "...", "turn_eagerness": "patient" } },      { "id": "node_2", "type": "tool", "tool_name": "transfer_to_human" }    ],    "edges": [{ "from": "node_1", "to": "node_2", "condition": "escalation", "edge_order": 1 }]  }}
```
```
{  "workflow": {    "nodes": [      { "id": "node_1", "type": "subagent", "config": { "system_prompt": "...", "turn_eagerness": "patient" } },      { "id": "node_2", "type": "tool", "tool_name": "transfer_to_human" }    ],    "edges": [{ "from": "node_1", "to": "node_2", "condition": "escalation", "edge_order": 1 }]  }}
```
```
archived: true
```
```
{{var_name}}
```
```
{{system__agent_id}}
```
```
{{system__conversation_id}}
```
```
{{system__caller_id}}
```
```
{{system__called_number}}
```
```
{{system__call_duration_secs}}
```
```
{{system__time_utc}}
```
```
{{system__call_sid}}
```
```
await client.conversations.create({  agent_id: "agent_123",  dynamic_variables: { user_name: "John", account_tier: "premium" }});
```
```
await client.conversations.create({  agent_id: "agent_123",  dynamic_variables: { user_name: "John", account_tier: "premium" }});
```
```
{{secret__api_key}}
```
```
{ "prompt": "When speaking as customer, use voice_id 'voice_abc'. As agent, use 'voice_def'." }
```
```
{ "prompt": "When speaking as customer, use voice_id 'voice_abc'. As agent, use 'voice_def'." }
```
```
{  "pronunciation_dictionary": [    { "word": "API", "pronunciation": "ey-pee-ay", "format": "cmu" },    { "word": "AI", "substitution": "artificial intelligence" }  ]}
```
```
{  "pronunciation_dictionary": [    { "word": "API", "pronunciation": "ey-pee-ay", "format": "cmu" },    { "word": "AI", "substitution": "artificial intelligence" }  ]}
```
```
{ "voice_settings": { "speed": 1.0 } }
```
```
{ "voice_settings": { "speed": 1.0 } }
```
```
{  "language_presets": [    { "language": "en", "voice_id": "en_voice", "first_message": "Hello!" },    { "language": "es", "voice_id": "es_voice", "first_message": "¡Hola!" }  ]}
```
```
{  "language_presets": [    { "language": "en", "voice_id": "en_voice", "first_message": "Hello!" },    { "language": "es", "voice_id": "es_voice", "first_message": "¡Hola!" }  ]}
```
```
{  "agent": { "prompt": { "knowledge_base": ["doc_id_1", "doc_id_2"] } },  "knowledge_base_config": {    "max_chunks": 5,    "vector_distance_threshold": 0.8  }}
```
```
{  "agent": { "prompt": { "knowledge_base": ["doc_id_1", "doc_id_2"] } },  "knowledge_base_config": {    "max_chunks": 5,    "vector_distance_threshold": 0.8  }}
```
```
const doc = await client.knowledgeBase.upload({ file: fs.createReadStream('docs.pdf'), name: 'Docs' });await client.knowledgeBase.computeRagIndex({ document_id: doc.id, embedding_model: 'e5_mistral_7b' });
```
```
const doc = await client.knowledgeBase.upload({ file: fs.createReadStream('docs.pdf'), name: 'Docs' });await client.knowledgeBase.computeRagIndex({ document_id: doc.id, embedding_model: 'e5_mistral_7b' });
```
```
prompt.tools
```
```
tools
```
```
prompt.tools
```
```
{  agent: {    prompt: {      tools: [{ name: "get_weather", url: "...", method: "GET" }]    }  }}
```
```
{  agent: {    prompt: {      tools: [{ name: "get_weather", url: "...", method: "GET" }]    }  }}
```
```
{  agent: {    prompt: {      tool_ids: ["tool_abc123"],         // Client/server tools      built_in_tools: ["end_call"]       // System tools (new field)    }  }}
```
```
{  agent: {    prompt: {      tool_ids: ["tool_abc123"],         // Client/server tools      built_in_tools: ["end_call"]       // System tools (new field)    }  }}
```
```
clientTools: {  updateCart: {    description: "Update shopping cart",    parameters: z.object({ item: z.string(), quantity: z.number() }),    handler: async ({ item, quantity }) => {      // Client-side logic      return { success: true };    }  }}
```
```
clientTools: {  updateCart: {    description: "Update shopping cart",    parameters: z.object({ item: z.string(), quantity: z.number() }),    handler: async ({ item, quantity }) => {      // Client-side logic      return { success: true };    }  }}
```
```
{  "name": "get_weather",  "url": "https://api.weather.com/{{user_id}}",  "method": "GET",  "headers": { "Authorization": "Bearer {{secret__api_key}}" },  "parameters": { "type": "object", "properties": { "city": { "type": "string" } } }}
```
```
{  "name": "get_weather",  "url": "https://api.weather.com/{{user_id}}",  "method": "GET",  "headers": { "Authorization": "Bearer {{secret__api_key}}" },  "parameters": { "type": "object", "properties": { "city": { "type": "string" } } }}
```
```
gpt-4o-mini
```
```
end_call
```
```
detect_language
```
```
transfer_agent
```
```
transfer_to_number
```
```
dtmf_playpad
```
```
voicemail_detection
```
```
use_out_of_band_dtmf
```
```
const { startConversation, stopConversation, status, isSpeaking } = useConversation({  agentId: 'your-agent-id',  signedUrl: '/api/auth', // OR apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY  clientTools: { /* ... */ },  onEvent: (event) => { /* transcript, agent_response, tool_call, agent_tool_request (Oct 2025) */ },  onConnect/onDisconnect/onError,  serverLocation: 'us' // 'eu-residency' | 'in-residency' | 'global'});
```
```
const { startConversation, stopConversation, status, isSpeaking } = useConversation({  agentId: 'your-agent-id',  signedUrl: '/api/auth', // OR apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY  clientTools: { /* ... */ },  onEvent: (event) => { /* transcript, agent_response, tool_call, agent_tool_request (Oct 2025) */ },  onConnect/onDisconnect/onError,  serverLocation: 'us' // 'eu-residency' | 'in-residency' | 'global'});
```
```
agent_chat_response_part
```
```
agent_tool_request
```
```
signedUrl
```
```
conversationToken
```
```
@elevenlabs/react@0.12.3
```
```
@elevenlabs/client@0.12.2
```
```
new Conversation({...})
```
```
@elevenlabs/react-native@0.5.7
```
```
<script src="https://elevenlabs.io/convai-widget/index.js"></script>
```
```
@elevenlabs/convai-widget-embed@0.5.5
```
```
@elevenlabs/convai-widget-core@0.5.5
```
```
const { connect, startRecording, stopRecording, transcript, partialTranscript } = useScribe({  token: async () => (await fetch('/api/scribe/token')).json().then(d => d.token),  commitStrategy: 'vad', // 'vad' (auto on silence) | 'manual' (explicit .commit())  sampleRate: 16000, // 16000 or 24000  onPartialTranscript/onFinalTranscript/onError});
```
```
const { connect, startRecording, stopRecording, transcript, partialTranscript } = useScribe({  token: async () => (await fetch('/api/scribe/token')).json().then(d => d.token),  commitStrategy: 'vad', // 'vad' (auto on silence) | 'manual' (explicit .commit())  sampleRate: 16000, // 16000 or 24000  onPartialTranscript/onFinalTranscript/onError});
```
```
speechToText.convert()
```
```
webhook: true
```
```
{ request_id }
```
```
ParseError: response: Missing required key "language_code"; Missing required key "text"; ...
```
```
ParseError: response: Missing required key "language_code"; Missing required key "text"; ...
```
```
const formData = new FormData();formData.append('file', audioFile);formData.append('model_id', 'scribe_v1');formData.append('webhook', 'true');formData.append('webhook_id', webhookId);const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {  method: 'POST',  headers: { 'xi-api-key': apiKey },  body: formData,});const result = await response.json(); // { request_id: 'xxx' }// Actual transcription delivered to webhook endpoint
```
```
const formData = new FormData();formData.append('file', audioFile);formData.append('model_id', 'scribe_v1');formData.append('webhook', 'true');formData.append('webhook_id', webhookId);const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {  method: 'POST',  headers: { 'xi-api-key': apiKey },  body: formData,});const result = await response.json(); // { request_id: 'xxx' }// Actual transcription delivered to webhook endpoint
```
```
# Create testelevenlabs tests add "Refund Test" --template basic-llm# Configure in test_configs/refund-test.json{  "name": "Refund Test",  "scenario": "Customer requests refund",  "success_criteria": ["Agent acknowledges empathetically", "Verifies order details"],  "expected_tool_call": { "tool_name": "lookup_order", "parameters": { "order_id": "..." } }}# Deploy and executeelevenlabs tests pushelevenlabs agents test "Support Agent"
```
```
# Create testelevenlabs tests add "Refund Test" --template basic-llm# Configure in test_configs/refund-test.json{  "name": "Refund Test",  "scenario": "Customer requests refund",  "success_criteria": ["Agent acknowledges empathetically", "Verifies order details"],  "expected_tool_call": { "tool_name": "lookup_order", "parameters": { "order_id": "..." } }}# Deploy and executeelevenlabs tests pushelevenlabs agents test "Support Agent"
```
```
POST /v1/convai/tests
```
```
GET /v1/convai/tests/:id
```
```
PATCH /v1/convai/tests/:id
```
```
DELETE /v1/convai/tests/:id
```
```
POST /v1/convai/tests/:id/execute
```
```
GET /v1/convai/test-invocations
```
```
POST /v1/convai/test-invocations/:id/resubmit
```
```
GET /v1/convai/test-results/:id
```
```
GET /v1/convai/test-results/:id/debug
```
```
const invocations = await client.convai.testInvocations.list({  agent_id: 'agent_123',      // Filter by agent  page_size: 30,              // Default 30, max 100  cursor: 'next_page_cursor'  // Pagination});// Returns: test run counts, pass/fail stats, titles
```
```
const invocations = await client.convai.testInvocations.list({  agent_id: 'agent_123',      // Filter by agent  page_size: 30,              // Default 30, max 100  cursor: 'next_page_cursor'  // Pagination});// Returns: test run counts, pass/fail stats, titles
```
```
const simulation = await client.agents.simulate({  agent_id: 'agent_123',  scenario: 'Refund request',  user_messages: ["I want a refund", "Order #12345"],  success_criteria: ["Acknowledges request", "Verifies order"]});console.log('Passed:', simulation.passed);
```
```
const simulation = await client.agents.simulate({  agent_id: 'agent_123',  scenario: 'Refund request',  user_messages: ["I want a refund", "Order #12345"],  success_criteria: ["Acknowledges request", "Verifies order"]});console.log('Passed:', simulation.passed);
```
```
agent_id
```
```
call_start_before_unix
```
```
aggregation_interval
```
```
tool_latency_secs
```
```
{ "transcripts": { "retention_days": 730 }, "audio": { "retention_days": 2190 } }
```
```
serverLocation: 'eu-residency' | 'us' | 'global' | 'in-residency'
```
```
{ "caching": { "enabled": true, "ttl_seconds": 3600 } }
```
```
{ "burst_pricing_enabled": true }
```
```
audio
```
```
transcript
```
```
agent_response
```
```
tool_call
```
```
agent_chat_response_part
```
```
agent_tool_request
```
```
conversation_state
```
```
{ "llm_config": { "custom": { "endpoint": "...", "api_key": "{{secret__key}}" } } }
```
```
{ "chat_mode": true }
```
```
npm install -g @elevenlabs/agents-cli@0.6.1elevenlabs auth loginelevenlabs auth residency eu-residency  # 'in-residency' | 'global'export ELEVENLABS_API_KEY=your-api-key  # For CI/CD
```
```
npm install -g @elevenlabs/agents-cli@0.6.1elevenlabs auth loginelevenlabs auth residency eu-residency  # 'in-residency' | 'global'export ELEVENLABS_API_KEY=your-api-key  # For CI/CD
```
```
agents.json
```
```
tools.json
```
```
tests.json
```
```
agent_configs/
```
```
tool_configs/
```
```
test_configs/
```
```
elevenlabs agents initelevenlabs agents add "Bot" --template customer-serviceelevenlabs agents push --env prod --dry-run  # Previewelevenlabs agents push --env prod            # Deployelevenlabs agents pull                       # Import existingelevenlabs agents test "Bot"                 # 2025: Enhanced testingelevenlabs tools add-webhook "Weather" --config-path tool_configs/weather.jsonelevenlabs tools pushelevenlabs tests add "Test" --template basic-llmelevenlabs tests push
```
```
elevenlabs agents initelevenlabs agents add "Bot" --template customer-serviceelevenlabs agents push --env prod --dry-run  # Previewelevenlabs agents push --env prod            # Deployelevenlabs agents pull                       # Import existingelevenlabs agents test "Bot"                 # 2025: Enhanced testingelevenlabs tools add-webhook "Weather" --config-path tool_configs/weather.jsonelevenlabs tools pushelevenlabs tests add "Test" --template basic-llmelevenlabs tests push
```
```
agent.dev.json
```
```
agent.staging.json
```
```
agent.prod.json
```
```
--dry-run
```
```
.env
```
```
.elevenlabs/
```
```
*.secret.json
```
```
dynamic_variables: { user_name: "John", ... }
```
```
tool_ids: ["orderLookup"]
```
```
name: "orderLookup"
```
```
hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
```
```
ElevenLabs-Signature
```
```
X-ElevenLabs-Signature
```
```
{ "language": "es", "voice_id": "spanish_voice" }
```
```
elevenlabs agents init --override
```
```
elevenlabs agents pull
```
```
"description": "Order ID (format: ORD-12345)"
```
```
index.status === 'ready'
```
```
Error receiving message: received 1002 (protocol error)Error sending user audio chunk: received 1002 (protocol error)WebSocket is already in CLOSING or CLOSED state
```
```
Error receiving message: received 1002 (protocol error)Error sending user audio chunk: received 1002 (protocol error)WebSocket is already in CLOSING or CLOSED state
```
```
connectionType: 'webrtc'
```
```
Host is not supportedHost is not valid or supportedHost is not in insights whitelistWebSocket is already in CLOSING or CLOSED state
```
```
Host is not supportedHost is not valid or supportedHost is not in insights whitelistWebSocket is already in CLOSING or CLOSED state
```
```
127.0.0.1:3000
```
```
localhost:3000
```
```
localhost:3000
```
```
http://localhost:3000
```
```
localhost:3000/voice-chat
```
```
www.localhost:3000
```
```
127.0.0.1:3000
```
```
{ "call_limits": { "burst_pricing_enabled": true } }
```
```
connectionDelay: { android: 3_000, ios: 0 }
```
```
blob:
```
```
cp node_modules/@elevenlabs/client/dist/worklets/*.js public/elevenlabs/
```
```
workletPaths: { 'rawAudioProcessor': '/elevenlabs/rawAudioProcessor.worklet.js', 'audioConcatProcessor': '/elevenlabs/audioConcatProcessor.worklet.js' }
```
```
script-src 'self' https://elevenlabs.io; worker-src 'self';
```
```
@elevenlabs/client
```
```
message: string
```
```
null
```
```
z.string().nullable()
```
```
// ❌ Fails on tool call turns:message: z.string()// ✅ Correct:message: z.string().nullable()
```
```
// ❌ Fails on tool call turns:message: z.string()// ✅ Correct:message: z.string().nullable()
```
```
{ "role": "agent", "message": null, "tool_calls": [{ "tool_name": "my_tool", ... }] }
```
```
{ "role": "agent", "message": null, "tool_calls": [{ "tool_name": "my_tool", ... }] }
```
```
call_successful: boolean
```
```
"success"
```
```
"failure"
```
```
// Schema:call_successful: z.union([z.boolean(), z.string()]).optional()// Conversion helper:function parseCallSuccessful(value: unknown): boolean | undefined {  if (value === undefined || value === null) return undefined  if (typeof value === 'boolean') return value  if (typeof value === 'string') return value.toLowerCase() === 'success'  return undefined}
```
```
// Schema:call_successful: z.union([z.boolean(), z.string()]).optional()// Conversion helper:function parseCallSuccessful(value: unknown): boolean | undefined {  if (value === undefined || value === null) return undefined  if (typeof value === 'boolean') return value  if (typeof value === 'string') return value.toLowerCase() === 'success'  return undefined}
```
```
agent_metadata
```
```
multivoice_message
```
```
llm_override
```
```
rag_retrieval_info
```
```
llm_usage
```
```
interrupted
```
```
original_message
```
```
source_medium
```
```
.optional()
```
```
z.any()
```
```
metadata.cost
```
```
metadata.charging.llm_price
```
```
// ❌ Wrong - displays credits as dollars:cost: metadata?.cost  // Returns 78 (credits)// ✅ Correct - actual USD cost:const charging = metadata?.charging as anycost: charging?.llm_price ?? null  // Returns 0.0036 (USD)
```
```
// ❌ Wrong - displays credits as dollars:cost: metadata?.cost  // Returns 78 (credits)// ✅ Correct - actual USD cost:const charging = metadata?.charging as anycost: charging?.llm_price ?? null  // Returns 0.0036 (USD)
```
```
{  "metadata": {    "cost": 78,  // ← CREDITS, not dollars!    "charging": {      "llm_price": 0.0036188999999999995,  // ← Actual USD cost      "llm_charge": 18,   // LLM credits      "call_charge": 60,  // Audio credits      "tier": "pro"    }  }}
```
```
{  "metadata": {    "cost": 78,  // ← CREDITS, not dollars!    "charging": {      "llm_price": 0.0036188999999999995,  // ← Actual USD cost      "llm_charge": 18,   // LLM credits      "call_charge": 60,  // Audio credits      "tier": "pro"    }  }}
```
```
llm_price
```
```
dynamic_variables
```
```
conversation_initiation_client_data
```
```
const dynamicVars = data.conversation_initiation_client_data?.dynamic_variablesconst callerName = dynamicVars?.user_name || nullconst callerEmail = dynamicVars?.user_email || nullconst currentPage = dynamicVars?.current_page || null
```
```
const dynamicVars = data.conversation_initiation_client_data?.dynamic_variablesconst callerName = dynamicVars?.user_name || nullconst callerEmail = dynamicVars?.user_email || nullconst currentPage = dynamicVars?.current_page || null
```
```
{  "conversation_initiation_client_data": {    "dynamic_variables": {      "user_name": "Jeremy Dawes",      "user_email": "jeremy@jezweb.net",      "current_page": "/dashboard/calls"    }  }}
```
```
{  "conversation_initiation_client_data": {    "dynamic_variables": {      "user_name": "Jeremy Dawes",      "user_email": "jeremy@jezweb.net",      "current_page": "/dashboard/calls"    }  }}
```
```
analysis.data_collection_results
```
```
const dataCollectionResults = analysis?.dataCollectionResults  ? JSON.parse(analysis.dataCollectionResults)  : null// Display each collected field:Object.entries(dataCollectionResults).forEach(([key, data]) => {  console.log(${key}: ${data.value} (${data.rationale}))})
```
```
const dataCollectionResults = analysis?.dataCollectionResults  ? JSON.parse(analysis.dataCollectionResults)  : null// Display each collected field:Object.entries(dataCollectionResults).forEach(([key, data]) => {  console.log(${key}: ${data.value} (${data.rationale}))})
```
```
${key}: ${data.value} (${data.rationale})
```
```
{  "data_collection_results": {    "customer_name": { "value": "John Smith", "rationale": "Customer stated their name" },    "intent": { "value": "billing_inquiry", "rationale": "Asking about invoice" },    "callback_number": { "value": "+61400123456", "rationale": "Provided for callback" }  }}
```
```
{  "data_collection_results": {    "customer_name": { "value": "John Smith", "rationale": "Customer stated their name" },    "intent": { "value": "billing_inquiry", "rationale": "Asking about invoice" },    "callback_number": { "value": "+61400123456", "rationale": "Provided for callback" }  }}
```
```
analysis.evaluation_criteria_results
```
```
const evaluationResults = analysis?.evaluationCriteriaResults  ? JSON.parse(analysis.evaluationCriteriaResults)  : nullObject.entries(evaluationResults).forEach(([key, data]) => {  const passed = data.result === 'success' || data.result === true  console.log(${key}: ${passed ? 'PASS' : 'FAIL'} - ${data.rationale})})
```
```
const evaluationResults = analysis?.evaluationCriteriaResults  ? JSON.parse(analysis.evaluationCriteriaResults)  : nullObject.entries(evaluationResults).forEach(([key, data]) => {  const passed = data.result === 'success' || data.result === true  console.log(${key}: ${passed ? 'PASS' : 'FAIL'} - ${data.rationale})})
```
```
${key}: ${passed ? 'PASS' : 'FAIL'} - ${data.rationale}
```
```
{  "evaluation_criteria_results": {    "verified_identity": { "result": "success", "rationale": "Customer verified DOB" },    "resolved_issue": { "result": "failure", "rationale": "Escalated to human" }  }}
```
```
{  "evaluation_criteria_results": {    "verified_identity": { "result": "success", "rationale": "Customer verified DOB" },    "resolved_issue": { "result": "failure", "rationale": "Escalated to human" }  }}
```
```
metadata.feedback.thumb_rating
```
```
const feedback = metadata?.feedback as anyconst feedbackRating = feedback?.thumb_rating ?? null  // 1, -1, or null// Also available:const likes = feedback?.likes    // Array of things user likedconst dislikes = feedback?.dislikes  // Array of things user disliked
```
```
const feedback = metadata?.feedback as anyconst feedbackRating = feedback?.thumb_rating ?? null  // 1, -1, or null// Also available:const likes = feedback?.likes    // Array of things user likedconst dislikes = feedback?.dislikes  // Array of things user disliked
```
```
{  "metadata": {    "feedback": {      "thumb_rating": 1,      "likes": ["helpful", "natural"],      "dislikes": []    }  }}
```
```
{  "metadata": {    "feedback": {      "thumb_rating": 1,      "likes": ["helpful", "natural"],      "dislikes": []    }  }}
```
```
const turnAny = turn as anyconst messageData = {  // ... existing fields  interrupted: turnAny.interrupted ?? null,          // Was turn cut off by user?  sourceMedium: turnAny.source_medium ?? null,       // Channel: web, phone, etc.  originalMessage: turnAny.original_message ?? null, // Pre-processed message  ragRetrievalInfo: turnAny.rag_retrieval_info       // What knowledge was retrieved    ? JSON.stringify(turnAny.rag_retrieval_info)    : null,}
```
```
const turnAny = turn as anyconst messageData = {  // ... existing fields  interrupted: turnAny.interrupted ?? null,          // Was turn cut off by user?  sourceMedium: turnAny.source_medium ?? null,       // Channel: web, phone, etc.  originalMessage: turnAny.original_message ?? null, // Pre-processed message  ragRetrievalInfo: turnAny.rag_retrieval_info       // What knowledge was retrieved    ? JSON.stringify(turnAny.rag_retrieval_info)    : null,}
```
```
interrupted: true
```
```
source_medium
```
```
rag_retrieval_info
```
```
// In webhook payload (coming August 15, 2025):has_audio: boolean        // Was full audio recorded?has_user_audio: boolean   // Was user audio captured?has_response_audio: boolean // Was agent audio captured?// Schema (future-proof):const schema = z.object({  // ... existing fields  has_audio: z.boolean().optional(),  has_user_audio: z.boolean().optional(),  has_response_audio: z.boolean().optional(),})
```
```
// In webhook payload (coming August 15, 2025):has_audio: boolean        // Was full audio recorded?has_user_audio: boolean   // Was user audio captured?has_response_audio: boolean // Was agent audio captured?// Schema (future-proof):const schema = z.object({  // ... existing fields  has_audio: z.boolean().optional(),  has_user_audio: z.boolean().optional(),  has_response_audio: z.boolean().optional(),})
```
```
conversations.get(id)
```
```
Error: response -> transcript -> [11] -> tool_results -> [0] -> type:Expected string. Received null.;response -> transcript -> [11] -> tool_results -> [0] -> type:[Variant 1] Expected "system". Received null.;response -> transcript -> [11] -> tool_results -> [0] -> type:[Variant 2] Expected "workflow". Received null.
```
```
Error: response -> transcript -> [11] -> tool_results -> [0] -> type:Expected string. Received null.;response -> transcript -> [11] -> tool_results -> [0] -> type:[Variant 1] Expected "system". Received null.;response -> transcript -> [11] -> tool_results -> [0] -> type:[Variant 2] Expected "workflow". Received null.
```
```
conversation.get()
```
```
try {     const conversation = await client.conversationalAi.conversations.get(id);   } catch (error) {     console.error('Tool parsing error - conversation may reference deleted tools');   }
```
```
try {     const conversation = await client.conversationalAi.conversations.get(id);   } catch (error) {     console.error('Tool parsing error - conversation may reference deleted tools');   }
```
```
// ❌ WRONG - parameter ignored:convert(voiceId, { model_id: "eleven_v3" })// ✅ CORRECT:convert(voiceId, { modelId: "eleven_v3" })
```
```
// ❌ WRONG - parameter ignored:convert(voiceId, { model_id: "eleven_v3" })// ✅ CORRECT:convert(voiceId, { modelId: "eleven_v3" })
```
```
model_id
```
```
voice_id
```
```
output_format
```
```
voice_settings
```
```
{ request_id }
```
```
ParseError: Missing required key "language_code"; Missing required key "text"; ...
```
```
ParseError: Missing required key "language_code"; Missing required key "text"; ...
```
```
const formData = new FormData();formData.append('file', audioFile);formData.append('model_id', 'scribe_v1');formData.append('webhook', 'true');formData.append('webhook_id', webhookId);const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {  method: 'POST',  headers: { 'xi-api-key': apiKey },  body: formData,});const result = await response.json(); // { request_id: 'xxx' }
```
```
const formData = new FormData();formData.append('file', audioFile);formData.append('model_id', 'scribe_v1');formData.append('webhook', 'true');formData.append('webhook_id', webhookId);const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {  method: 'POST',  headers: { 'xi-api-key': apiKey },  body: formData,});const result = await response.json(); // { request_id: 'xxx' }
```
```
@elevenlabs/elevenlabs-js
```
```
child_process
```
```
Module not found: Can't resolve 'child_process'
```
```
Module not found: Can't resolve 'child_process'
```
```
@elevenlabs/client
```
```
@elevenlabs/react
```
```
elevenlabs-js
```
```
elevenlabs-js
```
```
elevenlabs-js
```
```
prompt.tools
```
```
A request must include either prompt.tool_ids or the legacy prompt.tools array — never both
```
```
A request must include either prompt.tool_ids or the legacy prompt.tools array — never both
```
```
// ❌ Old (rejected):{ agent: { prompt: { tools: [...] } } }// ✅ New (required):{  agent: {    prompt: {      tool_ids: ["tool_abc123"],         // Client/server tools      built_in_tools: ["end_call"]       // System tools    }  }}
```
```
// ❌ Old (rejected):{ agent: { prompt: { tools: [...] } } }// ✅ New (required):{  agent: {    prompt: {      tool_ids: ["tool_abc123"],         // Client/server tools      built_in_tools: ["end_call"]       // System tools    }  }}
```
```
gpt-4o-mini
```
```
gpt-4o-mini
```
```
audio_format
```
```
@elevenlabs/elevenlabs-js@2.32.0
```
This powerful agent skill provides direct integration with the ElevenLabs Agents Platform, empowering developers to construct sophisticated, real-time conversational AI voice agents. By orchestrating Automatic Speech Recognition (ASR), Large Language Models (LLM) for reasoning, Text-to-Speech (TTS) for natural voice output, and a proprietary turn-taking model, this skill simplifies the complex process of building interactive voice experiences. It's ideal for creating applications that require seamless, human-like verbal interaction, from virtual assistants to interactive voice response systems, ensuring high-quality audio and intelligent dialogue. Harness its capabilities to bring your AI agents to life with expressive voices and fluid conversations.

# When to Use This Skill
- •Building sophisticated virtual assistants for customer service, support, or educational platforms that require natural voice interaction.
- •Creating interactive voice response (IVR) systems with advanced natural language understanding and fluid conversational capabilities.
- •Developing AI companions, tutors, or storytellers that communicate via expressive and low-latency voice.
- •Enabling voice-controlled interfaces for applications, smart home devices, or robotic systems requiring human-like dialogue.

# Pro Tips
- 💡Always reference the latest ElevenLabs SDK package versions to ensure compatibility and access to the newest features, especially given the frequent updates mentioned in the documentation.
- 💡Leverage the proprietary turn-taking model for natural, interruption-aware conversations to enhance user experience beyond simple prompt-response cycles, making interactions feel more human.
- 💡Experiment with different LLMs, ASR settings, and TTS voices available through the platform to optimize both the intelligence and the personality of your AI agent for specific use cases.

