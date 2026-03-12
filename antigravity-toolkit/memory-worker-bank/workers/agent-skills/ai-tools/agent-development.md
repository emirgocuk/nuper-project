# agent-development
Source: https://antigravity.codes/agent-skills/ai-tools/agent-development

## AI Worker Instructions
When the user requests functionality related to agent-development, follow these guidelines and utilize this context.

## Scraped Content

# agent-development
```
---name: agent-namedescription: |  [Role] specialist. MUST BE USED when [specific triggers].  Use PROACTIVELY for [task category].  Keywords: [trigger words]tools: Read, Write, Edit, Glob, Grep, Bashmodel: sonnet---
```
```
---name: agent-namedescription: |  [Role] specialist. MUST BE USED when [specific triggers].  Use PROACTIVELY for [task category].  Keywords: [trigger words]tools: Read, Write, Edit, Glob, Grep, Bashmodel: sonnet---
```
```
Task tool subagent_type: "agent-name"
```
```
cat > file << 'EOF'
```
```
.claude/settings.json
```
```
{  "permissions": {    "allow": [      "Write", "Edit", "WebFetch(domain:*)",      "Bash(cd *)", "Bash(cp *)", "Bash(mkdir *)", "Bash(ls *)",      "Bash(cat *)", "Bash(head *)", "Bash(tail *)", "Bash(grep *)",      "Bash(diff *)", "Bash(mv *)", "Bash(touch *)", "Bash(file *)"    ]  }}
```
```
{  "permissions": {    "allow": [      "Write", "Edit", "WebFetch(domain:*)",      "Bash(cd *)", "Bash(cp *)", "Bash(mkdir *)", "Bash(ls *)",      "Bash(cat *)", "Bash(head *)", "Bash(tail *)", "Bash(grep *)",      "Bash(diff *)", "Bash(mv *)", "Bash(touch *)", "Bash(file *)"    ]  }}
```
```
~/.bashrc
```
```
~/.zshrc
```
```
export NODE_OPTIONS="--max-old-space-size=16384"
```
```
export NODE_OPTIONS="--max-old-space-size=16384"
```
```
source ~/.bashrc
```
```
NODE_OPTIONS="--max-old-space-size=16384" claude
```
```
// ❌ WRONG - Remote API callconst response = await fetch('https://api.anthropic.com/v1/messages', {...})// ✅ CORRECT - Use Task tool// Invoke Task with subagent_type: "general-purpose"
```
```
// ❌ WRONG - Remote API callconst response = await fetch('https://api.anthropic.com/v1/messages', {...})// ✅ CORRECT - Use Task tool// Invoke Task with subagent_type: "general-purpose"
```
```
### Check for placeholders
```
```
### Check for placeholders
```
```

```
```

```
```
### Check for placeholdersSearch all HTML files in build/ for:- PLACEHOLDER: comments- TODO or TBD markers- Template brackets like [Client Name]Any match = incomplete content.
```
```
### Check for placeholdersSearch all HTML files in build/ for:- PLACEHOLDER: comments- TODO or TBD markers- Template brackets like [Client Name]Any match = incomplete content.
```
```
## Your Role[What the agent does]## Blocking Check[Prerequisites that must exist]## Input[What files to read]## Process[Step-by-step with encoded learnings]## Output[Exact file paths and formats]## Quality Checklist[Verification steps including learned gotchas]## Common Issues[Patterns discovered during development]
```
```
## Your Role[What the agent does]## Blocking Check[Prerequisites that must exist]## Input[What files to read]## Process[Step-by-step with encoded learnings]## Output[Exact file paths and formats]## Quality Checklist[Verification steps including learned gotchas]## Common Issues[Patterns discovered during development]
```
```
HTML-01
```
```
HTML-05
```
```
HTML-11
```
```
grep -n "Next:.*→\|Then.*runs next" .claude/agents/*.md
```
```
grep -n "Next:.*→\|Then.*runs next" .claude/agents/*.md
```
```
For each [item]:1. Read [source file]2. Verify with [external check - npm view, API call, etc.]3. Check [authoritative source]4. Score/evaluate5. FIX issues found ← Critical instruction
```
```
For each [item]:1. Read [source file]2. Verify with [external check - npm view, API call, etc.]3. Check [authoritative source]4. Score/evaluate5. FIX issues found ← Critical instruction
```
```
1. ME: Launch 2-3 parallel agents with identical prompt, different item lists2. AGENTS: Work in parallel (read → verify → check → edit → report)3. AGENTS: Return structured reports (score, status, fixes applied, files modified)4. ME: Review changes (git status, spot-check diffs)5. ME: Commit in batches with meaningful changelog6. ME: Push and update progress tracking
```
```
1. ME: Launch 2-3 parallel agents with identical prompt, different item lists2. AGENTS: Work in parallel (read → verify → check → edit → report)3. AGENTS: Return structured reports (score, status, fixes applied, files modified)4. ME: Review changes (git status, spot-check diffs)5. ME: Commit in batches with meaningful changelog6. ME: Push and update progress tracking
```
```
---name: my-agentdescription: |  [Role] specialist. MUST BE USED when [triggers].  Use PROACTIVELY for [task category].  Keywords: [trigger words]tools: Read, Write, Edit, Glob, Grep, Bashmodel: sonnet---
```
```
---name: my-agentdescription: |  [Role] specialist. MUST BE USED when [triggers].  Use PROACTIVELY for [task category].  Keywords: [trigger words]tools: Read, Write, Edit, Glob, Grep, Bashmodel: sonnet---
```
```
.claude/settings.json
```
```
export NODE_OPTIONS="--max-old-space-size=16384"source ~/.bashrc && claude
```
```
export NODE_OPTIONS="--max-old-space-size=16384"source ~/.bashrc && claude
```
```
~/.bashrc
```
```
~/.zshrc
```
```
export NODE_OPTIONS="--max-old-space-size=16384"
```
```
export NODE_OPTIONS="--max-old-space-size=16384"
```
```
source ~/.bashrc
```
```
NODE_OPTIONS="--max-old-space-size=16384" claude
```
```
subagent_type: "general-purpose"
```
```
fetch('https://api.anthropic.com/v1/messages')
```
```
// ❌ WRONG - Remote API callconst response = await fetch('https://api.anthropic.com/v1/messages', {  method: 'POST',  headers: { 'x-api-key': ANTHROPIC_API_KEY },  body: JSON.stringify({ model: 'claude-sonnet-4-20250514', messages: [...] })});// ✅ CORRECT - Use Task tool in Claude Code// Invoke Task with subagent_type: "general-purpose"// Sub-agent reads files, synthesizes, writes output
```
```
// ❌ WRONG - Remote API callconst response = await fetch('https://api.anthropic.com/v1/messages', {  method: 'POST',  headers: { 'x-api-key': ANTHROPIC_API_KEY },  body: JSON.stringify({ model: 'claude-sonnet-4-20250514', messages: [...] })});// ✅ CORRECT - Use Task tool in Claude Code// Invoke Task with subagent_type: "general-purpose"// Sub-agent reads files, synthesizes, writes output
```
```
:has(:nth-child(4):last-child)
```
```
### Grid Layout Rules- Use .services-grid class - it auto-adapts to item count- 4 items → 2x2 grid (not 3+1)- See teams/creative/layout-presets.md for patterns
```
```
### Grid Layout Rules- Use .services-grid class - it auto-adapts to item count- 4 items → 2x2 grid (not 3+1)- See teams/creative/layout-presets.md for patterns
```
```
.services-grid
```
```
teams/creative/layout-presets.md
```
```
## Your Role[What the agent does]## Blocking Check[Prerequisites that must exist]## Input[What files to read]## Process[Step-by-step with encoded learnings]## Output[Exact file paths and formats]## Quality Checklist[Verification steps including learned gotchas]## Common Issues[Patterns discovered during development]
```
```
## Your Role[What the agent does]## Blocking Check[Prerequisites that must exist]## Input[What files to read]## Process[Step-by-step with encoded learnings]## Output[Exact file paths and formats]## Quality Checklist[Verification steps including learned gotchas]## Common Issues[Patterns discovered during development]
```
```
.claude/agents/
```
```
teams/*/
```
```
.claude/agents/
```
```
description: "Analyzes screenshots for issues"
```
```
description: "Visual QA specialist. MUST BE USED when analyzing screenshots. Use PROACTIVELY for any visual QA task."
```
```
description: "Runs Playwright scripts"
```
```
description: "Playwright specialist. MUST BE USED when running Playwright scripts. Use PROACTIVELY for browser automation."
```
```
---name: agent-namedescription: "[Role] specialist. MUST BE USED when [specific triggers]. Use PROACTIVELY for [task category]."tools: [tool list]model: sonnet---
```
```
---name: agent-namedescription: "[Role] specialist. MUST BE USED when [specific triggers]. Use PROACTIVELY for [task category]."tools: [tool list]model: sonnet---
```
```
Task tool subagent_type: "agent-name"
```
```
HTML-01
```
```
HTML-05
```
```
HTML-11
```
```
grep -n "Next:.*→\|Then.*runs next" .claude/agents/*.md
```
```
grep -n "Next:.*→\|Then.*runs next" .claude/agents/*.md
```
```
tools: Read, Write, Edit, Glob, Grep, Bash
```
```
tools: Read, Write, Edit, Glob, Grep, Bash
```
```
.claude/settings.json
```
```
{  "permissions": {    "allow": [      "Write",      "Edit",      "WebFetch(domain:*)",      "Bash(cd *)",      "Bash(cp *)",      "Bash(mkdir *)",      "Bash(ls *)",      "Bash(find *)",      "Bash(cat *)",      "Bash(head *)",      "Bash(tail *)",      "Bash(wc *)",      "Bash(pwd)",      "Bash(echo *)",      "Bash(grep *)",      "Bash(diff *)",      "Bash(mv *)",      "Bash(touch *)",      "Bash(basename *)",      "Bash(dirname *)",      "Bash(sort *)",      "Bash(uniq *)",      "Bash(test *)",      "Bash([ *)",      "Bash(for *)",      "Bash(cut *)",      "Bash(file *)"    ]  }}
```
```
{  "permissions": {    "allow": [      "Write",      "Edit",      "WebFetch(domain:*)",      "Bash(cd *)",      "Bash(cp *)",      "Bash(mkdir *)",      "Bash(ls *)",      "Bash(find *)",      "Bash(cat *)",      "Bash(head *)",      "Bash(tail *)",      "Bash(wc *)",      "Bash(pwd)",      "Bash(echo *)",      "Bash(grep *)",      "Bash(diff *)",      "Bash(mv *)",      "Bash(touch *)",      "Bash(basename *)",      "Bash(dirname *)",      "Bash(sort *)",      "Bash(uniq *)",      "Bash(test *)",      "Bash([ *)",      "Bash(for *)",      "Bash(cut *)",      "Bash(file *)"    ]  }}
```
```
Write
```
```
Edit
```
```
WebFetch(domain:*)
```
```
Bash(...)
```
```
WebSearch
```
```
for file in...
```
```
Bash(for *)
```
```
grep -r "PLACEHOLDER:" build/*.html
```
```
ls build/
```
```
cat discovery/report.json \| jq '.abn'
```
```
### Check for placeholders
```
```
### Check for placeholders
```
```

```
```

```
```
### Check for placeholdersSearch all HTML files in build/ for:- PLACEHOLDER: comments- TODO or TBD markers- Template brackets like [Client Name]Any match = incomplete content.
```
```
### Check for placeholdersSearch all HTML files in build/ for:- PLACEHOLDER: comments- TODO or TBD markers- Template brackets like [Client Name]Any match = incomplete content.
```
```
jezpress-cli
```
```
npx tsx
```
```
wrangler
```
Unlock the full potential of Claude Code by mastering the art of custom agent development. This skill empowers you to transcend basic prompts, crafting intelligent, specialized agents that autonomously handle complex coding tasks. Learn to define clear roles, integrate essential tools, and design descriptions that trigger seamless delegation, transforming Claude into a highly efficient, multi-faceted coding partner capable of tackling intricate projects with precision and independence. Elevate your AI coding workflow with expertly designed agents.

# When to Use This Skill
- •Developing a specialized code refactoring agent that automatically identifies and applies best practice improvements.
- •Creating an automated testing agent configured to run specific Playwright scripts or execute custom test suites.
- •Building a multi-step deployment agent that orchestrates a series of build, test, and deployment commands.
- •Designing a visual QA agent that proactively analyzes screenshots for UI inconsistencies or accessibility issues.

# Pro Tips
- 💡Always start with a clearly defined agent role and its core responsibilities before detailing triggers or tools.
- 💡Iteratively refine your agent's `description` field by testing various task prompts to ensure consistent and accurate automatic delegation.
- 💡For complex workflows, consider a hierarchy of agents where a high-level agent delegates to several specialized sub-agents, each with a narrow focus and specific tools.

