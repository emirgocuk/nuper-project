# google-gemini-file-search
Source: https://antigravity.codes/agent-skills/ai-tools/google-gemini-file-search

## AI Worker Instructions
When the user requests functionality related to google-gemini-file-search, follow these guidelines and utilize this context.

## Scraped Content

# google-gemini-file-search
```
node --version  # Should be >=18.0.0
```
```
node --version  # Should be >=18.0.0
```
```
npm install @google/genai# orpnpm add @google/genai# oryarn add @google/genai
```
```
npm install @google/genai# orpnpm add @google/genai# oryarn add @google/genai
```
```
npm view @google/genai version
```
```
{  "compilerOptions": {    "target": "ES2020",    "module": "ESNext",    "moduleResolution": "node",    "esModuleInterop": true,    "strict": true,    "skipLibCheck": true  }}
```
```
{  "compilerOptions": {    "target": "ES2020",    "module": "ESNext",    "moduleResolution": "node",    "esModuleInterop": true,    "strict": true,    "skipLibCheck": true  }}
```
```
Error: Documents cannot be modified after indexing
```
```
Error: Documents cannot be modified after indexing
```
```
// ❌ WRONG: Trying to update document (no such API)await ai.fileSearchStores.documents.update({  name: documentName,  customMetadata: { version: '2.0' }})// ✅ CORRECT: Delete then re-uploadconst docs = await ai.fileSearchStores.documents.list({  parent: fileStore.name})const oldDoc = docs.documents.find(d => d.displayName === 'manual.pdf')if (oldDoc) {  await ai.fileSearchStores.documents.delete({    name: oldDoc.name,    force: true  })}await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('manual-v2.pdf'),  config: { displayName: 'manual.pdf' }})
```
```
// ❌ WRONG: Trying to update document (no such API)await ai.fileSearchStores.documents.update({  name: documentName,  customMetadata: { version: '2.0' }})// ✅ CORRECT: Delete then re-uploadconst docs = await ai.fileSearchStores.documents.list({  parent: fileStore.name})const oldDoc = docs.documents.find(d => d.displayName === 'manual.pdf')if (oldDoc) {  await ai.fileSearchStores.documents.delete({    name: oldDoc.name,    force: true  })}await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('manual-v2.pdf'),  config: { displayName: 'manual.pdf' }})
```
```
Error: Quota exceeded. Expected 1GB limit, but 3.2GB used.
```
```
Error: Quota exceeded. Expected 1GB limit, but 3.2GB used.
```
```
// ❌ WRONG: Assuming storage = file sizeconst fileSize = fs.statSync('data.pdf').size // 500 MB// Expect 500 MB usage → WRONG// ✅ CORRECT: Account for 3x multiplierconst fileSize = fs.statSync('data.pdf').size // 500 MBconst estimatedStorage = fileSize * 3 // 1.5 GB (embeddings + metadata)console.log(Estimated storage: ${estimatedStorage / 1e9} GB)// Check if within quota before uploadif (estimatedStorage > 1e9) {  console.warn('⚠️ File may exceed free tier 1 GB limit')}
```
```
// ❌ WRONG: Assuming storage = file sizeconst fileSize = fs.statSync('data.pdf').size // 500 MB// Expect 500 MB usage → WRONG// ✅ CORRECT: Account for 3x multiplierconst fileSize = fs.statSync('data.pdf').size // 500 MBconst estimatedStorage = fileSize * 3 // 1.5 GB (embeddings + metadata)console.log(Estimated storage: ${estimatedStorage / 1e9} GB)// Check if within quota before uploadif (estimatedStorage > 1e9) {  console.warn('⚠️ File may exceed free tier 1 GB limit')}
```
```
Estimated storage: ${estimatedStorage / 1e9} GB
```
```
// ❌ WRONG: Using defaults without testingawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('docs.pdf')  // Default chunking may be too large or too small})// ✅ CORRECT: Configure chunking for precisionawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('docs.pdf'),  config: {    chunkingConfig: {      whiteSpaceConfig: {        maxTokensPerChunk: 500,  // Smaller chunks = more precise retrieval        maxOverlapTokens: 50     // 10% overlap prevents context loss      }    }  }})
```
```
// ❌ WRONG: Using defaults without testingawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('docs.pdf')  // Default chunking may be too large or too small})// ✅ CORRECT: Configure chunking for precisionawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('docs.pdf'),  config: {    chunkingConfig: {      whiteSpaceConfig: {        maxTokensPerChunk: 500,  // Smaller chunks = more precise retrieval        maxOverlapTokens: 50     // 10% overlap prevents context loss      }    }  }})
```
```
Error: Maximum 20 custom metadata key-value pairs allowed
```
```
Error: Maximum 20 custom metadata key-value pairs allowed
```
```
// ❌ WRONG: Too many metadata fieldsawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('doc.pdf'),  config: {    customMetadata: {      doc_type: 'manual',      version: '1.0',      author: 'John Doe',      department: 'Engineering',      created_date: '2025-01-01',      // ... 18 more fields → Error!    }  }})// ✅ CORRECT: Use hierarchical keys or JSON stringsawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('doc.pdf'),  config: {    customMetadata: {      doc_type: 'manual',      version: '1.0',      author_dept: 'John Doe|Engineering',  // Combine related fields      dates: JSON.stringify({                // Or use JSON for complex data        created: '2025-01-01',        updated: '2025-01-15'      })    }  }})
```
```
// ❌ WRONG: Too many metadata fieldsawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('doc.pdf'),  config: {    customMetadata: {      doc_type: 'manual',      version: '1.0',      author: 'John Doe',      department: 'Engineering',      created_date: '2025-01-01',      // ... 18 more fields → Error!    }  }})// ✅ CORRECT: Use hierarchical keys or JSON stringsawait ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('doc.pdf'),  config: {    customMetadata: {      doc_type: 'manual',      version: '1.0',      author_dept: 'John Doe|Engineering',  // Combine related fields      dates: JSON.stringify({                // Or use JSON for complex data        created: '2025-01-01',        updated: '2025-01-15'      })    }  }})
```
```
// ❌ WRONG: No cost estimationawait uploadAllDocuments(fileStore.name, './data') // 10 GB uploaded → $375 surprise// ✅ CORRECT: Calculate costs upfrontconst totalSize = getTotalDirectorySize('./data') // 10 GBconst estimatedTokens = (totalSize / 4) // Rough estimate: 1 token ≈ 4 bytesconst indexingCost = (estimatedTokens / 1e6) * 0.15console.log(Estimated indexing cost: $${indexingCost.toFixed(2)})console.log(Estimated storage: ${(totalSize * 3) / 1e9} GB)// Confirm before proceedingconst proceed = await confirm(Proceed with indexing? Cost: $${indexingCost.toFixed(2)})if (proceed) {  await uploadAllDocuments(fileStore.name, './data')}
```
```
// ❌ WRONG: No cost estimationawait uploadAllDocuments(fileStore.name, './data') // 10 GB uploaded → $375 surprise// ✅ CORRECT: Calculate costs upfrontconst totalSize = getTotalDirectorySize('./data') // 10 GBconst estimatedTokens = (totalSize / 4) // Rough estimate: 1 token ≈ 4 bytesconst indexingCost = (estimatedTokens / 1e6) * 0.15console.log(Estimated indexing cost: $${indexingCost.toFixed(2)})console.log(Estimated storage: ${(totalSize * 3) / 1e9} GB)// Confirm before proceedingconst proceed = await confirm(Proceed with indexing? Cost: $${indexingCost.toFixed(2)})if (proceed) {  await uploadAllDocuments(fileStore.name, './data')}
```
```
Estimated indexing cost: $${indexingCost.toFixed(2)}
```
```
Estimated storage: ${(totalSize * 3) / 1e9} GB
```
```
Proceed with indexing? Cost: $${indexingCost.toFixed(2)}
```
```
done: true
```
```
// ❌ WRONG: Assuming upload is instantconst operation = await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('large.pdf')})// Immediately query → No results!// ✅ CORRECT: Poll until indexing complete with timeoutconst operation = await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('large.pdf')})// Poll with timeout and fallbackconst MAX_POLL_TIME = 60000 // 60 secondsconst POLL_INTERVAL = 1000let elapsed = 0while (!operation.done && elapsed < MAX_POLL_TIME) {  await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))  elapsed += POLL_INTERVAL  try {    operation = await ai.operations.get({ name: operation.name })    console.log(Indexing progress: ${operation.metadata?.progress || 'processing...'})  } catch (error) {    console.warn('Polling failed, assuming complete:', error)    break  }}if (operation.error) {  throw new Error(Indexing failed: ${operation.error.message})}// ⚠️ Warning: operations.get() can be unreliable for large files// If timeout reached, verify document exists manuallyif (elapsed >= MAX_POLL_TIME) {  console.warn('Polling timeout - verifying document manually')  const docs = await ai.fileSearchStores.documents.list({ parent: fileStore.name })  const uploaded = docs.documents?.find(d => d.displayName === 'large.pdf')  if (uploaded) {    console.log('✅ Document found despite polling timeout')  } else {    throw new Error('Upload failed - document not found')  }}console.log('✅ Indexing complete:', operation.response?.displayName)
```
```
// ❌ WRONG: Assuming upload is instantconst operation = await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('large.pdf')})// Immediately query → No results!// ✅ CORRECT: Poll until indexing complete with timeoutconst operation = await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('large.pdf')})// Poll with timeout and fallbackconst MAX_POLL_TIME = 60000 // 60 secondsconst POLL_INTERVAL = 1000let elapsed = 0while (!operation.done && elapsed < MAX_POLL_TIME) {  await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))  elapsed += POLL_INTERVAL  try {    operation = await ai.operations.get({ name: operation.name })    console.log(Indexing progress: ${operation.metadata?.progress || 'processing...'})  } catch (error) {    console.warn('Polling failed, assuming complete:', error)    break  }}if (operation.error) {  throw new Error(Indexing failed: ${operation.error.message})}// ⚠️ Warning: operations.get() can be unreliable for large files// If timeout reached, verify document exists manuallyif (elapsed >= MAX_POLL_TIME) {  console.warn('Polling timeout - verifying document manually')  const docs = await ai.fileSearchStores.documents.list({ parent: fileStore.name })  const uploaded = docs.documents?.find(d => d.displayName === 'large.pdf')  if (uploaded) {    console.log('✅ Document found despite polling timeout')  } else {    throw new Error('Upload failed - document not found')  }}console.log('✅ Indexing complete:', operation.response?.displayName)
```
```
Indexing progress: ${operation.metadata?.progress || 'processing...'}
```
```
Indexing failed: ${operation.error.message}
```
```
Error: Cannot delete store with documents. Set force=true.
```
```
Error: Cannot delete store with documents. Set force=true.
```
```
force: true
```
```
force: true
```
```
// ❌ WRONG: Trying to delete store with documentsawait ai.fileSearchStores.delete({  name: fileStore.name})// Error: Cannot delete store with documents// ✅ CORRECT: Use force deleteawait ai.fileSearchStores.delete({  name: fileStore.name,  force: true  // Deletes store AND all documents})// Alternative: Delete documents firstconst docs = await ai.fileSearchStores.documents.list({ parent: fileStore.name })for (const doc of docs.documents || []) {  await ai.fileSearchStores.documents.delete({    name: doc.name,    force: true  })}await ai.fileSearchStores.delete({ name: fileStore.name })
```
```
// ❌ WRONG: Trying to delete store with documentsawait ai.fileSearchStores.delete({  name: fileStore.name})// Error: Cannot delete store with documents// ✅ CORRECT: Use force deleteawait ai.fileSearchStores.delete({  name: fileStore.name,  force: true  // Deletes store AND all documents})// Alternative: Delete documents firstconst docs = await ai.fileSearchStores.documents.list({ parent: fileStore.name })for (const doc of docs.documents || []) {  await ai.fileSearchStores.documents.delete({    name: doc.name,    force: true  })}await ai.fileSearchStores.delete({ name: fileStore.name })
```
```
Error: File Search is only supported for Gemini 3 Pro and Flash models
```
```
Error: File Search is only supported for Gemini 3 Pro and Flash models
```
```
// ❌ WRONG: Using Gemini 1.5 modelconst response = await ai.models.generateContent({  model: 'gemini-1.5-pro',  // Not supported!  contents: 'What is the installation procedure?',  config: {    tools: [{      fileSearch: { fileSearchStoreNames: [fileStore.name] }    }]  }})// ✅ CORRECT: Use Gemini 3 modelsconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  // ✅ Supported (fast, cost-effective)  // OR  // model: 'gemini-3-pro',   // ✅ Supported (higher quality)  contents: 'What is the installation procedure?',  config: {    tools: [{      fileSearch: { fileSearchStoreNames: [fileStore.name] }    }]  }})
```
```
// ❌ WRONG: Using Gemini 1.5 modelconst response = await ai.models.generateContent({  model: 'gemini-1.5-pro',  // Not supported!  contents: 'What is the installation procedure?',  config: {    tools: [{      fileSearch: { fileSearchStoreNames: [fileStore.name] }    }]  }})// ✅ CORRECT: Use Gemini 3 modelsconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  // ✅ Supported (fast, cost-effective)  // OR  // model: 'gemini-3-pro',   // ✅ Supported (higher quality)  contents: 'What is the installation procedure?',  config: {    tools: [{      fileSearch: { fileSearchStoreNames: [fileStore.name] }    }]  }})
```
```
groundingChunks[0].title === null  // No document source shown
```
```
groundingChunks[0].title === null  // No document source shown
```
```
Blob
```
```
displayName
```
```
customMetadata
```
```
// ✅ CORRECT: Upgrade to v1.34.0+ for automatic fixnpm install @google/genai@latest  // v1.34.0+await ai.fileSearchStores.uploadToFileSearchStore({  name: storeName,  file: new Blob([arrayBuffer], { type: 'application/pdf' }),  config: {    displayName: 'Safety Manual.pdf',  // ✅ Now preserved    customMetadata: { version: '1.0' }  // ✅ Now preserved  }})// ⚠️ WORKAROUND for v1.33.0 and earlier: Use resumable uploadconst uploadUrl = https://generativelanguage.googleapis.com/upload/v1beta/${storeName}:uploadToFileSearchStore?key=${API_KEY}// Step 1: Initiate with displayName in bodyconst initResponse = await fetch(uploadUrl, {  method: 'POST',  headers: {    'X-Goog-Upload-Protocol': 'resumable',    'X-Goog-Upload-Command': 'start',    'X-Goog-Upload-Header-Content-Length': numBytes.toString(),    'X-Goog-Upload-Header-Content-Type': 'application/pdf',    'Content-Type': 'application/json'  },  body: JSON.stringify({    displayName: 'Safety Manual.pdf'  // ✅ Works with resumable upload  })})// Step 2: Upload file bytesconst uploadUrl2 = initResponse.headers.get('X-Goog-Upload-URL')await fetch(uploadUrl2, {  method: 'PUT',  headers: {    'Content-Length': numBytes.toString(),    'X-Goog-Upload-Offset': '0',    'X-Goog-Upload-Command': 'upload, finalize',    'Content-Type': 'application/pdf'  },  body: fileBytes})
```
```
// ✅ CORRECT: Upgrade to v1.34.0+ for automatic fixnpm install @google/genai@latest  // v1.34.0+await ai.fileSearchStores.uploadToFileSearchStore({  name: storeName,  file: new Blob([arrayBuffer], { type: 'application/pdf' }),  config: {    displayName: 'Safety Manual.pdf',  // ✅ Now preserved    customMetadata: { version: '1.0' }  // ✅ Now preserved  }})// ⚠️ WORKAROUND for v1.33.0 and earlier: Use resumable uploadconst uploadUrl = https://generativelanguage.googleapis.com/upload/v1beta/${storeName}:uploadToFileSearchStore?key=${API_KEY}// Step 1: Initiate with displayName in bodyconst initResponse = await fetch(uploadUrl, {  method: 'POST',  headers: {    'X-Goog-Upload-Protocol': 'resumable',    'X-Goog-Upload-Command': 'start',    'X-Goog-Upload-Header-Content-Length': numBytes.toString(),    'X-Goog-Upload-Header-Content-Type': 'application/pdf',    'Content-Type': 'application/json'  },  body: JSON.stringify({    displayName: 'Safety Manual.pdf'  // ✅ Works with resumable upload  })})// Step 2: Upload file bytesconst uploadUrl2 = initResponse.headers.get('X-Goog-Upload-URL')await fetch(uploadUrl2, {  method: 'PUT',  headers: {    'Content-Length': numBytes.toString(),    'X-Goog-Upload-Offset': '0',    'X-Goog-Upload-Command': 'upload, finalize',    'Content-Type': 'application/pdf'  },  body: fileBytes})
```
```
https://generativelanguage.googleapis.com/upload/v1beta/${storeName}:uploadToFileSearchStore?key=${API_KEY}
```
```
response.candidates[0].groundingMetadata === undefined// Even though fileSearch tool is configured
```
```
response.candidates[0].groundingMetadata === undefined// Even though fileSearch tool is configured
```
```
responseMimeType: 'application/json'
```
```
fileSearch
```
```
// ❌ WRONG: Structured output overrides groundingconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Summarize guidelines',  config: {    responseMimeType: 'application/json',  // Loses grounding    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }})// ✅ CORRECT: Two-step approach// Step 1: Get grounded text responseconst textResponse = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Summarize guidelines',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }})const grounding = textResponse.candidates[0].groundingMetadata// Step 2: Convert to structured format in promptconst jsonResponse = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: Convert to JSON: ${textResponse.text}Format:{  "summary": "...",  "key_points": ["..."]},  config: {    responseMimeType: 'application/json',    responseSchema: {      type: 'object',      properties: {        summary: { type: 'string' },        key_points: { type: 'array', items: { type: 'string' } }      }    }  }})// Combine resultsconst result = {  data: JSON.parse(jsonResponse.text),  sources: grounding.groundingChunks}
```
```
// ❌ WRONG: Structured output overrides groundingconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Summarize guidelines',  config: {    responseMimeType: 'application/json',  // Loses grounding    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }})// ✅ CORRECT: Two-step approach// Step 1: Get grounded text responseconst textResponse = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Summarize guidelines',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }})const grounding = textResponse.candidates[0].groundingMetadata// Step 2: Convert to structured format in promptconst jsonResponse = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: Convert to JSON: ${textResponse.text}Format:{  "summary": "...",  "key_points": ["..."]},  config: {    responseMimeType: 'application/json',    responseSchema: {      type: 'object',      properties: {        summary: { type: 'string' },        key_points: { type: 'array', items: { type: 'string' } }      }    }  }})// Combine resultsconst result = {  data: JSON.parse(jsonResponse.text),  sources: grounding.groundingChunks}
```
```
Convert to JSON: ${textResponse.text}Format:{  "summary": "...",  "key_points": ["..."]}
```
```
Error: "Search as a tool and file search tool are not supported together"Status: INVALID_ARGUMENT
```
```
Error: "Search as a tool and file search tool are not supported together"Status: INVALID_ARGUMENT
```
```
googleSearch
```
```
fileSearch
```
```
// ❌ WRONG: Combining search toolsconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'What are the latest industry guidelines?',  config: {    tools: [      { googleSearch: {} },      { fileSearch: { fileSearchStoreNames: [storeName] } }    ]  }})// ✅ CORRECT: Use separate specialist agentsasync function searchWeb(query: string) {  return ai.models.generateContent({    model: 'gemini-3-flash',    contents: query,    config: { tools: [{ googleSearch: {} }] }  })}async function searchDocuments(query: string) {  return ai.models.generateContent({    model: 'gemini-3-flash',    contents: query,    config: { tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }] }  })}// Orchestrate based on query typeconst needsWeb = query.includes('latest') || query.includes('current')const response = needsWeb  ? await searchWeb(query)  : await searchDocuments(query)
```
```
// ❌ WRONG: Combining search toolsconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'What are the latest industry guidelines?',  config: {    tools: [      { googleSearch: {} },      { fileSearch: { fileSearchStoreNames: [storeName] } }    ]  }})// ✅ CORRECT: Use separate specialist agentsasync function searchWeb(query: string) {  return ai.models.generateContent({    model: 'gemini-3-flash',    contents: query,    config: { tools: [{ googleSearch: {} }] }  })}async function searchDocuments(query: string) {  return ai.models.generateContent({    model: 'gemini-3-flash',    contents: query,    config: { tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }] }  })}// Orchestrate based on query typeconst needsWeb = query.includes('latest') || query.includes('current')const response = needsWeb  ? await searchWeb(query)  : await searchDocuments(query)
```
```
InlinedRequest
```
```
metadata
```
```
InlinedResponse
```
```
// ❌ WRONG: Expecting metadata in responseconst batchRequest = {  metadata: { key: 'my-request-id' },  contents: [{ parts: [{ text: 'Question?' }], role: 'user' }],  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }}const batchResponse = await ai.batch.create({ requests: [batchRequest] })console.log(batchResponse.responses[0].metadata)  // ❌ undefined// ✅ CORRECT: Use array index to correlateconst requests = [  { metadata: { id: 'req-1' }, contents: [...] },  { metadata: { id: 'req-2' }, contents: [...] }]const responses = await ai.batch.create({ requests })// Map by index (not ideal but works)responses.responses.forEach((response, i) => {  const requestMetadata = requests[i].metadata  console.log(Response for ${requestMetadata.id}:, response)})
```
```
// ❌ WRONG: Expecting metadata in responseconst batchRequest = {  metadata: { key: 'my-request-id' },  contents: [{ parts: [{ text: 'Question?' }], role: 'user' }],  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }}const batchResponse = await ai.batch.create({ requests: [batchRequest] })console.log(batchResponse.responses[0].metadata)  // ❌ undefined// ✅ CORRECT: Use array index to correlateconst requests = [  { metadata: { id: 'req-1' }, contents: [...] },  { metadata: { id: 'req-2' }, contents: [...] }]const responses = await ai.batch.create({ requests })// Map by index (not ideal but works)responses.responses.forEach((response, i) => {  const requestMetadata = requests[i].metadata  console.log(Response for ${requestMetadata.id}:, response)})
```
```
Response for ${requestMetadata.id}:
```
```
import { GoogleGenAI } from '@google/genai'import fs from 'fs'// Initialize client with API keyconst ai = new GoogleGenAI({  apiKey: process.env.GOOGLE_API_KEY})// Verify API key is setif (!process.env.GOOGLE_API_KEY) {  throw new Error('GOOGLE_API_KEY environment variable is required')}
```
```
import { GoogleGenAI } from '@google/genai'import fs from 'fs'// Initialize client with API keyconst ai = new GoogleGenAI({  apiKey: process.env.GOOGLE_API_KEY})// Verify API key is setif (!process.env.GOOGLE_API_KEY) {  throw new Error('GOOGLE_API_KEY environment variable is required')}
```
```
// Create a store (container for documents)const fileStore = await ai.fileSearchStores.create({  config: {    displayName: 'my-knowledge-base',  // Human-readable name    // Optional: Add store-level metadata    customMetadata: {      project: 'customer-support',      environment: 'production'    }  }})console.log('Created store:', fileStore.name)// Output: fileSearchStores/abc123xyz...
```
```
// Create a store (container for documents)const fileStore = await ai.fileSearchStores.create({  config: {    displayName: 'my-knowledge-base',  // Human-readable name    // Optional: Add store-level metadata    customMetadata: {      project: 'customer-support',      environment: 'production'    }  }})console.log('Created store:', fileStore.name)// Output: fileSearchStores/abc123xyz...
```
```
// List all stores (paginated)const stores = await ai.fileSearchStores.list({  pageSize: 20  // Max 20 per page})// Find by display namelet targetStore = nulllet pageToken = nulldo {  const page = await ai.fileSearchStores.list({ pageToken })  targetStore = page.fileSearchStores.find(    s => s.displayName === 'my-knowledge-base'  )  pageToken = page.nextPageToken} while (!targetStore && pageToken)if (targetStore) {  console.log('Found existing store:', targetStore.name)} else {  console.log('Store not found, creating new one...')}
```
```
// List all stores (paginated)const stores = await ai.fileSearchStores.list({  pageSize: 20  // Max 20 per page})// Find by display namelet targetStore = nulllet pageToken = nulldo {  const page = await ai.fileSearchStores.list({ pageToken })  targetStore = page.fileSearchStores.find(    s => s.displayName === 'my-knowledge-base'  )  pageToken = page.nextPageToken} while (!targetStore && pageToken)if (targetStore) {  console.log('Found existing store:', targetStore.name)} else {  console.log('Store not found, creating new one...')}
```
```
const operation = await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('./docs/manual.pdf'),  config: {    displayName: 'Installation Manual',    customMetadata: {      doc_type: 'manual',      version: '1.0',      language: 'en'    },    chunkingConfig: {      whiteSpaceConfig: {        maxTokensPerChunk: 500,        maxOverlapTokens: 50      }    }  }})// Poll until indexing completewhile (!operation.done) {  await new Promise(resolve => setTimeout(resolve, 1000))  operation = await ai.operations.get({ name: operation.name })}console.log('✅ Indexed:', operation.response.displayName)
```
```
const operation = await ai.fileSearchStores.uploadToFileSearchStore({  name: fileStore.name,  file: fs.createReadStream('./docs/manual.pdf'),  config: {    displayName: 'Installation Manual',    customMetadata: {      doc_type: 'manual',      version: '1.0',      language: 'en'    },    chunkingConfig: {      whiteSpaceConfig: {        maxTokensPerChunk: 500,        maxOverlapTokens: 50      }    }  }})// Poll until indexing completewhile (!operation.done) {  await new Promise(resolve => setTimeout(resolve, 1000))  operation = await ai.operations.get({ name: operation.name })}console.log('✅ Indexed:', operation.response.displayName)
```
```
const filePaths = [  './docs/manual.pdf',  './docs/faq.md',  './docs/troubleshooting.docx']// Upload all files concurrentlyconst uploadPromises = filePaths.map(filePath =>  ai.fileSearchStores.uploadToFileSearchStore({    name: fileStore.name,    file: fs.createReadStream(filePath),    config: {      displayName: filePath.split('/').pop(),      customMetadata: {        doc_type: 'support',        source_path: filePath      },      chunkingConfig: {        whiteSpaceConfig: {          maxTokensPerChunk: 500,          maxOverlapTokens: 50        }      }    }  }))const operations = await Promise.all(uploadPromises)// Poll all operationsfor (const operation of operations) {  let op = operation  while (!op.done) {    await new Promise(resolve => setTimeout(resolve, 1000))    op = await ai.operations.get({ name: op.name })  }  console.log('✅ Indexed:', op.response.displayName)}
```
```
const filePaths = [  './docs/manual.pdf',  './docs/faq.md',  './docs/troubleshooting.docx']// Upload all files concurrentlyconst uploadPromises = filePaths.map(filePath =>  ai.fileSearchStores.uploadToFileSearchStore({    name: fileStore.name,    file: fs.createReadStream(filePath),    config: {      displayName: filePath.split('/').pop(),      customMetadata: {        doc_type: 'support',        source_path: filePath      },      chunkingConfig: {        whiteSpaceConfig: {          maxTokensPerChunk: 500,          maxOverlapTokens: 50        }      }    }  }))const operations = await Promise.all(uploadPromises)// Poll all operationsfor (const operation of operations) {  let op = operation  while (!op.done) {    await new Promise(resolve => setTimeout(resolve, 1000))    op = await ai.operations.get({ name: op.name })  }  console.log('✅ Indexed:', op.response.displayName)}
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'What are the safety precautions for installation?',  config: {    tools: [{      fileSearch: {        fileSearchStoreNames: [fileStore.name]      }    }]  }})console.log('Answer:', response.text)// Access citationsconst grounding = response.candidates[0].groundingMetadataif (grounding?.groundingChunks) {  console.log('\nSources:')  grounding.groundingChunks.forEach((chunk, i) => {    console.log(${i + 1}. ${chunk.retrievedContext?.title || 'Unknown'})    console.log(   URI: ${chunk.retrievedContext?.uri || 'N/A'})  })}
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'What are the safety precautions for installation?',  config: {    tools: [{      fileSearch: {        fileSearchStoreNames: [fileStore.name]      }    }]  }})console.log('Answer:', response.text)// Access citationsconst grounding = response.candidates[0].groundingMetadataif (grounding?.groundingChunks) {  console.log('\nSources:')  grounding.groundingChunks.forEach((chunk, i) => {    console.log(${i + 1}. ${chunk.retrievedContext?.title || 'Unknown'})    console.log(   URI: ${chunk.retrievedContext?.uri || 'N/A'})  })}
```
```
${i + 1}. ${chunk.retrievedContext?.title || 'Unknown'}
```
```
URI: ${chunk.retrievedContext?.uri || 'N/A'}
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'How do I reset the device?',  config: {    tools: [{      fileSearch: {        fileSearchStoreNames: [fileStore.name],        // Filter to only search troubleshooting docs in English, version 1.0        metadataFilter: 'doc_type="troubleshooting" AND language="en" AND version="1.0"'      }    }]  }})console.log('Answer:', response.text)
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'How do I reset the device?',  config: {    tools: [{      fileSearch: {        fileSearchStoreNames: [fileStore.name],        // Filter to only search troubleshooting docs in English, version 1.0        metadataFilter: 'doc_type="troubleshooting" AND language="en" AND version="1.0"'      }    }]  }})console.log('Answer:', response.text)
```
```
key1="value1" AND key2="value2"
```
```
key1="value1" OR key1="value2"
```
```
(key1="a" OR key1="b") AND key2="c"
```
```
// List all documents in storeconst docs = await ai.fileSearchStores.documents.list({  parent: fileStore.name,  pageSize: 20})console.log(Total documents: ${docs.documents?.length || 0})docs.documents?.forEach(doc => {  console.log(- ${doc.displayName} (${doc.name}))  console.log(  Metadata:, doc.customMetadata)})// Get specific document detailsconst docDetails = await ai.fileSearchStores.documents.get({  name: docs.documents[0].name})console.log('Document details:', docDetails)// Delete documentawait ai.fileSearchStores.documents.delete({  name: docs.documents[0].name,  force: true})
```
```
// List all documents in storeconst docs = await ai.fileSearchStores.documents.list({  parent: fileStore.name,  pageSize: 20})console.log(Total documents: ${docs.documents?.length || 0})docs.documents?.forEach(doc => {  console.log(- ${doc.displayName} (${doc.name}))  console.log(  Metadata:, doc.customMetadata)})// Get specific document detailsconst docDetails = await ai.fileSearchStores.documents.get({  name: docs.documents[0].name})console.log('Document details:', docDetails)// Delete documentawait ai.fileSearchStores.documents.delete({  name: docs.documents[0].name,  force: true})
```
```
Total documents: ${docs.documents?.length || 0}
```
```
- ${doc.displayName} (${doc.name})
```
```
Metadata:
```
```
// Delete entire store (force deletes all documents)await ai.fileSearchStores.delete({  name: fileStore.name,  force: true})console.log('✅ Store deleted')
```
```
// Delete entire store (force deletes all documents)await ai.fileSearchStores.delete({  name: fileStore.name,  force: true})console.log('✅ Store deleted')
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 500,   // Smaller chunks for precise code/API lookup    maxOverlapTokens: 50      // 10% overlap  }}
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 500,   // Smaller chunks for precise code/API lookup    maxOverlapTokens: 50      // 10% overlap  }}
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 800,   // Larger chunks preserve narrative flow    maxOverlapTokens: 80      // 10% overlap  }}
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 800,   // Larger chunks preserve narrative flow    maxOverlapTokens: 80      // 10% overlap  }}
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 300,   // Very small chunks for high precision    maxOverlapTokens: 30      // 10% overlap  }}
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 300,   // Very small chunks for high precision    maxOverlapTokens: 30      // 10% overlap  }}
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 400,   // Medium chunks (1-2 Q&A pairs)    maxOverlapTokens: 40      // 10% overlap  }}
```
```
chunkingConfig: {  whiteSpaceConfig: {    maxTokensPerChunk: 400,   // Medium chunks (1-2 Q&A pairs)    maxOverlapTokens: 40      // 10% overlap  }}
```
```
customMetadata: {  doc_type: 'faq' | 'manual' | 'troubleshooting' | 'guide',  product: 'widget-pro' | 'widget-lite',  version: '1.0' | '2.0',  language: 'en' | 'es' | 'fr',  category: 'installation' | 'configuration' | 'maintenance',  priority: 'critical' | 'normal' | 'low',  last_updated: '2025-01-15',  author: 'support-team'}
```
```
customMetadata: {  doc_type: 'faq' | 'manual' | 'troubleshooting' | 'guide',  product: 'widget-pro' | 'widget-lite',  version: '1.0' | '2.0',  language: 'en' | 'es' | 'fr',  category: 'installation' | 'configuration' | 'maintenance',  priority: 'critical' | 'normal' | 'low',  last_updated: '2025-01-15',  author: 'support-team'}
```
```
metadataFilter: 'product="widget-pro" AND (doc_type="troubleshooting" OR doc_type="faq") AND language="en"'
```
```
metadataFilter: 'product="widget-pro" AND (doc_type="troubleshooting" OR doc_type="faq") AND language="en"'
```
```
customMetadata: {  doc_type: 'contract' | 'regulation' | 'case-law' | 'policy',  jurisdiction: 'US' | 'EU' | 'UK',  practice_area: 'employment' | 'corporate' | 'ip' | 'tax',  effective_date: '2025-01-01',  status: 'active' | 'archived',  confidentiality: 'public' | 'internal' | 'privileged'}
```
```
customMetadata: {  doc_type: 'contract' | 'regulation' | 'case-law' | 'policy',  jurisdiction: 'US' | 'EU' | 'UK',  practice_area: 'employment' | 'corporate' | 'ip' | 'tax',  effective_date: '2025-01-01',  status: 'active' | 'archived',  confidentiality: 'public' | 'internal' | 'privileged'}
```
```
customMetadata: {  doc_type: 'api-reference' | 'tutorial' | 'example' | 'changelog',  language: 'javascript' | 'python' | 'java' | 'go',  framework: 'react' | 'nextjs' | 'express' | 'fastapi',  version: '1.2.0',  difficulty: 'beginner' | 'intermediate' | 'advanced'}
```
```
customMetadata: {  doc_type: 'api-reference' | 'tutorial' | 'example' | 'changelog',  language: 'javascript' | 'python' | 'java' | 'go',  framework: 'react' | 'nextjs' | 'express' | 'fastapi',  version: '1.2.0',  difficulty: 'beginner' | 'intermediate' | 'advanced'}
```
```
snake_case
```
```
camelCase
```
```
// Track uploaded file hashes to avoid duplicatesconst uploadedHashes = new Set<string>()async function uploadWithDeduplication(filePath: string) {  const fileHash = await getFileHash(filePath)  if (uploadedHashes.has(fileHash)) {    console.log(Skipping duplicate: ${filePath})    return  }  await ai.fileSearchStores.uploadToFileSearchStore({    name: fileStore.name,    file: fs.createReadStream(filePath)  })  uploadedHashes.add(fileHash)}
```
```
// Track uploaded file hashes to avoid duplicatesconst uploadedHashes = new Set<string>()async function uploadWithDeduplication(filePath: string) {  const fileHash = await getFileHash(filePath)  if (uploadedHashes.has(fileHash)) {    console.log(Skipping duplicate: ${filePath})    return  }  await ai.fileSearchStores.uploadToFileSearchStore({    name: fileStore.name,    file: fs.createReadStream(filePath)  })  uploadedHashes.add(fileHash)}
```
```
Skipping duplicate: ${filePath}
```
```
// Convert images to text before indexing (OCR)// Compress PDFs (remove images, use text-only)// Use markdown instead of Word docs (smaller size)
```
```
// Convert images to text before indexing (OCR)// Compress PDFs (remove images, use text-only)// Use markdown instead of Word docs (smaller size)
```
```
// ❌ EXPENSIVE: Search all 10GB of documentsconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Reset procedure?',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [fileStore.name] } }]  }})// ✅ CHEAPER: Filter to only troubleshooting docs (subset)const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Reset procedure?',  config: {    tools: [{      fileSearch: {        fileSearchStoreNames: [fileStore.name],        metadataFilter: 'doc_type="troubleshooting"'  // Reduces search scope      }    }]  }})
```
```
// ❌ EXPENSIVE: Search all 10GB of documentsconst response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Reset procedure?',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [fileStore.name] } }]  }})// ✅ CHEAPER: Filter to only troubleshooting docs (subset)const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Reset procedure?',  config: {    tools: [{      fileSearch: {        fileSearchStoreNames: [fileStore.name],        metadataFilter: 'doc_type="troubleshooting"'  // Reduces search scope      }    }]  }})
```
```
// Gemini 3 Flash is 10x cheaper than Pro for queries// Use Flash unless you need Pro's advanced reasoning// Development/testing: Use Flashmodel: 'gemini-3-flash'// Production (high-stakes answers): Use Promodel: 'gemini-3-pro'
```
```
// Gemini 3 Flash is 10x cheaper than Pro for queries// Use Flash unless you need Pro's advanced reasoning// Development/testing: Use Flashmodel: 'gemini-3-flash'// Production (high-stakes answers): Use Promodel: 'gemini-3-pro'
```
```
// List stores and estimate storageconst stores = await ai.fileSearchStores.list()for (const store of stores.fileSearchStores || []) {  const docs = await ai.fileSearchStores.documents.list({    parent: store.name  })  console.log(Store: ${store.displayName})  console.log(Documents: ${docs.documents?.length || 0})  // Estimate storage (3x input size)  console.log(Estimated storage: ~${(docs.documents?.length || 0) * 10} MB)}
```
```
// List stores and estimate storageconst stores = await ai.fileSearchStores.list()for (const store of stores.fileSearchStores || []) {  const docs = await ai.fileSearchStores.documents.list({    parent: store.name  })  console.log(Store: ${store.displayName})  console.log(Documents: ${docs.documents?.length || 0})  // Estimate storage (3x input size)  console.log(Estimated storage: ~${(docs.documents?.length || 0) * 10} MB)}
```
```
Store: ${store.displayName}
```
```
Documents: ${docs.documents?.length || 0}
```
```
Estimated storage: ~${(docs.documents?.length || 0) * 10} MB
```
```
const store = await ai.fileSearchStores.get({  name: fileStore.name})console.assert(store.displayName === 'my-knowledge-base', 'Store name mismatch')console.log('✅ Store created successfully')
```
```
const store = await ai.fileSearchStores.get({  name: fileStore.name})console.assert(store.displayName === 'my-knowledge-base', 'Store name mismatch')console.log('✅ Store created successfully')
```
```
const docs = await ai.fileSearchStores.documents.list({  parent: fileStore.name})console.assert(docs.documents?.length > 0, 'No documents indexed')console.log(✅ ${docs.documents?.length} documents indexed)
```
```
const docs = await ai.fileSearchStores.documents.list({  parent: fileStore.name})console.assert(docs.documents?.length > 0, 'No documents indexed')console.log(✅ ${docs.documents?.length} documents indexed)
```
```
✅ ${docs.documents?.length} documents indexed
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'What is this knowledge base about?',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [fileStore.name] } }]  }})console.assert(response.text.length > 0, 'Empty response')console.log('✅ Query successful:', response.text.substring(0, 100) + '...')
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'What is this knowledge base about?',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [fileStore.name] } }]  }})console.assert(response.text.length > 0, 'Empty response')console.log('✅ Query successful:', response.text.substring(0, 100) + '...')
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Provide a specific answer with citations.',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [fileStore.name] } }]  }})const grounding = response.candidates[0].groundingMetadataconsole.assert(  grounding?.groundingChunks?.length > 0,  'No grounding/citations returned')console.log(✅ ${grounding?.groundingChunks?.length} citations returned)
```
```
const response = await ai.models.generateContent({  model: 'gemini-3-flash',  contents: 'Provide a specific answer with citations.',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [fileStore.name] } }]  }})const grounding = response.candidates[0].groundingMetadataconsole.assert(  grounding?.groundingChunks?.length > 0,  'No grounding/citations returned')console.log(✅ ${grounding?.groundingChunks?.length} citations returned)
```
```
✅ ${grounding?.groundingChunks?.length} citations returned
```
```
generateContentStream()
```
```
// ✅ Streaming works with File Search (v1.34.0+)const stream = await ai.models.generateContentStream({  model: 'gemini-3-flash',  contents: 'Summarize the document',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }})for await (const chunk of stream) {  process.stdout.write(chunk.text)}// Access grounding after stream completesconst grounding = stream.candidates[0].groundingMetadata
```
```
// ✅ Streaming works with File Search (v1.34.0+)const stream = await ai.models.generateContentStream({  model: 'gemini-3-flash',  contents: 'Summarize the document',  config: {    tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }]  }})for await (const chunk of stream) {  process.stdout.write(chunk.text)}// Access grounding after stream completesconst grounding = stream.candidates[0].groundingMetadata
```
```
templates/
```
```
cd templates/basic-node-ragnpm installnpm run dev
```
```
cd templates/basic-node-ragnpm installnpm run dev
```
```
cd templates/cloudflare-worker-ragnpm installnpx wrangler deploy
```
```
cd templates/cloudflare-worker-ragnpm installnpx wrangler deploy
```
```
cd templates/nextjs-docs-searchnpm installnpm run dev
```
```
cd templates/nextjs-docs-searchnpm installnpm run dev
```
```
references/api-reference.md
```
```
references/chunking-best-practices.md
```
```
references/pricing-calculator.md
```
```
references/migration-from-openai.md
```
```
scripts/create-store.ts
```
```
scripts/upload-batch.ts
```
```
scripts/query-store.ts
```
```
scripts/cleanup.ts
```
```
templates/basic-node-rag/
```
```
templates/cloudflare-worker-rag/
```
```
templates/nextjs-docs-search/
```
Unlock powerful document intelligence within your AI applications using the Google Gemini File Search Agent Skill. This comprehensive integration streamlines the process of building sophisticated Retrieval-Augmented Generation (RAG) systems. Developers can quickly set up a fully managed solution to index diverse document types and enable natural language querying, complete with automatic chunking, embeddings, and precise citations, all while optimizing costs and performance.

# When to Use This Skill
- •Building a chatbot that can answer questions based on a large corpus of internal company documents (e.g., HR policies, technical manuals).
- •Developing a research assistant that can semantically search through academic papers or legal documents to find relevant information and citations.
- •Creating an AI-powered customer support tool that retrieves answers directly from product documentation and FAQs.
- •Implementing a code assistant that can search through project documentation and codebases for specific functions or explanations.

# Pro Tips
- 💡Leverage the provided chunking best practices to optimize retrieval accuracy, especially for complex or lengthy documents, by ensuring contextually relevant segments.
- 💡Actively monitor and manage your file storage and indexing tokens to stay within the free tier limits or effectively manage costs in paid tiers, utilizing the outlined cost optimization strategies.
- 💡Integrate the documented error prevention strategies early in your development cycle to build robust applications and minimize common issues when interacting with the Gemini File Search API.
- 💡Utilize the Cloudflare Workers + Next.js templates for rapid deployment and efficient handling of API calls, ensuring a scalable and performant solution.

