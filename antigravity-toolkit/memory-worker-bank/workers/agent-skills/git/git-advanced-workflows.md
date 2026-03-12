# git-advanced-workflows
Source: https://antigravity.codes/agent-skills/git/git-advanced-workflows

## AI Worker Instructions
When the user requests functionality related to git-advanced-workflows, follow these guidelines and utilize this context.

## Scraped Content

# git-advanced-workflows
```
pick
```
```
reword
```
```
edit
```
```
squash
```
```
fixup
```
```
drop
```
```
# Rebase last 5 commitsgit rebase -i HEAD~5# Rebase all commits on current branchgit rebase -i $(git merge-base HEAD main)# Rebase onto specific commitgit rebase -i abc123
```
```
# Rebase last 5 commitsgit rebase -i HEAD~5# Rebase all commits on current branchgit rebase -i $(git merge-base HEAD main)# Rebase onto specific commitgit rebase -i abc123
```
```
# Cherry-pick single commitgit cherry-pick abc123# Cherry-pick range of commits (exclusive start)git cherry-pick abc123..def456# Cherry-pick without committing (stage changes only)git cherry-pick -n abc123# Cherry-pick and edit commit messagegit cherry-pick -e abc123
```
```
# Cherry-pick single commitgit cherry-pick abc123# Cherry-pick range of commits (exclusive start)git cherry-pick abc123..def456# Cherry-pick without committing (stage changes only)git cherry-pick -n abc123# Cherry-pick and edit commit messagegit cherry-pick -e abc123
```
```
# Start bisectgit bisect start# Mark current commit as badgit bisect bad# Mark known good commitgit bisect good v1.0.0# Git will checkout middle commit - test it# Then mark as good or badgit bisect good  # or: git bisect bad# Continue until bug found# When donegit bisect reset
```
```
# Start bisectgit bisect start# Mark current commit as badgit bisect bad# Mark known good commitgit bisect good v1.0.0# Git will checkout middle commit - test it# Then mark as good or badgit bisect good  # or: git bisect bad# Continue until bug found# When donegit bisect reset
```
```
# Use script to test automaticallygit bisect start HEAD v1.0.0git bisect run ./test.sh# test.sh should exit 0 for good, 1-127 (except 125) for bad
```
```
# Use script to test automaticallygit bisect start HEAD v1.0.0git bisect run ./test.sh# test.sh should exit 0 for good, 1-127 (except 125) for bad
```
```
# List existing worktreesgit worktree list# Add new worktree for feature branchgit worktree add ../project-feature feature/new-feature# Add worktree and create new branchgit worktree add -b bugfix/urgent ../project-hotfix main# Remove worktreegit worktree remove ../project-feature# Prune stale worktreesgit worktree prune
```
```
# List existing worktreesgit worktree list# Add new worktree for feature branchgit worktree add ../project-feature feature/new-feature# Add worktree and create new branchgit worktree add -b bugfix/urgent ../project-hotfix main# Remove worktreegit worktree remove ../project-feature# Prune stale worktreesgit worktree prune
```
```
# View refloggit reflog# View reflog for specific branchgit reflog show feature/branch# Restore deleted commitgit reflog# Find commit hashgit checkout abc123git branch recovered-branch# Restore deleted branchgit refloggit branch deleted-branch abc123
```
```
# View refloggit reflog# View reflog for specific branchgit reflog show feature/branch# Restore deleted commitgit reflog# Find commit hashgit checkout abc123git branch recovered-branch# Restore deleted branchgit refloggit branch deleted-branch abc123
```
```
# Start with feature branchgit checkout feature/user-auth# Interactive rebase to clean historygit rebase -i main# Example rebase operations:# - Squash "fix typo" commits# - Reword commit messages for clarity# - Reorder commits logically# - Drop unnecessary commits# Force push cleaned branch (safe if no one else is using it)git push --force-with-lease origin feature/user-auth
```
```
# Start with feature branchgit checkout feature/user-auth# Interactive rebase to clean historygit rebase -i main# Example rebase operations:# - Squash "fix typo" commits# - Reword commit messages for clarity# - Reorder commits logically# - Drop unnecessary commits# Force push cleaned branch (safe if no one else is using it)git push --force-with-lease origin feature/user-auth
```
```
# Create fix on maingit checkout maingit commit -m "fix: critical security patch"# Apply to release branchesgit checkout release/2.0git cherry-pick abc123git checkout release/1.9git cherry-pick abc123# Handle conflicts if they arisegit cherry-pick --continue# orgit cherry-pick --abort
```
```
# Create fix on maingit checkout maingit commit -m "fix: critical security patch"# Apply to release branchesgit checkout release/2.0git cherry-pick abc123git checkout release/1.9git cherry-pick abc123# Handle conflicts if they arisegit cherry-pick --continue# orgit cherry-pick --abort
```
```
# Start bisectgit bisect startgit bisect bad HEADgit bisect good v2.1.0# Git checks out middle commit - run testsnpm test# If tests failgit bisect bad# If tests passgit bisect good# Git will automatically checkout next commit to test# Repeat until bug found# Automated versiongit bisect start HEAD v2.1.0git bisect run npm test
```
```
# Start bisectgit bisect startgit bisect bad HEADgit bisect good v2.1.0# Git checks out middle commit - run testsnpm test# If tests failgit bisect bad# If tests passgit bisect good# Git will automatically checkout next commit to test# Repeat until bug found# Automated versiongit bisect start HEAD v2.1.0git bisect run npm test
```
```
# Main project directorycd ~/projects/myapp# Create worktree for urgent bugfixgit worktree add ../myapp-hotfix hotfix/critical-bug# Work on hotfix in separate directorycd ../myapp-hotfix# Make changes, commitgit commit -m "fix: resolve critical bug"git push origin hotfix/critical-bug# Return to main work without interruptioncd ~/projects/myappgit fetch origingit cherry-pick hotfix/critical-bug# Clean up when donegit worktree remove ../myapp-hotfix
```
```
# Main project directorycd ~/projects/myapp# Create worktree for urgent bugfixgit worktree add ../myapp-hotfix hotfix/critical-bug# Work on hotfix in separate directorycd ../myapp-hotfix# Make changes, commitgit commit -m "fix: resolve critical bug"git push origin hotfix/critical-bug# Return to main work without interruptioncd ~/projects/myappgit fetch origingit cherry-pick hotfix/critical-bug# Clean up when donegit worktree remove ../myapp-hotfix
```
```
# Accidentally reset to wrong commitgit reset --hard HEAD~5  # Oh no!# Use reflog to find lost commitsgit reflog# Output shows:# abc123 HEAD@{0}: reset: moving to HEAD~5# def456 HEAD@{1}: commit: my important changes# Recover lost commitsgit reset --hard def456# Or create branch from lost commitgit branch recovery def456
```
```
# Accidentally reset to wrong commitgit reset --hard HEAD~5  # Oh no!# Use reflog to find lost commitsgit reflog# Output shows:# abc123 HEAD@{0}: reset: moving to HEAD~5# def456 HEAD@{1}: commit: my important changes# Recover lost commitsgit reset --hard def456# Or create branch from lost commitgit branch recovery def456
```
```
# Update feature branch with main changes (rebase)git checkout feature/my-featuregit fetch origingit rebase origin/main# Handle conflictsgit status# Fix conflicts in filesgit add .git rebase --continue# Or merge insteadgit merge origin/main
```
```
# Update feature branch with main changes (rebase)git checkout feature/my-featuregit fetch origingit rebase origin/main# Handle conflictsgit status# Fix conflicts in filesgit add .git rebase --continue# Or merge insteadgit merge origin/main
```
```
# Make initial commitgit commit -m "feat: add user authentication"# Later, fix something in that commit# Stage changesgit commit --fixup HEAD  # or specify commit hash# Make more changesgit commit --fixup abc123# Rebase with autosquashgit rebase -i --autosquash main# Git automatically marks fixup commits
```
```
# Make initial commitgit commit -m "feat: add user authentication"# Later, fix something in that commit# Stage changesgit commit --fixup HEAD  # or specify commit hash# Make more changesgit commit --fixup abc123# Rebase with autosquashgit rebase -i --autosquash main# Git automatically marks fixup commits
```
```
# Start interactive rebasegit rebase -i HEAD~3# Mark commit to split with 'edit'# Git will stop at that commit# Reset commit but keep changesgit reset HEAD^# Stage and commit in logical chunksgit add file1.pygit commit -m "feat: add validation"git add file2.pygit commit -m "feat: add error handling"# Continue rebasegit rebase --continue
```
```
# Start interactive rebasegit rebase -i HEAD~3# Mark commit to split with 'edit'# Git will stop at that commit# Reset commit but keep changesgit reset HEAD^# Stage and commit in logical chunksgit add file1.pygit commit -m "feat: add validation"git add file2.pygit commit -m "feat: add error handling"# Continue rebasegit rebase --continue
```
```
# Show files in commitgit show --name-only abc123# Checkout specific files from commitgit checkout abc123 -- path/to/file1.py path/to/file2.py# Stage and commitgit commit -m "cherry-pick: apply specific changes from abc123"
```
```
# Show files in commitgit show --name-only abc123# Checkout specific files from commitgit checkout abc123 -- path/to/file1.py path/to/file2.py# Stage and commitgit commit -m "cherry-pick: apply specific changes from abc123"
```
```
# Safe force pushgit push --force-with-lease origin feature/branch# Create backup before risky operationgit branch backup-branchgit rebase -i main# If something goes wronggit reset --hard backup-branch
```
```
# Safe force pushgit push --force-with-lease origin feature/branch# Create backup before risky operationgit branch backup-branchgit rebase -i main# If something goes wronggit reset --hard backup-branch
```
```
# Abort operations in progressgit rebase --abortgit merge --abortgit cherry-pick --abortgit bisect reset# Restore file to version from specific commitgit restore --source=abc123 path/to/file# Undo last commit but keep changesgit reset --soft HEAD^# Undo last commit and discard changesgit reset --hard HEAD^# Recover deleted branch (within 90 days)git refloggit branch recovered-branch abc123
```
```
# Abort operations in progressgit rebase --abortgit merge --abortgit cherry-pick --abortgit bisect reset# Restore file to version from specific commitgit restore --source=abc123 path/to/file# Undo last commit but keep changesgit reset --soft HEAD^# Undo last commit and discard changesgit reset --hard HEAD^# Recover deleted branch (within 90 days)git refloggit branch recovered-branch abc123
```
Unlock the full potential of your version control with the Git Advanced Workflows Agent Skill. This essential tool empowers AI coding assistants like Claude Code and Cursor to navigate and manipulate complex Git histories with precision. Moving beyond basic commits and pushes, this skill delves into powerful techniques such as interactive rebasing, cherry-picking, bisecting for bug identification, and leveraging reflog for recovery. Developers can harness these capabilities to maintain immaculate project histories, streamline collaborative efforts, and confidently troubleshoot any repository challenge. Elevate your Git game and ensure clean, manageable, and recoverable codebases.

# When to Use This Skill
- •Refining a pull request's commit history for a clean, understandable merge.
- •Diagnosing precisely when a bug was introduced using `git bisect` to narrow down offending commits.
- •Applying a critical hotfix commit from one development branch to another without merging entire branches.
- •Managing multiple experimental feature branches concurrently and isolatedly with `git worktree`.

# Pro Tips
- 💡Always back up your branch or create a temporary branch before performing destructive Git operations like interactive rebase.
- 💡Understand the fundamental difference between `rebase` (rewrites history) and `merge` (preserves history) to choose the right strategy for your team's workflow.
- 💡Regularly use `git reflog` to understand its power; it's your ultimate safety net for recovering seemingly lost work or correcting major mistakes.

