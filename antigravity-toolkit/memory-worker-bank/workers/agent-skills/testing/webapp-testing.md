# webapp-testing
Source: https://antigravity.codes/agent-skills/testing/webapp-testing

## AI Worker Instructions
When the user requests functionality related to webapp-testing, follow these guidelines and utilize this context.

## Scraped Content

# webapp-testing
```
scripts/with_server.py
```
```
--help
```
```
User task → Is it static HTML?    ├─ Yes → Read HTML file directly to identify selectors    │         ├─ Success → Write Playwright script using selectors    │         └─ Fails/Incomplete → Treat as dynamic (below)    │    └─ No (dynamic webapp) → Is the server already running?        ├─ No → Run: python scripts/with_server.py --help        │        Then use the helper + write simplified Playwright script        │        └─ Yes → Reconnaissance-then-action:            1. Navigate and wait for networkidle            2. Take screenshot or inspect DOM            3. Identify selectors from rendered state            4. Execute actions with discovered selectors
```
```
User task → Is it static HTML?    ├─ Yes → Read HTML file directly to identify selectors    │         ├─ Success → Write Playwright script using selectors    │         └─ Fails/Incomplete → Treat as dynamic (below)    │    └─ No (dynamic webapp) → Is the server already running?        ├─ No → Run: python scripts/with_server.py --help        │        Then use the helper + write simplified Playwright script        │        └─ Yes → Reconnaissance-then-action:            1. Navigate and wait for networkidle            2. Take screenshot or inspect DOM            3. Identify selectors from rendered state            4. Execute actions with discovered selectors
```
```
--help
```
```
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```
```
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```
```
python scripts/with_server.py \  --server "cd backend && python server.py" --port 3000 \  --server "cd frontend && npm run dev" --port 5173 \  -- python your_automation.py
```
```
python scripts/with_server.py \  --server "cd backend && python server.py" --port 3000 \  --server "cd frontend && npm run dev" --port 5173 \  -- python your_automation.py
```
```
from playwright.sync_api import sync_playwrightwith sync_playwright() as p:    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode    page = browser.new_page()    page.goto('http://localhost:5173') # Server already running and ready    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute    # ... your automation logic    browser.close()
```
```
from playwright.sync_api import sync_playwrightwith sync_playwright() as p:    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode    page = browser.new_page()    page.goto('http://localhost:5173') # Server already running and ready    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute    # ... your automation logic    browser.close()
```
```
page.screenshot(path='/tmp/inspect.png', full_page=True)   content = page.content()   page.locator('button').all()
```
```
page.screenshot(path='/tmp/inspect.png', full_page=True)   content = page.content()   page.locator('button').all()
```
```
networkidle
```
```
page.wait_for_load_state('networkidle')
```
```
scripts/
```
```
--help
```
```
sync_playwright()
```
```
text=
```
```
role=
```
```
page.wait_for_selector()
```
```
page.wait_for_timeout()
```
```
element_discovery.py
```
```
static_html_automation.py
```
```
console_logging.py
```
Unlock robust web application testing capabilities with this specialized agent skill. Designed for efficiency, it integrates seamlessly with Playwright to empower you in verifying frontend functionality and debugging complex UI behaviors. Whether you're dealing with static HTML or dynamic web applications, this toolkit provides the necessary scripts and guidance to capture browser screenshots, analyze logs, and ensure your web interfaces perform flawlessly. Streamline your development workflow by automating UI tests and quickly pinpointing issues before they reach production. It's an essential resource for any developer focused on delivering high-quality web experiences.

# When to Use This Skill
- •Automating UI tests for a new web application feature.
- •Debugging a reported visual bug on a local development server.
- •Generating screenshots of different pages for documentation or review.
- •Verifying user flows (e.g., login, form submission) on a staging environment.

# Pro Tips
- 💡Always run helper scripts like `with_server.py` with `--help` first to understand their parameters without consuming context.
- 💡For complex dynamic applications, start with reconnaissance steps: navigate, wait for `networkidle`, then inspect the DOM or take screenshots to identify elements.
- 💡Prioritize using the provided helper scripts as black-box tools rather than reading their source code to conserve context window space.

