# writing-skills
Source: https://antigravity.codes/agent-skills/documentation/writing-skills

## AI Worker Instructions
When the user requests functionality related to writing-skills, follow these guidelines and utilize this context.

## Scraped Content

# writing-skills
```
~/.claude/skills
```
```
~/.codex/skills
```
```
skills/  skill-name/    SKILL.md              # Main reference (required)    supporting-file.*     # Only if needed
```
```
skills/  skill-name/    SKILL.md              # Main reference (required)    supporting-file.*     # Only if needed
```
```
name
```
```
description
```
```
name
```
```
description
```
```
---name: Skill-Name-With-Hyphensdescription: Use when [specific triggering conditions and symptoms]---# Skill Name## OverviewWhat is this? Core principle in 1-2 sentences.## When to Use[Small inline flowchart IF decision non-obvious]Bullet list with SYMPTOMS and use casesWhen NOT to use## Core Pattern (for techniques/patterns)Before/after code comparison## Quick ReferenceTable or bullets for scanning common operations## ImplementationInline code for simple patternsLink to file for heavy reference or reusable tools## Common MistakesWhat goes wrong + fixes## Real-World Impact (optional)Concrete results
```
```
---name: Skill-Name-With-Hyphensdescription: Use when [specific triggering conditions and symptoms]---# Skill Name## OverviewWhat is this? Core principle in 1-2 sentences.## When to Use[Small inline flowchart IF decision non-obvious]Bullet list with SYMPTOMS and use casesWhen NOT to use## Core Pattern (for techniques/patterns)Before/after code comparison## Quick ReferenceTable or bullets for scanning common operations## ImplementationInline code for simple patternsLink to file for heavy reference or reusable tools## Common MistakesWhat goes wrong + fixes## Real-World Impact (optional)Concrete results
```
```
# ❌ BAD: Summarizes workflow - Claude may follow this instead of reading skilldescription: Use when executing plans - dispatches subagent per task with code review between tasks# ❌ BAD: Too much process detaildescription: Use for TDD - write test first, watch it fail, write minimal code, refactor# ✅ GOOD: Just triggering conditions, no workflow summarydescription: Use when executing implementation plans with independent tasks in the current session# ✅ GOOD: Triggering conditions onlydescription: Use when implementing any feature or bugfix, before writing implementation code
```
```
# ❌ BAD: Summarizes workflow - Claude may follow this instead of reading skilldescription: Use when executing plans - dispatches subagent per task with code review between tasks# ❌ BAD: Too much process detaildescription: Use for TDD - write test first, watch it fail, write minimal code, refactor# ✅ GOOD: Just triggering conditions, no workflow summarydescription: Use when executing implementation plans with independent tasks in the current session# ✅ GOOD: Triggering conditions onlydescription: Use when implementing any feature or bugfix, before writing implementation code
```
```
# ❌ BAD: Too abstract, vague, doesn't include when to usedescription: For async testing# ❌ BAD: First persondescription: I can help you with async tests when they're flaky# ❌ BAD: Mentions technology but skill isn't specific to itdescription: Use when tests use setTimeout/sleep and are flaky# ✅ GOOD: Starts with "Use when", describes problem, no workflowdescription: Use when tests have race conditions, timing dependencies, or pass/fail inconsistently# ✅ GOOD: Technology-specific skill with explicit triggerdescription: Use when using React Router and handling authentication redirects
```
```
# ❌ BAD: Too abstract, vague, doesn't include when to usedescription: For async testing# ❌ BAD: First persondescription: I can help you with async tests when they're flaky# ❌ BAD: Mentions technology but skill isn't specific to itdescription: Use when tests use setTimeout/sleep and are flaky# ✅ GOOD: Starts with "Use when", describes problem, no workflowdescription: Use when tests have race conditions, timing dependencies, or pass/fail inconsistently# ✅ GOOD: Technology-specific skill with explicit triggerdescription: Use when using React Router and handling authentication redirects
```
```
creating-skills
```
```
skill-creation
```
```
condition-based-waiting
```
```
async-test-helpers
```
```
# ❌ BAD: Document all flags in SKILL.mdsearch-conversations supports --text, --both, --after DATE, --before DATE, --limit N# ✅ GOOD: Reference --helpsearch-conversations supports multiple modes and filters. Run --help for details.
```
```
# ❌ BAD: Document all flags in SKILL.mdsearch-conversations supports --text, --both, --after DATE, --before DATE, --limit N# ✅ GOOD: Reference --helpsearch-conversations supports multiple modes and filters. Run --help for details.
```
```
# ❌ BAD: Repeat workflow detailsWhen searching, dispatch subagent with template...[20 lines of repeated instructions]# ✅ GOOD: Reference other skillAlways use subagents (50-100x context savings). REQUIRED: Use [other-skill-name] for workflow.
```
```
# ❌ BAD: Repeat workflow detailsWhen searching, dispatch subagent with template...[20 lines of repeated instructions]# ✅ GOOD: Reference other skillAlways use subagents (50-100x context savings). REQUIRED: Use [other-skill-name] for workflow.
```
```
# ❌ BAD: Verbose example (42 words)your human partner: "How did we handle authentication errors in React Router before?"You: I'll search past conversations for React Router authentication patterns.[Dispatch subagent with search query: "React Router authentication error handling 401"]# ✅ GOOD: Minimal example (20 words)Partner: "How did we handle auth errors in React Router?"You: Searching...[Dispatch subagent → synthesis]
```
```
# ❌ BAD: Verbose example (42 words)your human partner: "How did we handle authentication errors in React Router before?"You: I'll search past conversations for React Router authentication patterns.[Dispatch subagent with search query: "React Router authentication error handling 401"]# ✅ GOOD: Minimal example (20 words)Partner: "How did we handle auth errors in React Router?"You: Searching...[Dispatch subagent → synthesis]
```
```
wc -w skills/path/SKILL.md# getting-started workflows: aim for <150 each# Other frequently-loaded: aim for <200 total
```
```
wc -w skills/path/SKILL.md# getting-started workflows: aim for <150 each# Other frequently-loaded: aim for <200 total
```
```
condition-based-waiting
```
```
async-test-helpers
```
```
using-skills
```
```
skill-usage
```
```
flatten-with-flags
```
```
data-structure-refactoring
```
```
root-cause-tracing
```
```
debugging-techniques
```
```
creating-skills
```
```
testing-skills
```
```
debugging-with-logs
```
```
**REQUIRED SUB-SKILL:** Use superpowers:test-driven-development
```
```
**REQUIRED BACKGROUND:** You MUST understand superpowers:systematic-debugging
```
```
See skills/testing/test-driven-development
```
```
@skills/testing/test-driven-development/SKILL.md
```
```
@
```
```
digraph when_flowchart {    "Need to show information?" [shape=diamond];    "Decision where I might go wrong?" [shape=diamond];    "Use markdown" [shape=box];    "Small inline flowchart" [shape=box];    "Need to show information?" -> "Decision where I might go wrong?" [label="yes"];    "Decision where I might go wrong?" -> "Small inline flowchart" [label="yes"];    "Decision where I might go wrong?" -> "Use markdown" [label="no"];}
```
```
digraph when_flowchart {    "Need to show information?" [shape=diamond];    "Decision where I might go wrong?" [shape=diamond];    "Use markdown" [shape=box];    "Small inline flowchart" [shape=box];    "Need to show information?" -> "Decision where I might go wrong?" [label="yes"];    "Decision where I might go wrong?" -> "Small inline flowchart" [label="yes"];    "Decision where I might go wrong?" -> "Use markdown" [label="no"];}
```
```
render-graphs.js
```
```
./render-graphs.js ../some-skill           # Each diagram separately./render-graphs.js ../some-skill --combine # All diagrams in one SVG
```
```
./render-graphs.js ../some-skill           # Each diagram separately./render-graphs.js ../some-skill --combine # All diagrams in one SVG
```
```
defense-in-depth/  SKILL.md    # Everything inline
```
```
defense-in-depth/  SKILL.md    # Everything inline
```
```
condition-based-waiting/  SKILL.md    # Overview + patterns  example.ts  # Working helpers to adapt
```
```
condition-based-waiting/  SKILL.md    # Overview + patterns  example.ts  # Working helpers to adapt
```
```
pptx/  SKILL.md       # Overview + workflows  pptxgenjs.md   # 600 lines API reference  ooxml.md       # 500 lines XML structure  scripts/       # Executable tools
```
```
pptx/  SKILL.md       # Overview + workflows  pptxgenjs.md   # 600 lines API reference  ooxml.md       # 500 lines XML structure  scripts/       # Executable tools
```
```
NO SKILL WITHOUT A FAILING TEST FIRST
```
```
NO SKILL WITHOUT A FAILING TEST FIRST
```
```
Write code before test? Delete it.
```
```
Write code before test? Delete it.
```
```
Write code before test? Delete it. Start over.**No exceptions:**- Don't keep it as "reference"- Don't "adapt" it while writing tests- Don't look at it- Delete means delete
```
```
Write code before test? Delete it. Start over.**No exceptions:**- Don't keep it as "reference"- Don't "adapt" it while writing tests- Don't look at it- Delete means delete
```
```
**Violating the letter of the rules is violating the spirit of the rules.**
```
```
**Violating the letter of the rules is violating the spirit of the rules.**
```
```
| Excuse | Reality ||--------|---------|| "Too simple to test" | Simple code breaks. Test takes 30 seconds. || "I'll test after" | Tests passing immediately prove nothing. || "Tests after achieve same goals" | Tests-after = "what does this do?" Tests-first = "what should this do?" |
```
```
| Excuse | Reality ||--------|---------|| "Too simple to test" | Simple code breaks. Test takes 30 seconds. || "I'll test after" | Tests passing immediately prove nothing. || "Tests after achieve same goals" | Tests-after = "what does this do?" Tests-first = "what should this do?" |
```
```
## Red Flags - STOP and Start Over- Code before test- "I already manually tested it"- "Tests after achieve the same purpose"- "It's about spirit not ritual"- "This is different because..."**All of these mean: Delete code. Start over with TDD.**
```
```
## Red Flags - STOP and Start Over- Code before test- "I already manually tested it"- "Tests after achieve the same purpose"- "It's about spirit not ritual"- "This is different because..."**All of these mean: Delete code. Start over with TDD.**
```
```
description: use when implementing any feature or bugfix, before writing implementation code
```
```
description: use when implementing any feature or bugfix, before writing implementation code
```
```
step1 [label="import fs"];step2 [label="read file"];
```
```
step1 [label="import fs"];step2 [label="read file"];
```
Master the art of crafting powerful AI agent skills with this comprehensive guide. This skill introduces a structured, Test-Driven Development (TDD) approach to skill authoring, ensuring your agents consistently perform as intended. By applying TDD to process documentation, you're empowered to design, test, and refine instructions that lead to predictable and compliant AI behavior. Elevate your agent's capabilities by learning to identify core behaviors, validate against failure, and iteratively build robust, reusable techniques for any AI assistant.

# When to Use This Skill
- •Developing a brand new AI agent skill from scratch for Claude Code or Cursor.
- •Refining an existing agent skill to improve its accuracy, coverage, or compliance.
- •Troubleshooting why an AI agent isn't consistently following a specific instruction.
- •Establishing best practices and a standardized methodology for a team developing multiple AI agent skills.

# Pro Tips
- 💡Always start by defining clear failure scenarios (the 'RED' state) *before* writing the skill's content to ensure you're addressing a genuine need and not just documenting assumptions.
- 💡Break down complex skills into smaller, manageable sub-skills or components, applying the TDD cycle to each part independently for easier debugging and maintenance.
- 💡Regularly review and refactor your skills, just like code, to close loopholes, adapt to new agent capabilities, or respond to evolving requirements, ensuring long-term effectiveness.

