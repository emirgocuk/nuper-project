# baoyu-danger-x-to-markdown
Source: https://antigravity.codes/agent-skills/documentation/baoyu-danger-x-to-markdown

## AI Worker Instructions
When the user requests functionality related to baoyu-danger-x-to-markdown, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-danger-x-to-markdown
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
# macOScat ~/Library/Application\ Support/baoyu-skills/x-to-markdown/consent.json 2>/dev/null# Linuxcat ~/.local/share/baoyu-skills/x-to-markdown/consent.json 2>/dev/null# Windows (PowerShell)Get-Content "$env:APPDATA\baoyu-skills\x-to-markdown\consent.json" 2>$null
```
```
# macOScat ~/Library/Application\ Support/baoyu-skills/x-to-markdown/consent.json 2>/dev/null# Linuxcat ~/.local/share/baoyu-skills/x-to-markdown/consent.json 2>/dev/null# Windows (PowerShell)Get-Content "$env:APPDATA\baoyu-skills\x-to-markdown\consent.json" 2>$null
```
```
accepted: true
```
```
disclaimerVersion: "1.0"
```
```
⚠️  Warning: Using reverse-engineered X API (not official). Accepted on: <acceptedAt date>
```
```
⚠️  Warning: Using reverse-engineered X API (not official). Accepted on: <acceptedAt date>
```
```
disclaimerVersion
```
```
⚠️  DISCLAIMERThis tool uses a reverse-engineered X (Twitter) API, NOT an official API.Risks:- May break without notice if X changes their API- No official support or guarantees- Account restrictions possible if API usage detected- Use at your own riskDo you accept these terms and wish to continue?
```
```
⚠️  DISCLAIMERThis tool uses a reverse-engineered X (Twitter) API, NOT an official API.Risks:- May break without notice if X changes their API- No official support or guarantees- Account restrictions possible if API usage detected- Use at your own riskDo you accept these terms and wish to continue?
```
```
AskUserQuestion
```
```
# macOSmkdir -p ~/Library/Application\ Support/baoyu-skills/x-to-markdowncat > ~/Library/Application\ Support/baoyu-skills/x-to-markdown/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF# Linuxmkdir -p ~/.local/share/baoyu-skills/x-to-markdowncat > ~/.local/share/baoyu-skills/x-to-markdown/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF
```
```
# macOSmkdir -p ~/Library/Application\ Support/baoyu-skills/x-to-markdowncat > ~/Library/Application\ Support/baoyu-skills/x-to-markdown/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF# Linuxmkdir -p ~/.local/share/baoyu-skills/x-to-markdowncat > ~/.local/share/baoyu-skills/x-to-markdown/consent.json << 'EOF'{  "version": 1,  "accepted": true,  "acceptedAt": "<ISO timestamp>",  "disclaimerVersion": "1.0"}EOF
```
```
User declined the disclaimer. Exiting.
```
```
User declined the disclaimer. Exiting.
```
```
# Convert tweet (outputs markdown path)npx -y bun ${SKILL_DIR}/scripts/main.ts <url># Save to specific filenpx -y bun ${SKILL_DIR}/scripts/main.ts <url> -o output.md# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts <url> --json
```
```
# Convert tweet (outputs markdown path)npx -y bun ${SKILL_DIR}/scripts/main.ts <url># Save to specific filenpx -y bun ${SKILL_DIR}/scripts/main.ts <url> -o output.md# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts <url> --json
```
```
<url>
```
```
-o <path>
```
```
--json
```
```
--login
```
```
x-to-markdown/└── {username}/    └── {tweet-id}.md
```
```
x-to-markdown/└── {username}/    └── {tweet-id}.md
```
```
https://x.com/<user>/status/<id>
```
```
https://twitter.com/<user>/status/<id>
```
```
https://x.com/i/article/<id>
```
```
---url: https://x.com/username/status/123author: "Display Name (@username)"tweet_count: 3---Tweet content...---Thread continuation...
```
```
---url: https://x.com/username/status/123author: "Display Name (@username)"tweet_count: 3---Tweet content...---Thread continuation...
```
```
X_AUTH_TOKEN
```
```
X_CT0
```
```
.baoyu-skills/baoyu-danger-x-to-markdown/EXTEND.md
```
```
~/.baoyu-skills/baoyu-danger-x-to-markdown/EXTEND.md
```
This powerful agent skill bridges the gap between dynamic social media content and static, reusable documentation. Designed to convert X (formerly Twitter) tweets and extensive articles into structured Markdown, it's an indispensable tool for researchers, content creators, and archivists. The skill carefully extracts text, threads, and article content, presenting it in a clean format ideal for integration into notes, blogs, or knowledge bases. Its unique approach leverages a reverse-engineered API, ensuring comprehensive content capture while prioritizing user consent and data privacy.

# When to Use This Skill
- •Archiving important tweet threads or X articles for future reference and compliance.
- •Converting social media content into Markdown for blog posts, newsletters, or internal documentation.
- •Extracting full text from X articles for research, analysis, or personal knowledge bases.
- •Curating and organizing online content from X into a consistent, easily parsable format.

# Pro Tips
- 💡Always ensure explicit consent is given as per the skill's instructions to avoid interruption and ensure proper functionality.
- 💡Review the generated Markdown for any specific formatting nuances, especially with complex tweet threads or heavily formatted articles.
- 💡Combine this skill with other content processing agents, such as summarizers or translators, to further enhance the utility of the extracted Markdown.

