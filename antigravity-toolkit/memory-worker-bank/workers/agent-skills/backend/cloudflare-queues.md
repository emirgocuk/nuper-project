# cloudflare-queues
Source: https://antigravity.codes/agent-skills/backend/cloudflare-queues

## AI Worker Instructions
When the user requests functionality related to cloudflare-queues, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-queues
```
# 1. Create queuenpx wrangler queues create my-queue# 2. Add producer binding to wrangler.jsonc# { "queues": { "producers": [{ "binding": "MY_QUEUE", "queue": "my-queue" }] } }# 3. Send message from Workerawait env.MY_QUEUE.send({ userId: '123', action: 'process-order' });# Or publish via HTTP (May 2025+) from any servicecurl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/queues/my-queue/messages" \  -H "Authorization: Bearer YOUR_API_TOKEN" \  -d '{"messages": [{"body": {"userId": "123"}}]}'# 4. Add consumer binding to wrangler.jsonc# { "queues": { "consumers": [{ "queue": "my-queue", "max_batch_size": 10 }] } }# 5. Process messagesexport default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      await processMessage(message.body);      message.ack(); // Explicit acknowledgement    }  }};# 6. Deploy and testnpx wrangler deploynpx wrangler tail my-consumer
```
```
# 1. Create queuenpx wrangler queues create my-queue# 2. Add producer binding to wrangler.jsonc# { "queues": { "producers": [{ "binding": "MY_QUEUE", "queue": "my-queue" }] } }# 3. Send message from Workerawait env.MY_QUEUE.send({ userId: '123', action: 'process-order' });# Or publish via HTTP (May 2025+) from any servicecurl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/queues/my-queue/messages" \  -H "Authorization: Bearer YOUR_API_TOKEN" \  -d '{"messages": [{"body": {"userId": "123"}}]}'# 4. Add consumer binding to wrangler.jsonc# { "queues": { "consumers": [{ "queue": "my-queue", "max_batch_size": 10 }] } }# 5. Process messagesexport default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      await processMessage(message.body);      message.ack(); // Explicit acknowledgement    }  }};# 6. Deploy and testnpx wrangler deploynpx wrangler tail my-consumer
```
```
// Send single messageawait env.MY_QUEUE.send({ userId: '123', action: 'send-email' });// Send with delay (max 12 hours)await env.MY_QUEUE.send({ action: 'reminder' }, { delaySeconds: 600 });// Send batch (max 100 messages or 256 KB)await env.MY_QUEUE.sendBatch([  { body: { userId: '1' } },  { body: { userId: '2' } },]);
```
```
// Send single messageawait env.MY_QUEUE.send({ userId: '123', action: 'send-email' });// Send with delay (max 12 hours)await env.MY_QUEUE.send({ action: 'reminder' }, { delaySeconds: 600 });// Send batch (max 100 messages or 256 KB)await env.MY_QUEUE.sendBatch([  { body: { userId: '1' } },  { body: { userId: '2' } },]);
```
```
Queues Edit
```
```
# Single messagecurl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/queues/my-queue/messages" \  -H "Authorization: Bearer YOUR_API_TOKEN" \  -H "Content-Type: application/json" \  -d '{    "messages": [      {"body": {"userId": "123", "action": "process-order"}}    ]  }'# Batch messagescurl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/queues/my-queue/messages" \  -H "Authorization: Bearer YOUR_API_TOKEN" \  -H "Content-Type: application/json" \  -d '{    "messages": [      {"body": {"userId": "1"}},      {"body": {"userId": "2"}},      {"body": {"userId": "3"}}    ]  }'
```
```
# Single messagecurl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/queues/my-queue/messages" \  -H "Authorization: Bearer YOUR_API_TOKEN" \  -H "Content-Type: application/json" \  -d '{    "messages": [      {"body": {"userId": "123", "action": "process-order"}}    ]  }'# Batch messagescurl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/queues/my-queue/messages" \  -H "Authorization: Bearer YOUR_API_TOKEN" \  -H "Content-Type: application/json" \  -d '{    "messages": [      {"body": {"userId": "1"}},      {"body": {"userId": "2"}},      {"body": {"userId": "3"}}    ]  }'
```
```
npx wrangler queues subscription create my-queue \  --source r2 \  --events bucket.created,object.uploaded
```
```
npx wrangler queues subscription create my-queue \  --source r2 \  --events bucket.created,object.uploaded
```
```
interface CloudflareEvent {  type: string;           // 'r2.bucket.created', 'kv.namespace.created'  source: string;         // 'r2', 'kv', 'ai', etc.  payload: any;           // Event-specific data  metadata: {    accountId: string;    timestamp: string;  };}
```
```
interface CloudflareEvent {  type: string;           // 'r2.bucket.created', 'kv.namespace.created'  source: string;         // 'r2', 'kv', 'ai', etc.  payload: any;           // Event-specific data  metadata: {    accountId: string;    timestamp: string;  };}
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      const event = message.body as CloudflareEvent;      switch (event.type) {        case 'r2.bucket.created':          console.log('New R2 bucket:', event.payload.bucketName);          await notifyAdmin(event.payload);          break;        case 'r2.object.uploaded':          console.log('File uploaded:', event.payload.key);          await processNewFile(event.payload.key);          break;        case 'kv.namespace.created':          console.log('New KV namespace:', event.payload.namespaceId);          break;        case 'ai.inference.completed':          console.log('AI inference done:', event.payload.modelId);          break;      }      message.ack();    }  }};
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      const event = message.body as CloudflareEvent;      switch (event.type) {        case 'r2.bucket.created':          console.log('New R2 bucket:', event.payload.bucketName);          await notifyAdmin(event.payload);          break;        case 'r2.object.uploaded':          console.log('File uploaded:', event.payload.key);          await processNewFile(event.payload.key);          break;        case 'kv.namespace.created':          console.log('New KV namespace:', event.payload.namespaceId);          break;        case 'ai.inference.completed':          console.log('AI inference done:', event.payload.modelId);          break;      }      message.ack();    }  }};
```
```
export default {  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {    for (const message of batch.messages) {      // message.id - unique UUID      // message.timestamp - Date when sent      // message.body - your content      // message.attempts - retry count (starts at 1)      await processMessage(message.body);      message.ack(); // Explicit ack (critical for non-idempotent ops)    }  }};// Retry with exponential backoffmessage.retry({ delaySeconds: Math.min(60 * Math.pow(2, message.attempts - 1), 3600) });// Batch methodsbatch.ackAll();   // Ack all messagesbatch.retryAll(); // Retry all messages
```
```
export default {  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {    for (const message of batch.messages) {      // message.id - unique UUID      // message.timestamp - Date when sent      // message.body - your content      // message.attempts - retry count (starts at 1)      await processMessage(message.body);      message.ack(); // Explicit ack (critical for non-idempotent ops)    }  }};// Retry with exponential backoffmessage.retry({ delaySeconds: Math.min(60 * Math.pow(2, message.attempts - 1), 3600) });// Batch methodsbatch.ackAll();   // Ack all messagesbatch.retryAll(); // Retry all messages
```
```
message.ack()
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      try {        await env.DB.prepare('INSERT INTO orders (id, amount) VALUES (?, ?)')          .bind(message.body.orderId, message.body.amount).run();        message.ack(); // Only ack on success      } catch (error) {        console.error(Failed ${message.id}:, error);        // Don't ack - will retry      }    }  }};
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      try {        await env.DB.prepare('INSERT INTO orders (id, amount) VALUES (?, ?)')          .bind(message.body.orderId, message.body.amount).run();        message.ack(); // Only ack on success      } catch (error) {        console.error(Failed ${message.id}:, error);        // Don't ack - will retry      }    }  }};
```
```
Failed ${message.id}:
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      try {        await fetch('https://api.example.com/process', {          method: 'POST',          body: JSON.stringify(message.body),        });        message.ack();      } catch (error) {        if (error.status === 429) {          const delaySeconds = Math.min(60 * Math.pow(2, message.attempts - 1), 3600);          message.retry({ delaySeconds });        } else {          message.retry();        }      }    }  }};
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      try {        await fetch('https://api.example.com/process', {          method: 'POST',          body: JSON.stringify(message.body),        });        message.ack();      } catch (error) {        if (error.status === 429) {          const delaySeconds = Math.min(60 * Math.pow(2, message.attempts - 1), 3600);          message.retry({ delaySeconds });        } else {          message.retry();        }      }    }  }};
```
```
npx wrangler queues create my-dlq
```
```
npx wrangler queues create my-dlq
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_retries": 3,      "dead_letter_queue": "my-dlq"  // Messages go here after 3 failed retries    }]  }}
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_retries": 3,      "dead_letter_queue": "my-dlq"  // Messages go here after 3 failed retries    }]  }}
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      console.error('PERMANENTLY FAILED:', message.id, message.body);      await env.DB.prepare('INSERT INTO failed_messages (id, body) VALUES (?, ?)')        .bind(message.id, JSON.stringify(message.body)).run();      message.ack(); // Remove from DLQ    }  }};
```
```
export default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    for (const message of batch.messages) {      console.error('PERMANENTLY FAILED:', message.id, message.body);      await env.DB.prepare('INSERT INTO failed_messages (id, body) VALUES (?, ?)')        .bind(message.id, JSON.stringify(message.body)).run();      message.ack(); // Remove from DLQ    }  }};
```
```
wrangler dev
```
```
wrangler dev
```
```
# ❌ Don't run producer and consumer as separate processes# Terminal 1: wrangler dev (producer)# Terminal 2: wrangler dev (consumer)  # Won't receive messages!# ✅ Option 1: Run both in single dev commandwrangler dev -c producer/wrangler.jsonc -c consumer/wrangler.jsonc# ✅ Option 2: Use Vite plugin with auxiliaryWorkers# vite.config.ts:export default defineConfig({  plugins: [    cloudflare({      auxiliaryWorkers: ['./consumer/wrangler.jsonc']    })  ]})
```
```
# ❌ Don't run producer and consumer as separate processes# Terminal 1: wrangler dev (producer)# Terminal 2: wrangler dev (consumer)  # Won't receive messages!# ✅ Option 1: Run both in single dev commandwrangler dev -c producer/wrangler.jsonc -c consumer/wrangler.jsonc# ✅ Option 2: Use Vite plugin with auxiliaryWorkers# vite.config.ts:export default defineConfig({  plugins: [    cloudflare({      auxiliaryWorkers: ['./consumer/wrangler.jsonc']    })  ]})
```
```
wrangler dev --remote
```
```
wrangler dev --remote
```
```
// When using remote dev, temporarily comment out queue bindings{  "queues": {    // "producers": [{ "queue": "my-queue", "binding": "MY_QUEUE" }]  }}// Or use local dev instead// wrangler dev (without --remote)
```
```
// When using remote dev, temporarily comment out queue bindings{  "queues": {    // "producers": [{ "queue": "my-queue", "binding": "MY_QUEUE" }]  }}// Or use local dev instead// wrangler dev (without --remote)
```
```
remote: true
```
```
// ❌ Don't mix D1 remote with queue remote{  "d1_databases": [{    "binding": "DB",    "database_id": "...",    "remote": true  }],  "queues": {    "producers": [{      "binding": "QUEUE",      "queue": "my-queue",      "remote": true  // ❌ Breaks D1 remote    }]  }}// ✅ Avoid remote on queues when using D1 remote{  "d1_databases": [{ "binding": "DB", "remote": true }],  "queues": {    "producers": [{ "binding": "QUEUE", "queue": "my-queue" }]  }}
```
```
// ❌ Don't mix D1 remote with queue remote{  "d1_databases": [{    "binding": "DB",    "database_id": "...",    "remote": true  }],  "queues": {    "producers": [{      "binding": "QUEUE",      "queue": "my-queue",      "remote": true  // ❌ Breaks D1 remote    }]  }}// ✅ Avoid remote on queues when using D1 remote{  "d1_databases": [{ "binding": "DB", "remote": true }],  "queues": {    "producers": [{ "binding": "QUEUE", "queue": "my-queue" }]  }}
```
```
// ❌ Don't mix local queues with remote AI{  "queues": {    "consumers": [{ "queue": "my-queue" }]  },  "ai": {    "binding": "AI",    "experimental_remote": true  // ❌ Breaks queue consumer  }}// ✅ Option 1: All local (no remote bindings)wrangler dev// ✅ Option 2: Separate workers for queues vs AI// Worker 1: Queue processing (local)// Worker 2: AI operations (remote)
```
```
// ❌ Don't mix local queues with remote AI{  "queues": {    "consumers": [{ "queue": "my-queue" }]  },  "ai": {    "binding": "AI",    "experimental_remote": true  // ❌ Breaks queue consumer  }}// ✅ Option 1: All local (no remote bindings)wrangler dev// ✅ Option 2: Separate workers for queues vs AI// Worker 1: Queue processing (local)// Worker 2: AI operations (remote)
```
```
type: "http_pull"
```
```
http_pull
```
```
// ❌ Don't use type: "http_pull" for Worker consumers{  "queues": {    "consumers": [{      "queue": "my-queue",      "type": "http_pull",  // ❌ Wrong for Workers      "max_batch_size": 10    }]  }}// ✅ Omit type field for push-based Worker consumers{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 10      // No "type" field - defaults to Worker consumer    }]  }}
```
```
// ❌ Don't use type: "http_pull" for Worker consumers{  "queues": {    "consumers": [{      "queue": "my-queue",      "type": "http_pull",  // ❌ Wrong for Workers      "max_batch_size": 10    }]  }}// ✅ Omit type field for push-based Worker consumers{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 10      // No "type" field - defaults to Worker consumer    }]  }}
```
```
delivery_delay
```
```
// ❌ Will be removed - don't use{  "queues": {    "producers": [{      "binding": "MY_QUEUE",      "queue": "my-queue",      "delivery_delay": 300  // ❌ Don't use this    }]  }}
```
```
// ❌ Will be removed - don't use{  "queues": {    "producers": [{      "binding": "MY_QUEUE",      "queue": "my-queue",      "delivery_delay": 300  // ❌ Don't use this    }]  }}
```
```
// ✅ Correct approach - per-message delayawait env.MY_QUEUE.send({ data }, { delaySeconds: 300 });
```
```
// ✅ Correct approach - per-message delayawait env.MY_QUEUE.send({ data }, { delaySeconds: 300 });
```
```
wrangler dev
```
```
max_batch_timeout
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 10      // Remove max_batch_timeout for local dev    }]  }}
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 10      // Remove max_batch_timeout for local dev    }]  }}
```
```
batch.queue
```
```
email-queue-staging
```
```
email-queue-pr-123
```
```
// ❌ Can't access queue name from producer bindingconst queueName = env.MY_QUEUE.name; // Doesn't exist!// ❌ Must hardcode or normalize in consumerswitch (batch.queue) {  case 'email-queue':           // What about email-queue-staging?  case 'email-queue-staging':   // Must handle all variants  case 'email-queue-pr-123':    // Dynamic env names break this}
```
```
// ❌ Can't access queue name from producer bindingconst queueName = env.MY_QUEUE.name; // Doesn't exist!// ❌ Must hardcode or normalize in consumerswitch (batch.queue) {  case 'email-queue':           // What about email-queue-staging?  case 'email-queue-staging':   // Must handle all variants  case 'email-queue-pr-123':    // Dynamic env names break this}
```
```
// In consumer: Normalize queue namefunction normalizeQueueName(queueName: string): string {  return queueName.replace(/-staging|-pr-\d+|-dev/g, '');}switch (normalizeQueueName(batch.queue)) {  case 'email-queue':    // Handle all email-queue-* variants}
```
```
// In consumer: Normalize queue namefunction normalizeQueueName(queueName: string): string {  return queueName.replace(/-staging|-pr-\d+|-dev/g, '');}switch (normalizeQueueName(batch.queue)) {  case 'email-queue':    // Handle all email-queue-* variants}
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 100,           // 1-100 (default: 10)      "max_batch_timeout": 30,         // 0-60s (default: 5s)      "max_retries": 5,                // 0-100 (default: 3)      "retry_delay": 300,              // Seconds (default: 0)      "max_concurrency": 10,           // 1-250 (default: auto-scale)      "dead_letter_queue": "my-dlq"    // REQUIRED for production    }]  }}
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 100,           // 1-100 (default: 10)      "max_batch_timeout": 30,         // 0-60s (default: 5s)      "max_retries": 5,                // 0-100 (default: 3)      "retry_delay": 300,              // Seconds (default: 0)      "max_concurrency": 10,           // 1-250 (default: auto-scale)      "dead_letter_queue": "my-dlq"    // REQUIRED for production    }]  }}
```
```
npx wrangler queues create my-dlq
```
```
# Create queuenpx wrangler queues create my-queuenpx wrangler queues create my-queue --message-retention-period-secs 1209600  # 14 days# Manage queuesnpx wrangler queues listnpx wrangler queues info my-queuenpx wrangler queues delete my-queue  # ⚠️ Deletes ALL messages!# Pause/Purge (March 2025 - NEW)npx wrangler queues pause-delivery my-queue   # Pause processing, keep receivingnpx wrangler queues resume-delivery my-queuenpx wrangler queues purge my-queue            # ⚠️ Permanently deletes all messages!# Consumer managementnpx wrangler queues consumer add my-queue my-consumer-worker \  --batch-size 50 --batch-timeout 10 --message-retries 5npx wrangler queues consumer remove my-queue my-consumer-worker
```
```
# Create queuenpx wrangler queues create my-queuenpx wrangler queues create my-queue --message-retention-period-secs 1209600  # 14 days# Manage queuesnpx wrangler queues listnpx wrangler queues info my-queuenpx wrangler queues delete my-queue  # ⚠️ Deletes ALL messages!# Pause/Purge (March 2025 - NEW)npx wrangler queues pause-delivery my-queue   # Pause processing, keep receivingnpx wrangler queues resume-delivery my-queuenpx wrangler queues purge my-queue            # ⚠️ Permanently deletes all messages!# Consumer managementnpx wrangler queues consumer add my-queue my-consumer-worker \  --batch-size 50 --batch-timeout 10 --message-retries 5npx wrangler queues consumer remove my-queue my-consumer-worker
```
```
// ❌ Bad: Message >128 KBawait env.MY_QUEUE.send({  data: largeArray, // >128 KB});// ✅ Good: Check size before sendingconst message = { data: largeArray };const size = new TextEncoder().encode(JSON.stringify(message)).length;if (size > 128000) {  // Store in R2, send reference  const key = messages/${crypto.randomUUID()}.json;  await env.MY_BUCKET.put(key, JSON.stringify(message));  await env.MY_QUEUE.send({ type: 'large-message', r2Key: key });} else {  await env.MY_QUEUE.send(message);}
```
```
// ❌ Bad: Message >128 KBawait env.MY_QUEUE.send({  data: largeArray, // >128 KB});// ✅ Good: Check size before sendingconst message = { data: largeArray };const size = new TextEncoder().encode(JSON.stringify(message)).length;if (size > 128000) {  // Store in R2, send reference  const key = messages/${crypto.randomUUID()}.json;  await env.MY_BUCKET.put(key, JSON.stringify(message));  await env.MY_QUEUE.send({ type: 'large-message', r2Key: key });} else {  await env.MY_QUEUE.send(message);}
```
```
messages/${crypto.randomUUID()}.json
```
```
// ❌ Bad: Exceeding 5000 msg/s per queuefor (let i = 0; i < 10000; i++) {  await env.MY_QUEUE.send({ id: i }); // Too fast!}// ✅ Good: Use sendBatchconst messages = Array.from({ length: 10000 }, (_, i) => ({  body: { id: i },}));// Send in batches of 100for (let i = 0; i < messages.length; i += 100) {  await env.MY_QUEUE.sendBatch(messages.slice(i, i + 100));}// ✅ Even better: Rate limit with delayfor (let i = 0; i < messages.length; i += 100) {  await env.MY_QUEUE.sendBatch(messages.slice(i, i + 100));  if (i + 100 < messages.length) {    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay  }}
```
```
// ❌ Bad: Exceeding 5000 msg/s per queuefor (let i = 0; i < 10000; i++) {  await env.MY_QUEUE.send({ id: i }); // Too fast!}// ✅ Good: Use sendBatchconst messages = Array.from({ length: 10000 }, (_, i) => ({  body: { id: i },}));// Send in batches of 100for (let i = 0; i < messages.length; i += 100) {  await env.MY_QUEUE.sendBatch(messages.slice(i, i + 100));}// ✅ Even better: Rate limit with delayfor (let i = 0; i < messages.length; i += 100) {  await env.MY_QUEUE.sendBatch(messages.slice(i, i + 100));  if (i + 100 < messages.length) {    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay  }}
```
```
// ❌ Bad: Long processing without CPU limit increaseexport default {  async queue(batch: MessageBatch): Promise<void> {    for (const message of batch.messages) {      await processForMinutes(message.body); // CPU timeout!    }  },};// ✅ Good: Increase CPU limit in wrangler.jsonc
```
```
// ❌ Bad: Long processing without CPU limit increaseexport default {  async queue(batch: MessageBatch): Promise<void> {    for (const message of batch.messages) {      await processForMinutes(message.body); // CPU timeout!    }  },};// ✅ Good: Increase CPU limit in wrangler.jsonc
```
```
{  "limits": {    "cpu_ms": 300000  // 5 minutes (max allowed)  }}
```
```
{  "limits": {    "cpu_ms": 300000  // 5 minutes (max allowed)  }}
```
```
// Issue: Consumer too slow, backlog growing// ✅ Solution 1: Increase batch size{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 100  // Process more per invocation    }]  }}// ✅ Solution 2: Let concurrency auto-scale (don't set max_concurrency)// ✅ Solution 3: Optimize consumer codeexport default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    // Process in parallel    await Promise.all(      batch.messages.map(async (message) => {        await process(message.body);        message.ack();      })    );  },};
```
```
// Issue: Consumer too slow, backlog growing// ✅ Solution 1: Increase batch size{  "queues": {    "consumers": [{      "queue": "my-queue",      "max_batch_size": 100  // Process more per invocation    }]  }}// ✅ Solution 2: Let concurrency auto-scale (don't set max_concurrency)// ✅ Solution 3: Optimize consumer codeexport default {  async queue(batch: MessageBatch, env: Env): Promise<void> {    // Process in parallel    await Promise.all(      batch.messages.map(async (message) => {        await process(message.body);        message.ack();      })    );  },};
```
```
dead_letter_queue
```
```
message.ack()
```
```
sendBatch()
```
```
60 * Math.pow(2, message.attempts - 1)
```
```
max_concurrency
```
```
ack()
```
```
Promise.all()
```
```
# Check queue infonpx wrangler queues info my-queue# Check if delivery pausednpx wrangler queues resume-delivery my-queue# Check consumer logsnpx wrangler tail my-consumer
```
```
# Check queue infonpx wrangler queues info my-queue# Check if delivery pausednpx wrangler queues resume-delivery my-queue# Check consumer logsnpx wrangler tail my-consumer
```
```
// ✅ Explicit ackfor (const message of batch.messages) {  try {    await dbWrite(message.body);    message.ack(); // Only ack on success  } catch (error) {    console.error(Failed: ${message.id});    // Don't ack - will retry  }}
```
```
// ✅ Explicit ackfor (const message of batch.messages) {  try {    await dbWrite(message.body);    message.ack(); // Only ack on success  } catch (error) {    console.error(Failed: ${message.id});    // Don't ack - will retry  }}
```
```
Failed: ${message.id}
```
```
# Create DLQnpx wrangler queues create my-dlq# Add to consumer config
```
```
# Create DLQnpx wrangler queues create my-dlq# Add to consumer config
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "dead_letter_queue": "my-dlq"    }]  }}
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      "dead_letter_queue": "my-dlq"    }]  }}
```
```
max_concurrency
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      // Don't set max_concurrency - let it auto-scale      "max_batch_size": 50  // Increase batch size instead    }]  }}
```
```
{  "queues": {    "consumers": [{      "queue": "my-queue",      // Don't set max_concurrency - let it auto-scale      "max_batch_size": 50  // Increase batch size instead    }]  }}
```
```
/* ❌ Messages PERMANENTLY DELETED after max_retries */// No DLQ configured.../* ✅ Always configure DLQ in production */// wrangler.jsonc:{  "queues": {    "consumers": [{      "queue": "my-queue",      "dead_letter_queue": "my-queue-dlq", // Required!      "max_retries": 3    }]  }}
```
```
/* ❌ Messages PERMANENTLY DELETED after max_retries */// No DLQ configured.../* ✅ Always configure DLQ in production */// wrangler.jsonc:{  "queues": {    "consumers": [{      "queue": "my-queue",      "dead_letter_queue": "my-queue-dlq", // Required!      "max_retries": 3    }]  }}
```
```
/* ❌ Message too large */await env.QUEUE.send({ largeData: megabytesOfData })/* ✅ Store large data in R2, send reference */const key = data/${crypto.randomUUID()}await env.BUCKET.put(key, largeData)await env.QUEUE.send({ dataRef: key })
```
```
/* ❌ Message too large */await env.QUEUE.send({ largeData: megabytesOfData })/* ✅ Store large data in R2, send reference */const key = data/${crypto.randomUUID()}await env.BUCKET.put(key, largeData)await env.QUEUE.send({ dataRef: key })
```
```
data/${crypto.randomUUID()}
```
```
/* ❌ Entire batch retried if one fails */async queue(batch, env) {  for (const msg of batch.messages) {    await processMessage(msg) // If one fails, all retry  }}/* ✅ Explicit ack for DB writes, payments, API calls */async queue(batch, env) {  for (const msg of batch.messages) {    try {      await processMessage(msg)      msg.ack() // Explicit acknowledgment    } catch (error) {      msg.retry({ delaySeconds: 60 * Math.pow(2, msg.attempts - 1) })    }  }}
```
```
/* ❌ Entire batch retried if one fails */async queue(batch, env) {  for (const msg of batch.messages) {    await processMessage(msg) // If one fails, all retry  }}/* ✅ Explicit ack for DB writes, payments, API calls */async queue(batch, env) {  for (const msg of batch.messages) {    try {      await processMessage(msg)      msg.ack() // Explicit acknowledgment    } catch (error) {      msg.retry({ delaySeconds: 60 * Math.pow(2, msg.attempts - 1) })    }  }}
```
```
/* ❌ Relying on message order */// Messages may arrive out of order/* ✅ Include timestamp/sequence if order matters */await env.QUEUE.send({  data: payload,  timestamp: Date.now(),  sequence: getNextSequence(),})
```
```
/* ❌ Relying on message order */// Messages may arrive out of order/* ✅ Include timestamp/sequence if order matters */await env.QUEUE.send({  data: payload,  timestamp: Date.now(),  sequence: getNextSequence(),})
```
```
/* ✅ Use sendBatch with delays for high throughput */const batches = chunks(messages, 100)for (const batch of batches) {  await env.QUEUE.sendBatch(batch)  await new Promise(r => setTimeout(r, 100)) // Throttle}
```
```
/* ✅ Use sendBatch with delays for high throughput */const batches = chunks(messages, 100)for (const batch of batches) {  await env.QUEUE.sendBatch(batch)  await new Promise(r => setTimeout(r, 100)) // Throttle}
```
```
dead_letter_queue
```
```
msg.ack()
```
```
sendBatch()
```
Unlock the power of Cloudflare Queues directly within your AI coding assistant with this specialized skill. Designed for developers building robust, scalable serverless applications, it streamlines the process of integrating asynchronous messaging into your Cloudflare Workers. Leverage reliable message delivery for background tasks, event-driven architectures, and high-throughput data processing. This skill provides instant access to best practices and code examples, ensuring you can quickly implement and manage message queues, enhancing the resilience and responsiveness of your cloud-native solutions without manual boilerplate. Empower your AI to guide you through Cloudflare's powerful messaging ecosystem.

# When to Use This Skill
- •Implementing reliable background task processing with Cloudflare Workers.
- •Building event-driven architectures for microservices and distributed systems.
- •Handling asynchronous operations like email sending, image processing, or data synchronization.
- •Managing high-throughput data ingestion and fan-out patterns for analytics or notifications.

# Pro Tips
- 💡Always define producer and consumer bindings in `wrangler.toml` or `wrangler.jsonc` for clear configuration and type safety.
- 💡Utilize pull consumers for advanced control over message processing, enabling custom retry logic and backpressure management.
- 💡Combine with `cloudflare-worker-base` skill for comprehensive setup and deployment of your Worker applications that interact with Queues.

