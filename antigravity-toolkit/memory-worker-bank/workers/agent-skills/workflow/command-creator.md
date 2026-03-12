# command-creator
Source: https://antigravity.codes/agent-skills/workflow/command-creator

## AI Worker Instructions
When the user requests functionality related to command-creator, follow these guidelines and utilize this context.

## Scraped Content

# command-creator
```
/command-name
```
```
.claude/commands/
```
```
~/.claude/commands/
```
```
---description: Brief description shown in /help (required)argument-hint: <placeholder> (optional, if command takes arguments)---# Command Title[Detailed instructions for the agent to execute autonomously]
```
```
---description: Brief description shown in /help (required)argument-hint: <placeholder> (optional, if command takes arguments)---# Command Title[Detailed instructions for the agent to execute autonomously]
```
```
git rev-parse --is-inside-work-tree 2>/dev/null
```
```
.claude/commands/
```
```
~/.claude/commands/
```
```
~/.claude/commands/
```
```
.claude/commands/
```
```
submit-stack
```
```
ensure-ci
```
```
create-from-plan
```
```
submit_stack
```
```
ensure_ci
```
```
create_from_plan
```
```
my-command.md
```
```
/my-command
```
```
/help
```
```
argument-hint: <placeholder>
```
```
<angle-brackets>
```
```
[square-brackets]
```
```
.claude/commands/[command-name].md
```
```
~/.claude/commands/[command-name].md
```
```
mkdir -p [directory-path]
```
```
mkdir -p [directory-path]
```
```
/command-name [arguments]
```
```
You can test this command by running: /command-name [arguments]
```
```
pytest
```
```
pyright
```
```
ruff
```
```
prettier
```
```
make
```
```
gt
```
```
.PLAN.md
```
Unleash the full potential of your AI coding assistant by designing custom slash commands. This powerful skill empowers you to transform repetitive tasks and complex multi-step processes into single, executable prompts. Go beyond basic interactions and build a personalized toolkit tailored precisely to your development workflow. Whether you're automating code reviews, standardizing deployment steps, or integrating specific project conventions, mastering command creation elevates your productivity. Unlock efficiency and consistency by making your AI agent a proactive partner, capable of executing sophisticated actions on demand, ensuring your projects move forward with precision and speed.

# When to Use This Skill
- •Automating a multi-step code review process, including linting, testing, and feedback generation.
- •Standardizing the creation of new project components (e.g., 'create-react-component') with predefined boilerplate.
- •Setting up agent delegation patterns for complex tasks, like 'find-and-fix-bug' where the agent iteratively refines the solution.
- •Documenting and enabling quick access to project-specific development guidelines or setup procedures.

# Pro Tips
- 💡Design commands to be atomic but composable: smaller commands can be chained together for more complex workflows, promoting reusability and maintainability.
- 💡Leverage command arguments: make your commands dynamic by accepting parameters, allowing for flexible execution without editing the command file.
- 💡Include clear '## Instructions' sections within your command markdown to guide the AI agent on its task, especially for iterative or conditional logic.

