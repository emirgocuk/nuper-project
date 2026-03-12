# writing-plans
Source: https://antigravity.codes/agent-skills/workflow/writing-plans

## AI Worker Instructions
When the user requests functionality related to writing-plans, follow these guidelines and utilize this context.

## Scraped Content

# writing-plans
```
docs/plans/YYYY-MM-DD-<feature-name>.md
```
```
# [Feature Name] Implementation Plan> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.**Goal:** [One sentence describing what this builds]**Architecture:** [2-3 sentences about approach]**Tech Stack:** [Key technologies/libraries]---
```
```
# [Feature Name] Implementation Plan> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.**Goal:** [One sentence describing what this builds]**Architecture:** [2-3 sentences about approach]**Tech Stack:** [Key technologies/libraries]---
```
```
### Task N: [Component Name]**Files:**- Create: exact/path/to/file.py- Modify: exact/path/to/existing.py:123-145- Test: tests/exact/path/to/test.py**Step 1: Write the failing test**
```
```
### Task N: [Component Name]**Files:**- Create: exact/path/to/file.py- Modify: exact/path/to/existing.py:123-145- Test: tests/exact/path/to/test.py**Step 1: Write the failing test**
```
```
exact/path/to/file.py
```
```
exact/path/to/existing.py:123-145
```
```
tests/exact/path/to/test.py
```
```
**Step 2: Run test to verify it fails**Run: pytest tests/path/test.py::test_name -vExpected: FAIL with "function not defined"**Step 3: Write minimal implementation**
```
```
**Step 2: Run test to verify it fails**Run: pytest tests/path/test.py::test_name -vExpected: FAIL with "function not defined"**Step 3: Write minimal implementation**
```
```
pytest tests/path/test.py::test_name -v
```
```
**Step 4: Run test to verify it passes**Run: pytest tests/path/test.py::test_name -vExpected: PASS**Step 5: Commit**
```
```
**Step 4: Run test to verify it passes**Run: pytest tests/path/test.py::test_name -vExpected: PASS**Step 5: Commit**
```
```
pytest tests/path/test.py::test_name -v
```
```

```
```

```
```
docs/plans/<filename>.md
```
The `writing-plans` AI Agent Skill is your essential tool for transforming high-level specifications into detailed, actionable implementation strategies. Designed for coding assistants like Claude Code, this skill helps break down complex coding projects into bite-sized, manageable tasks. It ensures that every step, from initial setup to testing and documentation, is clearly articulated, making the development process smoother for any engineer, regardless of their familiarity with the codebase. Leverage this skill to foster clarity, consistency, and a structured approach to software development.

# When to Use This Skill
- •Generate a step-by-step plan for implementing a new feature based on a product specification, detailing file changes, tests, and commit points.
- •Onboard a new developer by providing a comprehensive, easy-to-follow plan for their first task, complete with codebase context and testing instructions.
- •Outline a structured approach for refactoring a legacy module, ensuring all dependencies are considered and changes are thoroughly tested.
- •Create a detailed plan for fixing a critical bug that requires touching multiple parts of the system, including verification steps.

# Pro Tips
- 💡For complex features, always use the `brainstorming` skill first to gather all requirements and potential edge cases before generating the implementation plan.
- 💡Integrate the 'Bite-Sized Task Granularity' principle diligently; ensure each step is genuinely a small, actionable item (2-5 minutes) to maintain momentum.
- 💡Regularly review the generated plans with team members to ensure alignment, catch any overlooked details, and improve the overall development strategy.

