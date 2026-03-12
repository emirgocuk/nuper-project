# google-spaces-updates
Source: https://antigravity.codes/agent-skills/communication/google-spaces-updates

## AI Worker Instructions
When the user requests functionality related to google-spaces-updates, follow these guidelines and utilize this context.

## Scraped Content

# google-spaces-updates
```
/google-spaces-updates setup
```
```
.claude/settings.json
```
```
{  "project": {    "name": "my-project",    "repo": "github.com/org/my-project"  },  "team": {    "chat_webhook": "https://chat.googleapis.com/v1/spaces/SPACE_ID/messages?key=KEY&token=TOKEN",    "members": ["Deepinder", "Joshua", "Raquel"]  }}
```
```
{  "project": {    "name": "my-project",    "repo": "github.com/org/my-project"  },  "team": {    "chat_webhook": "https://chat.googleapis.com/v1/spaces/SPACE_ID/messages?key=KEY&token=TOKEN",    "members": ["Deepinder", "Joshua", "Raquel"]  }}
```
```
"Post deployment update to team""Tell the team about the new feature""Ask the team about the auth approach"
```
```
"Post deployment update to team""Tell the team about the new feature""Ask the team about the auth approach"
```
```
.claude/settings.json
```
```
cat .claude/settings.json 2>/dev/null || echo "NOT_FOUND"
```
```
cat .claude/settings.json 2>/dev/null || echo "NOT_FOUND"
```
```
templates/settings-template.json
```
```
deployment
```
```
bugfix
```
```
feature
```
```
question
```
```
custom
```
```
# Recent commits (for context)git log --oneline -3 2>/dev/null# Current branchgit branch --show-current 2>/dev/null# Changed files (if recent changes)git diff --name-only HEAD~1 2>/dev/null | head -10
```
```
# Recent commits (for context)git log --oneline -3 2>/dev/null# Current branchgit branch --show-current 2>/dev/null# Changed files (if recent changes)git diff --name-only HEAD~1 2>/dev/null | head -10
```
```
templates/
```
```
*bold*
```
```
_italic_
```
```
curl -X POST "WEBHOOK_URL" \  -H "Content-Type: application/json" \  -d '{"text": "MESSAGE_HERE"}'
```
```
curl -X POST "WEBHOOK_URL" \  -H "Content-Type: application/json" \  -d '{"text": "MESSAGE_HERE"}'
```
```
WEBHOOK_URL
```
```
.claude/settings.json
```
```
team.chat_webhook
```
```
MESSAGE_HERE
```
```
🚀 *Deployed: [PROJECT_NAME]*[WHAT_CHANGED - 1-2 sentences]• Branch: [BRANCH]• Commit: [COMMIT_HASH][• Preview: URL (if applicable)][• Production: URL (if applicable)]_Posted by [USER] via Claude Code_
```
```
🚀 *Deployed: [PROJECT_NAME]*[WHAT_CHANGED - 1-2 sentences]• Branch: [BRANCH]• Commit: [COMMIT_HASH][• Preview: URL (if applicable)][• Production: URL (if applicable)]_Posted by [USER] via Claude Code_
```
```
[BRANCH]
```
```
[COMMIT_HASH]
```
```
🐛 *Bug Fixed: [PROJECT_NAME]**Problem:* [What was broken]*Solution:* [How it was fixed]*Files:* [Key files changed][• Commit: [COMMIT_HASH]]_Please verify if you reported this issue._
```
```
🐛 *Bug Fixed: [PROJECT_NAME]**Problem:* [What was broken]*Solution:* [How it was fixed]*Files:* [Key files changed][• Commit: [COMMIT_HASH]]_Please verify if you reported this issue._
```
```
[COMMIT_HASH]
```
```
✨ *Feature Complete: [PROJECT_NAME]**[FEATURE_NAME]*[DESCRIPTION - what it does, 1-2 sentences][• Demo: URL][• Files: key files]_Ready for review/testing._
```
```
✨ *Feature Complete: [PROJECT_NAME]**[FEATURE_NAME]*[DESCRIPTION - what it does, 1-2 sentences][• Demo: URL][• Files: key files]_Ready for review/testing._
```
```
❓ *Question: [PROJECT_NAME]*[QUESTION - clear and specific]*Context:*[Relevant background - what you're working on, what you've tried]*Options considered:*1. [Option A]2. [Option B]_@[PERSON] - would appreciate your input_
```
```
❓ *Question: [PROJECT_NAME]*[QUESTION - clear and specific]*Context:*[Relevant background - what you're working on, what you've tried]*Options considered:*1. [Option A]2. [Option B]_@[PERSON] - would appreciate your input_
```
```
📢 *Update: [PROJECT_NAME]*[MESSAGE]_Posted by [USER] via Claude Code_
```
```
📢 *Update: [PROJECT_NAME]*[MESSAGE]_Posted by [USER] via Claude Code_
```
```
/google-spaces-updates setup
```
```
.claude/settings.json
```
```
.claude/
```
```
.gitignore
```
```
git push
```
```
https://chat.googleapis.com/v1/spaces/SPACE_ID/messages?key=KEY&token=TOKEN
```
```
.claude/settings.json
```
```
.gitignore
```
The skill "google-spaces-updates" empowers AI agents to seamlessly integrate with Google Chat Spaces, providing a streamlined way to keep teams informed. By automating the posting of updates directly to designated chat rooms, developers can enhance project transparency and reduce manual communication overhead. This capability is particularly valuable for agile teams, allowing for instant dissemination of critical information like deployment statuses, feature announcements, or urgent queries. It fosters a more connected development environment, ensuring all stakeholders are consistently aligned without interrupting the coding workflow.

# When to Use This Skill
- •Announcing successful code deployments or new feature releases to the development team.
- •Asking the team for quick feedback or questions regarding a specific code approach or design.
- •Notifying stakeholders about important project milestones, blockers, or critical decisions.
- •Sharing daily stand-up summaries or progress reports with the broader project team.

# Pro Tips
- 💡**Configure granular webhooks**: If different projects or teams require distinct update streams, set up separate webhooks for each Google Space to ensure messages go to the right audience.
- 💡**Automate update triggers**: Integrate this skill with CI/CD pipelines or specific git hooks to automatically post status updates upon successful merges, deployments, or test suite completions.
- 💡**Tailor message content**: Guide the AI to craft concise, informative messages by providing clear prompts that specify the type of information needed (e.g., "Post a short summary of today's progress including completed tasks and next steps").

