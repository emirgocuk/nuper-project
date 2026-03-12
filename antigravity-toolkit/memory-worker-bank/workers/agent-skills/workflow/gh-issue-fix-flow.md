# gh-issue-fix-flow
Source: https://antigravity.codes/agent-skills/workflow/gh-issue-fix-flow

## AI Worker Instructions
When the user requests functionality related to gh-issue-fix-flow, follow these guidelines and utilize this context.

## Scraped Content

# gh-issue-fix-flow
```
gh issue view <id> --repo <owner/repo> --comments
```
```
gh repo view --json nameWithOwner
```
```
rg -n
```
```
sed -n
```
```
rg -n
```
```
mcp__XcodeBuildMCP__session-set-defaults
```
```
mcp__XcodeBuildMCP__build_macos
```
```
mcp__XcodeBuildMCP__build_sim
```
```
mcp__XcodeBuildMCP__test_sim
```
```
git status --short
```
```
Fix … (closes #<issue>)
```
```
git push
```
This powerful AI Agent skill provides a structured, end-to-end approach to resolving GitHub issues directly from your coding assistant. It guides you through the entire lifecycle, from understanding the issue's context using `gh` commands, efficiently locating the relevant code, and implementing precise fixes, to validating your changes through robust build and test processes. By integrating seamlessly with tools like `XcodeBuildMCP` and standard Git operations, this skill ensures a disciplined and thorough workflow. It empowers developers to tackle bug fixes and enhancements with confidence, ensuring high-quality contributions and a streamlined path to deployment.

# When to Use This Skill
- •Resolving a reported bug by taking a GitHub issue ID and navigating the fix process.
- •Implementing a small feature enhancement directly linked to an open issue.
- •Automating the standard fix-build-test-commit-push cycle for maintainers.
- •When asked to fix an issue and perform all necessary steps, including local validation.

# Pro Tips
- 💡Before starting, ensure your local `gh` CLI is authenticated and configured for the target repository.
- 💡Prioritize adding minimal, focused tests specifically for the bug fix or new behavior.
- 💡Use the `gh pr create --issue <id>` command after pushing your fix to automatically link your branch to the issue.

