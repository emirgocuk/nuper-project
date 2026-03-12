# docs-workflow
Source: https://antigravity.codes/agent-skills/documentation/docs-workflow

## AI Worker Instructions
When the user requests functionality related to docs-workflow, follow these guidelines and utilize this context.

## Scraped Content

# docs-workflow
```
/docs
```
```
/docs-init
```
```
/docs-update
```
```
/docs-claude
```
```
# In a new project directory/docs-init
```
```
# In a new project directory/docs-init
```
```
# Audit all documentation/docs-update# Or just maintain CLAUDE.md/docs-claude
```
```
# Audit all documentation/docs-update# Or just maintain CLAUDE.md/docs-claude
```
```
CLAUDE-cloudflare.md
```
```
CLAUDE-nextjs.md
```
```
CLAUDE-generic.md
```
```
docs/ARCHITECTURE.md
```
```
docs/API.md
```
```
docs/DATABASE.md
```
```
wrangler.jsonc
```
```
wrangler.toml
```
```
next.config.js
```
```
next.config.ts
```
```
package.json
```
```
/docs-init
```
```
/plan-project
```
```
IMPLEMENTATION_PHASES.md
```
```
/docs-init
```
```
/docs-claude
```
```
/docs-update
```
```
/docs-update
```
```
templates/
```
```
templates/├── CLAUDE-cloudflare.md    # Cloudflare Workers projects├── CLAUDE-nextjs.md        # Next.js projects├── CLAUDE-generic.md       # Generic projects└── README-template.md      # Standard README
```
```
templates/├── CLAUDE-cloudflare.md    # Cloudflare Workers projects├── CLAUDE-nextjs.md        # Next.js projects├── CLAUDE-generic.md       # Generic projects└── README-template.md      # Standard README
```
```
{{PROJECT_NAME}}
```
```
{{DATE}}
```
```
{{TECH_STACK}}
```
```
pnpm db:push
```
Efficient project documentation is crucial for maintainability and team collaboration. The Docs Workflow agent skill is designed to automate the lifecycle of your project's essential documents, from initial setup to ongoing maintenance. It ensures your CLAUDE.md, README.md, and core documentation directories are consistently structured, up-to-date, and aligned with your project's current state. By standardizing documentation practices, this skill frees developers to focus on coding while ensuring vital context is always available and accurate for AI assistants and human collaborators alike, significantly boosting productivity and reducing onboarding time.

# When to Use This Skill
- •Quickly set up standard documentation (CLAUDE.md, README.md, docs/) for a brand new project.
- •Regularly audit and update all project documentation to prevent staleness and broken links.
- •Automatically maintain the CLAUDE.md file to reflect the latest project overview and setup instructions.
- •Detect project type and apply appropriate documentation templates (e.g., Cloudflare Workers, Next.js).

# Pro Tips
- 💡Integrate `/docs-update` into your CI/CD pipeline as a pre-commit hook or daily cron job to ensure documentation never drifts too far from the codebase.
- 💡Customize the underlying templates for CLAUDE.md and README.md in your skill configuration to perfectly match your organization's specific documentation standards.
- 💡Combine `/docs-claude` with a separate skill that reviews code for new features or dependencies, then prompts for CLAUDE.md updates based on those changes.

