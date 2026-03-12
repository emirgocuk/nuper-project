# cloudflare-vectorize
Source: https://antigravity.codes/agent-skills/ai-tools/cloudflare-vectorize

## AI Worker Instructions
When the user requests functionality related to cloudflare-vectorize, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-vectorize
```
// V2: Returns mutationId   const result = await env.VECTORIZE_INDEX.insert(vectors);   console.log(result.mutationId); // "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"   // Vector inserts/deletes may take a few seconds to be reflected
```
```
// V2: Returns mutationId   const result = await env.VECTORIZE_INDEX.insert(vectors);   console.log(result.mutationId); // "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"   // Vector inserts/deletes may take a few seconds to be reflected
```
```
// ❌ V1 (deprecated)   { returnMetadata: true }   // ✅ V2 (required)   { returnMetadata: 'all' | 'indexed' | 'none' }
```
```
// ❌ V1 (deprecated)   { returnMetadata: true }   // ✅ V2 (required)   { returnMetadata: 'all' | 'indexed' | 'none' }
```
```
wrangler vectorize --deprecated-v1
```
```
// Get index info to check last mutation processedconst info = await env.VECTORIZE_INDEX.describe();console.log(info.mutationId); // Last mutation IDconsole.log(info.processedUpToMutation); // Last processed timestamp
```
```
// Get index info to check last mutation processedconst info = await env.VECTORIZE_INDEX.describe();console.log(info.mutationId); // Last mutation IDconsole.log(info.processedUpToMutation); // Last processed timestamp
```
```
# 1. Create the index with FIXED dimensions and metricnpx wrangler vectorize create my-index \  --dimensions=768 \  --metric=cosine# 2. Create metadata indexes IMMEDIATELY (before inserting vectors!)npx wrangler vectorize create-metadata-index my-index \  --property-name=category \  --type=stringnpx wrangler vectorize create-metadata-index my-index \  --property-name=timestamp \  --type=number
```
```
# 1. Create the index with FIXED dimensions and metricnpx wrangler vectorize create my-index \  --dimensions=768 \  --metric=cosine# 2. Create metadata indexes IMMEDIATELY (before inserting vectors!)npx wrangler vectorize create-metadata-index my-index \  --property-name=category \  --type=stringnpx wrangler vectorize create-metadata-index my-index \  --property-name=timestamp \  --type=number
```
```
# Dimensions MUST match your embedding model output:# - Workers AI @cf/baai/bge-base-en-v1.5: 768 dimensions# - OpenAI text-embedding-3-small: 1536 dimensions# - OpenAI text-embedding-3-large: 3072 dimensions# Metrics determine similarity calculation:# - cosine: Best for normalized embeddings (most common)# - euclidean: Absolute distance between vectors# - dot-product: For non-normalized vectors
```
```
# Dimensions MUST match your embedding model output:# - Workers AI @cf/baai/bge-base-en-v1.5: 768 dimensions# - OpenAI text-embedding-3-small: 1536 dimensions# - OpenAI text-embedding-3-large: 3072 dimensions# Metrics determine similarity calculation:# - cosine: Best for normalized embeddings (most common)# - euclidean: Absolute distance between vectors# - dot-product: For non-normalized vectors
```
```
{  "name": "my-vectorize-worker",  "main": "src/index.ts",  "compatibility_date": "2025-10-21",  "vectorize": [    {      "binding": "VECTORIZE_INDEX",      "index_name": "my-index"    }  ],  "ai": {    "binding": "AI"  }}
```
```
{  "name": "my-vectorize-worker",  "main": "src/index.ts",  "compatibility_date": "2025-10-21",  "vectorize": [    {      "binding": "VECTORIZE_INDEX",      "index_name": "my-index"    }  ],  "ai": {    "binding": "AI"  }}
```
```
export interface Env {  VECTORIZE_INDEX: VectorizeIndex;  AI: Ai;}interface VectorizeVector {  id: string;  values: number[] | Float32Array | Float64Array;  namespace?: string;  metadata?: Record<string, string | number | boolean | string[]>;}interface VectorizeMatches {  matches: Array<{    id: string;    score: number;    values?: number[];    metadata?: Record<string, any>;    namespace?: string;  }>;  count: number;}
```
```
export interface Env {  VECTORIZE_INDEX: VectorizeIndex;  AI: Ai;}interface VectorizeVector {  id: string;  values: number[] | Float32Array | Float64Array;  namespace?: string;  metadata?: Record<string, string | number | boolean | string[]>;}interface VectorizeMatches {  matches: Array<{    id: string;    score: number;    values?: number[];    metadata?: Record<string, any>;    namespace?: string;  }>;  count: number;}
```
```
// Equality (implicit $eq){ category: "docs" }// Not equals{ status: { $ne: "archived" } }// In/Not in arrays{ category: { $in: ["docs", "tutorials"] } }{ category: { $nin: ["deprecated", "draft"] } }// Range queries (numbers) - NEW in V2{ timestamp: { $gte: 1704067200, $lt: 1735689600 } }// Range queries (strings) - prefix searching{ url: { $gte: "/docs/workers", $lt: "/docs/workersz" } }// Nested metadata with dot notation{ "author.id": "user123" }// Multiple conditions (implicit AND){ category: "docs", language: "en", "metadata.published": true }
```
```
// Equality (implicit $eq){ category: "docs" }// Not equals{ status: { $ne: "archived" } }// In/Not in arrays{ category: { $in: ["docs", "tutorials"] } }{ category: { $nin: ["deprecated", "draft"] } }// Range queries (numbers) - NEW in V2{ timestamp: { $gte: 1704067200, $lt: 1735689600 } }// Range queries (strings) - prefix searching{ url: { $gte: "/docs/workers", $lt: "/docs/workersz" } }// Nested metadata with dot notation{ "author.id": "user123" }// Multiple conditions (implicit AND){ category: "docs", language: "en", "metadata.published": true }
```
```
// Few unique values - efficient filteringmetadata: {  category: "docs",        // ~10 categories  language: "en",          // ~5 languages  published: true          // 2 values (boolean)}
```
```
// Few unique values - efficient filteringmetadata: {  category: "docs",        // ~10 categories  language: "en",          // ~5 languages  published: true          // 2 values (boolean)}
```
```
// Many unique values - avoid large range scansmetadata: {  user_id: "uuid-v4...",         // Millions of unique values  timestamp_ms: 1704067200123    // Use seconds instead}
```
```
// Many unique values - avoid large range scansmetadata: {  user_id: "uuid-v4...",         // Millions of unique values  timestamp_ms: 1704067200123    // Use seconds instead}
```
```
@cf/baai/bge-base-en-v1.5
```
```
text-embedding-3-small
```
```
text-embedding-3-large
```
```
nomic-embed-code
```
```
Qodo-Embed-1-7B
```
```
// ❌ INVALID metadata keysmetadata: {  "": "value",              // Empty key  "user.name": "John",      // Contains dot (reserved for nesting)  "$admin": true,           // Starts with $  "key\"with\"quotes": 1    // Contains quotes}// ✅ VALID metadata keysmetadata: {  "user_name": "John",  "isAdmin": true,  "nested": { "allowed": true }  // Access as "nested.allowed" in filters}
```
```
// ❌ INVALID metadata keysmetadata: {  "": "value",              // Empty key  "user.name": "John",      // Contains dot (reserved for nesting)  "$admin": true,           // Starts with $  "key\"with\"quotes": 1    // Contains quotes}// ✅ VALID metadata keysmetadata: {  "user_name": "John",  "isAdmin": true,  "nested": { "allowed": true }  // Access as "nested.allowed" in filters}
```
```
const BATCH_SIZE = 5000;async function insertVectors(vectors: VectorizeVector[]) {  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {    const batch = vectors.slice(i, i + BATCH_SIZE);    const result = await env.VECTORIZE.insert(batch);    console.log(Inserted batch ${i / BATCH_SIZE + 1}, mutationId: ${result.mutationId});    // Optional: Rate limiting delay    if (i + BATCH_SIZE < vectors.length) {      await new Promise(resolve => setTimeout(resolve, 100));    }  }}
```
```
const BATCH_SIZE = 5000;async function insertVectors(vectors: VectorizeVector[]) {  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {    const batch = vectors.slice(i, i + BATCH_SIZE);    const result = await env.VECTORIZE.insert(batch);    console.log(Inserted batch ${i / BATCH_SIZE + 1}, mutationId: ${result.mutationId});    // Optional: Rate limiting delay    if (i + BATCH_SIZE < vectors.length) {      await new Promise(resolve => setTimeout(resolve, 100));    }  }}
```
```
Inserted batch ${i / BATCH_SIZE + 1}, mutationId: ${result.mutationId}
```
```
returnValues: true
```
```
// Fast, ~80% accuracy, topK up to 100const results = await env.VECTORIZE.query(embedding, {  topK: 50,  returnValues: false  // Default});// Slower, ~100% accuracy, topK max 20const preciseResults = await env.VECTORIZE.query(embedding, {  topK: 10,  returnValues: true   // High-precision scoring});
```
```
// Fast, ~80% accuracy, topK up to 100const results = await env.VECTORIZE.query(embedding, {  topK: 50,  returnValues: false  // Default});// Slower, ~100% accuracy, topK max 20const preciseResults = await env.VECTORIZE.query(embedding, {  topK: 10,  returnValues: true   // High-precision scoring});
```
```
Problem: Filtering doesn't work on existing vectorsSolution: Delete and re-insert vectors OR create metadata indexes BEFORE inserting
```
```
Problem: Filtering doesn't work on existing vectorsSolution: Delete and re-insert vectors OR create metadata indexes BEFORE inserting
```
```
Problem: "Vector dimensions do not match index configuration"Solution: Ensure embedding model output matches index dimensions:  - Workers AI bge-base: 768  - OpenAI small: 1536  - OpenAI large: 3072
```
```
Problem: "Vector dimensions do not match index configuration"Solution: Ensure embedding model output matches index dimensions:  - Workers AI bge-base: 768  - OpenAI small: 1536  - OpenAI large: 3072
```
```
Problem: "Invalid metadata key"Solution: Keys cannot:  - Be empty  - Contain . (dot)  - Contain " (quote)  - Start with $ (dollar sign)
```
```
Problem: "Invalid metadata key"Solution: Keys cannot:  - Be empty  - Contain . (dot)  - Contain " (quote)  - Start with $ (dollar sign)
```
```
Problem: "Filter exceeds 2048 bytes"Solution: Simplify filter or split into multiple queries
```
```
Problem: "Filter exceeds 2048 bytes"Solution: Simplify filter or split into multiple queries
```
```
Problem: Slow queries or reduced accuracySolution: Use lower cardinality fields for range queries, or use seconds instead of milliseconds for timestamps
```
```
Problem: Slow queries or reduced accuracySolution: Use lower cardinality fields for range queries, or use seconds instead of milliseconds for timestamps
```
```
Problem: Updates not reflecting in indexSolution: Use upsert() to overwrite existing vectors, not insert()
```
```
Problem: Updates not reflecting in indexSolution: Use upsert() to overwrite existing vectors, not insert()
```
```
Problem: "VECTORIZE_INDEX is not defined"Solution: Add [[vectorize]] binding to wrangler.jsonc
```
```
Problem: "VECTORIZE_INDEX is not defined"Solution: Add [[vectorize]] binding to wrangler.jsonc
```
```
Problem: Unclear when to use namespace vs metadata filteringSolution:  - Namespace: Partition key, applied BEFORE metadata filters  - Metadata: Flexible key-value filtering within namespace
```
```
Problem: Unclear when to use namespace vs metadata filteringSolution:  - Namespace: Partition key, applied BEFORE metadata filters  - Metadata: Flexible key-value filtering within namespace
```
```
Problem: Inserted vectors not immediately queryableSolution: V2 mutations are asynchronous - vectors may take a few seconds to be reflected  - Use mutationId to track mutation status  - Check env.VECTORIZE_INDEX.describe() for processedUpToMutation timestamp
```
```
Problem: Inserted vectors not immediately queryableSolution: V2 mutations are asynchronous - vectors may take a few seconds to be reflected  - Use mutationId to track mutation status  - Check env.VECTORIZE_INDEX.describe() for processedUpToMutation timestamp
```
```
Problem: "returnMetadata must be 'all', 'indexed', or 'none'"Solution: V2 changed returnMetadata from boolean to string enum:  - ❌ V1: { returnMetadata: true }  - ✅ V2: { returnMetadata: 'all' }
```
```
Problem: "returnMetadata must be 'all', 'indexed', or 'none'"Solution: V2 changed returnMetadata from boolean to string enum:  - ❌ V1: { returnMetadata: true }  - ✅ V2: { returnMetadata: 'all' }
```
```
wrangler vectorize list --json
```
```
wrangler vectorize list --json
```
```
wrangler vectorize list-metadata-index --json
```
```
$ wrangler vectorize list --json📋 Listing Vectorize indexes...[  { "created_on": "2025-10-18T13:28:30.259277Z", ... }]
```
```
$ wrangler vectorize list --json📋 Listing Vectorize indexes...[  { "created_on": "2025-10-18T13:28:30.259277Z", ... }]
```
```
jq
```
```
# Using tailwrangler vectorize list --json | tail -n +2 | jq '.'# Using sedwrangler vectorize list --json | sed '1d' | jq '.'
```
```
# Using tailwrangler vectorize list --json | tail -n +2 | jq '.'# Using sedwrangler vectorize list --json | sed '1d' | jq '.'
```
```
wrangler types
```
```
VectorizeVectorMetadataFilterOp
```
```
$eq
```
```
$ne
```
```
$in
```
```
$nin
```
```
$lt
```
```
$lte
```
```
$gt
```
```
$gte
```
```
const vectorizeRes = env.VECTORIZE.queryById(imgId, {  filter: { gender: { $in: genderFilters } }, // ❌ TS error but works!  topK,  returnMetadata: 'indexed',});
```
```
const vectorizeRes = env.VECTORIZE.queryById(imgId, {  filter: { gender: { $in: genderFilters } }, // ❌ TS error but works!  topK,  returnMetadata: 'indexed',});
```
```
// Add to your types filetype VectorizeMetadataFilter = Record<string,  | string  | number  | boolean  | {      $eq?: string | number | boolean;      $ne?: string | number | boolean;      $in?: (string | number | boolean)[];      $nin?: (string | number | boolean)[];      $lt?: number | string;      $lte?: number | string;      $gt?: number | string;      $gte?: number | string;    }>;
```
```
// Add to your types filetype VectorizeMetadataFilter = Record<string,  | string  | number  | boolean  | {      $eq?: string | number | boolean;      $ne?: string | number | boolean;      $in?: (string | number | boolean)[];      $nin?: (string | number | boolean)[];      $lt?: number | string;      $lte?: number | string;      $gt?: number | string;      $gte?: number | string;    }>;
```
```
ENOENT: no such file or directory
```
```
wrangler dev
```
```
Error: ENOENT: ... '__WRANGLER_EXTERNAL_VECTORIZE_WORKER:<project>:<binding>'
```
```
Error: ENOENT: ... '__WRANGLER_EXTERNAL_VECTORIZE_WORKER:<project>:<binding>'
```
```
npm install -g wrangler@latest
```
```
npm install -g wrangler@latest
```
```
topK exceeds maximum allowed value
```
```
returnValues: false
```
```
returnMetadata: 'none'
```
```
returnValues: true
```
```
returnMetadata: 'all'
```
```
returnMetadata: 'indexed'
```
```
// ❌ ERROR - topK too high with returnValuesquery(embedding, {  topK: 100,            // Exceeds limit!  returnValues: true    // Max topK=20 when true});
```
```
// ❌ ERROR - topK too high with returnValuesquery(embedding, {  topK: 100,            // Exceeds limit!  returnValues: true    // Max topK=20 when true});
```
```
// ✅ OK - respects conditional limitquery(embedding, {  topK: 20,  returnValues: true});// ✅ OK - higher topK without valuesquery(embedding, {  topK: 100,  returnValues: false,  returnMetadata: 'indexed'});
```
```
// ✅ OK - respects conditional limitquery(embedding, {  topK: 20,  returnValues: true});// ✅ OK - higher topK without valuesquery(embedding, {  topK: 100,  returnValues: false,  returnMetadata: 'indexed'});
```
```
npm install -g wrangler@latest
```
```
returnMetadata
```
```
mutationId
```
```
wrangler vectorize --deprecated-v1
```
```
@cloudflare/vitest-pool-workers
```
```
wrapped binding module can't be resolved
```
```
wrangler-test.jsonc
```
```
// wrangler-test.jsonc (no Vectorize binding){  "name": "my-worker-test",  "main": "src/index.ts",  "compatibility_date": "2025-10-21"  // No vectorize binding}// vitest.config.tsimport { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config';export default defineWorkersProject({  test: {    poolOptions: {      workers: {        wrangler: {          configPath: "./wrangler-test.jsonc"        }      }    }  }});// Mock in testsimport { vi } from 'vitest';const mockVectorize = {  query: vi.fn().mockResolvedValue({    matches: [      { id: 'test-1', score: 0.95, metadata: { category: 'docs' } }    ],    count: 1  }),  insert: vi.fn().mockResolvedValue({ mutationId: "test-mutation-id" }),  upsert: vi.fn().mockResolvedValue({ mutationId: "test-mutation-id" })};// Use mock in teststest('vector search', async () => {  const env = { VECTORIZE_INDEX: mockVectorize };  // ... test logic});
```
```
// wrangler-test.jsonc (no Vectorize binding){  "name": "my-worker-test",  "main": "src/index.ts",  "compatibility_date": "2025-10-21"  // No vectorize binding}// vitest.config.tsimport { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config';export default defineWorkersProject({  test: {    poolOptions: {      workers: {        wrangler: {          configPath: "./wrangler-test.jsonc"        }      }    }  }});// Mock in testsimport { vi } from 'vitest';const mockVectorize = {  query: vi.fn().mockResolvedValue({    matches: [      { id: 'test-1', score: 0.95, metadata: { category: 'docs' } }    ],    count: 1  }),  insert: vi.fn().mockResolvedValue({ mutationId: "test-mutation-id" }),  upsert: vi.fn().mockResolvedValue({ mutationId: "test-mutation-id" })};// Use mock in teststest('vector search', async () => {  const env = { VECTORIZE_INDEX: mockVectorize };  // ... test logic});
```
```
$lt
```
```
$lte
```
```
$gt
```
```
$gte
```
```
// ❌ High-cardinality range at scalemetadata: {  timestamp_ms: 1704067200123}filter: { timestamp_ms: { $gte: 1704067200000 } }// ✅ Bucketed into discrete valuesmetadata: {  timestamp_bucket: "2025-01-01-00:00",  // 1-hour buckets  timestamp_ms: 1704067200123  // Original (non-indexed)}filter: {  timestamp_bucket: {    $in: ["2025-01-01-00:00", "2025-01-01-01:00"]  }}
```
```
// ❌ High-cardinality range at scalemetadata: {  timestamp_ms: 1704067200123}filter: { timestamp_ms: { $gte: 1704067200000 } }// ✅ Bucketed into discrete valuesmetadata: {  timestamp_bucket: "2025-01-01-00:00",  // 1-hour buckets  timestamp_ms: 1704067200123  // Original (non-indexed)}filter: {  timestamp_bucket: {    $in: ["2025-01-01-00:00", "2025-01-01-01:00"]  }}
```
```
$eq
```
```
$in
```
```
list-vectors
```
```
const result = await env.VECTORIZE_INDEX.list({  limit: 1000,  // Max 1000 per page  cursor?: string});// result.vectors: Array<{ id: string }>// result.cursor: string | undefined// result.count: number// Pagination examplelet cursor: string | undefined;const allVectorIds: string[] = [];do {  const result = await env.VECTORIZE_INDEX.list({    limit: 1000,    cursor  });  allVectorIds.push(...result.vectors.map(v => v.id));  cursor = result.cursor;} while (cursor);
```
```
const result = await env.VECTORIZE_INDEX.list({  limit: 1000,  // Max 1000 per page  cursor?: string});// result.vectors: Array<{ id: string }>// result.cursor: string | undefined// result.count: number// Pagination examplelet cursor: string | undefined;const allVectorIds: string[] = [];do {  const result = await env.VECTORIZE_INDEX.list({    limit: 1000,    cursor  });  allVectorIds.push(...result.vectors.map(v => v.id));  cursor = result.cursor;} while (cursor);
```
```
/* ❌ Expecting synchronous insert */await env.VECTORIZE.insert([{ id: '1', values: [...] }])// Assuming it's immediately queryable.../* ✅ Mutations return mutationId, are async */const { mutationId } = await env.VECTORIZE.insert([  { id: '1', values: [...], metadata: { title: 'Doc' } }])// May take a moment to be queryable
```
```
/* ❌ Expecting synchronous insert */await env.VECTORIZE.insert([{ id: '1', values: [...] }])// Assuming it's immediately queryable.../* ✅ Mutations return mutationId, are async */const { mutationId } = await env.VECTORIZE.insert([  { id: '1', values: [...], metadata: { title: 'Doc' } }])// May take a moment to be queryable
```
```
/* ❌ Old boolean syntax */const results = await env.VECTORIZE.query(vector, {  returnMetadata: true, // Error!})/* ✅ New enum syntax */const results = await env.VECTORIZE.query(vector, {  returnMetadata: 'all', // 'all' | 'indexed' | 'none'})
```
```
/* ❌ Old boolean syntax */const results = await env.VECTORIZE.query(vector, {  returnMetadata: true, // Error!})/* ✅ New enum syntax */const results = await env.VECTORIZE.query(vector, {  returnMetadata: 'all', // 'all' | 'indexed' | 'none'})
```
```
/* ❌ Vectors added before index won't be filterable */await env.VECTORIZE.insert([{ id: '1', values, metadata: { category: 'A' } }])// Then creating index... too late!/* ✅ Create index first, then insert */// 1. Create index in dashboard or wrangler// 2. Then insert vectorsawait env.VECTORIZE.insert([{ id: '1', values, metadata: { category: 'A' } }])// Now filtering works
```
```
/* ❌ Vectors added before index won't be filterable */await env.VECTORIZE.insert([{ id: '1', values, metadata: { category: 'A' } }])// Then creating index... too late!/* ✅ Create index first, then insert */// 1. Create index in dashboard or wrangler// 2. Then insert vectorsawait env.VECTORIZE.insert([{ id: '1', values, metadata: { category: 'A' } }])// Now filtering works
```
```
string
```
```
number
```
```
boolean
```
```
# Create metadata indexnpx wrangler vectorize create-metadata-index my-index --property-name=type --type=stringnpx wrangler vectorize create-metadata-index my-index --property-name=score --type=number
```
```
# Create metadata indexnpx wrangler vectorize create-metadata-index my-index --property-name=type --type=stringnpx wrangler vectorize create-metadata-index my-index --property-name=score --type=number
```
```
/* ❌ Dimension mismatch */// Index: 768 dimensions// Embedding: 1536 dimensions (OpenAI default)/* ✅ Match dimensions exactly */// BGE-base: 768 dimensions// OpenAI text-embedding-3-small: 1536 dimensions// OpenAI text-embedding-3-large: 3072 dimensions// Create index matching your embedding model:// wrangler vectorize create my-index --dimensions=768 --metric=cosine
```
```
/* ❌ Dimension mismatch */// Index: 768 dimensions// Embedding: 1536 dimensions (OpenAI default)/* ✅ Match dimensions exactly */// BGE-base: 768 dimensions// OpenAI text-embedding-3-small: 1536 dimensions// OpenAI text-embedding-3-large: 3072 dimensions// Create index matching your embedding model:// wrangler vectorize create my-index --dimensions=768 --metric=cosine
```
```
/* ❌ Filter exceeds 2048 bytes */const results = await env.VECTORIZE.query(vector, {  filter: { tags: veryLongArrayOfTags }, // May exceed limit})/* ✅ Simplify filters */const results = await env.VECTORIZE.query(vector, {  filter: { category: 'tech' }, // Keep filters simple})
```
```
/* ❌ Filter exceeds 2048 bytes */const results = await env.VECTORIZE.query(vector, {  filter: { tags: veryLongArrayOfTags }, // May exceed limit})/* ✅ Simplify filters */const results = await env.VECTORIZE.query(vector, {  filter: { category: 'tech' }, // Keep filters simple})
```
```
/* ⚠️ Cannot create new V1 indexes after December 2024 */// Migrate existing V1 indexes to V2
```
```
/* ⚠️ Cannot create new V1 indexes after December 2024 */// Migrate existing V1 indexes to V2
```
```
mutationId
```
```
returnMetadata: true
```
```
returnMetadata: 'all'
```
Leverage the power of Cloudflare's global network for your AI applications with the Cloudflare Vectorize Agent Skill. This skill provides comprehensive tools to interact with Vectorize, a cutting-edge vector database designed for lightning-fast semantic search and Retrieval Augmented Generation (RAG). By integrating seamlessly with Cloudflare Workers, developers can deploy robust AI-powered features directly at the edge, reducing latency and enhancing user experiences. It's an essential skill for building scalable, intelligent applications with Claude Code.

# When to Use This Skill
- •Building a real-time semantic search engine for product catalogs or large documentation sets.
- •Implementing a sophisticated RAG pipeline for an AI chatbot that retrieves context from a custom knowledge base.
- •Developing a personalized content recommendation system based on user interaction vectors.
- •Creating anomaly detection systems by identifying outlier data vectors in time series or sensor data.

# Pro Tips
- 💡Strategically use the 10 available metadata indexes per index to pre-filter vectors, significantly speeding up complex queries.
- 💡Combine Cloudflare Vectorize with Workers AI for on-edge embedding generation and storage, optimizing performance and reducing external API calls.
- 💡Regularly review vector dimensions and distance metrics (cosine, euclidean, dot-product) to match the specific needs of your embedding model and use case for optimal recall and precision.

