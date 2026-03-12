# codex
Source: https://antigravity.codes/agent-skills/ai-tools/codex

## AI Worker Instructions
When the user requests functionality related to codex, follow these guidelines and utilize this context.

## Scraped Content

# codex
```
gpt-5.2
```
```
AskUserQuestion
```
```
xhigh
```
```
high
```
```
medium
```
```
low
```
```
--sandbox read-only
```
```
-m, --model <MODEL>
```
```
--config model_reasoning_effort="<high|medium|low>"
```
```
--sandbox <read-only|workspace-write|danger-full-access>
```
```
--full-auto
```
```
-C, --cd <DIR>
```
```
--skip-git-repo-check
```
```
codex exec --skip-git-repo-check resume --last
```
```
echo "your prompt here" | codex exec --skip-git-repo-check resume --last 2>/dev/null
```
```
2>/dev/null
```
```
codex exec
```
```
read-only
```
```
--sandbox read-only 2>/dev/null
```
```
workspace-write
```
```
--sandbox workspace-write --full-auto 2>/dev/null
```
```
danger-full-access
```
```
--sandbox danger-full-access --full-auto 2>/dev/null
```
```
echo "prompt" \| codex exec --skip-git-repo-check resume --last 2>/dev/null
```
```
-C <DIR>
```
```
2>/dev/null
```
```
gpt-5.2-max
```
```
gpt-5.2
```
```
gpt-5.2-mini
```
```
gpt-5.1-thinking
```
```
xhigh
```
```
high
```
```
medium
```
```
low
```
```
codex
```
```
AskUserQuestion
```
```
codex exec resume --last
```
```
echo "new prompt" | codex exec resume --last 2>/dev/null
```
```
codex --version
```
```
codex exec
```
```
--full-auto
```
```
--sandbox danger-full-access
```
```
--skip-git-repo-check
```
```
AskUserQuestion
```
```
gpt-5.2
```
```
gpt-5.2
```
```
codex --version
```
```
/model
```
```
~/.codex/config.toml
```
Unlock the power of state-of-the-art AI for your coding workflows with the Codex agent skill. Designed for integration with tools like Claude Code and Cursor, this skill allows you to tap into advanced large language models, specifically GPT-5.2, for intricate software engineering challenges. Whether you're aiming for precise code analysis, intelligent refactoring suggestions, or robust automated editing capabilities, Codex provides a streamlined interface to enhance your development productivity and code quality. It's an essential tool for developers seeking to incorporate cutting-edge AI assistance directly into their daily coding tasks.

# When to Use This Skill
- •Automating code refactoring and optimizing existing codebases for improved performance and readability.
- •Performing deep code analysis to identify potential bugs, security vulnerabilities, or suggest architectural improvements.
- •Generating or modifying code snippets based on natural language prompts, accelerating development cycles.
- •Resuming and continuing previous AI-assisted coding sessions efficiently without re-entering context.

# Pro Tips
- 💡Always specify the reasoning effort (`xhigh`, `high`, `medium`, `low`) to balance speed and thoroughness, especially for complex or critical coding tasks.
- 💡Utilize the `--sandbox` options carefully: `read-only` for analysis, `workspace-write` for modifications, and `danger-full-access` only when absolutely necessary for untrusted or sensitive operations.
- 💡For iterative development and continuity, leverage the `resume --last` command to pick up exactly where your AI agent left off, maximizing efficiency without re-entering previous context or configurations.

