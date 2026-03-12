# workflow-patterns
Source: https://antigravity.codes/agent-skills/workflow/workflow-patterns

## AI Worker Instructions
When the user requests functionality related to workflow-patterns, follow these guidelines and utilize this context.

## Scraped Content

# workflow-patterns
```
[ ]
```
```
[~]
```
```
- [~] **Task 2.1**: Implement user validation
```
```
- [~] **Task 2.1**: Implement user validation
```
```
def test_validate_user_email_valid():    user = User(email="test@example.com")    assert user.validate_email() is Truedef test_validate_user_email_invalid():    user = User(email="invalid")    assert user.validate_email() is False
```
```
def test_validate_user_email_valid():    user = User(email="test@example.com")    assert user.validate_email() is Truedef test_validate_user_email_invalid():    user = User(email="invalid")    assert user.validate_email() is False
```
```
pytest --cov=module --cov-report=term-missing
```
```
pytest --cov=module --cov-report=term-missing
```
```
git add -Agit commit -m "feat(user): implement email validation- Add validate_email method to User class- Handle empty and malformed emails- Add comprehensive test coverageTask: 2.1Track: user-auth_20250115"
```
```
git add -Agit commit -m "feat(user): implement email validation- Add validate_email method to User class- Handle empty and malformed emails- Add comprehensive test coverageTask: 2.1Track: user-auth_20250115"
```
```
git notes add -m "Task 2.1: Implement user validationSummary:- Added email validation using regex pattern- Handles edge cases: empty, no @, no domain- Coverage: 94% on validation moduleFiles changed:- src/models/user.py (modified)- tests/test_user.py (modified)Decisions:- Used simple regex over email-validator library- Reason: No external dependency for basic validation"
```
```
git notes add -m "Task 2.1: Implement user validationSummary:- Added email validation using regex pattern- Handles edge cases: empty, no @, no domain- Coverage: 94% on validation moduleFiles changed:- src/models/user.py (modified)- tests/test_user.py (modified)Decisions:- Used simple regex over email-validator library- Reason: No external dependency for basic validation"
```
```
```
```
```
```
abc1234
```
```
git add conductor/tracks/*/plan.mdgit commit -m "docs: update plan - task 2.1 completeTrack: user-auth_20250115"
```
```
git add conductor/tracks/*/plan.mdgit commit -m "docs: update plan - task 2.1 completeTrack: user-auth_20250115"
```
```
git diff --name-only <last-checkpoint-sha>..HEAD
```
```
git diff --name-only <last-checkpoint-sha>..HEAD
```
```
pytest -v --tb=short
```
```
pytest -v --tb=short
```
```
## Phase 1 Verification Checklist- [ ] User can register with valid email- [ ] Invalid email shows appropriate error- [ ] Database stores user correctly- [ ] API returns expected response codes
```
```
## Phase 1 Verification Checklist- [ ] User can register with valid email- [ ] Invalid email shows appropriate error- [ ] Database stores user correctly- [ ] API returns expected response codes
```
```
Phase 1 complete. Please verify:1. [ ] Test suite passes (automated)2. [ ] Coverage meets target (automated)3. [ ] Manual verification items (requires human)Respond with 'approved' to continue, or note issues.
```
```
Phase 1 complete. Please verify:1. [ ] Test suite passes (automated)2. [ ] Coverage meets target (automated)3. [ ] Manual verification items (requires human)Respond with 'approved' to continue, or note issues.
```
```
git add -Agit commit -m "checkpoint: phase 1 complete - user-auth_20250115Verified:- All tests passing- Coverage: 87%- Manual verification approvedPhase 1 tasks:- [x] Task 1.1: Setup database schema- [x] Task 1.2: Implement user model- [x] Task 1.3: Add validation logic"
```
```
git add -Agit commit -m "checkpoint: phase 1 complete - user-auth_20250115Verified:- All tests passing- Coverage: 87%- Manual verification approvedPhase 1 tasks:- [x] Task 1.1: Setup database schema- [x] Task 1.2: Implement user model- [x] Task 1.3: Add validation logic"
```
```
## Checkpoints| Phase   | Checkpoint SHA | Date       | Status   || ------- | -------------- | ---------- | -------- || Phase 1 | def5678        | 2025-01-15 | verified || Phase 2 |                |            | pending  |
```
```
## Checkpoints| Phase   | Checkpoint SHA | Date       | Status   || ------- | -------------- | ---------- | -------- || Phase 1 | def5678        | 2025-01-15 | verified || Phase 2 |                |            | pending  |
```
```
<type>(<scope>): <subject><body><footer>
```
```
<type>(<scope>): <subject><body><footer>
```
```
feat
```
```
fix
```
```
refactor
```
```
test
```
```
docs
```
```
chore
```
```
git notes add -m "<detailed summary>"
```
```
git notes add -m "<detailed summary>"
```
```
git log --show-notes
```
```
git log --show-notes
```
```
```
```
```
```
abc1234
```
```
def5678
```
```
# Revert to end of Phase 1git revert --no-commit <phase-2-commits>...git commit -m "revert: rollback to phase 1 checkpoint"
```
```
# Revert to end of Phase 1git revert --no-commit <phase-2-commits>...git commit -m "revert: rollback to phase 1 checkpoint"
```
```
# See what changed in Phase 2git diff <phase-1-sha>..<phase-2-sha>
```
```
# See what changed in Phase 2git diff <phase-1-sha>..<phase-2-sha>
```
```
[-]
```
```
- [x] **Task 2.1**: Implement validation abc1234  - DEVIATION: Used library instead of custom code  - Reason: Better edge case handling  - Impact: Added email-validator to dependencies
```
```
- [x] **Task 2.1**: Implement validation abc1234  - DEVIATION: Used library instead of custom code  - Reason: Better edge case handling  - Impact: Added email-validator to dependencies
```
```
abc1234
```
```
[!]
```
```
RED: Write test for model creation and validationGREEN: Implement model class with fieldsREFACTOR: Add computed properties, improve types
```
```
RED: Write test for model creation and validationGREEN: Implement model class with fieldsREFACTOR: Add computed properties, improve types
```
```
RED: Write test for request/response contractGREEN: Implement endpoint handlerREFACTOR: Extract validation, improve error handling
```
```
RED: Write test for request/response contractGREEN: Implement endpoint handlerREFACTOR: Extract validation, improve error handling
```
```
RED: Write test for component interactionGREEN: Wire components togetherREFACTOR: Improve error propagation, add logging
```
```
RED: Write test for component interactionGREEN: Wire components togetherREFACTOR: Improve error propagation, add logging
```
```
RED: Add characterization tests for current behaviorGREEN: Apply refactoring (tests should stay green)REFACTOR: Clean up any introduced complexity
```
```
RED: Add characterization tests for current behaviorGREEN: Apply refactoring (tests should stay green)REFACTOR: Clean up any introduced complexity
```
```
# Test suitepytest -v --tb=short# Coveragepytest --cov=src --cov-report=term-missing# Lintingruff check src/ tests/# Type checking (if applicable)mypy src/
```
```
# Test suitepytest -v --tb=short# Coveragepytest --cov=src --cov-report=term-missing# Lintingruff check src/ tests/# Type checking (if applicable)mypy src/
```
```
## Manual Verification Steps### User Registration1. Navigate to /register2. Enter valid email: test@example.com3. Enter password meeting requirements4. Click Submit5. Verify success message appears6. Verify user appears in database### Error Handling1. Enter invalid email: "notanemail"2. Verify error message shows3. Verify form retains other entered data
```
```
## Manual Verification Steps### User Registration1. Navigate to /register2. Enter valid email: test@example.com3. Enter password meeting requirements4. Click Submit5. Verify success message appears6. Verify user appears in database### Error Handling1. Enter invalid email: "notanemail"2. Verify error message shows3. Verify form retains other entered data
```
This skill empowers AI agents to seamlessly integrate into robust development workflows, specifically those leveraging Test-Driven Development (TDD). It provides a structured approach for navigating each stage of a task, from initial selection and marking progress to the critical red-green-refactor cycle. By adhering to its guidelines, agents can ensure meticulous git commit hygiene, thorough phase checkpoint completion, and adherence to stringent verification protocols. This systematic integration dramatically enhances consistency, reduces errors, and streamlines the collaborative development process, making it an indispensable tool for maintaining project quality and velocity.

# When to Use This Skill
- •Guiding an AI agent through the full TDD red-green-refactor cycle for a new feature implementation.
- •Automating the updating of `plan.md` files to mark task status changes and progress.
- •Ensuring all required checkpoints are met and documented before a phase completion.
- •Standardizing git commit messages and practices across an agent-assisted development team.

# Pro Tips
- 💡Integrate this skill with a `code-generation` skill to fully automate the TDD cycle from task selection to passing tests and refactoring.
- 💡Use the skill's guidelines to pre-train your agent on specific nuances of your team's `plan.md` structure for optimal status updates.
- 💡Combine with a `git-linting` skill to enforce even stricter commit message and branch hygiene beyond the basics covered here.

