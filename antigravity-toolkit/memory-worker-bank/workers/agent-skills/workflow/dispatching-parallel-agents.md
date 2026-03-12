# dispatching-parallel-agents
Source: https://antigravity.codes/agent-skills/workflow/dispatching-parallel-agents

## AI Worker Instructions
When the user requests functionality related to dispatching-parallel-agents, follow these guidelines and utilize this context.

## Scraped Content

# dispatching-parallel-agents
```
digraph when_to_use {    "Multiple failures?" [shape=diamond];    "Are they independent?" [shape=diamond];    "Single agent investigates all" [shape=box];    "One agent per problem domain" [shape=box];    "Can they work in parallel?" [shape=diamond];    "Sequential agents" [shape=box];    "Parallel dispatch" [shape=box];    "Multiple failures?" -> "Are they independent?" [label="yes"];    "Are they independent?" -> "Single agent investigates all" [label="no - related"];    "Are they independent?" -> "Can they work in parallel?" [label="yes"];    "Can they work in parallel?" -> "Parallel dispatch" [label="yes"];    "Can they work in parallel?" -> "Sequential agents" [label="no - shared state"];}
```
```
digraph when_to_use {    "Multiple failures?" [shape=diamond];    "Are they independent?" [shape=diamond];    "Single agent investigates all" [shape=box];    "One agent per problem domain" [shape=box];    "Can they work in parallel?" [shape=diamond];    "Sequential agents" [shape=box];    "Parallel dispatch" [shape=box];    "Multiple failures?" -> "Are they independent?" [label="yes"];    "Are they independent?" -> "Single agent investigates all" [label="no - related"];    "Are they independent?" -> "Can they work in parallel?" [label="yes"];    "Can they work in parallel?" -> "Parallel dispatch" [label="yes"];    "Can they work in parallel?" -> "Sequential agents" [label="no - shared state"];}
```
```
// In Claude Code / AI environmentTask("Fix agent-tool-abort.test.ts failures")Task("Fix batch-completion-behavior.test.ts failures")Task("Fix tool-approval-race-conditions.test.ts failures")// All three run concurrently
```
```
// In Claude Code / AI environmentTask("Fix agent-tool-abort.test.ts failures")Task("Fix batch-completion-behavior.test.ts failures")Task("Fix tool-approval-race-conditions.test.ts failures")// All three run concurrently
```
```
Fix the 3 failing tests in src/agents/agent-tool-abort.test.ts:1. "should abort tool with partial output capture" - expects 'interrupted at' in message2. "should handle mixed completed and aborted tools" - fast tool aborted instead of completed3. "should properly track pendingToolCount" - expects 3 results but gets 0These are timing/race condition issues. Your task:1. Read the test file and understand what each test verifies2. Identify root cause - timing issues or actual bugs?3. Fix by:   - Replacing arbitrary timeouts with event-based waiting   - Fixing bugs in abort implementation if found   - Adjusting test expectations if testing changed behaviorDo NOT just increase timeouts - find the real issue.Return: Summary of what you found and what you fixed.
```
```
Fix the 3 failing tests in src/agents/agent-tool-abort.test.ts:1. "should abort tool with partial output capture" - expects 'interrupted at' in message2. "should handle mixed completed and aborted tools" - fast tool aborted instead of completed3. "should properly track pendingToolCount" - expects 3 results but gets 0These are timing/race condition issues. Your task:1. Read the test file and understand what each test verifies2. Identify root cause - timing issues or actual bugs?3. Fix by:   - Replacing arbitrary timeouts with event-based waiting   - Fixing bugs in abort implementation if found   - Adjusting test expectations if testing changed behaviorDo NOT just increase timeouts - find the real issue.Return: Summary of what you found and what you fixed.
```
```
Agent 1 → Fix agent-tool-abort.test.tsAgent 2 → Fix batch-completion-behavior.test.tsAgent 3 → Fix tool-approval-race-conditions.test.ts
```
```
Agent 1 → Fix agent-tool-abort.test.tsAgent 2 → Fix batch-completion-behavior.test.tsAgent 3 → Fix tool-approval-race-conditions.test.ts
```
In complex development environments, encountering multiple, unrelated issues simultaneously is common. Rather than addressing each problem sequentially and waiting for one resolution before starting the next, this potent agent skill empowers your AI assistant to act on several fronts at once. By intelligently dispatching parallel agents, you can dramatically cut down investigation and resolution times for independent tasks, transforming a bottleneck into a concurrent efficiency gain. This approach is invaluable for developers seeking to maximize throughput and minimize delays in their daily coding challenges, ensuring no valuable time is wasted on independent waits.

# When to Use This Skill
- •Simultaneously debugging multiple failed unit or integration tests originating from different, unrelated modules.
- •Investigating distinct performance bottlenecks identified in separate microservices or application layers.
- •Resolving a batch of small, independent bug reports that do not share common code paths or state.
- •Analyzing independent code smell reports or minor refactoring opportunities across different, self-contained files.

# Pro Tips
- 💡**Clearly Define Independence:** Before dispatching, rigorously confirm tasks genuinely lack shared state or sequential dependencies. Incorrect identification can lead to race conditions or incomplete resolutions.
- 💡**Monitor Concurrently:** While agents work in parallel, establish a dashboard or method to monitor the progress of each independent agent to quickly identify any stalled tasks or new dependencies.
- 💡**Prioritize High-Impact Tasks:** Even with parallel processing, prioritize which independent tasks get the most robust agent resources or attention if conflicts arise, or if some resolutions unlock others indirectly.

