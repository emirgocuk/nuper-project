# cloudflare-r2
Source: https://antigravity.codes/agent-skills/backend/cloudflare-r2

## AI Worker Instructions
When the user requests functionality related to cloudflare-r2, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-r2
```
# 1. Create bucketnpx wrangler r2 bucket create my-bucket# 2. Add binding to wrangler.jsonc# {#   "r2_buckets": [{#     "binding": "MY_BUCKET",#     "bucket_name": "my-bucket",#     "preview_bucket_name": "my-bucket-preview"  // Optional: separate dev/prod#   }]# }# 3. Upload/download from Workertype Bindings = { MY_BUCKET: R2Bucket };// Uploadawait env.MY_BUCKET.put('file.txt', data, {  httpMetadata: { contentType: 'text/plain' }});// Downloadconst object = await env.MY_BUCKET.get('file.txt');if (!object) return c.json({ error: 'Not found' }, 404);return new Response(object.body, {  headers: {    'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',    'ETag': object.httpEtag,  },});# 4. Deploynpx wrangler deploy
```
```
# 1. Create bucketnpx wrangler r2 bucket create my-bucket# 2. Add binding to wrangler.jsonc# {#   "r2_buckets": [{#     "binding": "MY_BUCKET",#     "bucket_name": "my-bucket",#     "preview_bucket_name": "my-bucket-preview"  // Optional: separate dev/prod#   }]# }# 3. Upload/download from Workertype Bindings = { MY_BUCKET: R2Bucket };// Uploadawait env.MY_BUCKET.put('file.txt', data, {  httpMetadata: { contentType: 'text/plain' }});// Downloadconst object = await env.MY_BUCKET.get('file.txt');if (!object) return c.json({ error: 'Not found' }, 404);return new Response(object.body, {  headers: {    'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',    'ETag': object.httpEtag,  },});# 4. Deploynpx wrangler deploy
```
```
// put() - Upload objectsawait env.MY_BUCKET.put('file.txt', data, {  httpMetadata: {    contentType: 'text/plain',    cacheControl: 'public, max-age=3600',  },  customMetadata: { userId: '123' },  md5: await crypto.subtle.digest('MD5', data),  // Checksum verification});// Conditional upload (prevent overwrites)const object = await env.MY_BUCKET.put('file.txt', data, {  onlyIf: { uploadedBefore: new Date('2020-01-01') }});if (!object) return c.json({ error: 'File already exists' }, 409);// get() - Download objectsconst object = await env.MY_BUCKET.get('file.txt');if (!object) return c.json({ error: 'Not found' }, 404);const text = await object.text();           // As stringconst json = await object.json();           // As JSONconst buffer = await object.arrayBuffer();  // As ArrayBuffer// Range requests (partial downloads)const partial = await env.MY_BUCKET.get('video.mp4', {  range: { offset: 0, length: 1024 * 1024 }  // First 1MB});// head() - Get metadata only (no body download)const object = await env.MY_BUCKET.head('file.txt');console.log(object.size, object.etag, object.customMetadata);// delete() - Delete objectsawait env.MY_BUCKET.delete('file.txt');  // Single delete (idempotent)await env.MY_BUCKET.delete(['file1.txt', 'file2.txt']);  // Bulk delete (max 1000)// list() - List objectsconst listed = await env.MY_BUCKET.list({  prefix: 'images/',  // Filter by prefix  limit: 100,  cursor: cursor,     // Pagination  delimiter: '/',     // Folder-like listing  include: ['httpMetadata', 'customMetadata'],  // IMPORTANT: Opt-in for metadata});for (const object of listed.objects) {  console.log(${object.key}: ${object.size} bytes);  console.log(object.httpMetadata?.contentType);  // Now populated with include parameter  console.log(object.customMetadata);             // Now populated with include parameter}
```
```
// put() - Upload objectsawait env.MY_BUCKET.put('file.txt', data, {  httpMetadata: {    contentType: 'text/plain',    cacheControl: 'public, max-age=3600',  },  customMetadata: { userId: '123' },  md5: await crypto.subtle.digest('MD5', data),  // Checksum verification});// Conditional upload (prevent overwrites)const object = await env.MY_BUCKET.put('file.txt', data, {  onlyIf: { uploadedBefore: new Date('2020-01-01') }});if (!object) return c.json({ error: 'File already exists' }, 409);// get() - Download objectsconst object = await env.MY_BUCKET.get('file.txt');if (!object) return c.json({ error: 'Not found' }, 404);const text = await object.text();           // As stringconst json = await object.json();           // As JSONconst buffer = await object.arrayBuffer();  // As ArrayBuffer// Range requests (partial downloads)const partial = await env.MY_BUCKET.get('video.mp4', {  range: { offset: 0, length: 1024 * 1024 }  // First 1MB});// head() - Get metadata only (no body download)const object = await env.MY_BUCKET.head('file.txt');console.log(object.size, object.etag, object.customMetadata);// delete() - Delete objectsawait env.MY_BUCKET.delete('file.txt');  // Single delete (idempotent)await env.MY_BUCKET.delete(['file1.txt', 'file2.txt']);  // Bulk delete (max 1000)// list() - List objectsconst listed = await env.MY_BUCKET.list({  prefix: 'images/',  // Filter by prefix  limit: 100,  cursor: cursor,     // Pagination  delimiter: '/',     // Folder-like listing  include: ['httpMetadata', 'customMetadata'],  // IMPORTANT: Opt-in for metadata});for (const object of listed.objects) {  console.log(${object.key}: ${object.size} bytes);  console.log(object.httpMetadata?.contentType);  // Now populated with include parameter  console.log(object.customMetadata);             // Now populated with include parameter}
```
```
${object.key}: ${object.size} bytes
```
```
// 1. Create multipart uploadconst multipart = await env.MY_BUCKET.createMultipartUpload('large-file.zip', {  httpMetadata: { contentType: 'application/zip' }});// 2. Upload parts (5MB-100MB each, max 10,000 parts)const multipart = env.MY_BUCKET.resumeMultipartUpload(key, uploadId);const part1 = await multipart.uploadPart(1, chunk1);const part2 = await multipart.uploadPart(2, chunk2);// 3. Complete uploadconst object = await multipart.complete([  { partNumber: 1, etag: part1.etag },  { partNumber: 2, etag: part2.etag },]);// 4. Abort if neededawait multipart.abort();
```
```
// 1. Create multipart uploadconst multipart = await env.MY_BUCKET.createMultipartUpload('large-file.zip', {  httpMetadata: { contentType: 'application/zip' }});// 2. Upload parts (5MB-100MB each, max 10,000 parts)const multipart = env.MY_BUCKET.resumeMultipartUpload(key, uploadId);const part1 = await multipart.uploadPart(1, chunk1);const part2 = await multipart.uploadPart(2, chunk2);// 3. Complete uploadconst object = await multipart.complete([  { partNumber: 1, etag: part1.etag },  { partNumber: 2, etag: part2.etag },]);// 4. Abort if neededawait multipart.abort();
```
```
import { AwsClient } from 'aws4fetch';const r2Client = new AwsClient({  accessKeyId: env.R2_ACCESS_KEY_ID,  secretAccessKey: env.R2_SECRET_ACCESS_KEY,});const url = new URL(  https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${filename});url.searchParams.set('X-Amz-Expires', '3600');  // 1 hour expiryconst signed = await r2Client.sign(  new Request(url, { method: 'PUT' }),  // or 'GET' for downloads  { aws: { signQuery: true } });// Client uploads directly to R2await fetch(signed.url, { method: 'PUT', body: file });
```
```
import { AwsClient } from 'aws4fetch';const r2Client = new AwsClient({  accessKeyId: env.R2_ACCESS_KEY_ID,  secretAccessKey: env.R2_SECRET_ACCESS_KEY,});const url = new URL(  https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${filename});url.searchParams.set('X-Amz-Expires', '3600');  // 1 hour expiryconst signed = await r2Client.sign(  new Request(url, { method: 'PUT' }),  // or 'GET' for downloads  { aws: { signQuery: true } });// Client uploads directly to R2await fetch(signed.url, { method: 'PUT', body: file });
```
```
https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${filename}
```
```
users/${userId}/${filename}
```
```
// ❌ WRONG - Presigned URLs don't work with custom domainsconst url = new URL(https://cdn.example.com/${filename});const signed = await r2Client.sign(  new Request(url, { method: 'PUT' }),  { aws: { signQuery: true } });// This URL will fail - presigning requires S3 domain// ✅ CORRECT - Use R2 storage domain for presigned URLsconst url = new URL(  https://${accountId}.r2.cloudflarestorage.com/${filename});const signed = await r2Client.sign(  new Request(url, { method: 'PUT' }),  { aws: { signQuery: true } });// Pattern: Upload via presigned S3 URL, serve via custom domainasync function generateUploadUrl(filename: string) {  const uploadUrl = new URL(    https://${accountId}.r2.cloudflarestorage.com/${filename}  );  const signed = await r2Client.sign(    new Request(uploadUrl, { method: 'PUT' }),    { aws: { signQuery: true } }  );  return {    uploadUrl: signed.url,  // For client upload (S3 domain)    publicUrl: https://cdn.example.com/${filename}  // For serving (custom domain)  };}
```
```
// ❌ WRONG - Presigned URLs don't work with custom domainsconst url = new URL(https://cdn.example.com/${filename});const signed = await r2Client.sign(  new Request(url, { method: 'PUT' }),  { aws: { signQuery: true } });// This URL will fail - presigning requires S3 domain// ✅ CORRECT - Use R2 storage domain for presigned URLsconst url = new URL(  https://${accountId}.r2.cloudflarestorage.com/${filename});const signed = await r2Client.sign(  new Request(url, { method: 'PUT' }),  { aws: { signQuery: true } });// Pattern: Upload via presigned S3 URL, serve via custom domainasync function generateUploadUrl(filename: string) {  const uploadUrl = new URL(    https://${accountId}.r2.cloudflarestorage.com/${filename}  );  const signed = await r2Client.sign(    new Request(uploadUrl, { method: 'PUT' }),    { aws: { signQuery: true } }  );  return {    uploadUrl: signed.url,  // For client upload (S3 domain)    publicUrl: https://cdn.example.com/${filename}  // For serving (custom domain)  };}
```
```
https://cdn.example.com/${filename}
```
```
https://${accountId}.r2.cloudflarestorage.com/${filename}
```
```
https://${accountId}.r2.cloudflarestorage.com/${filename}
```
```
https://cdn.example.com/${filename}
```
```
# With wrong permissions:export CLOUDFLARE_API_TOKEN="token_with_object_readwrite"wrangler r2 object put my-bucket/file.txt --file=./file.txt --remote# ✘ [ERROR] Failed to fetch - 403: Forbidden# With correct permissions (Admin Read & Write):wrangler r2 object put my-bucket/file.txt --file=./file.txt --remote# ✔ Success
```
```
# With wrong permissions:export CLOUDFLARE_API_TOKEN="token_with_object_readwrite"wrangler r2 object put my-bucket/file.txt --file=./file.txt --remote# ✘ [ERROR] Failed to fetch - 403: Forbidden# With correct permissions (Admin Read & Write):wrangler r2 object put my-bucket/file.txt --file=./file.txt --remote# ✔ Success
```
```
[{  "AllowedOrigins": ["https://example.com"],  "AllowedMethods": ["GET", "PUT"],  "AllowedHeaders": ["*"],  "ExposeHeaders": ["ETag"],  "MaxAgeSeconds": 3600}]
```
```
[{  "AllowedOrigins": ["https://example.com"],  "AllowedMethods": ["GET", "PUT"],  "AllowedHeaders": ["*"],  "ExposeHeaders": ["ETag"],  "MaxAgeSeconds": 3600}]
```
```
wrangler r2 bucket cors
```
```
{  "rules": [{    "allowed": {      "origins": ["https://www.example.com"],      "methods": ["GET", "PUT"],      "headers": ["Content-Type", "Authorization"]    },    "exposeHeaders": ["ETag", "Content-Length"],    "maxAgeSeconds": 8640  }]}
```
```
{  "rules": [{    "allowed": {      "origins": ["https://www.example.com"],      "methods": ["GET", "PUT"],      "headers": ["Content-Type", "Authorization"]    },    "exposeHeaders": ["ETag", "Content-Length"],    "maxAgeSeconds": 8640  }]}
```
```
# Using CLI formatwrangler r2 bucket cors set my-bucket --file cors-config.json# Error if using Dashboard format:# "The CORS configuration file must contain a 'rules' array"
```
```
# Using CLI formatwrangler r2 bucket cors set my-bucket --file cors-config.json# Error if using Dashboard format:# "The CORS configuration file must contain a 'rules' array"
```
```
// Bucket CORS (set via dashboard or wrangler){  "rules": [{    "allowed": {      "origins": ["https://app.example.com"],      "methods": ["GET", "PUT"],      "headers": ["Content-Type"]    },    "maxAgeSeconds": 3600  }]}// Additional CORS via Transform Rules (Dashboard → Rules → Transform Rules)// Modify Response Header: Access-Control-Allow-Origin: https://app.example.com// Order of CORS evaluation:// 1. R2 bucket CORS (if presigned URL or direct R2 access)// 2. Transform Rules CORS (if via custom domain)
```
```
// Bucket CORS (set via dashboard or wrangler){  "rules": [{    "allowed": {      "origins": ["https://app.example.com"],      "methods": ["GET", "PUT"],      "headers": ["Content-Type"]    },    "maxAgeSeconds": 3600  }]}// Additional CORS via Transform Rules (Dashboard → Rules → Transform Rules)// Modify Response Header: Access-Control-Allow-Origin: https://app.example.com// Order of CORS evaluation:// 1. R2 bucket CORS (if presigned URL or direct R2 access)// 2. Transform Rules CORS (if via custom domain)
```
```
// HTTP metadata (standard headers)await env.MY_BUCKET.put('file.pdf', data, {  httpMetadata: {    contentType: 'application/pdf',    cacheControl: 'public, max-age=31536000, immutable',    contentDisposition: 'attachment; filename="report.pdf"',    contentEncoding: 'gzip',  },  customMetadata: {    userId: '12345',    version: '1.0',  }  // Max 2KB total, keys/values must be strings});// Read metadataconst object = await env.MY_BUCKET.head('file.pdf');console.log(object.httpMetadata, object.customMetadata);
```
```
// HTTP metadata (standard headers)await env.MY_BUCKET.put('file.pdf', data, {  httpMetadata: {    contentType: 'application/pdf',    cacheControl: 'public, max-age=31536000, immutable',    contentDisposition: 'attachment; filename="report.pdf"',    contentEncoding: 'gzip',  },  customMetadata: {    userId: '12345',    version: '1.0',  }  // Max 2KB total, keys/values must be strings});// Read metadataconst object = await env.MY_BUCKET.head('file.pdf');console.log(object.httpMetadata, object.customMetadata);
```
```
try {  await env.MY_BUCKET.put(key, data);} catch (error: any) {  const message = error.message;  if (message.includes('R2_ERROR')) {    // Generic R2 error  } else if (message.includes('exceeded')) {    // Quota exceeded  } else if (message.includes('precondition')) {    // Conditional operation failed  } else if (message.includes('multipart')) {    // Multipart upload error  }  console.error('R2 Error:', message);  return c.json({ error: 'Storage operation failed' }, 500);}
```
```
try {  await env.MY_BUCKET.put(key, data);} catch (error: any) {  const message = error.message;  if (message.includes('R2_ERROR')) {    // Generic R2 error  } else if (message.includes('exceeded')) {    // Quota exceeded  } else if (message.includes('precondition')) {    // Conditional operation failed  } else if (message.includes('multipart')) {    // Multipart upload error  }  console.error('R2 Error:', message);  return c.json({ error: 'Storage operation failed' }, 500);}
```
```
async function r2WithRetry<T>(  operation: () => Promise<T>,  maxRetries = 5): Promise<T> {  for (let attempt = 0; attempt < maxRetries; attempt++) {    try {      return await operation();    } catch (error: any) {      const message = error.message;      // Retry on transient errors and platform issues      const is5xxError =        message.includes('500') ||        message.includes('502') ||        message.includes('503') ||        message.includes('504');      const isRetryable =        is5xxError ||        message.includes('network') ||        message.includes('timeout') ||        message.includes('temporarily unavailable');      if (!isRetryable || attempt === maxRetries - 1) {        throw error;      }      // Exponential backoff (longer for platform errors)      // 5xx errors: 1s, 2s, 4s, 8s, 16s (up to 31s total)      // Other errors: 1s, 2s, 4s, 5s, 5s (up to 17s total)      const delay = is5xxError        ? Math.min(1000 * Math.pow(2, attempt), 16000)        : Math.min(1000 * Math.pow(2, attempt), 5000);      await new Promise(resolve => setTimeout(resolve, delay));    }  }  throw new Error('Max retries exceeded');}// Usageconst object = await r2WithRetry(() =>  env.MY_BUCKET.get('important-file.txt'));
```
```
async function r2WithRetry<T>(  operation: () => Promise<T>,  maxRetries = 5): Promise<T> {  for (let attempt = 0; attempt < maxRetries; attempt++) {    try {      return await operation();    } catch (error: any) {      const message = error.message;      // Retry on transient errors and platform issues      const is5xxError =        message.includes('500') ||        message.includes('502') ||        message.includes('503') ||        message.includes('504');      const isRetryable =        is5xxError ||        message.includes('network') ||        message.includes('timeout') ||        message.includes('temporarily unavailable');      if (!isRetryable || attempt === maxRetries - 1) {        throw error;      }      // Exponential backoff (longer for platform errors)      // 5xx errors: 1s, 2s, 4s, 8s, 16s (up to 31s total)      // Other errors: 1s, 2s, 4s, 5s, 5s (up to 17s total)      const delay = is5xxError        ? Math.min(1000 * Math.pow(2, attempt), 16000)        : Math.min(1000 * Math.pow(2, attempt), 5000);      await new Promise(resolve => setTimeout(resolve, delay));    }  }  throw new Error('Max retries exceeded');}// Usageconst object = await r2WithRetry(() =>  env.MY_BUCKET.get('important-file.txt'));
```
```
// Batch delete (up to 1000 keys)await env.MY_BUCKET.delete(['file1.txt', 'file2.txt', 'file3.txt']);// Range requests for large filesconst partial = await env.MY_BUCKET.get('video.mp4', {  range: { offset: 0, length: 10 * 1024 * 1024 }  // First 10MB});// Cache headers for immutable assetsawait env.MY_BUCKET.put('static/app.abc123.js', jsData, {  httpMetadata: { cacheControl: 'public, max-age=31536000, immutable' }});// Checksums for data integrityconst md5Hash = await crypto.subtle.digest('MD5', fileData);await env.MY_BUCKET.put('important.dat', fileData, { md5: md5Hash });
```
```
// Batch delete (up to 1000 keys)await env.MY_BUCKET.delete(['file1.txt', 'file2.txt', 'file3.txt']);// Range requests for large filesconst partial = await env.MY_BUCKET.get('video.mp4', {  range: { offset: 0, length: 10 * 1024 * 1024 }  // First 10MB});// Cache headers for immutable assetsawait env.MY_BUCKET.put('static/app.abc123.js', jsData, {  httpMetadata: { cacheControl: 'public, max-age=31536000, immutable' }});// Checksums for data integrityconst md5Hash = await crypto.subtle.digest('MD5', fileData);await env.MY_BUCKET.put('important.dat', fileData, { md5: md5Hash });
```
```
// ❌ BAD: Multiple Workers writing to same key rapidlyasync function logToSharedFile(env: Env, logEntry: string) {  const existing = await env.LOGS.get('global-log.txt');  const content = (await existing?.text()) || '';  await env.LOGS.put('global-log.txt', content + logEntry);  // High write frequency to same key = 429 errors}// ✅ GOOD: Shard by timestamp or ID (distribute writes)async function logWithSharding(env: Env, logEntry: string) {  const timestamp = Date.now();  const shard = Math.floor(timestamp / 60000); // 1-minute shards  await env.LOGS.put(logs/${shard}.txt, logEntry, {    customMetadata: { timestamp: timestamp.toString() }  });  // Different keys = no rate limiting}// ✅ ALTERNATIVE: Use Durable Objects for append operations// Durable Objects can handle high-frequency updates to same state// ✅ ALTERNATIVE: Use Queues + batch processing// Buffer writes and batch them with unique keys
```
```
// ❌ BAD: Multiple Workers writing to same key rapidlyasync function logToSharedFile(env: Env, logEntry: string) {  const existing = await env.LOGS.get('global-log.txt');  const content = (await existing?.text()) || '';  await env.LOGS.put('global-log.txt', content + logEntry);  // High write frequency to same key = 429 errors}// ✅ GOOD: Shard by timestamp or ID (distribute writes)async function logWithSharding(env: Env, logEntry: string) {  const timestamp = Date.now();  const shard = Math.floor(timestamp / 60000); // 1-minute shards  await env.LOGS.put(logs/${shard}.txt, logEntry, {    customMetadata: { timestamp: timestamp.toString() }  });  // Different keys = no rate limiting}// ✅ ALTERNATIVE: Use Durable Objects for append operations// Durable Objects can handle high-frequency updates to same state// ✅ ALTERNATIVE: Use Queues + batch processing// Buffer writes and batch them with unique keys
```
```
logs/${shard}.txt
```
```
{bucket}.{account}.r2.cloudflarestorage.com
```
```
// ❌ NOT for production - r2.dev endpointconst publicUrl = https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key};// This will be rate limited in production// ✅ Production: Custom domainconst productionUrl = https://cdn.example.com/${key};// Setup custom domain:// 1. Dashboard → R2 → Bucket → Settings → Custom Domains// 2. Add your domain (e.g., cdn.example.com)// 3. Benefits://    - No rate limiting beyond account limits//    - Cloudflare Cache support//    - Custom cache rules via Workers//    - Full CDN features
```
```
// ❌ NOT for production - r2.dev endpointconst publicUrl = https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key};// This will be rate limited in production// ✅ Production: Custom domainconst productionUrl = https://cdn.example.com/${key};// Setup custom domain:// 1. Dashboard → R2 → Bucket → Settings → Custom Domains// 2. Add your domain (e.g., cdn.example.com)// 3. Benefits://    - No rate limiting beyond account limits//    - Cloudflare Cache support//    - Custom cache rules via Workers//    - Full CDN features
```
```
https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}
```
```
https://cdn.example.com/${key}
```
```
contentType
```
```
head()
```
```
include
```
```
list()
```
```
contentType
```
```
// Option 1: Per-tenant buckets (now scalable to 1M tenants)const bucketName = tenant-${tenantId};const bucket = env[bucketName]; // Dynamic binding// Option 2: Key prefixing (still preferred for most use cases)await env.MY_BUCKET.put(tenants/${tenantId}/file.txt, data);// Choose based on:// - Per-tenant buckets: Strong isolation, separate billing/quotas// - Key prefixing: Simpler, fewer resources, easier to manage
```
```
// Option 1: Per-tenant buckets (now scalable to 1M tenants)const bucketName = tenant-${tenantId};const bucket = env[bucketName]; // Dynamic binding// Option 2: Key prefixing (still preferred for most use cases)await env.MY_BUCKET.put(tenants/${tenantId}/file.txt, data);// Choose based on:// - Per-tenant buckets: Strong isolation, separate billing/quotas// - Key prefixing: Simpler, fewer resources, easier to manage
```
```
tenant-${tenantId}
```
```
tenants/${tenantId}/file.txt
```
```
httpMetadata.contentType
```
```
X-Amz-Expires
```
```
httpMetadata
```
```
include: ['httpMetadata', 'customMetadata']
```
```
rules
```
```
wrangler dev
```
```
.wrangler/state/v3/r2/{bucket-name}/blobs/
```
```
# Symptom: .wrangler/state grows large during developmentdu -sh .wrangler/state/v3/r2/# Fix: Manually cleanup local R2 storagerm -rf .wrangler/state/v3/r2/# Alternative: Use remote R2 for developmentwrangler dev --remote
```
```
# Symptom: .wrangler/state grows large during developmentdu -sh .wrangler/state/v3/r2/# Fix: Manually cleanup local R2 storagerm -rf .wrangler/state/v3/r2/# Alternative: Use remote R2 for developmentwrangler dev --remote
```
```
--remote
```
```
.get()
```
```
get()
```
```
put()
```
```
# If experiencing issues with remote R2 in local dev:# Option 1: Use local buckets instead (recommended)wrangler dev  # No --remote flag# Option 2: Deploy to preview environment for testingwrangler deploy --env preview# Option 3: Add retry logic if must use --remoteasync function safeGet(bucket: R2Bucket, key: string) {  for (let i = 0; i < 3; i++) {    const obj = await bucket.get(key);    if (obj && obj.body) return obj;    await new Promise(r => setTimeout(r, 1000));  }  throw new Error('Failed to get object after retries');}
```
```
# If experiencing issues with remote R2 in local dev:# Option 1: Use local buckets instead (recommended)wrangler dev  # No --remote flag# Option 2: Deploy to preview environment for testingwrangler deploy --env preview# Option 3: Add retry logic if must use --remoteasync function safeGet(bucket: R2Bucket, key: string) {  for (let i = 0; i < 3; i++) {    const obj = await bucket.get(key);    if (obj && obj.body) return obj;    await new Promise(r => setTimeout(r, 1000));  }  throw new Error('Failed to get object after retries');}
```
```
# Bucket managementwrangler r2 bucket create <BUCKET_NAME>wrangler r2 bucket listwrangler r2 bucket delete <BUCKET_NAME># Object managementwrangler r2 object put <BUCKET_NAME>/<KEY> --file=<FILE_PATH>wrangler r2 object get <BUCKET_NAME>/<KEY> --file=<OUTPUT_PATH>wrangler r2 object delete <BUCKET_NAME>/<KEY># List objectswrangler r2 object list <BUCKET_NAME>wrangler r2 object list <BUCKET_NAME> --prefix="folder/"
```
```
# Bucket managementwrangler r2 bucket create <BUCKET_NAME>wrangler r2 bucket listwrangler r2 bucket delete <BUCKET_NAME># Object managementwrangler r2 object put <BUCKET_NAME>/<KEY> --file=<FILE_PATH>wrangler r2 object get <BUCKET_NAME>/<KEY> --file=<OUTPUT_PATH>wrangler r2 object delete <BUCKET_NAME>/<KEY># List objectswrangler r2 object list <BUCKET_NAME>wrangler r2 object list <BUCKET_NAME> --prefix="folder/"
```
```
/* ❌ Files download as binary */await env.BUCKET.put('image.jpg', imageData)/* ✅ Set httpMetadata.contentType */await env.BUCKET.put('image.jpg', imageData, {  httpMetadata: { contentType: 'image/jpeg' },})
```
```
/* ❌ Files download as binary */await env.BUCKET.put('image.jpg', imageData)/* ✅ Set httpMetadata.contentType */await env.BUCKET.put('image.jpg', imageData, {  httpMetadata: { contentType: 'image/jpeg' },})
```
```
/* ❌ Part too small or too large */// Parts < 5MB or > 100MB will fail/* ✅ Keep parts between 5MB and 100MB */const PART_SIZE = 10 * 1024 * 1024 // 10MB recommended
```
```
/* ❌ Part too small or too large */// Parts < 5MB or > 100MB will fail/* ✅ Keep parts between 5MB and 100MB */const PART_SIZE = 10 * 1024 * 1024 // 10MB recommended
```
```
/* ❌ Keys in frontend */const s3 = new S3Client({  credentials: { accessKeyId, secretAccessKey }, // In browser!})/* ✅ Generate presigned URLs server-side only */// Worker generates URL, sends to clientconst presignedUrl = await generatePresignedUrl(key, { expiresIn: 3600 })return new Response(JSON.stringify({ uploadUrl: presignedUrl }))
```
```
/* ❌ Keys in frontend */const s3 = new S3Client({  credentials: { accessKeyId, secretAccessKey }, // In browser!})/* ✅ Generate presigned URLs server-side only */// Worker generates URL, sends to clientconst presignedUrl = await generatePresignedUrl(key, { expiresIn: 3600 })return new Response(JSON.stringify({ uploadUrl: presignedUrl }))
```
```
/* ❌ More than 1000 keys */await env.BUCKET.delete(arrayOf2000Keys)/* ✅ Chunk into batches of 1000 */for (const batch of chunks(keys, 1000)) {  await env.BUCKET.delete(batch)}
```
```
/* ❌ More than 1000 keys */await env.BUCKET.delete(arrayOf2000Keys)/* ✅ Chunk into batches of 1000 */for (const batch of chunks(keys, 1000)) {  await env.BUCKET.delete(batch)}
```
```
/* ❌ Downloads entire object */const obj = await env.BUCKET.get(key)const size = obj?.size/* ✅ Use head() to get metadata without body */const head = await env.BUCKET.head(key)const size = head?.size
```
```
/* ❌ Downloads entire object */const obj = await env.BUCKET.get(key)const size = obj?.size/* ✅ Use head() to get metadata without body */const head = await env.BUCKET.head(key)const size = head?.size
```
```
/* ✅ Prevent accidental overwrites */await env.BUCKET.put(key, data, {  onlyIf: { etagDoesNotMatch: '*' }, // Only if doesn't exist})
```
```
/* ✅ Prevent accidental overwrites */await env.BUCKET.put(key, data, {  onlyIf: { etagDoesNotMatch: '*' }, // Only if doesn't exist})
```
```
contentType
```
```
httpMetadata.contentType
```
```
get()
```
```
head()
```
This skill empowers your AI agent to seamlessly interact with Cloudflare R2, their S3-compatible object storage service. Designed for developers building serverless applications, it provides the necessary commands and configuration guidance to provision buckets, manage data, and integrate R2 with Cloudflare Workers. With support for advanced features like R2 SQL for data querying, real-time event notifications, and S3 API enhancements, this skill significantly streamlines the development and deployment of robust, distributed storage solutions, allowing you to focus on application logic rather than infrastructure complexities.

# When to Use This Skill
- •Provisioning and managing Cloudflare R2 buckets for serverless application data.
- •Integrating R2 with Cloudflare Workers for dynamic content delivery or backend processing.
- •Utilizing R2 SQL for querying data stored in Apache Iceberg tables.
- •Setting up event notifications for real-time data processing workflows.

# Pro Tips
- 💡Always define R2 bucket bindings in `wrangler.jsonc` and reference them using `env.MY_BUCKET` in your Worker scripts for secure and efficient access.
- 💡Explore R2 SQL and the Data Catalog for powerful serverless data analytics directly on your object storage, reducing the need for separate data warehouses.
- 💡Leverage Event Notifications and Cloudflare Queues to build highly scalable, event-driven architectures around your R2 data.

