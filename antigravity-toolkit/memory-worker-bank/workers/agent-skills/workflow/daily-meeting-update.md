# daily-meeting-update
Source: https://antigravity.codes/agent-skills/workflow/daily-meeting-update

## AI Worker Instructions
When the user requests functionality related to daily-meeting-update, follow these guidelines and utilize this context.

## Scraped Content

# daily-meeting-update
```
START  │  ▼┌─────────────────────────────────────────────────────┐│ Phase 1: DETECT & OFFER INTEGRATIONS                ││ • Check: Claude Code history? gh CLI? jira CLI?     ││ • Claude Code → Pull yesterday's session digest     ││   → User selects relevant items via multiSelect     ││ • GitHub/Jira → Ask user, pull if approved          ││ • Pull data NOW (before interview)                  │├─────────────────────────────────────────────────────┤│ Phase 2: INTERVIEW (with insights)                  ││ • Show pulled data as context                       ││ • Yesterday: "I see you merged PR #123, what else?" ││ • Today: What will you work on?                     ││ • Blockers: Anything blocking you?                  ││ • Topics: Anything to discuss at end of meeting?    │├─────────────────────────────────────────────────────┤│ Phase 3: GENERATE UPDATE                            ││ • Combine interview answers + tool data             ││ • Format as clean Markdown                          ││ • Present to user                                   │└─────────────────────────────────────────────────────┘
```
```
START  │  ▼┌─────────────────────────────────────────────────────┐│ Phase 1: DETECT & OFFER INTEGRATIONS                ││ • Check: Claude Code history? gh CLI? jira CLI?     ││ • Claude Code → Pull yesterday's session digest     ││   → User selects relevant items via multiSelect     ││ • GitHub/Jira → Ask user, pull if approved          ││ • Pull data NOW (before interview)                  │├─────────────────────────────────────────────────────┤│ Phase 2: INTERVIEW (with insights)                  ││ • Show pulled data as context                       ││ • Yesterday: "I see you merged PR #123, what else?" ││ • Today: What will you work on?                     ││ • Blockers: Anything blocking you?                  ││ • Topics: Anything to discuss at end of meeting?    │├─────────────────────────────────────────────────────┤│ Phase 3: GENERATE UPDATE                            ││ • Combine interview answers + tool data             ││ • Format as clean Markdown                          ││ • Present to user                                   │└─────────────────────────────────────────────────────┘
```
```
~/.claude/projects
```
```
.jsonl
```
```
gh auth status
```
```
jira
```
```
mcp__atlassian__*
```
```
AskUserQuestionTool
```
```
HAS_GH
```
```
HAS_GIT
```
```
"I detected you have GitHub/Git configured. Want me to pull your recent activity (commits, PRs, reviews)?"Options:- "Yes, pull the info"- "No, I'll provide everything manually"
```
```
"I detected you have GitHub/Git configured. Want me to pull your recent activity (commits, PRs, reviews)?"Options:- "Yes, pull the info"- "No, I'll provide everything manually"
```
```
"Which repositories/projects should I check?"Options:- "Just the current directory" (if in a git repo)- "I'll list the repos" → user provides list
```
```
"Which repositories/projects should I check?"Options:- "Just the current directory" (if in a git repo)- "I'll list the repos" → user provides list
```
```
HAS_JIRA_CLI
```
```
HAS_ATLASSIAN_MCP
```
```
"I detected you have Jira configured. Want me to pull your tickets?"Options:- "Yes, pull my tickets"- "No, I'll provide everything manually"
```
```
"I detected you have Jira configured. Want me to pull your tickets?"Options:- "Yes, pull my tickets"- "No, I'll provide everything manually"
```
```
ls ~/.claude/projects/*/*.jsonl 2>/dev/null | head -1
```
```
ls ~/.claude/projects/*/*.jsonl 2>/dev/null | head -1
```
```
"I can also pull your Claude Code session history from yesterday. This can help recall work that isn't in git/Jira (research, debugging, planning). Want me to check?"Options:- "Yes, pull my Claude Code sessions"- "No, I have everything I need"
```
```
"I can also pull your Claude Code session history from yesterday. This can help recall work that isn't in git/Jira (research, debugging, planning). Want me to check?"Options:- "Yes, pull my Claude Code sessions"- "No, I have everything I need"
```
```
python3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --format json
```
```
python3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --format json
```
```
AskUserQuestionTool
```
```
multiSelect: true
```
```
"Here are your Claude Code sessions from yesterday. Select the ones relevant to your standup:"Options (multiSelect):- "Fix authentication bug (backend-api)"- "Implement OAuth flow (backend-api)"- "Update homepage styles (frontend-app)"- "Research payment providers (docs)"
```
```
"Here are your Claude Code sessions from yesterday. Select the ones relevant to your standup:"Options (multiSelect):- "Fix authentication bug (backend-api)"- "Implement OAuth flow (backend-api)"- "Update homepage styles (frontend-app)"- "Research payment providers (docs)"
```
```
~/.claude/projects
```
```
AskUserQuestionTool
```
```
"Here's what I found from your activity:- Merged PR #123: fix login timeout- 3 commits in backend-api- Reviewed PR #456 (approved)Anything else you worked on yesterday that I missed?"
```
```
"Here's what I found from your activity:- Merged PR #123: fix login timeout- 3 commits in backend-api- Reviewed PR #456 (approved)Anything else you worked on yesterday that I missed?"
```
```
"What did you work on yesterday/since the last standup?"
```
```
"What did you work on yesterday/since the last standup?"
```
```
"What will you work on today?"Options:- [Text input - user types freely]
```
```
"What will you work on today?"Options:- [Text input - user types freely]
```
```
"I see you have these tickets assigned:- PROJ-123: Implement OAuth flow (In Progress)- PROJ-456: Fix payment bug (To Do)Will you work on any of these today?"
```
```
"I see you have these tickets assigned:- PROJ-123: Implement OAuth flow (In Progress)- PROJ-456: Fix payment bug (To Do)Will you work on any of these today?"
```
```
"Do you have any blockers or impediments?"Options:- "No blockers"- "Yes, I have blockers" → follow-up for details
```
```
"Do you have any blockers or impediments?"Options:- "No blockers"- "Yes, I have blockers" → follow-up for details
```
```
"Any topic you want to bring up at the end of the daily?"Options:- "No, nothing to discuss"- "Yes" → follow-up for detailsExamples of topics:- Technical decision that needs input- Alignment with another team- Question about prioritization- Announcement or info for the team
```
```
"Any topic you want to bring up at the end of the daily?"Options:- "No, nothing to discuss"- "Yes" → follow-up for detailsExamples of topics:- Technical decision that needs input- Alignment with another team- Question about prioritization- Announcement or info for the team
```
```
# Daily Update - [DATE]## Yesterday- [Items from interview]- [Items from GitHub/Jira if pulled]## Today- [Items from interview]## Blockers- [Blockers or "No blockers"]## PRs & Reviews (if pulled from GitHub)- [PRs opened]- [PRs merged]- [Reviews done]## Jira (if pulled from Jira)- [Tickets updated]## Topics for Discussion- [Topics or "None"]---*Links:*- [PR links]- [Ticket links]
```
```
# Daily Update - [DATE]## Yesterday- [Items from interview]- [Items from GitHub/Jira if pulled]## Today- [Items from interview]## Blockers- [Blockers or "No blockers"]## PRs & Reviews (if pulled from GitHub)- [PRs opened]- [PRs merged]- [Reviews done]## Jira (if pulled from Jira)- [Tickets updated]## Topics for Discussion- [Topics or "None"]---*Links:*- [PR links]- [Ticket links]
```
```
AskUserQuestionTool
```
```
# Get yesterday's sessions as JSONpython3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --format json# Get today's sessionspython3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --date today --format json# Filter to specific projectpython3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --project ~/my-app --format json
```
```
# Get yesterday's sessions as JSONpython3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --format json# Get today's sessionspython3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --date today --format json# Filter to specific projectpython3 ~/.claude/skills/daily-meeting-update/scripts/claude_digest.py --project ~/my-app --format json
```
```
Claude: "Let's prepare your daily! I detected GitHub configured. Want me to pull your recent activity?"User: "Yes"Claude: "Which repos should I check?"User: "backend-api and frontend-app"[Claude pulls GitHub data silently]Claude: "I can also pull your Claude Code session history from yesterday. Want me to check?"User: "Yes"[Claude runs digest script, gets 5 sessions]Claude: "Here are your Claude Code sessions from yesterday. Select the ones relevant to your standup:"  ☑ Fix authentication timeout bug (backend-api)  ☑ Implement OAuth flow (backend-api)  ☐ Update personal blog (blog) - [user unchecks personal project]  ☑ Research payment providers (docs)  ☐ Debugging test failures (experiments)User: [selects 3 relevant items]Claude: "Here's what I found from your activity:- Merged PR #120: fix login timeout- Opened PR #125: feat: add OAuth flow- Reviewed PR #123 (approved), PR #456 (changes requested)- 5 commits in backend-api- [From Claude Code] Fix authentication timeout bug- [From Claude Code] Implement OAuth flow- [From Claude Code] Research payment providersAnything else you worked on yesterday that I missed?"User: "No, that covers it"Claude: "What will you work on today?"User: "Continue the OAuth feature and deploy to staging"Claude: "Any blockers?"User: "No"Claude: "Any topic to bring up at the end of the daily?"User: "Yes, I want to discuss the architecture of the new payments module"[Claude generates update]
```
```
Claude: "Let's prepare your daily! I detected GitHub configured. Want me to pull your recent activity?"User: "Yes"Claude: "Which repos should I check?"User: "backend-api and frontend-app"[Claude pulls GitHub data silently]Claude: "I can also pull your Claude Code session history from yesterday. Want me to check?"User: "Yes"[Claude runs digest script, gets 5 sessions]Claude: "Here are your Claude Code sessions from yesterday. Select the ones relevant to your standup:"  ☑ Fix authentication timeout bug (backend-api)  ☑ Implement OAuth flow (backend-api)  ☐ Update personal blog (blog) - [user unchecks personal project]  ☑ Research payment providers (docs)  ☐ Debugging test failures (experiments)User: [selects 3 relevant items]Claude: "Here's what I found from your activity:- Merged PR #120: fix login timeout- Opened PR #125: feat: add OAuth flow- Reviewed PR #123 (approved), PR #456 (changes requested)- 5 commits in backend-api- [From Claude Code] Fix authentication timeout bug- [From Claude Code] Implement OAuth flow- [From Claude Code] Research payment providersAnything else you worked on yesterday that I missed?"User: "No, that covers it"Claude: "What will you work on today?"User: "Continue the OAuth feature and deploy to staging"Claude: "Any blockers?"User: "No"Claude: "Any topic to bring up at the end of the daily?"User: "Yes, I want to discuss the architecture of the new payments module"[Claude generates update]
```
```
# Daily Update - 2026-01-22## Yesterday- Worked on authentication feature- Research on payment providers- Merged PR #120 (fix: login timeout)- Opened PR #125 (feat: add OAuth flow)## Today- Continue OAuth feature- Deploy to staging## Blockers- No blockers## PRs & Reviews- **Opened:** PR #125 - feat: add OAuth flow- **Merged:** PR #120 - fix: login timeout- **Reviews:** PR #123 (approved), PR #456 (changes requested)## Topics for Discussion- Architecture of the new payments module---*Links:*- https://github.com/org/repo/pull/125- https://github.com/org/repo/pull/120
```
```
# Daily Update - 2026-01-22## Yesterday- Worked on authentication feature- Research on payment providers- Merged PR #120 (fix: login timeout)- Opened PR #125 (feat: add OAuth flow)## Today- Continue OAuth feature- Deploy to staging## Blockers- No blockers## PRs & Reviews- **Opened:** PR #125 - feat: add OAuth flow- **Merged:** PR #120 - fix: login timeout- **Reviews:** PR #123 (approved), PR #456 (changes requested)## Topics for Discussion- Architecture of the new payments module---*Links:*- https://github.com/org/repo/pull/125- https://github.com/org/repo/pull/120
```
Streamline your daily standup or team sync preparation with an intelligent AI assistant. This skill takes the manual effort out of recalling yesterday's accomplishments and planning today's tasks. By seamlessly integrating with your development tools, it provides a structured interview process, ensuring all critical updates—from completed tasks to potential blockers—are captured and presented in a clear, concise Markdown format. Enhance team communication and efficiency, allowing you to focus on coding rather than administrative overhead.

# When to Use This Skill
- •Generating a daily standup update for your team meeting.
- •Quickly preparing a personal status report for your lead or project manager.
- •Recapping your work from the previous day and outlining plans for today.
- •Facilitating a structured team sync to discuss progress and blockers.

# Pro Tips
- 💡Ensure your GitHub and Jira CLIs are configured for seamless data retrieval, minimizing manual input.
- 💡Review the pulled data from Claude Code history carefully during the interview to select the most relevant items.
- 💡Be specific about blockers and discussion topics during the interview to generate the most actionable update for your team.

