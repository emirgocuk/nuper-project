# baoyu-danger-gemini-web
Source: https://antigravity.codes/agent-skills/creative/baoyu-danger-gemini-web

## AI Worker Instructions
When the user requests functionality related to baoyu-danger-gemini-web, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-danger-gemini-web
```
--sessionId
```
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
scripts/gemini-webapi/*
```
```
gemini_webapi
```
```
# macOScat ~/Library/Application\ Support/baoyu-skills/gemini-web/consent.json 2>/dev/null# Linuxcat ~/.local/share/baoyu-skills/gemini-web/consent.json 2>/dev/null# Windows (PowerShell)Get-Content "$env:APPDATA\baoyu-skills\gemini-web\consent.json" 2>$null
```
```
# macOScat ~/Library/Application\ Support/baoyu-skills/gemini-web/consent.json 2>/dev/null# Linuxcat ~/.local/share/baoyu-skills/gemini-web/consent.json 2>/dev/null# Windows (PowerShell)Get-Content "$env:APPDATA\baoyu-skills\gemini-web\consent.json" 2>$null
```
```
accepted: true
```
```
disclaimerVersion: "1.0"
```
```
⚠️  Warning: Using reverse-engineered Gemini Web API (not official). Accepted on: <acceptedAt date>
```
```
⚠️  Warning: Using reverse-engineered Gemini Web API (not official). Accepted on: <acceptedAt date>
```
```
disclaimerVersion
```
```
⚠️  DISCLAIMERThis tool uses a reverse-engineered Gemini Web API, NOT an official Google API.Risks:- May break without notice if Google changes their API- No official support or guarantees- Use at your own riskDo you accept these terms and wish to continue?
```
```
⚠️  DISCLAIMERThis tool uses a reverse-engineered Gemini Web API, NOT an official Google API.Risks:- May break without notice if Google changes their API- No official support or guarantees- Use at your own riskDo you accept these terms and wish to continue?
```
```
AskUserQuestion
```
```
# macOSmkdir -p ~/Library/Application\ Support/baoyu-skills/gemini-webcat > ~/Library/Application\ Support/baoyu-skills/gemini-web/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF# Linuxmkdir -p ~/.local/share/baoyu-skills/gemini-webcat > ~/.local/share/baoyu-skills/gemini-web/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF
```
```
# macOSmkdir -p ~/Library/Application\ Support/baoyu-skills/gemini-webcat > ~/Library/Application\ Support/baoyu-skills/gemini-web/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF# Linuxmkdir -p ~/.local/share/baoyu-skills/gemini-webcat > ~/.local/share/baoyu-skills/gemini-web/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF
```
```
User declined the disclaimer. Exiting.
```
```
User declined the disclaimer. Exiting.
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello, Gemini"npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Explain quantum computing"npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cute cat" --image cat.pngnpx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image out.png# Multi-turn conversation (agent generates unique sessionId)npx -y bun ${SKILL_DIR}/scripts/main.ts "Remember this: 42" --sessionId my-unique-id-123npx -y bun ${SKILL_DIR}/scripts/main.ts "What number?" --sessionId my-unique-id-123
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello, Gemini"npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Explain quantum computing"npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cute cat" --image cat.pngnpx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image out.png# Multi-turn conversation (agent generates unique sessionId)npx -y bun ${SKILL_DIR}/scripts/main.ts "Remember this: 42" --sessionId my-unique-id-123npx -y bun ${SKILL_DIR}/scripts/main.ts "What number?" --sessionId my-unique-id-123
```
```
# Simple prompt (positional)npx -y bun ${SKILL_DIR}/scripts/main.ts "Your prompt here"# Explicit prompt flagnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Your prompt here"npx -y bun ${SKILL_DIR}/scripts/main.ts -p "Your prompt here"# With model selectionnpx -y bun ${SKILL_DIR}/scripts/main.ts -p "Hello" -m gemini-2.5-pro# Pipe from stdinecho "Summarize this" | npx -y bun ${SKILL_DIR}/scripts/main.ts
```
```
# Simple prompt (positional)npx -y bun ${SKILL_DIR}/scripts/main.ts "Your prompt here"# Explicit prompt flagnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Your prompt here"npx -y bun ${SKILL_DIR}/scripts/main.ts -p "Your prompt here"# With model selectionnpx -y bun ${SKILL_DIR}/scripts/main.ts -p "Hello" -m gemini-2.5-pro# Pipe from stdinecho "Summarize this" | npx -y bun ${SKILL_DIR}/scripts/main.ts
```
```
# Generate image with default path (./generated.png)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A sunset over mountains" --image# Generate image with custom pathnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cute robot" --image robot.png# Shorthandnpx -y bun ${SKILL_DIR}/scripts/main.ts "A dragon" --image=dragon.png
```
```
# Generate image with default path (./generated.png)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A sunset over mountains" --image# Generate image with custom pathnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cute robot" --image robot.png# Shorthandnpx -y bun ${SKILL_DIR}/scripts/main.ts "A dragon" --image=dragon.png
```
```
# Text + image -> textnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Describe this image" --reference a.png# Text + image -> imagenpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Generate a variation" --reference a.png --image out.png
```
```
# Text + image -> textnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Describe this image" --reference a.png# Text + image -> imagenpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Generate a variation" --reference a.png --image out.png
```
```
# Plain text (default)npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello"# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts "Hello" --json
```
```
# Plain text (default)npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello"# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts "Hello" --json
```
```
--prompt <text>
```
```
-p
```
```
--promptfiles <files...>
```
```
--model <id>
```
```
-m
```
```
--image [path]
```
```
--reference <files...>
```
```
--ref <files...>
```
```
--sessionId <id>
```
```
--list-sessions
```
```
--json
```
```
--login
```
```
--cookie-path <path>
```
```
--profile-dir <path>
```
```
--help
```
```
-h
```
```
scripts/main.ts
```
```
--reference/--ref
```
```
--sessionId
```
```
gemini-3-pro
```
```
gemini-2.5-pro
```
```
gemini-2.5-flash
```
```
GEMINI_WEB_CHROME_PATH
```
```
# Force cookie refreshnpx -y bun ${SKILL_DIR}/scripts/main.ts --login
```
```
# Force cookie refreshnpx -y bun ${SKILL_DIR}/scripts/main.ts --login
```
```
GEMINI_WEB_DATA_DIR
```
```
GEMINI_WEB_COOKIE_PATH
```
```
GEMINI_WEB_CHROME_PROFILE_DIR
```
```
GEMINI_WEB_CHROME_PATH
```
```
HTTP_PROXY
```
```
HTTPS_PROXY
```
```
# Example with local proxyHTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello"# Image generation with proxyHTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png# Cookie refresh with proxyHTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts --login
```
```
# Example with local proxyHTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello"# Image generation with proxyHTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png# Cookie refresh with proxyHTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun ${SKILL_DIR}/scripts/main.ts --login
```
```
.bashrc
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "What is the capital of France?"
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "What is the capital of France?"
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "A photorealistic image of a golden retriever puppy" --image puppy.png
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "A photorealistic image of a golden retriever puppy" --image puppy.png
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello" --json | jq '.text'
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts "Hello" --json | jq '.text'
```
```
# Concatenate system.md + content.md as promptnpx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image output.png
```
```
# Concatenate system.md + content.md as promptnpx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image output.png
```
```
# Start a session with unique ID (agent generates this)npx -y bun ${SKILL_DIR}/scripts/main.ts "You are a helpful math tutor." --sessionId task-abc123# Continue the conversation (remembers context)npx -y bun ${SKILL_DIR}/scripts/main.ts "What is 2+2?" --sessionId task-abc123npx -y bun ${SKILL_DIR}/scripts/main.ts "Now multiply that by 10" --sessionId task-abc123# List recent sessions (max 100, sorted by update time)npx -y bun ${SKILL_DIR}/scripts/main.ts --list-sessions
```
```
# Start a session with unique ID (agent generates this)npx -y bun ${SKILL_DIR}/scripts/main.ts "You are a helpful math tutor." --sessionId task-abc123# Continue the conversation (remembers context)npx -y bun ${SKILL_DIR}/scripts/main.ts "What is 2+2?" --sessionId task-abc123npx -y bun ${SKILL_DIR}/scripts/main.ts "Now multiply that by 10" --sessionId task-abc123# List recent sessions (max 100, sorted by update time)npx -y bun ${SKILL_DIR}/scripts/main.ts --list-sessions
```
```
~/Library/Application Support/baoyu-skills/gemini-web/sessions/<id>.json
```
```
id
```
```
metadata
```
```
messages
```
```
{role, content, timestamp, error?}
```
```
createdAt
```
```
updatedAt
```
```
.baoyu-skills/baoyu-danger-gemini-web/EXTEND.md
```
```
~/.baoyu-skills/baoyu-danger-gemini-web/EXTEND.md
```
This advanced AI Agent Skill integrates the powerful capabilities of Google Gemini Web directly into your coding environment. Designed to serve as a versatile backend, it empowers assistants like Claude Code and Cursor to perform sophisticated image and text generation tasks from simple prompts. Whether you need compelling visuals for a project or dynamic text content, this skill streamlines the creative process. It's an essential tool for developers looking to inject AI-driven creativity into their workflows, making it easier to prototype, illustrate, and generate diverse content programmatically, significantly expanding your agent's creative potential.

# When to Use This Skill
- •Generating custom cover images or visual assets for articles and projects.
- •Creating dynamic social media content, including images and accompanying text.
- •Illustrating technical documentation or blog posts with AI-generated visuals.
- •Prototyping UI/UX elements by quickly generating placeholder images based on descriptions.

# Pro Tips
- 💡Leverage the `--sessionId` parameter for multi-turn conversations to maintain context and refine generated outputs iteratively.
- 💡Utilize the reference images feature to provide vision input, guiding Gemini's generation with specific visual styles or examples.
- 💡Integrate this skill as a powerful image generation backend for other creative skills like 'cover-image' or 'article-illustrator' for seamless workflows.
- 💡Always perform the required consent check to ensure proper authorization before skill execution.

