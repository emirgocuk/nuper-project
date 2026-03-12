# openai-api
Source: https://antigravity.codes/agent-skills/ai-tools/openai-api

## AI Worker Instructions
When the user requests functionality related to openai-api, follow these guidelines and utilize this context.

## Scraped Content

# openai-api
```
npm install openai@6.16.0
```
```
npm install openai@6.16.0
```
```
export OPENAI_API_KEY="sk-..."
```
```
export OPENAI_API_KEY="sk-..."
```
```
.env
```
```
OPENAI_API_KEY=sk-...
```
```
OPENAI_API_KEY=sk-...
```
```
import OpenAI from 'openai';const openai = new OpenAI({  apiKey: process.env.OPENAI_API_KEY,});const completion = await openai.chat.completions.create({  model: 'gpt-5',  messages: [    { role: 'user', content: 'What are the three laws of robotics?' }  ],});console.log(completion.choices[0].message.content);
```
```
import OpenAI from 'openai';const openai = new OpenAI({  apiKey: process.env.OPENAI_API_KEY,});const completion = await openai.chat.completions.create({  model: 'gpt-5',  messages: [    { role: 'user', content: 'What are the three laws of robotics?' }  ],});console.log(completion.choices[0].message.content);
```
```
const response = await fetch('https://api.openai.com/v1/chat/completions', {  method: 'POST',  headers: {    'Authorization': Bearer ${env.OPENAI_API_KEY},    'Content-Type': 'application/json',  },  body: JSON.stringify({    model: 'gpt-5',    messages: [      { role: 'user', content: 'What are the three laws of robotics?' }    ],  }),});const data = await response.json();console.log(data.choices[0].message.content);
```
```
const response = await fetch('https://api.openai.com/v1/chat/completions', {  method: 'POST',  headers: {    'Authorization': Bearer ${env.OPENAI_API_KEY},    'Content-Type': 'application/json',  },  body: JSON.stringify({    model: 'gpt-5',    messages: [      { role: 'user', content: 'What are the three laws of robotics?' }    ],  }),});const data = await response.json();console.log(data.choices[0].message.content);
```
```
Bearer ${env.OPENAI_API_KEY}
```
```
POST /v1/chat/completions
```
```
{  model: string,              // Model to use (e.g., "gpt-5")  messages: Message[],        // Conversation history  reasoning_effort?: string,  // GPT-5 only: "minimal" | "low" | "medium" | "high"  verbosity?: string,         // GPT-5 only: "low" | "medium" | "high"  temperature?: number,       // NOT supported by GPT-5  max_tokens?: number,        // Max tokens to generate  stream?: boolean,           // Enable streaming  tools?: Tool[],             // Function calling tools}
```
```
{  model: string,              // Model to use (e.g., "gpt-5")  messages: Message[],        // Conversation history  reasoning_effort?: string,  // GPT-5 only: "minimal" | "low" | "medium" | "high"  verbosity?: string,         // GPT-5 only: "low" | "medium" | "high"  temperature?: number,       // NOT supported by GPT-5  max_tokens?: number,        // Max tokens to generate  stream?: boolean,           // Enable streaming  tools?: Tool[],             // Function calling tools}
```
```
{  id: string,                 // Unique completion ID  object: "chat.completion",  created: number,            // Unix timestamp  model: string,              // Model used  choices: [{    index: number,    message: {      role: "assistant",      content: string,        // Generated text      tool_calls?: ToolCall[] // If function calling    },    finish_reason: string     // "stop" | "length" | "tool_calls"  }],  usage: {    prompt_tokens: number,    completion_tokens: number,    total_tokens: number  }}
```
```
{  id: string,                 // Unique completion ID  object: "chat.completion",  created: number,            // Unix timestamp  model: string,              // Model used  choices: [{    index: number,    message: {      role: "assistant",      content: string,        // Generated text      tool_calls?: ToolCall[] // If function calling    },    finish_reason: string     // "stop" | "length" | "tool_calls"  }],  usage: {    prompt_tokens: number,    completion_tokens: number,    total_tokens: number  }}
```
```
openai-responses
```
```
// GPT-5.2 with maximum reasoningconst completion = await openai.chat.completions.create({  model: 'gpt-5.2',  messages: [{ role: 'user', content: 'Solve this extremely complex problem...' }],  reasoning_effort: 'xhigh', // NEW: Beyond "high"});
```
```
// GPT-5.2 with maximum reasoningconst completion = await openai.chat.completions.create({  model: 'gpt-5.2',  messages: [{ role: 'user', content: 'Solve this extremely complex problem...' }],  reasoning_effort: 'xhigh', // NEW: Beyond "high"});
```
```
reasoning_effort: 'none'
```
```
'medium'
```
```
// O-series modelsconst completion = await openai.chat.completions.create({  model: 'o3',  // or 'o3-mini', 'o4-mini'  messages: [{ role: 'user', content: 'Complex reasoning task...' }],});
```
```
// O-series modelsconst completion = await openai.chat.completions.create({  model: 'o3',  // or 'o3-mini', 'o4-mini'  messages: [{ role: 'user', content: 'Complex reasoning task...' }],});
```
```
reasoning_effort
```
```
temperature
```
```
top_p
```
```
logprobs
```
```
openai-responses
```
```
stream: true
```
```
const stream = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [{ role: 'user', content: 'Write a poem' }],  stream: true,});for await (const chunk of stream) {  const content = chunk.choices[0]?.delta?.content || '';  process.stdout.write(content);}
```
```
const stream = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [{ role: 'user', content: 'Write a poem' }],  stream: true,});for await (const chunk of stream) {  const content = chunk.choices[0]?.delta?.content || '';  process.stdout.write(content);}
```
```
const response = await fetch('https://api.openai.com/v1/chat/completions', {  method: 'POST',  headers: {    'Authorization': Bearer ${env.OPENAI_API_KEY},    'Content-Type': 'application/json',  },  body: JSON.stringify({    model: 'gpt-5.1',    messages: [{ role: 'user', content: 'Write a poem' }],    stream: true,  }),});const reader = response.body?.getReader();const decoder = new TextDecoder();while (true) {  const { done, value } = await reader!.read();  if (done) break;  const chunk = decoder.decode(value);  const lines = chunk.split('\n').filter(line => line.trim() !== '');  for (const line of lines) {    if (line.startsWith('data: ')) {      const data = line.slice(6);      if (data === '[DONE]') break;      try {        const json = JSON.parse(data);        const content = json.choices[0]?.delta?.content || '';        console.log(content);      } catch (e) {        // Skip invalid JSON      }    }  }}
```
```
const response = await fetch('https://api.openai.com/v1/chat/completions', {  method: 'POST',  headers: {    'Authorization': Bearer ${env.OPENAI_API_KEY},    'Content-Type': 'application/json',  },  body: JSON.stringify({    model: 'gpt-5.1',    messages: [{ role: 'user', content: 'Write a poem' }],    stream: true,  }),});const reader = response.body?.getReader();const decoder = new TextDecoder();while (true) {  const { done, value } = await reader!.read();  if (done) break;  const chunk = decoder.decode(value);  const lines = chunk.split('\n').filter(line => line.trim() !== '');  for (const line of lines) {    if (line.startsWith('data: ')) {      const data = line.slice(6);      if (data === '[DONE]') break;      try {        const json = JSON.parse(data);        const content = json.choices[0]?.delta?.content || '';        console.log(content);      } catch (e) {        // Skip invalid JSON      }    }  }}
```
```
Bearer ${env.OPENAI_API_KEY}
```
```
data: {"id":"chatcmpl-xyz","choices":[{"delta":{"content":"Hello"}}]}data: [DONE]
```
```
data: {"id":"chatcmpl-xyz","choices":[{"delta":{"content":"Hello"}}]}data: [DONE]
```
```
[DONE]
```
```
const tools = [{  type: 'function',  function: {    name: 'get_weather',    description: 'Get current weather for a location',    parameters: {      type: 'object',      properties: {        location: { type: 'string', description: 'City name' },        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }      },      required: ['location']    }  }}];const completion = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [{ role: 'user', content: 'What is the weather in SF?' }],  tools: tools,});
```
```
const tools = [{  type: 'function',  function: {    name: 'get_weather',    description: 'Get current weather for a location',    parameters: {      type: 'object',      properties: {        location: { type: 'string', description: 'City name' },        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }      },      required: ['location']    }  }}];const completion = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [{ role: 'user', content: 'What is the weather in SF?' }],  tools: tools,});
```
```
const message = completion.choices[0].message;if (message.tool_calls) {  for (const toolCall of message.tool_calls) {    const args = JSON.parse(toolCall.function.arguments);    const result = await executeFunction(toolCall.function.name, args);    // Send result back to model    await openai.chat.completions.create({      model: 'gpt-5.1',      messages: [        ...messages,        message,        {          role: 'tool',          tool_call_id: toolCall.id,          content: JSON.stringify(result)        }      ],      tools: tools,    });  }}
```
```
const message = completion.choices[0].message;if (message.tool_calls) {  for (const toolCall of message.tool_calls) {    const args = JSON.parse(toolCall.function.arguments);    const result = await executeFunction(toolCall.function.name, args);    // Send result back to model    await openai.chat.completions.create({      model: 'gpt-5.1',      messages: [        ...messages,        message,        {          role: 'tool',          tool_call_id: toolCall.id,          content: JSON.stringify(result)        }      ],      tools: tools,    });  }}
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-4o', // Note: Structured outputs best supported on GPT-4o  messages: [    { role: 'user', content: 'Generate a person profile' }  ],  response_format: {    type: 'json_schema',    json_schema: {      name: 'person_profile',      strict: true,      schema: {        type: 'object',        properties: {          name: { type: 'string' },          age: { type: 'number' },          skills: {            type: 'array',            items: { type: 'string' }          }        },        required: ['name', 'age', 'skills'],        additionalProperties: false      }    }  }});const person = JSON.parse(completion.choices[0].message.content);// { name: "Alice", age: 28, skills: ["TypeScript", "React"] }
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-4o', // Note: Structured outputs best supported on GPT-4o  messages: [    { role: 'user', content: 'Generate a person profile' }  ],  response_format: {    type: 'json_schema',    json_schema: {      name: 'person_profile',      strict: true,      schema: {        type: 'object',        properties: {          name: { type: 'string' },          age: { type: 'number' },          skills: {            type: 'array',            items: { type: 'string' }          }        },        required: ['name', 'age', 'skills'],        additionalProperties: false      }    }  }});const person = JSON.parse(completion.choices[0].message.content);// { name: "Alice", age: 28, skills: ["TypeScript", "React"] }
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-5',  messages: [    { role: 'user', content: 'List 3 programming languages as JSON' }  ],  response_format: { type: 'json_object' }});const data = JSON.parse(completion.choices[0].message.content);
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-5',  messages: [    { role: 'user', content: 'List 3 programming languages as JSON' }  ],  response_format: { type: 'json_object' }});const data = JSON.parse(completion.choices[0].message.content);
```
```
response_format
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-4o',  messages: [    {      role: 'user',      content: [        { type: 'text', text: 'What is in this image?' },        {          type: 'image_url',          image_url: {            url: 'https://example.com/image.jpg'          }        }      ]    }  ]});
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-4o',  messages: [    {      role: 'user',      content: [        { type: 'text', text: 'What is in this image?' },        {          type: 'image_url',          image_url: {            url: 'https://example.com/image.jpg'          }        }      ]    }  ]});
```
```
import fs from 'fs';const imageBuffer = fs.readFileSync('./image.jpg');const base64Image = imageBuffer.toString('base64');const completion = await openai.chat.completions.create({  model: 'gpt-4o',  messages: [    {      role: 'user',      content: [        { type: 'text', text: 'Describe this image in detail' },        {          type: 'image_url',          image_url: {            url: data:image/jpeg;base64,${base64Image}          }        }      ]    }  ]});
```
```
import fs from 'fs';const imageBuffer = fs.readFileSync('./image.jpg');const base64Image = imageBuffer.toString('base64');const completion = await openai.chat.completions.create({  model: 'gpt-4o',  messages: [    {      role: 'user',      content: [        { type: 'text', text: 'Describe this image in detail' },        {          type: 'image_url',          image_url: {            url: data:image/jpeg;base64,${base64Image}          }        }      ]    }  ]});
```
```
data:image/jpeg;base64,${base64Image}
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-4o',  messages: [    {      role: 'user',      content: [        { type: 'text', text: 'Compare these two images' },        { type: 'image_url', image_url: { url: 'https://example.com/image1.jpg' } },        { type: 'image_url', image_url: { url: 'https://example.com/image2.jpg' } }      ]    }  ]});
```
```
const completion = await openai.chat.completions.create({  model: 'gpt-4o',  messages: [    {      role: 'user',      content: [        { type: 'text', text: 'Compare these two images' },        { type: 'image_url', image_url: { url: 'https://example.com/image1.jpg' } },        { type: 'image_url', image_url: { url: 'https://example.com/image2.jpg' } }      ]    }  ]});
```
```
POST /v1/embeddings
```
```
const embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'The food was delicious.',});// Returns: { data: [{ embedding: [0.002, -0.009, ...] }] }
```
```
const embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'The food was delicious.',});// Returns: { data: [{ embedding: [0.002, -0.009, ...] }] }
```
```
const embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'Sample text',  dimensions: 256, // Reduced from 1536 default});
```
```
const embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'Sample text',  dimensions: 256, // Reduced from 1536 default});
```
```
const embeddings = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: ['First doc', 'Second doc', 'Third doc'],});
```
```
const embeddings = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: ['First doc', 'Second doc', 'Third doc'],});
```
```
POST /v1/images/generations
```
```
const image = await openai.images.generate({  model: 'dall-e-3',  prompt: 'A white siamese cat with striking blue eyes',  size: '1024x1024', // Also: 1024x1536, 1536x1024, 1024x1792, 1792x1024  quality: 'standard', // or 'hd'  style: 'vivid', // or 'natural'});console.log(image.data[0].url);console.log(image.data[0].revised_prompt); // DALL-E 3 may revise for safety
```
```
const image = await openai.images.generate({  model: 'dall-e-3',  prompt: 'A white siamese cat with striking blue eyes',  size: '1024x1024', // Also: 1024x1536, 1536x1024, 1024x1792, 1792x1024  quality: 'standard', // or 'hd'  style: 'vivid', // or 'natural'});console.log(image.data[0].url);console.log(image.data[0].revised_prompt); // DALL-E 3 may revise for safety
```
```
n: 1
```
```
revised_prompt
```
```
response_format: 'b64_json'
```
```
POST /v1/images/edits
```
```
multipart/form-data
```
```
import FormData from 'form-data';const formData = new FormData();formData.append('model', 'gpt-image-1');formData.append('image', fs.createReadStream('./woman.jpg'));formData.append('image_2', fs.createReadStream('./logo.png')); // Optional compositeformData.append('prompt', 'Add the logo to the fabric.');formData.append('input_fidelity', 'high'); // low|medium|highformData.append('format', 'png'); // Supports transparencyformData.append('background', 'transparent'); // transparent|white|blackconst response = await fetch('https://api.openai.com/v1/images/edits', {  method: 'POST',  headers: {    'Authorization': Bearer ${process.env.OPENAI_API_KEY},    ...formData.getHeaders(),  },  body: formData,});
```
```
import FormData from 'form-data';const formData = new FormData();formData.append('model', 'gpt-image-1');formData.append('image', fs.createReadStream('./woman.jpg'));formData.append('image_2', fs.createReadStream('./logo.png')); // Optional compositeformData.append('prompt', 'Add the logo to the fabric.');formData.append('input_fidelity', 'high'); // low|medium|highformData.append('format', 'png'); // Supports transparencyformData.append('background', 'transparent'); // transparent|white|blackconst response = await fetch('https://api.openai.com/v1/images/edits', {  method: 'POST',  headers: {    'Authorization': Bearer ${process.env.OPENAI_API_KEY},    ...formData.getHeaders(),  },  body: formData,});
```
```
Bearer ${process.env.OPENAI_API_KEY}
```
```
POST /v1/audio/transcriptions
```
```
const transcription = await openai.audio.transcriptions.create({  file: fs.createReadStream('./audio.mp3'),  model: 'whisper-1',});// Returns: { text: "Transcribed text..." }
```
```
const transcription = await openai.audio.transcriptions.create({  file: fs.createReadStream('./audio.mp3'),  model: 'whisper-1',});// Returns: { text: "Transcribed text..." }
```
```
POST /v1/audio/speech
```
```
const mp3 = await openai.audio.speech.create({  model: 'tts-1',  voice: 'alloy',  input: 'Text to speak (max 4096 chars)',  speed: 1.0, // 0.25-4.0  response_format: 'mp3', // mp3|opus|aac|flac|wav|pcm});
```
```
const mp3 = await openai.audio.speech.create({  model: 'tts-1',  voice: 'alloy',  input: 'Text to speak (max 4096 chars)',  speed: 1.0, // 0.25-4.0  response_format: 'mp3', // mp3|opus|aac|flac|wav|pcm});
```
```
const speech = await openai.audio.speech.create({  model: 'gpt-4o-mini-tts',  voice: 'nova',  input: 'Welcome to support.',  instructions: 'Speak in a calm, professional tone.', // Custom voice control});
```
```
const speech = await openai.audio.speech.create({  model: 'gpt-4o-mini-tts',  voice: 'nova',  input: 'Welcome to support.',  instructions: 'Speak in a calm, professional tone.', // Custom voice control});
```
```
const response = await fetch('https://api.openai.com/v1/audio/speech', {  method: 'POST',  headers: {    'Authorization': Bearer ${process.env.OPENAI_API_KEY},    'Content-Type': 'application/json',  },  body: JSON.stringify({    model: 'gpt-4o-mini-tts',    voice: 'nova',    input: 'Long text...',    stream_format: 'sse', // Server-Sent Events  }),});
```
```
const response = await fetch('https://api.openai.com/v1/audio/speech', {  method: 'POST',  headers: {    'Authorization': Bearer ${process.env.OPENAI_API_KEY},    'Content-Type': 'application/json',  },  body: JSON.stringify({    model: 'gpt-4o-mini-tts',    voice: 'nova',    input: 'Long text...',    stream_format: 'sse', // Server-Sent Events  }),});
```
```
Bearer ${process.env.OPENAI_API_KEY}
```
```
instructions
```
```
stream_format: "sse"
```
```
POST /v1/moderations
```
```
const moderation = await openai.moderations.create({  model: 'omni-moderation-latest',  input: 'Text to moderate',});console.log(moderation.results[0].flagged);console.log(moderation.results[0].categories);console.log(moderation.results[0].category_scores); // 0.0-1.0
```
```
const moderation = await openai.moderations.create({  model: 'omni-moderation-latest',  input: 'Text to moderate',});console.log(moderation.results[0].flagged);console.log(moderation.results[0].categories);console.log(moderation.results[0].category_scores); // 0.0-1.0
```
```
const moderation = await openai.moderations.create({  model: 'omni-moderation-latest',  input: ['Text 1', 'Text 2', 'Text 3'],});
```
```
const moderation = await openai.moderations.create({  model: 'omni-moderation-latest',  input: ['Text 1', 'Text 2', 'Text 3'],});
```
```
const ws = new WebSocket('wss://api.openai.com/v1/realtime', {  headers: {    Authorization: Bearer ${process.env.OPENAI_API_KEY},    'OpenAI-Beta': 'realtime=v1',  },});ws.onopen = () => {  ws.send(JSON.stringify({    type: 'session.update',    session: {      voice: 'alloy',  // or: echo, fable, onyx, nova, shimmer, marin, cedar      instructions: 'You are a helpful assistant',      input_audio_transcription: { model: 'whisper-1' },    },  }));};ws.onmessage = (event) => {  const data = JSON.parse(event.data);  switch (data.type) {    case 'response.audio.delta':      // Handle audio chunk (base64 encoded)      playAudioChunk(data.delta);      break;    case 'response.text.delta':      // Handle text transcript      console.log(data.delta);      break;  }};// Send user audiows.send(JSON.stringify({  type: 'input_audio_buffer.append',  audio: base64AudioData,}));
```
```
const ws = new WebSocket('wss://api.openai.com/v1/realtime', {  headers: {    Authorization: Bearer ${process.env.OPENAI_API_KEY},    'OpenAI-Beta': 'realtime=v1',  },});ws.onopen = () => {  ws.send(JSON.stringify({    type: 'session.update',    session: {      voice: 'alloy',  // or: echo, fable, onyx, nova, shimmer, marin, cedar      instructions: 'You are a helpful assistant',      input_audio_transcription: { model: 'whisper-1' },    },  }));};ws.onmessage = (event) => {  const data = JSON.parse(event.data);  switch (data.type) {    case 'response.audio.delta':      // Handle audio chunk (base64 encoded)      playAudioChunk(data.delta);      break;    case 'response.text.delta':      // Handle text transcript      console.log(data.delta);      break;  }};// Send user audiows.send(JSON.stringify({  type: 'input_audio_buffer.append',  audio: base64AudioData,}));
```
```
Bearer ${process.env.OPENAI_API_KEY}
```
```
// 1. Create JSONL file with requestsconst requests = [  { custom_id: 'req-1', method: 'POST', url: '/v1/chat/completions',    body: { model: 'gpt-5.1', messages: [{ role: 'user', content: 'Hello 1' }] } },  { custom_id: 'req-2', method: 'POST', url: '/v1/chat/completions',    body: { model: 'gpt-5.1', messages: [{ role: 'user', content: 'Hello 2' }] } },];// 2. Upload fileconst file = await openai.files.create({  file: new File([requests.map(r => JSON.stringify(r)).join('\n')], 'batch.jsonl'),  purpose: 'batch',});// 3. Create batchconst batch = await openai.batches.create({  input_file_id: file.id,  endpoint: '/v1/chat/completions',  completion_window: '24h',});console.log(batch.id); // batch_abc123
```
```
// 1. Create JSONL file with requestsconst requests = [  { custom_id: 'req-1', method: 'POST', url: '/v1/chat/completions',    body: { model: 'gpt-5.1', messages: [{ role: 'user', content: 'Hello 1' }] } },  { custom_id: 'req-2', method: 'POST', url: '/v1/chat/completions',    body: { model: 'gpt-5.1', messages: [{ role: 'user', content: 'Hello 2' }] } },];// 2. Upload fileconst file = await openai.files.create({  file: new File([requests.map(r => JSON.stringify(r)).join('\n')], 'batch.jsonl'),  purpose: 'batch',});// 3. Create batchconst batch = await openai.batches.create({  input_file_id: file.id,  endpoint: '/v1/chat/completions',  completion_window: '24h',});console.log(batch.id); // batch_abc123
```
```
const batch = await openai.batches.retrieve('batch_abc123');console.log(batch.status);  // validating, in_progress, completed, failedconsole.log(batch.request_counts); // { total, completed, failed }if (batch.status === 'completed') {  const results = await openai.files.content(batch.output_file_id);  // Parse JSONL results}
```
```
const batch = await openai.batches.retrieve('batch_abc123');console.log(batch.status);  // validating, in_progress, completed, failedconsole.log(batch.request_counts); // { total, completed, failed }if (batch.status === 'completed') {  const results = await openai.files.content(batch.output_file_id);  // Parse JSONL results}
```
```
async function completionWithRetry(params, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await openai.chat.completions.create(params);    } catch (error) {      if (error.status === 429 && i < maxRetries - 1) {        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));        continue;      }      throw error;    }  }}
```
```
async function completionWithRetry(params, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await openai.chat.completions.create(params);    } catch (error) {      if (error.status === 429 && i < maxRetries - 1) {        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));        continue;      }      throw error;    }  }}
```
```
response.headers.get('x-ratelimit-limit-requests');response.headers.get('x-ratelimit-remaining-requests');response.headers.get('x-ratelimit-reset-requests');
```
```
response.headers.get('x-ratelimit-limit-requests');response.headers.get('x-ratelimit-remaining-requests');response.headers.get('x-ratelimit-reset-requests');
```
```
400 The requested model 'gpt-5.1-mini' does not exist
```
```
model: 'gpt-5.1-mini' // Does not exist
```
```
model: 'gpt-5.1-mini' // Does not exist
```
```
model: 'gpt-5-mini' // Correct (no .1 suffix)
```
```
model: 'gpt-5-mini' // Correct (no .1 suffix)
```
```
gpt-5
```
```
gpt-5-mini
```
```
gpt-5-nano
```
```
gpt-5.1
```
```
gpt-5.2
```
```
gpt-5.1-mini
```
```
gpt-5.2-mini
```
```
ValueError: shapes (0,256) and (1536,) not aligned
```
```
dimensions
```
```
// ❌ Wrong - missing dimensions, returns 1536 defaultconst embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'text',});// ✅ Correct - specify dimensions to match databaseconst embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'text',  dimensions: 256, // Match your vector database config});
```
```
// ❌ Wrong - missing dimensions, returns 1536 defaultconst embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'text',});// ✅ Correct - specify dimensions to match databaseconst embedding = await openai.embeddings.create({  model: 'text-embedding-3-small',  input: 'text',  dimensions: 256, // Match your vector database config});
```
```
reasoning_effort: 'none'
```
```
// GPT-5 (defaults to 'medium')model: 'gpt-5' // Automatic reasoning// GPT-5.1 (defaults to 'none')model: 'gpt-5.1' // NO reasoning unless specified!reasoning_effort: 'medium' // Must add explicitly
```
```
// GPT-5 (defaults to 'medium')model: 'gpt-5' // Automatic reasoning// GPT-5.1 (defaults to 'none')model: 'gpt-5.1' // NO reasoning unless specified!reasoning_effort: 'medium' // Must add explicitly
```
```
strictNullChecks: true
```
```
usage
```
```
// ❌ TypeScript error with strictNullChecksconst tokens = completion.usage.total_tokens;// ✅ Use optional chaining or null checkconst tokens = completion.usage?.total_tokens ?? 0;// Or explicit checkif (completion.usage) {  const tokens = completion.usage.total_tokens;}
```
```
// ❌ TypeScript error with strictNullChecksconst tokens = completion.usage.total_tokens;// ✅ Use optional chaining or null checkconst tokens = completion.usage?.total_tokens ?? 0;// Or explicit checkif (completion.usage) {  const tokens = completion.usage.total_tokens;}
```
```
text_tokens
```
```
image_tokens
```
```
// These fields exist but aren't typedconst usage = completion.usage as any;console.log(usage.text_tokens);console.log(usage.image_tokens);
```
```
// These fields exist but aren't typedconst usage = completion.usage as any;console.log(usage.text_tokens);console.log(usage.image_tokens);
```
```
zodResponseFormat()
```
```
// ❌ Broken with Zod 4.1.13+const schema = z.object({  status: z.union([z.literal('success'), z.literal('error')]),});// ✅ Workaround: Use enum insteadconst schema = z.object({  status: z.enum(['success', 'error']),});
```
```
// ❌ Broken with Zod 4.1.13+const schema = z.object({  status: z.union([z.literal('success'), z.literal('error')]),});// ✅ Workaround: Use enum insteadconst schema = z.object({  status: z.enum(['success', 'error']),});
```
```
npm install openai@6.16.0
```
```
npm install openai@6.16.0
```
```
OPENAI_API_KEY=sk-...
```
```
/planning/research-logs/openai-api.md
```
```
/* ❌ GPT-5.1 defaults to reasoning_effort: 'none' (different from GPT-5!) */const response = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [...],})/* ✅ Explicitly set reasoning_effort */const response = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [...],  reasoning_effort: 'medium', // Required for reasoning})
```
```
/* ❌ GPT-5.1 defaults to reasoning_effort: 'none' (different from GPT-5!) */const response = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [...],})/* ✅ Explicitly set reasoning_effort */const response = await openai.chat.completions.create({  model: 'gpt-5.1',  messages: [...],  reasoning_effort: 'medium', // Required for reasoning})
```
```
/* ❌ Will fail on GPT-5/GPT-5.1 */const response = await openai.chat.completions.create({  model: 'gpt-5',  temperature: 0.7, // Not supported!})/* ✅ Use reasoning_effort instead, or fall back to GPT-4o */const response = await openai.chat.completions.create({  model: 'gpt-5',  reasoning_effort: 'medium',})// For temperature control, use GPT-4o:const response = await openai.chat.completions.create({  model: 'gpt-4o',  temperature: 0.7,})
```
```
/* ❌ Will fail on GPT-5/GPT-5.1 */const response = await openai.chat.completions.create({  model: 'gpt-5',  temperature: 0.7, // Not supported!})/* ✅ Use reasoning_effort instead, or fall back to GPT-4o */const response = await openai.chat.completions.create({  model: 'gpt-5',  reasoning_effort: 'medium',})// For temperature control, use GPT-4o:const response = await openai.chat.completions.create({  model: 'gpt-4o',  temperature: 0.7,})
```
```
/* ❌ Deprecated models */'gpt-3.5-turbo'  // Deprecated'gpt-4'          // Deprecated/* ✅ Current models */'gpt-5.1'        // Latest (Nov 2025)'gpt-5'          // Previous flagship'gpt-5-mini'     // Cost-efficient'gpt-5-nano'     // Lightweight'gpt-4o'         // Still supported, has temperature
```
```
/* ❌ Deprecated models */'gpt-3.5-turbo'  // Deprecated'gpt-4'          // Deprecated/* ✅ Current models */'gpt-5.1'        // Latest (Nov 2025)'gpt-5'          // Previous flagship'gpt-5-mini'     // Cost-efficient'gpt-5-nano'     // Lightweight'gpt-4o'         // Still supported, has temperature
```
```
/* ❌ Missing error handling */for await (const chunk of stream) {  console.log(chunk.choices[0].delta.content)}/* ✅ Handle [DONE] signal and errors */for await (const chunk of stream) {  if (chunk.choices[0]?.finish_reason === 'stop') break  const content = chunk.choices[0]?.delta?.content  if (content) process.stdout.write(content)}
```
```
/* ❌ Missing error handling */for await (const chunk of stream) {  console.log(chunk.choices[0].delta.content)}/* ✅ Handle [DONE] signal and errors */for await (const chunk of stream) {  if (chunk.choices[0]?.finish_reason === 'stop') break  const content = chunk.choices[0]?.delta?.content  if (content) process.stdout.write(content)}
```
```
/* ❌ n > 1 not supported */const response = await openai.images.generate({  model: 'dall-e-3',  n: 4, // Error!})/* ✅ DALL-E 3 only supports n: 1 */const response = await openai.images.generate({  model: 'dall-e-3',  n: 1,})
```
```
/* ❌ n > 1 not supported */const response = await openai.images.generate({  model: 'dall-e-3',  n: 4, // Error!})/* ✅ DALL-E 3 only supports n: 1 */const response = await openai.images.generate({  model: 'dall-e-3',  n: 1,})
```
```
temperature
```
```
reasoning_effort
```
```
gpt-3.5-turbo
```
```
gpt-4
```
```
gpt-5.1
```
```
gpt-5
```
```
gpt-4o
```
```
n: 4
```
```
n: 1
```
```
finish_reason
```
```
[DONE]
```
```
response_format: 'b64_json'
```
Unlock the full potential of artificial intelligence within your applications using this comprehensive OpenAI API agent skill. Designed for developers utilizing coding assistants like Claude Code and Cursor, this skill provides everything needed to seamlessly integrate cutting-edge AI models. From advanced chat completions and powerful image generation to sophisticated embeddings and audio processing, it streamlines the development workflow. Leverage structured outputs, function calling, and vision capabilities to build intelligent, dynamic solutions faster and more efficiently than ever before, accelerating your AI-driven projects.

# When to Use This Skill
- •Building AI chatbots with advanced conversation capabilities and function calling.
- •Generating and editing images programmatically with DALL-E 3.
- •Implementing semantic search or recommendation systems using text embeddings.
- •Developing audio transcription and text-to-speech applications.

# Pro Tips
- 💡Leverage streaming patterns (SSE) for real-time user experiences, especially with chat completions, to improve perceived performance.
- 💡Master function calling and structured outputs to give your AI agents precise control over external tools and ensure predictable data formats.
- 💡Implement robust error handling and rate limit management from the start to build resilient applications that gracefully handle API constraints.

