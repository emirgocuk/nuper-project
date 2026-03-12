# gepetto
Source: https://antigravity.codes/agent-skills/workflow/gepetto

## AI Worker Instructions
When the user requests functionality related to gepetto, follow these guidelines and utilize this context.

## Scraped Content

# gepetto
```
═══════════════════════════════════════════════════════════════GEPETTO: AI-Assisted Implementation Planning═══════════════════════════════════════════════════════════════Research → Interview → Spec Synthesis → Plan → External Review → SectionsNote: GEPETTO will write many .md files to the planning directory you pass it
```
```
═══════════════════════════════════════════════════════════════GEPETTO: AI-Assisted Implementation Planning═══════════════════════════════════════════════════════════════Research → Interview → Spec Synthesis → Plan → External Review → SectionsNote: GEPETTO will write many .md files to the planning directory you pass it
```
```
.md
```
```
.md
```
```
═══════════════════════════════════════════════════════════════GEPETTO: Spec File Required═══════════════════════════════════════════════════════════════This skill requires a markdown spec file path (must end with .md).The planning directory is inferred from the spec file's parent directory.To start a NEW plan:  1. Create a markdown spec file describing what you want to build  2. It can be as detailed or as vague as you like  3. Place it in a directory where gepetto can save planning files  4. Run: /gepetto @path/to/your-spec.mdTo RESUME an existing plan:  1. Run: /gepetto @path/to/your-spec.mdExample: /gepetto @planning/my-feature-spec.md═══════════════════════════════════════════════════════════════
```
```
═══════════════════════════════════════════════════════════════GEPETTO: Spec File Required═══════════════════════════════════════════════════════════════This skill requires a markdown spec file path (must end with .md).The planning directory is inferred from the spec file's parent directory.To start a NEW plan:  1. Create a markdown spec file describing what you want to build  2. It can be as detailed or as vague as you like  3. Place it in a directory where gepetto can save planning files  4. Run: /gepetto @path/to/your-spec.mdTo RESUME an existing plan:  1. Run: /gepetto @path/to/your-spec.mdExample: /gepetto @planning/my-feature-spec.md═══════════════════════════════════════════════════════════════
```
```
planning_dir
```
```
initial_file
```
```
claude-research.md
```
```
claude-interview.md
```
```
claude-spec.md
```
```
claude-plan.md
```
```
claude-integration-notes.md
```
```
claude-ralph-loop-prompt.md
```
```
claude-ralphy-prd.md
```
```
reviews/
```
```
sections/
```
```
Planning directory: {planning_dir}Mode: {mode}
```
```
Planning directory: {planning_dir}Mode: {mode}
```
```
Resuming from step {N}To start fresh, delete the planning directory files.
```
```
Resuming from step {N}To start fresh, delete the planning directory files.
```
```
═══════════════════════════════════════════════════════════════STEP {N}/18: {STEP_NAME}═══════════════════════════════════════════════════════════════{details}Step {N} complete: {summary}───────────────────────────────────────────────────────────────
```
```
═══════════════════════════════════════════════════════════════STEP {N}/18: {STEP_NAME}═══════════════════════════════════════════════════════════════{details}Step {N} complete: {summary}───────────────────────────────────────────────────────────────
```
```
Task(subagent_type=Explore)
```
```
Task(subagent_type=Explore)
```
```
<planning_dir>/claude-research.md
```
```
<planning_dir>/claude-interview.md
```
```
<planning_dir>/claude-spec.md
```
```
<planning_dir>/claude-plan.md
```
```
<planning_dir>/reviews/
```
```
<planning_dir>/reviews/
```
```
<planning_dir>/claude-integration-notes.md
```
```
<planning_dir>/claude-plan.md
```
```
The plan has been updated with external feedback. You can now review and edit claude-plan.md.If you want Claude's help editing the plan, open a separate Claude session - this sessionis mid-workflow and can't assist with edits until the workflow completes.When you're done reviewing, select "Done" to continue.
```
```
The plan has been updated with external feedback. You can now review and edit claude-plan.md.If you want Claude's help editing the plan, open a separate Claude session - this sessionis mid-workflow and can't assist with edits until the workflow completes.When you're done reviewing, select "Done" to continue.
```
```
claude-plan.md
```
```
<planning_dir>/sections/index.md
```
```
index.md
```
```
section-NN-<name>.md
```
```
claude-plan.md
```
```
<planning_dir>/claude-ralph-loop-prompt.md
```
```
/ralph-loop @<planning_dir>/claude-ralph-loop-prompt.md --completion-promise "COMPLETE" --max-iterations 100
```
```
/ralph-loop @<planning_dir>/claude-ralph-loop-prompt.md --completion-promise "COMPLETE" --max-iterations 100
```
```
You are implementing a feature based on a spec-forge plan.## Your MissionRead the planning documents and implement ALL sections in dependency order.## Planning Documents### Section Index (dependencies and order){EMBED: full content of sections/index.md here}### Section Files---## section-01-name.md---{EMBED: full content of section-01-name.md}---## section-02-name.md---{EMBED: full content of section-02-name.md}{... repeat for all sections ...}## Execution Rules1. Read the index.md to understand the dependency graph2. Execute sections in the correct order (respect dependencies)3. For each section:   - Implement all requirements   - Verify acceptance criteria are met   - Run any tests mentioned   - Only move to next section when current is complete4. Track progress by creating planning/PROGRESS.md with completed sections## On CompletionWhen ALL sections are implemented and verified:- Update planning/PROGRESS.md with final status- Output <promise>ALL-SECTIONS-COMPLETE</promise>If blocked on any section after multiple attempts:- Document the blocker in planning/PROGRESS.md- Output <promise>BLOCKED</promise>
```
```
You are implementing a feature based on a spec-forge plan.## Your MissionRead the planning documents and implement ALL sections in dependency order.## Planning Documents### Section Index (dependencies and order){EMBED: full content of sections/index.md here}### Section Files---## section-01-name.md---{EMBED: full content of section-01-name.md}---## section-02-name.md---{EMBED: full content of section-02-name.md}{... repeat for all sections ...}## Execution Rules1. Read the index.md to understand the dependency graph2. Execute sections in the correct order (respect dependencies)3. For each section:   - Implement all requirements   - Verify acceptance criteria are met   - Run any tests mentioned   - Only move to next section when current is complete4. Track progress by creating planning/PROGRESS.md with completed sections## On CompletionWhen ALL sections are implemented and verified:- Update planning/PROGRESS.md with final status- Output <promise>ALL-SECTIONS-COMPLETE</promise>If blocked on any section after multiple attempts:- Document the blocker in planning/PROGRESS.md- Output <promise>BLOCKED</promise>
```
```
{EMBED: ...}
```
```
<planning_dir>/claude-ralphy-prd.md
```
```
# Implementation PRDThis PRD was generated by Gepetto. Each task references a detailed section file.**Before running:** Ensure you're in the project root directory where sections/ is accessible.## How to Use
```
```
# Implementation PRDThis PRD was generated by Gepetto. Each task references a detailed section file.**Before running:** Ensure you're in the project root directory where sections/ is accessible.## How to Use
```
```
sections/
```
```
## ContextFor each task below, read the corresponding section file in sections/ for:- Background and requirements- Implementation details- Acceptance criteria- Files to create/modify## Tasks- [ ] Section 01: {section_name} - Read sections/section-01-{name}.md for details- [ ] Section 02: {section_name} - Read sections/section-02-{name}.md for details- [ ] Section 03: {section_name} - Read sections/section-03-{name}.md for details{... one task per section from the SECTION_MANIFEST ...}
```
```
## ContextFor each task below, read the corresponding section file in sections/ for:- Background and requirements- Implementation details- Acceptance criteria- Files to create/modify## Tasks- [ ] Section 01: {section_name} - Read sections/section-01-{name}.md for details- [ ] Section 02: {section_name} - Read sections/section-02-{name}.md for details- [ ] Section 03: {section_name} - Read sections/section-03-{name}.md for details{... one task per section from the SECTION_MANIFEST ...}
```
```
sections/
```
```
sections/index.md
```
```
claude-ralph-loop-prompt.md
```
```
claude-ralphy-prd.md
```
```
═══════════════════════════════════════════════════════════════GEPETTO: Planning Complete═══════════════════════════════════════════════════════════════Generated files:  - claude-research.md (research findings)  - claude-interview.md (Q&A transcript)  - claude-spec.md (synthesized specification)  - claude-plan.md (implementation plan)  - claude-integration-notes.md (feedback decisions)  - reviews/ (external LLM feedback)  - sections/ (implementation units)  - claude-ralph-loop-prompt.md (for ralph-loop plugin)  - claude-ralphy-prd.md (for Ralphy CLI)How to implement:Option A - Manual (recommended for learning/control):  1. Read sections/index.md to understand dependencies  2. Implement each section file in order  3. Each section is self-contained with acceptance criteriaOption B - Autonomous with ralph-loop (Claude Code plugin):  /ralph-loop @<planning_dir>/claude-ralph-loop-prompt.md --completion-promise "COMPLETE" --max-iterations 100Option C - Autonomous with Ralphy (external CLI):  ralphy --prd <planning_dir>/claude-ralphy-prd.md  # Or: cp <planning_dir>/claude-ralphy-prd.md ./PRD.md && ralphy═══════════════════════════════════════════════════════════════
```
```
═══════════════════════════════════════════════════════════════GEPETTO: Planning Complete═══════════════════════════════════════════════════════════════Generated files:  - claude-research.md (research findings)  - claude-interview.md (Q&A transcript)  - claude-spec.md (synthesized specification)  - claude-plan.md (implementation plan)  - claude-integration-notes.md (feedback decisions)  - reviews/ (external LLM feedback)  - sections/ (implementation units)  - claude-ralph-loop-prompt.md (for ralph-loop plugin)  - claude-ralphy-prd.md (for Ralphy CLI)How to implement:Option A - Manual (recommended for learning/control):  1. Read sections/index.md to understand dependencies  2. Implement each section file in order  3. Each section is self-contained with acceptance criteriaOption B - Autonomous with ralph-loop (Claude Code plugin):  /ralph-loop @<planning_dir>/claude-ralph-loop-prompt.md --completion-promise "COMPLETE" --max-iterations 100Option C - Autonomous with Ralphy (external CLI):  ralphy --prd <planning_dir>/claude-ralphy-prd.md  # Or: cp <planning_dir>/claude-ralphy-prd.md ./PRD.md && ralphy═══════════════════════════════════════════════════════════════
```
The Gepetto AI Agent Skill revolutionizes how development projects are initiated by providing a structured, multi-stage planning methodology. Beyond merely outlining tasks, Gepetto actively engages in research, stakeholder interviews, and meticulous specification synthesis. This robust process ensures that every feature plan is not just detailed but also thoroughly vetted through external reviews, resulting in comprehensive, sectionized implementation documents. Ideal for tackling complex features, it transforms vague ideas into actionable blueprints, significantly reducing pre-implementation ambiguity and setting a strong foundation for successful development cycles. It's an indispensable tool for engineers aiming for precision and clarity from conception to execution.

# When to Use This Skill
- •Planning a new, complex feature for an existing application.
- •Breaking down a large user story into manageable, detailed implementation steps.
- •Documenting a solution architecture and development plan for a greenfield project.
- •Obtaining stakeholder alignment on technical implementation before coding begins.

# Pro Tips
- 💡Start with a clear, concise initial `.md` spec file; Gepetto will elaborate on it.
- 💡Be prepared to review and provide feedback on the generated plan sections to refine outputs.
- 💡Utilize the external review step to involve team members or product owners for early validation.

