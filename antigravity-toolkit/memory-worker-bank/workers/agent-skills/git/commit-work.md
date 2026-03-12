# commit-work
Source: https://antigravity.codes/agent-skills/git/commit-work

## AI Worker Instructions
When the user requests functionality related to commit-work, follow these guidelines and utilize this context.

## Scraped Content

# commit-work
```
git status
```
```
git diff
```
```
git diff --stat
```
```
git add -p
```
```
git restore --staged -p
```
```
git restore --staged <path>
```
```
git diff --cached
```
```
type(scope): short summary
```
```
git commit -v
```
```
references/commit-message-template.md
```
```
git diff --cached
```
Crafting impeccable git commits is a cornerstone of professional software development, ensuring maintainable codebases and streamlined collaboration. The 'commit-work' AI Agent Skill empowers developers to elevate their version control practices. It systematically guides you through the process of preparing changes, organizing them into logical commits, and articulating their purpose with clear, standardized messages. By embracing this skill, you'll not only enhance the readability of your project history but also significantly simplify code reviews, making your contributions safer to integrate and easier for your team to understand and build upon.

# When to Use This Skill
- •When you have multiple unrelated changes in your working directory and need to commit them separately into logical units.
- •When you've completed a feature or bug fix and need to create a professional, clear, and Conventional Commit message.
- •When preparing a pull request and you want to ensure your commit history is clean, atomic, and easy for reviewers to follow.
- •When you need assistance using advanced git staging commands like `git add -p` to selectively commit parts of a file.

# Pro Tips
- 💡Always use `git diff --cached` to review exactly what will be committed, ensuring no unintended changes or sensitive information slips into your repository.
- 💡Leverage patch staging (`git add -p`) extensively when changes are mixed within files. This allows for creating highly atomic commits that are much easier to revert or cherry-pick.
- 💡Beyond just adhering to Conventional Commits, consider adding a brief 'why' in your commit body. Explaining the reasoning behind a change significantly enhances future understanding and debugging.

