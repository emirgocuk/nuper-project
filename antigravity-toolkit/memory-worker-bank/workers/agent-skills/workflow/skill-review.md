# skill-review
Source: https://antigravity.codes/agent-skills/workflow/skill-review

## AI Worker Instructions
When the user requests functionality related to skill-review, follow these guidelines and utilize this context.

## Scraped Content

# skill-review
```
/review-skill <skill-name>
```
```
./scripts/check-versions.sh
```
```
./scripts/review-skill.sh
```
```
d1Adapter
```
```
'better-auth/adapters/d1'
```
```
drizzleAdapter
```
```
'better-auth/adapters/drizzle'
```
```
~/.claude/skills/../planning/SKILL_REVIEW_PROCESS.md
```
```
planning/SKILL_REVIEW_PROCESS.md
```
```
scripts/review-skill.sh
```
```
commands/review-skill.md
```
```
~/.claude/commands/
```
```
references/audit-report-template.md
```
Ensuring the reliability and efficiency of your AI coding assistants is paramount for seamless development. The Skill Review Agent Skill provides a robust, systematic framework for auditing and validating the capabilities of other AI agent skills. Designed to identify outdated patterns, critical issues, and dependency conflicts, this skill empowers developers to maintain high-quality, up-to-date toolsets. It helps in proactively spotting vulnerabilities and ensuring that your AI agents leverage the latest APIs and best practices, thereby safeguarding your coding workflow and improving overall productivity.

# When to Use This Skill
- •Auditing a newly developed AI agent skill before its initial deployment or public release.
- •Regularly checking existing agent skills for outdated patterns, API changes, security vulnerabilities, or performance bottlenecks.
- •Troubleshooting unexpected behavior or errors in an AI agent skill by systematically verifying its dependencies, code examples, and consistency.
- •Ensuring cross-file consistency and adherence to coding standards and best practices across a suite of AI agent skills.

# Pro Tips
- 💡Integrate the automated review scripts (e.g., `./scripts/review-skill`) into your CI/CD pipeline to continuously monitor skill health and catch issues early.
- 💡Prioritize fixes based on the 'Severity' categorization (Critical, High, Medium, Low), focusing first on security vulnerabilities and breaking changes that impact core functionality.
- 💡Leverage the 'Auto-fix unambiguous' feature for efficient resolution of minor issues, but always perform a human review for architectural or design-related changes.

