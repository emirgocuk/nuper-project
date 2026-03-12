# finishing-a-development-branch
Source: https://antigravity.codes/agent-skills/workflow/finishing-a-development-branch

## AI Worker Instructions
When the user requests functionality related to finishing-a-development-branch, follow these guidelines and utilize this context.

## Scraped Content

# finishing-a-development-branch
```
# Run project's test suitenpm test / cargo test / pytest / go test ./...
```
```
# Run project's test suitenpm test / cargo test / pytest / go test ./...
```
```
Tests failing (<N> failures). Must fix before completing:[Show failures]Cannot proceed with merge/PR until tests pass.
```
```
Tests failing (<N> failures). Must fix before completing:[Show failures]Cannot proceed with merge/PR until tests pass.
```
```
# Try common base branchesgit merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```
```
# Try common base branchesgit merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```
```
Implementation complete. What would you like to do?1. Merge back to <base-branch> locally2. Push and create a Pull Request3. Keep the branch as-is (I'll handle it later)4. Discard this workWhich option?
```
```
Implementation complete. What would you like to do?1. Merge back to <base-branch> locally2. Push and create a Pull Request3. Keep the branch as-is (I'll handle it later)4. Discard this workWhich option?
```
```
# Switch to base branchgit checkout <base-branch># Pull latestgit pull# Merge feature branchgit merge <feature-branch># Verify tests on merged result<test command># If tests passgit branch -d <feature-branch>
```
```
# Switch to base branchgit checkout <base-branch># Pull latestgit pull# Merge feature branchgit merge <feature-branch># Verify tests on merged result<test command># If tests passgit branch -d <feature-branch>
```
```
# Push branchgit push -u origin <feature-branch># Create PRgh pr create --title "<title>" --body "$(cat <<'EOF'## Summary<2-3 bullets of what changed>## Test Plan- [ ] <verification steps>EOF)"
```
```
# Push branchgit push -u origin <feature-branch># Create PRgh pr create --title "<title>" --body "$(cat <<'EOF'## Summary<2-3 bullets of what changed>## Test Plan- [ ] <verification steps>EOF)"
```
```
This will permanently delete:- Branch <name>- All commits: <commit-list>- Worktree at <path>Type 'discard' to confirm.
```
```
This will permanently delete:- Branch <name>- All commits: <commit-list>- Worktree at <path>Type 'discard' to confirm.
```
```
git checkout <base-branch>git branch -D <feature-branch>
```
```
git checkout <base-branch>git branch -D <feature-branch>
```
```
git worktree list | grep $(git branch --show-current)
```
```
git worktree list | grep $(git branch --show-current)
```
```
git worktree remove <worktree-path>
```
```
git worktree remove <worktree-path>
```
Navigating the final steps of a development branch, from testing to merging or creating a pull request, can be a repetitive yet critical process. This Agent Skill is engineered to automate and guide you through the culmination of your coding efforts. It ensures all prerequisites, like passing tests, are met before presenting clear, actionable options for integrating your work. By providing a structured approach to branch completion, it not only saves time but also enforces best practices, helping you maintain a clean and efficient repository. Leverage this skill to confidently wrap up your features and fixes, ensuring smooth transitions into your main codebase.

# When to Use This Skill
- •When you've finished implementing a new feature or bug fix and are ready to integrate it into the main codebase.
- •After completing a coding task and needing to decide whether to merge locally, create a pull request, or clean up the branch.
- •To ensure all tests pass before any merge or PR operation, enforcing quality gates automatically.
- •When you need a guided, structured workflow for finalizing development work to prevent common integration errors.

# Pro Tips
- 💡Always review the test failures thoroughly if the skill reports them; addressing the root cause is crucial before proceeding.
- 💡Before executing a merge, use the 'Keep the branch as-is' option to perform a manual final review or seek peer feedback if the project requires it.
- 💡Familiarize yourself with your project's specific branch naming conventions and base branches to answer any prompts accurately, ensuring correct integration paths.

