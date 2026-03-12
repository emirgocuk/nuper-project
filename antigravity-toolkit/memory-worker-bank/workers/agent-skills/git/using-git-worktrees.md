# using-git-worktrees
Source: https://antigravity.codes/agent-skills/git/using-git-worktrees

## AI Worker Instructions
When the user requests functionality related to using-git-worktrees, follow these guidelines and utilize this context.

## Scraped Content

# using-git-worktrees
```
# Check in priority orderls -d .worktrees 2>/dev/null     # Preferred (hidden)ls -d worktrees 2>/dev/null      # Alternative
```
```
# Check in priority orderls -d .worktrees 2>/dev/null     # Preferred (hidden)ls -d worktrees 2>/dev/null      # Alternative
```
```
.worktrees
```
```
grep -i "worktree.*director" CLAUDE.md 2>/dev/null
```
```
grep -i "worktree.*director" CLAUDE.md 2>/dev/null
```
```
No worktree directory found. Where should I create worktrees?1. .worktrees/ (project-local, hidden)2. ~/.config/superpowers/worktrees/<project-name>/ (global location)Which would you prefer?
```
```
No worktree directory found. Where should I create worktrees?1. .worktrees/ (project-local, hidden)2. ~/.config/superpowers/worktrees/<project-name>/ (global location)Which would you prefer?
```
```
# Check if directory is ignored (respects local, global, and system gitignore)git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```
```
# Check if directory is ignored (respects local, global, and system gitignore)git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```
```
project=$(basename "$(git rev-parse --show-toplevel)")
```
```
project=$(basename "$(git rev-parse --show-toplevel)")
```
```
# Determine full pathcase $LOCATION in  .worktrees|worktrees)    path="$LOCATION/$BRANCH_NAME"    ;;  ~/.config/superpowers/worktrees/*)    path="~/.config/superpowers/worktrees/$project/$BRANCH_NAME"    ;;esac# Create worktree with new branchgit worktree add "$path" -b "$BRANCH_NAME"cd "$path"
```
```
# Determine full pathcase $LOCATION in  .worktrees|worktrees)    path="$LOCATION/$BRANCH_NAME"    ;;  ~/.config/superpowers/worktrees/*)    path="~/.config/superpowers/worktrees/$project/$BRANCH_NAME"    ;;esac# Create worktree with new branchgit worktree add "$path" -b "$BRANCH_NAME"cd "$path"
```
```
# Node.jsif [ -f package.json ]; then npm install; fi# Rustif [ -f Cargo.toml ]; then cargo build; fi# Pythonif [ -f requirements.txt ]; then pip install -r requirements.txt; fiif [ -f pyproject.toml ]; then poetry install; fi# Goif [ -f go.mod ]; then go mod download; fi
```
```
# Node.jsif [ -f package.json ]; then npm install; fi# Rustif [ -f Cargo.toml ]; then cargo build; fi# Pythonif [ -f requirements.txt ]; then pip install -r requirements.txt; fiif [ -f pyproject.toml ]; then poetry install; fi# Goif [ -f go.mod ]; then go mod download; fi
```
```
# Examples - use project-appropriate commandnpm testcargo testpytestgo test ./...
```
```
# Examples - use project-appropriate commandnpm testcargo testpytestgo test ./...
```
```
Worktree ready at <full-path>Tests passing (<N> tests, 0 failures)Ready to implement <feature-name>
```
```
Worktree ready at <full-path>Tests passing (<N> tests, 0 failures)Ready to implement <feature-name>
```
```
.worktrees/
```
```
worktrees/
```
```
.worktrees/
```
```
git check-ignore
```
```
You: I'm using the using-git-worktrees skill to set up an isolated workspace.[Check .worktrees/ - exists][Verify ignored - git check-ignore confirms .worktrees/ is ignored][Create worktree: git worktree add .worktrees/auth -b feature/auth][Run npm install][Run npm test - 47 passing]Worktree ready at /Users/jesse/myproject/.worktrees/authTests passing (47 tests, 0 failures)Ready to implement auth feature
```
```
You: I'm using the using-git-worktrees skill to set up an isolated workspace.[Check .worktrees/ - exists][Verify ignored - git check-ignore confirms .worktrees/ is ignored][Create worktree: git worktree add .worktrees/auth -b feature/auth][Run npm install][Run npm test - 47 passing]Worktree ready at /Users/jesse/myproject/.worktrees/authTests passing (47 tests, 0 failures)Ready to implement auth feature
```
The 'using-git-worktrees' skill empowers AI coding assistants to intelligently manage your development environments. It streamlines the creation of isolated Git worktrees, enabling you to tackle multiple tasks concurrently without the headache of stashing or frequent branch switching. This skill prioritizes a systematic approach to directory selection and includes robust safety checks, guaranteeing a reliable and predictable setup every time. Ideal for developers seeking to boost productivity and maintain a clean, organized project structure, it ensures your main workspace remains undisturbed while you explore new features or address urgent fixes in parallel.

# When to Use This Skill
- •Starting a new feature branch that requires a clean, isolated environment to avoid conflicts with ongoing work.
- •Working on a critical hotfix that needs to be developed and tested in parallel with existing feature development.
- •Experimenting with a new library or architectural change without committing to the main branch or complex manual setup.
- •Preparing for a code review while simultaneously continuing development on a separate task.

# Pro Tips
- 💡Always specify your preferred worktree directory in `CLAUDE.md` (e.g., `.worktrees/`) to ensure consistent, automatic setup and avoid prompts.
- 💡Leverage worktrees for short-lived experiments or spike solutions; it's easier to discard an entire worktree than to clean up a cluttered main repository.
- 💡Combine worktrees with task management tools to keep track of which worktree corresponds to which specific task or bug fix.

