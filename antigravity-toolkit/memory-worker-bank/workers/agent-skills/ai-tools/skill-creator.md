# skill-creator
Source: https://antigravity.codes/agent-skills/ai-tools/skill-creator

## AI Worker Instructions
When the user requests functionality related to skill-creator, follow these guidelines and utilize this context.

## Scraped Content

# skill-creator
```
/create-skill
```
```
/create-skill my-new-skill
```
```
/create-skill my-new-skill
```
```
references/
```
```
[CUSTOMIZE]
```
```
# Too short (loses context):description: "A skill for Tailwind"  # ❌ 25 chars# Too long (wastes tokens):description: "This comprehensive skill provides detailed knowledge..."  # ❌ 500+ chars# Just right:description: |  Build modern UIs with Tailwind v4 + shadcn/ui. Covers CSS variable theming,  component installation, dark mode, and semantic color tokens.  Use when: setting up Tailwind v4, adding shadcn components, fixing theme issues,  or troubleshooting "Cannot find module" errors.
```
```
# Too short (loses context):description: "A skill for Tailwind"  # ❌ 25 chars# Too long (wastes tokens):description: "This comprehensive skill provides detailed knowledge..."  # ❌ 500+ chars# Just right:description: |  Build modern UIs with Tailwind v4 + shadcn/ui. Covers CSS variable theming,  component installation, dark mode, and semantic color tokens.  Use when: setting up Tailwind v4, adding shadcn components, fixing theme issues,  or troubleshooting "Cannot find module" errors.
```
```
# ❌ Bad: Passive, vague, no discovery keywordsdescription: |  This skill helps you with database operations. It provides patterns  for working with data and can be useful in many situations.# ✅ Good: Active, specific, discoverabledescription: |  Build type-safe database queries with Drizzle ORM and Cloudflare D1.  Covers schema definition, migrations, relations, and transaction patterns.  Use when: setting up D1 database, writing Drizzle schemas, debugging  "no such table" or "D1_ERROR" issues.
```
```
# ❌ Bad: Passive, vague, no discovery keywordsdescription: |  This skill helps you with database operations. It provides patterns  for working with data and can be useful in many situations.# ✅ Good: Active, specific, discoverabledescription: |  Build type-safe database queries with Drizzle ORM and Cloudflare D1.  Covers schema definition, migrations, relations, and transaction patterns.  Use when: setting up D1 database, writing Drizzle schemas, debugging  "no such table" or "D1_ERROR" issues.
```
```
skills/my-skill/├── SKILL.md          # Main documentation (required)└── README.md         # Auto-trigger keywords (required)
```
```
skills/my-skill/├── SKILL.md          # Main documentation (required)└── README.md         # Auto-trigger keywords (required)
```
```
skills/my-skill/├── scripts/          # Executable helpers│   └── setup.sh      # Example: automated setup script├── references/       # Extended documentation│   └── api-guide.md  # Loaded when user needs deep details└── assets/           # Templates, images    └── config.json   # Template files for output
```
```
skills/my-skill/├── scripts/          # Executable helpers│   └── setup.sh      # Example: automated setup script├── references/       # Extended documentation│   └── api-guide.md  # Loaded when user needs deep details└── assets/           # Templates, images    └── config.json   # Template files for output
```
```
---name: lowercase-hyphen-casedescription: |  [250-350 chars with "Use when:" section]---
```
```
---name: lowercase-hyphen-casedescription: |  [250-350 chars with "Use when:" section]---
```
```
---name: my-skilldescription: |  [description - max 1024 chars]allowed-tools:  - Bash  - Read  - Write---
```
```
---name: my-skilldescription: |  [description - max 1024 chars]allowed-tools:  - Bash  - Read  - Write---
```
```
allowed-tools
```
```
metadata:
```
```
keywords:
```
```
license:
```
```
processing-pdfs
```
```
# ❌ Won't be discovereddescription: "Helps with authentication"# ✅ Will be discovereddescription: |  Implement authentication with Clerk - React components, middleware,  and Cloudflare Workers integration with JWT verification.  Use when: adding auth to React apps, protecting API routes, or  troubleshooting "clerk/backend" import errors.
```
```
# ❌ Won't be discovereddescription: "Helps with authentication"# ✅ Will be discovereddescription: |  Implement authentication with Clerk - React components, middleware,  and Cloudflare Workers integration with JWT verification.  Use when: adding auth to React apps, protecting API routes, or  troubleshooting "clerk/backend" import errors.
```
```
# ❌ Claude already knows JavaScript basics## VariablesUse const for constants and let for variables...# ✅ Focus on what Claude might get wrong## Critical: Cloudflare Workers Differences- No process.env - use env parameter from fetch handler- No Node.js fs module - use R2 or KV for storage
```
```
# ❌ Claude already knows JavaScript basics## VariablesUse const for constants and let for variables...# ✅ Focus on what Claude might get wrong## Critical: Cloudflare Workers Differences- No process.env - use env parameter from fetch handler- No Node.js fs module - use R2 or KV for storage
```
```
const
```
```
let
```
```
process.env
```
```
env
```
```
fs
```
```
description: |  ...  Use when: troubleshooting "Cannot read properties of undefined",  "NEXT_REDIRECT" errors, or hydration mismatches.
```
```
description: |  ...  Use when: troubleshooting "Cannot read properties of undefined",  "NEXT_REDIRECT" errors, or hydration mismatches.
```
```
# ❌ Too rigid (breaks if API changes)Always call api.configure({ version: "2.1.0" }) first.# ✅ Flexible with rationaleConfigure the API client before making calls. The version should matchyour installed package version (check package.json).
```
```
# ❌ Too rigid (breaks if API changes)Always call api.configure({ version: "2.1.0" }) first.# ✅ Flexible with rationaleConfigure the API client before making calls. The version should matchyour installed package version (check package.json).
```
```
## Production ExampleTested in [Project Name]:- Build time: 45 seconds- Errors prevented: 6/6 documented issues- Zero runtime errors after deployment
```
```
## Production ExampleTested in [Project Name]:- Build time: 45 seconds- Errors prevented: 6/6 documented issues- Zero runtime errors after deployment
```
```
"Help me set up [technology your skill covers]"
```
```
"Help me set up [technology your skill covers]"
```
```
./scripts/check-metadata.sh <skill-name>
```
```
./scripts/check-metadata.sh <skill-name>
```
```
planning/claude-code-skill-standards.md
```
```
ONE_PAGE_CHECKLIST.md
```
```
skills/tailwind-v4-shadcn/
```
```
skills/cloudflare-d1/
```
```
# Create new skill/create-skill my-skill-name# Install skill./scripts/install-skill.sh my-skill-name# Verify metadata./scripts/check-metadata.sh my-skill-name# Check all skills./scripts/check-all-versions.sh# Generate marketplace manifest./scripts/generate-plugin-manifests.sh my-skill-name
```
```
# Create new skill/create-skill my-skill-name# Install skill./scripts/install-skill.sh my-skill-name# Verify metadata./scripts/check-metadata.sh my-skill-name# Check all skills./scripts/check-all-versions.sh# Generate marketplace manifest./scripts/generate-plugin-manifests.sh my-skill-name
```
Unlock the full potential of your AI coding assistant by mastering the art of skill creation. This comprehensive guide and tool empower you to design, scaffold, and refine custom AI agent skills tailored to specific tasks and workflows. Learn best practices for optimizing skill performance, managing context windows efficiently, and ensuring your agents are production-ready. Transform your development process by giving your AI new capabilities with precision and strategic design.

# When to Use This Skill
- •Scaffolding a new AI agent skill from a predefined template.
- •Designing the structure, instructions, and content of a new agent skill for optimal performance.
- •Applying core principles like progressive disclosure and context window management to skill development.
- •Developing production-ready skills for AI coding assistants like Claude Code and Cursor.

# Pro Tips
- 💡Prioritize brevity: Treat the AI's context window as a public good, ensuring every token in your skill is genuinely necessary and avoids duplication of existing AI knowledge.
- 💡Implement progressive disclosure: Structure your skill's information in layers (metadata, SKILL.md, resources) to load content only as needed, optimizing performance and reducing token usage.
- 💡Tailor instruction specificity: Match the level of detail in your skill's instructions to the task's complexity and error probability, using high-level text for flexibility and structured formats for precision.

