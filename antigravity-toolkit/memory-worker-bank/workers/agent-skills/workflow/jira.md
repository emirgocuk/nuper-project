# jira
Source: https://antigravity.codes/agent-skills/workflow/jira

## AI Worker Instructions
When the user requests functionality related to jira, follow these guidelines and utilize this context.

## Scraped Content

# jira
```
1. Check if jira CLI is available:   → Run: which jira   → If found: USE CLI BACKEND2. If no CLI, check for Atlassian MCP:   → Look for mcp__atlassian__* tools   → If available: USE MCP BACKEND3. If neither available:   → GUIDE USER TO SETUP
```
```
1. Check if jira CLI is available:   → Run: which jira   → If found: USE CLI BACKEND2. If no CLI, check for Atlassian MCP:   → Look for mcp__atlassian__* tools   → If available: USE MCP BACKEND3. If neither available:   → GUIDE USER TO SETUP
```
```
jira
```
```
references/commands.md
```
```
references/mcp.md
```
```
jira issue view ISSUE-KEY
```
```
jira issue list -a$(jira me)
```
```
jira issue list -a$(jira me) -s"In Progress"
```
```
jira issue create -tType -s"Summary" -b"Description"
```
```
jira issue move ISSUE-KEY "State"
```
```
jira issue assign ISSUE-KEY $(jira me)
```
```
jira issue assign ISSUE-KEY x
```
```
jira issue comment add ISSUE-KEY -b"Comment text"
```
```
jira open ISSUE-KEY
```
```
jira sprint list --state active
```
```
jira me
```
```
mcp__atlassian__searchJiraIssuesUsingJql
```
```
mcp__atlassian__getJiraIssue
```
```
mcp__atlassian__createJiraIssue
```
```
mcp__atlassian__editJiraIssue
```
```
mcp__atlassian__getTransitionsForJiraIssue
```
```
mcp__atlassian__transitionJiraIssue
```
```
mcp__atlassian__addCommentToJiraIssue
```
```
mcp__atlassian__lookupJiraAccountId
```
```
mcp__atlassian__getVisibleJiraProjects
```
```
references/mcp.md
```
```
[A-Z]+-[0-9]+
```
```
jira issue view KEY
```
```
jira open KEY
```
```
mcp__atlassian__jira_get_issue
```
```
lookupJiraAccountId
```
```
--no-input
```
```
To use Jira, you need one of:1. **jira CLI** (recommended):   https://github.com/ankitpokhrel/jira-cli   Install: brew install ankitpokhrel/jira-cli/jira-cli   Setup:   jira init2. **Atlassian MCP**:   Configure in your MCP settings with Atlassian credentials.
```
```
To use Jira, you need one of:1. **jira CLI** (recommended):   https://github.com/ankitpokhrel/jira-cli   Install: brew install ankitpokhrel/jira-cli/jira-cli   Setup:   jira init2. **Atlassian MCP**:   Configure in your MCP settings with Atlassian credentials.
```
```
jira issue view KEY
```
```
/tmp
```
```
references/commands.md
```
```
references/mcp.md
```
The Jira Agent Skill transforms your coding environment into a powerful Jira command center. Seamlessly interact with your project management system using natural language, whether you're creating new tasks, updating existing issues, or tracking sprint progress. This skill intelligently detects your Jira backend (CLI or Atlassian MCP) and provides quick access to common commands, ensuring you stay focused on coding while keeping your project board updated. Streamline your workflow, reduce context switching, and enhance collaboration by managing all your Jira needs directly within your AI assistant, making project management more integrated and efficient.

# When to Use This Skill
- •Quickly create a bug report from a code comment.
- •View all issues assigned to you in the current sprint.
- •Transition a Jira issue to 'Done' after merging a pull request.
- •Check the status of a specific project ticket mentioned in a code review.

# Pro Tips
- 💡Configure your Jira CLI or Atlassian MCP tools beforehand for instant access to full functionality.
- 💡Combine this skill with a `git` skill to automatically link commits or branches to Jira issues.
- 💡Use issue key patterns like 'PROJ-123' directly in your prompts for specific issue actions.

