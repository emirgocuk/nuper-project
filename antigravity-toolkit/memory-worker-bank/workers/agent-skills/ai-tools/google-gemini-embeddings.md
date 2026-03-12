# google-gemini-embeddings
Source: https://antigravity.codes/agent-skills/ai-tools/google-gemini-embeddings

## AI Worker Instructions
When the user requests functionality related to google-gemini-embeddings, follow these guidelines and utilize this context.

## Scraped Content

# google-gemini-embeddings
```
gemini-embedding-001
```
```
npm install @google/genai@^1.37.0
```
```
npm install @google/genai@^1.37.0
```
```
npm install -D typescript@^5.0.0
```
```
npm install -D typescript@^5.0.0
```
```
export GEMINI_API_KEY="your-api-key-here"
```
```
export GEMINI_API_KEY="your-api-key-here"
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'What is the meaning of life?',  config: {    taskType: 'RETRIEVAL_QUERY',    outputDimensionality: 768  }});console.log(response.embedding.values); // [0.012, -0.034, ...]console.log(response.embedding.values.length); // 768
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'What is the meaning of life?',  config: {    taskType: 'RETRIEVAL_QUERY',    outputDimensionality: 768  }});console.log(response.embedding.values); // [0.012, -0.034, ...]console.log(response.embedding.values.length); // 768
```
```
gemini-embedding-001
```
```
gemini-embedding-exp-03-07
```
```
{  embedding: {    values: number[] // Array of floating-point numbers  }}
```
```
{  embedding: {    values: number[] // Array of floating-point numbers  }}
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'The quick brown fox jumps over the lazy dog',  config: {    taskType: 'SEMANTIC_SIMILARITY',    outputDimensionality: 768  }});console.log(response.embedding.values);// [0.00388, -0.00762, 0.01543, ...]
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'The quick brown fox jumps over the lazy dog',  config: {    taskType: 'SEMANTIC_SIMILARITY',    outputDimensionality: 768  }});console.log(response.embedding.values);// [0.00388, -0.00762, 0.01543, ...]
```
```
export default {  async fetch(request: Request, env: Env): Promise<Response> {    const apiKey = env.GEMINI_API_KEY;    const text = "What is the meaning of life?";    const response = await fetch(      'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent',      {        method: 'POST',        headers: {          'x-goog-api-key': apiKey,          'Content-Type': 'application/json'        },        body: JSON.stringify({          content: {            parts: [{ text }]          },          taskType: 'RETRIEVAL_QUERY',          outputDimensionality: 768        })      }    );    const data = await response.json();    // Response format:    // {    //   embedding: {    //     values: [0.012, -0.034, ...]    //   }    // }    return new Response(JSON.stringify(data), {      headers: { 'Content-Type': 'application/json' }    });  }};
```
```
export default {  async fetch(request: Request, env: Env): Promise<Response> {    const apiKey = env.GEMINI_API_KEY;    const text = "What is the meaning of life?";    const response = await fetch(      'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent',      {        method: 'POST',        headers: {          'x-goog-api-key': apiKey,          'Content-Type': 'application/json'        },        body: JSON.stringify({          content: {            parts: [{ text }]          },          taskType: 'RETRIEVAL_QUERY',          outputDimensionality: 768        })      }    );    const data = await response.json();    // Response format:    // {    //   embedding: {    //     values: [0.012, -0.034, ...]    //   }    // }    return new Response(JSON.stringify(data), {      headers: { 'Content-Type': 'application/json' }    });  }};
```
```
interface EmbeddingResponse {  embedding: {    values: number[];  };}const response: EmbeddingResponse = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Sample text',  config: { taskType: 'SEMANTIC_SIMILARITY' }});const embedding: number[] = response.embedding.values;const dimensions: number = embedding.length; // 3072 by default
```
```
interface EmbeddingResponse {  embedding: {    values: number[];  };}const response: EmbeddingResponse = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Sample text',  config: { taskType: 'SEMANTIC_SIMILARITY' }});const embedding: number[] = response.embedding.values;const dimensions: number = embedding.length; // 3072 by default
```
```
/** * Normalize embedding vector for accurate similarity calculations. * REQUIRED for dimensions other than 3072. * * @param vector - Embedding values from API response * @returns Normalized vector (unit length) */function normalize(vector: number[]): number[] {  const magnitude = Math.sqrt(    vector.reduce((sum, val) => sum + val * val, 0)  );  return vector.map(val => val / magnitude);}// Usage with 768 or 1536 dimensionsconst response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: {    taskType: 'RETRIEVAL_QUERY',    outputDimensionality: 768  // NOT 3072  }});// ❌ WRONG - Use raw values directlyconst embedding = response.embedding.values;await vectorize.insert([{ id, values: embedding }]);// ✅ CORRECT - Normalize firstconst normalized = normalize(response.embedding.values);await vectorize.insert([{ id, values: normalized }]);
```
```
/** * Normalize embedding vector for accurate similarity calculations. * REQUIRED for dimensions other than 3072. * * @param vector - Embedding values from API response * @returns Normalized vector (unit length) */function normalize(vector: number[]): number[] {  const magnitude = Math.sqrt(    vector.reduce((sum, val) => sum + val * val, 0)  );  return vector.map(val => val / magnitude);}// Usage with 768 or 1536 dimensionsconst response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: {    taskType: 'RETRIEVAL_QUERY',    outputDimensionality: 768  // NOT 3072  }});// ❌ WRONG - Use raw values directlyconst embedding = response.embedding.values;await vectorize.insert([{ id, values: embedding }]);// ✅ CORRECT - Normalize firstconst normalized = normalize(response.embedding.values);await vectorize.insert([{ id, values: normalized }]);
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const texts = [  "What is the meaning of life?",  "How does photosynthesis work?",  "Tell me about the history of the internet."];const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  contents: texts, // Array of strings  config: {    taskType: 'RETRIEVAL_DOCUMENT',    outputDimensionality: 768  }});// Process each embeddingresponse.embeddings.forEach((embedding, index) => {  console.log(Text ${index}: ${texts[index]});  console.log(Embedding: ${embedding.values.slice(0, 5)}...);  console.log(Dimensions: ${embedding.values.length});});
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });const texts = [  "What is the meaning of life?",  "How does photosynthesis work?",  "Tell me about the history of the internet."];const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  contents: texts, // Array of strings  config: {    taskType: 'RETRIEVAL_DOCUMENT',    outputDimensionality: 768  }});// Process each embeddingresponse.embeddings.forEach((embedding, index) => {  console.log(Text ${index}: ${texts[index]});  console.log(Embedding: ${embedding.values.slice(0, 5)}...);  console.log(Dimensions: ${embedding.values.length});});
```
```
Text ${index}: ${texts[index]}
```
```
Embedding: ${embedding.values.slice(0, 5)}...
```
```
Dimensions: ${embedding.values.length}
```
```
batchEmbedContents
```
```
const response = await fetch(  'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents',  {    method: 'POST',    headers: {      'x-goog-api-key': apiKey,      'Content-Type': 'application/json'    },    body: JSON.stringify({      requests: texts.map(text => ({        model: 'models/gemini-embedding-001',        content: {          parts: [{ text }]        },        taskType: 'RETRIEVAL_DOCUMENT'      }))    })  });const data = await response.json();// data.embeddings: Array of {values: number[]}
```
```
const response = await fetch(  'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents',  {    method: 'POST',    headers: {      'x-goog-api-key': apiKey,      'Content-Type': 'application/json'    },    body: JSON.stringify({      requests: texts.map(text => ({        model: 'models/gemini-embedding-001',        content: {          parts: [{ text }]        },        taskType: 'RETRIEVAL_DOCUMENT'      }))    })  });const data = await response.json();// data.embeddings: Array of {values: number[]}
```
```
ERR_STRING_TOO_LONG
```
```
Cannot create a string longer than 0x1fffffe8 characters
```
```
429 RESOURCE_EXHAUSTED
```
```
async function batchEmbedWithRateLimit(  texts: string[],  batchSize: number = 50, // REDUCED from 100 due to ordering bug  delayMs: number = 60000 // 1 minute delay between batches): Promise<number[][]> {  const allEmbeddings: number[][] = [];  for (let i = 0; i < texts.length; i += batchSize) {    const batch = texts.slice(i, i + batchSize);    console.log(Processing batch ${i / batchSize + 1} (${batch.length} texts));    const response = await ai.models.embedContent({      model: 'gemini-embedding-001',      contents: batch,      config: {        taskType: 'RETRIEVAL_DOCUMENT',        outputDimensionality: 768      }    });    allEmbeddings.push(...response.embeddings.map(e => e.values));    // Wait before next batch (except last batch)    if (i + batchSize < texts.length) {      await new Promise(resolve => setTimeout(resolve, delayMs));    }  }  return allEmbeddings;}// Usageconst embeddings = await batchEmbedWithRateLimit(documents, 50);
```
```
async function batchEmbedWithRateLimit(  texts: string[],  batchSize: number = 50, // REDUCED from 100 due to ordering bug  delayMs: number = 60000 // 1 minute delay between batches): Promise<number[][]> {  const allEmbeddings: number[][] = [];  for (let i = 0; i < texts.length; i += batchSize) {    const batch = texts.slice(i, i + batchSize);    console.log(Processing batch ${i / batchSize + 1} (${batch.length} texts));    const response = await ai.models.embedContent({      model: 'gemini-embedding-001',      contents: batch,      config: {        taskType: 'RETRIEVAL_DOCUMENT',        outputDimensionality: 768      }    });    allEmbeddings.push(...response.embeddings.map(e => e.values));    // Wait before next batch (except last batch)    if (i + batchSize < texts.length) {      await new Promise(resolve => setTimeout(resolve, delayMs));    }  }  return allEmbeddings;}// Usageconst embeddings = await batchEmbedWithRateLimit(documents, 50);
```
```
Processing batch ${i / batchSize + 1} (${batch.length} texts)
```
```
taskType
```
```
// When embedding user queriesconst queryEmbedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: userQuery,  config: { taskType: 'RETRIEVAL_QUERY' } // ← Use RETRIEVAL_QUERY});// When embedding documents for indexingconst docEmbedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: documentText,  config: { taskType: 'RETRIEVAL_DOCUMENT' } // ← Use RETRIEVAL_DOCUMENT});
```
```
// When embedding user queriesconst queryEmbedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: userQuery,  config: { taskType: 'RETRIEVAL_QUERY' } // ← Use RETRIEVAL_QUERY});// When embedding documents for indexingconst docEmbedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: documentText,  config: { taskType: 'RETRIEVAL_DOCUMENT' } // ← Use RETRIEVAL_DOCUMENT});
```
```
const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { taskType: 'SEMANTIC_SIMILARITY' }});
```
```
const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { taskType: 'SEMANTIC_SIMILARITY' }});
```
```
const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { taskType: 'CLUSTERING' }});
```
```
const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { taskType: 'CLUSTERING' }});
```
```
// ❌ BAD: No task type specifiedconst embedding1 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: userQuery});// ✅ GOOD: Task type specifiedconst embedding2 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: userQuery,  config: { taskType: 'RETRIEVAL_QUERY' }});
```
```
// ❌ BAD: No task type specifiedconst embedding1 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: userQuery});// ✅ GOOD: Task type specifiedconst embedding2 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: userQuery,  config: { taskType: 'RETRIEVAL_QUERY' }});
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Generate embeddings for chunksasync function embedChunks(chunks: string[]): Promise<number[][]> {  const response = await ai.models.embedContent({    model: 'gemini-embedding-001',    contents: chunks,    config: {      taskType: 'RETRIEVAL_DOCUMENT', // ← Documents for indexing      outputDimensionality: 768 // ← Match Vectorize index dimensions    }  });  return response.embeddings.map(e => e.values);}// Store in Cloudflare Vectorizeasync function storeInVectorize(  env: Env,  chunks: string[],  embeddings: number[][]) {  const vectors = chunks.map((chunk, i) => ({    id: doc-${Date.now()}-${i},    values: embeddings[i],    metadata: { text: chunk }  }));  await env.VECTORIZE.insert(vectors);}
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Generate embeddings for chunksasync function embedChunks(chunks: string[]): Promise<number[][]> {  const response = await ai.models.embedContent({    model: 'gemini-embedding-001',    contents: chunks,    config: {      taskType: 'RETRIEVAL_DOCUMENT', // ← Documents for indexing      outputDimensionality: 768 // ← Match Vectorize index dimensions    }  });  return response.embeddings.map(e => e.values);}// Store in Cloudflare Vectorizeasync function storeInVectorize(  env: Env,  chunks: string[],  embeddings: number[][]) {  const vectors = chunks.map((chunk, i) => ({    id: doc-${Date.now()}-${i},    values: embeddings[i],    metadata: { text: chunk }  }));  await env.VECTORIZE.insert(vectors);}
```
```
doc-${Date.now()}-${i}
```
```
async function ragQuery(env: Env, userQuery: string): Promise<string> {  // 1. Embed user query  const queryResponse = await ai.models.embedContent({    model: 'gemini-embedding-001',    content: userQuery,    config: {      taskType: 'RETRIEVAL_QUERY', // ← Query, not document      outputDimensionality: 768    }  });  const queryEmbedding = queryResponse.embedding.values;  // 2. Search Vectorize for similar documents  const results = await env.VECTORIZE.query(queryEmbedding, {    topK: 5,    returnMetadata: true  });  // 3. Extract context from top results  const context = results.matches    .map(match => match.metadata.text)    .join('\n\n');  // 4. Generate response with context  const response = await ai.models.generateContent({    model: 'gemini-2.5-flash',    contents: Context:\n${context}\n\nQuestion: ${userQuery}\n\nAnswer based on the context above:  });  return response.text;}
```
```
async function ragQuery(env: Env, userQuery: string): Promise<string> {  // 1. Embed user query  const queryResponse = await ai.models.embedContent({    model: 'gemini-embedding-001',    content: userQuery,    config: {      taskType: 'RETRIEVAL_QUERY', // ← Query, not document      outputDimensionality: 768    }  });  const queryEmbedding = queryResponse.embedding.values;  // 2. Search Vectorize for similar documents  const results = await env.VECTORIZE.query(queryEmbedding, {    topK: 5,    returnMetadata: true  });  // 3. Extract context from top results  const context = results.matches    .map(match => match.metadata.text)    .join('\n\n');  // 4. Generate response with context  const response = await ai.models.generateContent({    model: 'gemini-2.5-flash',    contents: Context:\n${context}\n\nQuestion: ${userQuery}\n\nAnswer based on the context above:  });  return response.text;}
```
```
Context:\n${context}\n\nQuestion: ${userQuery}\n\nAnswer based on the context above:
```
```
npx wrangler vectorize create gemini-embeddings --dimensions 768 --metric cosine
```
```
npx wrangler vectorize create gemini-embeddings --dimensions 768 --metric cosine
```
```
{  "name": "my-rag-app",  "main": "src/index.ts",  "compatibility_date": "2025-10-25",  "vectorize": {    "bindings": [      {        "binding": "VECTORIZE",        "index_name": "gemini-embeddings"      }    ]  }}
```
```
{  "name": "my-rag-app",  "main": "src/index.ts",  "compatibility_date": "2025-10-25",  "vectorize": {    "bindings": [      {        "binding": "VECTORIZE",        "index_name": "gemini-embeddings"      }    ]  }}
```
```
templates/rag-with-vectorize.ts
```
```
// ❌ Error: API key not setconst ai = new GoogleGenAI({});// ✅ Correctconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });if (!process.env.GEMINI_API_KEY) {  throw new Error('GEMINI_API_KEY environment variable not set');}
```
```
// ❌ Error: API key not setconst ai = new GoogleGenAI({});// ✅ Correctconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });if (!process.env.GEMINI_API_KEY) {  throw new Error('GEMINI_API_KEY environment variable not set');}
```
```
// ❌ Error: Embedding has 3072 dims, Vectorize expects 768const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text  // No outputDimensionality specified → defaults to 3072});await env.VECTORIZE.insert([{  id: '1',  values: embedding.embedding.values // 3072 dims, but index is 768!}]);// ✅ Correct: Match dimensionsconst embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { outputDimensionality: 768 } // ← Match index dimensions});
```
```
// ❌ Error: Embedding has 3072 dims, Vectorize expects 768const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text  // No outputDimensionality specified → defaults to 3072});await env.VECTORIZE.insert([{  id: '1',  values: embedding.embedding.values // 3072 dims, but index is 768!}]);// ✅ Correct: Match dimensionsconst embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { outputDimensionality: 768 } // ← Match index dimensions});
```
```
// ❌ Error: 429 Too Many Requestsfor (let i = 0; i < 1000; i++) {  await ai.models.embedContent({ /* ... */ }); // Exceeds 100 RPM on free tier}// ✅ Correct: Implement rate limitingasync function embedWithRetry(text: string, maxRetries = 3) {  for (let attempt = 0; attempt < maxRetries; attempt++) {    try {      return await ai.models.embedContent({        model: 'gemini-embedding-001',        content: text,        config: { taskType: 'SEMANTIC_SIMILARITY' }      });    } catch (error: any) {      if (error.status === 429 && attempt < maxRetries - 1) {        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff        await new Promise(resolve => setTimeout(resolve, delay));        continue;      }      throw error;    }  }}
```
```
// ❌ Error: 429 Too Many Requestsfor (let i = 0; i < 1000; i++) {  await ai.models.embedContent({ /* ... */ }); // Exceeds 100 RPM on free tier}// ✅ Correct: Implement rate limitingasync function embedWithRetry(text: string, maxRetries = 3) {  for (let attempt = 0; attempt < maxRetries; attempt++) {    try {      return await ai.models.embedContent({        model: 'gemini-embedding-001',        content: text,        config: { taskType: 'SEMANTIC_SIMILARITY' }      });    } catch (error: any) {      if (error.status === 429 && attempt < maxRetries - 1) {        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff        await new Promise(resolve => setTimeout(resolve, delay));        continue;      }      throw error;    }  }}
```
```
references/top-errors.md
```
```
function normalize(vector: number[]): number[] {  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));  return vector.map(val => val / magnitude);}// When using 768 or 1536 dimensionsconst response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { outputDimensionality: 768 }});const normalized = normalize(response.embedding.values);// Now safe for similarity calculations
```
```
function normalize(vector: number[]): number[] {  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));  return vector.map(val => val / magnitude);}// When using 768 or 1536 dimensionsconst response = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { outputDimensionality: 768 }});const normalized = normalize(response.embedding.values);// Now safe for similarity calculations
```
```
// Safer approach with verificationconst taggedTexts = texts.map((text, i) => [ID:${i}] ${text});const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  contents: taggedTexts,  config: { taskType: 'RETRIEVAL_DOCUMENT', outputDimensionality: 768 }});// Verify ordering by parsing IDs if needed
```
```
// Safer approach with verificationconst taggedTexts = texts.map((text, i) => [ID:${i}] ${text});const response = await ai.models.embedContent({  model: 'gemini-embedding-001',  contents: taggedTexts,  config: { taskType: 'RETRIEVAL_DOCUMENT', outputDimensionality: 768 }});// Verify ordering by parsing IDs if needed
```
```
[ID:${i}] ${text}
```
```
Cannot create a string longer than 0x1fffffe8 characters
```
```
// Safe batch sizeasync function batchEmbedSafe(texts: string[]) {  const maxBatchSize = 5000;  if (texts.length > maxBatchSize) {    throw new Error(Batch too large: ${texts.length} texts (max: ${maxBatchSize}));  }  // Process batch...}
```
```
// Safe batch sizeasync function batchEmbedSafe(texts: string[]) {  const maxBatchSize = 5000;  if (texts.length > maxBatchSize) {    throw new Error(Batch too large: ${texts.length} texts (max: ${maxBatchSize}));  }  // Process batch...}
```
```
Batch too large: ${texts.length} texts (max: ${maxBatchSize})
```
```
GoogleGenerativeAIEmbeddings
```
```
output_dimensionality
```
```
embed_documents()
```
```
@google/genai
```
```
# ❌ WRONG - parameter silently ignoredembeddings = GoogleGenerativeAIEmbeddings(    model="gemini-embedding-001",    output_dimensionality=768  # IGNORED!)# ✅ CORRECT - pass to methodembeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")result = embeddings.embed_documents(["text"], output_dimensionality=768)
```
```
# ❌ WRONG - parameter silently ignoredembeddings = GoogleGenerativeAIEmbeddings(    model="gemini-embedding-001",    output_dimensionality=768  # IGNORED!)# ✅ CORRECT - pass to methodembeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")result = embeddings.embed_documents(["text"], output_dimensionality=768)
```
```
embed_content()
```
```
batchEmbedContents
```
```
// Add delays to avoid rate limitsasync function embedWithDelay(text: string, delayMs: number = 100) {  const response = await ai.models.embedContent({    model: 'gemini-embedding-001',    content: text,    config: { taskType: 'SEMANTIC_SIMILARITY' }  });  await new Promise(resolve => setTimeout(resolve, delayMs));  return response.embedding.values;}
```
```
// Add delays to avoid rate limitsasync function embedWithDelay(text: string, delayMs: number = 100) {  const response = await ai.models.embedContent({    model: 'gemini-embedding-001',    content: text,    config: { taskType: 'SEMANTIC_SIMILARITY' }  });  await new Promise(resolve => setTimeout(resolve, delayMs));  return response.embedding.values;}
```
```
// Task type optimizes embeddings for your use caseconst embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { taskType: 'RETRIEVAL_QUERY' } // ← Always specify});
```
```
// Task type optimizes embeddings for your use caseconst embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { taskType: 'RETRIEVAL_QUERY' } // ← Always specify});
```
```
// Ensure embeddings match your Vectorize index dimensionsconst embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { outputDimensionality: 768 } // ← Match index});
```
```
// Ensure embeddings match your Vectorize index dimensionsconst embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text,  config: { outputDimensionality: 768 } // ← Match index});
```
```
// Use exponential backoff for 429 errorsasync function embedWithBackoff(text: string) {  // Implementation from Error Handling section}
```
```
// Use exponential backoff for 429 errorsasync function embedWithBackoff(text: string) {  // Implementation from Error Handling section}
```
```
// Cache embeddings to avoid redundant API callsconst cache = new Map<string, number[]>();async function getCachedEmbedding(text: string): Promise<number[]> {  if (cache.has(text)) {    return cache.get(text)!;  }  const response = await ai.models.embedContent({    model: 'gemini-embedding-001',    content: text,    config: { taskType: 'SEMANTIC_SIMILARITY' }  });  const embedding = response.embedding.values;  cache.set(text, embedding);  return embedding;}
```
```
// Cache embeddings to avoid redundant API callsconst cache = new Map<string, number[]>();async function getCachedEmbedding(text: string): Promise<number[]> {  if (cache.has(text)) {    return cache.get(text)!;  }  const response = await ai.models.embedContent({    model: 'gemini-embedding-001',    content: text,    config: { taskType: 'SEMANTIC_SIMILARITY' }  });  const embedding = response.embedding.values;  cache.set(text, embedding);  return embedding;}
```
```
// Single batch request vs multiple individual requestsconst embeddings = await ai.models.embedContent({  model: 'gemini-embedding-001',  contents: texts, // Array of texts  config: { taskType: 'RETRIEVAL_DOCUMENT' }});
```
```
// Single batch request vs multiple individual requestsconst embeddings = await ai.models.embedContent({  model: 'gemini-embedding-001',  contents: texts, // Array of texts  config: { taskType: 'RETRIEVAL_DOCUMENT' }});
```
```
// Reduces quality by 10-30%const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text  // Missing taskType!});
```
```
// Reduces quality by 10-30%const embedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text  // Missing taskType!});
```
```
// Can't compare embeddings with different dimensionsconst emb1 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text1,  config: { outputDimensionality: 768 }});const emb2 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text2,  config: { outputDimensionality: 1536 } // Different dimensions!});// ❌ Can't calculate similarity between different dimensionsconst similarity = cosineSimilarity(emb1.embedding.values, emb2.embedding.values);
```
```
// Can't compare embeddings with different dimensionsconst emb1 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text1,  config: { outputDimensionality: 768 }});const emb2 = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: text2,  config: { outputDimensionality: 1536 } // Different dimensions!});// ❌ Can't calculate similarity between different dimensionsconst similarity = cosineSimilarity(emb1.embedding.values, emb2.embedding.values);
```
```
// Reduces search qualityconst queryEmbedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: query,  config: { taskType: 'RETRIEVAL_DOCUMENT' } // Wrong! Should be RETRIEVAL_QUERY});
```
```
// Reduces search qualityconst queryEmbedding = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: query,  config: { taskType: 'RETRIEVAL_DOCUMENT' } // Wrong! Should be RETRIEVAL_QUERY});
```
```
package.json
```
```
basic-embeddings.ts
```
```
embeddings-fetch.ts
```
```
batch-embeddings.ts
```
```
rag-with-vectorize.ts
```
```
model-comparison.md
```
```
vectorize-integration.md
```
```
rag-patterns.md
```
```
dimension-guide.md
```
```
top-errors.md
```
```
check-versions.sh
```
```
/websites/ai_google_dev_gemini-api
```
```
/* ❌ Missing task type (10-30% quality loss) */const result = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Hello world',})/* ✅ Always specify task type */const result = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Hello world',  taskType: 'RETRIEVAL_DOCUMENT', // Required!})
```
```
/* ❌ Missing task type (10-30% quality loss) */const result = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Hello world',})/* ✅ Always specify task type */const result = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Hello world',  taskType: 'RETRIEVAL_DOCUMENT', // Required!})
```
```
/* ❌ Same task type for both (breaks retrieval) */// Indexing documentsembed(doc, { taskType: 'RETRIEVAL_QUERY' }) // Wrong!// Queryingembed(query, { taskType: 'RETRIEVAL_QUERY' })/* ✅ Use RETRIEVAL_DOCUMENT for docs, RETRIEVAL_QUERY for queries */// Indexing documentsembed(doc, { taskType: 'RETRIEVAL_DOCUMENT' })// Queryingembed(query, { taskType: 'RETRIEVAL_QUERY' })
```
```
/* ❌ Same task type for both (breaks retrieval) */// Indexing documentsembed(doc, { taskType: 'RETRIEVAL_QUERY' }) // Wrong!// Queryingembed(query, { taskType: 'RETRIEVAL_QUERY' })/* ✅ Use RETRIEVAL_DOCUMENT for docs, RETRIEVAL_QUERY for queries */// Indexing documentsembed(doc, { taskType: 'RETRIEVAL_DOCUMENT' })// Queryingembed(query, { taskType: 'RETRIEVAL_QUERY' })
```
```
// Choose based on use case:'RETRIEVAL_QUERY'      // User search queries'RETRIEVAL_DOCUMENT'   // Documents being indexed'SEMANTIC_SIMILARITY'  // Comparing text similarity'CLUSTERING'           // Grouping similar items'CLASSIFICATION'       // Categorizing text'CODE_RETRIEVAL_QUERY' // Code search queries'QUESTION_ANSWERING'   // Q&A systems'FACT_VERIFICATION'    // Fact checking
```
```
// Choose based on use case:'RETRIEVAL_QUERY'      // User search queries'RETRIEVAL_DOCUMENT'   // Documents being indexed'SEMANTIC_SIMILARITY'  // Comparing text similarity'CLUSTERING'           // Grouping similar items'CLASSIFICATION'       // Categorizing text'CODE_RETRIEVAL_QUERY' // Code search queries'QUESTION_ANSWERING'   // Q&A systems'FACT_VERIFICATION'    // Fact checking
```
```
/* ❌ Dimension mismatch with vector store */// Vectorize index: 768 dimensions// Embedding: default 3072 dimensions/* ✅ Match dimensions to your vector store */const result = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Hello',  taskType: 'RETRIEVAL_DOCUMENT',  outputDimensionality: 768, // Match your index!})// Recommended dimensions:// 768  - Fast, good for most use cases// 1536 - Balance of speed and quality// 3072 - Maximum quality (default)
```
```
/* ❌ Dimension mismatch with vector store */// Vectorize index: 768 dimensions// Embedding: default 3072 dimensions/* ✅ Match dimensions to your vector store */const result = await ai.models.embedContent({  model: 'gemini-embedding-001',  content: 'Hello',  taskType: 'RETRIEVAL_DOCUMENT',  outputDimensionality: 768, // Match your index!})// Recommended dimensions:// 768  - Fast, good for most use cases// 1536 - Balance of speed and quality// 3072 - Maximum quality (default)
```
```
taskType
```
```
RETRIEVAL_QUERY
```
```
RETRIEVAL_DOCUMENT
```
```
outputDimensionality
```
```
text-embedding-*
```
```
gemini-embedding-001
```
Unlock the power of Google Gemini's embedding capabilities with this comprehensive agent skill. Designed for developers building advanced AI applications, it offers a deep dive into generating high-quality text embeddings using the `gemini-embedding-001` model. From initial setup and basic usage to integrating with RAG systems like Cloudflare Vectorize, this skill provides actionable guidance. Enhance your coding assistant's ability to create intelligent features such as semantic search, content recommendations, and efficient data retrieval, streamlining your development workflow for smarter AI solutions.

# When to Use This Skill
- •Implementing semantic search functionality within an application to find contextually relevant information.
- •Building Retrieval-Augmented Generation (RAG) systems to provide AI models with up-to-date and specific external knowledge.
- •Clustering similar documents or user queries for organization, personalization, or anomaly detection.
- •Developing recommendation engines that suggest similar items or content based on embedding vectors.

# Pro Tips
- 💡Always specify the appropriate `taskType` (e.g., 'SEMANTIC_SIMILARITY', 'RETRIEVAL_QUERY') when generating embeddings, as it significantly impacts vector quality for specific use cases.
- 💡For large datasets, leverage batch processing to optimize API calls and reduce latency, but be mindful of rate limits and chunking strategies.
- 💡Integrate embeddings with a robust vector database (like Cloudflare Vectorize as shown) to efficiently store, index, and query vectors for real-time applications.

