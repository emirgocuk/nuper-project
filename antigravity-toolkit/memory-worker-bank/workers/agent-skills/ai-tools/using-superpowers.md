# using-superpowers
Source: https://antigravity.codes/agent-skills/ai-tools/using-superpowers

## AI Worker Instructions
When the user requests functionality related to using-superpowers, follow these guidelines and utilize this context.

## Scraped Content

# using-superpowers
```
Skill
```
```
digraph skill_flow {    "User message received" [shape=doublecircle];    "Might any skill apply?" [shape=diamond];    "Invoke Skill tool" [shape=box];    "Announce: 'Using [skill] to [purpose]'" [shape=box];    "Has checklist?" [shape=diamond];    "Create TodoWrite todo per item" [shape=box];    "Follow skill exactly" [shape=box];    "Respond (including clarifications)" [shape=doublecircle];    "User message received" -> "Might any skill apply?";    "Might any skill apply?" -> "Invoke Skill tool" [label="yes, even 1%"];    "Might any skill apply?" -> "Respond (including clarifications)" [label="definitely not"];    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";    "Announce: 'Using [skill] to [purpose]'" -> "Has checklist?";    "Has checklist?" -> "Create TodoWrite todo per item" [label="yes"];    "Has checklist?" -> "Follow skill exactly" [label="no"];    "Create TodoWrite todo per item" -> "Follow skill exactly";}
```
```
digraph skill_flow {    "User message received" [shape=doublecircle];    "Might any skill apply?" [shape=diamond];    "Invoke Skill tool" [shape=box];    "Announce: 'Using [skill] to [purpose]'" [shape=box];    "Has checklist?" [shape=diamond];    "Create TodoWrite todo per item" [shape=box];    "Follow skill exactly" [shape=box];    "Respond (including clarifications)" [shape=doublecircle];    "User message received" -> "Might any skill apply?";    "Might any skill apply?" -> "Invoke Skill tool" [label="yes, even 1%"];    "Might any skill apply?" -> "Respond (including clarifications)" [label="definitely not"];    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";    "Announce: 'Using [skill] to [purpose]'" -> "Has checklist?";    "Has checklist?" -> "Create TodoWrite todo per item" [label="yes"];    "Has checklist?" -> "Follow skill exactly" [label="no"];    "Create TodoWrite todo per item" -> "Follow skill exactly";}
```
Unlock the full potential of your AI coding assistant by mastering the fundamental 'using-superpowers' skill. This foundational guide is not just another instruction set; it's the bedrock for all your interactions, ensuring you consistently tap into specialized knowledge precisely when needed. It establishes the critical protocol for skill invocation, transforming your assistant from a general-purpose tool into a highly targeted, efficient problem-solver. Embrace this meta-skill to guarantee seamless integration of all other capabilities, making your development workflow smoother and significantly more powerful.

# When to Use This Skill
- •When initiating any new conversation or task with your AI coding assistant.
- •If you suspect a specialized skill might enhance the AI's response or action, even with slight uncertainty.
- •During the onboarding process for a new AI instance or a new user interacting with the assistant.
- •When the AI seems to be providing generic responses and you need it to leverage its specific tools.

# Pro Tips
- 💡Always invoke this 'superpowers' skill at the very beginning of any new interaction or task to establish the critical framework for skill usage.
- 💡Treat the '1% chance' rule as a mandatory diagnostic check for every user prompt; it's better to invoke and find a skill unnecessary than to miss a critical resource.
- 💡Familiarize yourself with the skill invocation mechanism in your specific environment (e.g., `Skill` tool in Claude Code) to ensure seamless and immediate application.

