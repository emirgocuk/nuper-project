# openai-agents
Source: https://antigravity.codes/agent-skills/ai-tools/openai-agents

## AI Worker Instructions
When the user requests functionality related to openai-agents, follow these guidelines and utilize this context.

## Scraped Content

# openai-agents
```
npm install @openai/agents zod@4  # v0.4.0+ requires Zod 4 (breaking change)npm install @openai/agents-realtime  # Voice agentsexport OPENAI_API_KEY="your-key"
```
```
npm install @openai/agents zod@4  # v0.4.0+ requires Zod 4 (breaking change)npm install @openai/agents-realtime  # Voice agentsexport OPENAI_API_KEY="your-key"
```
```
zod@4
```
```
import { Agent } from '@openai/agents';const agent = new Agent({ name: 'Assistant', tools: [myTool], model: 'gpt-5-mini' });
```
```
import { Agent } from '@openai/agents';const agent = new Agent({ name: 'Assistant', tools: [myTool], model: 'gpt-5-mini' });
```
```
import { tool } from '@openai/agents';import { z } from 'zod';const weatherTool = tool({  name: 'get_weather',  parameters: z.object({ city: z.string() }),  execute: async ({ city }) => Weather in ${city}: sunny,});
```
```
import { tool } from '@openai/agents';import { z } from 'zod';const weatherTool = tool({  name: 'get_weather',  parameters: z.object({ city: z.string() }),  execute: async ({ city }) => Weather in ${city}: sunny,});
```
```
Weather in ${city}: sunny
```
```
const triageAgent = Agent.create({ handoffs: [specialist1, specialist2] });
```
```
const triageAgent = Agent.create({ handoffs: [specialist1, specialist2] });
```
```
const agent = new Agent({ inputGuardrails: [detector], outputGuardrails: [filter] });
```
```
const agent = new Agent({ inputGuardrails: [detector], outputGuardrails: [filter] });
```
```
const agent = new Agent({ outputType: z.object({ sentiment: z.enum(['positive', 'negative']) }) });
```
```
const agent = new Agent({ outputType: z.object({ sentiment: z.enum(['positive', 'negative']) }) });
```
```
const result = await run(agent, 'What is 2+2?')
```
```
const stream = await run(agent, 'Tell me a story', { stream: true });for await (const event of stream) {  if (event.type === 'raw_model_stream_event') process.stdout.write(event.data?.choices?.[0]?.delta?.content || '');}
```
```
const stream = await run(agent, 'Tell me a story', { stream: true });for await (const event of stream) {  if (event.type === 'raw_model_stream_event') process.stdout.write(event.data?.choices?.[0]?.delta?.content || '');}
```
```
const billingAgent = new Agent({ name: 'Billing', handoffDescription: 'For billing questions', tools: [refundTool] });const techAgent = new Agent({ name: 'Technical', handoffDescription: 'For tech issues', tools: [ticketTool] });const triageAgent = Agent.create({ name: 'Triage', handoffs: [billingAgent, techAgent] });
```
```
const billingAgent = new Agent({ name: 'Billing', handoffDescription: 'For billing questions', tools: [refundTool] });const techAgent = new Agent({ name: 'Technical', handoffDescription: 'For tech issues', tools: [ticketTool] });const triageAgent = Agent.create({ name: 'Triage', handoffs: [billingAgent, techAgent] });
```
```
agent.asTool()
```
```
const helperTool = tool({  name: 'use_helper',  parameters: z.object({    query: z.string(),    context: z.string().optional(),  }),  execute: async ({ query, context }) => {    return await run(subAgent, ${context}\n\n${query});  },});
```
```
const helperTool = tool({  name: 'use_helper',  parameters: z.object({    query: z.string(),    context: z.string().optional(),  }),  execute: async ({ query, context }) => {    return await run(subAgent, ${context}\n\n${query});  },});
```
```
${context}\n\n${query}
```
```
const guardrail: InputGuardrail = {  execute: async ({ input }) => ({ tripwireTriggered: detectHomework(input) })};const agent = new Agent({ inputGuardrails: [guardrail] });
```
```
const guardrail: InputGuardrail = {  execute: async ({ input }) => ({ tripwireTriggered: detectHomework(input) })};const agent = new Agent({ inputGuardrails: [guardrail] });
```
```
const refundTool = tool({ name: 'process_refund', requiresApproval: true, execute: async ({ amount }) => Refunded $${amount} });let result = await runner.run(input);while (result.interruption?.type === 'tool_approval') {  result = await promptUser(result.interruption) ? result.state.approve(result.interruption) : result.state.reject(result.interruption);}
```
```
const refundTool = tool({ name: 'process_refund', requiresApproval: true, execute: async ({ amount }) => Refunded $${amount} });let result = await runner.run(input);while (result.interruption?.type === 'tool_approval') {  result = await promptUser(result.interruption) ? result.state.approve(result.interruption) : result.state.reject(result.interruption);}
```
```
Refunded $${amount}
```
```
stream: true
```
```
requiresApproval
```
```
const stream = await run(agent, input, { stream: true });let result = await stream.finalResult();while (result.interruption?.type === 'tool_approval') {  const approved = await promptUser(result.interruption);  result = approved    ? await result.state.approve(result.interruption)    : await result.state.reject(result.interruption);}
```
```
const stream = await run(agent, input, { stream: true });let result = await stream.finalResult();while (result.interruption?.type === 'tool_approval') {  const approved = await promptUser(result.interruption);  result = approved    ? await result.state.approve(result.interruption)    : await result.state.reject(result.interruption);}
```
```
import { RealtimeAgent } from '@openai/agents-realtime';const voiceAgent = new RealtimeAgent({  voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer  model: 'gpt-5-realtime',  tools: [weatherTool],});
```
```
import { RealtimeAgent } from '@openai/agents-realtime';const voiceAgent = new RealtimeAgent({  voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer  model: 'gpt-5-realtime',  tools: [weatherTool],});
```
```
import { RealtimeSession } from '@openai/agents-realtime';const session = new RealtimeSession(voiceAgent, { apiKey: sessionApiKey, transport: 'webrtc' });await session.connect();
```
```
import { RealtimeSession } from '@openai/agents-realtime';const session = new RealtimeSession(voiceAgent, { apiKey: sessionApiKey, transport: 'webrtc' });await session.connect();
```
```
templates/realtime-agents/realtime-agent-basic.ts
```
```
templates/realtime-agents/realtime-session-browser.tsx
```
```
templates/realtime-agents/realtime-handoffs.ts
```
```
references/realtime-transports.md
```
```
export default {  async fetch(request: Request, env: Env) {    // Disable tracing or use startTracingExportLoop()    process.env.OTEL_SDK_DISABLED = 'true';    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;    const agent = new Agent({ name: 'Assistant', model: 'gpt-5-mini' });    const result = await run(agent, (await request.json()).message);    return Response.json({ response: result.finalOutput, tokens: result.usage.totalTokens });  }};
```
```
export default {  async fetch(request: Request, env: Env) {    // Disable tracing or use startTracingExportLoop()    process.env.OTEL_SDK_DISABLED = 'true';    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;    const agent = new Agent({ name: 'Assistant', model: 'gpt-5-mini' });    const result = await run(agent, (await request.json()).message);    return Response.json({ response: result.finalOutput, tokens: result.usage.totalTokens });  }};
```
```
OTEL_SDK_DISABLED=true
```
```
startTracingExportLoop()
```
```
app/api/agent/route.ts
```
```
POST
```
```
run(agent, message)
```
```
cloudflare-workers/
```
```
nextjs/
```
```
// ❌ Can cause type errorsparameters: mySchema// ✅ Works reliablyparameters: z.object({ field: z.string() })
```
```
// ❌ Can cause type errorsparameters: mySchema// ✅ Works reliablyparameters: z.object({ field: z.string() })
```
```
import { initializeTracing } from '@openai/agents/tracing';await initializeTracing();
```
```
import { initializeTracing } from '@openai/agents/tracing';await initializeTracing();
```
```
const result = await run(agent, input, {  maxTurns: 20, // Increase limit});// Or improve instructionsinstructions: After using tools, provide a final answer.Do not loop endlessly.
```
```
const result = await run(agent, input, {  maxTurns: 20, // Increase limit});// Or improve instructionsinstructions: After using tools, provide a final answer.Do not loop endlessly.
```
```
After using tools, provide a final answer.Do not loop endlessly.
```
```
for (let attempt = 1; attempt <= 3; attempt++) {  try {    return await run(agent, input);  } catch (error) {    if (error instanceof ToolCallError && attempt < 3) {      await sleep(1000 * Math.pow(2, attempt - 1));      continue;    }    throw error;  }}
```
```
for (let attempt = 1; attempt <= 3; attempt++) {  try {    return await run(agent, input);  } catch (error) {    if (error instanceof ToolCallError && attempt < 3) {      await sleep(1000 * Math.pow(2, attempt - 1));      continue;    }    throw error;  }}
```
```
outputType
```
```
const agent = new Agent({  model: 'gpt-5', // More reliable than gpt-5-mini  instructions: 'CRITICAL: Return JSON matching schema exactly',  outputType: mySchema,});
```
```
const agent = new Agent({  model: 'gpt-5', // More reliable than gpt-5-mini  instructions: 'CRITICAL: Return JSON matching schema exactly',  outputType: mySchema,});
```
```
"low"
```
```
"none"
```
```
// v0.4.0+ - default is now "none"const agent = new Agent({  model: 'gpt-5.1',  reasoning: { effort: 'low' }, // Explicitly set if needed: 'low', 'medium', 'high'});
```
```
// v0.4.0+ - default is now "none"const agent = new Agent({  model: 'gpt-5.1',  reasoning: { effort: 'low' }, // Explicitly set if needed: 'low', 'medium', 'high'});
```
```
response_reasoning
```
```
outputType
```
```
response_reasoning
```
```
const result = await run(agent, input);const { response_reasoning, ...cleanOutput } = result.finalOutput;return cleanOutput;
```
```
const result = await run(agent, input);const { response_reasoning, ...cleanOutput } = result.finalOutput;return cleanOutput;
```
```
references/common-errors.md
```
```
templates/shared/error-handling.ts
```
```
Promise.all([run(agent1, text), run(agent2, text)])
```
```
process.env.DEBUG = '@openai/agents:*';  // Verbose loggingconst result = await run(agent, input);console.log(result.usage.totalTokens, result.history.length, result.currentAgent?.name);
```
```
process.env.DEBUG = '@openai/agents:*';  // Verbose loggingconst result = await run(agent, input);console.log(result.usage.totalTokens, result.history.length, result.currentAgent?.name);
```
```
openai-api
```
```
OPENAI_API_KEY
```
```
maxTurns
```
```
gpt-5-mini
```
```
agent-basic.ts
```
```
agent-handoffs.ts
```
```
agent-structured-output.ts
```
```
agent-streaming.ts
```
```
agent-guardrails-input.ts
```
```
agent-guardrails-output.ts
```
```
agent-human-approval.ts
```
```
agent-parallel.ts
```
```
realtime-agent-basic.ts
```
```
realtime-session-browser.tsx
```
```
realtime-handoffs.ts
```
```
worker-text-agent.ts
```
```
worker-agent-hono.ts
```
```
api-agent-route.ts
```
```
api-realtime-route.ts
```
```
error-handling.ts
```
```
tracing-setup.ts
```
```
agent-patterns.md
```
```
common-errors.md
```
```
realtime-transports.md
```
```
cloudflare-integration.md
```
```
official-links.md
```
```
/* ❌ Imported schema causes type errors (GitHub #188) */import { mySchema } from './schemas'const tool = { parameters: mySchema }/* ✅ Define inline */const tool = {  parameters: z.object({    location: z.string().describe('City name'),  }),}
```
```
/* ❌ Imported schema causes type errors (GitHub #188) */import { mySchema } from './schemas'const tool = { parameters: mySchema }/* ✅ Define inline */const tool = {  parameters: z.object({    location: z.string().describe('City name'),  }),}
```
```
/* ❌ "No existing trace found" error */const result = await agent.run()/* ✅ Initialize tracing first */import { initializeTracing } from '@openai/agents'initializeTracing()const result = await agent.run()
```
```
/* ❌ "No existing trace found" error */const result = await agent.run()/* ✅ Initialize tracing first */import { initializeTracing } from '@openai/agents'initializeTracing()const result = await agent.run()
```
```
/* ❌ Default maxTurns often too low */const agent = new Agent({ tools })/* ✅ Increase maxTurns and improve instructions */const agent = new Agent({  tools,  maxTurns: 20, // Increase from default  instructions: 'Complete the task, then return final_answer tool',})
```
```
/* ❌ Default maxTurns often too low */const agent = new Agent({ tools })/* ✅ Increase maxTurns and improve instructions */const agent = new Agent({  tools,  maxTurns: 20, // Increase from default  instructions: 'Complete the task, then return final_answer tool',})
```
```
/* ❌ Cannot change voice/model during handoff */handoff({ voice: 'different-voice', model: 'gpt-5' })/* ✅ Voice and model must match original agent */handoff({ voice: originalVoice, model: 'gpt-5-realtime' })
```
```
/* ❌ Cannot change voice/model during handoff */handoff({ voice: 'different-voice', model: 'gpt-5' })/* ✅ Voice and model must match original agent */handoff({ voice: originalVoice, model: 'gpt-5-realtime' })
```
```
/* ❌ Security vulnerability */const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })// Sending to frontend.../* ✅ Generate ephemeral tokens server-side */const session = await client.realtime.sessions.create({ model: 'gpt-5-realtime' })// Send session.client_secret.value to frontend (expires in 60s)
```
```
/* ❌ Security vulnerability */const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })// Sending to frontend.../* ✅ Generate ephemeral tokens server-side */const session = await client.realtime.sessions.create({ model: 'gpt-5-realtime' })// Send session.client_secret.value to frontend (expires in 60s)
```
```
initializeTracing()
```
```
maxTurns
```
This skill integrates the OpenAI Agents SDK, a powerful toolkit for crafting sophisticated AI applications. It goes beyond simple API calls, enabling developers to design intelligent systems featuring autonomous text and real-time voice agents. You can orchestrate complex workflows, embed custom tools, enforce guardrails for predictable behavior, and incorporate human oversight. This skill is essential for building robust, scalable AI solutions that interact dynamically with users and external systems. It empowers creation of truly interactive and reliable AI experiences within coding environments.

# When to Use This Skill
- •Developing a customer service chatbot that can delegate complex queries to specialized AI agents.
- •Creating an interactive voice assistant for real-time information retrieval or task execution.
- •Building a multi-agent system for automating a development workflow, where different agents handle code generation, testing, and deployment.
- •Implementing AI applications that require strict input/output validation and human review for critical decisions.

# Pro Tips
- 💡Leverage Zod schemas comprehensively for tool parameters to ensure robust input validation and clearer LLM function calling.
- 💡Design multi-agent workflows with `handoffs` strategically to break down complex problems, allowing specialized agents to handle distinct tasks efficiently.
- 💡Integrate `guardrails` not just for safety, but also for enforcing specific response formats or business logic, making agent behavior more predictable and reliable.

