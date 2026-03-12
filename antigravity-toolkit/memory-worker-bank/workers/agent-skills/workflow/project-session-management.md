# project-session-management
Source: https://antigravity.codes/agent-skills/workflow/project-session-management

## AI Worker Instructions
When the user requests functionality related to project-session-management, follow these guidelines and utilize this context.

## Scraped Content

# project-session-management
```
project-planning
```
```
project-planning
```
```
/wrap-session
```
```
/continue-session
```
```
/wrap-session
```
```
/continue-session
```
```
# Session State**Current Phase**: Phase 3**Current Stage**: Implementation (or Verification/Debugging)**Last Checkpoint**: abc1234 (2025-10-23)**Planning Docs**: docs/IMPLEMENTATION_PHASES.md, docs/ARCHITECTURE.md---## Phase 1: Setup ✅**Completed**: 2025-10-15 | **Checkpoint**: abc1234**Summary**: Vite + React + Tailwind v4 + D1 binding## Phase 2: Database ✅**Completed**: 2025-10-18 | **Checkpoint**: def5678**Summary**: D1 schema + migrations + seed data## Phase 3: Tasks API 🔄**Type**: API | **Started**: 2025-10-23**Spec**: docs/IMPLEMENTATION_PHASES.md#phase-3**Progress**:- [x] GET /api/tasks endpoint (commit: ghi9012)- [x] POST /api/tasks endpoint (commit: jkl3456)- [ ] PATCH /api/tasks/:id ← **CURRENT**- [ ] DELETE /api/tasks/:id- [ ] Verify all endpoints (see IMPLEMENTATION_PHASES.md for criteria)**Next Action**: Implement PATCH /api/tasks/:id in src/routes/tasks.ts:47, handle validation and ownership check**Key Files**:- src/routes/tasks.ts- src/lib/schemas.ts**Known Issues**: None## Phase 4: Task UI ⏸️**Spec**: docs/IMPLEMENTATION_PHASES.md#phase-4
```
```
# Session State**Current Phase**: Phase 3**Current Stage**: Implementation (or Verification/Debugging)**Last Checkpoint**: abc1234 (2025-10-23)**Planning Docs**: docs/IMPLEMENTATION_PHASES.md, docs/ARCHITECTURE.md---## Phase 1: Setup ✅**Completed**: 2025-10-15 | **Checkpoint**: abc1234**Summary**: Vite + React + Tailwind v4 + D1 binding## Phase 2: Database ✅**Completed**: 2025-10-18 | **Checkpoint**: def5678**Summary**: D1 schema + migrations + seed data## Phase 3: Tasks API 🔄**Type**: API | **Started**: 2025-10-23**Spec**: docs/IMPLEMENTATION_PHASES.md#phase-3**Progress**:- [x] GET /api/tasks endpoint (commit: ghi9012)- [x] POST /api/tasks endpoint (commit: jkl3456)- [ ] PATCH /api/tasks/:id ← **CURRENT**- [ ] DELETE /api/tasks/:id- [ ] Verify all endpoints (see IMPLEMENTATION_PHASES.md for criteria)**Next Action**: Implement PATCH /api/tasks/:id in src/routes/tasks.ts:47, handle validation and ownership check**Key Files**:- src/routes/tasks.ts- src/lib/schemas.ts**Known Issues**: None## Phase 4: Task UI ⏸️**Spec**: docs/IMPLEMENTATION_PHASES.md#phase-4
```
```
docs/IMPLEMENTATION_PHASES.md
```
```
docs/ARCHITECTURE.md
```
```
docs/IMPLEMENTATION_PHASES.md#phase-3
```
```
src/routes/tasks.ts
```
```
src/lib/schemas.ts
```
```
docs/IMPLEMENTATION_PHASES.md#phase-4
```
```
**Current Stage**: Verification**Verification Progress**:- [x] GET /api/tasks returns 200 ✅- [x] POST /api/tasks creates task ✅- [ ] POST with invalid data returns 400 ❌ (returns 500)**Current Issue**: Invalid data returning 500. Check src/middleware/validate.ts
```
```
**Current Stage**: Verification**Verification Progress**:- [x] GET /api/tasks returns 200 ✅- [x] POST /api/tasks creates task ✅- [ ] POST with invalid data returns 400 ❌ (returns 500)**Current Issue**: Invalid data returning 500. Check src/middleware/validate.ts
```
```
checkpoint: Phase [N] [Status] - [Brief Description]Phase: [N] - [Name]Status: [Complete/In Progress/Paused]Session: [What was accomplished this session]Files Changed:- path/to/file.ts (what changed)Next: [Concrete next action]
```
```
checkpoint: Phase [N] [Status] - [Brief Description]Phase: [N] - [Name]Status: [Complete/In Progress/Paused]Session: [What was accomplished this session]Files Changed:- path/to/file.ts (what changed)Next: [Concrete next action]
```
```
checkpoint: Phase 3 Complete - Tasks APIPhase: 3 - Tasks APIStatus: CompleteSession: Completed all CRUD endpoints and verified functionalityFiles Changed:- src/routes/tasks.ts (all CRUD operations)- src/lib/schemas.ts (task validation)Next: Phase 4 - Start building Task List UI component
```
```
checkpoint: Phase 3 Complete - Tasks APIPhase: 3 - Tasks APIStatus: CompleteSession: Completed all CRUD endpoints and verified functionalityFiles Changed:- src/routes/tasks.ts (all CRUD operations)- src/lib/schemas.ts (task validation)Next: Phase 4 - Start building Task List UI component
```
```
/wrap-session
```
```
/continue-session
```
```
project-planning
```
```
project-session-management
```
```
project-planning
```
```
[x]
```
```
<!-- ❌ Vague -->**Next Action**: Continue working on API<!-- ✅ Concrete -->**Next Action**: Implement PATCH /api/tasks/:id in src/routes/tasks.ts:47, add ownership validation
```
```
<!-- ❌ Vague -->**Next Action**: Continue working on API<!-- ✅ Concrete -->**Next Action**: Implement PATCH /api/tasks/:id in src/routes/tasks.ts:47, add ownership validation
```
```
checkpoint: Phase [N] [Status] - [Brief Description]Phase: [N] - [Phase Name]Status: [Complete/In Progress/Paused]Session: [What was accomplished]Files Changed:- path/to/file.ts (what changed)Next: [Concrete next action]
```
```
checkpoint: Phase [N] [Status] - [Brief Description]Phase: [N] - [Phase Name]Status: [Complete/In Progress/Paused]Session: [What was accomplished]Files Changed:- path/to/file.ts (what changed)Next: [Concrete next action]
```
Efficiently navigate your coding projects with this advanced AI Agent Skill designed to streamline session management. It empowers developers to maintain clear oversight of progress, distinguishing between long-term project phases and individual work sessions. By automating checkpoint creation and facilitating concrete 'next actions', this skill ensures continuity and reduces context-switching overhead, allowing you to pick up exactly where you left off. Perfect for maintaining momentum across complex development lifecycles, it transforms how you track and resume work.

# When to Use This Skill
- •Initiating a new project after `project-planning` has defined its implementation phases.
- •Resuming work on a project after a break, ensuring seamless context restoration and continuity.
- •Creating mid-phase checkpoints to record progress and define next actions before context resets or compacts.
- •Managing transitions between distinct implementation phases, such as moving from development to verification.

# Pro Tips
- 💡Always pair this skill with `project-planning` to ensure a well-defined `IMPLEMENTATION_PHASES.md` exists as a foundation.
- 💡Be highly specific and actionable when defining 'Next Action' in your `SESSION.md` to maximize clarity upon resuming work.
- 💡Leverage the automated `/wrap-session` command to consistently create Git checkpoints, providing a reliable history of your project's progress.

