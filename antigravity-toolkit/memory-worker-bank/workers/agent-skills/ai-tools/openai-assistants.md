# openai-assistants
Source: https://antigravity.codes/agent-skills/ai-tools/openai-assistants

## AI Worker Instructions
When the user requests functionality related to openai-assistants, follow these guidelines and utilize this context.

## Scraped Content

# openai-assistants
```
openai-responses
```
```
references/migration-to-responses.md
```
```
npm install openai@6.16.0
```
```
npm install openai@6.16.0
```
```
import OpenAI from 'openai';const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });// 1. Create assistantconst assistant = await openai.beta.assistants.create({  name: "Math Tutor",  instructions: "You are a math tutor. Use code interpreter for calculations.",  tools: [{ type: "code_interpreter" }],  model: "gpt-5",});// 2. Create threadconst thread = await openai.beta.threads.create();// 3. Add messageawait openai.beta.threads.messages.create(thread.id, {  role: "user",  content: "Solve: 3x + 11 = 14",});// 4. Run assistantconst run = await openai.beta.threads.runs.create(thread.id, {  assistant_id: assistant.id,});// 5. Poll for completionlet status = await openai.beta.threads.runs.retrieve(thread.id, run.id);while (status.status !== 'completed') {  await new Promise(r => setTimeout(r, 1000));  status = await openai.beta.threads.runs.retrieve(thread.id, run.id);}// 6. Get responseconst messages = await openai.beta.threads.messages.list(thread.id);console.log(messages.data[0].content[0].text.value);
```
```
import OpenAI from 'openai';const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });// 1. Create assistantconst assistant = await openai.beta.assistants.create({  name: "Math Tutor",  instructions: "You are a math tutor. Use code interpreter for calculations.",  tools: [{ type: "code_interpreter" }],  model: "gpt-5",});// 2. Create threadconst thread = await openai.beta.threads.create();// 3. Add messageawait openai.beta.threads.messages.create(thread.id, {  role: "user",  content: "Solve: 3x + 11 = 14",});// 4. Run assistantconst run = await openai.beta.threads.runs.create(thread.id, {  assistant_id: assistant.id,});// 5. Poll for completionlet status = await openai.beta.threads.runs.retrieve(thread.id, run.id);while (status.status !== 'completed') {  await new Promise(r => setTimeout(r, 1000));  status = await openai.beta.threads.runs.retrieve(thread.id, run.id);}// 6. Get responseconst messages = await openai.beta.threads.messages.list(thread.id);console.log(messages.data[0].content[0].text.value);
```
```
const assistant = await openai.beta.assistants.create({  model: "gpt-5",  instructions: "System prompt (max 256k chars in v2)",  tools: [{ type: "code_interpreter" }, { type: "file_search" }],  tool_resources: { file_search: { vector_store_ids: ["vs_123"] } },});
```
```
const assistant = await openai.beta.assistants.create({  model: "gpt-5",  instructions: "System prompt (max 256k chars in v2)",  tools: [{ type: "code_interpreter" }, { type: "file_search" }],  tool_resources: { file_search: { vector_store_ids: ["vs_123"] } },});
```
```
// Create thread with messagesconst thread = await openai.beta.threads.create({  messages: [{ role: "user", content: "Hello" }],});// Add message with attachmentsawait openai.beta.threads.messages.create(thread.id, {  role: "user",  content: "Analyze this",  attachments: [{ file_id: "file_123", tools: [{ type: "code_interpreter" }] }],});// List messagesconst msgs = await openai.beta.threads.messages.list(thread.id);
```
```
// Create thread with messagesconst thread = await openai.beta.threads.create({  messages: [{ role: "user", content: "Hello" }],});// Add message with attachmentsawait openai.beta.threads.messages.create(thread.id, {  role: "user",  content: "Analyze this",  attachments: [{ file_id: "file_123", tools: [{ type: "code_interpreter" }] }],});// List messagesconst msgs = await openai.beta.threads.messages.list(thread.id);
```
```
// Create run with optional overridesconst run = await openai.beta.threads.runs.create(thread.id, {  assistant_id: "asst_123",  additional_messages: [{ role: "user", content: "Question" }],  max_prompt_tokens: 1000,  max_completion_tokens: 500,});// Poll until completelet status = await openai.beta.threads.runs.retrieve(thread.id, run.id);while (['queued', 'in_progress'].includes(status.status)) {  await new Promise(r => setTimeout(r, 1000));  status = await openai.beta.threads.runs.retrieve(thread.id, run.id);}
```
```
// Create run with optional overridesconst run = await openai.beta.threads.runs.create(thread.id, {  assistant_id: "asst_123",  additional_messages: [{ role: "user", content: "Question" }],  max_prompt_tokens: 1000,  max_completion_tokens: 500,});// Poll until completelet status = await openai.beta.threads.runs.retrieve(thread.id, run.id);while (['queued', 'in_progress'].includes(status.status)) {  await new Promise(r => setTimeout(r, 1000));  status = await openai.beta.threads.runs.retrieve(thread.id, run.id);}
```
```
queued
```
```
in_progress
```
```
requires_action
```
```
completed
```
```
failed
```
```
cancelled
```
```
expired
```
```
const stream = await openai.beta.threads.runs.stream(thread.id, { assistant_id });for await (const event of stream) {  if (event.event === 'thread.message.delta') {    process.stdout.write(event.data.delta.content?.[0]?.text?.value || '');  }}
```
```
const stream = await openai.beta.threads.runs.stream(thread.id, { assistant_id });for await (const event of stream) {  if (event.event === 'thread.message.delta') {    process.stdout.write(event.data.delta.content?.[0]?.text?.value || '');  }}
```
```
thread.run.created
```
```
thread.message.delta
```
```
thread.run.step.delta
```
```
thread.run.completed
```
```
thread.run.requires_action
```
```
// Attach file to messageattachments: [{ file_id: "file_123", tools: [{ type: "code_interpreter" }] }]// Access generated filesfor (const content of message.content) {  if (content.type === 'image_file') {    const fileContent = await openai.files.content(content.image_file.file_id);  }}
```
```
// Attach file to messageattachments: [{ file_id: "file_123", tools: [{ type: "code_interpreter" }] }]// Access generated filesfor (const content of message.content) {  if (content.type === 'image_file') {    const fileContent = await openai.files.content(content.image_file.file_id);  }}
```
```
// Create vector storeconst vs = await openai.beta.vectorStores.create({ name: "Docs" });await openai.beta.vectorStores.files.create(vs.id, { file_id: "file_123" });// Wait for indexinglet store = await openai.beta.vectorStores.retrieve(vs.id);while (store.status === 'in_progress') {  await new Promise(r => setTimeout(r, 2000));  store = await openai.beta.vectorStores.retrieve(vs.id);}// Use in assistanttool_resources: { file_search: { vector_store_ids: [vs.id] } }
```
```
// Create vector storeconst vs = await openai.beta.vectorStores.create({ name: "Docs" });await openai.beta.vectorStores.files.create(vs.id, { file_id: "file_123" });// Wait for indexinglet store = await openai.beta.vectorStores.retrieve(vs.id);while (store.status === 'in_progress') {  await new Promise(r => setTimeout(r, 2000));  store = await openai.beta.vectorStores.retrieve(vs.id);}// Use in assistanttool_resources: { file_search: { vector_store_ids: [vs.id] } }
```
```
status: 'completed'
```
```
if (run.status === 'requires_action') {  const toolCalls = run.required_action.submit_tool_outputs.tool_calls;  const outputs = toolCalls.map(tc => ({    tool_call_id: tc.id,    output: JSON.stringify(yourFunction(JSON.parse(tc.function.arguments))),  }));  run = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {    tool_outputs: outputs,  });}
```
```
if (run.status === 'requires_action') {  const toolCalls = run.required_action.submit_tool_outputs.tool_calls;  const outputs = toolCalls.map(tc => ({    tool_call_id: tc.id,    output: JSON.stringify(yourFunction(JSON.parse(tc.function.arguments))),  }));  run = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {    tool_outputs: outputs,  });}
```
```
Error: 400 Can't add messages to thread_xxx while a run run_xxx is active.
```
```
Error: 400 Can't add messages to thread_xxx while a run run_xxx is active.
```
```
await openai.beta.threads.runs.cancel(threadId, runId)
```
```
Error: OpenAIError: Final run has not been received
```
```
Error: OpenAIError: Final run has not been received
```
```
incomplete
```
```
try {  const stream = await openai.beta.threads.runs.stream(thread.id, { assistant_id });  for await (const event of stream) {    if (event.event === 'thread.message.delta') {      process.stdout.write(event.data.delta.content?.[0]?.text?.value || '');    }  }} catch (error) {  if (error.message?.includes('Final run has not been received')) {    // Run ended with 'incomplete' status - thread can continue    const run = await openai.beta.threads.runs.retrieve(thread.id, runId);    if (run.status === 'incomplete') {      // Handle: prompt user to continue, reduce max_completion_tokens, etc.    }  }}
```
```
try {  const stream = await openai.beta.threads.runs.stream(thread.id, { assistant_id });  for await (const event of stream) {    if (event.event === 'thread.message.delta') {      process.stdout.write(event.data.delta.content?.[0]?.text?.value || '');    }  }} catch (error) {  if (error.message?.includes('Final run has not been received')) {    // Run ended with 'incomplete' status - thread can continue    const run = await openai.beta.threads.runs.retrieve(thread.id, runId);    if (run.status === 'incomplete') {      // Handle: prompt user to continue, reduce max_completion_tokens, etc.    }  }}
```
```
vectorStores.retrieve()
```
```
status === 'completed'
```
```
Error: No 'files' provided to process
```
```
Error: No 'files' provided to process
```
```
uploadAndPoll
```
```
{ files: [...] }
```
```
// ✅ Correctawait openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, {  files: fileStreams});// ❌ Wrong (shown in official docs)await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, fileStreams);
```
```
// ✅ Correctawait openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, {  files: fileStreams});// ❌ Wrong (shown in official docs)await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, fileStreams);
```
```
Error: Unsupported parameter: 'temperature' is not supported with this model
```
```
Error: Unsupported parameter: 'temperature' is not supported with this model
```
```
null
```
```
await openai.beta.assistants.update(assistantId, {  model: 'o3-mini',  reasoning_effort: 'medium',  temperature: null,  // ✅ Must explicitly clear  top_p: null});
```
```
await openai.beta.assistants.update(assistantId, {  model: 'o3-mini',  reasoning_effort: 'medium',  temperature: null,  // ✅ Must explicitly clear  top_p: null});
```
```
Error: Invalid 'batch_id': 'vs_...'. Expected an ID that begins with 'vsfb_'.
```
```
Error: Invalid 'batch_id': 'vs_...'. Expected an ID that begins with 'vsfb_'.
```
```
uploadAndPoll
```
```
// Option 1: Use createAndPoll after separate uploadconst batch = await openai.vectorStores.fileBatches.createAndPoll(  vectorStoreId,  { file_ids: uploadedFileIds });// Option 2: List batches to find correct IDconst batches = await openai.vectorStores.fileBatches.list(vectorStoreId);const batchId = batches.data[0].id; // starts with 'vsfb_'
```
```
// Option 1: Use createAndPoll after separate uploadconst batch = await openai.vectorStores.fileBatches.createAndPoll(  vectorStoreId,  { file_ids: uploadedFileIds });// Option 2: List batches to find correct IDconst batches = await openai.vectorStores.fileBatches.list(vectorStoreId);const batchId = batches.data[0].id; // starts with 'vsfb_'
```
```
// ❌ This deletes file from VS_A, VS_B, AND VS_Cawait openai.vectorStores.files.delete('VS_A', 'file-xxx');
```
```
// ❌ This deletes file from VS_A, VS_B, AND VS_Cawait openai.vectorStores.files.delete('VS_A', 'file-xxx');
```
```
vectorStores.fileBatches.uploadAndPoll
```
```
async function createRunSafely(threadId: string, assistantId: string) {  // Check for active runs first  const runs = await openai.beta.threads.runs.list(threadId, { limit: 1 });  const activeRun = runs.data.find(r =>    ['queued', 'in_progress', 'requires_action'].includes(r.status)  );  if (activeRun) {    try {      await openai.beta.threads.runs.cancel(threadId, activeRun.id);      // Wait for cancellation to complete      let run = await openai.beta.threads.runs.retrieve(threadId, activeRun.id);      while (run.status === 'cancelling') {        await new Promise(r => setTimeout(r, 500));        run = await openai.beta.threads.runs.retrieve(threadId, activeRun.id);      }    } catch (error) {      // Ignore "already completed" errors - run finished naturally      if (!error.message?.includes('completed')) throw error;    }  }  return openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });}
```
```
async function createRunSafely(threadId: string, assistantId: string) {  // Check for active runs first  const runs = await openai.beta.threads.runs.list(threadId, { limit: 1 });  const activeRun = runs.data.find(r =>    ['queued', 'in_progress', 'requires_action'].includes(r.status)  );  if (activeRun) {    try {      await openai.beta.threads.runs.cancel(threadId, activeRun.id);      // Wait for cancellation to complete      let run = await openai.beta.threads.runs.retrieve(threadId, activeRun.id);      while (run.status === 'cancelling') {        await new Promise(r => setTimeout(r, 500));        run = await openai.beta.threads.runs.retrieve(threadId, activeRun.id);      }    } catch (error) {      // Ignore "already completed" errors - run finished naturally      if (!error.message?.includes('completed')) throw error;    }  }  return openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });}
```
```
references/top-errors.md
```
```
references/migration-to-responses.md
```
```
retrieval
```
```
file_search
```
```
references/migration-from-v1.md
```
```
templates/basic-assistant.ts
```
```
code-interpreter-assistant.ts
```
```
file-search-assistant.ts
```
```
function-calling-assistant.ts
```
```
streaming-assistant.ts
```
```
references/top-errors.md
```
```
thread-lifecycle.md
```
```
vector-stores.md
```
```
migration-to-responses.md
```
```
migration-from-v1.md
```
```
openai-responses
```
```
openai-api
```
```
openai-responses
```
```
/* ❌ Assistants API (deprecated) */const assistant = await openai.beta.assistants.create({...})const thread = await openai.beta.threads.create()const run = await openai.beta.threads.runs.create(thread.id, {...})/* ✅ Use Responses API instead */const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',  conversation_id: existingConversationId, // Optional: for stateful})
```
```
/* ❌ Assistants API (deprecated) */const assistant = await openai.beta.assistants.create({...})const thread = await openai.beta.threads.create()const run = await openai.beta.threads.runs.create(thread.id, {...})/* ✅ Use Responses API instead */const response = await openai.responses.create({  model: 'gpt-5',  input: 'Hello',  conversation_id: existingConversationId, // Optional: for stateful})
```
```
/* ❌ Will fail if run already active */await openai.beta.threads.runs.create(threadId, { assistant_id })/* ✅ Cancel existing run first */const runs = await openai.beta.threads.runs.list(threadId)const activeRun = runs.data.find(r => r.status === 'in_progress')if (activeRun) {  await openai.beta.threads.runs.cancel(threadId, activeRun.id)}await openai.beta.threads.runs.create(threadId, { assistant_id })
```
```
/* ❌ Will fail if run already active */await openai.beta.threads.runs.create(threadId, { assistant_id })/* ✅ Cancel existing run first */const runs = await openai.beta.threads.runs.list(threadId)const activeRun = runs.data.find(r => r.status === 'in_progress')if (activeRun) {  await openai.beta.threads.runs.cancel(threadId, activeRun.id)}await openai.beta.threads.runs.create(threadId, { assistant_id })
```
```
/* ❌ Using vector store before ready */const vectorStore = await openai.beta.vectorStores.create({...})// Immediately using.../* ✅ Poll until completed */let vs = await openai.beta.vectorStores.create({...})while (vs.status !== 'completed') {  await new Promise(r => setTimeout(r, 1000))  vs = await openai.beta.vectorStores.retrieve(vs.id)}
```
```
/* ❌ Using vector store before ready */const vectorStore = await openai.beta.vectorStores.create({...})// Immediately using.../* ✅ Poll until completed */let vs = await openai.beta.vectorStores.create({...})while (vs.status !== 'completed') {  await new Promise(r => setTimeout(r, 1000))  vs = await openai.beta.vectorStores.retrieve(vs.id)}
```
```
openai-responses
```
```
retrieval
```
```
file_search
```
```
status: 'completed'
```
This AI Agent Skill facilitates interaction with the OpenAI Assistants API v2, offering a structured approach for developers working with existing integrations. While the Assistants API is slated for sunset, this skill remains invaluable for managing and transitioning legacy applications before the official deprecation timeline. It provides the necessary tools to understand current implementations, troubleshoot issues, or strategically migrate towards newer OpenAI paradigms like the Responses API, ensuring operational continuity for your established AI-powered workflows. Essential for historical context and phased modernization efforts.

# When to Use This Skill
- •Maintaining existing applications built on OpenAI Assistants API v2.
- •Migrating codebases from Assistants API v2 to the newer OpenAI Responses API.
- •Debugging or troubleshooting issues within legacy OpenAI Assistants API implementations.
- •Analyzing existing Assistants API v2 code for documentation or feature extraction.

# Pro Tips
- 💡Prioritize developing a clear migration plan to the OpenAI Responses API, utilizing this skill for phased transitions rather than new development.
- 💡Regularly review OpenAI's official documentation for updated migration guides and best practices to ensure a smooth transition before the August 2026 sunset.
- 💡Isolate Assistants API v2 code within your project to minimize refactoring scope when migrating to the Responses API, leveraging modularity.

