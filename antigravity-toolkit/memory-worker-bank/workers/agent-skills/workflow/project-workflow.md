# project-workflow
Source: https://antigravity.codes/agent-skills/workflow/project-workflow

## AI Worker Instructions
When the user requests functionality related to project-workflow, follow these guidelines and utilize this context.

## Scraped Content

# project-workflow
```
/plugin install project-workflow@claude-skills
```
```
commands/*.md
```
```
~/.claude/commands/
```
```
/explore-idea
```
```
/plan-project
```
```
/plan-feature
```
```
/wrap-session
```
```
/continue-session
```
```
/workflow
```
```
/release
```
```
/brief
```
```
docs/brief-[slug].md
```
```
/reflect
```
```
EXPLORATION PHASE/explore-idea (optional)    ↓    Creates PROJECT_BRIEF.md    ↓PLANNING PHASE/plan-project (reads PROJECT_BRIEF.md if exists)    ↓    Creates IMPLEMENTATION_PHASES.md + SESSION.md    ↓EXECUTION PHASEWork on phases    ↓/wrap-session (when context full)    ↓    Updates SESSION.md, git checkpoint    ↓/continue-session (new session)    ↓    Loads SESSION.md, continues work    ↓/plan-feature (when need new features)    ↓    Adds phases to IMPLEMENTATION_PHASES.md    ↓Continue wrap → resume cycle    ↓CONTEXT PRESERVATION/brief (before clearing context)    ↓    Creates docs/brief-[slug].md    ↓/reflect (capture learnings)    ↓    Routes knowledge to rules, docs, CLAUDE.md    ↓RELEASE PHASE/release (when ready to publish)    ↓    Safety checks → GitHub releaseHELPER/workflow (anytime)    ↓    Interactive guidance
```
```
EXPLORATION PHASE/explore-idea (optional)    ↓    Creates PROJECT_BRIEF.md    ↓PLANNING PHASE/plan-project (reads PROJECT_BRIEF.md if exists)    ↓    Creates IMPLEMENTATION_PHASES.md + SESSION.md    ↓EXECUTION PHASEWork on phases    ↓/wrap-session (when context full)    ↓    Updates SESSION.md, git checkpoint    ↓/continue-session (new session)    ↓    Loads SESSION.md, continues work    ↓/plan-feature (when need new features)    ↓    Adds phases to IMPLEMENTATION_PHASES.md    ↓Continue wrap → resume cycle    ↓CONTEXT PRESERVATION/brief (before clearing context)    ↓    Creates docs/brief-[slug].md    ↓/reflect (capture learnings)    ↓    Routes knowledge to rules, docs, CLAUDE.md    ↓RELEASE PHASE/release (when ready to publish)    ↓    Safety checks → GitHub releaseHELPER/workflow (anytime)    ↓    Interactive guidance
```
```
/explore-idea
```
```
/plan-project
```
```
/plan-feature
```
```
/wrap-session
```
```
/continue-session
```
```
/workflow
```
```
/release
```
```
/brief
```
```
/reflect
```
```
git init
```
```
/brief
```
```
/reflect
```
```
/reflect
```
The Project Workflow Agent Skill is an indispensable suite designed to empower developers and teams with unparalleled efficiency in managing software projects. By integrating a comprehensive set of slash commands, this skill transforms the iterative process of bringing ideas to life, from initial concept exploration through to final deployment. It ensures continuity, context preservation, and structured execution across every phase, enabling users to significantly reduce manual overhead and focus on core development tasks. This skill acts as a central orchestrator, guiding you through complex project lifecycles with intelligent automation and structured outputs.

# When to Use This Skill
- •Starting a new software project from a rough idea and needing a validated tech stack and scope.
- •Streamlining the initial planning phase for projects with clear requirements, generating essential documentation.
- •Adding new features to an existing project, ensuring proper integration with existing session and implementation plans.
- •Managing development sessions and preserving context across multiple interactions and project phases.

# Pro Tips
- 💡Always initiate with `/explore-idea` when faced with ambiguous concepts to effectively validate ideas and refine project scope before committing to detailed planning.
- 💡Leverage the generated `SESSION.md` and `IMPLEMENTATION_PHASES.md` as living documents. Update them regularly to maintain continuity and context throughout your project's lifecycle.
- 💡Integrate the outputs from planning commands (e.g., `DATABASE_SCHEMA.md`, `API_ENDPOINTS.md`) directly into your version control system to foster team collaboration and maintain a single source of truth.

