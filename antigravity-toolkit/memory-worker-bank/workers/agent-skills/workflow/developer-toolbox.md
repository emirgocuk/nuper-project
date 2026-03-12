# developer-toolbox
Source: https://antigravity.codes/agent-skills/workflow/developer-toolbox

## AI Worker Instructions
When the user requests functionality related to developer-toolbox, follow these guidelines and utilize this context.

## Scraped Content

# developer-toolbox
```
# Via marketplace/plugin install developer-toolbox# Or local development/plugin install ./skills/developer-toolbox
```
```
# Via marketplace/plugin install developer-toolbox# Or local development/plugin install ./skills/developer-toolbox
```
```
"Help me write a commit message for these staged changes"
```
```
"Help me write a commit message for these staged changes"
```
```
"My changes aren't appearing in production, verify the build output"
```
```
"My changes aren't appearing in production, verify the build output"
```
```
"Review this authentication code for security vulnerabilities"
```
```
"Review this authentication code for security vulnerabilities"
```
```
"I'm getting TypeError: Cannot read property 'map' of undefined"
```
```
"I'm getting TypeError: Cannot read property 'map' of undefined"
```
```
"Use TDD to implement this user validation function"
```
```
"Use TDD to implement this user validation function"
```
```
"Coordinate a refactor of the authentication system across 5 services"
```
```
"Coordinate a refactor of the authentication system across 5 services"
```
```
"Create comprehensive API documentation for this REST endpoint"
```
```
"Create comprehensive API documentation for this REST endpoint"
```
```
description: |  [Role] specialist. MUST BE USED when: [trigger 1], [trigger 2], [trigger 3].  Use PROACTIVELY for [broad task category].  Keywords: keyword1, keyword2, error-message-fragment
```
```
description: |  [Role] specialist. MUST BE USED when: [trigger 1], [trigger 2], [trigger 3].  Use PROACTIVELY for [broad task category].  Keywords: keyword1, keyword2, error-message-fragment
```
```
agent-first-thinking.md
```
```
# Find installed agentsls ~/.claude/plugins/cache/*/developer-toolbox/*/agents/# Or copy to user-level for customizationcp [plugin-path]/agents/code-reviewer.md ~/.claude/agents/
```
```
# Find installed agentsls ~/.claude/plugins/cache/*/developer-toolbox/*/agents/# Or copy to user-level for customizationcp [plugin-path]/agents/code-reviewer.md ~/.claude/agents/
```
```
"Review this code for security issues, then write tests for the critical paths"# → code-reviewer first, then test-runner
```
```
"Review this code for security issues, then write tests for the critical paths"# → code-reviewer first, then test-runner
```
```
"Debug this failing test, document the root cause, and commit the fix"# → debugger → documentation-expert → commit-helper
```
```
"Debug this failing test, document the root cause, and commit the fix"# → debugger → documentation-expert → commit-helper
```
```
grep
```
```
glob
```
```
Is this a single, one-off action?  YES → Do it manually  NO  → Use agents
```
```
Is this a single, one-off action?  YES → Do it manually  NO  → Use agents
```
The Developer Toolbox Skill offers a comprehensive suite of AI agents designed to streamline and elevate your daily coding practices. From automating mundane tasks like generating conventional commit messages to tackling complex challenges such as systematic debugging and multi-step project orchestration, this skill empowers developers to work smarter. Integrate these specialized agents directly into your Claude Code environment to boost productivity, ensure code quality, and maintain high development standards across all your projects.

# When to Use This Skill
- •When you need to generate a clear, conventional commit message for staged changes.
- •For systematically debugging an error by analyzing a stack trace and identifying root causes.
- •To perform a security audit or a general code quality review on your codebase.
- •When implementing a Test-Driven Development (TDD) workflow or needing to create new tests quickly.

# Pro Tips
- 💡Leverage the 'orchestrator' agent for any task involving multiple steps or complex feature implementations to ensure a structured approach.
- 💡Integrate 'agent-first-thinking' into your workflow by consciously considering if an agent can assist before diving into manual work.
- 💡Utilize specific triggers listed for each agent (e.g., 'security audit' for code-reviewer) to quickly invoke the most relevant helper.

