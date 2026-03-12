# sub-agent-patterns
Source: https://antigravity.codes/agent-skills/ai-tools/sub-agent-patterns

## AI Worker Instructions
When the user requests functionality related to sub-agent-patterns, follow these guidelines and utilize this context.

## Scraped Content

# sub-agent-patterns
```
Main context accumulates:├─ git status output (50 lines)├─ npm run build output (200 lines)├─ tsc --noEmit output (100 lines)├─ wrangler deploy output (100 lines)├─ curl health check responses├─ All reasoning about what to do next└─ Context: 📈 500+ lines consumed
```
```
Main context accumulates:├─ git status output (50 lines)├─ npm run build output (200 lines)├─ tsc --noEmit output (100 lines)├─ wrangler deploy output (100 lines)├─ curl health check responses├─ All reasoning about what to do next└─ Context: 📈 500+ lines consumed
```
```
Main context:├─ "Deploy to cloudflare"├─ [agent summary - 30 lines]└─ Context: 📊 ~50 lines consumedAgent context (isolated):├─ All verbose tool outputs├─ All intermediate reasoning└─ Discarded after returning summary
```
```
Main context:├─ "Deploy to cloudflare"├─ [agent summary - 30 lines]└─ Context: 📊 ~50 lines consumedAgent context (isolated):├─ All verbose tool outputs├─ All intermediate reasoning└─ Discarded after returning summary
```
```
quick
```
```
medium
```
```
very thorough
```
```
User: Where are errors from the client handled?Claude: [Invokes Explore with "medium" thoroughness]       → Returns: src/services/process.ts:712
```
```
User: Where are errors from the client handled?Claude: [Invokes Explore with "medium" thoroughness]       → Returns: src/services/process.ts:712
```
```
.claude/agents/
```
```
~/.claude/agents/
```
```
--agents '{...}'
```
```
/agents
```
```
---name: code-reviewerdescription: Expert code reviewer. Use proactively after code changes.tools: Read, Grep, Glob, Bashmodel: inheritpermissionMode: defaultskills: project-workflowhooks:  PostToolUse:    - matcher: "Edit|Write"      hooks:        - type: command          command: "./scripts/run-linter.sh"---Your sub-agent's system prompt goes here.Include specific instructions, best practices, and constraints.
```
```
---name: code-reviewerdescription: Expert code reviewer. Use proactively after code changes.tools: Read, Grep, Glob, Bashmodel: inheritpermissionMode: defaultskills: project-workflowhooks:  PostToolUse:    - matcher: "Edit|Write"      hooks:        - type: command          command: "./scripts/run-linter.sh"---Your sub-agent's system prompt goes here.Include specific instructions, best practices, and constraints.
```
```
name
```
```
description
```
```
tools
```
```
model
```
```
sonnet
```
```
opus
```
```
haiku
```
```
inherit
```
```
permissionMode
```
```
default
```
```
acceptEdits
```
```
dontAsk
```
```
bypassPermissions
```
```
plan
```
```
ignore
```
```
skills
```
```
hooks
```
```
PreToolUse
```
```
PostToolUse
```
```
Stop
```
```
**/*.ts
```
```
Read, Grep, Glob, LS
```
```
Read, Write, Edit, Glob, Grep
```
```
Read, Write, Edit, Glob, Grep, Bash
```
```
Read, Grep, Glob, WebFetch, WebSearch
```
```
Read, Write, Edit, Glob, Grep, WebFetch
```
```
Read, Grep, Glob, Task
```
```
tools
```
```
cat > file << 'EOF'
```
```
# Before - causes approval spam   tools: Read, Write, Edit, Glob, Grep, Bash   # After - clean file operations   tools: Read, Write, Edit, Glob, Grep
```
```
# Before - causes approval spam   tools: Read, Write, Edit, Glob, Grep, Bash   # After - clean file operations   tools: Read, Write, Edit, Glob, Grep
```
```
---   name: site-builder   tools: Read, Write, Edit, Glob, Grep   model: sonnet   ---   ## ⛔ CRITICAL: USE WRITE TOOL FOR ALL FILES   **You do NOT have Bash access.** Create ALL files using the **Write tool**.   ---   [rest of prompt...]
```
```
---   name: site-builder   tools: Read, Write, Edit, Glob, Grep   model: sonnet   ---   ## ⛔ CRITICAL: USE WRITE TOOL FOR ALL FILES   **You do NOT have Bash access.** Create ALL files using the **Write tool**.   ---   [rest of prompt...]
```
```
# BAD - contradictory   Line 75: "Copy images with cp -r intake/images/* build/images/"   Line 300: "NEVER use cp, mkdir, cat, or echo"   # GOOD - consistent   Only mention the pattern you want used. Remove all bash examples if you want Write tool.
```
```
# BAD - contradictory   Line 75: "Copy images with cp -r intake/images/* build/images/"   Line 300: "NEVER use cp, mkdir, cat, or echo"   # GOOD - consistent   Only mention the pattern you want used. Remove all bash examples if you want Write tool.
```
```
cp -r intake/images/* build/images/
```
```
/agents
```
```
/agents
```
```
claude --agents '{  "code-reviewer": {    "description": "Expert code reviewer. Use proactively after code changes.",    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",    "tools": ["Read", "Grep", "Glob", "Bash"],    "model": "sonnet"  }}'
```
```
claude --agents '{  "code-reviewer": {    "description": "Expert code reviewer. Use proactively after code changes.",    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",    "tools": ["Read", "Grep", "Glob", "Bash"],    "model": "sonnet"  }}'
```
```
description
```
```
> Use the test-runner subagent to fix failing tests> Have the code-reviewer subagent look at my recent changes> Ask the debugger subagent to investigate this error
```
```
> Use the test-runner subagent to fix failing tests> Have the code-reviewer subagent look at my recent changes> Ask the debugger subagent to investigate this error
```
```
# Initial invocation> Use the code-analyzer agent to review the auth module[Agent completes, returns agentId: "abc123"]# Resume with full context> Resume agent abc123 and now analyze the authorization logic
```
```
# Initial invocation> Use the code-analyzer agent to review the auth module[Agent completes, returns agentId: "abc123"]# Resume with full context> Resume agent abc123 and now analyze the authorization logic
```
```
{  "permissions": {    "deny": ["Task(Explore)", "Task(Plan)"]  }}
```
```
{  "permissions": {    "deny": ["Task(Explore)", "Task(Plan)"]  }}
```
```
claude --disallowedTools "Task(Explore)"
```
```
claude --disallowedTools "Task(Explore)"
```
```
Task
```
```
Task
```
```
---name: orchestratordescription: Orchestrator agent that coordinates other specialized agents. Use for complex multi-phase tasks.tools: Read, Grep, Glob, Task  # ← Task tool enables agent spawningmodel: sonnet---
```
```
---name: orchestratordescription: Orchestrator agent that coordinates other specialized agents. Use for complex multi-phase tasks.tools: Read, Grep, Glob, Task  # ← Task tool enables agent spawningmodel: sonnet---
```
```
---name: release-orchestratordescription: Coordinates release preparation by delegating to specialized agents. Use before releases.tools: Read, Grep, Glob, Bash, Task---You are a release orchestrator. When invoked:1. Use Task tool to spawn code-reviewer agent   → Review all uncommitted changes2. Use Task tool to spawn test-runner agent   → Run full test suite3. Use Task tool to spawn doc-validator agent   → Check documentation is current4. Collect all reports and synthesize:   - Blockers (must fix before release)   - Warnings (should address)   - Ready to release: YES/NOSpawn agents in parallel when tasks are independent.Wait for all agents before synthesizing final report.
```
```
---name: release-orchestratordescription: Coordinates release preparation by delegating to specialized agents. Use before releases.tools: Read, Grep, Glob, Bash, Task---You are a release orchestrator. When invoked:1. Use Task tool to spawn code-reviewer agent   → Review all uncommitted changes2. Use Task tool to spawn test-runner agent   → Run full test suite3. Use Task tool to spawn doc-validator agent   → Check documentation is current4. Collect all reports and synthesize:   - Blockers (must fix before release)   - Warnings (should address)   - Ready to release: YES/NOSpawn agents in parallel when tasks are independent.Wait for all agents before synthesizing final report.
```
```
User: "Prepare this codebase for production"orchestrator agent:  ├─ Task(code-reviewer) → Reviews code quality  ├─ Task(security-auditor) → Checks for vulnerabilities  ├─ Task(performance-analyzer) → Identifies bottlenecks  └─ Synthesizes findings into actionable report
```
```
User: "Prepare this codebase for production"orchestrator agent:  ├─ Task(code-reviewer) → Reviews code quality  ├─ Task(security-auditor) → Checks for vulnerabilities  ├─ Task(performance-analyzer) → Identifies bottlenecks  └─ Synthesizes findings into actionable report
```
```
User: "Compare these 5 frameworks for our use case"research-orchestrator:  ├─ Task(general-purpose) → Research framework A  ├─ Task(general-purpose) → Research framework B  ├─ Task(general-purpose) → Research framework C  ├─ Task(general-purpose) → Research framework D  ├─ Task(general-purpose) → Research framework E  └─ Synthesizes comparison matrix with recommendation
```
```
User: "Compare these 5 frameworks for our use case"research-orchestrator:  ├─ Task(general-purpose) → Research framework A  ├─ Task(general-purpose) → Research framework B  ├─ Task(general-purpose) → Research framework C  ├─ Task(general-purpose) → Research framework D  ├─ Task(general-purpose) → Research framework E  └─ Synthesizes comparison matrix with recommendation
```
```
User: "Review my code changes"Claude: [Invokes code-reviewer agent directly]
```
```
User: "Review my code changes"Claude: [Invokes code-reviewer agent directly]
```
```
User: "Prepare release"Claude: [Invokes release-orchestrator]        orchestrator: [Spawns code-reviewer, test-runner, doc-validator]        orchestrator: [Synthesizes all reports]        [Returns comprehensive release readiness report]
```
```
User: "Prepare release"Claude: [Invokes release-orchestrator]        orchestrator: [Spawns code-reviewer, test-runner, doc-validator]        orchestrator: [Synthesizes all reports]        [Returns comprehensive release readiness report]
```
```
Task
```
```
inherit
```
```
> Use the research-agent to analyze these 10 frameworks[Agent starts working...][Press Ctrl+B]→ Agent continues in background→ Main session free for other work→ Check results later with: "What did the research agent find?"
```
```
> Use the research-agent to analyze these 10 frameworks[Agent starts working...][Press Ctrl+B]→ Agent continues in background→ Main session free for other work→ Check results later with: "What did the research agent find?"
```
```
sonnet
```
```
opus
```
```
haiku
```
```
inherit
```
```
---name: site-buildermodel: sonnet  # Content quality matters - NOT haikutools: Read, Write, Edit, Glob, Grep------name: creative-directormodel: opus  # Creative work needs maximum qualitytools: Read, Write, Edit, Glob, Grep------name: deploy-runnermodel: haiku  # Just running wrangler commands - quality irrelevanttools: Read, Bash---
```
```
---name: site-buildermodel: sonnet  # Content quality matters - NOT haikutools: Read, Write, Edit, Glob, Grep------name: creative-directormodel: opus  # Creative work needs maximum qualitytools: Read, Write, Edit, Glob, Grep------name: deploy-runnermodel: haiku  # Just running wrangler commands - quality irrelevanttools: Read, Bash---
```
```
---name: frontend-specialistdescription: Frontend code expert. NEVER writes backend logic.tools: Read, Write, Edit, Glob, Grep---You are a frontend specialist.BOUNDARIES:- NEVER write backend logic, API routes, or database queries- ALWAYS use React patterns consistent with the codebase- If task requires backend work, STOP and report "Requires backend specialist"FOCUS:- React components, hooks, state management- CSS/Tailwind styling- Client-side routing- Browser APIs
```
```
---name: frontend-specialistdescription: Frontend code expert. NEVER writes backend logic.tools: Read, Write, Edit, Glob, Grep---You are a frontend specialist.BOUNDARIES:- NEVER write backend logic, API routes, or database queries- ALWAYS use React patterns consistent with the codebase- If task requires backend work, STOP and report "Requires backend specialist"FOCUS:- React components, hooks, state management- CSS/Tailwind styling- Client-side routing- Browser APIs
```
```
hooks:  PreToolUse:    - matcher: "Bash"      hooks:        - type: command          command: |            if [[ "$BASH_COMMAND" == *"git commit"* ]]; then              npm test || exit 1            fi
```
```
hooks:  PreToolUse:    - matcher: "Bash"      hooks:        - type: command          command: |            if [[ "$BASH_COMMAND" == *"git commit"* ]]; then              npm test || exit 1            fi
```
```
hooks:  PostToolUse:    - matcher: "Edit|Write"      hooks:        - type: command          command: "./scripts/lint-check.sh"          # Exits 0 to continue, non-zero to warn
```
```
hooks:  PostToolUse:    - matcher: "Edit|Write"      hooks:        - type: command          command: "./scripts/lint-check.sh"          # Exits 0 to continue, non-zero to warn
```
```
CLAUDE.md
```
```
project/├── CLAUDE.md              # Root context (always loaded)├── src/│   └── CLAUDE.md          # Loaded when editing src/**├── tests/│   └── CLAUDE.md          # Loaded when editing tests/**└── docs/    └── CLAUDE.md          # Loaded when editing docs/**
```
```
project/├── CLAUDE.md              # Root context (always loaded)├── src/│   └── CLAUDE.md          # Loaded when editing src/**├── tests/│   └── CLAUDE.md          # Loaded when editing tests/**└── docs/    └── CLAUDE.md          # Loaded when editing docs/**
```
```
Main Claude → task-runner agent → result
```
```
Main Claude → task-runner agent → result
```
```
Main Claude → Task(general-purpose) → result
```
```
Main Claude → Task(general-purpose) → result
```
```
✅ Good fit:   - Audit 70 skills (repetitive) checking versions against docs (judgment)   - Update 50 files (repetitive) deciding what needs changing (judgment)   - Research 10 frameworks (repetitive) evaluating trade-offs (judgment)❌ Poor fit:   - Simple find-replace (no judgment needed, use sed/grep)   - Single complex task (not repetitive, do it yourself)   - Tasks with cross-item dependencies (agents work independently)
```
```
✅ Good fit:   - Audit 70 skills (repetitive) checking versions against docs (judgment)   - Update 50 files (repetitive) deciding what needs changing (judgment)   - Research 10 frameworks (repetitive) evaluating trade-offs (judgment)❌ Poor fit:   - Simple find-replace (no judgment needed, use sed/grep)   - Single complex task (not repetitive, do it yourself)   - Tasks with cross-item dependencies (agents work independently)
```
```
For each [item]:1. Read [source file/data]2. Verify with [external check - npm view, API, docs]3. Check [authoritative source]4. Evaluate/score5. FIX issues found ← Critical: gives agent authority to act
```
```
For each [item]:1. Read [source file/data]2. Verify with [external check - npm view, API, docs]3. Check [authoritative source]4. Evaluate/score5. FIX issues found ← Critical: gives agent authority to act
```
```
┌─────────────────────────────────────────────────────────────┐│  1. PLAN: Identify items, divide into batches               ││     └─ "58 skills ÷ 10 per batch = 6 agents"                │├─────────────────────────────────────────────────────────────┤│  2. LAUNCH: Parallel Task tool calls with identical prompts ││     └─ Same template, different item lists                  │├─────────────────────────────────────────────────────────────┤│  3. WAIT: Agents work in parallel                           ││     └─ Read → Verify → Check → Edit → Report                │├─────────────────────────────────────────────────────────────┤│  4. REVIEW: Check agent reports and file changes            ││     └─ git status, spot-check diffs                         │├─────────────────────────────────────────────────────────────┤│  5. COMMIT: Batch changes with meaningful changelog         ││     └─ One commit per tier/category, not per agent          │└─────────────────────────────────────────────────────────────┘
```
```
┌─────────────────────────────────────────────────────────────┐│  1. PLAN: Identify items, divide into batches               ││     └─ "58 skills ÷ 10 per batch = 6 agents"                │├─────────────────────────────────────────────────────────────┤│  2. LAUNCH: Parallel Task tool calls with identical prompts ││     └─ Same template, different item lists                  │├─────────────────────────────────────────────────────────────┤│  3. WAIT: Agents work in parallel                           ││     └─ Read → Verify → Check → Edit → Report                │├─────────────────────────────────────────────────────────────┤│  4. REVIEW: Check agent reports and file changes            ││     └─ git status, spot-check diffs                         │├─────────────────────────────────────────────────────────────┤│  5. COMMIT: Batch changes with meaningful changelog         ││     └─ One commit per tier/category, not per agent          │└─────────────────────────────────────────────────────────────┘
```
```
Deep audit these [N] [items]. For each:1. Read the [source file] from [path]2. Verify [versions/data] with [command or API]3. Check official [docs/source] for accuracy4. Score 1-10 and note any issues5. FIX issues found directly in the fileItems to audit:- [item-1]- [item-2]- [item-3]For each item, create a summary with:- Score and status (PASS/NEEDS_UPDATE)- Issues found- Fixes applied- Files modifiedWorking directory: [absolute path]
```
```
Deep audit these [N] [items]. For each:1. Read the [source file] from [path]2. Verify [versions/data] with [command or API]3. Check official [docs/source] for accuracy4. Score 1-10 and note any issues5. FIX issues found directly in the fileItems to audit:- [item-1]- [item-2]- [item-3]For each item, create a summary with:- Score and status (PASS/NEEDS_UPDATE)- Issues found- Fixes applied- Files modifiedWorking directory: [absolute path]
```
```
Update these [N] [items] to [new standard/format]. For each:1. Read the current file at [path pattern]2. Identify what needs changing3. Apply the update following this pattern:   [show example of correct format]4. Verify the change is valid5. Report what was changedItems to update:- [item-1]- [item-2]- [item-3]Output format:| Item | Status | Changes Made ||------|--------|--------------|Working directory: [absolute path]
```
```
Update these [N] [items] to [new standard/format]. For each:1. Read the current file at [path pattern]2. Identify what needs changing3. Apply the update following this pattern:   [show example of correct format]4. Verify the change is valid5. Report what was changedItems to update:- [item-1]- [item-2]- [item-3]Output format:| Item | Status | Changes Made ||------|--------|--------------|Working directory: [absolute path]
```
```
Research these [N] [options/frameworks/tools]. For each:1. Check official documentation at [URL pattern or search]2. Find current version and recent changes3. Identify key features relevant to [use case]4. Note any gotchas, limitations, or known issues5. Rate suitability for [specific need] (1-10)Options to research:- [option-1]- [option-2]- [option-3]Output format:## [Option Name]- **Version**: X.Y.Z- **Key Features**: ...- **Limitations**: ...- **Suitability Score**: X/10- **Recommendation**: ...
```
```
Research these [N] [options/frameworks/tools]. For each:1. Check official documentation at [URL pattern or search]2. Find current version and recent changes3. Identify key features relevant to [use case]4. Note any gotchas, limitations, or known issues5. Rate suitability for [specific need] (1-10)Options to research:- [option-1]- [option-2]- [option-3]Output format:## [Option Name]- **Version**: X.Y.Z- **Key Features**: ...- **Limitations**: ...- **Suitability Score**: X/10- **Recommendation**: ...
```
```
---name: code-reviewerdescription: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.tools: Read, Grep, Glob, Bashmodel: inherit---You are a senior code reviewer ensuring high standards of code quality and security.When invoked:1. Run git diff to see recent changes2. Focus on modified files3. Begin review immediatelyReview checklist:- Code is clear and readable- Functions and variables are well-named- No duplicated code- Proper error handling- No exposed secrets or API keys- Input validation implemented- Good test coverage- Performance considerations addressedProvide feedback organized by priority:- Critical issues (must fix)- Warnings (should fix)- Suggestions (consider improving)Include specific examples of how to fix issues.
```
```
---name: code-reviewerdescription: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.tools: Read, Grep, Glob, Bashmodel: inherit---You are a senior code reviewer ensuring high standards of code quality and security.When invoked:1. Run git diff to see recent changes2. Focus on modified files3. Begin review immediatelyReview checklist:- Code is clear and readable- Functions and variables are well-named- No duplicated code- Proper error handling- No exposed secrets or API keys- Input validation implemented- Good test coverage- Performance considerations addressedProvide feedback organized by priority:- Critical issues (must fix)- Warnings (should fix)- Suggestions (consider improving)Include specific examples of how to fix issues.
```
```
---name: debuggerdescription: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.tools: Read, Edit, Bash, Grep, Glob---You are an expert debugger specializing in root cause analysis.When invoked:1. Capture error message and stack trace2. Identify reproduction steps3. Isolate the failure location4. Implement minimal fix5. Verify solution worksDebugging process:- Analyze error messages and logs- Check recent code changes- Form and test hypotheses- Add strategic debug logging- Inspect variable statesFor each issue, provide:- Root cause explanation- Evidence supporting the diagnosis- Specific code fix- Testing approach- Prevention recommendationsFocus on fixing the underlying issue, not the symptoms.
```
```
---name: debuggerdescription: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.tools: Read, Edit, Bash, Grep, Glob---You are an expert debugger specializing in root cause analysis.When invoked:1. Capture error message and stack trace2. Identify reproduction steps3. Isolate the failure location4. Implement minimal fix5. Verify solution worksDebugging process:- Analyze error messages and logs- Check recent code changes- Form and test hypotheses- Add strategic debug logging- Inspect variable statesFor each issue, provide:- Root cause explanation- Evidence supporting the diagnosis- Specific code fix- Testing approach- Prevention recommendationsFocus on fixing the underlying issue, not the symptoms.
```
```
---name: data-scientistdescription: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.tools: Bash, Read, Writemodel: sonnet---You are a data scientist specializing in SQL and BigQuery analysis.When invoked:1. Understand the data analysis requirement2. Write efficient SQL queries3. Use BigQuery command line tools (bq) when appropriate4. Analyze and summarize results5. Present findings clearlyKey practices:- Write optimized SQL queries with proper filters- Use appropriate aggregations and joins- Include comments explaining complex logic- Format results for readability- Provide data-driven recommendationsAlways ensure queries are efficient and cost-effective.
```
```
---name: data-scientistdescription: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.tools: Bash, Read, Writemodel: sonnet---You are a data scientist specializing in SQL and BigQuery analysis.When invoked:1. Understand the data analysis requirement2. Write efficient SQL queries3. Use BigQuery command line tools (bq) when appropriate4. Analyze and summarize results5. Present findings clearlyKey practices:- Write optimized SQL queries with proper filters- Use appropriate aggregations and joins- Include comments explaining complex logic- Format results for readability- Provide data-driven recommendationsAlways ensure queries are efficient and cost-effective.
```
```
git add [files] && git commit -m "$(cat <<'EOF'[type]([scope]): [summary][Batch 1 changes][Batch 2 changes][Batch 3 changes]🤖 Generated with [Claude Code](https://claude.com/claude-code)EOF)"
```
```
git add [files] && git commit -m "$(cat <<'EOF'[type]([scope]): [summary][Batch 1 changes][Batch 2 changes][Batch 3 changes]🤖 Generated with [Claude Code](https://claude.com/claude-code)EOF)"
```
```
git diff [file]
```
```
git checkout -- [file]
```
```
/agents
```
```
.claude/agents/
```
```
Built-in agents:  Explore  → Haiku, read-only, quick/medium/thorough  Plan     → Sonnet, plan mode research  General  → Sonnet, all tools, read/writeCustom agents:  Project  → .claude/agents/*.md (highest priority)  User     → ~/.claude/agents/*.md  CLI      → --agents '{...}'Config fields:  name, description (required)  tools, model, permissionMode, skills, hooks (optional)Tool access principle:  ⚠️ Don't give Bash unless agent needs CLI execution  File creators: Read, Write, Edit, Glob, Grep (no Bash!)  Script runners: Read, Write, Edit, Glob, Grep, Bash (only if needed)  Research: Read, Grep, Glob, WebFetch, WebSearchModel selection (quality-first):  Default: sonnet (most agents - quality matters)  Creative: opus (maximum quality)  Scripts only: haiku (just running commands)  ⚠️ Avoid Haiku for content generation - quality drops significantlyInstruction placement:  ⛔ Critical instructions go FIRST (right after frontmatter)  ⚠️ Instructions buried 300+ lines deep get ignored  ✅ Remove contradictory instructions (pick one pattern)Delegation:  Batch size: 5-8 items per agent  Parallel: 2-4 agents simultaneously  Prompt: 5-step (read → verify → check → evaluate → FIX)Orchestration:  Enable: Add "Task" to agent's tools list  Depth: Keep to 2 levels max  Use: Multi-phase workflows, parallel specialistsAdvanced:  Background: Ctrl+B during agent execution  Context: 130k+ and 90+ tool calls work fine for real work  Hooks: PreToolUse, PostToolUse, Stop eventsResume agents:  > Resume agent [agentId] and continue...
```
```
Built-in agents:  Explore  → Haiku, read-only, quick/medium/thorough  Plan     → Sonnet, plan mode research  General  → Sonnet, all tools, read/writeCustom agents:  Project  → .claude/agents/*.md (highest priority)  User     → ~/.claude/agents/*.md  CLI      → --agents '{...}'Config fields:  name, description (required)  tools, model, permissionMode, skills, hooks (optional)Tool access principle:  ⚠️ Don't give Bash unless agent needs CLI execution  File creators: Read, Write, Edit, Glob, Grep (no Bash!)  Script runners: Read, Write, Edit, Glob, Grep, Bash (only if needed)  Research: Read, Grep, Glob, WebFetch, WebSearchModel selection (quality-first):  Default: sonnet (most agents - quality matters)  Creative: opus (maximum quality)  Scripts only: haiku (just running commands)  ⚠️ Avoid Haiku for content generation - quality drops significantlyInstruction placement:  ⛔ Critical instructions go FIRST (right after frontmatter)  ⚠️ Instructions buried 300+ lines deep get ignored  ✅ Remove contradictory instructions (pick one pattern)Delegation:  Batch size: 5-8 items per agent  Parallel: 2-4 agents simultaneously  Prompt: 5-step (read → verify → check → evaluate → FIX)Orchestration:  Enable: Add "Task" to agent's tools list  Depth: Keep to 2 levels max  Use: Multi-phase workflows, parallel specialistsAdvanced:  Background: Ctrl+B during agent execution  Context: 130k+ and 90+ tool calls work fine for real work  Hooks: PreToolUse, PostToolUse, Stop eventsResume agents:  > Resume agent [agentId] and continue...
```
```
cat > file << 'EOF'
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
Deep audit these 5 skills. For each:1. Read SKILL.md2. Verify versions with npm view3. Check official docs (use cloudflare-docs MCP or WebFetch)4. Score 1-105. FIX issues foundSkills: [list of 5]
```
```
Deep audit these 5 skills. For each:1. Read SKILL.md2. Verify versions with npm view3. Check official docs (use cloudflare-docs MCP or WebFetch)4. Score 1-105. FIX issues foundSkills: [list of 5]
```
In complex development environments, managing the AI's contextual understanding is paramount. This skill introduces the power of sub-agents, specialized AI entities designed to tackle specific tasks within your coding workflow. By intelligently delegating detailed operations and their associated outputs, sub-agents prevent your main AI's context window from becoming overwhelmed with transient information. This strategic approach ensures that your primary AI assistant remains focused on high-level problem-solving and critical decisions, leading to cleaner, more efficient, and ultimately more productive coding sessions. It's about smart task partitioning for superior AI performance.

# When to Use This Skill
- •Managing complex deployment workflows that involve multiple tools and verbose outputs (e.g., `git status`, `npm build`, `tsc`, `wrangler deploy`).
- •Isolating diagnostic or debugging sessions where intermediate logs and verbose outputs would clutter the main context.
- •Performing detailed code analysis or large-scale refactoring tasks where a sub-agent can manage granular details and report a concise summary.
- •Orchestrating multi-step integrations or API interactions, keeping the verbose handshake and response data contained.

# Pro Tips
- 💡Identify repetitive, verbose tasks in your workflow and containerize them within a sub-agent to keep your main prompt clean and focused.
- 💡Design sub-agents with narrow, specific responsibilities and clear summary output expectations to maximize the context hygiene benefit.
- 💡Regularly review sub-agent summaries to ensure they provide sufficient information without needing to dive into the full agent context, optimizing your workflow efficiency.

