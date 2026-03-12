# playwright-local
Source: https://antigravity.codes/agent-skills/testing/playwright-local

## AI Worker Instructions
When the user requests functionality related to playwright-local, follow these guidelines and utilize this context.

## Scraped Content

# playwright-local
```
npm install -D playwrightnpx playwright install chromium
```
```
npm install -D playwrightnpx playwright install chromium
```
```
pip install playwrightplaywright install chromium
```
```
pip install playwrightplaywright install chromium
```
```
playwright install
```
```
chromium
```
```
firefox
```
```
webkit
```
```
~/.cache/ms-playwright/
```
```
import { chromium } from 'playwright';const browser = await chromium.launch({ headless: true });const page = await browser.newPage();await page.goto('https://example.com', { waitUntil: 'networkidle' });const title = await page.title();const content = await page.textContent('body');await browser.close();console.log({ title, content });
```
```
import { chromium } from 'playwright';const browser = await chromium.launch({ headless: true });const page = await browser.newPage();await page.goto('https://example.com', { waitUntil: 'networkidle' });const title = await page.title();const content = await page.textContent('body');await browser.close();console.log({ title, content });
```
```
await browser.close()
```
```
waitUntil: 'networkidle'
```
```
timeout: 60000
```
```
# Node.jsnpx tsx scrape.ts# Pythonpython scrape.py
```
```
# Node.jsnpx tsx scrape.ts# Pythonpython scrape.py
```
```
steps
```
```
nodriver
```
```
undetected-chromedriver
```
```
npm install playwright-extra playwright-stealth
```
```
npm install playwright-extra playwright-stealth
```
```
npm install puppeteer-extra puppeteer-extra-plugin-stealth
```
```
npm install puppeteer-extra puppeteer-extra-plugin-stealth
```
```
import { chromium } from 'playwright-extra';import stealth from 'puppeteer-extra-plugin-stealth';chromium.use(stealth());const browser = await chromium.launch({  headless: true,  args: [    '--disable-blink-features=AutomationControlled',    '--no-sandbox',    '--disable-setuid-sandbox',  ],});const context = await browser.newContext({  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  viewport: { width: 1920, height: 1080 },  locale: 'en-US',  timezoneId: 'America/New_York',});
```
```
import { chromium } from 'playwright-extra';import stealth from 'puppeteer-extra-plugin-stealth';chromium.use(stealth());const browser = await chromium.launch({  headless: true,  args: [    '--disable-blink-features=AutomationControlled',    '--no-sandbox',    '--disable-setuid-sandbox',  ],});const context = await browser.newContext({  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  viewport: { width: 1920, height: 1080 },  locale: 'en-US',  timezoneId: 'America/New_York',});
```
```
--disable-blink-features=AutomationControlled
```
```
navigator.webdriver
```
```
await page.addInitScript(() => {  // Remove webdriver property  Object.defineProperty(navigator, 'webdriver', {    get: () => undefined,  });  // Mock plugins  Object.defineProperty(navigator, 'plugins', {    get: () => [1, 2, 3, 4, 5],  });  // Mock languages  Object.defineProperty(navigator, 'languages', {    get: () => ['en-US', 'en'],  });  // Consistent permissions  const originalQuery = window.navigator.permissions.query;  window.navigator.permissions.query = (parameters) => (    parameters.name === 'notifications' ?      Promise.resolve({ state: Notification.permission }) :      originalQuery(parameters)  );});
```
```
await page.addInitScript(() => {  // Remove webdriver property  Object.defineProperty(navigator, 'webdriver', {    get: () => undefined,  });  // Mock plugins  Object.defineProperty(navigator, 'plugins', {    get: () => [1, 2, 3, 4, 5],  });  // Mock languages  Object.defineProperty(navigator, 'languages', {    get: () => ['en-US', 'en'],  });  // Consistent permissions  const originalQuery = window.navigator.permissions.query;  window.navigator.permissions.query = (parameters) => (    parameters.name === 'notifications' ?      Promise.resolve({ state: Notification.permission }) :      originalQuery(parameters)  );});
```
```
// Simulate human cursor movementasync function humanClick(page, selector) {  const element = await page.locator(selector);  const box = await element.boundingBox();  if (box) {    // Move to random point within element    const x = box.x + box.width * Math.random();    const y = box.y + box.height * Math.random();    await page.mouse.move(x, y, { steps: 10 });    await page.mouse.click(x, y, { delay: 100 });  }}
```
```
// Simulate human cursor movementasync function humanClick(page, selector) {  const element = await page.locator(selector);  const box = await element.boundingBox();  if (box) {    // Move to random point within element    const x = box.x + box.width * Math.random();    const y = box.y + box.height * Math.random();    await page.mouse.move(x, y, { steps: 10 });    await page.mouse.click(x, y, { delay: 100 });  }}
```
```
const userAgents = [  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',];const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];const context = await browser.newContext({  userAgent: randomUA,});
```
```
const userAgents = [  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',];const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];const context = await browser.newContext({  userAgent: randomUA,});
```
```
import { chromium } from 'playwright';import fs from 'fs/promises';// Save sessionconst context = await browser.newContext();const page = await context.newPage();// ... perform login ...const cookies = await context.cookies();await fs.writeFile('session.json', JSON.stringify(cookies, null, 2));await context.close();// Restore sessionconst savedCookies = JSON.parse(await fs.readFile('session.json', 'utf-8'));const newContext = await browser.newContext();await newContext.addCookies(savedCookies);
```
```
import { chromium } from 'playwright';import fs from 'fs/promises';// Save sessionconst context = await browser.newContext();const page = await context.newPage();// ... perform login ...const cookies = await context.cookies();await fs.writeFile('session.json', JSON.stringify(cookies, null, 2));await context.close();// Restore sessionconst savedCookies = JSON.parse(await fs.readFile('session.json', 'utf-8'));const newContext = await browser.newContext();await newContext.addCookies(savedCookies);
```
```
const page = await context.newPage();await page.goto('https://bot.sannysoft.com/', { waitUntil: 'networkidle' });await page.screenshot({ path: 'stealth-test.png', fullPage: true });
```
```
const page = await context.newPage();await page.goto('https://bot.sannysoft.com/', { waitUntil: 'networkidle' });await page.screenshot({ path: 'stealth-test.png', fullPage: true });
```
```
navigator.webdriver
```
```
undefined
```
```
false
```
```
waitUntil: 'networkidle'
```
```
await browser.close()
```
```
page.waitForSelector()
```
```
headless: false
```
```
headless: true
```
```
page.click()
```
```
waitForSelector
```
```
setTimeout()
```
```
waitForSelector
```
```
waitForLoadState
```
```
import { test, expect } from '@playwright/test';test('capture console output', async ({ page }) => {  await page.goto('https://example.com');  // Get all recent console messages  const messages = page.consoleMessages();  // Filter by type  const errors = messages.filter(m => m.type() === 'error');  const logs = messages.filter(m => m.type() === 'log');  console.log('Console errors:', errors.map(m => m.text()));});
```
```
import { test, expect } from '@playwright/test';test('capture console output', async ({ page }) => {  await page.goto('https://example.com');  // Get all recent console messages  const messages = page.consoleMessages();  // Filter by type  const errors = messages.filter(m => m.type() === 'error');  const logs = messages.filter(m => m.type() === 'log');  console.log('Console errors:', errors.map(m => m.text()));});
```
```
test('check for JavaScript errors', async ({ page }) => {  await page.goto('https://example.com');  // Get all page errors (uncaught exceptions)  const errors = page.pageErrors();  // Fail test if any errors occurred  expect(errors).toHaveLength(0);});
```
```
test('check for JavaScript errors', async ({ page }) => {  await page.goto('https://example.com');  // Get all page errors (uncaught exceptions)  const errors = page.pageErrors();  // Fail test if any errors occurred  expect(errors).toHaveLength(0);});
```
```
test('inspect API calls', async ({ page }) => {  await page.goto('https://example.com');  // Get all recent network requests  const requests = page.requests();  // Filter for API calls  const apiCalls = requests.filter(r => r.url().includes('/api/'));  console.log('API calls made:', apiCalls.length);  // Check for failed requests  const failed = requests.filter(r => r.failure());  expect(failed).toHaveLength(0);});
```
```
test('inspect API calls', async ({ page }) => {  await page.goto('https://example.com');  // Get all recent network requests  const requests = page.requests();  // Filter for API calls  const apiCalls = requests.filter(r => r.url().includes('/api/'));  console.log('API calls made:', apiCalls.length);  // Check for failed requests  const failed = requests.filter(r => r.failure());  expect(failed).toHaveLength(0);});
```
```
steps
```
```
// Move to element in 10 intermediate steps (smoother, more human-like)await page.locator('button.submit').click({ steps: 10 });// Fast click (fewer steps)await page.locator('button.cancel').click({ steps: 2 });
```
```
// Move to element in 10 intermediate steps (smoother, more human-like)await page.locator('button.submit').click({ steps: 10 });// Fast click (fewer steps)await page.locator('button.cancel').click({ steps: 2 });
```
```
const source = page.locator('#draggable');const target = page.locator('#dropzone');// Smooth drag animation (20 steps)await source.dragTo(target, { steps: 20 });// Quick drag (5 steps)await source.dragTo(target, { steps: 5 });
```
```
const source = page.locator('#draggable');const target = page.locator('#dropzone');// Smooth drag animation (20 steps)await source.dragTo(target, { steps: 20 });// Quick drag (5 steps)await source.dragTo(target, { steps: 5 });
```
```
steps: 10
```
```
Protocol error (Target.sendMessageToTarget): Target closed.
```
```
try {  await page.goto(url, { timeout: 30000 });} catch (error) {  if (error.message.includes('Target closed')) {    console.log('Browser crashed, restarting...');    await browser.close();    browser = await chromium.launch();  }}
```
```
try {  await page.goto(url, { timeout: 30000 });} catch (error) {  if (error.message.includes('Target closed')) {    console.log('Browser crashed, restarting...');    await browser.close();    browser = await chromium.launch();  }}
```
```
TimeoutError: waiting for selector "button" failed: timeout 30000ms exceeded
```
```
// Use waitForSelector with explicit timeoutconst button = await page.waitForSelector('button.submit', {  state: 'visible',  timeout: 10000,});await button.click();// Or use locator with auto-waitawait page.locator('button.submit').click();
```
```
// Use waitForSelector with explicit timeoutconst button = await page.waitForSelector('button.submit', {  state: 'visible',  timeout: 10000,});await button.click();// Or use locator with auto-waitawait page.locator('button.submit').click();
```
```
TimeoutError: page.goto: Timeout 30000ms exceeded.
```
```
try {  await page.goto(url, {    waitUntil: 'domcontentloaded', // Less strict than networkidle    timeout: 60000, // Increase for slow sites  });} catch (error) {  if (error.name === 'TimeoutError') {    console.log('Navigation timeout, checking if page loaded...');    const title = await page.title();    if (title) {      console.log('Page loaded despite timeout');    }  }}
```
```
try {  await page.goto(url, {    waitUntil: 'domcontentloaded', // Less strict than networkidle    timeout: 60000, // Increase for slow sites  });} catch (error) {  if (error.name === 'TimeoutError') {    console.log('Navigation timeout, checking if page loaded...');    const title = await page.title();    if (title) {      console.log('Page loaded despite timeout');    }  }}
```
```
Error: Execution context was destroyed, most likely because of a navigation.
```
```
// Re-query element after navigationasync function safeClick(page, selector) {  await page.waitForSelector(selector);  await page.click(selector);  await page.waitForLoadState('networkidle');}
```
```
// Re-query element after navigationasync function safeClick(page, selector) {  await page.waitForSelector(selector);  await page.click(selector);  await page.waitForLoadState('networkidle');}
```
```
navigator.webdriver
```
```
const [download] = await Promise.all([  page.waitForEvent('download'),  page.click('a.download-link'),]);const path = await download.path();await download.saveAs('./downloads/' + download.suggestedFilename());
```
```
const [download] = await Promise.all([  page.waitForEvent('download'),  page.click('a.download-link'),]);const path = await download.path();await download.saveAs('./downloads/' + download.suggestedFilename());
```
```
let previousHeight = 0;while (true) {  const currentHeight = await page.evaluate(() => document.body.scrollHeight);  if (currentHeight === previousHeight) {    break; // No more content  }  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));  await page.waitForTimeout(2000); // Wait for new content to load  previousHeight = currentHeight;}
```
```
let previousHeight = 0;while (true) {  const currentHeight = await page.evaluate(() => document.body.scrollHeight);  if (currentHeight === previousHeight) {    break; // No more content  }  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));  await page.waitForTimeout(2000); // Wait for new content to load  previousHeight = currentHeight;}
```
```
WebSocket connection to 'ws://...' failed
```
```
--no-sandbox
```
```
const browser = await chromium.launch({  args: ['--no-sandbox', '--disable-setuid-sandbox'],});
```
```
const browser = await chromium.launch({  args: ['--no-sandbox', '--disable-setuid-sandbox'],});
```
```
page.pause()
```
```
page.pause()
```
```
// Conditional debugging - only pause in local developmentif (!process.env.CI && !process.env.HEADLESS) {  await page.pause();}// Or use environment variableconst shouldPause = process.env.DEBUG_MODE === 'true';if (shouldPause) {  await page.pause();}
```
```
// Conditional debugging - only pause in local developmentif (!process.env.CI && !process.env.HEADLESS) {  await page.pause();}// Or use environment variableconst shouldPause = process.env.DEBUG_MODE === 'true';if (shouldPause) {  await page.pause();}
```
```
launchPersistentContext
```
```
// Don't use persistent context for extensions in CI// Use regular context insteadconst context = await browser.newContext({  permissions: ['clipboard-read', 'clipboard-write']});// For extensions, pre-grant permissions where possibleconst context = await browser.newContext({  permissions: ['notifications', 'geolocation']});
```
```
// Don't use persistent context for extensions in CI// Use regular context insteadconst context = await browser.newContext({  permissions: ['clipboard-read', 'clipboard-write']});// For extensions, pre-grant permissions where possibleconst context = await browser.newContext({  permissions: ['notifications', 'geolocation']});
```
```
import { defineConfig, devices } from '@playwright/test';export default defineConfig({  testDir: './tests',  timeout: 30000,  expect: {    timeout: 5000,  },  fullyParallel: true,  forbidOnly: !!process.env.CI,  retries: process.env.CI ? 2 : 0,  workers: process.env.CI ? 1 : undefined,  reporter: 'html',  use: {    baseURL: 'http://localhost:3000',    trace: 'on-first-retry',    screenshot: 'only-on-failure',    video: 'retain-on-failure',    // Anti-detection settings    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',    viewport: { width: 1920, height: 1080 },    locale: 'en-US',    timezoneId: 'America/New_York',  },  projects: [    {      name: 'chromium',      use: { ...devices['Desktop Chrome'] },    },    {      name: 'stealth',      use: {        ...devices['Desktop Chrome'],        launchOptions: {          args: [            '--disable-blink-features=AutomationControlled',            '--no-sandbox',          ],        },      },    },  ],});
```
```
import { defineConfig, devices } from '@playwright/test';export default defineConfig({  testDir: './tests',  timeout: 30000,  expect: {    timeout: 5000,  },  fullyParallel: true,  forbidOnly: !!process.env.CI,  retries: process.env.CI ? 2 : 0,  workers: process.env.CI ? 1 : undefined,  reporter: 'html',  use: {    baseURL: 'http://localhost:3000',    trace: 'on-first-retry',    screenshot: 'only-on-failure',    video: 'retain-on-failure',    // Anti-detection settings    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',    viewport: { width: 1920, height: 1080 },    locale: 'en-US',    timezoneId: 'America/New_York',  },  projects: [    {      name: 'chromium',      use: { ...devices['Desktop Chrome'] },    },    {      name: 'stealth',      use: {        ...devices['Desktop Chrome'],        launchOptions: {          args: [            '--disable-blink-features=AutomationControlled',            '--no-sandbox',          ],        },      },    },  ],});
```
```
trace: 'on-first-retry'
```
```
screenshot: 'only-on-failure'
```
```
viewport: { width: 1920, height: 1080 }
```
```
--disable-blink-features=AutomationControlled
```
```
import { defineConfig } from '@playwright/test';export default defineConfig({  webServer: {    command: 'npm run dev',    // Wait for server to print port    wait: {      stdout: '/Server running on port (?<SERVER_PORT>\\d+)/'    },  },  use: {    // Use captured port in tests    baseURL: http://localhost:${process.env.SERVER_PORT ?? 3000}  }});
```
```
import { defineConfig } from '@playwright/test';export default defineConfig({  webServer: {    command: 'npm run dev',    // Wait for server to print port    wait: {      stdout: '/Server running on port (?<SERVER_PORT>\\d+)/'    },  },  use: {    // Use captured port in tests    baseURL: http://localhost:${process.env.SERVER_PORT ?? 3000}  }});
```
```
http://localhost:${process.env.SERVER_PORT ?? 3000}
```
```
import { chromium } from 'playwright';import fs from 'fs/promises';async function scrapeWithAuth() {  const browser = await chromium.launch({ headless: false });  const context = await browser.newContext();  const page = await context.newPage();  // Login  await page.goto('https://example.com/login');  await page.fill('input[name="email"]', process.env.EMAIL);  await page.fill('input[name="password"]', process.env.PASSWORD);  await page.click('button[type="submit"]');  await page.waitForURL('**/dashboard', { timeout: 10000 });  // Save session  const cookies = await context.cookies();  await fs.writeFile('session.json', JSON.stringify(cookies));  // Navigate to protected page  await page.goto('https://example.com/protected-data');  const data = await page.locator('.data-table').textContent();  await browser.close();  return data;}
```
```
import { chromium } from 'playwright';import fs from 'fs/promises';async function scrapeWithAuth() {  const browser = await chromium.launch({ headless: false });  const context = await browser.newContext();  const page = await context.newPage();  // Login  await page.goto('https://example.com/login');  await page.fill('input[name="email"]', process.env.EMAIL);  await page.fill('input[name="password"]', process.env.PASSWORD);  await page.click('button[type="submit"]');  await page.waitForURL('**/dashboard', { timeout: 10000 });  // Save session  const cookies = await context.cookies();  await fs.writeFile('session.json', JSON.stringify(cookies));  // Navigate to protected page  await page.goto('https://example.com/protected-data');  const data = await page.locator('.data-table').textContent();  await browser.close();  return data;}
```
```
async function scrapeInfiniteScroll(page, selector) {  const items = new Set();  let previousCount = 0;  let noChangeCount = 0;  while (noChangeCount < 3) {    const elements = await page.locator(selector).all();    for (const el of elements) {      const text = await el.textContent();      items.add(text);    }    if (items.size === previousCount) {      noChangeCount++;    } else {      noChangeCount = 0;    }    previousCount = items.size;    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));    await page.waitForTimeout(1500);  }  return Array.from(items);}
```
```
async function scrapeInfiniteScroll(page, selector) {  const items = new Set();  let previousCount = 0;  let noChangeCount = 0;  while (noChangeCount < 3) {    const elements = await page.locator(selector).all();    for (const el of elements) {      const text = await el.textContent();      items.add(text);    }    if (items.size === previousCount) {      noChangeCount++;    } else {      noChangeCount = 0;    }    previousCount = items.size;    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));    await page.waitForTimeout(1500);  }  return Array.from(items);}
```
```
async function scrapeMultipleTabs(urls) {  const browser = await chromium.launch();  const context = await browser.newContext();  const results = await Promise.all(    urls.map(async (url) => {      const page = await context.newPage();      await page.goto(url);      const title = await page.title();      await page.close();      return { url, title };    })  );  await browser.close();  return results;}
```
```
async function scrapeMultipleTabs(urls) {  const browser = await chromium.launch();  const context = await browser.newContext();  const results = await Promise.all(    urls.map(async (url) => {      const page = await context.newPage();      await page.goto(url);      const title = await page.title();      await page.close();      return { url, title };    })  );  await browser.close();  return results;}
```
```
async function captureFullPage(url, outputPath) {  const browser = await chromium.launch();  const page = await browser.newPage({    viewport: { width: 1920, height: 1080 },  });  await page.goto(url, { waitUntil: 'networkidle' });  await page.screenshot({    path: outputPath,    fullPage: true,    type: 'png',  });  await browser.close();}
```
```
async function captureFullPage(url, outputPath) {  const browser = await chromium.launch();  const page = await browser.newPage({    viewport: { width: 1920, height: 1080 },  });  await page.goto(url, { waitUntil: 'networkidle' });  await page.screenshot({    path: outputPath,    fullPage: true,    type: 'png',  });  await browser.close();}
```
```
async function generatePDF(url, outputPath) {  const browser = await chromium.launch();  const page = await browser.newPage();  await page.goto(url, { waitUntil: 'networkidle' });  await page.pdf({    path: outputPath,    format: 'A4',    printBackground: true,    margin: {      top: '1cm',      right: '1cm',      bottom: '1cm',      left: '1cm',    },  });  await browser.close();}
```
```
async function generatePDF(url, outputPath) {  const browser = await chromium.launch();  const page = await browser.newPage();  await page.goto(url, { waitUntil: 'networkidle' });  await page.pdf({    path: outputPath,    format: 'A4',    printBackground: true,    margin: {      top: '1cm',      right: '1cm',      bottom: '1cm',      left: '1cm',    },  });  await browser.close();}
```
```
async function fillFormWithValidation(page) {  // Fill fields  await page.fill('input[name="firstName"]', 'John');  await page.fill('input[name="lastName"]', 'Doe');  await page.fill('input[name="email"]', 'john@example.com');  // Handle dropdowns  await page.selectOption('select[name="country"]', 'US');  // Handle checkboxes  await page.check('input[name="terms"]');  // Wait for validation  await page.waitForSelector('input[name="email"]:valid');  // Submit  await page.click('button[type="submit"]');  // Wait for success message  await page.waitForSelector('.success-message', { timeout: 10000 });}
```
```
async function fillFormWithValidation(page) {  // Fill fields  await page.fill('input[name="firstName"]', 'John');  await page.fill('input[name="lastName"]', 'Doe');  await page.fill('input[name="email"]', 'john@example.com');  // Handle dropdowns  await page.selectOption('select[name="country"]', 'US');  // Handle checkboxes  await page.check('input[name="terms"]');  // Wait for validation  await page.waitForSelector('input[name="email"]:valid');  // Submit  await page.click('button[type="submit"]');  // Wait for success message  await page.waitForSelector('.success-message', { timeout: 10000 });}
```
```
async function retryWithBackoff(fn, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn();    } catch (error) {      if (i === maxRetries - 1) throw error;      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s      console.log(Retry ${i + 1}/${maxRetries} after ${delay}ms);      await new Promise(resolve => setTimeout(resolve, delay));    }  }}// Usageawait retryWithBackoff(async () => {  await page.goto('https://unreliable-site.com');});
```
```
async function retryWithBackoff(fn, maxRetries = 3) {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn();    } catch (error) {      if (i === maxRetries - 1) throw error;      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s      console.log(Retry ${i + 1}/${maxRetries} after ${delay}ms);      await new Promise(resolve => setTimeout(resolve, delay));    }  }}// Usageawait retryWithBackoff(async () => {  await page.goto('https://unreliable-site.com');});
```
```
Retry ${i + 1}/${maxRetries} after ${delay}ms
```
```
~/.claude/skills/playwright-local/templates/
```
```
basic-scrape.ts
```
```
stealth-mode.ts
```
```
authenticated-session.ts
```
```
infinite-scroll.ts
```
```
screenshot-capture.ts
```
```
pdf-generation.ts
```
```
# Copy templatecp ~/.claude/skills/playwright-local/templates/stealth-mode.ts ./scrape.ts# Edit for your use case# Run with tsxnpx tsx scrape.ts
```
```
# Copy templatecp ~/.claude/skills/playwright-local/templates/stealth-mode.ts ./scrape.ts# Edit for your use case# Run with tsxnpx tsx scrape.ts
```
```
references/stealth-techniques.md
```
```
references/selector-strategies.md
```
```
references/common-blocks.md
```
```
scripts/install-browsers.sh
```
```
chmod +x ~/.claude/skills/playwright-local/scripts/install-browsers.sh~/.claude/skills/playwright-local/scripts/install-browsers.sh
```
```
chmod +x ~/.claude/skills/playwright-local/scripts/install-browsers.sh~/.claude/skills/playwright-local/scripts/install-browsers.sh
```
```
# Initialize AI agent configurationsnpx playwright init-agents
```
```
# Initialize AI agent configurationsnpx playwright init-agents
```
```
# Install globallynpm install -g @anthropic/mcp-playwright# Or add to Claude Desktop config{  "mcpServers": {    "playwright": {      "command": "npx",      "args": ["@anthropic/mcp-playwright"]    }  }}
```
```
# Install globallynpm install -g @anthropic/mcp-playwright# Or add to Claude Desktop config{  "mcpServers": {    "playwright": {      "command": "npx",      "args": ["@anthropic/mcp-playwright"]    }  }}
```
```
export default defineConfig({  reporter: 'html',});
```
```
export default defineConfig({  reporter: 'html',});
```
```
npx playwright test --reporter=htmlnpx playwright show-report
```
```
npx playwright test --reporter=htmlnpx playwright show-report
```
```
waitForTimeout()
```
```
FROM mcr.microsoft.com/playwright:v1.57.0-noble# Create non-root user for securityRUN groupadd -r pwuser && useradd -r -g pwuser pwuserUSER pwuserWORKDIR /appCOPY --chown=pwuser:pwuser . .RUN npm ciCMD ["npx", "playwright", "test"]
```
```
FROM mcr.microsoft.com/playwright:v1.57.0-noble# Create non-root user for securityRUN groupadd -r pwuser && useradd -r -g pwuser pwuserUSER pwuserWORKDIR /appCOPY --chown=pwuser:pwuser . .RUN npm ciCMD ["npx", "playwright", "test"]
```
```
:v1.57.0-noble
```
```
:v1.57.0-jammy
```
```
docker run -it --init --ipc=host my-playwright-tests
```
```
docker run -it --init --ipc=host my-playwright-tests
```
```
--init
```
```
--ipc=host
```
```
--cap-add=SYS_ADMIN
```
```
FROM mcr.microsoft.com/playwright/python:v1.57.0-noble
```
```
FROM mcr.microsoft.com/playwright/python:v1.57.0-noble
```
```
:latest
```
```
// scrape.tsimport { chromium } from 'playwright';async function scrape(url: string) {  const browser = await chromium.launch({ headless: true });  const page = await browser.newPage();  await page.goto(url);  const data = await page.evaluate(() => {    return {      title: document.title,      headings: Array.from(document.querySelectorAll('h1, h2'))        .map(el => el.textContent),    };  });  await browser.close();  console.log(JSON.stringify(data, null, 2));}scrape(process.argv[2]);
```
```
// scrape.tsimport { chromium } from 'playwright';async function scrape(url: string) {  const browser = await chromium.launch({ headless: true });  const page = await browser.newPage();  await page.goto(url);  const data = await page.evaluate(() => {    return {      title: document.title,      headings: Array.from(document.querySelectorAll('h1, h2'))        .map(el => el.textContent),    };  });  await browser.close();  console.log(JSON.stringify(data, null, 2));}scrape(process.argv[2]);
```
```
npx tsx scrape.ts https://example.com
```
```
// screenshot-review.tsimport { chromium } from 'playwright';async function captureForReview(url: string) {  const browser = await chromium.launch();  const page = await browser.newPage();  await page.goto(url);  await page.screenshot({ path: '/tmp/review.png', fullPage: true });  await browser.close();  console.log('Screenshot saved to /tmp/review.png');}captureForReview(process.argv[2]);
```
```
// screenshot-review.tsimport { chromium } from 'playwright';async function captureForReview(url: string) {  const browser = await chromium.launch();  const page = await browser.newPage();  await page.goto(url);  await page.screenshot({ path: '/tmp/review.png', fullPage: true });  await browser.close();  console.log('Screenshot saved to /tmp/review.png');}captureForReview(process.argv[2]);
```
```
import { chromium } from 'playwright';async function scrapeConcurrently(urls: string[]) {  const browser = await chromium.launch();  // Use separate contexts for isolation  const results = await Promise.all(    urls.map(async (url) => {      const context = await browser.newContext();      const page = await context.newPage();      await page.goto(url);      const title = await page.title();      await context.close();      return { url, title };    })  );  await browser.close();  return results;}
```
```
import { chromium } from 'playwright';async function scrapeConcurrently(urls: string[]) {  const browser = await chromium.launch();  // Use separate contexts for isolation  const results = await Promise.all(    urls.map(async (url) => {      const context = await browser.newContext();      const page = await context.newPage();      await page.goto(url);      const title = await page.title();      await context.close();      return { url, title };    })  );  await browser.close();  return results;}
```
```
async function setupStealthContext(browser) {  const context = await browser.newContext({    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',    viewport: { width: 1920, height: 1080 },    locale: 'en-US',    timezoneId: 'America/New_York',    // WebGL fingerprinting defense    screen: {      width: 1920,      height: 1080,    },    // Geolocation (if needed)    geolocation: { longitude: -74.006, latitude: 40.7128 },    permissions: ['geolocation'],  });  return context;}
```
```
async function setupStealthContext(browser) {  const context = await browser.newContext({    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',    viewport: { width: 1920, height: 1080 },    locale: 'en-US',    timezoneId: 'America/New_York',    // WebGL fingerprinting defense    screen: {      width: 1920,      height: 1080,    },    // Geolocation (if needed)    geolocation: { longitude: -74.006, latitude: 40.7128 },    permissions: ['geolocation'],  });  return context;}
```
```
async function waitForDynamicContent(page, selector) {  // Wait for initial element  await page.waitForSelector(selector);  // Wait for content to stabilize (no changes for 2s)  let previousContent = '';  let stableCount = 0;  while (stableCount < 4) {    await page.waitForTimeout(500);    const currentContent = await page.locator(selector).textContent();    if (currentContent === previousContent) {      stableCount++;    } else {      stableCount = 0;    }    previousContent = currentContent;  }  return previousContent;}
```
```
async function waitForDynamicContent(page, selector) {  // Wait for initial element  await page.waitForSelector(selector);  // Wait for content to stabilize (no changes for 2s)  let previousContent = '';  let stableCount = 0;  while (stableCount < 4) {    await page.waitForTimeout(500);    const currentContent = await page.locator(selector).textContent();    if (currentContent === previousContent) {      stableCount++;    } else {      stableCount = 0;    }    previousContent = currentContent;  }  return previousContent;}
```
```
page.click('button.submit')
```
```
page.click('xpath=//button[text()="Submit"]')
```
```
page.click('text=Submit')
```
```
page.click('[data-testid="submit"]')
```
```
page.click('ul > li:nth-child(2)')
```
```
waitUntil: 'load'
```
```
waitUntil: 'domcontentloaded'
```
```
waitUntil: 'networkidle'
```
```
page.waitForSelector(selector)
```
```
page.waitForLoadState('networkidle')
```
```
page.waitForTimeout(ms)
```
```
headless
```
```
true
```
```
false
```
```
slowMo
```
```
100
```
```
args
```
```
['--no-sandbox']
```
```
executablePath
```
```
/path/to/chrome
```
```
downloadsPath
```
```
./downloads
```
```
args: [  '--disable-blink-features=AutomationControlled',  '--no-sandbox',  '--disable-setuid-sandbox',  '--disable-dev-shm-usage',  '--disable-accelerated-2d-canvas',  '--no-first-run',  '--no-zygote',  '--single-process',  '--disable-gpu',]
```
```
args: [  '--disable-blink-features=AutomationControlled',  '--no-sandbox',  '--disable-setuid-sandbox',  '--disable-dev-shm-usage',  '--disable-accelerated-2d-canvas',  '--no-first-run',  '--no-zygote',  '--single-process',  '--disable-gpu',]
```
```
mcr.microsoft.com/playwright:v1.57.0-noble
```
```
mcr.microsoft.com/playwright/python:v1.57.0-noble
```
```
{  "devDependencies": {    "playwright": "^1.57.0",    "@playwright/test": "^1.57.0",    "playwright-extra": "^4.3.6",    "puppeteer-extra-plugin-stealth": "^2.11.2"  }}
```
```
{  "devDependencies": {    "playwright": "^1.57.0",    "@playwright/test": "^1.57.0",    "playwright-extra": "^4.3.6",    "puppeteer-extra-plugin-stealth": "^2.11.2"  }}
```
```
playwright==1.57.0playwright-stealth==0.0.1
```
```
playwright==1.57.0playwright-stealth==0.0.1
```
```
npx playwright install chromium# Or for all browsers:npx playwright install
```
```
npx playwright install chromium# Or for all browsers:npx playwright install
```
```
# In DockerfileRUN playwright install --with-deps chromium# Run with:docker run --shm-size=2gb your-image
```
```
# In DockerfileRUN playwright install --with-deps chromium# Run with:docker run --shm-size=2gb your-image
```
```
await page.goto(url, { waitUntil: 'networkidle' });await page.waitForTimeout(1000); // Extra bufferawait page.screenshot({ path: 'output.png' });
```
```
await page.goto(url, { waitUntil: 'networkidle' });await page.waitForTimeout(1000); // Extra bufferawait page.screenshot({ path: 'output.png' });
```
```
const browser = await chromium.launch({  args: ['--disable-dev-shm-usage'], // Use /tmp instead of /dev/shm});
```
```
const browser = await chromium.launch({  args: ['--disable-dev-shm-usage'], // Use /tmp instead of /dev/shm});
```
```
Unable to locate package libicu74
```
```
Package 'libxml2' has no installation candidate
```
```
# Use Ubuntu 24.04 Docker image (officially supported)docker pull mcr.microsoft.com/playwright:v1.57.0-noble# Or wait for Ubuntu 25.10 support in future releases# Track issue: https://github.com/microsoft/playwright/issues/38874
```
```
# Use Ubuntu 24.04 Docker image (officially supported)docker pull mcr.microsoft.com/playwright:v1.57.0-noble# Or wait for Ubuntu 25.10 support in future releases# Track issue: https://github.com/microsoft/playwright/issues/38874
```
```
# Manually install compatible librariessudo apt-get updatesudo apt-get install libicu72 libxml2
```
```
# Manually install compatible librariessudo apt-get updatesudo apt-get install libicu72 libxml2
```
```
npm list playwright
```
```
pip show playwright
```
```
npx playwright install chromium
```
```
headless: false
```
```
headless: true
```
```
references/common-blocks.md
```
```
npx playwright install chromium
```
This powerful AI agent skill leverages Playwright to enable comprehensive local browser automation directly within your development environment. Designed for robust web interactions, it allows developers to script actions across Chromium, Firefox, and WebKit, facilitating everything from advanced web scraping to meticulous end-to-end testing. With support for both Node.js and Python, this skill streamlines complex browser-based workflows, ensuring reliable and repeatable results without the overhead of remote services. It's an indispensable tool for enhancing any coding assistant's ability to interact with dynamic web content.

# When to Use This Skill
- •Automating end-to-end (E2E) UI testing for web applications across different browsers.
- •Performing local web scraping to extract data from dynamic websites.
- •Generating screenshots or PDFs of web pages for reporting or archival purposes.
- •Scripting repetitive user interactions for form filling, login flows, or data entry.

# Pro Tips
- 💡Utilize Playwright's `codegen` feature to quickly generate test scripts by recording user interactions in the browser.
- 💡Always use `browser.close()` and `page.close()` to prevent memory leaks and ensure resources are freed after automation tasks.
- 💡Combine Playwright with a `stealth` plugin or randomize user-agents to avoid detection during advanced scraping tasks, if needed.

