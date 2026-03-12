# cloudflare-browser-rendering
Source: https://antigravity.codes/agent-skills/ai-tools/cloudflare-browser-rendering

## AI Worker Instructions
When the user requests functionality related to cloudflare-browser-rendering, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-browser-rendering
```
{  "name": "browser-worker",  "main": "src/index.ts",  "compatibility_date": "2023-03-14",  "compatibility_flags": ["nodejs_compat"],  "browser": {    "binding": "MYBROWSER"  }}
```
```
{  "name": "browser-worker",  "main": "src/index.ts",  "compatibility_date": "2023-03-14",  "compatibility_flags": ["nodejs_compat"],  "browser": {    "binding": "MYBROWSER"  }}
```
```
npm install @cloudflare/puppeteer
```
```
npm install @cloudflare/puppeteer
```
```
import puppeteer from "@cloudflare/puppeteer";interface Env {  MYBROWSER: Fetcher;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { searchParams } = new URL(request.url);    const url = searchParams.get("url") || "https://example.com";    // Launch browser    const browser = await puppeteer.launch(env.MYBROWSER);    const page = await browser.newPage();    // Navigate and capture    await page.goto(url);    const screenshot = await page.screenshot();    // Clean up    await browser.close();    return new Response(screenshot, {      headers: { "content-type": "image/png" }    });  }};
```
```
import puppeteer from "@cloudflare/puppeteer";interface Env {  MYBROWSER: Fetcher;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { searchParams } = new URL(request.url);    const url = searchParams.get("url") || "https://example.com";    // Launch browser    const browser = await puppeteer.launch(env.MYBROWSER);    const page = await browser.newPage();    // Navigate and capture    await page.goto(url);    const screenshot = await page.screenshot();    // Clean up    await browser.close();    return new Response(screenshot, {      headers: { "content-type": "image/png" }    });  }};
```
```
npx wrangler deploy
```
```
npx wrangler deploy
```
```
https://your-worker.workers.dev/?url=https://example.com
```
```
env.MYBROWSER
```
```
puppeteer.launch()
```
```
browser.close()
```
```
browser.disconnect()
```
```
nodejs_compat
```
```
@cloudflare/puppeteer@1.0.4
```
```
@cloudflare/playwright@1.0.0
```
```
puppeteer.launch(env.MYBROWSER, options?)
```
```
puppeteer.connect(env.MYBROWSER, sessionId)
```
```
puppeteer.sessions(env.MYBROWSER)
```
```
puppeteer.history(env.MYBROWSER)
```
```
puppeteer.limits(env.MYBROWSER)
```
```
browser.newPage()
```
```
browser.sessionId()
```
```
browser.close()
```
```
browser.disconnect()
```
```
browser.createBrowserContext()
```
```
page.goto(url, { waitUntil, timeout })
```
```
"networkidle0"
```
```
page.screenshot({ fullPage, type, quality, clip })
```
```
page.pdf({ format, printBackground, margin })
```
```
page.evaluate(() => ...)
```
```
page.content()
```
```
page.setContent(html)
```
```
page.waitForSelector(selector)
```
```
page.type(selector, text)
```
```
page.click(selector)
```
```
// Must pass bindingconst browser = await puppeteer.launch(env.MYBROWSER); // ✅// const browser = await puppeteer.launch(); // ❌ Error!// Session reuse for performanceconst sessions = await puppeteer.sessions(env.MYBROWSER);const freeSessions = sessions.filter(s => !s.connectionId);if (freeSessions.length > 0) {  browser = await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId);}// Keep session aliveawait browser.disconnect(); // Don't close// XPath workaround (not directly supported)const data = await page.evaluate(() => {  return new XPathEvaluator()    .createExpression("/html/body/div/h1")    .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)    .singleNodeValue.innerHTML;});
```
```
// Must pass bindingconst browser = await puppeteer.launch(env.MYBROWSER); // ✅// const browser = await puppeteer.launch(); // ❌ Error!// Session reuse for performanceconst sessions = await puppeteer.sessions(env.MYBROWSER);const freeSessions = sessions.filter(s => !s.connectionId);if (freeSessions.length > 0) {  browser = await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId);}// Keep session aliveawait browser.disconnect(); // Don't close// XPath workaround (not directly supported)const data = await page.evaluate(() => {  return new XPathEvaluator()    .createExpression("/html/body/div/h1")    .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)    .singleNodeValue.innerHTML;});
```
```
npm install @cloudflare/playwright
```
```
npm install @cloudflare/playwright
```
```
{  "compatibility_flags": ["nodejs_compat"],  "compatibility_date": "2025-09-15"  // Required for Playwright v1.55}
```
```
{  "compatibility_flags": ["nodejs_compat"],  "compatibility_date": "2025-09-15"  // Required for Playwright v1.55}
```
```
import { chromium } from "@cloudflare/playwright";const browser = await chromium.launch(env.BROWSER);const page = await browser.newPage();await page.goto("https://example.com");const screenshot = await page.screenshot();await browser.close();
```
```
import { chromium } from "@cloudflare/playwright";const browser = await chromium.launch(env.BROWSER);const page = await browser.newPage();await page.goto("https://example.com");const screenshot = await page.screenshot();await browser.close();
```
```
puppeteer
```
```
{ chromium }
```
```
waitForSelector()
```
```
async function getBrowser(env: Env): Promise<Browser> {  const sessions = await puppeteer.sessions(env.MYBROWSER);  const freeSessions = sessions.filter(s => !s.connectionId);  if (freeSessions.length > 0) {    try {      return await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId);    } catch (e) {      console.log("Failed to connect, launching new browser");    }  }  return await puppeteer.launch(env.MYBROWSER);}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const browser = await getBrowser(env);    try {      const page = await browser.newPage();      await page.goto("https://example.com");      const screenshot = await page.screenshot();      await browser.disconnect(); // ✅ Keep alive for reuse      return new Response(screenshot, {        headers: { "content-type": "image/png" }      });    } catch (error) {      await browser.close(); // ❌ Close on error      throw error;    }  }};
```
```
async function getBrowser(env: Env): Promise<Browser> {  const sessions = await puppeteer.sessions(env.MYBROWSER);  const freeSessions = sessions.filter(s => !s.connectionId);  if (freeSessions.length > 0) {    try {      return await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId);    } catch (e) {      console.log("Failed to connect, launching new browser");    }  }  return await puppeteer.launch(env.MYBROWSER);}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const browser = await getBrowser(env);    try {      const page = await browser.newPage();      await page.goto("https://example.com");      const screenshot = await page.screenshot();      await browser.disconnect(); // ✅ Keep alive for reuse      return new Response(screenshot, {        headers: { "content-type": "image/png" }      });    } catch (error) {      await browser.close(); // ❌ Close on error      throw error;    }  }};
```
```
browser.disconnect()
```
```
browser.close()
```
```
browser.createBrowserContext()
```
```
const browser = await puppeteer.launch(env.MYBROWSER);const context1 = await browser.createBrowserContext(); // User 1const context2 = await browser.createBrowserContext(); // User 2const page1 = await context1.newPage();const page2 = await context2.newPage();// Separate cookies/cache per context
```
```
const browser = await puppeteer.launch(env.MYBROWSER);const context1 = await browser.createBrowserContext(); // User 1const context2 = await browser.createBrowserContext(); // User 2const page1 = await context1.newPage();const page2 = await context2.newPage();// Separate cookies/cache per context
```
```
Promise.all()
```
```
browser.newPage()
```
```
const browser = await puppeteer.launch(env.MYBROWSER);const results = await Promise.all(  urls.map(async (url) => {    const page = await browser.newPage();    await page.goto(url);    const data = await page.evaluate(() => ({ title: document.title }));    await page.close();    return { url, data };  }));await browser.close();
```
```
const browser = await puppeteer.launch(env.MYBROWSER);const results = await Promise.all(  urls.map(async (url) => {    const page = await browser.newPage();    await page.goto(url);    const data = await page.evaluate(() => ({ title: document.title }));    await page.close();    return { url, data };  }));await browser.close();
```
```
interface Env {  MYBROWSER: Fetcher;  CACHE: KVNamespace;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { searchParams } = new URL(request.url);    const url = searchParams.get("url");    if (!url) return new Response("Missing ?url parameter", { status: 400 });    const normalizedUrl = new URL(url).toString();    // Check cache first    let screenshot = await env.CACHE.get(normalizedUrl, { type: "arrayBuffer" });    if (!screenshot) {      const browser = await puppeteer.launch(env.MYBROWSER);      const page = await browser.newPage();      await page.goto(normalizedUrl);      screenshot = await page.screenshot();      await browser.close();      // Cache for 24 hours      await env.CACHE.put(normalizedUrl, screenshot, { expirationTtl: 60 * 60 * 24 });    }    return new Response(screenshot, { headers: { "content-type": "image/png" } });  }};
```
```
interface Env {  MYBROWSER: Fetcher;  CACHE: KVNamespace;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { searchParams } = new URL(request.url);    const url = searchParams.get("url");    if (!url) return new Response("Missing ?url parameter", { status: 400 });    const normalizedUrl = new URL(url).toString();    // Check cache first    let screenshot = await env.CACHE.get(normalizedUrl, { type: "arrayBuffer" });    if (!screenshot) {      const browser = await puppeteer.launch(env.MYBROWSER);      const page = await browser.newPage();      await page.goto(normalizedUrl);      screenshot = await page.screenshot();      await browser.close();      // Cache for 24 hours      await env.CACHE.put(normalizedUrl, screenshot, { expirationTtl: 60 * 60 * 24 });    }    return new Response(screenshot, { headers: { "content-type": "image/png" } });  }};
```
```
interface Env {  MYBROWSER: Fetcher;  AI: Ai;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { searchParams } = new URL(request.url);    const url = searchParams.get("url");    // Scrape page content    const browser = await puppeteer.launch(env.MYBROWSER);    const page = await browser.newPage();    await page.goto(url!, { waitUntil: "networkidle0" });    const bodyContent = await page.$eval("body", el => el.innerHTML);    await browser.close();    // Extract structured data with AI    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {      messages: [{        role: "user",        content: Extract product info as JSON from this HTML. Include: name, price, description.\n\nHTML:\n${bodyContent.slice(0, 4000)}      }]    });    return Response.json({ url, product: JSON.parse(response.response) });  }};
```
```
interface Env {  MYBROWSER: Fetcher;  AI: Ai;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { searchParams } = new URL(request.url);    const url = searchParams.get("url");    // Scrape page content    const browser = await puppeteer.launch(env.MYBROWSER);    const page = await browser.newPage();    await page.goto(url!, { waitUntil: "networkidle0" });    const bodyContent = await page.$eval("body", el => el.innerHTML);    await browser.close();    // Extract structured data with AI    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {      messages: [{        role: "user",        content: Extract product info as JSON from this HTML. Include: name, price, description.\n\nHTML:\n${bodyContent.slice(0, 4000)}      }]    });    return Response.json({ url, product: JSON.parse(response.response) });  }};
```
```
Extract product info as JSON from this HTML. Include: name, price, description.\n\nHTML:\n${bodyContent.slice(0, 4000)}
```
```
page.pdf()
```
```
page.evaluate()
```
```
page.type()
```
```
page.click()
```
```
templates/
```
```
puppeteer.limits(env.MYBROWSER)
```
```
const limits = await puppeteer.limits(env.MYBROWSER);if (limits.allowedBrowserAcquisitions === 0) {  const delay = limits.timeUntilNextAllowedBrowserAcquisition || 1000;  await new Promise(resolve => setTimeout(resolve, delay));}
```
```
const limits = await puppeteer.limits(env.MYBROWSER);if (limits.allowedBrowserAcquisitions === 0) {  const delay = limits.timeUntilNextAllowedBrowserAcquisition || 1000;  await new Promise(resolve => setTimeout(resolve, delay));}
```
```
page.evaluate()
```
```
// ❌ Don't use XPath directly (not supported)// await page.$x('/html/body/div/h1')// ✅ Use CSS selectorconst heading = await page.$("div > h1");// ✅ Or use XPath in page.evaluate()const innerHtml = await page.evaluate(() => {  return new XPathEvaluator()    .createExpression("/html/body/div/h1")    .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)    .singleNodeValue.innerHTML;});
```
```
// ❌ Don't use XPath directly (not supported)// await page.$x('/html/body/div/h1')// ✅ Use CSS selectorconst heading = await page.$("div > h1");// ✅ Or use XPath in page.evaluate()const innerHtml = await page.evaluate(() => {  return new XPathEvaluator()    .createExpression("/html/body/div/h1")    .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)    .singleNodeValue.innerHTML;});
```
```
puppeteer.launch()
```
```
env.MYBROWSER.launch()
```
```
env.MYBROWSER
```
```
puppeteer.launch()
```
```
chromium.launch()
```
```
// ❌ Missing browser bindingconst browser = await puppeteer.launch(); // Error!// ❌ Wrong - trying to call launch() on Fetcher directlyconst browser = await env.MYBROWSER.launch(); // "RPC receiver does not implement the method 'launch'"// ✅ Pass binding to Puppeteer/Playwright wrapperconst browser = await puppeteer.launch(env.MYBROWSER);// or for Playwright:const browser = await chromium.launch(env.MYBROWSER);
```
```
// ❌ Missing browser bindingconst browser = await puppeteer.launch(); // Error!// ❌ Wrong - trying to call launch() on Fetcher directlyconst browser = await env.MYBROWSER.launch(); // "RPC receiver does not implement the method 'launch'"// ✅ Pass binding to Puppeteer/Playwright wrapperconst browser = await puppeteer.launch(env.MYBROWSER);// or for Playwright:const browser = await chromium.launch(env.MYBROWSER);
```
```
interface Env {  MYBROWSER: Fetcher; // It's a Fetcher, not a Browser!}
```
```
interface Env {  MYBROWSER: Fetcher; // It's a Fetcher, not a Browser!}
```
```
keep_alive
```
```
// Extend timeout to 5 minutes for long-running tasksconst browser = await puppeteer.launch(env.MYBROWSER, {  keep_alive: 300000 // 5 minutes = 300,000 ms});
```
```
// Extend timeout to 5 minutes for long-running tasksconst browser = await puppeteer.launch(env.MYBROWSER, {  keep_alive: 300000 // 5 minutes = 300,000 ms});
```
```
// 1. Check limits before launchingconst limits = await puppeteer.limits(env.MYBROWSER);if (limits.allowedBrowserAcquisitions === 0) {  return new Response("Concurrency limit reached", { status: 429 });}// 2. Reuse sessionsconst sessions = await puppeteer.sessions(env.MYBROWSER);const freeSessions = sessions.filter(s => !s.connectionId);if (freeSessions.length > 0) {  const browser = await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId);}// 3. Use tabs instead of multiple browsersconst browser = await puppeteer.launch(env.MYBROWSER);const page1 = await browser.newPage();const page2 = await browser.newPage(); // Same browser, different tabs
```
```
// 1. Check limits before launchingconst limits = await puppeteer.limits(env.MYBROWSER);if (limits.allowedBrowserAcquisitions === 0) {  return new Response("Concurrency limit reached", { status: 429 });}// 2. Reuse sessionsconst sessions = await puppeteer.sessions(env.MYBROWSER);const freeSessions = sessions.filter(s => !s.connectionId);if (freeSessions.length > 0) {  const browser = await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId);}// 3. Use tabs instead of multiple browsersconst browser = await puppeteer.launch(env.MYBROWSER);const page1 = await browser.newPage();const page2 = await browser.newPage(); // Same browser, different tabs
```
```
wrangler dev
```
```
remote: true
```
```
// wrangler.jsonc for local development{  "browser": {    "binding": "MYBROWSER",    "remote": true  // Use real headless browser during dev  }}
```
```
// wrangler.jsonc for local development{  "browser": {    "binding": "MYBROWSER",    "remote": true  // Use real headless browser during dev  }}
```
```
// ❌ Cannot bypass bot protection// Requests will always be identified as bots// ✅ If scraping your own Cloudflare zone (Enterprise plan only):// 1. Go to Security > WAF > Custom rules// 2. Create skip rule with custom header://    Header: X-Custom-Auth//    Value: your-secret-token// 3. Pass header in your scraping requestsawait page.setExtraHTTPHeaders({  'X-Custom-Auth': 'your-secret-token'});// Note: Automatic headers are included:// - cf-biso-request-id// - cf-biso-devtools
```
```
// ❌ Cannot bypass bot protection// Requests will always be identified as bots// ✅ If scraping your own Cloudflare zone (Enterprise plan only):// 1. Go to Security > WAF > Custom rules// 2. Create skip rule with custom header://    Header: X-Custom-Auth//    Value: your-secret-token// 3. Pass header in your scraping requestsawait page.setExtraHTTPHeaders({  'X-Custom-Auth': 'your-secret-token'});// Note: Automatic headers are included:// - cf-biso-request-id// - cf-biso-devtools
```
```
ReferenceError: __name is not defined
```
```
__name()
```
```
page.evaluate()
```
```
// ❌ Avoid nested function declarationsconst data = await page.evaluate(async () => {  function toNumber(str: string | undefined): number | undefined {    const num = typeof str === 'string' ? str.replaceAll('.', '').replaceAll(',', '.').match(/[+-]?([0-9]*[.])?[0-9]+/) : false;    if (num) {      return Number(num[0]);    } else {      return undefined;    }  }  return toNumber('123.456');});// Error: ReferenceError: __name is not defined// ✅ Inline the logic without nested functionsconst data = await page.evaluate(async () => {  const str = '123.456';  const num = typeof str === 'string' ? str.replaceAll('.', '').replaceAll(',', '.').match(/[+-]?([0-9]*[.])?[0-9]+/) : false;  return num ? Number(num[0]) : undefined;});// ✅ Or update to wrangler 3.83.0+// npm install wrangler@latest
```
```
// ❌ Avoid nested function declarationsconst data = await page.evaluate(async () => {  function toNumber(str: string | undefined): number | undefined {    const num = typeof str === 'string' ? str.replaceAll('.', '').replaceAll(',', '.').match(/[+-]?([0-9]*[.])?[0-9]+/) : false;    if (num) {      return Number(num[0]);    } else {      return undefined;    }  }  return toNumber('123.456');});// Error: ReferenceError: __name is not defined// ✅ Inline the logic without nested functionsconst data = await page.evaluate(async () => {  const str = '123.456';  const num = typeof str === 'string' ? str.replaceAll('.', '').replaceAll(',', '.').match(/[+-]?([0-9]*[.])?[0-9]+/) : false;  return num ? Number(num[0]) : undefined;});// ✅ Or update to wrangler 3.83.0+// npm install wrangler@latest
```
```
page.waitForSelector()
```
```
waitForSelector()
```
```
// ❌ Old behavior - would hang forever if selector not foundawait page.waitForSelector('#dynamic-element');// ✅ New behavior - properly times out (set explicit timeout)try {  await page.waitForSelector('#dynamic-element', { timeout: 5000 });} catch (error) {  if (error.name === 'TimeoutError') {    console.log('Element not found within 5 seconds');    // Handle missing element gracefully  } else {    throw error;  }}// ✅ Use longer timeout for slow-loading elementsawait page.waitForSelector('#slow-element', { timeout: 30000 }); // 30 seconds
```
```
// ❌ Old behavior - would hang forever if selector not foundawait page.waitForSelector('#dynamic-element');// ✅ New behavior - properly times out (set explicit timeout)try {  await page.waitForSelector('#dynamic-element', { timeout: 5000 });} catch (error) {  if (error.name === 'TimeoutError') {    console.log('Element not found within 5 seconds');    // Handle missing element gracefully  } else {    throw error;  }}// ✅ Use longer timeout for slow-loading elementsawait page.waitForSelector('#slow-element', { timeout: 30000 }); // 30 seconds
```
```
TimeoutError
```
```
async function withBrowser<T>(env: Env, fn: (browser: Browser) => Promise<T>): Promise<T> {  let browser: Browser | null = null;  try {    // 1. Check limits before launching    const limits = await puppeteer.limits(env.MYBROWSER);    if (limits.allowedBrowserAcquisitions === 0) {      throw new Error("Rate limit reached");    }    // 2. Try session reuse first    const sessions = await puppeteer.sessions(env.MYBROWSER);    const freeSessions = sessions.filter(s => !s.connectionId);    browser = freeSessions.length > 0      ? await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId)      : await puppeteer.launch(env.MYBROWSER);    // 3. Execute user function    const result = await fn(browser);    // 4. Disconnect (keep alive)    await browser.disconnect();    return result;  } catch (error) {    // 5. Close on error    if (browser) await browser.close();    throw error;  }}
```
```
async function withBrowser<T>(env: Env, fn: (browser: Browser) => Promise<T>): Promise<T> {  let browser: Browser | null = null;  try {    // 1. Check limits before launching    const limits = await puppeteer.limits(env.MYBROWSER);    if (limits.allowedBrowserAcquisitions === 0) {      throw new Error("Rate limit reached");    }    // 2. Try session reuse first    const sessions = await puppeteer.sessions(env.MYBROWSER);    const freeSessions = sessions.filter(s => !s.connectionId);    browser = freeSessions.length > 0      ? await puppeteer.connect(env.MYBROWSER, freeSessions[0].sessionId)      : await puppeteer.launch(env.MYBROWSER);    // 3. Execute user function    const result = await fn(browser);    // 4. Disconnect (keep alive)    await browser.disconnect();    return result;  } catch (error) {    // 5. Close on error    if (browser) await browser.close();    throw error;  }}
```
```
basic-screenshot.ts
```
```
screenshot-with-kv-cache.ts
```
```
pdf-generation.ts
```
```
web-scraper-basic.ts
```
```
web-scraper-batch.ts
```
```
session-reuse.ts
```
```
ai-enhanced-scraper.ts
```
```
playwright-example.ts
```
```
wrangler-browser-config.jsonc
```
```
# Copy template to your projectcp ~/.claude/skills/cloudflare-browser-rendering/templates/basic-screenshot.ts src/index.ts
```
```
# Copy template to your projectcp ~/.claude/skills/cloudflare-browser-rendering/templates/basic-screenshot.ts src/index.ts
```
```
session-management.md
```
```
pricing-and-limits.md
```
```
common-errors.md
```
```
puppeteer-vs-playwright.md
```
```
@cloudflare/puppeteer@1.0.4
```
```
wrangler@4.43.0+
```
```
@cloudflare/playwright@1.0.0
```
```
@cloudflare/workers-types@4.20251014.0+
```
```
cloudflare-worker-base
```
```
cloudflare-kv
```
```
cloudflare-r2
```
```
cloudflare-workers-ai
```
```
{  "dependencies": {    "@cloudflare/puppeteer": "^1.0.4"  },  "devDependencies": {    "@cloudflare/workers-types": "^4.20251014.0",    "wrangler": "^4.59.3"  }}
```
```
{  "dependencies": {    "@cloudflare/puppeteer": "^1.0.4"  },  "devDependencies": {    "@cloudflare/workers-types": "^4.20251014.0",    "wrangler": "^4.59.3"  }}
```
```
{  "dependencies": {    "@cloudflare/playwright": "^1.1.0"  }}
```
```
{  "dependencies": {    "@cloudflare/playwright": "^1.1.0"  }}
```
```
page.evaluate()
```
```
const browser = await puppeteer.launch(env.MYBROWSER); // Not just puppeteer.launch()
```
```
const browser = await puppeteer.launch(env.MYBROWSER); // Not just puppeteer.launch()
```
```
const browser = await puppeteer.launch(env.MYBROWSER, { keep_alive: 300000 });
```
```
const browser = await puppeteer.launch(env.MYBROWSER, { keep_alive: 300000 });
```
```
{ "browser": { "binding": "MYBROWSER", "remote": true } }
```
```
{ "browser": { "binding": "MYBROWSER", "remote": true } }
```
```
references/common-errors.md
```
```
references/session-management.md
```
```
nodejs_compat
```
```
/* ❌ "Browser binding not passed" error */import puppeteer from '@cloudflare/puppeteer'const browser = await puppeteer.launch()/* ✅ Pass the binding */import puppeteer from '@cloudflare/puppeteer'const browser = await puppeteer.launch(env.MYBROWSER)
```
```
/* ❌ "Browser binding not passed" error */import puppeteer from '@cloudflare/puppeteer'const browser = await puppeteer.launch()/* ✅ Pass the binding */import puppeteer from '@cloudflare/puppeteer'const browser = await puppeteer.launch(env.MYBROWSER)
```
```
/* ❌ Security risk, not supported */await page.$x('//button[@class="submit"]')/* ✅ Use CSS selectors or page.evaluate() */await page.$('button.submit')// ORawait page.evaluate(() => {  return document.evaluate(    '//button[@class="submit"]',    document,    null,    XPathResult.FIRST_ORDERED_NODE_TYPE,    null  ).singleNodeValue})
```
```
/* ❌ Security risk, not supported */await page.$x('//button[@class="submit"]')/* ✅ Use CSS selectors or page.evaluate() */await page.$('button.submit')// ORawait page.evaluate(() => {  return document.evaluate(    '//button[@class="submit"]',    document,    null,    XPathResult.FIRST_ORDERED_NODE_TYPE,    null  ).singleNodeValue})
```
```
/* ❌ close() terminates session */await browser.close() // Session ends/* ✅ disconnect() keeps session alive */ctx.waitUntil(browser.disconnect()) // Session reusable
```
```
/* ❌ close() terminates session */await browser.close() // Session ends/* ✅ disconnect() keeps session alive */ctx.waitUntil(browser.disconnect()) // Session reusable
```
```
/* ❌ Multiple browser instances */const browser1 = await puppeteer.launch(env.MYBROWSER)const browser2 = await puppeteer.launch(env.MYBROWSER)/* ✅ Use multiple tabs in one browser */const browser = await puppeteer.launch(env.MYBROWSER)const page1 = await browser.newPage()const page2 = await browser.newPage()
```
```
/* ❌ Multiple browser instances */const browser1 = await puppeteer.launch(env.MYBROWSER)const browser2 = await puppeteer.launch(env.MYBROWSER)/* ✅ Use multiple tabs in one browser */const browser = await puppeteer.launch(env.MYBROWSER)const page1 = await browser.newPage()const page2 = await browser.newPage()
```
```
/* ✅ Playwright v1.55 GA (Sept 2025) */// wrangler.jsonc:{  "compatibility_date": "2025-09-15" // Required for Playwright}
```
```
/* ✅ Playwright v1.55 GA (Sept 2025) */// wrangler.jsonc:{  "compatibility_date": "2025-09-15" // Required for Playwright}
```
```
/* ✅ Reuse sessions for performance */const sessionId = await env.MYBROWSER.sessions.create({ keep_alive: 60000 })const browser = await puppeteer.connect(env.MYBROWSER, sessionId)// Later requests can reconnectconst browser = await puppeteer.connect(env.MYBROWSER, existingSessionId)
```
```
/* ✅ Reuse sessions for performance */const sessionId = await env.MYBROWSER.sessions.create({ keep_alive: 60000 })const browser = await puppeteer.connect(env.MYBROWSER, sessionId)// Later requests can reconnectconst browser = await puppeteer.connect(env.MYBROWSER, existingSessionId)
```
```
/* ⚠️ Default 60 second timeout */// For longer tasks, set keep_aliveconst browser = await puppeteer.launch(env.MYBROWSER, {  keep_alive: 300000, // 5 minutes})
```
```
/* ⚠️ Default 60 second timeout */// For longer tasks, set keep_aliveconst browser = await puppeteer.launch(env.MYBROWSER, {  keep_alive: 300000, // 5 minutes})
```
```
puppeteer.launch()
```
```
puppeteer.launch(env.MYBROWSER)
```
```
page.$x()
```
```
page.evaluate()
```
```
browser.close()
```
```
ctx.waitUntil(browser.disconnect())
```
```
compatibility_date: "2025-09-15"
```
Unlock the power of serverless browser automation with the Cloudflare Browser Rendering Agent Skill. This comprehensive knowledge domain equips your AI assistant to design, deploy, and manage advanced web automation workflows directly on Cloudflare Workers. Seamlessly integrate Puppeteer and Playwright to perform tasks like dynamic content scraping, end-to-end testing, and interactive user simulations at scale. Leverage Cloudflare's edge network for high-performance and resilient browser-based operations, transforming complex web interactions into actionable insights or automated processes. Ideal for developers seeking to extend their AI agent's capabilities in the modern web environment.

# When to Use This Skill
- •Scraping dynamic web content from JavaScript-rendered pages.
- •Performing automated end-to-end testing for web applications.
- •Monitoring website changes or broken links programmatically.
- •Generating high-fidelity screenshots or PDFs of web pages at scale.

# Pro Tips
- 💡Utilize Cloudflare Workers AI integrations for advanced content processing post-scraping.
- 💡Leverage the /links excludeExternalLinks parameter for focused internal link crawling.
- 💡Monitor the X-Browser-Ms-Used header to optimize performance and manage billing costs effectively.

