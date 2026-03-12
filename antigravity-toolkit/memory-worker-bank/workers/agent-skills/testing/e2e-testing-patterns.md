# e2e-testing-patterns
Source: https://antigravity.codes/agent-skills/testing/e2e-testing-patterns

## AI Worker Instructions
When the user requests functionality related to e2e-testing-patterns, follow these guidelines and utilize this context.

## Scraped Content

# e2e-testing-patterns
```
/\       /E2E\         ← Few, focused on critical paths      /─────\     /Integr\        ← More, test component interactions    /────────\   /Unit Tests\      ← Many, fast, isolated  /────────────\
```
```
/\       /E2E\         ← Few, focused on critical paths      /─────\     /Integr\        ← More, test component interactions    /────────\   /Unit Tests\      ← Many, fast, isolated  /────────────\
```
```
// playwright.config.tsimport { defineConfig, devices } from "@playwright/test";export default defineConfig({  testDir: "./e2e",  timeout: 30000,  expect: {    timeout: 5000,  },  fullyParallel: true,  forbidOnly: !!process.env.CI,  retries: process.env.CI ? 2 : 0,  workers: process.env.CI ? 1 : undefined,  reporter: [["html"], ["junit", { outputFile: "results.xml" }]],  use: {    baseURL: "http://localhost:3000",    trace: "on-first-retry",    screenshot: "only-on-failure",    video: "retain-on-failure",  },  projects: [    { name: "chromium", use: { ...devices["Desktop Chrome"] } },    { name: "firefox", use: { ...devices["Desktop Firefox"] } },    { name: "webkit", use: { ...devices["Desktop Safari"] } },    { name: "mobile", use: { ...devices["iPhone 13"] } },  ],});
```
```
// playwright.config.tsimport { defineConfig, devices } from "@playwright/test";export default defineConfig({  testDir: "./e2e",  timeout: 30000,  expect: {    timeout: 5000,  },  fullyParallel: true,  forbidOnly: !!process.env.CI,  retries: process.env.CI ? 2 : 0,  workers: process.env.CI ? 1 : undefined,  reporter: [["html"], ["junit", { outputFile: "results.xml" }]],  use: {    baseURL: "http://localhost:3000",    trace: "on-first-retry",    screenshot: "only-on-failure",    video: "retain-on-failure",  },  projects: [    { name: "chromium", use: { ...devices["Desktop Chrome"] } },    { name: "firefox", use: { ...devices["Desktop Firefox"] } },    { name: "webkit", use: { ...devices["Desktop Safari"] } },    { name: "mobile", use: { ...devices["iPhone 13"] } },  ],});
```
```
// pages/LoginPage.tsimport { Page, Locator } from "@playwright/test";export class LoginPage {  readonly page: Page;  readonly emailInput: Locator;  readonly passwordInput: Locator;  readonly loginButton: Locator;  readonly errorMessage: Locator;  constructor(page: Page) {    this.page = page;    this.emailInput = page.getByLabel("Email");    this.passwordInput = page.getByLabel("Password");    this.loginButton = page.getByRole("button", { name: "Login" });    this.errorMessage = page.getByRole("alert");  }  async goto() {    await this.page.goto("/login");  }  async login(email: string, password: string) {    await this.emailInput.fill(email);    await this.passwordInput.fill(password);    await this.loginButton.click();  }  async getErrorMessage(): Promise<string> {    return (await this.errorMessage.textContent()) ?? "";  }}// Test using Page Objectimport { test, expect } from "@playwright/test";import { LoginPage } from "./pages/LoginPage";test("successful login", async ({ page }) => {  const loginPage = new LoginPage(page);  await loginPage.goto();  await loginPage.login("user@example.com", "password123");  await expect(page).toHaveURL("/dashboard");  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();});test("failed login shows error", async ({ page }) => {  const loginPage = new LoginPage(page);  await loginPage.goto();  await loginPage.login("invalid@example.com", "wrong");  const error = await loginPage.getErrorMessage();  expect(error).toContain("Invalid credentials");});
```
```
// pages/LoginPage.tsimport { Page, Locator } from "@playwright/test";export class LoginPage {  readonly page: Page;  readonly emailInput: Locator;  readonly passwordInput: Locator;  readonly loginButton: Locator;  readonly errorMessage: Locator;  constructor(page: Page) {    this.page = page;    this.emailInput = page.getByLabel("Email");    this.passwordInput = page.getByLabel("Password");    this.loginButton = page.getByRole("button", { name: "Login" });    this.errorMessage = page.getByRole("alert");  }  async goto() {    await this.page.goto("/login");  }  async login(email: string, password: string) {    await this.emailInput.fill(email);    await this.passwordInput.fill(password);    await this.loginButton.click();  }  async getErrorMessage(): Promise<string> {    return (await this.errorMessage.textContent()) ?? "";  }}// Test using Page Objectimport { test, expect } from "@playwright/test";import { LoginPage } from "./pages/LoginPage";test("successful login", async ({ page }) => {  const loginPage = new LoginPage(page);  await loginPage.goto();  await loginPage.login("user@example.com", "password123");  await expect(page).toHaveURL("/dashboard");  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();});test("failed login shows error", async ({ page }) => {  const loginPage = new LoginPage(page);  await loginPage.goto();  await loginPage.login("invalid@example.com", "wrong");  const error = await loginPage.getErrorMessage();  expect(error).toContain("Invalid credentials");});
```
```
// fixtures/test-data.tsimport { test as base } from "@playwright/test";type TestData = {  testUser: {    email: string;    password: string;    name: string;  };  adminUser: {    email: string;    password: string;  };};export const test = base.extend<TestData>({  testUser: async ({}, use) => {    const user = {      email: test-${Date.now()}@example.com,      password: "Test123!@#",      name: "Test User",    };    // Setup: Create user in database    await createTestUser(user);    await use(user);    // Teardown: Clean up user    await deleteTestUser(user.email);  },  adminUser: async ({}, use) => {    await use({      email: "admin@example.com",      password: process.env.ADMIN_PASSWORD!,    });  },});// Usage in testsimport { test } from "./fixtures/test-data";test("user can update profile", async ({ page, testUser }) => {  await page.goto("/login");  await page.getByLabel("Email").fill(testUser.email);  await page.getByLabel("Password").fill(testUser.password);  await page.getByRole("button", { name: "Login" }).click();  await page.goto("/profile");  await page.getByLabel("Name").fill("Updated Name");  await page.getByRole("button", { name: "Save" }).click();  await expect(page.getByText("Profile updated")).toBeVisible();});
```
```
// fixtures/test-data.tsimport { test as base } from "@playwright/test";type TestData = {  testUser: {    email: string;    password: string;    name: string;  };  adminUser: {    email: string;    password: string;  };};export const test = base.extend<TestData>({  testUser: async ({}, use) => {    const user = {      email: test-${Date.now()}@example.com,      password: "Test123!@#",      name: "Test User",    };    // Setup: Create user in database    await createTestUser(user);    await use(user);    // Teardown: Clean up user    await deleteTestUser(user.email);  },  adminUser: async ({}, use) => {    await use({      email: "admin@example.com",      password: process.env.ADMIN_PASSWORD!,    });  },});// Usage in testsimport { test } from "./fixtures/test-data";test("user can update profile", async ({ page, testUser }) => {  await page.goto("/login");  await page.getByLabel("Email").fill(testUser.email);  await page.getByLabel("Password").fill(testUser.password);  await page.getByRole("button", { name: "Login" }).click();  await page.goto("/profile");  await page.getByLabel("Name").fill("Updated Name");  await page.getByRole("button", { name: "Save" }).click();  await expect(page.getByText("Profile updated")).toBeVisible();});
```
```
test-${Date.now()}@example.com
```
```
// ❌ Bad: Fixed timeoutsawait page.waitForTimeout(3000); // Flaky!// ✅ Good: Wait for specific conditionsawait page.waitForLoadState("networkidle");await page.waitForURL("/dashboard");await page.waitForSelector('[data-testid="user-profile"]');// ✅ Better: Auto-waiting with assertionsawait expect(page.getByText("Welcome")).toBeVisible();await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();// Wait for API responseconst responsePromise = page.waitForResponse(  (response) =>    response.url().includes("/api/users") && response.status() === 200,);await page.getByRole("button", { name: "Load Users" }).click();const response = await responsePromise;const data = await response.json();expect(data.users).toHaveLength(10);// Wait for multiple conditionsawait Promise.all([  page.waitForURL("/success"),  page.waitForLoadState("networkidle"),  expect(page.getByText("Payment successful")).toBeVisible(),]);
```
```
// ❌ Bad: Fixed timeoutsawait page.waitForTimeout(3000); // Flaky!// ✅ Good: Wait for specific conditionsawait page.waitForLoadState("networkidle");await page.waitForURL("/dashboard");await page.waitForSelector('[data-testid="user-profile"]');// ✅ Better: Auto-waiting with assertionsawait expect(page.getByText("Welcome")).toBeVisible();await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();// Wait for API responseconst responsePromise = page.waitForResponse(  (response) =>    response.url().includes("/api/users") && response.status() === 200,);await page.getByRole("button", { name: "Load Users" }).click();const response = await responsePromise;const data = await response.json();expect(data.users).toHaveLength(10);// Wait for multiple conditionsawait Promise.all([  page.waitForURL("/success"),  page.waitForLoadState("networkidle"),  expect(page.getByText("Payment successful")).toBeVisible(),]);
```
```
// Mock API responsestest("displays error when API fails", async ({ page }) => {  await page.route("**/api/users", (route) => {    route.fulfill({      status: 500,      contentType: "application/json",      body: JSON.stringify({ error: "Internal Server Error" }),    });  });  await page.goto("/users");  await expect(page.getByText("Failed to load users")).toBeVisible();});// Intercept and modify requeststest("can modify API request", async ({ page }) => {  await page.route("**/api/users", async (route) => {    const request = route.request();    const postData = JSON.parse(request.postData() || "{}");    // Modify request    postData.role = "admin";    await route.continue({      postData: JSON.stringify(postData),    });  });  // Test continues...});// Mock third-party servicestest("payment flow with mocked Stripe", async ({ page }) => {  await page.route("**/api/stripe/**", (route) => {    route.fulfill({      status: 200,      body: JSON.stringify({        id: "mock_payment_id",        status: "succeeded",      }),    });  });  // Test payment flow with mocked response});
```
```
// Mock API responsestest("displays error when API fails", async ({ page }) => {  await page.route("**/api/users", (route) => {    route.fulfill({      status: 500,      contentType: "application/json",      body: JSON.stringify({ error: "Internal Server Error" }),    });  });  await page.goto("/users");  await expect(page.getByText("Failed to load users")).toBeVisible();});// Intercept and modify requeststest("can modify API request", async ({ page }) => {  await page.route("**/api/users", async (route) => {    const request = route.request();    const postData = JSON.parse(request.postData() || "{}");    // Modify request    postData.role = "admin";    await route.continue({      postData: JSON.stringify(postData),    });  });  // Test continues...});// Mock third-party servicestest("payment flow with mocked Stripe", async ({ page }) => {  await page.route("**/api/stripe/**", (route) => {    route.fulfill({      status: 200,      body: JSON.stringify({        id: "mock_payment_id",        status: "succeeded",      }),    });  });  // Test payment flow with mocked response});
```
```
// cypress.config.tsimport { defineConfig } from "cypress";export default defineConfig({  e2e: {    baseUrl: "http://localhost:3000",    viewportWidth: 1280,    viewportHeight: 720,    video: false,    screenshotOnRunFailure: true,    defaultCommandTimeout: 10000,    requestTimeout: 10000,    setupNodeEvents(on, config) {      // Implement node event listeners    },  },});
```
```
// cypress.config.tsimport { defineConfig } from "cypress";export default defineConfig({  e2e: {    baseUrl: "http://localhost:3000",    viewportWidth: 1280,    viewportHeight: 720,    video: false,    screenshotOnRunFailure: true,    defaultCommandTimeout: 10000,    requestTimeout: 10000,    setupNodeEvents(on, config) {      // Implement node event listeners    },  },});
```
```
// cypress/support/commands.tsdeclare global {  namespace Cypress {    interface Chainable {      login(email: string, password: string): Chainable<void>;      createUser(userData: UserData): Chainable<User>;      dataCy(value: string): Chainable<JQuery<HTMLElement>>;    }  }}Cypress.Commands.add("login", (email: string, password: string) => {  cy.visit("/login");  cy.get('[data-testid="email"]').type(email);  cy.get('[data-testid="password"]').type(password);  cy.get('[data-testid="login-button"]').click();  cy.url().should("include", "/dashboard");});Cypress.Commands.add("createUser", (userData: UserData) => {  return cy.request("POST", "/api/users", userData).its("body");});Cypress.Commands.add("dataCy", (value: string) => {  return cy.get([data-cy="${value}"]);});// Usagecy.login("user@example.com", "password");cy.dataCy("submit-button").click();
```
```
// cypress/support/commands.tsdeclare global {  namespace Cypress {    interface Chainable {      login(email: string, password: string): Chainable<void>;      createUser(userData: UserData): Chainable<User>;      dataCy(value: string): Chainable<JQuery<HTMLElement>>;    }  }}Cypress.Commands.add("login", (email: string, password: string) => {  cy.visit("/login");  cy.get('[data-testid="email"]').type(email);  cy.get('[data-testid="password"]').type(password);  cy.get('[data-testid="login-button"]').click();  cy.url().should("include", "/dashboard");});Cypress.Commands.add("createUser", (userData: UserData) => {  return cy.request("POST", "/api/users", userData).its("body");});Cypress.Commands.add("dataCy", (value: string) => {  return cy.get([data-cy="${value}"]);});// Usagecy.login("user@example.com", "password");cy.dataCy("submit-button").click();
```
```
[data-cy="${value}"]
```
```
// Mock API callscy.intercept("GET", "/api/users", {  statusCode: 200,  body: [    { id: 1, name: "John" },    { id: 2, name: "Jane" },  ],}).as("getUsers");cy.visit("/users");cy.wait("@getUsers");cy.get('[data-testid="user-list"]').children().should("have.length", 2);// Modify responsescy.intercept("GET", "/api/users", (req) => {  req.reply((res) => {    // Modify response    res.body.users = res.body.users.slice(0, 5);    res.send();  });});// Simulate slow networkcy.intercept("GET", "/api/data", (req) => {  req.reply((res) => {    res.delay(3000); // 3 second delay    res.send();  });});
```
```
// Mock API callscy.intercept("GET", "/api/users", {  statusCode: 200,  body: [    { id: 1, name: "John" },    { id: 2, name: "Jane" },  ],}).as("getUsers");cy.visit("/users");cy.wait("@getUsers");cy.get('[data-testid="user-list"]').children().should("have.length", 2);// Modify responsescy.intercept("GET", "/api/users", (req) => {  req.reply((res) => {    // Modify response    res.body.users = res.body.users.slice(0, 5);    res.send();  });});// Simulate slow networkcy.intercept("GET", "/api/data", (req) => {  req.reply((res) => {    res.delay(3000); // 3 second delay    res.send();  });});
```
```
// With Playwrightimport { test, expect } from "@playwright/test";test("homepage looks correct", async ({ page }) => {  await page.goto("/");  await expect(page).toHaveScreenshot("homepage.png", {    fullPage: true,    maxDiffPixels: 100,  });});test("button in all states", async ({ page }) => {  await page.goto("/components");  const button = page.getByRole("button", { name: "Submit" });  // Default state  await expect(button).toHaveScreenshot("button-default.png");  // Hover state  await button.hover();  await expect(button).toHaveScreenshot("button-hover.png");  // Disabled state  await button.evaluate((el) => el.setAttribute("disabled", "true"));  await expect(button).toHaveScreenshot("button-disabled.png");});
```
```
// With Playwrightimport { test, expect } from "@playwright/test";test("homepage looks correct", async ({ page }) => {  await page.goto("/");  await expect(page).toHaveScreenshot("homepage.png", {    fullPage: true,    maxDiffPixels: 100,  });});test("button in all states", async ({ page }) => {  await page.goto("/components");  const button = page.getByRole("button", { name: "Submit" });  // Default state  await expect(button).toHaveScreenshot("button-default.png");  // Hover state  await button.hover();  await expect(button).toHaveScreenshot("button-hover.png");  // Disabled state  await button.evaluate((el) => el.setAttribute("disabled", "true"));  await expect(button).toHaveScreenshot("button-disabled.png");});
```
```
// playwright.config.tsexport default defineConfig({  projects: [    {      name: "shard-1",      use: { ...devices["Desktop Chrome"] },      grepInvert: /@slow/,      shard: { current: 1, total: 4 },    },    {      name: "shard-2",      use: { ...devices["Desktop Chrome"] },      shard: { current: 2, total: 4 },    },    // ... more shards  ],});// Run in CI// npx playwright test --shard=1/4// npx playwright test --shard=2/4
```
```
// playwright.config.tsexport default defineConfig({  projects: [    {      name: "shard-1",      use: { ...devices["Desktop Chrome"] },      grepInvert: /@slow/,      shard: { current: 1, total: 4 },    },    {      name: "shard-2",      use: { ...devices["Desktop Chrome"] },      shard: { current: 2, total: 4 },    },    // ... more shards  ],});// Run in CI// npx playwright test --shard=1/4// npx playwright test --shard=2/4
```
```
// Install: npm install @axe-core/playwrightimport { test, expect } from "@playwright/test";import AxeBuilder from "@axe-core/playwright";test("page should not have accessibility violations", async ({ page }) => {  await page.goto("/");  const accessibilityScanResults = await new AxeBuilder({ page })    .exclude("#third-party-widget")    .analyze();  expect(accessibilityScanResults.violations).toEqual([]);});test("form is accessible", async ({ page }) => {  await page.goto("/signup");  const results = await new AxeBuilder({ page }).include("form").analyze();  expect(results.violations).toEqual([]);});
```
```
// Install: npm install @axe-core/playwrightimport { test, expect } from "@playwright/test";import AxeBuilder from "@axe-core/playwright";test("page should not have accessibility violations", async ({ page }) => {  await page.goto("/");  const accessibilityScanResults = await new AxeBuilder({ page })    .exclude("#third-party-widget")    .analyze();  expect(accessibilityScanResults.violations).toEqual([]);});test("form is accessible", async ({ page }) => {  await page.goto("/signup");  const results = await new AxeBuilder({ page }).include("form").analyze();  expect(results.violations).toEqual([]);});
```
```
data-testid
```
```
data-cy
```
```
// ❌ Bad selectorscy.get(".btn.btn-primary.submit-button").click();cy.get("div > form > div:nth-child(2) > input").type("text");// ✅ Good selectorscy.getByRole("button", { name: "Submit" }).click();cy.getByLabel("Email address").type("user@example.com");cy.get('[data-testid="email-input"]').type("user@example.com");
```
```
// ❌ Bad selectorscy.get(".btn.btn-primary.submit-button").click();cy.get("div > form > div:nth-child(2) > input").type("text");// ✅ Good selectorscy.getByRole("button", { name: "Submit" }).click();cy.getByLabel("Email address").type("user@example.com");cy.get('[data-testid="email-input"]').type("user@example.com");
```
```
// Playwright debugging// 1. Run in headed modenpx playwright test --headed// 2. Run in debug modenpx playwright test --debug// 3. Use trace viewerawait page.screenshot({ path: 'screenshot.png' });await page.video()?.saveAs('video.webm');// 4. Add test.step for better reportingtest('checkout flow', async ({ page }) => {    await test.step('Add item to cart', async () => {        await page.goto('/products');        await page.getByRole('button', { name: 'Add to Cart' }).click();    });    await test.step('Proceed to checkout', async () => {        await page.goto('/cart');        await page.getByRole('button', { name: 'Checkout' }).click();    });});// 5. Inspect page stateawait page.pause();  // Pauses execution, opens inspector
```
```
// Playwright debugging// 1. Run in headed modenpx playwright test --headed// 2. Run in debug modenpx playwright test --debug// 3. Use trace viewerawait page.screenshot({ path: 'screenshot.png' });await page.video()?.saveAs('video.webm');// 4. Add test.step for better reportingtest('checkout flow', async ({ page }) => {    await test.step('Add item to cart', async () => {        await page.goto('/products');        await page.getByRole('button', { name: 'Add to Cart' }).click();    });    await test.step('Proceed to checkout', async () => {        await page.goto('/cart');        await page.getByRole('button', { name: 'Checkout' }).click();    });});// 5. Inspect page stateawait page.pause();  // Pauses execution, opens inspector
```
Unlock the power of robust end-to-end testing with this comprehensive AI agent skill. Designed for developers and QA engineers, it guides you through establishing highly effective test suites using leading frameworks like Playwright and Cypress. Learn to navigate the complexities of E2E testing, ensuring your applications are thoroughly validated across critical user journeys. This skill provides architectural insights, practical patterns, and best practices to build confidence in your codebase, reduce regressions, and accelerate deployment cycles. Elevate your testing strategy and deliver flawless user experiences by integrating these expert patterns into your development workflow.

# When to Use This Skill
- •Implementing new end-to-end test automation for web applications
- •Debugging and refactoring flaky or unreliable E2E test suites
- •Setting up efficient CI/CD pipelines with integrated E2E tests
- •Establishing consistent E2E testing standards and best practices within a team

# Pro Tips
- 💡Prioritize critical user flows for E2E tests to keep them fast and maintainable, reserving unit and integration tests for lower-level logic.
- 💡Leverage custom commands, page object models, and data-driven testing to improve test readability, reduce duplication, and simplify maintenance.
- 💡Integrate visual regression testing into your E2E suite to automatically catch unintended UI changes across different browsers and viewports.

