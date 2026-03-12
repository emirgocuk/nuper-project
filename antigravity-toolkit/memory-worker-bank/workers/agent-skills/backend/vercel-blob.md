# vercel-blob
Source: https://antigravity.codes/agent-skills/backend/vercel-blob

## AI Worker Instructions
When the user requests functionality related to vercel-blob, follow these guidelines and utilize this context.

## Scraped Content

# vercel-blob
```
# Create Blob store: Vercel Dashboard → Storage → Blobvercel env pull .env.local  # Creates BLOB_READ_WRITE_TOKENnpm install @vercel/blob
```
```
# Create Blob store: Vercel Dashboard → Storage → Blobvercel env pull .env.local  # Creates BLOB_READ_WRITE_TOKENnpm install @vercel/blob
```
```
'use server';import { put } from '@vercel/blob';export async function uploadFile(formData: FormData) {  const file = formData.get('file') as File;  const blob = await put(file.name, file, { access: 'public' });  return blob.url;}
```
```
'use server';import { put } from '@vercel/blob';export async function uploadFile(formData: FormData) {  const file = formData.get('file') as File;  const blob = await put(file.name, file, { access: 'public' });  return blob.url;}
```
```
BLOB_READ_WRITE_TOKEN
```
```
handleUpload()
```
```
'use server';import { handleUpload } from '@vercel/blob/client';export async function getUploadToken(filename: string) {  return await handleUpload({    body: {      type: 'blob.generate-client-token',      payload: { pathname: uploads/${filename}, access: 'public' }    },    request: new Request('https://dummy'),    onBeforeGenerateToken: async (pathname) => ({      allowedContentTypes: ['image/jpeg', 'image/png'],      maximumSizeInBytes: 5 * 1024 * 1024    })  });}
```
```
'use server';import { handleUpload } from '@vercel/blob/client';export async function getUploadToken(filename: string) {  return await handleUpload({    body: {      type: 'blob.generate-client-token',      payload: { pathname: uploads/${filename}, access: 'public' }    },    request: new Request('https://dummy'),    onBeforeGenerateToken: async (pathname) => ({      allowedContentTypes: ['image/jpeg', 'image/png'],      maximumSizeInBytes: 5 * 1024 * 1024    })  });}
```
```
uploads/${filename}
```
```
'use client';import { upload } from '@vercel/blob/client';const tokenResponse = await getUploadToken(file.name);const blob = await upload(file.name, file, {  access: 'public',  handleUploadUrl: tokenResponse.url});
```
```
'use client';import { upload } from '@vercel/blob/client';const tokenResponse = await getUploadToken(file.name);const blob = await upload(file.name, file, {  access: 'public',  handleUploadUrl: tokenResponse.url});
```
```
import { list, del } from '@vercel/blob';// List with paginationconst { blobs, cursor } = await list({ prefix: 'uploads/', cursor });// Deleteawait del(blobUrl);
```
```
import { list, del } from '@vercel/blob';// List with paginationconst { blobs, cursor } = await list({ prefix: 'uploads/', cursor });// Deleteawait del(blobUrl);
```
```
import { createMultipartUpload, uploadPart, completeMultipartUpload } from '@vercel/blob';const upload = await createMultipartUpload('large-video.mp4', { access: 'public' });// Upload chunks in loop...await completeMultipartUpload({ uploadId: upload.uploadId, parts });
```
```
import { createMultipartUpload, uploadPart, completeMultipartUpload } from '@vercel/blob';const upload = await createMultipartUpload('large-video.mp4', { access: 'public' });// Upload chunks in loop...await completeMultipartUpload({ uploadId: upload.uploadId, parts });
```
```
handleUpload()
```
```
BLOB_READ_WRITE_TOKEN
```
```
avatars/
```
```
uploads/
```
```
BLOB_READ_WRITE_TOKEN
```
```
Error: BLOB_READ_WRITE_TOKEN is not defined
```
```
vercel env pull .env.local
```
```
.env.local
```
```
.gitignore
```
```
BLOB_READ_WRITE_TOKEN
```
```
handleUpload()
```
```
Error: File size exceeds limit
```
```
contentType
```
```
contentType: file.type
```
```
access: 'private'
```
```
access: 'public'
```
```
cursor
```
```
put()
```
```
Error: Request timeout
```
```
put()
```
```
handleUpload()
```
```
// ❌ Server-side upload fails at 4.5MBexport async function POST(request: Request) {  const formData = await request.formData();  const file = formData.get('file') as File; // Fails if >4.5MB  await put(file.name, file, { access: 'public' });}// ✅ Client upload bypasses 4.5MB limit (supports up to 500MB)const blob = await upload(file.name, file, {  access: 'public',  handleUploadUrl: '/api/upload/token',  multipart: true, // For files >500MB, use multipart});
```
```
// ❌ Server-side upload fails at 4.5MBexport async function POST(request: Request) {  const formData = await request.formData();  const file = formData.get('file') as File; // Fails if >4.5MB  await put(file.name, file, { access: 'public' });}// ✅ Client upload bypasses 4.5MB limit (supports up to 500MB)const blob = await upload(file.name, file, {  access: 'public',  handleUploadUrl: '/api/upload/token',  multipart: true, // For files >500MB, use multipart});
```
```

```
```

```
```
or
```
```
.### Issue #10: Missing Upload Callback**Error**: Upload completes but app state not updated**Source**: https://vercel.com/docs/storage/vercel-blob/client-upload#callback-after-upload**Why It Happens**: Not implementing
```
```
callback**Prevention**: Use
```
```
in
```
```
to update database/state.### Issue #11: Client Upload Token Expiration for Large Files**Error**:
```
```
**Source**: [GitHub Issue #443](https://github.com/vercel/storage/issues/443)**Why It Happens**: Default token expires after 30 seconds. Large files (>100MB) take longer to upload, causing token expiration before validation.**Prevention**: Set
```
```
parameter for large file uploads.// For large files (>100MB), extend token expirationconst jsonResponse = await handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname) => {    return {      maximumSizeInBytes: 200 * 1024 * 1024,      validUntil: Date.now() + 300000, // 5 minutes    };  },});### Issue #12: v2.0.0 Breaking Change - onUploadCompleted Requires callbackUrl (Non-Vercel Hosting)**Error**: onUploadCompleted callback doesn't fire when not hosted on Vercel**Source**: [Release Notes @vercel/blob@2.0.0](https://github.com/vercel/storage/releases/tag/%40vercel/blob%402.0.0)**Why It Happens**: v2.0.0 removed automatic callback URL inference from client-side
```
```
// For large files (>100MB), extend token expirationconst jsonResponse = await handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname) => {    return {      maximumSizeInBytes: 200 * 1024 * 1024,      validUntil: Date.now() + 300000, // 5 minutes    };  },});
```
```
// For large files (>100MB), extend token expirationconst jsonResponse = await handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname) => {    return {      maximumSizeInBytes: 200 * 1024 * 1024,      validUntil: Date.now() + 300000, // 5 minutes    };  },});
```
```
for security. When not using Vercel system environment variables, you must explicitly provide
```
```
.**Prevention**: Explicitly provide
```
```
in
```
```
for non-Vercel hosting.// v2.0.0+ for non-Vercel hostingawait handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname) => {    return {      callbackUrl: 'https://example.com', // Required for non-Vercel hosting    };  },  onUploadCompleted: async ({ blob, tokenPayload }) => {    // Now fires correctly  },});// For local development with ngrok:// VERCEL_BLOB_CALLBACK_URL=https://abc123.ngrok-free.app### Issue #13: ReadableStream Upload Not Supported in Firefox**Error**: Upload never completes in Firefox**Source**: [GitHub Issue #881](https://github.com/vercel/storage/issues/881)**Why It Happens**: The TypeScript interface accepts
```
```
// v2.0.0+ for non-Vercel hostingawait handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname) => {    return {      callbackUrl: 'https://example.com', // Required for non-Vercel hosting    };  },  onUploadCompleted: async ({ blob, tokenPayload }) => {    // Now fires correctly  },});// For local development with ngrok:// VERCEL_BLOB_CALLBACK_URL=https://abc123.ngrok-free.app
```
```
// v2.0.0+ for non-Vercel hostingawait handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname) => {    return {      callbackUrl: 'https://example.com', // Required for non-Vercel hosting    };  },  onUploadCompleted: async ({ blob, tokenPayload }) => {    // Now fires correctly  },});// For local development with ngrok:// VERCEL_BLOB_CALLBACK_URL=https://abc123.ngrok-free.app
```
```
as a body type, but Firefox does not support
```
```
as a fetch body.**Prevention**: Convert stream to Blob or ArrayBuffer for cross-browser support.// ❌ Works in Chrome/Edge, hangs in Firefoxconst stream = new ReadableStream({ /* ... */ });await put('file.bin', stream, { access: 'public' }); // Never completes in Firefox// ✅ Convert stream to Blob for cross-browser supportconst chunks: Uint8Array[] = [];const reader = stream.getReader();while (true) {  const { done, value } = await reader.read();  if (done) break;  chunks.push(value);}const blob = new Blob(chunks);await put('file.bin', blob, { access: 'public' });### Issue #14: Pathname Cannot Be Modified in onBeforeGenerateToken**Error**: File uploaded to wrong path despite server-side pathname override attempt**Source**: [GitHub Issue #863](https://github.com/vercel/storage/issues/863)**Why It Happens**: The
```
```
// ❌ Works in Chrome/Edge, hangs in Firefoxconst stream = new ReadableStream({ /* ... */ });await put('file.bin', stream, { access: 'public' }); // Never completes in Firefox// ✅ Convert stream to Blob for cross-browser supportconst chunks: Uint8Array[] = [];const reader = stream.getReader();while (true) {  const { done, value } = await reader.read();  if (done) break;  chunks.push(value);}const blob = new Blob(chunks);await put('file.bin', blob, { access: 'public' });
```
```
// ❌ Works in Chrome/Edge, hangs in Firefoxconst stream = new ReadableStream({ /* ... */ });await put('file.bin', stream, { access: 'public' }); // Never completes in Firefox// ✅ Convert stream to Blob for cross-browser supportconst chunks: Uint8Array[] = [];const reader = stream.getReader();while (true) {  const { done, value } = await reader.read();  if (done) break;  chunks.push(value);}const blob = new Blob(chunks);await put('file.bin', blob, { access: 'public' });
```
```
parameter in
```
```
cannot be changed. It's set at
```
```
time on the client side.**Prevention**: Construct pathname on client, validate on server. Use
```
```
to pass metadata.// Client: Construct pathname before uploadawait upload(uploads/${Date.now()}-${file.name}, file, {  access: 'public',  handleUploadUrl: '/api/upload',  clientPayload: JSON.stringify({ userId: '123' }),});// Server: Validate pathname matches expected patternawait handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname, clientPayload) => {    const { userId } = JSON.parse(clientPayload || '{}');    // Validate pathname starts with expected prefix    if (!pathname.startsWith(uploads/)) {      throw new Error('Invalid upload path');    }    return {      allowedContentTypes: ['image/jpeg', 'image/png'],      tokenPayload: JSON.stringify({ userId }), // Pass to onUploadCompleted    };  },});### Issue #15: Multipart Upload Minimum Chunk Size (5MB)**Error**: Manual multipart upload fails with small chunks**Source**: [Official Docs](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk#manual) + [Community Discussion](https://community.vercel.com/t/4-5-mb-payload-limit/10500)**Why It Happens**: Each part in manual multipart upload must be at least 5MB (except the last part). This conflicts with Vercel's 4.5MB serverless function limit, making manual multipart uploads impossible via server-side routes.**Prevention**: Use automatic multipart (
```
```
// Client: Construct pathname before uploadawait upload(uploads/${Date.now()}-${file.name}, file, {  access: 'public',  handleUploadUrl: '/api/upload',  clientPayload: JSON.stringify({ userId: '123' }),});// Server: Validate pathname matches expected patternawait handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname, clientPayload) => {    const { userId } = JSON.parse(clientPayload || '{}');    // Validate pathname starts with expected prefix    if (!pathname.startsWith(uploads/)) {      throw new Error('Invalid upload path');    }    return {      allowedContentTypes: ['image/jpeg', 'image/png'],      tokenPayload: JSON.stringify({ userId }), // Pass to onUploadCompleted    };  },});
```
```
// Client: Construct pathname before uploadawait upload(
```
```
, file, {  access: 'public',  handleUploadUrl: '/api/upload',  clientPayload: JSON.stringify({ userId: '123' }),});// Server: Validate pathname matches expected patternawait handleUpload({  body,  request,  onBeforeGenerateToken: async (pathname, clientPayload) => {    const { userId } = JSON.parse(clientPayload || '{}');    // Validate pathname starts with expected prefix    if (!pathname.startsWith(
```
```
)) {      throw new Error('Invalid upload path');    }    return {      allowedContentTypes: ['image/jpeg', 'image/png'],      tokenPayload: JSON.stringify({ userId }), // Pass to onUploadCompleted    };  },});
```
```
in
```
```
) or client uploads.// ❌ Manual multipart upload fails (can't upload 5MB chunks via serverless function)const upload = await createMultipartUpload('large.mp4', { access: 'public' });// uploadPart() requires 5MB minimum - hits serverless limit// ✅ Use automatic multipart via client uploadawait upload('large.mp4', file, {  access: 'public',  handleUploadUrl: '/api/upload',  multipart: true, // Automatically handles 5MB+ chunks});### Issue #16: Missing File Extension Causes Access Denied Error**Error**:
```
```
// ❌ Manual multipart upload fails (can't upload 5MB chunks via serverless function)const upload = await createMultipartUpload('large.mp4', { access: 'public' });// uploadPart() requires 5MB minimum - hits serverless limit// ✅ Use automatic multipart via client uploadawait upload('large.mp4', file, {  access: 'public',  handleUploadUrl: '/api/upload',  multipart: true, // Automatically handles 5MB+ chunks});
```
```
// ❌ Manual multipart upload fails (can't upload 5MB chunks via serverless function)const upload = await createMultipartUpload('large.mp4', { access: 'public' });// uploadPart() requires 5MB minimum - hits serverless limit// ✅ Use automatic multipart via client uploadawait upload('large.mp4', file, {  access: 'public',  handleUploadUrl: '/api/upload',  multipart: true, // Automatically handles 5MB+ chunks});
```
```
**Source**: [GitHub Issue #664](https://github.com/vercel/storage/issues/664)**Why It Happens**: Pathname without file extension causes non-descriptive access denied error.**Prevention**: Always include file extension in pathname.// ❌ Fails with confusing errorawait upload('user-12345', file, {  access: 'public',  handleUploadUrl: '/api/upload',}); // Error: Access denied// ✅ Extract extension and include in pathnameconst extension = file.name.split('.').pop();await upload(user-${userId}.${extension}, file, {  access: 'public',  handleUploadUrl: '/api/upload',});---## Common Patterns**Avatar Upload with Replacement**:'use server';import { put, del } from '@vercel/blob';export async function updateAvatar(userId: string, formData: FormData) {  const file = formData.get('avatar') as File;  if (!file.type.startsWith('image/')) throw new Error('Only images allowed');  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });  if (user?.avatarUrl) await del(user.avatarUrl); // Delete old  const blob = await put(avatars/${userId}.jpg, file, { access: 'public' });  await db.update(users).set({ avatarUrl: blob.url }).where(eq(users.id, userId));  return blob.url;}**Protected Upload** (
```
```
// ❌ Fails with confusing errorawait upload('user-12345', file, {  access: 'public',  handleUploadUrl: '/api/upload',}); // Error: Access denied// ✅ Extract extension and include in pathnameconst extension = file.name.split('.').pop();await upload(user-${userId}.${extension}, file, {  access: 'public',  handleUploadUrl: '/api/upload',});
```
```
// ❌ Fails with confusing errorawait upload('user-12345', file, {  access: 'public',  handleUploadUrl: '/api/upload',}); // Error: Access denied// ✅ Extract extension and include in pathnameconst extension = file.name.split('.').pop();await upload(
```
```
, file, {  access: 'public',  handleUploadUrl: '/api/upload',});
```
```
'use server';import { put, del } from '@vercel/blob';export async function updateAvatar(userId: string, formData: FormData) {  const file = formData.get('avatar') as File;  if (!file.type.startsWith('image/')) throw new Error('Only images allowed');  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });  if (user?.avatarUrl) await del(user.avatarUrl); // Delete old  const blob = await put(avatars/${userId}.jpg, file, { access: 'public' });  await db.update(users).set({ avatarUrl: blob.url }).where(eq(users.id, userId));  return blob.url;}
```
```
'use server';import { put, del } from '@vercel/blob';export async function updateAvatar(userId: string, formData: FormData) {  const file = formData.get('avatar') as File;  if (!file.type.startsWith('image/')) throw new Error('Only images allowed');  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });  if (user?.avatarUrl) await del(user.avatarUrl); // Delete old  const blob = await put(
```
```
, file, { access: 'public' });  await db.update(users).set({ avatarUrl: blob.url }).where(eq(users.id, userId));  return blob.url;}
```
```
):const blob = await put(documents/${userId}/${file.name}`, file, { access: 'private' });
```
```
const blob = await put(documents/${userId}/${file.name}`, file, { access: 'private' });
```
```
const blob = await put(
```
This agent skill empowers developers to seamlessly integrate Vercel Blob storage into their projects, simplifying the handling of files, images, and other media assets. Leverage the robust and scalable infrastructure of Vercel for persistent data storage, enhancing your applications with dynamic content capabilities. It provides methods for both secure server-side operations and client-initiated uploads using presigned URLs, ensuring best practices for security and performance. A crucial tool for modern web development, particularly within the Next.js ecosystem, enabling efficient data persistence.

# When to Use This Skill
- •Implementing secure user profile picture or avatar uploads.
- •Storing dynamically generated content or AI-generated media.
- •Managing media assets (images, videos) for a content management system.
- •Handling file attachments in web forms or messaging applications.

# Pro Tips
- 💡Always use the `handleUpload()` utility for client-side uploads to prevent exposing the sensitive `BLOB_READ_WRITE_TOKEN` to the browser environment.
- 💡Define `allowedContentTypes` and `maximumSizeInBytes` within `onBeforeGenerateToken` to enforce strict validation and resource limits on client-initiated uploads.
- 💡Leverage Vercel Server Actions to encapsulate all Blob storage operations, enhancing security by keeping API keys server-side and simplifying data handling logic.

