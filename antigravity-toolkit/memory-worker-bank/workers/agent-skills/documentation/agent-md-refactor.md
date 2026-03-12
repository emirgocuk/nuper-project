# agent-md-refactor
Source: https://antigravity.codes/agent-skills/documentation/agent-md-refactor

## AI Worker Instructions
When the user requests functionality related to agent-md-refactor, follow these guidelines and utilize this context.

## Scraped Content

# agent-md-refactor
```
## Contradiction Found**Instruction A:** [quote]**Instruction B:** [quote]**Question:** Which should take precedence, or should both be conditional?
```
```
## Contradiction Found**Instruction A:** [quote]**Instruction B:** [quote]**Question:** Which should take precedence, or should both be conditional?
```
```
typescript.md
```
```
testing.md
```
```
code-style.md
```
```
git-workflow.md
```
```
architecture.md
```
```
api-design.md
```
```
security.md
```
```
performance.md
```
```
{topic}.md
```
```
project-root/├── CLAUDE.md (or AGENTS.md)     # Minimal root with links└── .claude/                      # Or docs/agent-instructions/    ├── typescript.md    ├── testing.md    ├── code-style.md    ├── git-workflow.md    └── architecture.md
```
```
project-root/├── CLAUDE.md (or AGENTS.md)     # Minimal root with links└── .claude/                      # Or docs/agent-instructions/    ├── typescript.md    ├── testing.md    ├── code-style.md    ├── git-workflow.md    └── architecture.md
```
```
# Project NameOne-sentence description of the project.## Quick Reference- **Package Manager:** pnpm- **Build:** pnpm build- **Test:** pnpm test- **Typecheck:** pnpm typecheck## Detailed InstructionsFor specific guidelines, see:- [TypeScript Conventions](.claude/typescript.md)- [Testing Guidelines](.claude/testing.md)- [Code Style](.claude/code-style.md)- [Git Workflow](.claude/git-workflow.md)- [Architecture Patterns](.claude/architecture.md)
```
```
# Project NameOne-sentence description of the project.## Quick Reference- **Package Manager:** pnpm- **Build:** pnpm build- **Test:** pnpm test- **Typecheck:** pnpm typecheck## Detailed InstructionsFor specific guidelines, see:- [TypeScript Conventions](.claude/typescript.md)- [Testing Guidelines](.claude/testing.md)- [Code Style](.claude/code-style.md)- [Git Workflow](.claude/git-workflow.md)- [Architecture Patterns](.claude/architecture.md)
```
```
pnpm build
```
```
pnpm test
```
```
pnpm typecheck
```
```
# {Topic} Guidelines## OverviewBrief context for when these guidelines apply.## Rules### Rule Category 1- Specific, actionable instruction- Another specific instruction### Rule Category 2- Specific, actionable instruction## Examples### Good\\\typescript// Example of correct pattern\\\### Avoid\\\typescript// Example of what not to do\\\
```
```
# {Topic} Guidelines## OverviewBrief context for when these guidelines apply.## Rules### Rule Category 1- Specific, actionable instruction- Another specific instruction### Rule Category 2- Specific, actionable instruction## Examples### Good\\\typescript// Example of correct pattern\\\### Avoid\\\typescript// Example of what not to do\\\
```
```
\
```
```
typescript// Example of correct pattern\
```
```
\
```
```
\
```
```
typescript// Example of what not to do\
```
```
\
```
```
## Flagged for Deletion| Instruction | Reason ||-------------|--------|| "Write clean, maintainable code" | Too vague to be actionable || "Use TypeScript" | Redundant - project is already TS || "Don't commit secrets" | Agent already knows this || "Follow best practices" | Meaningless without specifics |
```
```
## Flagged for Deletion| Instruction | Reason ||-------------|--------|| "Write clean, maintainable code" | Too vague to be actionable || "Use TypeScript" | Redundant - project is already TS || "Don't commit secrets" | Agent already knows this || "Follow best practices" | Meaningless without specifics |
```
```
[ ] Phase 1: All contradictions identified and resolved[ ] Phase 2: Root file contains ONLY essentials[ ] Phase 3: All remaining instructions categorized[ ] Phase 4: File structure created with proper links[ ] Phase 5: Redundant/vague instructions removed[ ] Verify: Each linked file is self-contained[ ] Verify: Root file is under 50 lines[ ] Verify: All links work correctly
```
```
[ ] Phase 1: All contradictions identified and resolved[ ] Phase 2: Root file contains ONLY essentials[ ] Phase 3: All remaining instructions categorized[ ] Phase 4: File structure created with proper links[ ] Phase 5: Redundant/vague instructions removed[ ] Verify: Each linked file is self-contained[ ] Verify: Root file is under 50 lines[ ] Verify: All links work correctly
```
```
# CLAUDE.mdThis is a React project.## Code Style- Use 2 spaces- Use semicolons- Prefer const over let- Use arrow functions... (200 more lines)## Testing- Use Jest- Coverage > 80%... (100 more lines)## TypeScript- Enable strict mode... (150 more lines)
```
```
# CLAUDE.mdThis is a React project.## Code Style- Use 2 spaces- Use semicolons- Prefer const over let- Use arrow functions... (200 more lines)## Testing- Use Jest- Coverage > 80%... (100 more lines)## TypeScript- Enable strict mode... (150 more lines)
```
```
# CLAUDE.mdReact dashboard for real-time analytics visualization.## Commands- pnpm dev - Start development server- pnpm test - Run tests with coverage- pnpm build - Production build## Guidelines- [Code Style](.claude/code-style.md)- [Testing](.claude/testing.md)- [TypeScript](.claude/typescript.md)
```
```
# CLAUDE.mdReact dashboard for real-time analytics visualization.## Commands- pnpm dev - Start development server- pnpm test - Run tests with coverage- pnpm build - Production build## Guidelines- [Code Style](.claude/code-style.md)- [Testing](.claude/testing.md)- [TypeScript](.claude/typescript.md)
```
```
pnpm dev
```
```
pnpm test
```
```
pnpm build
```
In the evolving landscape of AI-driven development, maintaining clear and concise agent instructions is paramount for optimal performance and effortless collaboration. Over time, these critical files can become unwieldy, hindering effective agent behavior and developer understanding. This specialized Agent Skill addresses that challenge head-on by meticulously restructuring verbose instruction sets into a logically organized, progressively disclosed format. It ensures that essential directives are immediately accessible while supplementary details are neatly categorized and linked, transforming complex configurations into highly manageable and intuitive documentation.

# When to Use This Skill
- •When your AGENTS.md or CLAUDE.md file has grown excessively long and difficult to navigate.
- •To improve the readability and maintainability of AI agent configuration documentation.
- •When you need to enforce a progressive disclosure pattern for agent instructions, keeping core info upfront.
- •To resolve conflicting or redundant instructions within your agent's documentation.

# Pro Tips
- 💡Before initiating the refactor, back up your original instruction file to easily revert if needed.
- 💡Review the proposed categories and file structure carefully, customizing them to best fit your agent's specific needs and workflow.
- 💡After refactoring, test your AI agent's behavior thoroughly to ensure all instructions are still correctly interpreted and followed in the new structure.

