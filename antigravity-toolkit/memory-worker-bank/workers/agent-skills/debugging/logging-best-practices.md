# logging-best-practices
Source: https://antigravity.codes/agent-skills/debugging/logging-best-practices

## AI Worker Instructions
When the user requests functionality related to logging-best-practices, follow these guidelines and utilize this context.

## Scraped Content

# logging-best-practices
```
const wideEvent: Record<string, unknown> = {  method: 'POST',  path: '/checkout',  requestId: c.get('requestId'),  timestamp: new Date().toISOString(),};try {  const user = await getUser(c.get('userId'));  wideEvent.user = { id: user.id, subscription: user.subscription };  const cart = await getCart(user.id);  wideEvent.cart = { total_cents: cart.total, item_count: cart.items.length };  wideEvent.status_code = 200;  wideEvent.outcome = 'success';  return c.json({ success: true });} catch (error) {  wideEvent.status_code = 500;  wideEvent.outcome = 'error';  wideEvent.error = { message: error.message, type: error.name };  throw error;} finally {  wideEvent.duration_ms = Date.now() - startTime;  logger.info(wideEvent);}
```
```
const wideEvent: Record<string, unknown> = {  method: 'POST',  path: '/checkout',  requestId: c.get('requestId'),  timestamp: new Date().toISOString(),};try {  const user = await getUser(c.get('userId'));  wideEvent.user = { id: user.id, subscription: user.subscription };  const cart = await getCart(user.id);  wideEvent.cart = { total_cents: cart.total, item_count: cart.items.length };  wideEvent.status_code = 200;  wideEvent.outcome = 'success';  return c.json({ success: true });} catch (error) {  wideEvent.status_code = 500;  wideEvent.outcome = 'error';  wideEvent.error = { message: error.message, type: error.name };  throw error;} finally {  wideEvent.duration_ms = Date.now() - startTime;  logger.info(wideEvent);}
```
```
info
```
```
error
```
```
console.log('something happened')
```
```
rules/wide-events.md
```
```
rules/context.md
```
```
rules/structure.md
```
```
rules/pitfalls.md
```
```
const wideEvent = {  // Timing  timestamp: '2024-09-08T06:14:05.680Z',  duration_ms: 268,  // Request context  method: 'POST',  path: '/checkout',  requestId: 'req_abc123',  // Infrastructure  service: 'checkout-service',  version: '2.4.1',  region: 'us-east-1',  commit_hash: '690de31f',  // User context (HIGH CARDINALITY - millions of unique values)  user: {    id: 'user_456',    subscription: 'premium',    account_age_days: 847,    lifetime_value_cents: 284700,  },  // Business context  cart: {    id: 'cart_xyz',    item_count: 3,    total_cents: 15999,    coupon_applied: 'SAVE20',  },  // Payment details  payment: {    method: 'card',    provider: 'stripe',    latency_ms: 189,  },  // Feature flags - crucial for debugging rollouts  feature_flags: {    new_checkout_flow: true,  },  // Outcome  status_code: 200,  outcome: 'success',};
```
```
const wideEvent = {  // Timing  timestamp: '2024-09-08T06:14:05.680Z',  duration_ms: 268,  // Request context  method: 'POST',  path: '/checkout',  requestId: 'req_abc123',  // Infrastructure  service: 'checkout-service',  version: '2.4.1',  region: 'us-east-1',  commit_hash: '690de31f',  // User context (HIGH CARDINALITY - millions of unique values)  user: {    id: 'user_456',    subscription: 'premium',    account_age_days: 847,    lifetime_value_cents: 284700,  },  // Business context  cart: {    id: 'cart_xyz',    item_count: 3,    total_cents: 15999,    coupon_applied: 'SAVE20',  },  // Payment details  payment: {    method: 'card',    provider: 'stripe',    latency_ms: 189,  },  // Feature flags - crucial for debugging rollouts  feature_flags: {    new_checkout_flow: true,  },  // Outcome  status_code: 200,  outcome: 'success',};
```
```
const wideEvent = {  requestId: 'req_123',  method: 'POST',  path: '/checkout',  status_code: 500,  // Business context that changes response priority  user: {    id: 'user_456',    subscription: 'enterprise',        // High-value customer    account_age_days: 1247,            // Long-term customer    lifetime_value_cents: 4850000,     // $48,500 LTV  },  cart: {    total_cents: 249900,               // $2,499 order    contains_annual_plan: true,        // Recurring revenue at stake  },  feature_flags: {    new_payment_flow: true,            // Was new code involved?  },  error: {    type: 'PaymentError',    code: 'card_declined',  },};// Now you KNOW this is critical: Enterprise customer, $48.5k LTV,// trying to make a $2.5k purchase, and new_payment_flow is enabled
```
```
const wideEvent = {  requestId: 'req_123',  method: 'POST',  path: '/checkout',  status_code: 500,  // Business context that changes response priority  user: {    id: 'user_456',    subscription: 'enterprise',        // High-value customer    account_age_days: 1247,            // Long-term customer    lifetime_value_cents: 4850000,     // $48,500 LTV  },  cart: {    total_cents: 249900,               // $2,499 order    contains_annual_plan: true,        // Recurring revenue at stake  },  feature_flags: {    new_payment_flow: true,            // Was new code involved?  },  error: {    type: 'PaymentError',    code: 'card_declined',  },};// Now you KNOW this is critical: Enterprise customer, $48.5k LTV,// trying to make a $2.5k purchase, and new_payment_flow is enabled
```
```
const wideEvent = {  // ... request and business context  // Environment characteristics  env: {    // Deployment info    commit_hash: process.env.COMMIT_SHA || process.env.GIT_COMMIT,    version: process.env.SERVICE_VERSION || process.env.npm_package_version,    deployment_id: process.env.DEPLOYMENT_ID,    deploy_time: process.env.DEPLOY_TIMESTAMP,    // Infrastructure    service: process.env.SERVICE_NAME,    region: process.env.AWS_REGION || process.env.REGION,    availability_zone: process.env.AWS_AVAILABILITY_ZONE,    instance_id: process.env.INSTANCE_ID || process.env.HOSTNAME,    container_id: process.env.CONTAINER_ID,    // Runtime    node_version: process.version,    runtime: process.env.AWS_EXECUTION_ENV || 'node',    memory_limit_mb: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,    // Environment type    environment: process.env.NODE_ENV || process.env.ENVIRONMENT,    stage: process.env.STAGE,  },};
```
```
const wideEvent = {  // ... request and business context  // Environment characteristics  env: {    // Deployment info    commit_hash: process.env.COMMIT_SHA || process.env.GIT_COMMIT,    version: process.env.SERVICE_VERSION || process.env.npm_package_version,    deployment_id: process.env.DEPLOYMENT_ID,    deploy_time: process.env.DEPLOY_TIMESTAMP,    // Infrastructure    service: process.env.SERVICE_NAME,    region: process.env.AWS_REGION || process.env.REGION,    availability_zone: process.env.AWS_AVAILABILITY_ZONE,    instance_id: process.env.INSTANCE_ID || process.env.HOSTNAME,    container_id: process.env.CONTAINER_ID,    // Runtime    node_version: process.version,    runtime: process.env.AWS_EXECUTION_ENV || 'node',    memory_limit_mb: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,    // Environment type    environment: process.env.NODE_ENV || process.env.ENVIRONMENT,    stage: process.env.STAGE,  },};
```
```
app.post('/checkout', async (c) => {  console.log('Received checkout request');                    // Line 1  console.log(User ID: ${c.get('userId')});                  // Line 2  const user = await getUser(c.get('userId'));  console.log(User fetched: ${user.email});                  // Line 3  const cart = await getCart(user.id);  console.log(Cart fetched: ${cart.items.length} items);     // Line 4  const payment = await processPayment(cart);  console.log(Payment processed: ${payment.status});         // Line 5  console.log('Checkout completed successfully');              // Line 6  return c.json({ orderId: payment.orderId });});// 6 log lines per request = noise
```
```
app.post('/checkout', async (c) => {  console.log('Received checkout request');                    // Line 1  console.log(User ID: ${c.get('userId')});                  // Line 2  const user = await getUser(c.get('userId'));  console.log(User fetched: ${user.email});                  // Line 3  const cart = await getCart(user.id);  console.log(Cart fetched: ${cart.items.length} items);     // Line 4  const payment = await processPayment(cart);  console.log(Payment processed: ${payment.status});         // Line 5  console.log('Checkout completed successfully');              // Line 6  return c.json({ orderId: payment.orderId });});// 6 log lines per request = noise
```
```
User ID: ${c.get('userId')}
```
```
User fetched: ${user.email}
```
```
Cart fetched: ${cart.items.length} items
```
```
Payment processed: ${payment.status}
```
```
// Single wide event with everythingconst wideEvent = {  method: 'POST',  path: '/checkout',  user: { id: user.id, email: user.email },  cart: { item_count: cart.items.length, total: cart.total },  payment: { status: payment.status, order_id: payment.orderId },  status_code: 200,  duration_ms: 1247,};
```
```
// Single wide event with everythingconst wideEvent = {  method: 'POST',  path: '/checkout',  user: { id: user.id, email: user.email },  cart: { item_count: cart.items.length, total: cart.total },  payment: { status: payment.status, order_id: payment.orderId },  status_code: 200,  duration_ms: 1247,};
```
```
// Logging only for anticipated issuesapp.post('/articles', async (c) => {  const article = await createArticle(c.req.body, user);  if (!article.published) {    console.log('Article created but not published');  // Anticipated issue  }  return c.json({ article });});// Bug: "Users on free trial can't see their articles"// Your logs say: "Article created successfully" ✓// But you have NO visibility into:// - Which users are affected (free trial? all?)// - What subscription plans see this issue// - When it started
```
```
// Logging only for anticipated issuesapp.post('/articles', async (c) => {  const article = await createArticle(c.req.body, user);  if (!article.published) {    console.log('Article created but not published');  // Anticipated issue  }  return c.json({ article });});// Bug: "Users on free trial can't see their articles"// Your logs say: "Article created successfully" ✓// But you have NO visibility into:// - Which users are affected (free trial? all?)// - What subscription plans see this issue// - When it started
```
```
// Wide event captures everythingwideEvent.user = {  id: user.id,  subscription: user.subscription,  trial: user.trial,  trial_expiration: user.trialExpiration,};wideEvent.article = {  id: article.id,  published: article.published,  // Captured even though we didn't anticipate the bug};// Now you can query: WHERE article.published = false GROUP BY user.trial// Result: 95% of unpublished articles are from trial users!
```
```
// Wide event captures everythingwideEvent.user = {  id: user.id,  subscription: user.subscription,  trial: user.trial,  trial_expiration: user.trialExpiration,};wideEvent.article = {  id: article.id,  published: article.published,  // Captured even though we didn't anticipate the bug};// Now you can query: WHERE article.published = false GROUP BY user.trial// Result: 95% of unpublished articles are from trial users!
```
```
// Service A logs{ message: 'Order created', order_id: 'ord_123' }// Service B logs{ message: 'Inventory reserved', items: 3 }// No way to connect these two events!
```
```
// Service A logs{ message: 'Order created', order_id: 'ord_123' }// Service B logs{ message: 'Inventory reserved', items: 3 }// No way to connect these two events!
```
```
// Both services include the same request_id{ request_id: 'req_abc', message: 'Order created', order_id: 'ord_123' }{ request_id: 'req_abc', message: 'Inventory reserved', items: 3 }// Query: WHERE request_id = 'req_abc' shows the full flow
```
```
// Both services include the same request_id{ request_id: 'req_abc', message: 'Order created', order_id: 'ord_123' }{ request_id: 'req_abc', message: 'Inventory reserved', items: 3 }// Query: WHERE request_id = 'req_abc' shows the full flow
```
```
// lib/logger.ts - Single logger configurationimport pino from 'pino';// Configure once at startupexport const logger = pino({  level: process.env.LOG_LEVEL || 'info',  formatters: {    level: (label) => ({ level: label }),  },  base: {    // Environment context added to ALL logs automatically    service: process.env.SERVICE_NAME,    version: process.env.SERVICE_VERSION,    commit_hash: process.env.COMMIT_SHA,    region: process.env.AWS_REGION,    environment: process.env.NODE_ENV,  },});// Usage everywhere else - just import// services/checkout.tsimport { logger } from '../lib/logger';logger.info({ event: 'checkout_completed', orderId });
```
```
// lib/logger.ts - Single logger configurationimport pino from 'pino';// Configure once at startupexport const logger = pino({  level: process.env.LOG_LEVEL || 'info',  formatters: {    level: (label) => ({ level: label }),  },  base: {    // Environment context added to ALL logs automatically    service: process.env.SERVICE_NAME,    version: process.env.SERVICE_VERSION,    commit_hash: process.env.COMMIT_SHA,    region: process.env.AWS_REGION,    environment: process.env.NODE_ENV,  },});// Usage everywhere else - just import// services/checkout.tsimport { logger } from '../lib/logger';logger.info({ event: 'checkout_completed', orderId });
```
```
// DON'T create new loggers in each fileconst logger = new Logger(); // Each file creates its ownconsole.log('some event');   // Bypasses the logger entirely
```
```
// DON'T create new loggers in each fileconst logger = new Logger(); // Each file creates its ownconsole.log('some event');   // Bypasses the logger entirely
```
```
// middleware/wideEvent.tsimport { logger } from '../lib/logger';// Capture environment once at startupconst envContext = {  service: process.env.SERVICE_NAME,  version: process.env.SERVICE_VERSION,  commit_hash: process.env.COMMIT_SHA,  region: process.env.AWS_REGION,  environment: process.env.NODE_ENV,  instance_id: process.env.HOSTNAME,};export function wideEventMiddleware() {  return async (c: Context, next: Next) => {    const startTime = Date.now();    // Initialize event with standard fields + environment    const wideEvent: Record<string, unknown> = {      request_id: c.get('requestId') || crypto.randomUUID(),      timestamp: new Date().toISOString(),      method: c.req.method,      path: c.req.path,      user_agent: c.req.header('user-agent'),      ...envContext,  // Environment automatically included    };    // Make event accessible to handlers for enrichment    c.set('wideEvent', wideEvent);    try {      await next();      wideEvent.status_code = c.res.status;      wideEvent.outcome = c.res.status < 400 ? 'success' : 'error';    } catch (error) {      wideEvent.status_code = 500;      wideEvent.outcome = 'error';      wideEvent.error = {        type: error.name,        message: error.message,      };      throw error;    } finally {      wideEvent.duration_ms = Date.now() - startTime;      logger.info(wideEvent);  // Uses the single logger    }  };}// Apply middleware globallyapp.use('*', wideEventMiddleware());
```
```
// middleware/wideEvent.tsimport { logger } from '../lib/logger';// Capture environment once at startupconst envContext = {  service: process.env.SERVICE_NAME,  version: process.env.SERVICE_VERSION,  commit_hash: process.env.COMMIT_SHA,  region: process.env.AWS_REGION,  environment: process.env.NODE_ENV,  instance_id: process.env.HOSTNAME,};export function wideEventMiddleware() {  return async (c: Context, next: Next) => {    const startTime = Date.now();    // Initialize event with standard fields + environment    const wideEvent: Record<string, unknown> = {      request_id: c.get('requestId') || crypto.randomUUID(),      timestamp: new Date().toISOString(),      method: c.req.method,      path: c.req.path,      user_agent: c.req.header('user-agent'),      ...envContext,  // Environment automatically included    };    // Make event accessible to handlers for enrichment    c.set('wideEvent', wideEvent);    try {      await next();      wideEvent.status_code = c.res.status;      wideEvent.outcome = c.res.status < 400 ? 'success' : 'error';    } catch (error) {      wideEvent.status_code = 500;      wideEvent.outcome = 'error';      wideEvent.error = {        type: error.name,        message: error.message,      };      throw error;    } finally {      wideEvent.duration_ms = Date.now() - startTime;      logger.info(wideEvent);  // Uses the single logger    }  };}// Apply middleware globallyapp.use('*', wideEventMiddleware());
```
```
app.post('/checkout', async (c) => {  const wideEvent = c.get('wideEvent');  const user = c.get('user');  // Add business context - environment already included by middleware  wideEvent.user = { id: user.id, subscription: user.subscription };  const cart = await getCart(user.id);  wideEvent.cart = { id: cart.id, total: cart.total };  const order = await createOrder(cart);  wideEvent.order = { id: order.id };  return c.json(order, 201);});// Middleware handles: timing, status, environment, emission// Handler handles: business context only
```
```
app.post('/checkout', async (c) => {  const wideEvent = c.get('wideEvent');  const user = c.get('user');  // Add business context - environment already included by middleware  wideEvent.user = { id: user.id, subscription: user.subscription };  const cart = await getCart(user.id);  wideEvent.cart = { id: cart.id, total: cart.total };  const order = await createOrder(cart);  wideEvent.order = { id: order.id };  return c.json(order, 201);});// Middleware handles: timing, status, environment, emission// Handler handles: business context only
```
```
const wideEvent = {  timestamp: '2024-09-08T06:14:05.680Z',  service: 'articles',  requestId: 'req_abc123',  message: 'Article created',  user: { id: 'user_123', subscription: 'premium' },  article: { id: 'article_456', title: 'My Post' },  duration_ms: 268,  status_code: 201,};// Emit as single-line JSONlogger.info(wideEvent);
```
```
const wideEvent = {  timestamp: '2024-09-08T06:14:05.680Z',  service: 'articles',  requestId: 'req_abc123',  message: 'Article created',  user: { id: 'user_123', subscription: 'premium' },  article: { id: 'article_456', title: 'My Post' },  duration_ms: 268,  status_code: 201,};// Emit as single-line JSONlogger.info(wideEvent);
```
```
user_id
```
```
userId
```
```
// All services use the same schema{  request_id: 'req_abc',  user: { id: 'user_123' },  duration_ms: 268,  status_code: 200,}
```
```
// All services use the same schema{  request_id: 'req_abc',  user: { id: 'user_123' },  duration_ms: 268,  status_code: 200,}
```
```
info
```
```
error
```
```
console.log('User logged in')
```
```
// Add the data to your wide event insteadwideEvent.order = { id: orderId, status: 'created' };wideEvent.payment = { error: { message: error.message } };// Now it's queryable: WHERE order.status = 'created'
```
```
// Add the data to your wide event insteadwideEvent.order = { id: orderId, status: 'created' };wideEvent.payment = { error: { message: error.message } };// Now it's queryable: WHERE order.status = 'created'
```
```
console.log('something happened')
```
```
finally
```
```
app.post('/articles', async (c) => {  console.log('Received POST /articles request');  const body = await c.req.json();  console.log('Request body parsed', { title: body.title });  const user = await getUser(c.get('userId'));  console.log('User fetched', { userId: user.id });  const article = await database.saveArticle({ ...body, ownerId: user.id });  console.log('Article saved', { articleId: article.id });  await cache.set(article.id, article);  console.log('Cache updated');  console.log('Request completed successfully');  return c.json({ article }, 201);});// 6 disconnected log lines with scattered context// Cannot query: "show me all article creates by free trial users"
```
```
app.post('/articles', async (c) => {  console.log('Received POST /articles request');  const body = await c.req.json();  console.log('Request body parsed', { title: body.title });  const user = await getUser(c.get('userId'));  console.log('User fetched', { userId: user.id });  const article = await database.saveArticle({ ...body, ownerId: user.id });  console.log('Article saved', { articleId: article.id });  await cache.set(article.id, article);  console.log('Cache updated');  console.log('Request completed successfully');  return c.json({ article }, 201);});// 6 disconnected log lines with scattered context// Cannot query: "show me all article creates by free trial users"
```
```
app.post('/articles', async (c) => {  const startTime = Date.now();  const wideEvent: Record<string, unknown> = {    method: 'POST',    path: '/articles',    service: 'articles',    requestId: c.get('requestId'),  };  try {    const body = await c.req.json();    const user = await getUser(c.get('userId'));    wideEvent.user = {      id: user.id,      subscription: user.subscription,      trial: user.trial,    };    const article = await database.saveArticle({ ...body, ownerId: user.id });    wideEvent.article = {      id: article.id,      title: article.title,      published: article.published,    };    await cache.set(article.id, article);    wideEvent.cache = { operation: 'write', key: article.id };    wideEvent.status_code = 201;    wideEvent.outcome = 'success';    return c.json({ article }, 201);  } catch (error) {    wideEvent.status_code = 500;    wideEvent.outcome = 'error';    wideEvent.error = { message: error.message, type: error.name };    throw error;  } finally {    wideEvent.duration_ms = Date.now() - startTime;    wideEvent.timestamp = new Date().toISOString();    logger.info(JSON.stringify(wideEvent));  }});// Single event with all context - queryable by any field
```
```
app.post('/articles', async (c) => {  const startTime = Date.now();  const wideEvent: Record<string, unknown> = {    method: 'POST',    path: '/articles',    service: 'articles',    requestId: c.get('requestId'),  };  try {    const body = await c.req.json();    const user = await getUser(c.get('userId'));    wideEvent.user = {      id: user.id,      subscription: user.subscription,      trial: user.trial,    };    const article = await database.saveArticle({ ...body, ownerId: user.id });    wideEvent.article = {      id: article.id,      title: article.title,      published: article.published,    };    await cache.set(article.id, article);    wideEvent.cache = { operation: 'write', key: article.id };    wideEvent.status_code = 201;    wideEvent.outcome = 'success';    return c.json({ article }, 201);  } catch (error) {    wideEvent.status_code = 500;    wideEvent.outcome = 'error';    wideEvent.error = { message: error.message, type: error.name };    throw error;  } finally {    wideEvent.duration_ms = Date.now() - startTime;    wideEvent.timestamp = new Date().toISOString();    logger.info(JSON.stringify(wideEvent));  }});// Single event with all context - queryable by any field
```
```
// Service A - generate and propagateconst requestId = c.get('requestId') || crypto.randomUUID();wideEvent.requestId = requestId;await fetch('http://downstream-service/endpoint', {  headers: { 'x-request-id': requestId },  body: JSON.stringify(data),});// Service B - extract and useconst requestId = c.req.header('x-request-id');wideEvent.requestId = requestId;  // Same ID links events together
```
```
// Service A - generate and propagateconst requestId = c.get('requestId') || crypto.randomUUID();wideEvent.requestId = requestId;await fetch('http://downstream-service/endpoint', {  headers: { 'x-request-id': requestId },  body: JSON.stringify(data),});// Service B - extract and useconst requestId = c.req.header('x-request-id');wideEvent.requestId = requestId;  // Same ID links events together
```
```
finally
```
This skill transcends basic `console.log` statements, guiding developers towards a sophisticated logging paradigm essential for modern, distributed systems. By emphasizing "wide events," it empowers AI coding assistants like Claude Code to help you craft log lines that are not merely informative but deeply insightful. This approach transforms raw data into actionable intelligence, significantly accelerating debugging cycles and enhancing system observability. It's about making your logs work smarter, not just harder, providing a holistic view of request flows and application states.

# When to Use This Skill
- •Refining existing logging statements in a microservice architecture.
- •Designing the logging strategy for a new API endpoint or service.
- •Troubleshooting complex production issues requiring deep request tracing.
- •Implementing analytics tracking based on server-side events.

# Pro Tips
- 💡Integrate structured logging (e.g., JSON) from the outset to easily parse and query logs in tools like Splunk or ELK stack.
- 💡Automate the inclusion of common context (e.g., `requestId`, `userId`) using middleware or decorators to reduce boilerplate.
- 💡Design a clear schema for your wide events to ensure consistency across services and simplify downstream analytics and reporting.

