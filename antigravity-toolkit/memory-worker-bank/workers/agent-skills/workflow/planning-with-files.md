# planning-with-files
Source: https://antigravity.codes/agent-skills/workflow/planning-with-files

## AI Worker Instructions
When the user requests functionality related to planning-with-files, follow these guidelines and utilize this context.

## Scraped Content

# planning-with-files
```
# Linux/macOS$(command -v python3 || command -v python) ${CLAUDE_PLUGIN_ROOT}/scripts/session-catchup.py "$(pwd)"
```
```
# Linux/macOS$(command -v python3 || command -v python) ${CLAUDE_PLUGIN_ROOT}/scripts/session-catchup.py "$(pwd)"
```
```
# Windows PowerShell& (Get-Command python -ErrorAction SilentlyContinue).Source "$env:USERPROFILE\.claude\skills\planning-with-files\scripts\session-catchup.py" (Get-Location)
```
```
# Windows PowerShell& (Get-Command python -ErrorAction SilentlyContinue).Source "$env:USERPROFILE\.claude\skills\planning-with-files\scripts\session-catchup.py" (Get-Location)
```
```
git diff --stat
```
```
${CLAUDE_PLUGIN_ROOT}/templates/
```
```
${CLAUDE_PLUGIN_ROOT}/
```
```
task_plan.md
```
```
findings.md
```
```
progress.md
```
```
task_plan.md
```
```
findings.md
```
```
progress.md
```
```
Context Window = RAM (volatile, limited)Filesystem = Disk (persistent, unlimited)→ Anything important gets written to disk.
```
```
Context Window = RAM (volatile, limited)Filesystem = Disk (persistent, unlimited)→ Anything important gets written to disk.
```
```
task_plan.md
```
```
findings.md
```
```
progress.md
```
```
task_plan.md
```
```
in_progress
```
```
complete
```
```
## Errors Encountered| Error | Attempt | Resolution ||-------|---------|------------|| FileNotFoundError | 1 | Created default config || API timeout | 2 | Added retry logic |
```
```
## Errors Encountered| Error | Attempt | Resolution ||-------|---------|------------|| FileNotFoundError | 1 | Created default config || API timeout | 2 | Added retry logic |
```
```
if action_failed:    next_action != same_action
```
```
if action_failed:    next_action != same_action
```
```
ATTEMPT 1: Diagnose & Fix  → Read error carefully  → Identify root cause  → Apply targeted fixATTEMPT 2: Alternative Approach  → Same error? Try different method  → Different tool? Different library?  → NEVER repeat exact same failing actionATTEMPT 3: Broader Rethink  → Question assumptions  → Search for solutions  → Consider updating the planAFTER 3 FAILURES: Escalate to User  → Explain what you tried  → Share the specific error  → Ask for guidance
```
```
ATTEMPT 1: Diagnose & Fix  → Read error carefully  → Identify root cause  → Apply targeted fixATTEMPT 2: Alternative Approach  → Same error? Try different method  → Different tool? Different library?  → NEVER repeat exact same failing actionATTEMPT 3: Broader Rethink  → Question assumptions  → Search for solutions  → Consider updating the planAFTER 3 FAILURES: Escalate to User  → Explain what you tried  → Share the specific error  → Ask for guidance
```
```
scripts/init-session.sh
```
```
scripts/check-complete.sh
```
```
scripts/session-catchup.py
```
Navigating intricate coding challenges demands a structured approach beyond typical conversational boundaries. The Planning-with-Files Agent Skill transforms your AI coding assistant into a meticulous project manager, leveraging a unique file-based methodology. By externalizing your thought process into `task_plan.md`, `findings.md`, and `progress.md`, this skill ensures persistent context and clarity across demanding multi-step projects. It fosters a robust, auditable, and recoverable workflow, especially for extensive research or multiple tool interactions, allowing you to pick up exactly where you left off.

# When to Use This Skill
- •Initiating complex software development projects that require a phased approach and iterative refinement.
- •Conducting thorough technical research, where tracking progress, findings, and next steps is crucial.
- •Debugging large codebases that involve multiple diagnostic steps and potential file modifications.
- •Managing tasks that predictably require more than five tool calls, ensuring the AI maintains context throughout.

# Pro Tips
- 💡Regularly commit your planning files (`task_plan.md`, `findings.md`, `progress.md`) to version control alongside your code. This creates an auditable trail of your AI's reasoning and progress, invaluable for team collaboration or revisiting old projects.
- 💡Before executing any significant changes, review the generated `task_plan.md` carefully. Treat it as a contract with your AI, modifying it to align perfectly with your expectations and constraints. This pre-planning step minimizes costly re-dos.
- 💡Leverage the session recovery feature by running the `session-catchup.py` script proactively after any unexpected disconnect or `/clear`. This ensures no valuable context or in-progress work is lost, allowing for seamless continuation.

