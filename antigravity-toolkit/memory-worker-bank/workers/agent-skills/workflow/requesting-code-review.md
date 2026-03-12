# requesting-code-review
Source: https://antigravity.codes/agent-skills/workflow/requesting-code-review

## AI Worker Instructions
When the user requests functionality related to requesting-code-review, follow these guidelines and utilize this context.

## Scraped Content

# requesting-code-review
```
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/mainHEAD_SHA=$(git rev-parse HEAD)
```
```
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/mainHEAD_SHA=$(git rev-parse HEAD)
```
```
code-reviewer.md
```
```
{WHAT_WAS_IMPLEMENTED}
```
```
{PLAN_OR_REQUIREMENTS}
```
```
{BASE_SHA}
```
```
{HEAD_SHA}
```
```
{DESCRIPTION}
```
```
[Just completed Task 2: Add verification function]You: Let me request code review before proceeding.BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')HEAD_SHA=$(git rev-parse HEAD)[Dispatch superpowers:code-reviewer subagent]  WHAT_WAS_IMPLEMENTED: Verification and repair functions for conversation index  PLAN_OR_REQUIREMENTS: Task 2 from docs/plans/deployment-plan.md  BASE_SHA: a7981ec  HEAD_SHA: 3df7661  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types[Subagent returns]:  Strengths: Clean architecture, real tests  Issues:    Important: Missing progress indicators    Minor: Magic number (100) for reporting interval  Assessment: Ready to proceedYou: [Fix progress indicators][Continue to Task 3]
```
```
[Just completed Task 2: Add verification function]You: Let me request code review before proceeding.BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')HEAD_SHA=$(git rev-parse HEAD)[Dispatch superpowers:code-reviewer subagent]  WHAT_WAS_IMPLEMENTED: Verification and repair functions for conversation index  PLAN_OR_REQUIREMENTS: Task 2 from docs/plans/deployment-plan.md  BASE_SHA: a7981ec  HEAD_SHA: 3df7661  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types[Subagent returns]:  Strengths: Clean architecture, real tests  Issues:    Important: Missing progress indicators    Minor: Magic number (100) for reporting interval  Assessment: Ready to proceedYou: [Fix progress indicators][Continue to Task 3]
```
Leverage the 'Requesting Code Review' skill to integrate crucial quality gates into your AI-assisted coding process. This skill empowers your agent to systematically seek feedback on its work, ensuring adherence to project standards and early issue detection. By formalizing the review request, you proactively manage code quality, foster collaborative development, and prevent critical errors from propagating. It's an essential practice for robust software delivery, transforming how AI agents contribute to high-stakes coding projects, making development cycles more reliable and efficient for you and your team.

# When to Use This Skill
- •After completing a major feature, ensuring it meets all functional and non-functional requirements before integration.
- •Before merging a development branch to the main codebase, to catch any last-minute issues and maintain overall code quality.
- •When an AI agent is stuck on a complex problem or implementation, requesting a review can provide a fresh perspective or unblock progress.
- •Following a significant refactoring effort, to verify that existing functionality remains intact and performance is not degraded.

# Pro Tips
- 💡Always provide clear and concise context in the `{DESCRIPTION}` placeholder, explaining the 'why' behind the changes, not just the 'what'.
- 💡Utilize the `BASE_SHA` and `HEAD_SHA` effectively to define a precise review scope, especially when making incremental changes to a larger feature.
- 💡Don't hesitate to initiate reviews even for small, self-contained changes; embracing the 'review early, review often' principle minimizes technical debt over time.

