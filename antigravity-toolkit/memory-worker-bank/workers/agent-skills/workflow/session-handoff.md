# session-handoff
Source: https://antigravity.codes/agent-skills/workflow/session-handoff

## AI Worker Instructions
When the user requests functionality related to session-handoff, follow these guidelines and utilize this context.

## Scraped Content

# session-handoff
```
python scripts/create_handoff.py [task-slug]
```
```
python scripts/create_handoff.py [task-slug]
```
```
python scripts/create_handoff.py implementing-user-auth
```
```
python scripts/create_handoff.py "auth-part-2" --continues-from 2024-01-15-auth.md
```
```
python scripts/create_handoff.py "auth-part-2" --continues-from 2024-01-15-auth.md
```
```
.claude/handoffs/
```
```
[TODO: ...]
```
```
python scripts/validate_handoff.py <handoff-file>
```
```
python scripts/validate_handoff.py <handoff-file>
```
```
[TODO: ...]
```
```
python scripts/list_handoffs.py
```
```
python scripts/list_handoffs.py
```
```
python scripts/check_staleness.py <handoff-file>
```
```
python scripts/check_staleness.py <handoff-file>
```
```
--continues-from
```
```
handoff-1.md (initial work)    ↓handoff-2.md --continues-from handoff-1.md    ↓handoff-3.md --continues-from handoff-2.md
```
```
handoff-1.md (initial work)    ↓handoff-2.md --continues-from handoff-1.md    ↓handoff-3.md --continues-from handoff-2.md
```
```
.claude/handoffs/
```
```
YYYY-MM-DD-HHMMSS-[slug].md
```
```
2024-01-15-143022-implementing-auth.md
```
```
create_handoff.py [slug] [--continues-from <file>]
```
```
list_handoffs.py [path]
```
```
validate_handoff.py <file>
```
```
check_staleness.py <file>
```
The Handoff AI Agent Skill empowers long-running coding sessions by tackling the pervasive challenge of context exhaustion. It ensures that complex, multi-stage projects can span across multiple interactions or even different AI agents without losing crucial information. By meticulously documenting the current state, progress, and next steps, this skill transforms discontinuous interactions into a cohesive workflow. It's an essential tool for developers leveraging AI assistants, providing the capability to pause, resume, and transfer intricate coding tasks with absolute clarity and efficiency, making your AI assistant truly collaborative over extended periods.

# When to Use This Skill
- •Seamlessly transfer complex debugging sessions across multiple work periods or different AI agents.
- •Archive significant project milestones, such as completing a major feature or an architectural decision, for future reference.
- •Resume intricate coding tasks exactly where you left off, even after system restarts or extended breaks.
- •Facilitate collaboration by providing comprehensive context when switching between team members or AI instances on a shared codebase.

# Pro Tips
- 💡Integrate handoff document creation with your version control system, committing the handoff alongside relevant code changes to maintain a clear historical record.
- 💡Customize the `create_handoff.py` script to automatically include project-specific details, diagnostic outputs, or links to external documentation.
- 💡Proactively initiate a handoff before requesting the AI agent to undertake a context-shifting task, such as a major refactor or starting work on an entirely new module.
- 💡Use specific, descriptive task slugs (e.g., 'implement-user-auth-part1') for handoff documents to make them easily searchable and understandable later.

