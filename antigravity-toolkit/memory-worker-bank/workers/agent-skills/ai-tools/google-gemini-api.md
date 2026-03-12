# google-gemini-api
Source: https://antigravity.codes/agent-skills/ai-tools/google-gemini-api

## AI Worker Instructions
When the user requests functionality related to google-gemini-api, follow these guidelines and utilize this context.

## Scraped Content

# google-gemini-api
```
@google/generative-ai
```
```
@google/genai
```
```
@google/generative-ai
```
```
google-gemini-embeddings
```
```
npm install @google/genai@1.34.0
```
```
npm install @google/genai@1.34.0
```
```
npm install @google/generative-ai  # DO NOT USE!
```
```
npm install @google/generative-ai  # DO NOT USE!
```
```
export GEMINI_API_KEY="..."
```
```
export GEMINI_API_KEY="..."
```
```
.env
```
```
GEMINI_API_KEY=...
```
```
GEMINI_API_KEY=...
```
```
import { GoogleGenAI } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Explain quantum computing in simple terms'});console.log(response.text);
```
```
import { GoogleGenAI } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Explain quantum computing in simple terms'});console.log(response.text);
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Explain quantum computing in simple terms' }] }]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Explain quantum computing in simple terms' }] }]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
import { GoogleGenAI } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Write a haiku about artificial intelligence'});console.log(response.text);
```
```
import { GoogleGenAI } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Write a haiku about artificial intelligence'});console.log(response.text);
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        {          parts: [            { text: 'Write a haiku about artificial intelligence' }          ]        }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        {          parts: [            { text: 'Write a haiku about artificial intelligence' }          ]        }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
{  text: string,                  // Convenience accessor for text content  candidates: [    {      content: {        parts: [          { text: string }       // Generated text        ],        role: string             // "model"      },      finishReason: string,      // "STOP" | "MAX_TOKENS" | "SAFETY" | "OTHER"      index: number    }  ],  usageMetadata: {    promptTokenCount: number,    candidatesTokenCount: number,    totalTokenCount: number  }}
```
```
{  text: string,                  // Convenience accessor for text content  candidates: [    {      content: {        parts: [          { text: string }       // Generated text        ],        role: string             // "model"      },      finishReason: string,      // "STOP" | "MAX_TOKENS" | "SAFETY" | "OTHER"      index: number    }  ],  usageMetadata: {    promptTokenCount: number,    candidatesTokenCount: number,    totalTokenCount: number  }}
```
```
const response = await ai.models.generateContentStream({  model: 'gemini-2.5-flash',  contents: 'Write a 200-word story about time travel'});for await (const chunk of response) {  process.stdout.write(chunk.text);}
```
```
const response = await ai.models.generateContentStream({  model: 'gemini-2.5-flash',  contents: 'Write a 200-word story about time travel'});for await (const chunk of response) {  process.stdout.write(chunk.text);}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Write a 200-word story about time travel' }] }]    }),  });const reader = response.body.getReader();const decoder = new TextDecoder();let buffer = '';while (true) {  const { done, value } = await reader.read();  if (done) break;  buffer += decoder.decode(value, { stream: true });  const lines = buffer.split('\n');  buffer = lines.pop() || '';  for (const line of lines) {    if (line.trim() === '' || line.startsWith('data: [DONE]')) continue;    if (!line.startsWith('data: ')) continue;    try {      const data = JSON.parse(line.slice(6));      const text = data.candidates[0]?.content?.parts[0]?.text;      if (text) {        process.stdout.write(text);      }    } catch (e) {      // Skip invalid JSON    }  }}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Write a 200-word story about time travel' }] }]    }),  });const reader = response.body.getReader();const decoder = new TextDecoder();let buffer = '';while (true) {  const { done, value } = await reader.read();  if (done) break;  buffer += decoder.decode(value, { stream: true });  const lines = buffer.split('\n');  buffer = lines.pop() || '';  for (const line of lines) {    if (line.trim() === '' || line.startsWith('data: [DONE]')) continue;    if (!line.startsWith('data: ')) continue;    try {      const data = JSON.parse(line.slice(6));      const text = data.candidates[0]?.content?.parts[0]?.text;      if (text) {        process.stdout.write(text);      }    } catch (e) {      // Skip invalid JSON    }  }}
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent
```
```
streamGenerateContent
```
```
generateContent
```
```
data: {json}\n\n
```
```
[DONE]
```
```
import { GoogleGenAI } from '@google/genai';import fs from 'fs';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// From fileconst imageData = fs.readFileSync('/path/to/image.jpg');const base64Image = imageData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'What is in this image?' },        {          inlineData: {            data: base64Image,            mimeType: 'image/jpeg'          }        }      ]    }  ]});console.log(response.text);
```
```
import { GoogleGenAI } from '@google/genai';import fs from 'fs';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// From fileconst imageData = fs.readFileSync('/path/to/image.jpg');const base64Image = imageData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'What is in this image?' },        {          inlineData: {            data: base64Image,            mimeType: 'image/jpeg'          }        }      ]    }  ]});console.log(response.text);
```
```
const imageData = fs.readFileSync('/path/to/image.jpg');const base64Image = imageData.toString('base64');const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        {          parts: [            { text: 'What is in this image?' },            {              inlineData: {                data: base64Image,                mimeType: 'image/jpeg'              }            }          ]        }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
const imageData = fs.readFileSync('/path/to/image.jpg');const base64Image = imageData.toString('base64');const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        {          parts: [            { text: 'What is in this image?' },            {              inlineData: {                data: base64Image,                mimeType: 'image/jpeg'              }            }          ]        }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
.jpg
```
```
.jpeg
```
```
.png
```
```
.webp
```
```
.heic
```
```
.heif
```
```
// Video must be < 2 minutes for inline dataconst videoData = fs.readFileSync('/path/to/video.mp4');const base64Video = videoData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Describe what happens in this video' },        {          inlineData: {            data: base64Video,            mimeType: 'video/mp4'          }        }      ]    }  ]});console.log(response.text);
```
```
// Video must be < 2 minutes for inline dataconst videoData = fs.readFileSync('/path/to/video.mp4');const base64Video = videoData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Describe what happens in this video' },        {          inlineData: {            data: base64Video,            mimeType: 'video/mp4'          }        }      ]    }  ]});console.log(response.text);
```
```
.mp4
```
```
.mpeg
```
```
.mov
```
```
.avi
```
```
.flv
```
```
.mpg
```
```
.webm
```
```
.wmv
```
```
const audioData = fs.readFileSync('/path/to/audio.mp3');const base64Audio = audioData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Transcribe and summarize this audio' },        {          inlineData: {            data: base64Audio,            mimeType: 'audio/mp3'          }        }      ]    }  ]});console.log(response.text);
```
```
const audioData = fs.readFileSync('/path/to/audio.mp3');const base64Audio = audioData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Transcribe and summarize this audio' },        {          inlineData: {            data: base64Audio,            mimeType: 'audio/mp3'          }        }      ]    }  ]});console.log(response.text);
```
```
.mp3
```
```
.wav
```
```
.flac
```
```
.aac
```
```
.ogg
```
```
.opus
```
```
const pdfData = fs.readFileSync('/path/to/document.pdf');const base64Pdf = pdfData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Summarize the key points in this PDF' },        {          inlineData: {            data: base64Pdf,            mimeType: 'application/pdf'          }        }      ]    }  ]});console.log(response.text);
```
```
const pdfData = fs.readFileSync('/path/to/document.pdf');const base64Pdf = pdfData.toString('base64');const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Summarize the key points in this PDF' },        {          inlineData: {            data: base64Pdf,            mimeType: 'application/pdf'          }        }      ]    }  ]});console.log(response.text);
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Compare these two images and describe the differences:' },        { inlineData: { data: base64Image1, mimeType: 'image/jpeg' } },        { inlineData: { data: base64Image2, mimeType: 'image/jpeg' } }      ]    }  ]});
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: [    {      parts: [        { text: 'Compare these two images and describe the differences:' },        { inlineData: { data: base64Image1, mimeType: 'image/jpeg' } },        { inlineData: { data: base64Image2, mimeType: 'image/jpeg' } }      ]    }  ]});
```
```
import { GoogleGenAI, FunctionCallingConfigMode } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Define function declarationsconst getCurrentWeather = {  name: 'get_current_weather',  description: 'Get the current weather for a location',  parametersJsonSchema: {    type: 'object',    properties: {      location: {        type: 'string',        description: 'City name, e.g. San Francisco'      },      unit: {        type: 'string',        enum: ['celsius', 'fahrenheit']      }    },    required: ['location']  }};// Make request with toolsconst response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What\'s the weather in Tokyo?',  config: {    tools: [      { functionDeclarations: [getCurrentWeather] }    ]  }});// Check if model wants to call a functionconst functionCall = response.candidates[0].content.parts[0].functionCall;if (functionCall) {  console.log('Function to call:', functionCall.name);  console.log('Arguments:', functionCall.args);  // Execute the function (your implementation)  const weatherData = await fetchWeather(functionCall.args.location);  // Send function result back to model  const finalResponse = await ai.models.generateContent({    model: 'gemini-2.5-flash',    contents: [      'What\'s the weather in Tokyo?',      response.candidates[0].content, // Original assistant response with function call      {        parts: [          {            functionResponse: {              name: functionCall.name,              response: weatherData            }          }        ]      }    ],    config: {      tools: [        { functionDeclarations: [getCurrentWeather] }      ]    }  });  console.log(finalResponse.text);}
```
```
import { GoogleGenAI, FunctionCallingConfigMode } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Define function declarationsconst getCurrentWeather = {  name: 'get_current_weather',  description: 'Get the current weather for a location',  parametersJsonSchema: {    type: 'object',    properties: {      location: {        type: 'string',        description: 'City name, e.g. San Francisco'      },      unit: {        type: 'string',        enum: ['celsius', 'fahrenheit']      }    },    required: ['location']  }};// Make request with toolsconst response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What\'s the weather in Tokyo?',  config: {    tools: [      { functionDeclarations: [getCurrentWeather] }    ]  }});// Check if model wants to call a functionconst functionCall = response.candidates[0].content.parts[0].functionCall;if (functionCall) {  console.log('Function to call:', functionCall.name);  console.log('Arguments:', functionCall.args);  // Execute the function (your implementation)  const weatherData = await fetchWeather(functionCall.args.location);  // Send function result back to model  const finalResponse = await ai.models.generateContent({    model: 'gemini-2.5-flash',    contents: [      'What\'s the weather in Tokyo?',      response.candidates[0].content, // Original assistant response with function call      {        parts: [          {            functionResponse: {              name: functionCall.name,              response: weatherData            }          }        ]      }    ],    config: {      tools: [        { functionDeclarations: [getCurrentWeather] }      ]    }  });  console.log(finalResponse.text);}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        { parts: [{ text: 'What\'s the weather in Tokyo?' }] }      ],      tools: [        {          functionDeclarations: [            {              name: 'get_current_weather',              description: 'Get the current weather for a location',              parameters: {                type: 'object',                properties: {                  location: {                    type: 'string',                    description: 'City name'                  }                },                required: ['location']              }            }          ]        }      ]    }),  });const data = await response.json();const functionCall = data.candidates[0]?.content?.parts[0]?.functionCall;if (functionCall) {  // Execute function and send result back (same flow as SDK)}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        { parts: [{ text: 'What\'s the weather in Tokyo?' }] }      ],      tools: [        {          functionDeclarations: [            {              name: 'get_current_weather',              description: 'Get the current weather for a location',              parameters: {                type: 'object',                properties: {                  location: {                    type: 'string',                    description: 'City name'                  }                },                required: ['location']              }            }          ]        }      ]    }),  });const data = await response.json();const functionCall = data.candidates[0]?.content?.parts[0]?.functionCall;if (functionCall) {  // Execute function and send result back (same flow as SDK)}
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
const tools = [  {    functionDeclarations: [      {        name: 'get_weather',        description: 'Get weather for a location',        parametersJsonSchema: {          type: 'object',          properties: {            location: { type: 'string' }          },          required: ['location']        }      },      {        name: 'get_population',        description: 'Get population of a city',        parametersJsonSchema: {          type: 'object',          properties: {            city: { type: 'string' }          },          required: ['city']        }      }    ]  }];const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is the weather and population of Tokyo?',  config: { tools }});// Model may return MULTIPLE function calls in parallelconst functionCalls = response.candidates[0].content.parts.filter(  part => part.functionCall);console.log(Model wants to call ${functionCalls.length} functions in parallel);
```
```
const tools = [  {    functionDeclarations: [      {        name: 'get_weather',        description: 'Get weather for a location',        parametersJsonSchema: {          type: 'object',          properties: {            location: { type: 'string' }          },          required: ['location']        }      },      {        name: 'get_population',        description: 'Get population of a city',        parametersJsonSchema: {          type: 'object',          properties: {            city: { type: 'string' }          },          required: ['city']        }      }    ]  }];const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is the weather and population of Tokyo?',  config: { tools }});// Model may return MULTIPLE function calls in parallelconst functionCalls = response.candidates[0].content.parts.filter(  part => part.functionCall);console.log(Model wants to call ${functionCalls.length} functions in parallel);
```
```
Model wants to call ${functionCalls.length} functions in parallel
```
```
import { FunctionCallingConfigMode } from '@google/genai';const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What\'s the weather?',  config: {    tools: [{ functionDeclarations: [getCurrentWeather] }],    toolConfig: {      functionCallingConfig: {        mode: FunctionCallingConfigMode.ANY, // Force function call        // mode: FunctionCallingConfigMode.AUTO, // Model decides (default)        // mode: FunctionCallingConfigMode.NONE, // Never call functions        allowedFunctionNames: ['get_current_weather'] // Optional: restrict to specific functions      }    }  }});
```
```
import { FunctionCallingConfigMode } from '@google/genai';const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What\'s the weather?',  config: {    tools: [{ functionDeclarations: [getCurrentWeather] }],    toolConfig: {      functionCallingConfig: {        mode: FunctionCallingConfigMode.ANY, // Force function call        // mode: FunctionCallingConfigMode.AUTO, // Model decides (default)        // mode: FunctionCallingConfigMode.NONE, // Never call functions        allowedFunctionNames: ['get_current_weather'] // Optional: restrict to specific functions      }    }  }});
```
```
AUTO
```
```
ANY
```
```
NONE
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  systemInstruction: 'You are a helpful AI assistant that always responds in the style of a pirate. Use nautical terminology and end sentences with "arrr".',  contents: 'Explain what a database is'});console.log(response.text);// Output: "Ahoy there! A database be like a treasure chest..."
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  systemInstruction: 'You are a helpful AI assistant that always responds in the style of a pirate. Use nautical terminology and end sentences with "arrr".',  contents: 'Explain what a database is'});console.log(response.text);// Output: "Ahoy there! A database be like a treasure chest..."
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      systemInstruction: {        parts: [          { text: 'You are a helpful AI assistant that always responds in the style of a pirate.' }        ]      },      contents: [        { parts: [{ text: 'Explain what a database is' }] }      ]    }),  });
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      systemInstruction: {        parts: [          { text: 'You are a helpful AI assistant that always responds in the style of a pirate.' }        ]      },      contents: [        { parts: [{ text: 'Explain what a database is' }] }      ]    }),  });
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
contents
```
```
const chat = await ai.models.createChat({  model: 'gemini-2.5-flash',  systemInstruction: 'You are a helpful coding assistant.',  history: [] // Start empty or with previous messages});// Send first messageconst response1 = await chat.sendMessage('What is TypeScript?');console.log('Assistant:', response1.text);// Send follow-up (context is automatically maintained)const response2 = await chat.sendMessage('How do I install it?');console.log('Assistant:', response2.text);// Get full chat historyconst history = chat.getHistory();console.log('Full conversation:', history);
```
```
const chat = await ai.models.createChat({  model: 'gemini-2.5-flash',  systemInstruction: 'You are a helpful coding assistant.',  history: [] // Start empty or with previous messages});// Send first messageconst response1 = await chat.sendMessage('What is TypeScript?');console.log('Assistant:', response1.text);// Send follow-up (context is automatically maintained)const response2 = await chat.sendMessage('How do I install it?');console.log('Assistant:', response2.text);// Get full chat historyconst history = chat.getHistory();console.log('Full conversation:', history);
```
```
const conversationHistory = [];// First turnconst response1 = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        {          role: 'user',          parts: [{ text: 'What is TypeScript?' }]        }      ]    }),  });const data1 = await response1.json();const assistantReply1 = data1.candidates[0].content.parts[0].text;// Add to historyconversationHistory.push(  { role: 'user', parts: [{ text: 'What is TypeScript?' }] },  { role: 'model', parts: [{ text: assistantReply1 }] });// Second turn (include full history)const response2 = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        ...conversationHistory,        { role: 'user', parts: [{ text: 'How do I install it?' }] }      ]    }),  });
```
```
const conversationHistory = [];// First turnconst response1 = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        {          role: 'user',          parts: [{ text: 'What is TypeScript?' }]        }      ]    }),  });const data1 = await response1.json();const assistantReply1 = data1.candidates[0].content.parts[0].text;// Add to historyconversationHistory.push(  { role: 'user', parts: [{ text: 'What is TypeScript?' }] },  { role: 'model', parts: [{ text: assistantReply1 }] });// Second turn (include full history)const response2 = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        ...conversationHistory,        { role: 'user', parts: [{ text: 'How do I install it?' }] }      ]    }),  });
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
user
```
```
model
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Solve this complex math problem: ...',  config: {    thinkingConfig: {      thinkingBudget: 8192 // Max tokens for thinking (default: model-dependent)    }  }});
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Solve this complex math problem: ...',  config: {    thinkingConfig: {      thinkingBudget: 8192 // Max tokens for thinking (default: model-dependent)    }  }});
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Solve this complex math problem: ...' }] }],      generationConfig: {        thinkingConfig: {          thinkingBudget: 8192        }      }    }),  });
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Solve this complex math problem: ...' }] }],      generationConfig: {        thinkingConfig: {          thinkingBudget: 8192        }      }    }),  });
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Solve this complex problem: ...',  config: {    thinkingConfig: {      thinkingLevel: 'MEDIUM' // 'LOW' | 'MEDIUM' | 'HIGH'    }  }});
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Solve this complex problem: ...',  config: {    thinkingConfig: {      thinkingLevel: 'MEDIUM' // 'LOW' | 'MEDIUM' | 'HIGH'    }  }});
```
```
LOW
```
```
MEDIUM
```
```
HIGH
```
```
thinkingLevel
```
```
thinkingBudget
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Write a creative story',  config: {    temperature: 0.9,           // Randomness (0.0-2.0, default: 1.0)    topP: 0.95,                 // Nucleus sampling (0.0-1.0)    topK: 40,                   // Top-k sampling    maxOutputTokens: 2048,      // Max tokens to generate    stopSequences: ['END'],     // Stop generation if these appear    responseMimeType: 'text/plain', // Or 'application/json' for JSON mode    candidateCount: 1           // Number of response candidates (usually 1)  }});
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Write a creative story',  config: {    temperature: 0.9,           // Randomness (0.0-2.0, default: 1.0)    topP: 0.95,                 // Nucleus sampling (0.0-1.0)    topK: 40,                   // Top-k sampling    maxOutputTokens: 2048,      // Max tokens to generate    stopSequences: ['END'],     // Stop generation if these appear    responseMimeType: 'text/plain', // Or 'application/json' for JSON mode    candidateCount: 1           // Number of response candidates (usually 1)  }});
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Write a creative story' }] }],      generationConfig: {        temperature: 0.9,        topP: 0.95,        topK: 40,        maxOutputTokens: 2048,        stopSequences: ['END'],        responseMimeType: 'text/plain',        candidateCount: 1      }    }),  });
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [{ parts: [{ text: 'Write a creative story' }] }],      generationConfig: {        temperature: 0.9,        topP: 0.95,        topK: 40,        maxOutputTokens: 2048,        stopSequences: ['END'],        responseMimeType: 'text/plain',        candidateCount: 1      }    }),  });
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
import { GoogleGenAI } from '@google/genai';import fs from 'fs';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Create a cache for a large documentconst documentText = fs.readFileSync('./large-document.txt', 'utf-8');const cache = await ai.caches.create({  model: 'gemini-2.5-flash',  config: {    displayName: 'large-doc-cache', // Identifier for the cache    systemInstruction: 'You are an expert at analyzing legal documents.',    contents: documentText,    ttl: '3600s', // Cache for 1 hour  }});console.log('Cache created:', cache.name);console.log('Expires at:', cache.expireTime);
```
```
import { GoogleGenAI } from '@google/genai';import fs from 'fs';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Create a cache for a large documentconst documentText = fs.readFileSync('./large-document.txt', 'utf-8');const cache = await ai.caches.create({  model: 'gemini-2.5-flash',  config: {    displayName: 'large-doc-cache', // Identifier for the cache    systemInstruction: 'You are an expert at analyzing legal documents.',    contents: documentText,    ttl: '3600s', // Cache for 1 hour  }});console.log('Cache created:', cache.name);console.log('Expires at:', cache.expireTime);
```
```
const response = await fetch(  'https://generativelanguage.googleapis.com/v1beta/cachedContents',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      model: 'models/gemini-2.5-flash',      displayName: 'large-doc-cache',      systemInstruction: {        parts: [{ text: 'You are an expert at analyzing legal documents.' }]      },      contents: [        { parts: [{ text: documentText }] }      ],      ttl: '3600s'    }),  });const cache = await response.json();console.log('Cache created:', cache.name);
```
```
const response = await fetch(  'https://generativelanguage.googleapis.com/v1beta/cachedContents',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      model: 'models/gemini-2.5-flash',      displayName: 'large-doc-cache',      systemInstruction: {        parts: [{ text: 'You are an expert at analyzing legal documents.' }]      },      contents: [        { parts: [{ text: documentText }] }      ],      ttl: '3600s'    }),  });const cache = await response.json();console.log('Cache created:', cache.name);
```
```
// Generate content using the cacheconst response = await ai.models.generateContent({  model: cache.name, // Use cache name as model  contents: 'Summarize the key points in the document'});console.log(response.text);
```
```
// Generate content using the cacheconst response = await ai.models.generateContent({  model: cache.name, // Use cache name as model  contents: 'Summarize the key points in the document'});console.log(response.text);
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/${cache.name}:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        { parts: [{ text: 'Summarize the key points in the document' }] }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/${cache.name}:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        { parts: [{ text: 'Summarize the key points in the document' }] }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);
```
```
https://generativelanguage.googleapis.com/v1beta/${cache.name}:generateContent
```
```
import { UpdateCachedContentConfig } from '@google/genai';await ai.caches.update({  name: cache.name,  config: {    ttl: '7200s' // Extend to 2 hours  }});
```
```
import { UpdateCachedContentConfig } from '@google/genai';await ai.caches.update({  name: cache.name,  config: {    ttl: '7200s' // Extend to 2 hours  }});
```
```
// Set specific expiration time (must be timezone-aware)const in10Minutes = new Date(Date.now() + 10 * 60 * 1000);await ai.caches.update({  name: cache.name,  config: {    expireTime: in10Minutes  }});
```
```
// Set specific expiration time (must be timezone-aware)const in10Minutes = new Date(Date.now() + 10 * 60 * 1000);await ai.caches.update({  name: cache.name,  config: {    expireTime: in10Minutes  }});
```
```
// List all cachesconst caches = await ai.caches.list();for (const cache of caches) {  console.log(cache.name, cache.displayName);}// Delete a specific cacheawait ai.caches.delete({ name: cache.name });
```
```
// List all cachesconst caches = await ai.caches.list();for (const cache of caches) {  console.log(cache.name, cache.displayName);}// Delete a specific cacheawait ai.caches.delete({ name: cache.name });
```
```
import { GoogleGenAI } from '@google/genai';import fs from 'fs';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Upload video fileconst videoFile = await ai.files.upload({  file: fs.createReadStream('./video.mp4')});// Wait for processingwhile (videoFile.state.name === 'PROCESSING') {  await new Promise(resolve => setTimeout(resolve, 2000));  videoFile = await ai.files.get({ name: videoFile.name });}// Create cache with videoconst cache = await ai.caches.create({  model: 'gemini-2.5-flash',  config: {    displayName: 'video-analysis-cache',    systemInstruction: 'You are an expert video analyzer.',    contents: [videoFile],    ttl: '300s' // 5 minutes  }});// Use cache for multiple queriesconst response1 = await ai.models.generateContent({  model: cache.name,  contents: 'What happens in the first minute?'});const response2 = await ai.models.generateContent({  model: cache.name,  contents: 'Describe the main characters'});
```
```
import { GoogleGenAI } from '@google/genai';import fs from 'fs';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Upload video fileconst videoFile = await ai.files.upload({  file: fs.createReadStream('./video.mp4')});// Wait for processingwhile (videoFile.state.name === 'PROCESSING') {  await new Promise(resolve => setTimeout(resolve, 2000));  videoFile = await ai.files.get({ name: videoFile.name });}// Create cache with videoconst cache = await ai.caches.create({  model: 'gemini-2.5-flash',  config: {    displayName: 'video-analysis-cache',    systemInstruction: 'You are an expert video analyzer.',    contents: [videoFile],    ttl: '300s' // 5 minutes  }});// Use cache for multiple queriesconst response1 = await ai.models.generateContent({  model: cache.name,  contents: 'What happens in the first minute?'});const response2 = await ai.models.generateContent({  model: cache.name,  contents: 'Describe the main characters'});
```
```
gemini-2.5-flash-001
```
```
gemini-2.5-flash
```
```
math
```
```
statistics
```
```
random
```
```
datetime
```
```
json
```
```
csv
```
```
re
```
```
collections
```
```
itertools
```
```
functools
```
```
numpy
```
```
pandas
```
```
scipy
```
```
matplotlib
```
```
seaborn
```
```
import { GoogleGenAI, Tool, ToolCodeExecution } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is the sum of the first 50 prime numbers? Generate and run code for the calculation.',  config: {    tools: [{ codeExecution: {} }]  }});// Parse response partsfor (const part of response.candidates[0].content.parts) {  if (part.text) {    console.log('Text:', part.text);  }  if (part.executableCode) {    console.log('Generated Code:', part.executableCode.code);  }  if (part.codeExecutionResult) {    console.log('Execution Output:', part.codeExecutionResult.output);  }}
```
```
import { GoogleGenAI, Tool, ToolCodeExecution } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is the sum of the first 50 prime numbers? Generate and run code for the calculation.',  config: {    tools: [{ codeExecution: {} }]  }});// Parse response partsfor (const part of response.candidates[0].content.parts) {  if (part.text) {    console.log('Text:', part.text);  }  if (part.executableCode) {    console.log('Generated Code:', part.executableCode.code);  }  if (part.codeExecutionResult) {    console.log('Execution Output:', part.codeExecutionResult.output);  }}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      tools: [{ code_execution: {} }],      contents: [        {          parts: [            { text: 'What is the sum of the first 50 prime numbers? Generate and run code.' }          ]        }      ]    }),  });const data = await response.json();for (const part of data.candidates[0].content.parts) {  if (part.text) {    console.log('Text:', part.text);  }  if (part.executableCode) {    console.log('Code:', part.executableCode.code);  }  if (part.codeExecutionResult) {    console.log('Result:', part.codeExecutionResult.output);  }}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      tools: [{ code_execution: {} }],      contents: [        {          parts: [            { text: 'What is the sum of the first 50 prime numbers? Generate and run code.' }          ]        }      ]    }),  });const data = await response.json();for (const part of data.candidates[0].content.parts) {  if (part.text) {    console.log('Text:', part.text);  }  if (part.executableCode) {    console.log('Code:', part.executableCode.code);  }  if (part.codeExecutionResult) {    console.log('Result:', part.codeExecutionResult.output);  }}
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
const chat = await ai.chats.create({  model: 'gemini-2.5-flash',  config: {    tools: [{ codeExecution: {} }]  }});let response = await chat.sendMessage('I have a math question for you.');console.log(response.text);response = await chat.sendMessage(  'Calculate the Fibonacci sequence up to the 20th number and sum them.');// Model will generate and execute code, then provide answerfor (const part of response.candidates[0].content.parts) {  if (part.text) console.log(part.text);  if (part.executableCode) console.log('Code:', part.executableCode.code);  if (part.codeExecutionResult) console.log('Output:', part.codeExecutionResult.output);}
```
```
const chat = await ai.chats.create({  model: 'gemini-2.5-flash',  config: {    tools: [{ codeExecution: {} }]  }});let response = await chat.sendMessage('I have a math question for you.');console.log(response.text);response = await chat.sendMessage(  'Calculate the Fibonacci sequence up to the 20th number and sum them.');// Model will generate and execute code, then provide answerfor (const part of response.candidates[0].content.parts) {  if (part.text) console.log(part.text);  if (part.executableCode) console.log('Code:', part.executableCode.code);  if (part.codeExecutionResult) console.log('Output:', part.codeExecutionResult.output);}
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents:     Analyze this sales data and calculate:    1. Total revenue    2. Average sale price    3. Best-selling month    Data (CSV format):    month,sales,revenue    Jan,150,45000    Feb,200,62000    Mar,175,53000    Apr,220,68000  ,  config: {    tools: [{ codeExecution: {} }]  }});// Model will generate pandas/numpy code to analyze datafor (const part of response.candidates[0].content.parts) {  if (part.text) console.log(part.text);  if (part.executableCode) console.log('Analysis Code:', part.executableCode.code);  if (part.codeExecutionResult) console.log('Results:', part.codeExecutionResult.output);}
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents:     Analyze this sales data and calculate:    1. Total revenue    2. Average sale price    3. Best-selling month    Data (CSV format):    month,sales,revenue    Jan,150,45000    Feb,200,62000    Mar,175,53000    Apr,220,68000  ,  config: {    tools: [{ codeExecution: {} }]  }});// Model will generate pandas/numpy code to analyze datafor (const part of response.candidates[0].content.parts) {  if (part.text) console.log(part.text);  if (part.executableCode) console.log('Analysis Code:', part.executableCode.code);  if (part.codeExecutionResult) console.log('Results:', part.codeExecutionResult.output);}
```
```
Analyze this sales data and calculate:    1. Total revenue    2. Average sale price    3. Best-selling month    Data (CSV format):    month,sales,revenue    Jan,150,45000    Feb,200,62000    Mar,175,53000    Apr,220,68000
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Create a bar chart showing the distribution of prime numbers under 100 by their last digit. Generate the chart and describe the pattern.',  config: {    tools: [{ codeExecution: {} }]  }});// Model generates matplotlib code, executes it, and describes resultsfor (const part of response.candidates[0].content.parts) {  if (part.text) console.log(part.text);  if (part.executableCode) console.log('Chart Code:', part.executableCode.code);  if (part.codeExecutionResult) {    // Note: Chart image data would be in output    console.log('Execution completed');  }}
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Create a bar chart showing the distribution of prime numbers under 100 by their last digit. Generate the chart and describe the pattern.',  config: {    tools: [{ codeExecution: {} }]  }});// Model generates matplotlib code, executes it, and describes resultsfor (const part of response.candidates[0].content.parts) {  if (part.text) console.log(part.text);  if (part.executableCode) console.log('Chart Code:', part.executableCode.code);  if (part.codeExecutionResult) {    // Note: Chart image data would be in output    console.log('Execution completed');  }}
```
```
{  candidates: [    {      content: {        parts: [          { text: "I'll calculate that for you." },          {            executableCode: {              language: "PYTHON",              code: "def is_prime(n):\n  if n <= 1:\n    return False\n  ..."            }          },          {            codeExecutionResult: {              outcome: "OUTCOME_OK", // or "OUTCOME_FAILED"              output: "5117\n"            }          },          { text: "The sum of the first 50 prime numbers is 5117." }        ]      }    }  ]}
```
```
{  candidates: [    {      content: {        parts: [          { text: "I'll calculate that for you." },          {            executableCode: {              language: "PYTHON",              code: "def is_prime(n):\n  if n <= 1:\n    return False\n  ..."            }          },          {            codeExecutionResult: {              outcome: "OUTCOME_OK", // or "OUTCOME_FAILED"              output: "5117\n"            }          },          { text: "The sum of the first 50 prime numbers is 5117." }        ]      }    }  ]}
```
```
for (const part of response.candidates[0].content.parts) {  if (part.codeExecutionResult) {    if (part.codeExecutionResult.outcome === 'OUTCOME_FAILED') {      console.error('Code execution failed:', part.codeExecutionResult.output);    } else {      console.log('Success:', part.codeExecutionResult.output);    }  }}
```
```
for (const part of response.candidates[0].content.parts) {  if (part.codeExecutionResult) {    if (part.codeExecutionResult.outcome === 'OUTCOME_FAILED') {      console.error('Code execution failed:', part.codeExecutionResult.output);    } else {      console.log('Success:', part.codeExecutionResult.output);    }  }}
```
```
outcome
```
```
googleSearch
```
```
const groundingTool = {  googleSearch: {}};
```
```
const groundingTool = {  googleSearch: {}};
```
```
const fileSearchTool = {  fileSearch: {    fileSearchStoreId: 'store-id-here' // Created via FileSearchStore APIs  }};
```
```
const fileSearchTool = {  fileSearch: {    fileSearchStoreId: 'store-id-here' // Created via FileSearchStore APIs  }};
```
```
googleSearchRetrieval
```
```
const retrievalTool = {  googleSearchRetrieval: {    dynamicRetrievalConfig: {      mode: 'MODE_DYNAMIC',      dynamicThreshold: 0.7 // Only search if confidence < 70%    }  }};
```
```
const retrievalTool = {  googleSearchRetrieval: {    dynamicRetrievalConfig: {      mode: 'MODE_DYNAMIC',      dynamicThreshold: 0.7 // Only search if confidence < 70%    }  }};
```
```
import { GoogleGenAI } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Who won the euro 2024?',  config: {    tools: [{ googleSearch: {} }]  }});console.log(response.text);// Check if grounding was usedif (response.candidates[0].groundingMetadata) {  console.log('Search was performed!');  console.log('Sources:', response.candidates[0].groundingMetadata);}
```
```
import { GoogleGenAI } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Who won the euro 2024?',  config: {    tools: [{ googleSearch: {} }]  }});console.log(response.text);// Check if grounding was usedif (response.candidates[0].groundingMetadata) {  console.log('Search was performed!');  console.log('Sources:', response.candidates[0].groundingMetadata);}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        { parts: [{ text: 'Who won the euro 2024?' }] }      ],      tools: [        { google_search: {} }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);if (data.candidates[0].groundingMetadata) {  console.log('Grounding metadata:', data.candidates[0].groundingMetadata);}
```
```
const response = await fetch(  https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent,  {    method: 'POST',    headers: {      'Content-Type': 'application/json',      'x-goog-api-key': env.GEMINI_API_KEY,    },    body: JSON.stringify({      contents: [        { parts: [{ text: 'Who won the euro 2024?' }] }      ],      tools: [        { google_search: {} }      ]    }),  });const data = await response.json();console.log(data.candidates[0].content.parts[0].text);if (data.candidates[0].groundingMetadata) {  console.log('Grounding metadata:', data.candidates[0].groundingMetadata);}
```
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```
```
import { GoogleGenAI, DynamicRetrievalConfigMode } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Who won the euro 2024?',  config: {    tools: [      {        googleSearchRetrieval: {          dynamicRetrievalConfig: {            mode: DynamicRetrievalConfigMode.MODE_DYNAMIC,            dynamicThreshold: 0.7 // Search only if confidence < 70%          }        }      }    ]  }});console.log(response.text);if (!response.candidates[0].groundingMetadata) {  console.log('Model answered from its own knowledge (high confidence)');}
```
```
import { GoogleGenAI, DynamicRetrievalConfigMode } from '@google/genai';const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Who won the euro 2024?',  config: {    tools: [      {        googleSearchRetrieval: {          dynamicRetrievalConfig: {            mode: DynamicRetrievalConfigMode.MODE_DYNAMIC,            dynamicThreshold: 0.7 // Search only if confidence < 70%          }        }      }    ]  }});console.log(response.text);if (!response.candidates[0].groundingMetadata) {  console.log('Model answered from its own knowledge (high confidence)');}
```
```
{  groundingMetadata: {    searchQueries: [      { text: "euro 2024 winner" }    ],    webPages: [      {        url: "https://example.com/euro-2024-results",        title: "UEFA Euro 2024 Final Results",        snippet: "Spain won UEFA Euro 2024..."      }    ],    citations: [      {        startIndex: 42,        endIndex: 47,        uri: "https://example.com/euro-2024-results"      }    ],    retrievalQueries: [      {        query: "who won euro 2024 final"      }    ]  }}
```
```
{  groundingMetadata: {    searchQueries: [      { text: "euro 2024 winner" }    ],    webPages: [      {        url: "https://example.com/euro-2024-results",        title: "UEFA Euro 2024 Final Results",        snippet: "Spain won UEFA Euro 2024..."      }    ],    citations: [      {        startIndex: 42,        endIndex: 47,        uri: "https://example.com/euro-2024-results"      }    ],    retrievalQueries: [      {        query: "who won euro 2024 final"      }    ]  }}
```
```
const chat = await ai.chats.create({  model: 'gemini-2.5-flash',  config: {    tools: [{ googleSearch: {} }]  }});let response = await chat.sendMessage('What are the latest developments in quantum computing?');console.log(response.text);// Check grounding sourcesif (response.candidates[0].groundingMetadata) {  const sources = response.candidates[0].groundingMetadata.webPages || [];  console.log(Sources used: ${sources.length});  sources.forEach(source => {    console.log(- ${source.title}: ${source.url});  });}// Follow-up still has grounding enabledresponse = await chat.sendMessage('Which company made the biggest breakthrough?');console.log(response.text);
```
```
const chat = await ai.chats.create({  model: 'gemini-2.5-flash',  config: {    tools: [{ googleSearch: {} }]  }});let response = await chat.sendMessage('What are the latest developments in quantum computing?');console.log(response.text);// Check grounding sourcesif (response.candidates[0].groundingMetadata) {  const sources = response.candidates[0].groundingMetadata.webPages || [];  console.log(Sources used: ${sources.length});  sources.forEach(source => {    console.log(- ${source.title}: ${source.url});  });}// Follow-up still has grounding enabledresponse = await chat.sendMessage('Which company made the biggest breakthrough?');console.log(response.text);
```
```
Sources used: ${sources.length}
```
```
- ${source.title}: ${source.url}
```
```
const weatherFunction = {  name: 'get_current_weather',  description: 'Get current weather for a location',  parametersJsonSchema: {    type: 'object',    properties: {      location: { type: 'string', description: 'City name' }    },    required: ['location']  }};const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is the weather like in the city that won Euro 2024?',  config: {    tools: [      { googleSearch: {} },      { functionDeclarations: [weatherFunction] }    ]  }});// Model will:// 1. Use Google Search to find Euro 2024 winner// 2. Call get_current_weather function with the city// 3. Combine both results in response
```
```
const weatherFunction = {  name: 'get_current_weather',  description: 'Get current weather for a location',  parametersJsonSchema: {    type: 'object',    properties: {      location: { type: 'string', description: 'City name' }    },    required: ['location']  }};const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is the weather like in the city that won Euro 2024?',  config: {    tools: [      { googleSearch: {} },      { functionDeclarations: [weatherFunction] }    ]  }});// Model will:// 1. Use Google Search to find Euro 2024 winner// 2. Call get_current_weather function with the city// 3. Combine both results in response
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is 2+2?', // Model knows this without search  config: {    tools: [{ googleSearch: {} }]  }});if (!response.candidates[0].groundingMetadata) {  console.log('Model answered from its own knowledge (no search needed)');} else {  console.log('Search was performed');}
```
```
const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'What is 2+2?', // Model knows this without search  config: {    tools: [{ googleSearch: {} }]  }});if (!response.candidates[0].groundingMetadata) {  console.log('Model answered from its own knowledge (no search needed)');} else {  console.log('Search was performed');}
```
```
dynamicThreshold
```
```
googleSearch
```
```
googleSearchRetrieval
```
```
dynamicThreshold
```
```
groundingMetadata
```
```
TextDecoder
```
```
{stream: true}
```
```
// The SDK already fixes this, but if implementing custom streaming:const decoder = new TextDecoder();const { value } = await reader.read();const text = decoder.decode(value, { stream: true }); // ← stream: true required
```
```
// The SDK already fixes this, but if implementing custom streaming:const decoder = new TextDecoder();const { value } = await reader.read();const text = decoder.decode(value, { stream: true }); // ← stream: true required
```
```
method
```
```
safetySettings
```
```
// ❌ WRONG - Fails with Gemini Developer API:config: {  safetySettings: [{    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,    method: HarmBlockMethod.SEVERITY // Not supported!  }]}// ✅ CORRECT - Omit 'method' for Gemini Developer API:config: {  safetySettings: [{    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE    // No 'method' field  }]}
```
```
// ❌ WRONG - Fails with Gemini Developer API:config: {  safetySettings: [{    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,    method: HarmBlockMethod.SEVERITY // Not supported!  }]}// ✅ CORRECT - Omit 'method' for Gemini Developer API:config: {  safetySettings: [{    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE    // No 'method' field  }]}
```
```
method
```
```
safetyRatings
```
```
gemini-2.5-flash
```
```
gemini-2.0-flash
```
```
promptFeedback
```
```
safetyRatings
```
```
// Check BOTH promptFeedback AND empty response:if (response.candidates[0].finishReason === 'SAFETY' ||    !response.text || response.text.trim() === '') {  console.log('Content blocked or refused');}// Be aware: Different models have different thresholds// gemini-2.5-flash: Lower threshold (stricter blocking)// gemini-2.0-flash: Higher threshold (more permissive)
```
```
// Check BOTH promptFeedback AND empty response:if (response.candidates[0].finishReason === 'SAFETY' ||    !response.text || response.text.trim() === '') {  console.log('Content blocked or refused');}// Be aware: Different models have different thresholds// gemini-2.5-flash: Lower threshold (stricter blocking)// gemini-2.0-flash: Higher threshold (more permissive)
```
```
FunctionCallingConfigMode.ANY
```
```
CallableTool
```
```
// ❌ WRONG - Loops forever:config: {  toolConfig: {    functionCallingConfig: {      mode: FunctionCallingConfigMode.ANY // Forces tool calls forever    }  }}// ✅ CORRECT - Use AUTO mode (model decides):config: {  toolConfig: {    functionCallingConfig: {      mode: FunctionCallingConfigMode.AUTO // Model can choose to answer directly    }  }}// Or use manual function calling (check for functionCall, execute, send back)
```
```
// ❌ WRONG - Loops forever:config: {  toolConfig: {    functionCallingConfig: {      mode: FunctionCallingConfigMode.ANY // Forces tool calls forever    }  }}// ✅ CORRECT - Use AUTO mode (model decides):config: {  toolConfig: {    functionCallingConfig: {      mode: FunctionCallingConfigMode.AUTO // Model can choose to answer directly    }  }}// Or use manual function calling (check for functionCall, execute, send back)
```
```
CallableTool
```
```
JSON.parse
```
```
responseMimeType: "application/json"
```
```
\\a
```
```
\a
```
```
// Avoid using backslashes in JSON schema keys// Or manually post-process if required:let jsonText = response.text;// Add custom escaping logic if needed
```
```
// Avoid using backslashes in JSON schema keys// Or manually post-process if required:let jsonText = response.text;// Add custom escaping logic if needed
```
```
ApiError: {"error":{"code":400,"message":"The document has no pages.","status":"INVALID_ARGUMENT"}}
```
```
fileData.fileUri
```
```
// ❌ WRONG - Fails with large PDFs from S3:contents: [{  parts: [{    fileData: {      fileUri: 'https://bucket.s3.region.amazonaws.com/file.pdf?X-Amz-Algorithm=...'    }  }]}]// ✅ CORRECT - Fetch and encode to base64:const pdfResponse = await fetch(signedUrl);const pdfBuffer = await pdfResponse.arrayBuffer();const base64Pdf = Buffer.from(pdfBuffer).toString('base64');contents: [{  parts: [{    inlineData: {      data: base64Pdf,      mimeType: 'application/pdf'    }  }]}]
```
```
// ❌ WRONG - Fails with large PDFs from S3:contents: [{  parts: [{    fileData: {      fileUri: 'https://bucket.s3.region.amazonaws.com/file.pdf?X-Amz-Algorithm=...'    }  }]}]// ✅ CORRECT - Fetch and encode to base64:const pdfResponse = await fetch(signedUrl);const pdfBuffer = await pdfResponse.arrayBuffer();const base64Pdf = Buffer.from(pdfBuffer).toString('base64');contents: [{  parts: [{    inlineData: {      data: base64Pdf,      mimeType: 'application/pdf'    }  }]}]
```
```
gemini-3-flash-preview
```
```
gemini-3-pro-preview
```
```
// ❌ WRONG - 404 error with Gemini 3:const response = await ai.models.generateContent({  model: 'gemini-3-pro-preview', // 404 error  contents: [{    parts: [      { text: 'Describe this video' },      { fileData: { fileUri: videoFile.uri }}    ]  }]});// ✅ CORRECT - Use Gemini 2.5 for video understanding:const response = await ai.models.generateContent({  model: 'gemini-2.5-flash', // Works  contents: [{    parts: [      { text: 'Describe this video' },      { fileData: { fileUri: videoFile.uri }}    ]  }]});
```
```
// ❌ WRONG - 404 error with Gemini 3:const response = await ai.models.generateContent({  model: 'gemini-3-pro-preview', // 404 error  contents: [{    parts: [      { text: 'Describe this video' },      { fileData: { fileUri: videoFile.uri }}    ]  }]});// ✅ CORRECT - Use Gemini 2.5 for video understanding:const response = await ai.models.generateContent({  model: 'gemini-2.5-flash', // Works  contents: [{    parts: [      { text: 'Describe this video' },      { fileData: { fileUri: videoFile.uri }}    ]  }]});
```
```
// Implement exponential backoff for Batch API:async function batchWithRetry(request, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await ai.batches.create(request);    } catch (error) {      if (error.status === 429 && i < maxRetries - 1) {        const delay = Math.pow(2, i) * 1000;        await new Promise(resolve => setTimeout(resolve, delay));        continue;      }      throw error;    }  }}
```
```
// Implement exponential backoff for Batch API:async function batchWithRetry(request, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await ai.batches.create(request);    } catch (error) {      if (error.status === 429 && i < maxRetries - 1) {        const delay = Math.pow(2, i) * 1000;        await new Promise(resolve => setTimeout(resolve, delay));        continue;      }      throw error;    }  }}
```
```
// ❌ WRONG - 404 error:const cache = await ai.caches.create({  model: 'gemini-2.5-flash', // Not supported  config: { /* ... */ }});// ✅ CORRECT - Use Gemini 1.5 with explicit version:const cache = await ai.caches.create({  model: 'gemini-1.5-flash-001', // Explicit version required  config: { /* ... */ }});
```
```
// ❌ WRONG - 404 error:const cache = await ai.caches.create({  model: 'gemini-2.5-flash', // Not supported  config: { /* ... */ }});// ✅ CORRECT - Use Gemini 1.5 with explicit version:const cache = await ai.caches.create({  model: 'gemini-1.5-flash-001', // Explicit version required  config: { /* ... */ }});
```
```
SyntaxError: Unexpected token '
```
```
when parsing JSON responses**Source**: [GitHub Issue #976](https://github.com/googleapis/js-genai/issues/976)**Why It Happens**: When using
```
```
, the response occasionally includes markdown code fence backticks wrapping the JSON (
```
```

```
```
json\n{...}\n
```
```

```
```
), breaking
```
```
.**Prevention**:// Strip markdown code fences before parsing:let jsonText = response.text.trim();if (jsonText.startsWith('json')) {  jsonText = jsonText.replace(/^
```
```
// Strip markdown code fences before parsing:let jsonText = response.text.trim();if (jsonText.startsWith('
```
```
// Strip markdown code fences before parsing:let jsonText = response.text.trim();if (jsonText.startsWith('
```
```
json\n/, '').replace(/\n
```
```
$/, '');} else if (jsonText.startsWith('
```
```
')) {  jsonText = jsonText.replace(/^
```
```
\n/, '').replace(/\n
```
```
$/, '');}const data = JSON.parse(jsonText);**Affected**: All models when using structured output with responseMimeType: "application/json"**Status**: Known intermittent issue, workaround required---### Issue #11: Gemini 3 Temperature Below 1.0 Causes Looping/Degraded Reasoning**Error**: Infinite loops or degraded reasoning quality on complex tasks**Source**: [Official Troubleshooting Docs](https://ai.google.dev/gemini-api/docs/troubleshooting)**Why It Happens**: Gemini 3 models are optimized for temperature 1.0. Lowering temperature below 1.0 may cause looping behavior or degraded performance on complex mathematical/reasoning tasks.**Prevention**:typescript// ❌ WRONG - May cause issues with Gemini 3:const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Solve this complex math problem: ...',  config: {    temperature: 0.3 // May cause looping/degradation  }});// ✅ CORRECT - Keep default temperature:const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Solve this complex math problem: ...',  config: {    temperature: 1.0 // Recommended for Gemini 3  }});// Or omit temperature config entirely (uses default 1.0)**Affected**: Gemini 3 series models**Status**: Official recommendation, keep temperature at 1.0---### Issue #12: Massive Rate Limit Reductions in December 2025 (Free Tier)**Error**: Sudden 429 RESOURCE_EXHAUSTED errors after December 6, 2025**Source**: [LaoZhang AI Blog](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | [HowToGeek](https://www.howtogeek.com/gemini-slashed-free-api-limits-what-to-use-instead/)**Why It Happens**: Google reduced free tier rate limits by 80-90% without wide announcement, catching developers off guard.**Changes**:- Gemini 2.5 Pro: 80% reduction in daily requests (100 RPD, was ~250)- Gemini 2.5 Flash: ~20 requests per day (was ~250) - 90% reduction- Free tier now impractical for production**Prevention**:typescript// For production, upgrade to paid tier:// https://ai.google.dev/pricing// For free tier, implement aggressive rate limiting:const rateLimiter = {  requests: 0,  resetTime: Date.now() + 24 * 60 * 60 * 1000,  async checkLimit() {    if (Date.now() > this.resetTime) {      this.requests = 0;      this.resetTime = Date.now() + 24 * 60 * 60 * 1000;    }    if (this.requests >= 20) {      throw new Error('Daily limit reached');    }    this.requests++;  }};await rateLimiter.checkLimit();const response = await ai.models.generateContent({/* ... */});**Affected**: Free tier users (December 6, 2025 onwards)**Status**: Permanent change, upgrade to paid tier for production---### Issue #13: Preview Models Have No SLAs and Can Change Without Warning**Error**: Unexpected behavior changes, deprecation, or service interruptions**Source**: [Arsturn Blog](https://www.arsturn.com/blog/gemini-2-5-pro-api-unreliable-slow-deep-dive) | Official docs**Why It Happens**: Preview and experimental models (e.g., gemini-2.5-flash-preview, gemini-3-pro-preview) have no service level agreements (SLAs) and are inherently unstable. Google can change or deprecate them with little notice.**Prevention**:typescript// ❌ WRONG - Using preview models in production:const response = await ai.models.generateContent({  model: 'gemini-2.5-flash-preview', // No SLA!  contents: 'Production traffic'});// ✅ CORRECT - Use GA (generally available) models:const response = await ai.models.generateContent({  model: 'gemini-2.5-flash', // Stable, with SLA  contents: 'Production traffic'});// Or use specific version numbers for stability:const response = await ai.models.generateContent({  model: 'gemini-2.5-flash-001', // Pinned version  contents: 'Production traffic'});**Affected**: Users of preview/experimental models in production**Status**: Known limitation, use GA models for production---### Issue #14: API Key Leakage Auto-Blocking (Security Enhancement)**Error**: "Invalid API key" after accidentally committing key to GitHub**Source**: [AI Free API Blog](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | Official troubleshooting**Why It Happens**: Google proactively scans for publicly exposed API keys (e.g., in GitHub repos) and automatically blocks them from accessing the Gemini API as a security measure.**Prevention**:typescript// Best practices:// 1. Use .env files (never commit)// 2. Use environment variables in production// 3. Rotate keys if exposed// 4. Use .gitignore:// .gitignore.env.env.local*.key**Affected**: Users who accidentally commit API keys to public repos**Status**: Security feature, rotate keys if exposed---## Error Handling### Common Errors#### 1. Invalid API Key (401)typescript{  error: {    code: 401,    message: 'API key not valid. Please pass a valid API key.',    status: 'UNAUTHENTICATED'  }}**Solution**: Verify GEMINI_API_KEY environment variable is set correctly.#### 2. Rate Limit Exceeded (429)typescript{  error: {    code: 429,    message: 'Resource has been exhausted (e.g. check quota).',    status: 'RESOURCE_EXHAUSTED'  }}**Solution**: Implement exponential backoff retry strategy.#### 3. Model Not Found (404)typescript{  error: {    code: 404,    message: 'models/gemini-3.0-flash is not found',    status: 'NOT_FOUND'  }}**Solution**: Use correct model names: gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite#### 4. Context Length Exceeded (400)typescript{  error: {    code: 400,    message: 'Request payload size exceeds the limit',    status: 'INVALID_ARGUMENT'  }}**Solution**: Reduce input size. Gemini 2.5 models support 1,048,576 input tokens max.### Exponential Backoff Patterntypescriptasync function generateWithRetry(request, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await ai.models.generateContent(request);    } catch (error) {      if (error.status === 429 && i < maxRetries - 1) {        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s        await new Promise(resolve => setTimeout(resolve, delay));        continue;      }      throw error;    }  }}---## Rate Limits### ⚠️ December 2025 Update - Major Free Tier Reductions**CRITICAL**: Google reduced free tier limits by 80-90% on December 6-7, 2025 without wide announcement. Free tier is now primarily for prototyping only.**Sources**: [LaoZhang AI](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | [HowToGeek](https://www.howtogeek.com/gemini-slashed-free-api-limits-what-to-use-instead/)### Free Tier (Gemini API) - Current LimitsRate limits vary by model:**Gemini 2.5 Pro**:- Requests per minute: 5 RPM- Tokens per minute: 125,000 TPM- Requests per day: **100 RPD** (was ~250 before Dec 2025) - **80% reduction****Gemini 2.5 Flash**:- Requests per minute: 10 RPM- Tokens per minute: 250,000 TPM- Requests per day: **~20 RPD** (was ~250 before Dec 2025) - **90% reduction****Gemini 2.5 Flash-Lite**:- Requests per minute: 15 RPM- Tokens per minute: 250,000 TPM- Requests per day: 1,000 RPD (unchanged)### Paid Tier (Tier 1)Requires billing account linked to your Google Cloud project.**Gemini 2.5 Pro**:- Requests per minute: 150 RPM- Tokens per minute: 2,000,000 TPM- Requests per day: 10,000 RPD**Gemini 2.5 Flash**:- Requests per minute: 1,000 RPM- Tokens per minute: 1,000,000 TPM- Requests per day: 10,000 RPD**Gemini 2.5 Flash-Lite**:- Requests per minute: 4,000 RPM- Tokens per minute: 4,000,000 TPM- Requests per day: Not specified### Higher Tiers (Tier 2 & 3)**Tier 2** (requires $250+ spending and 30-day wait):- Even higher limits available**Tier 3** (requires $1,000+ spending and 30-day wait):- Maximum limits available**Tips:**- Implement rate limit handling with exponential backoff- Use batch processing for high-volume tasks- Monitor usage in Google AI Studio- Choose the right model based on your rate limit needs- Official rate limits: https://ai.google.dev/gemini-api/docs/rate-limits---## SDK Migration Guide### From @google/generative-ai to @google/genai#### 1. Update Packagebash# Remove deprecated SDKnpm uninstall @google/generative-ai# Install current SDKnpm install @google/genai@1.27.0#### 2. Update Imports**Old (DEPRECATED):**typescriptimport { GoogleGenerativeAI } from '@google/generative-ai';const genAI = new GoogleGenerativeAI(apiKey);const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });**New (CURRENT):**typescriptimport { GoogleGenAI } from '@google/genai';const ai = new GoogleGenAI({ apiKey });// Use ai.models.generateContent() directly#### 3. Update API Calls**Old:**typescriptconst result = await model.generateContent(prompt);const response = await result.response;const text = response.text();**New:**typescriptconst response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: prompt});const text = response.text;#### 4. Update Streaming**Old:**typescriptconst result = await model.generateContentStream(prompt);for await (const chunk of result.stream) {  console.log(chunk.text());}**New:**typescriptconst response = await ai.models.generateContentStream({  model: 'gemini-2.5-flash',  contents: prompt});for await (const chunk of response) {  console.log(chunk.text);}#### 5. Update Chat**Old:**typescriptconst chat = model.startChat();const result = await chat.sendMessage(message);const response = await result.response;**New:**typescriptconst chat = await ai.models.createChat({ model: 'gemini-2.5-flash' });const response = await chat.sendMessage(message);// response.text is directly available---## Production Best Practices### 1. Always Do✅ **Use @google/genai** (NOT @google/generative-ai)✅ **Set maxOutputTokens** to prevent excessive generation✅ **Implement rate limit handling** with exponential backoff✅ **Use environment variables** for API keys (never hardcode)✅ **Validate inputs** before sending to API (save costs)✅ **Use streaming** for better UX on long responses✅ **Choose the right model** based on your needs (Pro for complex reasoning, Flash for balance, Flash-Lite for speed)✅ **Handle errors gracefully** with try-catch✅ **Monitor token usage** for cost control✅ **Use correct model names**: gemini-2.5-pro/flash/flash-lite### 2. Never Do❌ **Never use @google/generative-ai** (deprecated!)❌ **Never hardcode API keys** in code❌ **Never claim 2M context** for Gemini 2.5 (it's 1,048,576 input tokens)❌ **Never expose API keys** in client-side code❌ **Never skip error handling** (always try-catch)❌ **Never use generic rate limits** (each model has different limits - check official docs)❌ **Never send PII** without user consent❌ **Never trust user input** without validation❌ **Never ignore rate limits** (will get 429 errors)❌ **Never use old model names** like gemini-1.5-pro (use 2.5 models)### 3. Security- **API Key Storage**: Use environment variables or secret managers- **Server-Side Only**: Never expose API keys in browser JavaScript- **Input Validation**: Sanitize all user inputs before API calls- **Rate Limiting**: Implement your own rate limits to prevent abuse- **Error Messages**: Don't expose API keys or sensitive data in error logs### 4. Cost Optimization- **Choose Right Model**: Use Flash for most tasks, Pro only when needed- **Set Token Limits**: Use maxOutputTokens to control costs- **Batch Requests**: Process multiple items efficiently- **Cache Results**: Store responses when appropriate- **Monitor Usage**: Track token consumption in Google Cloud Console### 5. Performance- **Use Streaming**: Better perceived latency for long responses- **Parallel Requests**: Use Promise.all() for independent calls- **Edge Deployment**: Deploy to Cloudflare Workers for low latency- **Connection Pooling**: Reuse HTTP connections when possible---## Quick Reference### Installationbashnpm install @google/genai@1.34.0### Environmentbashexport GEMINI_API_KEY="..."### Models (2025-2026)- gemini-3-flash (1,048,576 in / 65,536 out) - **NEW** Best speed+quality balance- gemini-2.5-pro (1,048,576 in / 65,536 out) - Best for complex reasoning- gemini-2.5-flash (1,048,576 in / 65,536 out) - Proven price-performance balance- gemini-2.5-flash-lite (1,048,576 in / 65,536 out) - Fastest, most cost-effective### Basic Generationtypescriptconst response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Your prompt here'});console.log(response.text);### Streamingtypescriptconst response = await ai.models.generateContentStream({...});for await (const chunk of response) {  console.log(chunk.text);}### Multimodaltypescriptcontents: [  {    parts: [      { text: 'What is this?' },      { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }    ]  }]### Function Callingtypescriptconfig: {  tools: [{ functionDeclarations: [...] }]}---**Last Updated**: 2026-01-21**Production Validated**: All features tested with @google/genai@1.35.0**Phase**: 2 Complete ✅ (All Core + Advanced Features)**Known Issues**: 14 documented errors prevented**Changes**: Added Known Issues Prevention section with 14 community-researched findings from post-training-cutoff period (May 2025-Jan 2026)------paths: "**/*.ts", "**/*.tsx", "**/*gemini*.ts", package.json---# Google Gemini API CorrectionsClaude's training may reference the deprecated SDK. This project uses **@google/genai v1.30+**.## CRITICAL: SDK Migrationtypescript/* ❌ DEPRECATED - Sunset November 30, 2025 */import { GoogleGenerativeAI } from '@google/generative-ai'const genAI = new GoogleGenerativeAI(apiKey)const model = genAI.getGenerativeModel({ model: 'gemini-pro' })/* ✅ CURRENT SDK */import { GoogleGenAI } from '@google/genai'const ai = new GoogleGenAI({ apiKey })const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Hello',})## Context Window Correctiontypescript/* ❌ Common misconception */// "Gemini 2.5 has 2M token context"/* ✅ Actual limits */// Gemini 2.5 Pro/Flash: 1,048,576 input tokens (NOT 2M!)// Gemini 1.5 Pro had 2M - this was reduced in 2.5// Output limit: 65,536 tokens (all 2.5 models)## Thinking Is Always Enabled (2.5)typescript/* ❌ Trying to disable thinking */const response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Hello',  thinkingConfig: { enabled: false }, // Not possible!})/* ✅ Thinking is always on for 2.5 models */// Can only adjust budget/level, not disableconst response = await ai.models.generateContent({  model: 'gemini-2.5-flash',  contents: 'Hello',  thinkingConfig: { thinkingBudget: 1024 }, // Adjust, not disable})## Context Caching Requires Explicit Versiontypescript/* ❌ Will fail for caching */const cache = await ai.caches.create({  model: 'gemini-2.5-flash', // Generic name  contents: [...],})/* ✅ Use explicit version for caching */const cache = await ai.caches.create({  model: 'gemini-2.5-flash-001', // Explicit version required  contents: [...],})## Current Model Names (2025)typescript/* ❌ Old/incorrect names */'gemini-pro'           // Old'gemini-1.5-pro'       // Use 2.5 instead/* ✅ Current models */'gemini-3-pro-preview' // Latest (Nov 2025 preview)'gemini-2.5-pro'       // Stable'gemini-2.5-flash'     // Fast'gemini-2.5-flash-lite' // Lightweight
```
```
**Affected**: All models when using structured output with responseMimeType: "application/json"**Status**: Known intermittent issue, workaround required---### Issue #11: Gemini 3 Temperature Below 1.0 Causes Looping/Degraded Reasoning**Error**: Infinite loops or degraded reasoning quality on complex tasks**Source**: [Official Troubleshooting Docs](https://ai.google.dev/gemini-api/docs/troubleshooting)**Why It Happens**: Gemini 3 models are optimized for temperature 1.0. Lowering temperature below 1.0 may cause looping behavior or degraded performance on complex mathematical/reasoning tasks.**Prevention**:
```
```
**Affected**: All models when using structured output with
```
```
**Status**: Known intermittent issue, workaround required---### Issue #11: Gemini 3 Temperature Below 1.0 Causes Looping/Degraded Reasoning**Error**: Infinite loops or degraded reasoning quality on complex tasks**Source**: [Official Troubleshooting Docs](https://ai.google.dev/gemini-api/docs/troubleshooting)**Why It Happens**: Gemini 3 models are optimized for temperature 1.0. Lowering temperature below 1.0 may cause looping behavior or degraded performance on complex mathematical/reasoning tasks.**Prevention**:
```
```
**Affected**: Gemini 3 series models**Status**: Official recommendation, keep temperature at 1.0---### Issue #12: Massive Rate Limit Reductions in December 2025 (Free Tier)**Error**: Sudden 429 RESOURCE_EXHAUSTED errors after December 6, 2025**Source**: [LaoZhang AI Blog](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | [HowToGeek](https://www.howtogeek.com/gemini-slashed-free-api-limits-what-to-use-instead/)**Why It Happens**: Google reduced free tier rate limits by 80-90% without wide announcement, catching developers off guard.**Changes**:- Gemini 2.5 Pro: 80% reduction in daily requests (100 RPD, was ~250)- Gemini 2.5 Flash: ~20 requests per day (was ~250) - 90% reduction- Free tier now impractical for production**Prevention**:
```
```
**Affected**: Gemini 3 series models**Status**: Official recommendation, keep temperature at 1.0---### Issue #12: Massive Rate Limit Reductions in December 2025 (Free Tier)**Error**: Sudden 429 RESOURCE_EXHAUSTED errors after December 6, 2025**Source**: [LaoZhang AI Blog](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | [HowToGeek](https://www.howtogeek.com/gemini-slashed-free-api-limits-what-to-use-instead/)**Why It Happens**: Google reduced free tier rate limits by 80-90% without wide announcement, catching developers off guard.**Changes**:- Gemini 2.5 Pro: 80% reduction in daily requests (100 RPD, was ~250)- Gemini 2.5 Flash: ~20 requests per day (was ~250) - 90% reduction- Free tier now impractical for production**Prevention**:
```
```
**Affected**: Free tier users (December 6, 2025 onwards)**Status**: Permanent change, upgrade to paid tier for production---### Issue #13: Preview Models Have No SLAs and Can Change Without Warning**Error**: Unexpected behavior changes, deprecation, or service interruptions**Source**: [Arsturn Blog](https://www.arsturn.com/blog/gemini-2-5-pro-api-unreliable-slow-deep-dive) | Official docs**Why It Happens**: Preview and experimental models (e.g., gemini-2.5-flash-preview, gemini-3-pro-preview) have no service level agreements (SLAs) and are inherently unstable. Google can change or deprecate them with little notice.**Prevention**:
```
```
**Affected**: Free tier users (December 6, 2025 onwards)**Status**: Permanent change, upgrade to paid tier for production---### Issue #13: Preview Models Have No SLAs and Can Change Without Warning**Error**: Unexpected behavior changes, deprecation, or service interruptions**Source**: [Arsturn Blog](https://www.arsturn.com/blog/gemini-2-5-pro-api-unreliable-slow-deep-dive) | Official docs**Why It Happens**: Preview and experimental models (e.g.,
```
```
,
```
```
) have no service level agreements (SLAs) and are inherently unstable. Google can change or deprecate them with little notice.**Prevention**:
```
```
**Affected**: Users of preview/experimental models in production**Status**: Known limitation, use GA models for production---### Issue #14: API Key Leakage Auto-Blocking (Security Enhancement)**Error**: "Invalid API key" after accidentally committing key to GitHub**Source**: [AI Free API Blog](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | Official troubleshooting**Why It Happens**: Google proactively scans for publicly exposed API keys (e.g., in GitHub repos) and automatically blocks them from accessing the Gemini API as a security measure.**Prevention**:
```
```
**Affected**: Users of preview/experimental models in production**Status**: Known limitation, use GA models for production---### Issue #14: API Key Leakage Auto-Blocking (Security Enhancement)**Error**: "Invalid API key" after accidentally committing key to GitHub**Source**: [AI Free API Blog](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | Official troubleshooting**Why It Happens**: Google proactively scans for publicly exposed API keys (e.g., in GitHub repos) and automatically blocks them from accessing the Gemini API as a security measure.**Prevention**:
```
```
**Affected**: Users who accidentally commit API keys to public repos**Status**: Security feature, rotate keys if exposed---## Error Handling### Common Errors#### 1. Invalid API Key (401)
```
```
**Affected**: Users who accidentally commit API keys to public repos**Status**: Security feature, rotate keys if exposed---## Error Handling### Common Errors#### 1. Invalid API Key (401)
```
```
**Solution**: Verify GEMINI_API_KEY environment variable is set correctly.#### 2. Rate Limit Exceeded (429)
```
```
**Solution**: Verify
```
```
environment variable is set correctly.#### 2. Rate Limit Exceeded (429)
```
```
**Solution**: Implement exponential backoff retry strategy.#### 3. Model Not Found (404)
```
```
**Solution**: Implement exponential backoff retry strategy.#### 3. Model Not Found (404)
```
```
**Solution**: Use correct model names: gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite#### 4. Context Length Exceeded (400)
```
```
**Solution**: Use correct model names:
```
```
,
```
```
,
```
```
#### 4. Context Length Exceeded (400)
```
```
**Solution**: Reduce input size. Gemini 2.5 models support 1,048,576 input tokens max.### Exponential Backoff Pattern
```
```
**Solution**: Reduce input size. Gemini 2.5 models support 1,048,576 input tokens max.### Exponential Backoff Pattern
```
```
---## Rate Limits### ⚠️ December 2025 Update - Major Free Tier Reductions**CRITICAL**: Google reduced free tier limits by 80-90% on December 6-7, 2025 without wide announcement. Free tier is now primarily for prototyping only.**Sources**: [LaoZhang AI](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | [HowToGeek](https://www.howtogeek.com/gemini-slashed-free-api-limits-what-to-use-instead/)### Free Tier (Gemini API) - Current LimitsRate limits vary by model:**Gemini 2.5 Pro**:- Requests per minute: 5 RPM- Tokens per minute: 125,000 TPM- Requests per day: **100 RPD** (was ~250 before Dec 2025) - **80% reduction****Gemini 2.5 Flash**:- Requests per minute: 10 RPM- Tokens per minute: 250,000 TPM- Requests per day: **~20 RPD** (was ~250 before Dec 2025) - **90% reduction****Gemini 2.5 Flash-Lite**:- Requests per minute: 15 RPM- Tokens per minute: 250,000 TPM- Requests per day: 1,000 RPD (unchanged)### Paid Tier (Tier 1)Requires billing account linked to your Google Cloud project.**Gemini 2.5 Pro**:- Requests per minute: 150 RPM- Tokens per minute: 2,000,000 TPM- Requests per day: 10,000 RPD**Gemini 2.5 Flash**:- Requests per minute: 1,000 RPM- Tokens per minute: 1,000,000 TPM- Requests per day: 10,000 RPD**Gemini 2.5 Flash-Lite**:- Requests per minute: 4,000 RPM- Tokens per minute: 4,000,000 TPM- Requests per day: Not specified### Higher Tiers (Tier 2 & 3)**Tier 2** (requires $250+ spending and 30-day wait):- Even higher limits available**Tier 3** (requires $1,000+ spending and 30-day wait):- Maximum limits available**Tips:**- Implement rate limit handling with exponential backoff- Use batch processing for high-volume tasks- Monitor usage in Google AI Studio- Choose the right model based on your rate limit needs- Official rate limits: https://ai.google.dev/gemini-api/docs/rate-limits---## SDK Migration Guide### From @google/generative-ai to @google/genai#### 1. Update Package
```
```
---## Rate Limits### ⚠️ December 2025 Update - Major Free Tier Reductions**CRITICAL**: Google reduced free tier limits by 80-90% on December 6-7, 2025 without wide announcement. Free tier is now primarily for prototyping only.**Sources**: [LaoZhang AI](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-limit) | [HowToGeek](https://www.howtogeek.com/gemini-slashed-free-api-limits-what-to-use-instead/)### Free Tier (Gemini API) - Current LimitsRate limits vary by model:**Gemini 2.5 Pro**:- Requests per minute: 5 RPM- Tokens per minute: 125,000 TPM- Requests per day: **100 RPD** (was ~250 before Dec 2025) - **80% reduction****Gemini 2.5 Flash**:- Requests per minute: 10 RPM- Tokens per minute: 250,000 TPM- Requests per day: **~20 RPD** (was ~250 before Dec 2025) - **90% reduction****Gemini 2.5 Flash-Lite**:- Requests per minute: 15 RPM- Tokens per minute: 250,000 TPM- Requests per day: 1,000 RPD (unchanged)### Paid Tier (Tier 1)Requires billing account linked to your Google Cloud project.**Gemini 2.5 Pro**:- Requests per minute: 150 RPM- Tokens per minute: 2,000,000 TPM- Requests per day: 10,000 RPD**Gemini 2.5 Flash**:- Requests per minute: 1,000 RPM- Tokens per minute: 1,000,000 TPM- Requests per day: 10,000 RPD**Gemini 2.5 Flash-Lite**:- Requests per minute: 4,000 RPM- Tokens per minute: 4,000,000 TPM- Requests per day: Not specified### Higher Tiers (Tier 2 & 3)**Tier 2** (requires $250+ spending and 30-day wait):- Even higher limits available**Tier 3** (requires $1,000+ spending and 30-day wait):- Maximum limits available**Tips:**- Implement rate limit handling with exponential backoff- Use batch processing for high-volume tasks- Monitor usage in Google AI Studio- Choose the right model based on your rate limit needs- Official rate limits: https://ai.google.dev/gemini-api/docs/rate-limits---## SDK Migration Guide### From @google/generative-ai to @google/genai#### 1. Update Package
```
```
#### 2. Update Imports**Old (DEPRECATED):**
```
```
#### 2. Update Imports**Old (DEPRECATED):**
```
```
**New (CURRENT):**
```
```
**New (CURRENT):**
```
```
#### 3. Update API Calls**Old:**
```
```
#### 3. Update API Calls**Old:**
```
```
**New:**
```
```
**New:**
```
```
#### 4. Update Streaming**Old:**
```
```
#### 4. Update Streaming**Old:**
```
```
**New:**
```
```
**New:**
```
```
#### 5. Update Chat**Old:**
```
```
#### 5. Update Chat**Old:**
```
```
**New:**
```
```
**New:**
```
```
---## Production Best Practices### 1. Always Do✅ **Use @google/genai** (NOT @google/generative-ai)✅ **Set maxOutputTokens** to prevent excessive generation✅ **Implement rate limit handling** with exponential backoff✅ **Use environment variables** for API keys (never hardcode)✅ **Validate inputs** before sending to API (save costs)✅ **Use streaming** for better UX on long responses✅ **Choose the right model** based on your needs (Pro for complex reasoning, Flash for balance, Flash-Lite for speed)✅ **Handle errors gracefully** with try-catch✅ **Monitor token usage** for cost control✅ **Use correct model names**: gemini-2.5-pro/flash/flash-lite### 2. Never Do❌ **Never use @google/generative-ai** (deprecated!)❌ **Never hardcode API keys** in code❌ **Never claim 2M context** for Gemini 2.5 (it's 1,048,576 input tokens)❌ **Never expose API keys** in client-side code❌ **Never skip error handling** (always try-catch)❌ **Never use generic rate limits** (each model has different limits - check official docs)❌ **Never send PII** without user consent❌ **Never trust user input** without validation❌ **Never ignore rate limits** (will get 429 errors)❌ **Never use old model names** like gemini-1.5-pro (use 2.5 models)### 3. Security- **API Key Storage**: Use environment variables or secret managers- **Server-Side Only**: Never expose API keys in browser JavaScript- **Input Validation**: Sanitize all user inputs before API calls- **Rate Limiting**: Implement your own rate limits to prevent abuse- **Error Messages**: Don't expose API keys or sensitive data in error logs### 4. Cost Optimization- **Choose Right Model**: Use Flash for most tasks, Pro only when needed- **Set Token Limits**: Use maxOutputTokens to control costs- **Batch Requests**: Process multiple items efficiently- **Cache Results**: Store responses when appropriate- **Monitor Usage**: Track token consumption in Google Cloud Console### 5. Performance- **Use Streaming**: Better perceived latency for long responses- **Parallel Requests**: Use Promise.all() for independent calls- **Edge Deployment**: Deploy to Cloudflare Workers for low latency- **Connection Pooling**: Reuse HTTP connections when possible---## Quick Reference### Installation
```
```
---## Production Best Practices### 1. Always Do✅ **Use @google/genai** (NOT @google/generative-ai)✅ **Set maxOutputTokens** to prevent excessive generation✅ **Implement rate limit handling** with exponential backoff✅ **Use environment variables** for API keys (never hardcode)✅ **Validate inputs** before sending to API (save costs)✅ **Use streaming** for better UX on long responses✅ **Choose the right model** based on your needs (Pro for complex reasoning, Flash for balance, Flash-Lite for speed)✅ **Handle errors gracefully** with try-catch✅ **Monitor token usage** for cost control✅ **Use correct model names**: gemini-2.5-pro/flash/flash-lite### 2. Never Do❌ **Never use @google/generative-ai** (deprecated!)❌ **Never hardcode API keys** in code❌ **Never claim 2M context** for Gemini 2.5 (it's 1,048,576 input tokens)❌ **Never expose API keys** in client-side code❌ **Never skip error handling** (always try-catch)❌ **Never use generic rate limits** (each model has different limits - check official docs)❌ **Never send PII** without user consent❌ **Never trust user input** without validation❌ **Never ignore rate limits** (will get 429 errors)❌ **Never use old model names** like gemini-1.5-pro (use 2.5 models)### 3. Security- **API Key Storage**: Use environment variables or secret managers- **Server-Side Only**: Never expose API keys in browser JavaScript- **Input Validation**: Sanitize all user inputs before API calls- **Rate Limiting**: Implement your own rate limits to prevent abuse- **Error Messages**: Don't expose API keys or sensitive data in error logs### 4. Cost Optimization- **Choose Right Model**: Use Flash for most tasks, Pro only when needed- **Set Token Limits**: Use maxOutputTokens to control costs- **Batch Requests**: Process multiple items efficiently- **Cache Results**: Store responses when appropriate- **Monitor Usage**: Track token consumption in Google Cloud Console### 5. Performance- **Use Streaming**: Better perceived latency for long responses- **Parallel Requests**: Use Promise.all() for independent calls- **Edge Deployment**: Deploy to Cloudflare Workers for low latency- **Connection Pooling**: Reuse HTTP connections when possible---## Quick Reference### Installation
```
```
### Environment
```
```
### Environment
```
```
### Models (2025-2026)- gemini-3-flash (1,048,576 in / 65,536 out) - **NEW** Best speed+quality balance- gemini-2.5-pro (1,048,576 in / 65,536 out) - Best for complex reasoning- gemini-2.5-flash (1,048,576 in / 65,536 out) - Proven price-performance balance- gemini-2.5-flash-lite (1,048,576 in / 65,536 out) - Fastest, most cost-effective### Basic Generation
```
```
### Models (2025-2026)-
```
```
(1,048,576 in / 65,536 out) - **NEW** Best speed+quality balance-
```
```
(1,048,576 in / 65,536 out) - Best for complex reasoning-
```
```
(1,048,576 in / 65,536 out) - Proven price-performance balance-
```
```
(1,048,576 in / 65,536 out) - Fastest, most cost-effective### Basic Generation
```
```
### Streaming
```
```
### Streaming
```
```
### Multimodal
```
```
### Multimodal
```
```
### Function Calling
```
```
### Function Calling
```
```
---**Last Updated**: 2026-01-21**Production Validated**: All features tested with @google/genai@1.35.0**Phase**: 2 Complete ✅ (All Core + Advanced Features)**Known Issues**: 14 documented errors prevented**Changes**: Added Known Issues Prevention section with 14 community-researched findings from post-training-cutoff period (May 2025-Jan 2026)------paths: "**/*.ts", "**/*.tsx", "**/*gemini*.ts", package.json---# Google Gemini API CorrectionsClaude's training may reference the deprecated SDK. This project uses **@google/genai v1.30+**.## CRITICAL: SDK Migration
```
```
---**Last Updated**: 2026-01-21**Production Validated**: All features tested with @google/genai@1.35.0**Phase**: 2 Complete ✅ (All Core + Advanced Features)**Known Issues**: 14 documented errors prevented**Changes**: Added Known Issues Prevention section with 14 community-researched findings from post-training-cutoff period (May 2025-Jan 2026)------paths: "**/*.ts", "**/*.tsx", "**/*gemini*.ts", package.json---# Google Gemini API CorrectionsClaude's training may reference the deprecated SDK. This project uses **@google/genai v1.30+**.## CRITICAL: SDK Migration
```
```
## Context Window Correction
```
```
## Context Window Correction
```
```
## Thinking Is Always Enabled (2.5)
```
```
## Thinking Is Always Enabled (2.5)
```
```
## Context Caching Requires Explicit Version
```
```
## Context Caching Requires Explicit Version
```
```
## Current Model Names (2025)
```
```
## Current Model Names (2025)
```
```
## Quick Fixes| If Claude suggests... | Use instead... ||----------------------|----------------||
```
```
|
```
```
||
```
```
class |
```
```
class || 2M context window | 1,048,576 tokens (Gemini 2.5) || Disabling thinking | Adjust
```
```
instead ||
```
```
|
```
```
or
```
```
|| Generic model for caching | Explicit version (e.g.,
```
```
) ||
```
```
|
```
```
|## Image Generation Models| Model ID | Codename | Use For ||----------|----------|---------||
```
```
| Nano Banana | Fast, 1024px ||
```
```
| Nano Banana | Fast iteration ||
```
```
| Nano Banana Pro | 4K, complex, text |## NEVER- Never use
```
```
package- Never use
```
```
class- Never use
```
Unlock the full potential of Google Gemini with this comprehensive agent skill, designed for seamless integration into your AI projects. This skill provides a complete guide to interacting with the Gemini API, covering everything from basic text generation and advanced multimodal inputs to sophisticated function calling and real-time grounding with Google Search. Developed with the latest `@google/genai` SDK, it ensures your applications are future-proof and optimized for performance. Whether you're building intelligent chatbots, content generators, or complex automation workflows, this skill equips you with the tools and knowledge to leverage Gemini's capabilities effectively.

# When to Use This Skill
- •Developing AI chatbots that understand and respond using multimodal inputs (text, images, audio).
- •Automating tasks by connecting AI responses to external tools via function calling.
- •Building intelligent search applications that provide real-time, grounded answers with citations.
- •Creating dynamic content generation systems that leverage Gemini's generative capabilities.

# Pro Tips
- 💡Always reference the 'CRITICAL SDK MIGRATION WARNING' to ensure you're using `@google/genai` (not `@google/generative-ai`) for future-proof development.
- 💡Utilize Context Caching (Phase 2) for cost optimization, especially in multi-turn chat scenarios, to reduce redundant API calls and manage TTL effectively.
- 💡Experiment with 'Thinking Mode' configuration and 'Generation Parameters' (temperature, top-p, top-k) to fine-tune Gemini's output for creativity and adherence to specific requirements.

