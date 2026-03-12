# baoyu-url-to-markdown
Source: https://antigravity.codes/agent-skills/documentation/baoyu-url-to-markdown

## AI Worker Instructions
When the user requests functionality related to baoyu-url-to-markdown, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-url-to-markdown
```
scripts/
```
```
SKILL_DIR
```
```
${SKILL_DIR}/scripts/<script-name>.ts
```
```
${SKILL_DIR}
```
```
scripts/main.ts
```
```
# Auto mode (default) - capture when page loadsnpx -y bun ${SKILL_DIR}/scripts/main.ts <url># Wait mode - wait for user signal before capturenpx -y bun ${SKILL_DIR}/scripts/main.ts <url> --wait# Save to specific filenpx -y bun ${SKILL_DIR}/scripts/main.ts <url> -o output.md
```
```
# Auto mode (default) - capture when page loadsnpx -y bun ${SKILL_DIR}/scripts/main.ts <url># Wait mode - wait for user signal before capturenpx -y bun ${SKILL_DIR}/scripts/main.ts <url> --wait# Save to specific filenpx -y bun ${SKILL_DIR}/scripts/main.ts <url> -o output.md
```
```
<url>
```
```
-o <path>
```
```
--wait
```
```
--timeout <ms>
```
```
--wait
```
```
--wait
```
```
Page opened. Press Enter when ready to capture...
```
```
AskUserQuestion
```
```
---url: https://example.com/pagetitle: "Page Title"description: "Meta description if available"author: "Author if available"published: "2024-01-01"captured_at: "2024-01-15T10:30:00Z"---# Page TitleConverted markdown content...
```
```
---url: https://example.com/pagetitle: "Page Title"description: "Meta description if available"author: "Author if available"published: "2024-01-01"captured_at: "2024-01-15T10:30:00Z"---# Page TitleConverted markdown content...
```
```
The page may require login or interaction before capturing.Which mode should I use?1. Auto - Capture immediately when loaded2. Wait - Wait for you to interact first
```
```
The page may require login or interaction before capturing.Which mode should I use?1. Auto - Capture immediately when loaded2. Wait - Wait for you to interact first
```
```
url-to-markdown/└── <domain>/    └── <slug>.md
```
```
url-to-markdown/└── <domain>/    └── <slug>.md
```
```
<domain>
```
```
example.com
```
```
github.com
```
```
<slug>
```
```
getting-started-with-react
```
```
url-to-markdown/<domain>/<slug>.md
```
```
<slug>-YYYYMMDD-HHMMSS.md
```
```
getting-started.md
```
```
getting-started-20260118-143052.md
```
```
URL_CHROME_PATH
```
```
--timeout
```
```
URL_CHROME_PATH
```
```
URL_DATA_DIR
```
```
URL_CHROME_PROFILE_DIR
```
```
.baoyu-skills/baoyu-url-to-markdown/EXTEND.md
```
```
~/.baoyu-skills/baoyu-url-to-markdown/EXTEND.md
```
This powerful AI agent skill revolutionizes how you capture and store web content. Designed to fetch any given URL, it intelligently transforms the live webpage into clean, readable markdown using Chrome DevTools Protocol (CDP). This ensures that dynamic content and JavaScript-rendered elements are fully processed before conversion. Whether you need to archive articles, documentation, or research papers, this skill offers unparalleled flexibility. It supports an auto-capture mode for immediate processing and a 'wait' mode, perfect for interactive pages or those requiring authentication, giving you full control over the capture moment. Streamline your content curation workflow with precise, formatted output.

# When to Use This Skill
- •Archiving online articles or blog posts for offline reading and personal knowledge bases.
- •Saving technical documentation pages (e.g., API docs) in a version-controlled markdown format.
- •Extracting content from web applications that require a login, using the 'wait' mode.
- •Converting dynamic, JavaScript-heavy web pages into static markdown for easier parsing and analysis.

# Pro Tips
- 💡For complex pages or those requiring authentication, always use the `--wait` flag to manually signal when the page is ready for capture, ensuring all dynamic elements are loaded.
- 💡Leverage the `-o` option to specify an output file path, which is crucial when integrating this skill into automated workflows or scripting environments.
- 💡Remember that Chrome CDP renders the page fully, so the markdown output will reflect the page's appearance after all scripts have executed, providing a more accurate representation than simple HTML parsers.

